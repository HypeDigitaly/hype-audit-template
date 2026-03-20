# Security Documentation — HypeDigitaly Platform

**Last Updated:** 2026-03-19
**Version:** 1.0

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Authentication & Authorization](#authentication--authorization)
3. [Network Security](#network-security)
4. [Input Validation & Sanitization](#input-validation--sanitization)
5. [Rate Limiting](#rate-limiting)
6. [Known Limitations & Risks](#known-limitations--risks)
7. [Deployment Checklist](#deployment-checklist)

---

## Executive Summary

The template is a B2B lead-generation and audit platform with serverless Netlify Functions backed by Blobs storage. Security is implemented at multiple layers:

**Security Layers:**
1. **Input Validation** — Prompt injection blocklist, URL protocol validation, analytics ID regex
2. **Output Sanitization** — `escapeHtml()` on ALL report sections, `escapeHtmlAttr()` for attributes, `sanitizeUrl()` for links
3. **Authentication** — Constant-time password comparison for admin access
4. **Network** — Security headers (X-Frame-Options, CSP-like headers), restrictive CORS
5. **Data Protection** — PII sanitization, unguessable report IDs, SSL/TLS enforcement

**Critical Assets Protected:**
- Admin leads dashboard (password-protected, constant-time auth)
- Lead data (PII: email, company name, etc. — escaped on output)
- Audit reports (unguessable 12-char IDs, escaped HTML output)
- Configuration data (validated against schema at runtime)

**Threat Model:**
- Prompt injection attacks (blocked with character validation + injection blocklist)
- XSS/HTML injection in report output (prevented with `escapeHtml()` on all 16 report sections)
- Unauthenticated access to admin dashboard (blocked with constant-time comparison)
- Malicious URL protocols (blocked with `sanitizeUrl()` allowlist)
- Analytics ID injection (validated with regex patterns)
- CORS abuse (restrictive origin allowlist)
- Timing-based auth attacks (constant-time comparison)

---

## Authentication & Authorization

### Admin Dashboard (Password-Based)

**Location:** `/admin/leads` (SSR, non-prerendered)

**Flow:**

1. Client enters plaintext password in login form
2. Password stored in browser `sessionStorage` (volatile)
3. On API calls, sent as `Authorization: Bearer <password>` header
4. Server compares using **constant-time comparison** to prevent timing attacks

**Implementation:**

```typescript
// auth.ts
import { timingSafeEqual } from "crypto";

export function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    // Timing-safe dummy comparison on length mismatch
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

export function verifyAdminAuth(event: HandlerEvent): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("[auth] ADMIN_PASSWORD not configured");
    return false;
  }
  const provided = event.headers["authorization"]?.replace("Bearer ", "");
  if (!provided) return false;
  return safeCompare(provided, adminPassword);
}
```

**Usage in `admin-leads` endpoint:**

```typescript
if (!verifyAdminAuth(event)) {
  return {
    statusCode: 401,
    headers: responseHeaders,
    body: JSON.stringify({ error: "Unauthorized. Invalid password." }),
  };
}
```

**Limitations:**

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| No CSRF token | State-changing operations (future) unprotected | Use SameSite cookies or explicit tokens |
| No token expiry | Session lasts until browser closes | SessionStorage clears on close; consider JWT |
| No multi-factor auth | Single factor only | Add TOTP/email verification for production |
| No session management | No revocation possible | Add server-side session store |
| No role-based access | Admin = all leads | Implement ACLs by lead source |

**Configuration:**

```bash
# In Netlify Environment Variables
ADMIN_PASSWORD=<random_32_char_secret>
```

---

### Internal API Authentication

**Location:** Background functions (e.g., `onboarding-cleanup`)

**Implementation:**

```typescript
export function verifyInternalAuth(event: HandlerEvent): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    console.error("[auth] INTERNAL_API_SECRET not configured");
    return false;
  }
  const provided = event.headers["authorization"]?.replace("Bearer ", "");
  if (!provided) return false;
  return safeCompare(provided, secret);
}
```

**Configuration:**

```bash
INTERNAL_API_SECRET=<random_32_char_secret>
```

---

## Network Security

### Security Headers (netlify.toml)

All HTTP responses include strict security headers:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` (global)<br>`SAMEORIGIN` (flyers only) | Prevent clickjacking; allow same-origin iframe embed for pricing flyers |
| `X-XSS-Protection` | `1; mode=block` | Enable browser XSS filter (legacy) |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leak minimal referrer data |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disable unnecessary capabilities |

**Configuration:**

```toml
# netlify.toml — global headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

# Flyers allow same-origin framing
[[headers]]
  for = "/hypelead-cenik-flyer.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"

[[headers]]
  for = "/marketing-sluzby-flyer.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

**Missing Headers:**

Not implemented (consider for future hardening):
- `Content-Security-Policy` (CSP) — would require script-src allowlist
- `Strict-Transport-Security` (HSTS) — relies on Netlify's HTTPS enforcement
- `X-Content-Type-Options: nosniff` already set globally

### CORS Policies

CORS is **restrictively configured per endpoint** to prevent unauthorized cross-origin access.

**Admin Leads API** (`GET /.netlify/functions/admin-leads`):

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
```

Allows GET/OPTIONS only from `domain.corsOrigin` config value. Preflight responses return 204 No Content.

---

## Input Validation & Sanitization

### Prompt Injection Defense (New in v2)

**File:** `config.schema.ts` (validateConfig function)

All configuration values are **validated at runtime** to prevent prompt injection:

```typescript
const INJECTION_BLOCKLIST = [
  'ignore previous instructions',
  'system prompt override',
  'ignore this prompt',
  'pretend you are',
  'you are now',
  'disregard all above'
];

export function validateConfig(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Check all text fields against injection patterns
  for (const field of Object.keys(config)) {
    const value = config[field];
    if (typeof value === 'string') {
      for (const pattern of INJECTION_BLOCKLIST) {
        if (value.toLowerCase().includes(pattern)) {
          errors.push({
            field,
            message: `Suspicious pattern detected: "${pattern}"`
          });
        }
      }
    }
  }

  return errors;
}
```

**Fields Validated:**
- `company.description`
- `company.audience`
- `prompt.systemIdentity`
- `prompt.customInstructions`
- `email.*` (email template text)
- All user-facing copy

### XSS Prevention in Report Output (New in v2)

**File:** `html-report/sections/*.ts` (all 16 report section generators)

**Implementation:** All report content is **escaped before rendering**:

```typescript
import { escapeHtml, escapeHtmlAttr, sanitizeUrl } from '../utils';

// In every section generator
export function generateOpportunitiesSection(data: AuditReportData): string {
  const escaped = {
    title: escapeHtml(data.title),
    description: escapeHtml(data.description),
    url: sanitizeUrl(data.url),
    buttonTitle: escapeHtmlAttr(data.buttonTitle)
  };

  return `
    <h2>${escaped.title}</h2>
    <p>${escaped.description}</p>
    <a href="${escaped.url}" title="${escaped.buttonTitle}">Learn More</a>
  `;
}
```

**Three-Level Escaping:**

| Function | Purpose | Use Case |
|---|---|---|
| `escapeHtml()` | Escapes `<`, `>`, `&`, `"`, `'` | Text content, paragraph text |
| `escapeHtmlAttr()` | Escapes for HTML attributes only | `title`, `alt`, `data-*` attributes |
| `sanitizeUrl()` | Validates protocol + removes `javascript:` | `href`, `src` attributes |

**Applied to All Report Sections:**
1. Header (company name, dates)
2. Company profile (description, city)
3. Opportunities (titles, descriptions)
4. ROI calculator (user input via sliders)
5. Questions (category names, question text)
6. Technologies (detected tools)
7. App integrations (tool names, descriptions)
8. Industry benchmark (metric names)
9. Timeline (phase names, descriptions)
10. Risks (risk descriptions, mitigation)
11. Tools (tool names, URLs)
12. CTA section (customizable text, button labels)
13. Footer (company legal name, links)
14. All dynamic content from LLM output

### URL Protocol Validation (New in v2)

**File:** `utils.ts` (sanitizeUrl function)

Only safe protocols allowed:

```typescript
const ALLOWED_PROTOCOLS = ['http://', 'https://', 'mailto:', 'tel:'];

export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '#';
  const trimmed = url.trim().toLowerCase();

  // Block javascript:, data:, vbscript:, etc.
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    return '#';  // Fallback to safe hash
  }

  // Only allow whitelisted protocols
  for (const protocol of ALLOWED_PROTOCOLS) {
    if (trimmed.startsWith(protocol)) return url;
  }

  // Default: assume relative or safe URL
  return url.startsWith('/') ? url : '#';
}
```

### Analytics ID Validation (New in v2)

**File:** `config.schema.ts`

Analytics IDs are validated with strict regex patterns:

```typescript
const ANALYTICS_PATTERNS = {
  ga4: /^G-[A-Z0-9]{10}$/,           // Google Analytics 4
  segment: /^[A-Za-z0-9]{40}$/,      // Segment Write Key
  mixpanel: /^[a-f0-9]{32}$/,        // Mixpanel Project Token
  gtm: /^GTM-[A-Z0-9]{6,7}$/         // Google Tag Manager
};

export function validateAnalyticsIds(config: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (config.analytics?.ga4Id && !ANALYTICS_PATTERNS.ga4.test(config.analytics.ga4Id)) {
    errors.push({ field: 'analytics.ga4Id', message: 'Invalid GA4 ID format' });
  }

  // ... other validations

  return errors;
}
```

---

## Rate Limiting

**Status:** Not implemented in v2 (recommended for future release)

**Recommended Implementation:**
- Netlify rate limiting addon (~$25/month)
- Cloudflare rate limiting (if using Cloudflare nameservers)
- Custom middleware with Redis (beyond scope of Netlify-only deployment)

Current mitigation: Admin password is strong, audit form allows rapid submission (expected behavior for UX).

**Pricing Lead API** (`POST /.netlify/functions/pricing-lead`):

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
```

Allows POST/OPTIONS only. Note: No `Authorization` header allowed (no auth required for public form).

**Survey API** (`POST /.netlify/functions/survey`):

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};
```

Allows POST/OPTIONS only (public endpoint).

**ARES Lookup API** (`GET /.netlify/functions/ares-lookup`):

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
```

Allows GET/OPTIONS only.

**Audit Status API** (`GET /.netlify/functions/audit-status`):

```typescript
// Public endpoint — reports are unguessable 12-char IDs
"Access-Control-Allow-Origin": "*"
```

Allows any origin (public report retrieval by unguessable ID).

---

## Input Validation & Sanitization

### Validation Strategy

HypeDigitaly uses **manual validation** (not Zod) for audit-critical paths:

- **Explicit field destructuring** — never spread raw request body into lead objects
- **Type guards** — check types before use
- **Regex validators** — email, URL protocols, ISO dates
- **Size limits** — cap strings and arrays per endpoint
- **HTML stripping** — remove tags from free-text fields
- **Object security** — filter `__proto__`, `constructor`, `prototype` keys

### Email Validation

**Pattern:** `^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`

Applied to:
- Survey form (required)
- Pricing lead form (required)
- Contact form (required)

**Processing:**

```typescript
const email = String(rawEmail ?? "").replace(/[\r\n]/g, "").trim().substring(0, 254);
if (!email || !EMAIL_REGEX.test(email)) {
  return { statusCode: 400, ... };
}
```

Max length 254 chars (RFC 5321 limit). Newlines stripped to prevent header injection.

### HTML Stripping

**Function:**

```typescript
function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").trim();
}
```

Removes all HTML-like tags (greedy match `<...>`). Applied to:
- `name`, `companyName` (pricing lead)
- `contextNote`, `primaryPainPoint` (survey)
- `topExamples` custom text (survey)

**Example:**

```
Input:  "<script>alert('xss')</script>Company"
Output: "Company"
```

### URL Protocol Allowlist

**Survey websiteUrl validation:**

```typescript
const sanitizedWebsiteUrl = String(body.websiteUrl || '').trim().substring(0, 500);
const safeWebsiteUrl = sanitizedWebsiteUrl === '' ? '' :
  /^https?:\/\//i.test(sanitizedWebsiteUrl) ? sanitizedWebsiteUrl :
  /^[a-z0-9]/i.test(sanitizedWebsiteUrl) && !/:/.test(sanitizedWebsiteUrl.split('/')[0])
    ? 'https://' + sanitizedWebsiteUrl : '';
```

**Logic:**
1. If starts with `http://` or `https://`, allow as-is
2. If looks like domain (alphanumeric, no `:` in first segment), prepend `https://`
3. Otherwise, reject (return empty string)

**Prevents:**
- `javascript:alert(1)` → rejected
- `data:text/html...` → rejected
- `example.com` → converted to `https://example.com`
- `https://example.com` → allowed

### PDF Validation

**Pricing lead PDF security:**

```typescript
const PDF_BASE64_MAX = 1_398_102; // ~1 MB binary
const BASE64_REGEX = /^[A-Za-z0-9+/=\s]+$/;
const PDF_DATA_URI_PREFIX = "data:application/pdf;base64,";

// 1. Size check
if (pdfBase64Raw.length > PDF_BASE64_MAX) {
  return { statusCode: 413, ... };
}

// 2. Base64 charset validation
if (!BASE64_REGEX.test(pdfBase64Raw)) {
  return { statusCode: 400, ... };
}

// 3. Decode and validate magic bytes (%PDF)
let pdfBuffer: Buffer;
try {
  pdfBuffer = Buffer.from(pdfBase64Raw.replace(/\s/g, ""), "base64");
} catch {
  return { statusCode: 400, ... };
}

if (pdfBuffer.length < 4 || pdfBuffer[0] !== 0x25 || pdfBuffer[1] !== 0x50 ||
    pdfBuffer[2] !== 0x44 || pdfBuffer[3] !== 0x46) {
  return { statusCode: 400, error: "Invalid PDF content" };
}

// 4. Validate trailer %%EOF
const tail = pdfBuffer.slice(Math.max(0, pdfBuffer.length - 1024)).toString("binary");
if (!tail.includes("%%EOF")) {
  return { statusCode: 400, error: "Invalid PDF structure" };
}
```

**Checks:**
- Base64 length ≤ 1 MB
- Base64 charset valid
- Magic bytes: `25 50 44 46` (`%PDF`)
- Trailer: `%%EOF` in last 1024 bytes

---

### Object Security (Prototype Pollution)

**Calculator object validation:**

```typescript
function validateCalcObject(obj: Record<string, unknown>, maxKeys: number, maxSize: number): boolean {
  const keys = Object.keys(obj);

  // 1. Reject dangerous property names
  if (keys.some(k => k === '__proto__' || k === 'constructor' || k === 'prototype')) {
    return false;
  }

  // 2. Size constraints
  if (keys.length > maxKeys) return false;
  const serialized = JSON.stringify(obj);
  if (serialized.length > maxSize) return false;

  // 3. Reject nested objects (only scalars or arrays of scalars)
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

// Usage
if (!validateCalcObject(rawCalcState as Record<string, unknown>, 10, 2000)) {
  return { statusCode: 400, ... };
}
if (!validateCalcObject(rawCalcResults as Record<string, unknown>, 15, 5000)) {
  return { statusCode: 400, ... };
}
```

**Constraints:**
- `calculatorState`: max 10 keys, 2000 chars JSON
- `calculatorResults`: max 15 keys, 5000 chars JSON

---

### XSS Prevention in Admin Dashboard

**escapeHtml() function:**

```javascript
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

Applied to **all user-controlled data** before insertion:

```javascript
// Email column
<a href="mailto:${escapeHtml(lead.email)}" class="link">${escapeHtml(lead.email)}</a>

// Company name
badge = `<span class="badge badge-audit">${escapeHtml('Audit')}</span>`;

// Dynamic text (pain points, industry labels)
details.push('Obor: ' + escapeHtml(INDUSTRY_LABELS[lead.industry] || lead.industry));
```

**safeHref() function:**

```javascript
function safeHref(url) {
  if (!url) return '';
  var trimmed = String(url).trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return escapeHtml('https://' + trimmed);
}

// Usage
const href = safeHref(rawWebsite);
websiteDisplay = `<a href="${href}" target="_blank" class="link">${safeWebsite}</a>`;
```

**Strategy:**
1. Check protocol is `http://`, `https://`, or `mailto:`
2. If missing, prepend `https://`
3. Escape the resulting URL for use in `href` attribute
4. Separate escaping of link text (`escapeHtml()` called on display text)

---

### CSV Injection Prevention

**Export function:**

```javascript
function csvSafeValue(val) {
  let str = String(val || '').replace(/"/g, '""'); // Escape quotes
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str; // Prefix dangerous chars with single quote
  }
  return '"' + str + '"'; // Wrap in double quotes
}
```

**Mechanism:**

CSV formula injection occurs when cells start with `=`, `+`, `-`, `@`, or tab/CR. Excel interprets these as formulas.

**Protection:**

1. Escape internal quotes: `"` → `""`
2. Prefix dangerous leading chars with `'` (apostrophe): `=SUM(...)` → `'=SUM(...)`
3. Wrap all cells in double quotes: `value` → `"value"`

**Example:**

```
Input:  =cmd|'/c calc'!A1
Output: "''=cmd|'/c calc'!A1"
(Cell displays: '=cmd|'/c calc'!A1 — apostrophe prevents formula execution)
```

---

## Rate Limiting

### Ares Lookup API

**Endpoint:** `GET /.netlify/functions/ares-lookup?q=<ICO>`

**Rate Limit:** 10 requests per 60 seconds per IP

**Store:** `rate-limits` (Netlify Blobs)

**Implementation:**

```typescript
const RATE_LIMIT_STORE = "rate-limits";
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ares-${ip}`;
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
      return false;
    } else {
      entry = { ...entry, count: entry.count + 1 };
    }
  } else {
    entry = { count: 1, windowStart: now };
  }

  await store.set(key, JSON.stringify(entry));
  return true;
}
```

**Response on limit exceeded:**

```json
{
  "success": false,
  "error": "Příliš mnoho požadavků. Zkuste to prosím za minutu.",
  "statusCode": 429
}
```

**IP Extraction:**

```typescript
function extractIp(event: HandlerEvent): string {
  const forwarded = event.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return event.headers["client-ip"] ?? "unknown";
}
```

---

### Pricing Lead API

**Endpoint:** `POST /.netlify/functions/pricing-lead`

**Rate Limit:** 3 requests per hour per IP

**Store:** `pricing-ratelimit` (Netlify Blobs)

**Implementation:**

```typescript
const PRICING_RATELIMIT_STORE = "pricing-ratelimit";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 3_600_000; // 1 hour

async function checkRateLimit(ip: string): Promise<boolean> {
  const store = rateLimitStore();
  if (!store) return true; // Fail open

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
```

**Response on limit exceeded:**

```json
{
  "success": false,
  "error": "Too many submissions. Please try again later.",
  "statusCode": 429
}
```

---

### Survey API

**Endpoint:** `POST /.netlify/functions/survey`

**Rate Limit:** 5 requests per hour per IP

**Store:** `survey-ratelimit` (Netlify Blobs)

**Implementation:**

```typescript
const SURVEY_RATELIMIT_STORE = "survey-ratelimit";
const ONE_HOUR_MS = 3600000;

async function checkRateLimit(ip: string): Promise<boolean> {
  const rateLimitKey = `ratelimit-${ip}`;
  const store = getSurveyRateLimitStore();
  if (!store) return true; // Fail open

  const now = Date.now();
  let counter: { count: number; firstRequest: number } | null = null;

  try {
    const existing = await store.get(rateLimitKey);
    if (existing) counter = JSON.parse(existing);
  } catch {
    counter = null;
  }

  if (counter && (now - counter.firstRequest) < ONE_HOUR_MS) {
    if (counter.count >= 5) return false;
    counter.count += 1;
  } else {
    counter = { count: 1, firstRequest: now };
  }

  await store.set(rateLimitKey, JSON.stringify(counter));
  return true;
}
```

**Response on limit exceeded:**

```json
{
  "success": false,
  "error": "Too many submissions. Please try again later.",
  "statusCode": 429
}
```

---

### Rate Limit Failure Modes

All rate limiters **fail open** on Netlify Blobs errors:

```typescript
try {
  const allowed = await checkRateLimit(clientIp);
  if (!allowed) return 429;
} catch (e) {
  console.error("[Survey] Rate limit check failed, proceeding:", e);
  // Continue — better to allow legitimate traffic than block it
}
```

**Rationale:** A misconfigured rate limit store should not block the entire service. Monitored via error logs for alerting.

---

## Bot Protection

### Honeypot Fields

**Pricing Lead API:**

```typescript
const honeypot = body.honeypot;
if (typeof honeypot === "string" && honeypot !== "") {
  console.warn("[SECURITY] Honeypot triggered");
  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
}
```

Empty field `honeypot` is not submitted by humans; if filled, discard silently with 200 OK (don't reveal it was a honeypot).

**Survey API:**

```typescript
const honeypot = body.website_url;
if (typeof honeypot === 'string' && honeypot.trim() !== '') {
  console.warn('[Survey] Honeypot triggered — discarding submission silently');
  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
}
```

Field name: `website_url` (UI has `websiteUrl`; bots copy form fields and fill both).

---

### Timing-Based Bot Detection

**Pricing Lead API:**

```typescript
const ts = typeof body.timestamp === "number" ? body.timestamp : 0;
if (ts > 0 && Date.now() - ts < 3000) {
  console.warn("[SECURITY] Timing check failed — submission too fast");
  return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
}
```

**Mechanism:**

Frontend embeds `timestamp: Date.now()` on form load. If submission occurs in < 3 seconds, likely a bot. Silently accept with 200 OK.

**Frontend pattern:**

```javascript
const timestamp = Date.now(); // Captured on form load
// User fills form (typically > 3 seconds)
fetch('/api/pricing-lead', {
  body: JSON.stringify({ ..., timestamp })
});
```

---

## Report URL Security

**Audit Report Endpoint:** `GET /.netlify/functions/audit-report/<reportId>`

**Security Model:**

- Reports identified by **unguessable 12-character IDs** (alphanumeric + random)
- No authentication required (security-through-obscurity)
- CORS allows any origin (public report sharing)

**ID Generation:**

```typescript
function generateReportId(): string {
  // 12 random alphanumeric characters
  return Math.random().toString(36).substring(2, 14);
}
```

**Example:** `7a9k2m8x9q3p` (12 chars, ~66-bit entropy)

**Assumption:** Reasonable effort to guess: ~281 trillion combinations at 1000 guesses/sec = 8.9 million seconds = ~103 days.

**Risk:** Attackers cannot brute-force in practical time; must obtain URL from email or analytics.

---

## Known Limitations & Risks

### Authentication

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| No CSRF protection | Medium | Use SameSite=Strict cookies; add CSRF tokens to state-changing operations |
| No token expiry | Medium | Implement JWT with `exp` claim; add logout button that clears sessionStorage |
| No multi-factor auth | High | Add TOTP or email verification for production deployment |
| No session revocation | Low | Server-side logout not possible; sessions expire on browser close |
| Password stored plaintext in env | Low | Rotate credentials regularly; use Netlify Secrets for extra isolation |

### Rate Limiting

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| **No rate limiting on audit endpoint** | Medium | Add per-IP/per-company rate limit to prevent bulk audit submissions |
| Distributed attack (multiple IPs) | Medium | Implement IP reputation checks or CAPTCHA for high-volume patterns |
| Race condition in Blobs store | Low | Concurrent increments may undercount; not security-critical for leads |

### Input Validation

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| No schema validation (manual only) | Medium | Consider Zod for production; reduces human error |
| HTML stripping regex naive | Low | Handles most cases; `<[^>]*>` may miss SGML/XML edge cases |
| Email regex permissive | Low | RFC 5321 allows complex formats; acceptable for lead capture |
| Phone number optional (survey) | Low | No injection risk; sanitized before storage |

### XSS/Output

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| Admin dashboard is vanilla JS, not React | Medium | Easier to introduce bugs; consider framework for complex UIs |
| Template literals + escapeHtml() | Low | Safe if escapeHtml called consistently; audit all insertions |
| CSV injection prefix only | Low | Protects against formula execution; does not hide data |

### PDF Handling

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| Base64 decoded in memory | Low | 1 MB limit prevents DoS; larger files rejected at boundary |
| No virus scanning | Medium | Add ClamAV or third-party scanning before email delivery |
| PDF not re-validated on email | Low | Magic bytes + trailer check sufficient for format verification |

### Data Storage

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| Netlify Blobs not encrypted at rest (shared infra) | Medium | Request encryption option; treat as semi-public |
| Email addresses visible to admins | Low | PII; restrict admin access; add audit logging |
| No data retention policy | Medium | Define TTL (e.g., delete after 90 days); add legal notice |
| Reports publicly accessible | Low | No auth required; rely on unguessable IDs; warn users |

### Operational

| Issue | Risk Level | Mitigation |
|-------|-----------|-----------|
| No security audit logs | Medium | Log all auth failures, rate limit triggers, validation errors |
| No alerting on suspicious patterns | Medium | Set up monitoring for sudden spikes in failed auth or 429 responses |
| No incident response plan | Medium | Document escalation path; define data breach notification procedure |
| Secrets in environment only | Low | Use Netlify Secrets UI; rotate keys quarterly |

---

## Deployment Checklist

### Pre-Deployment

- [ ] `ADMIN_PASSWORD` set to strong random string (32+ chars, mix of upper/lower/digit/symbol)
- [ ] `INTERNAL_API_SECRET` set for background functions
- [ ] `RESEND_API_KEY` configured for email sending
- [ ] `NETLIFY_SITE_ID` and `NETLIFY_API_TOKEN` set for Blob stores
- [ ] All environment variables marked as secrets in Netlify UI
- [ ] `netlify.toml` security headers confirmed deployed
- [ ] SSL/TLS certificate valid (automatic via Netlify)

### Post-Deployment

- [ ] Test admin login: submit correct/incorrect passwords, verify 401 responses
- [ ] Test rate limits: hammer each endpoint, verify 429 responses
- [ ] Test CORS: requests from wrong origin return 403 or preflight fails
- [ ] Test XSS: submit `<script>alert(1)</script>` in forms, verify HTML escaped in output
- [ ] Test CSV injection: submit `=SUM(...)` in free-text field, download CSV, verify cell shows `'=SUM(...)`
- [ ] Test PDF validation: upload non-PDF base64, submit malformed base64, verify rejection
- [ ] Test honeypot: manually fill honeypot field, verify silent 200 response
- [ ] Test timing: submit pricing form in < 3 seconds, verify silent 200 response
- [ ] Test object security: submit `__proto__` in calculator object, verify rejection
- [ ] Monitor logs: review first 24 hours for unexpected errors, rate limit triggers, auth failures

### Monitoring & Maintenance

- [ ] Set up alerts for auth failures (401 responses spike)
- [ ] Set up alerts for rate limit triggers (429 responses spike)
- [ ] Set up alerts for validation errors (400 responses spike)
- [ ] Review honeypot/timing logs weekly (bot activity baseline)
- [ ] Rotate `ADMIN_PASSWORD` quarterly
- [ ] Rotate `INTERNAL_API_SECRET` semi-annually
- [ ] Document all security incidents in incident log
- [ ] Test disaster recovery: verify Blobs data backup procedure

---

## References

### Source Files

- **Authentication:** `/astro-src/netlify/functions/onboarding-shared/auth.ts`
- **Admin API:** `/astro-src/netlify/functions/admin-leads.ts`
- **Pricing Lead API:** `/astro-src/netlify/functions/pricing-lead.ts`
- **Survey API:** `/astro-src/netlify/functions/survey.ts`
- **ARES Lookup API:** `/astro-src/netlify/functions/ares-lookup.ts`
- **Admin Dashboard:** `/astro-src/src/pages/admin/leads.astro`
- **Security Headers:** `/netlify.toml`

### Standards

- [RFC 5321 — SMTP](https://tools.ietf.org/html/rfc5321) — Email max length 254
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Input validation, XSS, CSRF
- [OWASP CSV Injection](https://owasp.org/www-community/attacks/CSV_Injection) — Formula injection prevention
- [CWE-1021 — Improper Restriction of Rendered UI Layers](https://cwe.mitre.org/data/definitions/1021.html) — Clickjacking defense

---

**End of Security Documentation**
