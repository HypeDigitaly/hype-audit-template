# Netlify Functions Documentation

Complete technical reference for all serverless backend functions powering the HypeDigitaly platform.

**Last Updated:** 2026-03-19
**Status:** Production (13 active functions)

---

## Table of Contents

1. [Audit Functions](#audit-functions)
2. [Lead Management Functions](#lead-management-functions)
3. [Shared Utilities](#shared-utilities)
4. [Configuration & Deployment](#configuration--deployment)
5. [Security Considerations](#security-considerations)

---

## Audit Functions

### 1. audit.ts — Synchronous Audit Entry Point

**File Path:** `astro-src/netlify/functions/audit.ts`

**Purpose:** Synchronous fallback handler for AI audit requests. Executes full audit workflow (validation, research, report generation, emails) with 60-second timeout.

**HTTP Method:** POST

**Route:** `/api/audit` → `/.netlify/functions/audit`

**Input Schema (JSON or URL-encoded):**

```typescript
interface AuditFormData {
  email: string;                    // Required. User's contact email
  website: string;                  // Required. Company website URL
  companyName: string;              // Required. Legal or trading name
  city: string;                     // Required. City/region
  biggestPainPoint: string;         // Optional. Key business challenge
  currentTools: string;             // Optional. Existing software stack
  language: 'cs' | 'en';            // Default 'cs'. Response language
  leadSource?: string;              // Source identifier (e.g., 'homepage-hero')
  utmSource?: string;               // Google Analytics parameter
  utmMedium?: string;               // Google Analytics parameter
  utmCampaign?: string;             // Google Analytics parameter
  utmContent?: string;              // Google Analytics parameter
  utmTerm?: string;                 // Google Analytics parameter
  gclid?: string;                   // Google Ads click ID
  fbclid?: string;                  // Facebook Ads click ID
  msclkid?: string;                 // Microsoft Ads click ID
  referrer?: string;                // HTTP Referer header
}
```

**Processing Steps:**

1. **CORS & Method Validation** — Accept POST with `*` origin, handle OPTIONS preflight
2. **Parse Request Body** — Support JSON and URL-encoded content types
3. **Language Detection** — Extract and validate language parameter (default Czech)
4. **Field Validation** — Validate required fields with language-aware error messages
5. **API Key Checks** — Verify RESEND_API_KEY, TAVILY_API_KEY, OPENROUTER_API_KEY presence
6. **AI Field Validation (Step 0.5)** — Call `validateFormWithAI()` to validate form content (website, email format, company name legitimacy, text coherence)
7. **LangGraph Execution (Step 1)** — Call `executeDeepResearch()` for deep research or fallback if agent fails
8. **HTML Report Generation (Step 2)** — Generate styled HTML report via `generateHTMLReport()`
9. **Blob Storage (Step 2.5)** — Store:
   - Report HTML with metadata (company name, email, generated/expiration dates)
   - Report metadata separately (for expiration checking)
   - Lead record in audit-leads store
10. **Netlify Forms Mirror** — Submit to Netlify Forms for dashboard visibility
11. **Team Notification (Step 3)** — Email team with lead data and report link via Resend
12. **User Confirmation (Step 4)** — Email user with report link (no PDF attachment)

**Response Formats:**

**Success (200):**
```json
{
  "success": true,
  "message": "Váš Hloubkový AI Audit byl úspěšně odeslán na váš e-mail!"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Pole 'E-mail' je povinné.",
  "validationErrors": {
    "email": { "isValid": false, "errorMessage": "..." }
  }
}
```

**Configuration Error (500):**
```json
{
  "success": false,
  "error": "Konfigurace e-mailu není dokončena."
}
```

**Environment Variables Required:**
- `RESEND_API_KEY` — Email delivery service
- `TAVILY_API_KEY` — Web search capability
- `OPENROUTER_API_KEY` — LLM via OpenRouter
- `NETLIFY_SITE_ID` — Blobs authentication
- `NETLIFY_API_TOKEN` — Blobs authentication

**Timeout:** 60 seconds (sync function)

**Notes:**
- Synchronous path — unsuitable for slow/complex queries beyond 30 seconds
- Fallback report generated if LangGraph agent fails
- All email failures are non-blocking; report is still stored

---

### 2. audit-background.ts — Asynchronous Audit Orchestrator

**File Path:** `astro-src/netlify/functions/audit-background.ts`

**Purpose:** Background function that processes audit requests asynchronously over up to 15 minutes. Returns 202 Accepted immediately; frontend polls for progress.

**HTTP Method:** POST

**Route:** `/api/audit-background` (client generated UUID jobId)

**Input Schema (JSON):**

```typescript
interface AuditBackgroundRequest {
  jobId: string;                    // Required. Client-generated UUID (v4 recommended)
  email: string;                    // Required
  website: string;                  // Required
  companyName: string;              // Required
  city: string;                     // Required
  biggestPainPoint?: string;        // Optional
  currentTools?: string;            // Optional
  language: 'cs' | 'en';            // Default 'cs'
  leadSource?: string;              // Track conversion source
  utmSource?: string;               // UTM tracking
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}
```

**Processing Steps (8-stage pipeline):**

1. **Request Parsing & Job Initialization** — Parse JSON, validate jobId, initialize job record in Blobs with 'pending' status
2. **Basic Validation** — Validate required fields; fail job on validation errors
3. **AI-Powered Field Validation** — Run AI validation; fail job if invalid (non-blocking)
4. **Fetch Company Branding (Firecrawl)** — Optional Firecrawl integration to extract logo, favicon, brand colors (non-critical, continues on failure)
5. **Execute LangGraph Deep Research Agent v3** — Call research agent with progress tracking callback; switch to fallback report on failure
6. **Generate HTML Report** — Generate styled HTML report
7. **Store Report & Lead Data** — Store in Blobs and Netlify Forms
8. **Send Emails** — Send team notification and user confirmation in parallel
9. **Mark Job Complete** — Update job status to 'completed'

**Response Format:**

Returns 202 immediately:
```json
{
  "statusCode": 202,
  "body": ""
}
```

Frontend polls `/api/audit-status?jobId=xxx` for progress (see audit-status.ts below).

**Job Status in Blobs:**

```typescript
interface AuditJob {
  jobId: string;
  status: 'pending' | 'validating' | 'researching' | 'generating' | 'storing' | 'emailing' | 'completed' | 'failed';
  progress: 0-100;
  statusMessage?: string;
  currentSubStep?: ResearchStep;
  subStepMessage?: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  language: 'cs' | 'en';
  reportId?: string;
  reportUrl?: string;
  error?: string;
  validationErrors?: Record<string, { isValid: boolean; errorMessage?: string }>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**Environment Variables Required:**
- Same as audit.ts, plus FIRECRAWL_API_KEY (optional)

**Timeout:** 900 seconds (15 minutes — configured in netlify.toml or function settings)

**Notes:**
- Returns 202 immediately (Netlify background function behavior)
- Processing continues in background for up to 15 minutes
- Progress updates stored in Blobs for frontend polling
- Granular progress callbacks from research agent included in v3+
- Company branding fetch optional; non-critical

---

### 3. audit-status.ts — Job Progress Polling Endpoint

**File Path:** `astro-src/netlify/functions/audit-status.ts`

**Purpose:** Poll endpoint for frontend to track background audit progress in real-time.

**HTTP Method:** GET

**Route:** `/api/audit-status?jobId=xxx`

**Query Parameters:**

```
jobId (required) — UUID of the job to check
```

**Response (200):**

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "researching",
  "progress": 45,
  "statusMessage": "Provádím hloubkový výzkum...",
  "currentSubStep": "web_research",
  "subStepMessage": "Zkoumám web...",
  "companyName": "Vzorová Firma",
  "reportId": null,
  "reportUrl": null,
  "error": null,
  "validationErrors": null,
  "createdAt": "2026-03-19T10:00:00Z",
  "updatedAt": "2026-03-19T10:00:15Z",
  "completedAt": null
}
```

**Status Codes:**

- `200` — Job found or pending (not initialized yet)
- `400` — Missing jobId query parameter
- `500` — Internal error fetching status

**CORS:** `Access-Control-Allow-Origin: *`

**Environment Variables Required:**
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

**DUPLICATION ISSUES (TO FIX):**

1. **Local getJobsStore() duplication** (line 14-28):
   - Current: Function defined locally in audit-status.ts
   - Should: Import from `audit-shared/storage.ts`
   - Issue: Creates maintenance burden, inconsistent config

2. **AuditJob type import from wrong module** (line 3):
   - Current: Imports `AuditJob` from `audit-background.ts` type export
   - Should: Import from `audit-shared/types.ts`
   - Issue: Circular dependency risk, makes refactoring brittle

**Fix Priority:** High — standardize imports across audit functions

---

### 4. audit-report.ts — Report Serving Endpoint

**File Path:** `astro-src/netlify/functions/audit-report.ts`

**Purpose:** Serve pre-generated HTML audit reports stored in Netlify Blobs. Handles report retrieval, expiration checking, and error pages.

**HTTP Method:** GET

**Route:** `/report/{reportId}` (via _redirects force rule)

**URL Routing (in _redirects):**

```
/report/*  /.netlify/functions/audit-report/:splat  200!
```

The `200!` status with `!` suffix forces this rule to override Astro's SSR handler, ensuring reports always route to the function (not 301/302, not SSR processing).

**Report ID Format:**

Reports generated as UUIDs (e.g., `e0bdf8e1-2e0b-4f1a-b0f8-9c3e7f6e5d4c`)

**Processing:**

1. Extract reportId from URL path
2. Validate reportId format
3. Fetch HTML from audit-reports Blob store
4. Check metadata expiration (30-day window)
5. Delete expired reports + metadata
6. Return HTML or error page

**Response (200):**

```
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
X-Report-ID: <reportId>

[HTML report content]
```

**Error Responses:**

**404 (Report Not Found):**
- Custom error page with link to create new audit
- Includes HypeDigitaly logo

**410 (Report Expired):**
- Expired after 30 days
- Custom error page with "New Audit" and "Consultation" CTAs
- Offers calendar link to book meeting

**400 (Invalid Report ID):**
- Missing or malformed reportId

**500 (Server Error):**
- Blob store error or other internal failure

**Error Page Content:**
- Dark theme (#0A0A0A background)
- Bilingual support (Czech default)
- CTA buttons with proper styling
- Logo and messaging

**Environment Variables Required:**
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

**Hardcoded Production URLs:**
- CTA links: `https://hypedigitaly.ai/audit` (new audit page)
- Consultation calendar: `https://cal.com/hypedigitaly-pavelcermak/30-min-online`
- Logo: `https://hypedigitaly.ai/assets/images/HD_Color_white.png`

**Cache Headers:**
- `Cache-Control: public, max-age=3600` — 1 hour browser cache
- Reports cached for 1 hour; metadata checks on each request

---

### 5. audit-validate.ts — Validation-Only Fast Endpoint

**File Path:** `astro-src/netlify/functions/audit-validate.ts`

**Purpose:** Fast validation-only endpoint (no research/report/emails). Returns when AI validation completes (~1-3 seconds). Allows frontend to show validation progress bar that ends at realistic timeframe, not when full audit finishes.

**HTTP Method:** POST

**Route:** `/api/audit-validate`

**Input Schema:** Same as audit.ts (6 required fields + optional tracking)

**Processing Steps:**

1. Parse and extract form data
2. Detect language
3. Validate required fields (email, website, company name, city)
4. Validate email format (regex)
5. Validate URL format
6. Check OPENROUTER_API_KEY
7. Run AI validation (OpenRouter)
8. Return success or field-level errors

**Response (200 on success):**

```json
{
  "success": true,
  "isValid": true,
  "message": "Validace úspěšná. Spouštíme audit..."
}
```

**Response (400 on validation failure):**

```json
{
  "success": false,
  "isValid": false,
  "error": "Některá pole obsahují neplatné údaje.",
  "validationErrors": {
    "email": { "isValid": false, "errorMessage": "..." }
  }
}
```

**Response (200 on config error — graceful fallback):**

```json
{
  "success": true,
  "isValid": true,
  "message": "Validation skipped (config issue)"
}
```

**CORS:** `*` origin

**Timeout:** 30 seconds (should complete in 1-3 seconds with fast LLM)

**Design Pattern:**

Frontend flow:
```
1. Call /audit-validate → show "Validating..." progress
2. Wait for response (1-3 seconds)
3. On success: transition to /audit-background call
4. Poll /audit-status for full audit progress (up to 15 min)
```

This avoids showing progress stuck at "Validating..." for full audit duration.

---

### 6. audit-templates.ts — Email Template Utilities

**File Path:** `astro-src/netlify/functions/audit-templates.ts`

**Purpose:** Email template generators for audit notifications and confirmations. No HTTP handler; exports only.

**Exported Functions:**

```typescript
export function generateAuditNotificationEmailHTML(
  data: AuditFormData,
  reportId: string,
  reportUrl: string
): string

export function generateAuditNotificationEmailText(
  data: AuditFormData,
  reportId: string,
  reportUrl: string
): string

export function generateAuditConfirmationEmailHTML(
  data: AuditFormData,
  reportId: string,
  reportUrl: string
): string

export function generateAuditConfirmationEmailText(
  data: AuditFormData,
  reportId: string,
  reportUrl: string
): string
```

**Notification Email (To Team):**
- Language: Always Czech (internal team)
- Recipients: pavelcermak@hypedigitaly.ai, cermakova@hypedigitaly.ai
- Content: Company details, pain point, tools, report link
- Subject: "Nový lead: AI Předběžný audit - [Company Name]"

**Confirmation Email (To User):**
- Language: Bilingual (Czech/English based on form.language)
- Recipient: User's email
- Content: Report link, explanation of audit contents, consultation CTA
- Subject: Bilingual:
  - Czech: "AI Předběžný audit pro [Company Name]"
  - English: "AI Preliminary audit for [Company Name]"

**Template Features:**
- HTML escaping (prevents XSS)
- Industry labels lookup (e.g., 'it_software' → 'IT a software')
- Responsive design for mobile
- HypeDigitaly branding

**Hardcoded URLs in Templates:**
- Logo: `https://hypedigitaly.ai/assets/images/HD_Color_white.png`
- Consultation calendar: `https://cal.com/hypedigitaly-pavelcermak/30-min-online`
- Company info link: `https://hypedigitaly.ai` (in footer)
- Google Reviews link: `https://share.google/NBARzHErNEaSPxGKF`
- Social media: LinkedIn, Instagram, Facebook

---

## Lead Management Functions

### 7. admin-leads.ts — Unified Leads API

**File Path:** `astro-src/netlify/functions/admin-leads.ts`

**Purpose:** Admin dashboard API endpoint for fetching all leads across 5 stores (audit, contact, survey, onboarding, pricing). Supports filtering and search.

**HTTP Method:** GET

**Route:** `/api/admin-leads`

**Authentication:** Bearer token (ADMIN_PASSWORD via Authorization header)

**Query Parameters:**

```
source             Filter by lead source ('audit', 'contact', 'survey', 'onboarding', 'pricing-calculator')
search             Search term (email, company name, name, website — case-insensitive)
leadSource         Filter by leadSource field (e.g., 'gc-event-page')
from               Start date (ISO format)
to                 End date (ISO format)
```

**Example:**
```
GET /api/admin-leads?source=audit&search=abc&from=2026-03-01&to=2026-03-31
Authorization: Bearer <ADMIN_PASSWORD>
```

**Response (200):**

```json
{
  "success": true,
  "total": 150,
  "totalAudit": 45,
  "totalContact": 30,
  "totalSurvey": 25,
  "totalOnboarding": 40,
  "totalPricing": 10,
  "totalGcEvent": 25,
  "leads": [
    {
      "id": "lead-1234567890-abcdef",
      "source": "audit",
      "email": "contact@company.cz",
      "companyName": "Company s.r.o.",
      "website": "company.cz",
      "city": "Prague",
      "submittedAt": "2026-03-19T10:00:00Z",
      "reportUrl": "https://hypedigitaly.ai/report/...",
      "detectedIndustry": "it_software",
      "leadSource": "homepage-hero",
      "utmSource": "google",
      "utmMedium": "cpc",
      "utmCampaign": "spring-2026"
    }
  ]
}
```

**Blob Store Aggregation (N+5 Query Pattern):**

```
1. Fetch _leads_index from audit-leads store
2. For each lead ID, fetch lead object (parallel)
3. Repeat for contact-leads
4. Repeat for survey-leads
5. Repeat for onboarding-leads
6. Repeat for pricing-leads
7. Merge, sort by submittedAt (newest first)
8. Apply filters and search
```

**N+5 Performance Note:**
- 5 index fetches + multiple lead object fetches
- Consider implementing caching for large lead volumes (100+ per store)
- Alternative: implement aggregated index

**CORS:**
```
Origin: https://hypedigitaly.ai (locked)
Methods: GET, OPTIONS
```

**Authentication:**
- Bearer token: `Authorization: Bearer <ADMIN_PASSWORD>`
- Constant-time comparison via `verifyAdminAuth()` from `onboarding-shared/auth.ts`

**Response on Auth Failure (401):**
```json
{
  "error": "Unauthorized. Invalid password."
}
```

**Environment Variables:**
- `ADMIN_PASSWORD` — Secret for admin access
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

---

### 8. admin-leads-delete.ts — Lead Deletion API

**File Path:** `astro-src/netlify/functions/admin-leads-delete.ts`

**Purpose:** Bulk delete leads and optionally associated reports. Supports prefix-based dispatch (lead-, contact-, survey-, pricing-).

**HTTP Method:** POST

**Route:** `/api/admin-leads-delete`

**Authentication:** Same as admin-leads.ts

**Request Schema:**

```json
{
  "leadIds": ["lead-123...", "contact-456...", "survey-789..."],
  "deleteReports": true
}
```

**Request Validation:**
- `leadIds` must be non-empty array
- Max 100 leads per request
- Each ID must be string, 1-200 chars
- Auth check before parsing body (defense-in-depth)

**Processing:**

1. Authenticate via Bearer token
2. Validate request structure
3. For each leadId:
   - Determine type by prefix (lead-, contact-, survey-, pricing-)
   - Delete lead from appropriate store
   - If audit lead + deleteReports: delete report HTML and metadata
   - Track successful deletions and errors
4. Update leads indices (remove deleted IDs)
5. Return summary

**Response (200):**

```json
{
  "success": true,
  "deletedCount": 3,
  "errors": [
    {
      "leadId": "nonexistent-id",
      "error": "Lead not found"
    }
  ]
}
```

**Lead Type Dispatch:**

| Prefix     | Store              | Delete Function        |
|------------|-------------------|------------------------|
| `lead-`   | audit-leads       | `deleteAuditLead()`   |
| `contact-`| contact-leads     | `deleteContactLead()` |
| `survey-` | survey-leads      | `deleteSurveyLead()`  |
| `pricing-`| pricing-leads     | `deletePricingLead()` |

**Audit Lead Special Case:**
- If `deleteReports: true`, also delete from audit-reports store:
  - Delete report HTML: `{reportId}`
  - Delete metadata: `{reportId}-meta`
- Non-fatal on report deletion failure; lead still deleted

**Index Cleanup:**
```typescript
async function updateLeadsIndex(storeName: string, deletedIds: string[]): Promise<void>
  // Read _leads_index
  // Filter out deleted IDs
  // Write updated index
```

**CORS:** Same as admin-leads.ts (https://hypedigitaly.ai)

**Limits:**
- Max 100 leads per request
- Max 200 chars per lead ID

**Environment Variables:** Same as admin-leads.ts

---

### 9. contact.ts — Contact Form Handler

**File Path:** `astro-src/netlify/functions/contact.ts`

**Purpose:** Process contact form submissions. Stores leads in Netlify Blobs, mirrors to Netlify Forms, sends team notification and user confirmation.

**HTTP Method:** POST

**Route:** `/api/contact`

**Input Schema (JSON or URL-encoded):**

```typescript
interface ContactFormData {
  name: string;                 // Required
  email: string;                // Required
  phone?: string;               // Optional
  website?: string;             // Optional
  service?: string;             // Optional (service category)
  budget_onetime?: string;      // Optional (one-time budget)
  budget_monthly?: string;      // Optional (monthly budget)
  message?: string;             // Optional (free-form message)
  language?: 'cs' | 'en';       // Default 'cs'
  leadSource?: string;          // Source identifier
  utmSource?: string;           // UTM tracking
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}
```

**Processing Steps:**

1. Parse request body (JSON or URL-encoded)
2. Validate required fields (name, email)
3. Validate email format
4. Generate unique lead ID (prefix: contact-{timestamp}-{random})
5. Store lead in contact-leads Blob store + update index
6. Mirror to Netlify Forms
7. Send team notification email (always Czech)
8. Send user confirmation email (bilingual)

**Response (200):**

```json
{
  "success": true,
  "message": "Zpráva byla úspěšně odeslána!"
}
```

**Response (400):**

```json
{
  "success": false,
  "error": "Jméno a e-mail jsou povinné údaje."
}
```

**Emails Sent:**

**Team Notification:**
- To: pavelcermak@hypedigitaly.ai, cermakova@hypedigitaly.ai
- Subject: "🆕 Nový zájemce: [Name] – [Service]"
- Content: Name, email, phone, website, service, budgets, message

**User Confirmation:**
- To: User's email
- Subject: "Potvrzení: Vaše poptávka pro HypeDigitaly byla přijata" (Czech) / "Confirmation: Your inquiry..." (English)
- Content: Acknowledgment, next steps, contact info

**CORS:** `*` origin

**Environment Variables:**
- `RESEND_API_KEY` — Email delivery
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

**Non-blocking Operations:**
- Lead storage failure: non-fatal, continues
- Netlify Forms submission: non-fatal
- Confirmation email: non-fatal (awaited to prevent premature termination)

---

### 10. survey.ts — Survey Form Handler

**File Path:** `astro-src/netlify/functions/survey.ts`

**Purpose:** Process Pain-Point Discovery Survey submissions. Includes honeypot, rate limiting (5/hour/IP), comprehensive validation, and email notifications.

**HTTP Method:** POST

**Route:** `/api/survey`

**Input Schema (JSON):**

```typescript
interface SurveyLead {
  email: string;                  // Required, 254 chars max
  companyName: string;            // Required, 200 chars max
  industry: string;               // Required (free-form)
  companySize: 'solo'|'2-10'|'11-50'|'51-250'|'250+'; // Required enum
  painPoints: string[];           // Required array, 1-18 items
  primaryPainPoint: string;       // Required (free-form)
  aiMaturity: 'none'|'experimenting'|'active'|''; // Optional enum
  hoursLostPerWeek: '1-5'|'5-10'|'10-20'|'20-40'|'40+'|''; // Optional
  contextNote: string;            // Optional, 500 chars max
  language: 'cs'|'en';            // Default 'cs'

  // Optional additional fields
  city?: string;                  // 100 chars max
  phoneNumber?: string;           // Validated phone format
  toolsUsed?: string[];           // Array of tools
  websiteUrl?: string;            // URL (http/https only)
  respondentRole?: string;        // Enum: owner_ceo, sales_manager, ...
  biggestManualProcess?: string;
  crmUsed?: string;               // Enum: none, excel, hubspot_pipedrive, ...
  erpUsed?: string;               // Enum: none, pohoda, abra_helios, ...
  manualWorkPercentage?: string;
  techOpenness?: string;          // Enum: conservative, open, innovator
  techLevel?: string;             // Enum: none, beginner, intermediate, advanced
  topExamples?: string[];         // Enum array, max 3, supports 'other:text'

  // Tracking
  leadSource: 'gc-event-page';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;

  // System fields
  id: string;
  source: 'survey';
  submittedAt: string;
}
```

**Processing Steps:**

1. **Preflight** — Handle OPTIONS, validate POST method
2. **Body Size Check** — Reject > 15 KB
3. **Parse JSON** — Validate JSON structure
4. **Honeypot Check** — Silent accept (200) if honeypot field filled
5. **Rate Limiting** — Per-IP: max 5 requests/hour
   - Extract client IP from x-forwarded-for or client-ip
   - Sanitize IP (remove special chars, max 45 chars)
   - Track in separate "survey-ratelimit" store
   - Return 429 if limit exceeded
6. **Validate Required Fields** — Email, company name, pain points, company size, industry
7. **Sanitize & Validate Enums** — Company size, AI maturity, hours lost, tech level, respondent role, CRM, ERP, tech openness
8. **Validate Optional Fields** — Phone number format, website URL protocol validation
9. **HTML Stripping** — Remove tags from free-text fields
10. **Store Lead** — Save to survey-leads store + update index
11. **Mirror to Netlify Forms** — Fire-and-forget
12. **Send Emails** — Parallel (team notification + user confirmation)

**Honeypot Implementation:**

Field name: `website_url` (honeypot, not same as `websiteUrl` optional field)

```typescript
const honeypot = body.website_url;
if (typeof honeypot === 'string' && honeypot.trim() !== '') {
  // Silent 200 — discard submission
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
```

**Rate Limiting (5 per hour per IP):**

```typescript
interface RateLimitCounter {
  count: number;
  firstRequest: number;  // Timestamp
}

// Per-IP key: ratelimit-{sanitized_ip}
// Window: 3600000 ms (1 hour)
// Limit: 5 requests
```

Fails open on store errors (logging alert at error level).

**Phone Validation:**

Accepts international format, sanitizes to digits + leading +, validates 7-15 digits.

```
Input: "+420 774 996 248" → Stored: "+420774996248"
```

**URL Validation:**

Only http:// or https:// protocols allowed. Auto-prefixes https:// if domain-like.

```
Input: "company.cz" → Stored: "https://company.cz"
Input: "http://test" → Stored: "http://test"
Input: "ftp://no" → Stored: "" (rejected, invalid protocol)
```

**Response (200):**

```json
{ "success": true }
```

**Response (400):**

```json
{
  "success": false,
  "errors": {
    "email": "Zadejte platnou e-mailovou adresu.",
    "painPoints": "Vyberte alespon jedno bolestive miste."
  }
}
```

**Response (429 - Rate Limited):**

```json
{
  "success": false,
  "error": "Too many submissions. Please try again later."
}
```

**CORS:**

```
Origin: https://hypedigitaly.ai
Methods: POST, OPTIONS
```

**Emails:**

**Team Notification:**
- To: pavelcermak@hypedigitaly.ai, cermakova@hypedigitaly.ai
- Subject: "Nový průzkum: [Company Name] ([Industry])"
- Content: Company details, pain points, AI maturity, hours lost, survey responses

**User Confirmation:**
- To: Lead's email
- Subject: Language-based (Czech: "Děkujeme za vypružený průzkum" / English: "Thank you for completing the survey")
- Content: Acknowledgment, next steps

**Environment Variables:**
- `RESEND_API_KEY`
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

**Validation Enums:**

```typescript
VALID_COMPANY_SIZES = ["solo", "2-10", "11-50", "51-250", "250+"]
VALID_AI_MATURITY = ["none", "experimenting", "active"]
VALID_HOURS_LOST = ["1-5", "5-10", "10-20", "20-40", "40+"]
VALID_PAIN_POINTS = [
  'new_customers', 'speed_to_lead', 'automating_communication',
  'customer_support', 'boring_admin', 'reporting_data',
  'juggling_tools', 'integrating_ai', 'marketing_materials',
  'content_creation', 'manual_data_entry', 'document_processing',
  'invoicing', 'scheduling', 'employee_onboarding',
  'knowledge_silos', 'delegation'
]
VALID_TECH_LEVELS = ["none", "beginner", "intermediate", "advanced"]
VALID_TOP_EXAMPLES = [
  'auto_leads', 'ai_web', 'ai_assistant', 'ai_phone_management',
  'voice_blog', 'ai_avatar_reels', 'ai_lead_magnet'
]
```

---

### 11. pricing-lead.ts — Pricing Calculator Lead Handler

**File Path:** `astro-src/netlify/functions/pricing-lead.ts`

**Purpose:** Handle pricing calculator submissions with base64 PDF attachment. Includes honeypot, timing check, rate limiting (3/hour/IP), and PDF validation (magic bytes + trailer).

**HTTP Method:** POST

**Route:** `/api/pricing-lead`

**Input Schema (JSON):**

```typescript
interface PricingLeadSubmission {
  name: string;                      // Required, 100 chars max
  email: string;                     // Required, valid email
  companyName: string;               // Required, 200 chars max
  pdf: string;                       // Required, base64 encoded PDF (1 MB max)
  language: 'cs'|'en';               // Default 'cs'
  consent: boolean;                  // Required, must be true
  consentVersion?: string;           // Default 'pricing-lead-v1'
  calculatorState: Record<string, unknown>;  // Required, plain object, max 10 keys
  calculatorResults: Record<string, unknown>; // Required, plain object, max 15 keys
  honeypot?: string;                 // Security field (should be empty)
  timestamp?: number;                // Client timestamp in ms (timing check)
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    gclid?: string;
    fbclid?: string;
    referrer?: string;
  };
}
```

**Security Measures:**

1. **CORS Lock** — Origin: https://hypedigitaly.ai only
2. **Honeypot** — Field name configurable (silent 200 if filled)
3. **Timing Check** — If submitted in < 3 seconds, likely bot (silent 200)
4. **Rate Limiting** — 3 req/hour/IP via "pricing-ratelimit" store
5. **PDF Validation** — Magic bytes (%PDF), %%EOF trailer, size < 1 MB
6. **Input Validation** — HTML stripping, explicit field destructuring (no spread)
7. **Base64 Validation** — Regex check before binary decode

**Processing Steps:**

1. **Preflight & Method Guard** — OPTIONS/POST only
2. **Content-Type Guard** — application/json required (415 if not)
3. **Body Size Guard** — Reject > 4 MB
4. **Parse JSON**
5. **Honeypot Check** — Silent 200 if triggered
6. **Timing Check** — Silent 200 if submitted < 3 seconds (Now - Timestamp)
7. **Rate Limit Check** — 429 if exceeded
8. **Input Validation** — Name, email, company (all required, size capped)
9. **PDF Base64 Validation** — Check presence, regex, size
10. **PDF Binary Validation** — Decode base64, check magic bytes:
    - Bytes 0-3 must be: 0x25 0x50 0x44 0x46 (%PDF)
    - Last 1024 bytes must contain %%EOF
11. **Calculator Object Validation** — Plain objects, max keys/depth, no prototype pollution
12. **Build Lead Object** — Explicit field list, never spread raw body
13. **Store Lead** — Save to pricing-leads store
14. **Send Emails** — Parallel:
    - User email with PDF attachment
    - Team notification (no PDF)

**Response (200):**

```json
{ "success": true }
```

**Response (400):**

```json
{ "success": false, "error": "Name is required" }
```

**Response (413):**

```json
{ "success": false, "error": "PDF exceeds 1 MB limit" }
```

**Response (415):**

```json
{ "success": false, "error": "Content-Type must be application/json" }
```

**Response (429):**

```json
{ "success": false, "error": "Too many submissions. Please try again later." }
```

**Rate Limiting:**

```
Limit: 3 requests per hour per IP
Store: pricing-ratelimit
Key pattern: rate-{sanitized_ip}
```

**Timing Check:**

```javascript
const ts = body.timestamp;  // Client time in ms
if (ts > 0 && Date.now() - ts < 3000) {
  // Submitted in less than 3 seconds — likely bot
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}
```

**PDF Magic Bytes Validation:**

```
Expected: %PDF (0x25 0x50 0x44 0x46)
Trailer: %%EOF within last 1024 bytes
```

**Email Attachments:**

**User Email:**
- From: HypeLead.ai <noreply@notifications.hypedigitaly.ai>
- To: Lead's email
- Subject: Language-based ("Vaše cenová nabídka" / "Your pricing offer")
- Attachment: PDF as base64, filename: "hypelead-cenova-nabidka.pdf"

**Team Email:**
- From: HypeLead.ai <noreply@notifications.hypedigitaly.ai>
- To: pavelcermak@hypedigitaly.ai
- Subject: "Nový zájemce z ceníku: [Name]"
- No attachment

**CORS:**

```
Origin: https://hypedigitaly.ai (locked)
Methods: POST, OPTIONS
```

**Environment Variables:**
- `RESEND_API_KEY`
- `NETLIFY_SITE_ID` (fallback: NETLIFY_AUTH_TOKEN)
- `NETLIFY_API_TOKEN`

**Constants:**

```typescript
PDF_BASE64_MAX = 1_398_102;     // ~1 MB binary
BODY_MAX_CHARS = 4_000_000;     // 4 MB guard
RATE_LIMIT_MAX = 3;
RATE_LIMIT_WINDOW_MS = 3_600_000; // 1 hour
```

---

### 12. ares-lookup.ts — Czech Company Registry Lookup

**File Path:** `astro-src/netlify/functions/ares-lookup.ts`

**Purpose:** Query Czech ARES v3 API for company information by IČO (business registration number). Rate limited (10 req/min/IP).

**HTTP Method:** GET

**Route:** `/api/ares-lookup?q=<ICO>`

**Query Parameters:**

```
q (required) — 8-digit Czech IČO number
```

**IČO Validation:**

- Must be exactly 8 digits
- Format: `isValidIco(q)` from `onboarding-services/ares-client.ts`

**Processing:**

1. Extract & validate q parameter
2. Check IČO format
3. Rate limit (10 per 60 seconds per IP)
4. Query ARES v3 via `lookupCompanyByIco(q)`
5. Return normalized company data or 404

**Response (200):**

```json
{
  "success": true,
  "data": {
    "ico": "12345678",
    "name": "Company s.r.o.",
    "address": "Street 123, 110 00 Prague 1",
    "established": "2020-01-15",
    "legalForm": "Private Limited Company",
    "status": "Active"
  }
}
```

**Response (404 - Not Found):**

```json
{
  "success": false,
  "error": "Firma s tímto IČO nebyla nalezena v registru ARES."
}
```

**Response (400 - Bad Request):**

```json
{
  "success": false,
  "error": "Neplatný formát IČO. IČO musí obsahovat přesně 8 číslic."
}
```

**Response (429 - Rate Limited):**

```json
{
  "success": false,
  "error": "Příliš mnoho požadavků. Zkuste to prosím za minutu."
}
```

**Rate Limiting (10 per 60 seconds per IP):**

```typescript
const RATE_LIMIT_WINDOW_MS = 60_000;  // 1 minute
const RATE_LIMIT_MAX = 10;

// Key: ares-{ip}
// Entry: { count, windowStart }
```

Fails open on store errors (logs warning).

**CORS:**

```
Origin: https://hypedigitaly.ai
Methods: GET, OPTIONS
Max-Age: 86400 (1 day)
```

**Environment Variables:**
- `NETLIFY_SITE_ID`
- `NETLIFY_API_TOKEN`

**External API:**
- ARES v3 API (Czech company registry)
- Called via `lookupCompanyByIco(q)` wrapper

---

## Shared Utilities

### audit-shared/types.ts

**Location:** `astro-src/netlify/functions/audit-shared/types.ts`

**Exports:**

```typescript
// Constants
REPORTS_STORE = "audit-reports"
LEADS_STORE = "audit-leads"
JOBS_STORE = "audit-jobs"
REPORT_BASE_URL = "https://hypedigitaly.ai/report"
NOTIFICATION_RECIPIENTS = ["pavelcermak@...", "cermakova@..."]

// Types
type JobStatus = 'pending'|'validating'|'researching'|'generating'|'storing'|'emailing'|'completed'|'failed'

interface AuditJob { ... }
interface AuditFormData { ... }
interface AuditLead { ... }
```

**Hardcoded URLs:**
- `REPORT_BASE_URL = "https://hypedigitaly.ai/report"`

---

### audit-shared/storage.ts

**Location:** `astro-src/netlify/functions/audit-shared/storage.ts`

**Functions:**

```typescript
// Blob store accessors
getJobsStore(): BlobsStore
getAuditReportStore(): BlobsStore
getLeadsStore(): BlobsStore

// Job management
updateJobStatus(jobId, status, updates?): Promise<void>
initializeJob(jobId, formData): Promise<void>
createProgressCallback(jobId): (step, progress, msg) => Promise<void>
```

**Progress Mapping:**

```typescript
pending: 0
validating: 10
researching: 30
generating: 60
storing: 80
emailing: 90
completed: 100
failed: (current progress retained)
```

---

### onboarding-shared/auth.ts

**Location:** `astro-src/netlify/functions/onboarding-shared/auth.ts`

**Functions:**

```typescript
// Constant-time comparison
safeCompare(a: string, b: string): boolean

// Auth helpers
verifyInternalAuth(event): boolean      // INTERNAL_API_SECRET
verifyAdminAuth(event): boolean         // ADMIN_PASSWORD
```

Uses Node.js `timingSafeEqual` to prevent timing-based side-channel attacks.

---

## Configuration & Deployment

### netlify.toml

**Location:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\netlify.toml`

**Relevant Sections:**

```toml
[functions]
  directory = "netlify/functions"
  timeout = 60  # Sync functions default

[build.environment]
  NODE_VERSION = "18"

# Background function configuration (implied, not explicit in toml)
# audit-background.ts: 900 sec (15 min) timeout
```

### _redirects

**Location:** `astro-src/public/_redirects`

**Relevant Rules:**

```
# Force report routing to Netlify function (override SSR)
/report/*  /.netlify/functions/audit-report/:splat  200!
```

The `!` suffix ensures this rule takes precedence over Astro's SSR handler, preventing the Astro router from attempting to render /report/* pages as static content.

---

## Security Considerations

### Authentication & Authorization

**Admin Endpoints (admin-leads.ts, admin-leads-delete.ts):**
- Bearer token authentication via Authorization header
- Constant-time comparison prevents timing attacks
- Source: `ADMIN_PASSWORD` environment variable

**Sensitive Operations:**
- All admin functions verify auth before parsing request body (defense-in-depth)

### Input Validation

**All Functions:**
- Email regex validation
- URL format validation
- HTML tag stripping from free-text fields
- Size caps on text fields (100-500 chars typical)

**Pricing Lead (pricing-lead.ts):**
- Explicit field destructuring (no object spreading from raw body)
- PDF magic byte validation (%PDF header, %%EOF trailer)
- Base64 regex validation before binary decode
- Prototype pollution checks on calculator objects

**Survey (survey.ts):**
- Enum validation (no free-form values for dropdowns)
- Phone number format validation
- URL protocol whitelist (http/https only)

### Rate Limiting

**survey.ts:** 5 requests/hour/IP
- IP extracted from x-forwarded-for or client-ip header
- Sanitized to prevent Blob key injection
- Separate blob store (survey-ratelimit) to avoid namespace pollution
- Fails open on store errors

**pricing-lead.ts:** 3 requests/hour/IP
- Same pattern as survey.ts

**ares-lookup.ts:** 10 requests/minute/IP
- Minute-based window

### CORS Policy

**Locked to Production:**
- Most functions: `Origin: https://hypedigitaly.ai`
- audit.ts, audit-validate.ts: `Origin: *` (public-facing forms)
- Contact, survey: `Origin: https://hypedigitaly.ai`

**Methods:** Explicit per-endpoint (GET, POST, OPTIONS)

### Security Headers

**Set in netlify.toml:**
- X-Frame-Options: DENY (global, overridden for flyers with SAMEORIGIN)
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()

### Hardcoded Production URLs (Flagged for Review)

**Audit Functions:**
- `https://hypedigitaly.ai/report` (REPORT_BASE_URL)
- `https://hypedigitaly.ai/audit` (audit form CTA)
- `https://cal.com/hypedigitaly-pavelcermak/30-min-online` (consultation booking)

**Email Templates:**
- `https://hypedigitaly.ai/assets/images/HD_Color_white.png` (logo)
- `https://hypedigitaly.ai/` (Netlify Forms submission target)
- Social links: LinkedIn, Instagram, Facebook, Google Reviews

**Contact Form:**
- `https://hypedigitaly.ai/` (Netlify Forms)

**Survey:**
- `https://hypedigitaly.ai/` (Netlify Forms)

**Pricing Lead:**
- No hardcoded URLs in function; templates imported

**Recommendation:** Move URLs to environment variables for staging/production flexibility.

### Environment Variables Security

**Required (Must Not Be Exposed):**
- `RESEND_API_KEY` — Email API secret
- `TAVILY_API_KEY` — Search API secret
- `OPENROUTER_API_KEY` — LLM API secret
- `ADMIN_PASSWORD` — Admin authentication
- `INTERNAL_API_SECRET` — Internal auth (unused in audit, reserved)
- `FIRECRAWL_API_KEY` — Optional, branding fetch
- `NETLIFY_SITE_ID` — Blobs site ID
- `NETLIFY_API_TOKEN` — Blobs auth token

**Netlify Deployment:**
- Set via Netlify dashboard or `netlify env` CLI
- Never commit to git
- .gitignore should include .env files

---

## Testing & Monitoring

### Key Metrics to Monitor

1. **Audit Functions:**
   - Form submissions per day
   - Average processing time (sync vs async)
   - AI validation pass rate
   - LangGraph agent success rate
   - Email delivery rate (Resend)

2. **Lead Management:**
   - Admin API response time (N+5 query pattern)
   - Lead storage success rate
   - Index consistency (leads index vs actual lead count)

3. **Rate Limiting:**
   - Survey: false positives (legitimate users rate-limited)
   - Pricing: honeypot + timing check effectiveness
   - ARES: quota usage vs 10 req/min limit

4. **Errors:**
   - Blob store unavailability
   - API timeouts (Resend, TAVILY, OpenRouter)
   - Malformed input causing validation failures

### Logging

All functions log with prefixes:
- `[Audit]` — audit.ts
- `[Background]` — audit-background.ts
- `[Status]` — audit-status.ts
- `[AuditReport]` — audit-report.ts
- `[Admin Leads]` — admin-leads.ts
- `[Delete]` — admin-leads-delete.ts
- `[Contact Leads]` — contact.ts
- `[Survey]` — survey.ts
- `[Pricing]` — pricing-lead.ts
- `[ares-lookup]` — ares-lookup.ts

Check Netlify Functions logs in real-time dashboard or via `netlify logs` CLI.

---

## Maintenance & Refactoring

### High Priority Fixes

1. **audit-status.ts Duplication** (See section 3)
   - Move `getJobsStore()` to import from audit-shared/storage.ts
   - Change AuditJob import source to audit-shared/types.ts
   - Ensures single source of truth

2. **Hardcoded URLs**
   - Move production URLs to environment variables
   - Add staging/dev URL configuration
   - Examples: REPORT_BASE_URL, CONSULTATION_CALENDAR_URL, LOGO_URL

### Medium Priority

1. **Lead Store Performance (N+5 Query)**
   - Implement aggregated index across all stores
   - Cache frequently accessed lead summaries
   - Consider separate "admin-leads-summary" store

2. **Email Template Consolidation**
   - Unify across audit-templates.ts, email-templates.ts, survey-templates.ts, pricing-templates.ts
   - Create shared template library
   - Reduce duplication

3. **Validation Library**
   - Extract email/URL/phone validation to shared module
   - Consolidate regex patterns
   - Central enum definitions for company size, AI maturity, etc.

### Low Priority

1. **Error Page Customization**
   - audit-report.ts error pages hardcoded inline
   - Extract to separate module or template files

2. **Blob Store Consistency**
   - Document store naming conventions
   - Implement index schema versioning

---

## Reference

**Related Documentation:**
- Audit Architecture: `docs/audit/01-architecture.md`
- AI Services: `docs/audit/02-ai-services.md`
- Blobs Storage: `docs/audit/03-blob-storage.md`
- Frontend Integration: `docs/audit/05-frontend-integration.md`

**External APIs:**
- Resend: https://resend.com/docs
- Netlify Blobs: https://docs.netlify.com/functions/overview/#blobs
- Tavily Search: https://tavily.com
- OpenRouter: https://openrouter.ai
- ARES Registry: https://ares.gov.cz (Czech company data)
- Firecrawl: https://www.firecrawl.dev (web scraping)

---

**Document Version:** 1.0
**Last Reviewed:** 2026-03-19
**Next Review:** 2026-06-19
