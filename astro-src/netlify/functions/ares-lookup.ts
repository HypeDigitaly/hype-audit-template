import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { lookupCompanyByIco, isValidIco } from "./onboarding-services/ares-client";
import { clientConfig } from "./_config/client";

// =============================================================================
// ARES LOOKUP - Netlify Function
// =============================================================================
// GET /.netlify/functions/ares-lookup?q=<ICO>
//
// Returns normalized Czech company data from the ARES v3 API for the given IČO.
// Includes per-IP rate limiting (10 req / 60 s) stored in Netlify Blobs.
// CORS is locked to the configured site URL
// =============================================================================

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const RATE_LIMIT_STORE = "rate-limits";
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;

// -----------------------------------------------------------------------------
// CORS / response headers
// -----------------------------------------------------------------------------

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": clientConfig.corsOrigin,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const RESPONSE_HEADERS = {
  ...CORS_HEADERS,
  "Content-Type": "application/json",
  "X-Content-Type-Options": "nosniff",
};

// -----------------------------------------------------------------------------
// Rate limiter
// -----------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

function getRateLimitStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error("Netlify Blobs not configured: missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN");
  }

  return getStore({
    name: RATE_LIMIT_STORE,
    siteID,
    token,
    consistency: "strong",
  });
}

/**
 * Checks and increments the request counter for `ip`.
 * Returns `true` when the request is allowed, `false` when the limit is exceeded.
 */
async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ares-${ip}`;

  try {
    const store = getRateLimitStore();
    const raw = await store.get(key);
    const now = Date.now();

    let entry: RateLimitEntry;

    if (raw) {
      entry = JSON.parse(raw) as RateLimitEntry;
      const age = now - entry.windowStart;

      if (age > RATE_LIMIT_WINDOW_MS) {
        // Window expired — open a fresh one
        entry = { count: 1, windowStart: now };
      } else if (entry.count >= RATE_LIMIT_MAX) {
        // Still within the window and limit reached
        return false;
      } else {
        entry = { ...entry, count: entry.count + 1 };
      }
    } else {
      entry = { count: 1, windowStart: now };
    }

    await store.set(key, JSON.stringify(entry));
    return true;
  } catch {
    // If the rate-limit store is unavailable, fail open rather than blocking
    // legitimate traffic. Log for monitoring.
    console.warn("[ares-lookup] Rate limit store unavailable; allowing request");
    return true;
  }
}

// -----------------------------------------------------------------------------
// Response helpers
// -----------------------------------------------------------------------------

function jsonResponse(
  statusCode: number,
  body: Record<string, unknown>
): import("@netlify/functions").HandlerResponse {
  return {
    statusCode,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(body),
  };
}

// -----------------------------------------------------------------------------
// IP extraction
// -----------------------------------------------------------------------------

function extractIp(event: HandlerEvent): string {
  // Netlify populates the client IP in the standard header
  const forwarded = event.headers["x-forwarded-for"];
  if (forwarded) {
    // May be a comma-separated list; take the first (leftmost) address
    return forwarded.split(",")[0].trim();
  }
  return event.headers["client-ip"] ?? "unknown";
}

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext): Promise<import("@netlify/functions").HandlerResponse> => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  // Method guard
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      success: false,
      error: "Metoda není povolena. Použijte GET.",
    });
  }

  // -------------------------------------------------------------------------
  // Parameter extraction & validation
  // -------------------------------------------------------------------------

  const q = event.queryStringParameters?.q?.trim() ?? "";

  if (!q) {
    return jsonResponse(400, {
      success: false,
      error: "Chybí parametr q (IČO firmy).",
    });
  }

  if (!isValidIco(q)) {
    return jsonResponse(400, {
      success: false,
      error: "Neplatný formát IČO. IČO musí obsahovat přesně 8 číslic.",
    });
  }

  // -------------------------------------------------------------------------
  // Rate limiting
  // -------------------------------------------------------------------------

  const ip = extractIp(event);
  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return jsonResponse(429, {
      success: false,
      error: "Příliš mnoho požadavků. Zkuste to prosím za minutu.",
    });
  }

  // -------------------------------------------------------------------------
  // ARES lookup
  // -------------------------------------------------------------------------

  try {
    const data = await lookupCompanyByIco(q);

    if (!data) {
      // Graceful degradation: ARES unavailable or company not found.
      // Return success: false with a user-friendly message so the frontend
      // can offer manual entry without treating this as a hard error.
      return jsonResponse(404, {
        success: false,
        error: "Firma s tímto IČO nebyla nalezena v registru ARES.",
      });
    }

    return jsonResponse(200, {
      success: true,
      data,
    });
  } catch (err: unknown) {
    // Unexpected errors (e.g. Blobs misconfiguration) — log safely and return 500
    console.error(
      "[ares-lookup] Unexpected error:",
      err instanceof Error ? err.message : "unknown error"
    );

    return jsonResponse(500, {
      success: false,
      error: "Interní chyba serveru. Zkuste to prosím znovu.",
    });
  }
};

export { handler };
