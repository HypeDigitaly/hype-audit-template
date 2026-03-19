import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  generateSurveyNotificationEmailHTML,
  generateSurveyConfirmationEmailHTML,
  getSurveyConfirmationSubject,
  type SurveyLead,
} from "./survey-templates";
import { clientConfig } from "./_config/client";

// =============================================================================
// SURVEY FORM HANDLER - Netlify Function (Synchronous)
// =============================================================================
// Receives Pain-Point Discovery Survey submissions via AJAX.
// Stores leads in Netlify Blobs, mirrors to Netlify Forms, and sends
// notification to team + confirmation to the user via Resend.
// IMPORTANT: Zero imports from audit-related modules to avoid LangGraph/Tavily
// being pulled into the bundle.
// =============================================================================

// Blob store name for survey leads
const SURVEY_LEADS_STORE = "survey-leads";

// Separate blob store name for rate limiting — avoids namespace pollution
// with lead records
const SURVEY_RATELIMIT_STORE = "survey-ratelimit";

// CORS headers included on every response
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": clientConfig.corsOrigin,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// Valid enum values
const VALID_COMPANY_SIZES = ["solo", "2-10", "11-50", "51-250", "250+"] as const;
const VALID_AI_MATURITY = ["none", "experimenting", "active"] as const;
const VALID_HOURS_LOST = ["1-5", "5-10", "10-20", "20-40", "40+"] as const;
const VALID_PAIN_POINTS = [
  'new_customers', 'speed_to_lead', 'automating_communication', 'customer_support',
  'boring_admin', 'reporting_data', 'juggling_tools', 'integrating_ai',
  'marketing_materials', 'content_creation', 'manual_data_entry',
  'document_processing', 'invoicing', 'scheduling',
  'employee_onboarding', 'knowledge_silos', 'delegation',
] as const;
const VALID_TECH_LEVELS = ["none", "beginner", "intermediate", "advanced"] as const;
const VALID_TOP_EXAMPLES = [
  'auto_leads', 'ai_web', 'ai_assistant', 'ai_phone_management',
  'voice_blog', 'ai_avatar_reels', 'ai_lead_magnet',
] as const;

type CompanySize = typeof VALID_COMPANY_SIZES[number];
type AiMaturity = typeof VALID_AI_MATURITY[number];

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Strip HTML tags from a string to prevent stored XSS in free-text fields.
 */
function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate unique survey lead ID
 */
function generateLeadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `survey-${timestamp}-${random}`;
}

/**
 * Get Netlify Blobs store for survey leads
 */
function getSurveyLeadsStore() {
  const siteID = process.env.NETLIFY_SITE_ID || '';
  const token = process.env.NETLIFY_API_TOKEN || '';

  if (!siteID || !token) {
    console.warn('[Survey Blobs] Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN');
    return null;
  }

  return getStore({ name: SURVEY_LEADS_STORE, siteID, token, consistency: "strong" });
}

/**
 * Get Netlify Blobs store for rate limiting — separate from leads store to
 * avoid namespace pollution.
 */
function getSurveyRateLimitStore() {
  const siteID = process.env.NETLIFY_SITE_ID || '';
  const token = process.env.NETLIFY_API_TOKEN || '';

  if (!siteID || !token) {
    return null;
  }

  return getStore({ name: SURVEY_RATELIMIT_STORE, siteID, token, consistency: "strong" });
}

/**
 * Store lead in Netlify Blobs and update the leads index
 */
async function storeSurveyLead(lead: SurveyLead): Promise<void> {
  try {
    const store = getSurveyLeadsStore();
    if (!store) {
      console.warn('[Survey Blobs] Store not available, skipping lead storage');
      return;
    }

    // Store individual lead record
    await store.set(lead.id, JSON.stringify(lead));

    // Update shared index for admin retrieval
    const indexKey = '_leads_index';
    let index: string[] = [];
    try {
      const existingIndex = await store.get(indexKey);
      if (existingIndex) {
        index = JSON.parse(existingIndex);
      }
    } catch (e) {
      index = [];
    }
    index.unshift(lead.id);
    await store.set(indexKey, JSON.stringify(index));

    console.log(`[Survey Leads] Lead stored: ${lead.id}`);
  } catch (error) {
    console.error('[Survey Leads] Failed to store lead:', error);
    // Non-fatal — don't let storage failure block the response
  }
}

/**
 * Mirror submission to Netlify Forms (fire-and-forget)
 */
async function mirrorToNetlifyForms(lead: SurveyLead): Promise<void> {
  try {
    const formBody = new URLSearchParams({
      'form-name': 'survey',
      'email': lead.email,
      'companyName': lead.companyName,
      'industry': lead.industry,
      'companySize': lead.companySize,
      'painPoints': lead.painPoints.join(', '),
      'primaryPainPoint': lead.primaryPainPoint,
      'aiMaturity': lead.aiMaturity,
      'hoursLostPerWeek': lead.hoursLostPerWeek,
      'contextNote': lead.contextNote,
      'language': lead.language,
      'city': lead.city || '',
      'phoneNumber': lead.phoneNumber || '',
      'toolsUsed': (lead.toolsUsed || []).join(', '),
      'websiteUrl': lead.websiteUrl || '',
      'respondentRole': lead.respondentRole || '',
      'crmUsed': lead.crmUsed || '',
      'erpUsed': lead.erpUsed || '',
      'techOpenness': lead.techOpenness || '',
      'techLevel': lead.techLevel || '',
      'topExamples': (lead.topExamples || []).join(', '),
    });
    await fetch(`${clientConfig.siteUrl}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });
  } catch (e) {
    console.warn('[Survey] Netlify Forms submission failed:', e);
  }
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = CORS_HEADERS;

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Reject non-POST methods
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  // Reject oversized bodies (> 15 KB)
  if (event.body && event.body.length > 15360) {
    return {
      statusCode: 413,
      headers,
      body: JSON.stringify({ success: false, error: "Request body too large" }),
    };
  }

  // Parse JSON body
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, error: "Invalid JSON body" }),
    };
  }

  // Honeypot check — silently accept but discard bot submissions
  const honeypot = body.website_url;
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    console.warn('[Survey] Honeypot triggered — discarding submission silently');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  }

  // ============================================================
  // RATE LIMITING (per-IP, max 5 requests per hour)
  // ============================================================
  try {
    // Extract the first IP from x-forwarded-for or fall back to client-ip.
    // If neither header is present we cannot identify the client, so we skip
    // rate limiting entirely rather than grouping all anonymous requests into
    // one shared bucket (which would lock out legitimate users).
    const rawIpHeader = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '';
    const firstIp = rawIpHeader.split(',')[0].trim();

    if (firstIp) {
      // Sanitize the IP to prevent Blob key injection: keep only characters
      // that are valid in IPv4/IPv6 addresses and truncate to 45 chars
      // (max length of an IPv6 address).
      const clientIp = firstIp.replace(/[^a-zA-Z0-9.:]/g, '').substring(0, 45);

      if (clientIp) {
        const rateLimitKey = `ratelimit-${clientIp}`;
        const store = getSurveyRateLimitStore();

        if (store) {
          const now = Date.now();
          const ONE_HOUR_MS = 3600000;

          let counter: { count: number; firstRequest: number } | null = null;
          try {
            const existing = await store.get(rateLimitKey);
            if (existing) {
              counter = JSON.parse(existing);
            }
          } catch {
            counter = null;
          }

          if (counter && (now - counter.firstRequest) < ONE_HOUR_MS) {
            // Within the current window
            if (counter.count >= 5) {
              return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ success: false, error: "Too many submissions. Please try again later." }),
              };
            }
            counter.count += 1;
          } else {
            // Expired window or no existing counter — reset
            counter = { count: 1, firstRequest: now };
          }

          await store.set(rateLimitKey, JSON.stringify(counter));
        }
      }
    }
  } catch (e) {
    // Fail open — rate limit check failure must not block legitimate submissions.
    // Logged at error level so monitoring alerts fire.
    console.error('[Survey] Rate limit check failed, proceeding:', e);
  }

  // ============================================================
  // VALIDATE REQUIRED FIELDS
  // ============================================================
  const errors: Record<string, string> = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // email — capped at 254 chars (RFC 5321 maximum)
  const rawEmail = String(body.email || '').trim().substring(0, 254);
  if (!rawEmail || !emailRegex.test(rawEmail)) {
    errors.email = 'Zadejte platnou e-mailovou adresu.';
  }

  // companyName — capped at 200 chars
  const rawCompanyName = String(body.companyName || '').trim().substring(0, 200);
  if (!rawCompanyName) {
    errors.companyName = 'Nazev spolecnosti je povinny.';
  }

  // painPoints
  let sanitizedPainPoints: string[] = [];
  if (!Array.isArray(body.painPoints)) {
    errors.painPoints = 'Vyberte alespon jedno bolestive misto.';
  } else {
    sanitizedPainPoints = (body.painPoints as unknown[])
      .map(item => String(item).trim().substring(0, 200))
      .filter(item => item.length > 0);
    if (sanitizedPainPoints.length < 1 || (body.painPoints as unknown[]).length > 18) {
      errors.painPoints = 'Vyberte 1 az 18 bolicich mist.';
    }
  }

  // companySize
  const rawCompanySize = String(body.companySize || '');
  if (!(VALID_COMPANY_SIZES as readonly string[]).includes(rawCompanySize)) {
    errors.companySize = 'Vyberte platnou velikost spolecnosti.';
  }

  // industry
  const rawIndustry = String(body.industry || '').trim().substring(0, 200);
  if (!rawIndustry) {
    errors.industry = 'Zadejte odveti cinnosti.';
  }

  // phoneNumber (OPTIONAL)
  const rawPhoneNumber = String(body.phoneNumber || '').trim();
  let sanitizedPhoneNumber = '';
  if (rawPhoneNumber.length > 0) {
    const stripped = rawPhoneNumber.replace(/[\s\-\(\)]/g, '');
    if (!/^\+?[0-9]{7,15}$/.test(stripped)) {
      errors.phoneNumber = 'Invalid phone number format';
    } else {
      // Store the stripped value (digits and leading + only) — safer than
      // keeping punctuation/spaces from the raw input.
      sanitizedPhoneNumber = stripped;
    }
  }

  // city (OPTIONAL)
  const sanitizedCity = String(body.city || '').trim().substring(0, 100);

  // toolsUsed (OPTIONAL)
  let sanitizedToolsUsed: string[] = [];
  if (Array.isArray(body.toolsUsed)) {
    sanitizedToolsUsed = (body.toolsUsed as unknown[])
      .slice(0, 10)
      .map(item => String(item).trim().substring(0, 100))
      .filter(item => item.length > 0);
  }

  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, errors }),
    };
  }

  // ============================================================
  // SANITIZE OPTIONAL FIELDS
  // ============================================================
  const rawPrimaryPainPoint = String(body.primaryPainPoint || '').trim().substring(0, 200);

  const rawAiMaturity = String(body.aiMaturity || '');
  // Default to empty string when the value is absent or not in the valid set.
  // Falling back to 'none' would conflate "user skipped the question" with
  // "user explicitly selected: we don't use AI", corrupting analytics.
  const aiMaturity: AiMaturity | '' = (VALID_AI_MATURITY as readonly string[]).includes(rawAiMaturity)
    ? rawAiMaturity as AiMaturity
    : '';

  const rawHoursLost = String(body.hoursLostPerWeek || '');
  const hoursLostPerWeek = (VALID_HOURS_LOST as readonly string[]).includes(rawHoursLost)
    ? rawHoursLost
    : '';

  const rawContextNote = String(body.contextNote || '').trim().substring(0, 500);

  const rawLanguage = String(body.language || '');
  const language: 'cs' | 'en' = rawLanguage === 'en' ? 'en' : 'cs';

  // websiteUrl (OPTIONAL) — URL field, protocol allowlist (http/https only)
  const sanitizedWebsiteUrl = String(body.websiteUrl || '').trim().substring(0, 500);
  // Only allow http:// and https:// protocols, or empty.
  // Reject any input that contains a colon before the first slash — indicates a non-http protocol.
  const safeWebsiteUrl = sanitizedWebsiteUrl === '' ? '' :
    /^https?:\/\//i.test(sanitizedWebsiteUrl) ? sanitizedWebsiteUrl :
    /^[a-z0-9]/i.test(sanitizedWebsiteUrl) && !/:/.test(sanitizedWebsiteUrl.split('/')[0])
      ? 'https://' + sanitizedWebsiteUrl : '';

  // Enum allowlists for new optional fields
  const VALID_RESPONDENT_ROLES = ['owner_ceo', 'sales_manager', 'ops_manager', 'it_lead', 'employee', 'other'];
  const VALID_CRM = ['none', 'excel', 'hubspot_pipedrive', 'salesforce', 'raynet', 'custom_other'];
  const VALID_ERP = ['none', 'pohoda', 'abra_helios', 'sap', 'money_s3', 'custom_other'];
  const VALID_TECH_OPENNESS = ['conservative', 'open', 'innovator'];

  const rawRespondentRole = String(body.respondentRole || '').trim();
  const validatedRespondentRole = VALID_RESPONDENT_ROLES.includes(rawRespondentRole) ? rawRespondentRole : '';

  const rawCrm = String(body.crmUsed || '').trim();
  const validatedCrm = VALID_CRM.includes(rawCrm) ? rawCrm : '';

  const rawErp = String(body.erpUsed || '').trim();
  const validatedErp = VALID_ERP.includes(rawErp) ? rawErp : '';

  const rawTechOpenness = String(body.techOpenness || '').trim();
  const validatedTechOpenness = VALID_TECH_OPENNESS.includes(rawTechOpenness) ? rawTechOpenness : '';

  // techLevel (OPTIONAL enum)
  const rawTechLevel = String(body.techLevel || '').trim();
  const validatedTechLevel = (VALID_TECH_LEVELS as readonly string[]).includes(rawTechLevel) ? rawTechLevel : '';

  // topExamples (OPTIONAL array, max 3 items)
  // Strip HTML tags from "other:" text and limit to 200 chars
  let sanitizedTopExamples: string[] = [];
  if (Array.isArray(body.topExamples)) {
    const sanitizedArray = (body.topExamples as unknown[])
      .slice(0, 3)
      .map(item => String(item).trim())
      .filter(item => {
        if ((VALID_TOP_EXAMPLES as readonly string[]).includes(item)) return true;
        if (item.startsWith('other:')) return true;
        return false;
      })
      .map(item => {
        if (item.startsWith('other:')) {
          const otherText = stripHtmlTags(item.slice('other:'.length)).substring(0, 200);
          return `other:${otherText}`;
        }
        return item;
      });
    // Deduplicate while preserving order
    const uniqueExamples = [...new Set(sanitizedArray)];
    sanitizedTopExamples = uniqueExamples;
  }

  // UTM and tracking fields (all optional, sanitized to string or undefined)
  function sanitizeTracking(val: unknown): string | undefined {
    const s = String(val || '').trim().substring(0, 300);
    return s || undefined;
  }

  // ============================================================
  // BUILD LEAD OBJECT
  // ============================================================
  const lead: SurveyLead = {
    id: generateLeadId(),
    source: 'survey',
    email: rawEmail,
    companyName: rawCompanyName,
    industry: rawIndustry,
    companySize: rawCompanySize as CompanySize,
    painPoints: sanitizedPainPoints,
    primaryPainPoint: rawPrimaryPainPoint,
    aiMaturity,
    hoursLostPerWeek,
    contextNote: rawContextNote,
    language,
    submittedAt: new Date().toISOString(),
    leadSource: 'gc-event-page',
    utmSource: sanitizeTracking(body.utmSource),
    utmMedium: sanitizeTracking(body.utmMedium),
    utmCampaign: sanitizeTracking(body.utmCampaign),
    utmContent: sanitizeTracking(body.utmContent),
    utmTerm: sanitizeTracking(body.utmTerm),
    gclid: sanitizeTracking(body.gclid),
    fbclid: sanitizeTracking(body.fbclid),
    msclkid: sanitizeTracking(body.msclkid),
    referrer: sanitizeTracking(body.referrer),
    city: sanitizedCity,
    phoneNumber: sanitizedPhoneNumber,
    toolsUsed: sanitizedToolsUsed,
    websiteUrl: safeWebsiteUrl,
    respondentRole: validatedRespondentRole,
    crmUsed: validatedCrm,
    erpUsed: validatedErp,
    techOpenness: validatedTechOpenness,
    techLevel: validatedTechLevel,
    topExamples: sanitizedTopExamples,
  };

  console.log(`[Survey] New submission: ${lead.id} — ${lead.companyName} (${lead.industry})`);

  // ============================================================
  // STORE IN NETLIFY BLOBS
  // ============================================================
  await storeSurveyLead(lead);

  // ============================================================
  // MIRROR TO NETLIFY FORMS (awaited to ensure completion before function terminates)
  // ============================================================
  await mirrorToNetlifyForms(lead);

  // ============================================================
  // SEND EMAILS VIA RESEND
  // ============================================================
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // Send both emails in parallel
  await Promise.allSettled([
    // Team notification
    (async () => {
      if (!RESEND_API_KEY) return;
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: clientConfig.notifications.fromAddress,
            to: clientConfig.notifications.recipients,
            subject: `Nový průzkum: ${lead.companyName.replace(/[\r\n]/g, '')} (${lead.industry.replace(/[\r\n]/g, '')})`.substring(0, 120),
            html: generateSurveyNotificationEmailHTML(lead),
          }),
        });
      } catch (e) {
        console.warn('[Survey] Team notification failed:', e);
      }
    })(),
    // User confirmation
    (async () => {
      if (!RESEND_API_KEY) return;
      try {
        const subject = getSurveyConfirmationSubject(lead.language);
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: clientConfig.notifications.fromAddress,
            to: [lead.email],
            subject,
            html: generateSurveyConfirmationEmailHTML(lead),
          }),
        });
      } catch (e) {
        console.warn('[Survey] User confirmation failed:', e);
      }
    })(),
  ]);

  // ============================================================
  // SUCCESS RESPONSE
  // ============================================================
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
};

export { handler };
