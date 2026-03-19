import type { Handler, HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { clientConfig } from "./_config/client";
import {
  generatePricingConfirmationEmailHTML,
  generatePricingConfirmationPlainText,
  getPricingConfirmationSubject,
  generatePricingNotificationEmailHTML,
  generatePricingNotificationPlainText,
  type PricingLeadData,
} from './pricing-templates';

// =============================================================================
// PRICING LEAD HANDLER - Netlify Function
// =============================================================================
// POST /api/pricing-lead  (routes via /api/* → /.netlify/functions/:splat)
//
// Receives calculator output + base64 PDF from the HypeLead pricing page,
// validates the payload, stores the lead in Netlify Blobs, emails the PDF
// to the user via Resend, and sends a plain-HTML team notification.
//
// Security measures:
//   - CORS locked to the configured site URL
//   - Honeypot field (silent 200, no storage)
//   - Timing check  (< 3 s → silent 200, no storage)
//   - Rate limit: 3 req / hour / IP  (separate "pricing-ratelimit" store)
//   - Input validation + HTML-tag stripping on free-text fields
//   - PDF magic-bytes (%PDF) + %%EOF trailer validation
//   - Explicit field destructuring — raw body is NEVER spread into lead object
// =============================================================================

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRICING_LEADS_STORE    = "pricing-leads";
const PRICING_RATELIMIT_STORE = "pricing-ratelimit";
const RATE_LIMIT_MAX         = 3;
const RATE_LIMIT_WINDOW_MS   = 3_600_000;           // 1 hour
const PDF_BASE64_MAX         = 1_398_102;            // ≈ 1 MB binary
const BODY_MAX_CHARS         = 4_000_000;            // 4 MB char guard
const EMAIL_REGEX            = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BASE64_REGEX           = /^[A-Za-z0-9+/=\s]+$/;
const PDF_DATA_URI_PREFIX    = "data:application/pdf;base64,";

// ---------------------------------------------------------------------------
// CORS — included on EVERY response
// ---------------------------------------------------------------------------

const CORS_HEADERS = {
  "Access-Control-Allow-Origin":  clientConfig.corsOrigin,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateLeadId(): string {
  return `pricing-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeTracking(v: unknown): string | undefined {
  const s = String(v ?? "").trim().substring(0, 300);
  return s || undefined;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validateCalcObject(obj: Record<string, unknown>, maxKeys: number, maxSize: number): boolean {
  const keys = Object.keys(obj);
  if (keys.length > maxKeys) return false;
  if (keys.some(k => k === '__proto__' || k === 'constructor' || k === 'prototype')) return false;
  const serialized = JSON.stringify(obj);
  if (serialized.length > maxSize) return false;
  for (const val of Object.values(obj)) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) return false;
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          for (const innerVal of Object.values(item as Record<string, unknown>)) {
            if (typeof innerVal === 'object' && innerVal !== null) return false;
          }
        }
      }
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Blobs store accessors
// ---------------------------------------------------------------------------

function leadsStore() {
  const siteID = process.env.NETLIFY_SITE_ID ?? "";
  const token  = process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN || "";
  if (!siteID || !token) {
    console.warn("[Pricing Blobs] Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN");
    return null;
  }
  return getStore({ name: PRICING_LEADS_STORE, siteID, token, consistency: "strong" });
}

function rateLimitStore() {
  const siteID = process.env.NETLIFY_SITE_ID ?? "";
  const token  = process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN || "";
  if (!siteID || !token) return null;
  return getStore({ name: PRICING_RATELIMIT_STORE, siteID, token, consistency: "strong" });
}

// ---------------------------------------------------------------------------
// Rate limit (3 req / hour / IP)
// Returns true when allowed. Fails open on store errors.
// ---------------------------------------------------------------------------

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = rateLimitStore();
  if (!store) return true;

  const key = `rate-${ip}`;
  const now = Date.now();
  let counter: { count: number; firstRequest: number } | null = null;

  try {
    const raw = await store.get(key);
    if (raw) counter = JSON.parse(raw);
  } catch { /* read error — start fresh */ }

  if (counter && now - counter.firstRequest < RATE_LIMIT_WINDOW_MS) {
    if (counter.count >= RATE_LIMIT_MAX) return false;
    counter.count += 1;
  } else {
    counter = { count: 1, firstRequest: now };
  }

  try {
    await store.set(key, JSON.stringify(counter));
  } catch (e) {
    console.warn("[Pricing] Rate limit write failed:", e);
  }
  return true;
}

// ---------------------------------------------------------------------------
// Lead object shape
// ---------------------------------------------------------------------------

interface PricingLead {
  id:               string;
  source:           "pricing-calculator";
  name:             string;
  email:            string;
  companyName:      string;
  language:         "cs" | "en";
  submittedAt:      string;
  calculatorState:  Record<string, unknown>;
  calculatorResults: Record<string, unknown>;
  consentedAt:      string;
  consentVersion:   string;
  utmSource?:       string;
  utmMedium?:       string;
  utmCampaign?:     string;
  utmContent?:      string;
  utmTerm?:         string;
  gclid?:           string;
  fbclid?:          string;
  referrer?:        string;
}

// ---------------------------------------------------------------------------
// Lead storage (non-fatal on failure)
// ---------------------------------------------------------------------------

async function storeLead(lead: PricingLead): Promise<void> {
  try {
    const store = leadsStore();
    if (!store) { console.warn("[Pricing Blobs] Store unavailable — skipping"); return; }

    await store.set(lead.id, JSON.stringify(lead), {
      metadata: { email: lead.email, name: lead.name, companyName: lead.companyName, submittedAt: lead.submittedAt, source: "pricing-calculator" },
    });

    let index: string[] = [];
    try { const raw = await store.get("_leads_index"); if (raw) index = JSON.parse(raw); } catch { /* empty index */ }
    index.unshift(lead.id);
    await store.set("_leads_index", JSON.stringify(index));
    console.log(`[Pricing Leads] Stored: ${lead.id}`);
  } catch (e) {
    console.error("[Pricing Leads] Storage error:", e);
  }
}

// ---------------------------------------------------------------------------
// Email templates — imported from pricing-templates.ts
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent) => {
  const headers = CORS_HEADERS;

  // 1. Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // 2. Method guard
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: "Method not allowed" }) };
  }

  // 3. Content-Type guard
  if (!(event.headers["content-type"] ?? "").toLowerCase().includes("application/json")) {
    return { statusCode: 415, headers, body: JSON.stringify({ success: false, error: "Content-Type must be application/json" }) };
  }

  // 4. Body size guard
  if (event.body && event.body.length > BODY_MAX_CHARS) {
    return { statusCode: 413, headers, body: JSON.stringify({ success: false, error: "Request body too large" }) };
  }

  // 5. Parse JSON
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid JSON body" }) };
  }

  // 6. Honeypot
  const honeypot = body.honeypot;
  if (typeof honeypot === "string" && honeypot !== "") {
    console.warn("[SECURITY] Honeypot triggered");
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // 7. Timing check
  const ts = typeof body.timestamp === "number" ? body.timestamp : 0;
  if (ts > 0 && Date.now() - ts < 3000) {
    console.warn("[SECURITY] Timing check failed — submission too fast");
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // 8. Rate limiting
  try {
    const rawIp = ((event.headers["x-forwarded-for"] ?? "").split(",")[0].trim()) || (event.headers["client-ip"] ?? "");
    const clientIp = rawIp.replace(/[^a-zA-Z0-9.:]/g, "").substring(0, 45);
    if (clientIp) {
      const allowed = await checkRateLimit(clientIp);
      if (!allowed) {
        return { statusCode: 429, headers, body: JSON.stringify({ success: false, error: "Too many submissions. Please try again later." }) };
      }
    }
  } catch (e) {
    console.error("[Pricing] Rate limit check error, proceeding:", e);
  }

  // 9. Input validation — explicit destructure only, never spread raw body
  const {
    name:             rawName,
    email:            rawEmail,
    companyName:      rawCompany,
    pdf:              rawPdf,
    language:         rawLanguage,
    consent:          rawConsent,
    consentVersion:   rawConsentVersion,
    calculatorState:  rawCalcState,
    calculatorResults: rawCalcResults,
    utm:              rawUtm,
  } = body;

  const name = stripHtml(String(rawName ?? "")).substring(0, 100);
  if (!name) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Name is required" }) };
  }

  const email = String(rawEmail ?? "").replace(/[\r\n]/g, "").trim().substring(0, 254);
  if (!email || !EMAIL_REGEX.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Valid email is required" }) };
  }

  const companyName = stripHtml(String(rawCompany ?? "")).substring(0, 200);
  if (!companyName) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Company name is required" }) };
  }

  if (typeof rawPdf !== "string" || rawPdf.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "PDF is required" }) };
  }

  const pdfBase64Raw = rawPdf.startsWith(PDF_DATA_URI_PREFIX)
    ? rawPdf.slice(PDF_DATA_URI_PREFIX.length)
    : rawPdf;

  if (pdfBase64Raw.length > PDF_BASE64_MAX) {
    return { statusCode: 413, headers, body: JSON.stringify({ success: false, error: "PDF exceeds 1 MB limit" }) };
  }

  if (!BASE64_REGEX.test(pdfBase64Raw)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid PDF encoding" }) };
  }

  const language: "cs" | "en" = rawLanguage === "en" ? "en" : "cs";

  if (rawConsent !== true) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Consent is required" }) };
  }

  const consentVersion =
    typeof rawConsentVersion === "string" && rawConsentVersion.trim()
      ? rawConsentVersion.trim().substring(0, 80)
      : "pricing-lead-v1";

  if (!isPlainObject(rawCalcState)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "calculatorState must be an object" }) };
  }

  if (!isPlainObject(rawCalcResults)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "calculatorResults must be an object" }) };
  }

  if (!validateCalcObject(rawCalcState as Record<string, unknown>, 10, 2000)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid calculatorState" }) };
  }

  if (!validateCalcObject(rawCalcResults as Record<string, unknown>, 15, 5000)) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid calculatorResults" }) };
  }

  const utm = isPlainObject(rawUtm) ? rawUtm : {};

  // 10. PDF binary validation
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = Buffer.from(pdfBase64Raw.replace(/\s/g, ""), "base64");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid PDF data" }) };
  }

  if (pdfBuffer.length < 4 || pdfBuffer[0] !== 0x25 || pdfBuffer[1] !== 0x50 || pdfBuffer[2] !== 0x44 || pdfBuffer[3] !== 0x46) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid PDF content" }) };
  }

  const tail = pdfBuffer.slice(Math.max(0, pdfBuffer.length - 1024)).toString("binary");
  if (!tail.includes("%%EOF")) {
    return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Invalid PDF structure" }) };
  }

  const cleanBase64Pdf = pdfBase64Raw.replace(/\s/g, "");

  // 11. Build lead object — explicit fields, no spread
  const now = new Date().toISOString();
  const lead: PricingLead = {
    id:               generateLeadId(),
    source:           "pricing-calculator",
    name,
    email,
    companyName,
    language,
    submittedAt:      now,
    calculatorState:  rawCalcState,
    calculatorResults: rawCalcResults,
    consentedAt:      now,
    consentVersion,
    utmSource:        sanitizeTracking(utm.source    ?? body.utmSource),
    utmMedium:        sanitizeTracking(utm.medium    ?? body.utmMedium),
    utmCampaign:      sanitizeTracking(utm.campaign  ?? body.utmCampaign),
    utmContent:       sanitizeTracking(utm.content   ?? body.utmContent),
    utmTerm:          sanitizeTracking(utm.term      ?? body.utmTerm),
    gclid:            sanitizeTracking(utm.gclid     ?? body.gclid),
    fbclid:           sanitizeTracking(utm.fbclid    ?? body.fbclid),
    referrer:         sanitizeTracking(utm.referrer  ?? body.referrer),
  };

  console.log(`[Pricing] New submission: ${lead.id} — ${escapeHtml(lead.companyName)}`);

  // 12. Store lead (non-fatal)
  await storeLead(lead);

  // Build template-compatible lead data for email rendering
  const templateLead: PricingLeadData = {
    name:             lead.name,
    email:            lead.email,
    companyName:      lead.companyName,
    language:         lead.language,
    submittedAt:      lead.submittedAt,
    calculatorState:  lead.calculatorState as PricingLeadData["calculatorState"],
    calculatorResults: lead.calculatorResults as PricingLeadData["calculatorResults"],
    utmSource:        lead.utmSource,
    utmMedium:        lead.utmMedium,
    utmCampaign:      lead.utmCampaign,
  };

  // 13 & 14. Send emails (parallel, both non-fatal)
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("[Pricing] RESEND_API_KEY not configured — skipping emails");
  } else {
    await Promise.allSettled([
      // 13. User email with PDF attachment
      (async () => {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from:       clientConfig.notifications.fromAddress,
              to:         email,
              reply_to:   clientConfig.primaryContact.email,
              subject:    getPricingConfirmationSubject(language),
              html:       generatePricingConfirmationEmailHTML(templateLead, language),
              text:       generatePricingConfirmationPlainText(templateLead, language),
              attachments: [{ filename: "hypelead-cenova-nabidka.pdf", content: cleanBase64Pdf }],
            }),
          });
          if (!res.ok) console.error(`[Pricing] User email failed (${res.status}):`, await res.text());
        } catch (e) { console.error("[Pricing] User email send error:", e); }
      })(),
      // 14. Team notification — no PDF
      (async () => {
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from:    clientConfig.notifications.fromAddress,
              to:      clientConfig.primaryContact.email,
              subject: `Nový zájemce z ceníku: ${name.replace(/[\r\n]/g, "").substring(0, 80)}`,
              html:    generatePricingNotificationEmailHTML(templateLead),
              text:    generatePricingNotificationPlainText(templateLead),
            }),
          });
          if (!res.ok) console.error(`[Pricing] Team notification failed (${res.status}):`, await res.text());
        } catch (e) { console.error("[Pricing] Team notification send error:", e); }
      })(),
    ]);
  }

  // 15. Success
  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
};

export { handler };
