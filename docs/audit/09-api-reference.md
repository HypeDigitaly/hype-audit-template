# API Reference - Complete Endpoint Documentation

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Complete Reference

This document provides complete technical specifications for all API endpoints in the HypeDigitaly system.

---

## Table of Contents

1. [Audit Endpoints](#audit-endpoints)
   - [POST /api/audit (Synchronous)](#post-apiaudit-synchronous)
   - [POST /api/audit-background (Asynchronous)](#post-apiaudit-background-asynchronous)
   - [GET /api/audit-status](#get-apiaudit-status)
   - [POST /api/audit-validate](#post-apiaudit-validate)
   - [GET /report/{reportId}](#get-reportreportid)

2. [Lead Management Endpoints](#lead-management-endpoints)
   - [GET /api/admin-leads](#get-apiadmin-leads)
   - [POST /api/admin-leads-delete](#post-apiadmin-leads-delete)

3. [Lead Capture Endpoints](#lead-capture-endpoints)
   - [POST /api/contact](#post-apicontact)
   - [POST /api/survey](#post-apisurvey)
   - [POST /api/pricing-lead](#post-apipricing-lead)

4. [Lookup Endpoints](#lookup-endpoints)
   - [GET /api/ares-lookup](#get-apiares-lookup)

---

## Audit Endpoints

### POST /api/audit (Synchronous)

Synchronous audit handler that processes audit requests immediately and returns a 200 response once complete.

**Endpoint:** `POST /.netlify/functions/audit`

**Response Time:** ~10-30 seconds (depends on AI research time)

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

#### Content-Type
- `application/json` OR `application/x-www-form-urlencoded`

#### Request Schema

**JSON Format:**
```json
{
  "email": "string (required)",
  "website": "string (required)",
  "companyName": "string (required)",
  "city": "string (required)",
  "biggestPainPoint": "string (optional)",
  "currentTools": "string (optional)",
  "language": "cs | en (optional, default: cs)",
  "leadSource": "string (optional)",
  "utmSource": "string (optional)",
  "utmMedium": "string (optional)",
  "utmCampaign": "string (optional)",
  "utmContent": "string (optional)",
  "utmTerm": "string (optional)",
  "gclid": "string (optional)",
  "fbclid": "string (optional)",
  "msclkid": "string (optional)",
  "referrer": "string (optional)"
}
```

**Form-Encoded Format:**
```
email=user@example.com&website=example.com&companyName=Example%20Corp&city=Prague&language=cs
```

#### Request Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| email | string | ✓ | 254 | Must be valid email format |
| website | string | ✓ | N/A | Domain or full URL |
| companyName | string | ✓ | 200 | Company name for audit |
| city | string | ✓ | 100 | City/region |
| biggestPainPoint | string | | 500 | Main business challenge |
| currentTools | string | | 500 | Tools currently in use |
| language | string | | 2 | `cs` for Czech, `en` for English |
| leadSource | string | | 200 | Traffic source tracking |
| utmSource | string | | 300 | UTM source parameter |
| utmMedium | string | | 300 | UTM medium parameter |
| utmCampaign | string | | 300 | UTM campaign parameter |
| utmContent | string | | 300 | UTM content parameter |
| utmTerm | string | | 300 | UTM term parameter |
| gclid | string | | 300 | Google Click ID |
| fbclid | string | | 300 | Facebook Click ID |
| msclkid | string | | 300 | Microsoft Click ID |
| referrer | string | | 500 | HTTP referrer |

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Váš Hloubkový AI Audit byl úspěšně odeslán na váš e-mail!",
  "email": "user@example.com",
  "reportId": "rpt-abcd1234"
}
```

#### Error Responses

**400 Bad Request** - Missing or invalid required fields:
```json
{
  "success": false,
  "error": "Pole \"E-mail\" je povinné."
}
```

**400 Bad Request** - AI validation failed:
```json
{
  "success": false,
  "error": "Některá pole obsahují neplatné údaje. Zkontrolujte prosím formulář.",
  "validationErrors": {
    "website": "Invalid domain format",
    "email": "Email already submitted"
  }
}
```

**500 Internal Server Error** - Configuration issue:
```json
{
  "success": false,
  "error": "Konfigurace e-mailu není dokončena."
}
```

**500 Internal Server Error** - Unexpected error:
```json
{
  "success": false,
  "error": "Došlo k neočekávané chybě. Zkuste to prosím znovu."
}
```

#### Rate Limiting
- Per endpoint: No hard limit (recommend 1 per user per hour via frontend)
- Per IP: Monitor for abuse patterns

#### Example curl Command

```bash
curl -X POST "https://hypedigitaly.ai/.netlify/functions/audit" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@company.cz",
    "website": "company.cz",
    "companyName": "Example Company s.r.o.",
    "city": "Prague",
    "biggestPainPoint": "Manual lead processing",
    "currentTools": "Excel, CRM",
    "language": "cs",
    "utmSource": "google",
    "utmCampaign": "audit_campaign"
  }'
```

#### Processing Flow

1. Parse & validate form data
2. AI field validation (email, URL, content quality)
3. Execute LangGraph Deep Research Agent (Tavily + OpenRouter)
4. Generate HTML report
5. Store report in Netlify Blobs
6. Store lead data in audit-leads store
7. Send team notification email
8. Send confirmation email with report link to user
9. Return 200 with success message

#### Notes

- **Synchronous processing**: Frontend waits for full completion
- **Email delivery**: Confirmation email includes link to `/report/{reportId}`
- **Report expiration**: Reports expire after 30 days
- **Failure handling**: Uses fallback report if agent fails
- **Traffic tracking**: All UTM parameters are stored with lead data

---

### POST /api/audit-background (Asynchronous)

Asynchronous background handler that accepts audit requests, returns 202 immediately, and processes in background (up to 15 minutes).

**Endpoint:** `POST /.netlify/functions/audit-background`

**Response Time:** ~100ms (returns immediately)

**Processing Time:** ~5-30 seconds (in background)

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

#### Content-Type
- `application/json`

#### Request Schema

```json
{
  "jobId": "string (required, UUID v4)",
  "email": "string (required)",
  "website": "string (required)",
  "companyName": "string (required)",
  "city": "string (required)",
  "biggestPainPoint": "string (optional)",
  "currentTools": "string (optional)",
  "language": "cs | en (optional, default: cs)",
  "leadSource": "string (optional)",
  "utmSource": "string (optional)",
  "utmMedium": "string (optional)",
  "utmCampaign": "string (optional)",
  "utmContent": "string (optional)",
  "utmTerm": "string (optional)",
  "gclid": "string (optional)",
  "fbclid": "string (optional)",
  "msclkid": "string (optional)",
  "referrer": "string (optional)"
}
```

#### Request Fields

Same as `/api/audit`, with addition of:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| jobId | string | ✓ | UUID v4 generated on client side |

#### Immediate Response (202 Accepted)

**Always returns 202 immediately:**
```json
{}
```

The actual response body is empty. Status code 202 indicates processing has begun.

#### Job Status Object (polled from /api/audit-status)

```json
{
  "jobId": "uuid-here",
  "status": "pending | validating | researching | generating | storing | emailing | completed | failed",
  "progress": 0-100,
  "statusMessage": "Provádím hloubkový výzkum...",
  "currentSubStep": "fetch_branding | agent_research | report_gen | email_send",
  "subStepMessage": "Fetching company branding...",
  "companyName": "Example Company",
  "reportId": "rpt-abcd1234",
  "reportUrl": "https://hypedigitaly.ai/report/rpt-abcd1234",
  "error": null,
  "createdAt": "2026-03-19T10:30:00Z",
  "updatedAt": "2026-03-19T10:31:30Z",
  "completedAt": "2026-03-19T10:32:00Z"
}
```

#### Processing States

| Status | Progress | Meaning |
|--------|----------|---------|
| pending | 0 | Job received, waiting to process |
| validating | 10 | Validating form fields with AI |
| researching | 30-80 | Conducting deep research via LangGraph |
| generating | 85 | Generating HTML report |
| storing | 90 | Storing report in Blobs |
| emailing | 95 | Sending notification & confirmation emails |
| completed | 100 | All steps finished, report available |
| failed | 0 | Validation or processing error |

#### Error Responses

**202 Accepted** - Processing will fail asynchronously:
```json
{}
```

Status will be updated to `failed` in job status. Check `/api/audit-status?jobId=<jobId>` for error details.

#### Rate Limiting
- No limit (queue processes asynchronously)
- Per user: Recommend 1 background audit per hour via frontend

#### Example curl Command

```bash
# Generate jobId on client first (UUID v4)
JOB_ID=$(uuidgen)

curl -X POST "https://hypedigitaly.ai/.netlify/functions/audit-background" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobId\": \"$JOB_ID\",
    \"email\": \"contact@company.cz\",
    \"website\": \"company.cz\",
    \"companyName\": \"Example Company s.r.o.\",
    \"city\": \"Prague\",
    \"biggestPainPoint\": \"Manual lead processing\",
    \"currentTools\": \"Excel, CRM\",
    \"language\": \"cs\"
  }"

# Then poll for status
curl "https://hypedigitaly.ai/.netlify/functions/audit-status?jobId=$JOB_ID"
```

#### Processing Flow

1. Return 202 immediately to client
2. Initialize job status record (pending)
3. Validate form fields
4. Fetch company branding (Firecrawl, optional)
5. Execute LangGraph Deep Research Agent
6. Generate HTML report
7. Store report & lead data
8. Send emails (team notification + user confirmation)
9. Mark job complete in status store

#### Polling Strategy

**Recommended Frontend Implementation:**
```
1. Generate UUID v4 clientId
2. POST to /audit-background with jobId
3. Show "Processing..." with progress bar
4. Poll /api/audit-status?jobId=<jobId> every 2 seconds
5. Update progress bar based on `progress` field
6. When status === 'completed', show success & report link
7. When status === 'failed', show error message
```

#### Notes

- **Background function timeout**: 15 minutes maximum
- **Job persistence**: Status records stored in `audit-jobs` Blobs store
- **Automatic cleanup**: Expired jobs may be cleaned up after 7 days
- **Webhook option**: Optional webhook support for status updates (future)
- **Branding enhancement**: If Firecrawl configured, fetches company logo & colors

---

### GET /api/audit-status

Polls the status of a background audit job.

**Endpoint:** `GET /.netlify/functions/audit-status?jobId=<jobId>`

#### Authentication
- None required (public endpoint)
- Status returned for any valid jobId

#### CORS Policy
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

#### Query Parameters

| Parameter | Type | Required | Max Length | Notes |
|-----------|------|----------|-----------|-------|
| jobId | string | ✓ | 36 | UUID v4 from initial background request |

#### Success Response (200 OK)

```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "researching",
  "progress": 45,
  "statusMessage": "Provádím hloubkový výzkum...",
  "currentSubStep": "agent_research",
  "subStepMessage": "Analyzing company digital presence",
  "companyName": "Example Company s.r.o.",
  "reportId": null,
  "reportUrl": null,
  "error": null,
  "validationErrors": null,
  "createdAt": "2026-03-19T10:30:00.000Z",
  "updatedAt": "2026-03-19T10:30:45.000Z",
  "completedAt": null
}
```

#### Response Fields

| Field | Type | Notes |
|-------|------|-------|
| jobId | string | UUID of the job |
| status | string | Current processing state |
| progress | number | 0-100 percentage |
| statusMessage | string | User-friendly status in user's language |
| currentSubStep | string | Granular processing step (v3) |
| subStepMessage | string | Details of current substep |
| companyName | string | Company name from form |
| reportId | string \| null | Report ID when complete |
| reportUrl | string \| null | Full URL to report when complete |
| error | string \| null | Error message if failed |
| validationErrors | object \| null | Field-level validation errors if validation failed |
| createdAt | string | ISO 8601 timestamp |
| updatedAt | string | ISO 8601 timestamp |
| completedAt | string \| null | ISO 8601 timestamp when complete |

#### Job Not Found Response (200 OK)

If job hasn't been initialized yet:
```json
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "progress": 0,
  "statusMessage": "Initializing...",
  "notFound": true
}
```

#### Error Responses

**400 Bad Request** - Missing jobId:
```json
{
  "error": "Missing jobId parameter"
}
```

**500 Internal Server Error** - Blobs access failure:
```json
{
  "error": "Failed to fetch job status"
}
```

#### Rate Limiting
- No hard limit
- Recommend polling interval: 2-3 seconds
- Maximum poll duration: 15 minutes

#### Example curl Command

```bash
JOB_ID="550e8400-e29b-41d4-a716-446655440000"

curl -X GET "https://hypedigitaly.ai/.netlify/functions/audit-status?jobId=$JOB_ID" \
  -H "Accept: application/json"

# Poll every 2 seconds until complete
while true; do
  STATUS=$(curl -s "https://hypedigitaly.ai/.netlify/functions/audit-status?jobId=$JOB_ID" | jq -r '.status')
  PROGRESS=$(curl -s "https://hypedigitaly.ai/.netlify/functions/audit-status?jobId=$JOB_ID" | jq -r '.progress')

  echo "Status: $STATUS - Progress: $PROGRESS%"

  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    break
  fi

  sleep 2
done
```

#### Notes

- **Strong consistency**: Blobs queries use strong consistency mode
- **Polling interval**: 2-3 second intervals recommended
- **Job expiration**: Jobs persisted until completion + 7 days
- **Graceful degradation**: Returns "pending" if job not yet found (eventual consistency)

---

### POST /api/audit-validate

Fast validation-only endpoint that validates form fields without executing the full audit workflow. Useful for showing validation progress that completes in 1-3 seconds.

**Endpoint:** `POST /.netlify/functions/audit-validate`

**Response Time:** ~1-3 seconds (AI validation only)

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

#### Content-Type
- `application/json` OR `application/x-www-form-urlencoded`

#### Request Schema

```json
{
  "email": "string (required)",
  "website": "string (required)",
  "companyName": "string (required)",
  "city": "string (required)",
  "biggestPainPoint": "string (optional)",
  "currentTools": "string (optional)",
  "language": "cs | en (optional, default: cs)"
}
```

#### Request Fields

Same as `/api/audit`, but without traffic tracking fields (UTM, click IDs, referrer).

#### Success Response (200 OK)

```json
{
  "success": true,
  "isValid": true,
  "message": "Validace úspěšná. Spouštíme audit..."
}
```

#### Validation Failed Response (400 Bad Request)

```json
{
  "success": false,
  "isValid": false,
  "error": "Některá pole obsahují neplatné údaje. Zkontrolujte prosím formulář.",
  "validationErrors": {
    "email": "Email address appears fake or temporary",
    "website": "Domain unreachable or invalid"
  }
}
```

#### Basic Validation Failed (400 Bad Request)

```json
{
  "success": false,
  "isValid": false,
  "error": "Zadejte prosím platnou e-mailovou adresu."
}
```

#### Fallback Response (200 OK) - Config Issue

If OPENROUTER_API_KEY not configured, returns success to avoid blocking users:
```json
{
  "success": true,
  "isValid": true,
  "message": "Validation skipped (config issue)"
}
```

#### Rate Limiting
- No hard limit
- Recommend: 1 validation per form edit (client-side debounce)

#### Example curl Command

```bash
curl -X POST "https://hypedigitaly.ai/.netlify/functions/audit-validate" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@company.cz",
    "website": "company.cz",
    "companyName": "Example Company",
    "city": "Prague",
    "language": "cs"
  }'
```

#### Validation Steps

1. Check required fields (email, website, company name, city)
2. Validate email format (RFC 5322 basic)
3. Validate URL format
4. Call OpenRouter AI to validate content quality
5. Return immediate response

#### Notes

- **Purpose**: Provide early feedback without starting audit
- **Workflow**: Run validation, show progress, then POST to `/audit` or `/audit-background`
- **Graceful degradation**: If API key missing, returns success to not block users
- **Fast feedback**: Completes in 1-3 seconds for better UX

---

### GET /report/{reportId}

Retrieves a stored HTML audit report from Netlify Blobs.

**Endpoint:** `GET /.netlify/functions/audit-report/{reportId}`

**URL Redirect Rule** (via `_redirects`):
```
/report/*  /.netlify/functions/audit-report/:splat  200!
```

This means `/report/{reportId}` automatically routes to the function.

#### Authentication
- None required (public endpoint)
- Reports are access-controlled by reportId (UUID-style, unguessable)

#### CORS Policy
```
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=3600
```

#### Query Parameters
- None

#### Success Response (200 OK)

Returns complete HTML document with embedded CSS and content:
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Audit Report - Example Company</title>
  <style>
    /* Embedded CSS */
    ...
  </style>
</head>
<body>
  <!-- Full audit report HTML -->
  <h1>AI Audit Report</h1>
  <p>Company Analysis...</p>
  ...
</body>
</html>
```

#### Error Responses

**404 Not Found** - Report doesn't exist:
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <title>Report nenalezen | HypeDigitaly</title>
</head>
<body>
  <h1>Report nenalezen</h1>
  <p>Tento report neexistuje nebo byl odstraněn.</p>
  <a href="https://hypedigitaly.ai/audit">Vytvořit nový audit</a>
</body>
</html>
```

**400 Bad Request** - Invalid report ID:
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <title>Neplatné ID reportu | HypeDigitaly</title>
</head>
<body>
  <h1>Neplatné ID reportu</h1>
  <p>Zadané ID reportu není platné.</p>
</body>
</html>
```

**410 Gone** - Report expired (30 days):
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <title>Report vypršel | HypeDigitaly</title>
</head>
<body>
  <h1>Report vypršel</h1>
  <p>Tento report byl dostupný po dobu 30 dní a jeho platnost již vypršela.</p>
  <a href="https://hypedigitaly.ai/audit">Nový audit</a>
  <a href="https://cal.com/hypedigitaly-pavelcermak/30-min-online">Konzultace</a>
</body>
</html>
```

**500 Internal Server Error**:
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <title>Chyba serveru | HypeDigitaly</title>
</head>
<body>
  <h1>Chyba serveru</h1>
  <p>Došlo k neočekávané chybě. Zkuste to prosím později.</p>
</body>
</html>
```

#### Rate Limiting
- No hard limit
- Report access is public once URL is known
- Typical access: 1-2 times per user

#### Example curl Command

```bash
REPORT_ID="rpt-abcd1234"

curl -X GET "https://hypedigitaly.ai/report/$REPORT_ID" \
  -H "Accept: text/html" \
  -o audit-report.html

# View in browser
open audit-report.html
```

#### Report Caching

| Header | Value | Notes |
|--------|-------|-------|
| Cache-Control | public, max-age=3600 | Cache for 1 hour |
| X-Report-ID | {reportId} | Report identifier |

#### Report Expiration

- **Expiration time**: 30 days from generation
- **Metadata tracking**: Expiration date stored in `{reportId}-meta` object
- **Automatic cleanup**: Expired reports deleted on access attempt
- **User notification**: Confirmation email includes link with expiration warning

#### Notes

- **Metadata format**: Includes companyName, email, generatedAt, expiresAt
- **Self-contained HTML**: No external stylesheets or JavaScript
- **Responsive design**: Works on desktop, tablet, mobile
- **Printable**: Optimized for PDF export
- **Bilingual**: Content in user's selected language

---

## Lead Management Endpoints

### GET /api/admin-leads

Fetches all leads from all sources (audit, contact, survey, pricing, onboarding) with optional filtering.

**Endpoint:** `GET /.netlify/functions/admin-leads`

#### Authentication
- **Required**: Bearer token authentication via Authorization header
- **Header**: `Authorization: Bearer <ADMIN_PASSWORD>`
- **Password**: Constant-time comparison (timing attack resistant)

#### CORS Policy
```
Access-Control-Allow-Origin: https://hypedigitaly.ai
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Max-Age: 86400
```

#### Query Parameters

| Parameter | Type | Required | Max Length | Notes |
|-----------|------|----------|-----------|-------|
| source | string | | 50 | Filter by source: `audit`, `contact`, `survey`, `onboarding`, `pricing-calculator` |
| search | string | | 300 | Search by email, company name, name, or website |
| leadSource | string | | 200 | Filter by leadSource field |
| from | string | | 10 | ISO 8601 date (inclusive): `2026-03-01` |
| to | string | | 10 | ISO 8601 date (inclusive): `2026-03-31` |

#### Success Response (200 OK)

```json
{
  "success": true,
  "total": 125,
  "totalAudit": 45,
  "totalContact": 30,
  "totalSurvey": 40,
  "totalOnboarding": 5,
  "totalPricing": 5,
  "totalGcEvent": 12,
  "leads": [
    {
      "id": "lead-abc123",
      "source": "audit",
      "email": "contact@company.cz",
      "companyName": "Company s.r.o.",
      "website": "company.cz",
      "city": "Prague",
      "reportId": "rpt-xyz789",
      "reportUrl": "https://hypedigitaly.ai/report/rpt-xyz789",
      "submittedAt": "2026-03-19T10:30:00Z",
      "detectedIndustry": "Technology",
      "leadSource": "google-ads",
      "utmSource": "google",
      "utmCampaign": "spring_campaign"
    },
    {
      "id": "contact-def456",
      "source": "contact",
      "email": "contact@company.cz",
      "name": "John Doe",
      "phone": "+420777123456",
      "service": "web-development",
      "budget_monthly": "50000",
      "message": "Interested in AI implementation",
      "submittedAt": "2026-03-18T15:45:00Z"
    }
  ]
}
```

#### Audit Lead Object

```json
{
  "id": "lead-abc123",
  "source": "audit",
  "email": "string",
  "companyName": "string",
  "website": "string",
  "city": "string",
  "biggestPainPoint": "string",
  "currentTools": "string",
  "language": "cs | en",
  "reportId": "string",
  "reportUrl": "string",
  "submittedAt": "ISO 8601",
  "detectedIndustry": "string",
  "leadSource": "string",
  "utmSource": "string",
  "utmMedium": "string",
  "utmCampaign": "string",
  "utmContent": "string",
  "utmTerm": "string",
  "gclid": "string",
  "fbclid": "string",
  "msclkid": "string",
  "referrer": "string"
}
```

#### Contact Lead Object

```json
{
  "id": "contact-def456",
  "source": "contact",
  "name": "string",
  "email": "string",
  "phone": "string",
  "website": "string",
  "service": "string",
  "budget_onetime": "string",
  "budget_monthly": "string",
  "message": "string",
  "language": "cs | en",
  "submittedAt": "ISO 8601",
  "leadSource": "string",
  "utmSource": "string",
  "utmMedium": "string",
  "utmCampaign": "string",
  "utmContent": "string",
  "utmTerm": "string",
  "gclid": "string",
  "fbclid": "string",
  "msclkid": "string",
  "referrer": "string"
}
```

#### Survey Lead Object

```json
{
  "id": "survey-ghi789",
  "source": "survey",
  "email": "string",
  "companyName": "string",
  "industry": "string",
  "companySize": "solo | 2-10 | 11-50 | 51-250 | 250+",
  "painPoints": ["string"],
  "primaryPainPoint": "string",
  "aiMaturity": "none | experimenting | active",
  "hoursLostPerWeek": "1-5 | 5-10 | 10-20 | 20-40 | 40+",
  "contextNote": "string",
  "language": "cs | en",
  "submittedAt": "ISO 8601",
  "leadSource": "gc-event-page",
  "city": "string",
  "phoneNumber": "string",
  "toolsUsed": ["string"],
  "websiteUrl": "string",
  "respondentRole": "string",
  "crmUsed": "string",
  "erpUsed": "string",
  "techOpenness": "conservative | open | innovator",
  "techLevel": "none | beginner | intermediate | advanced",
  "topExamples": ["string"],
  "utmSource": "string",
  "utmMedium": "string",
  "utmCampaign": "string",
  "utmContent": "string",
  "utmTerm": "string",
  "gclid": "string",
  "fbclid": "string",
  "msclkid": "string",
  "referrer": "string"
}
```

#### Onboarding Lead Object

```json
{
  "id": "string",
  "source": "onboarding",
  "companyName": "string",
  "contactPersonEmail": "string",
  "contactPersonName": "string",
  "selectedPackage": "starter | professional | enterprise",
  "ico": "string",
  "city": "string",
  "website": "string",
  "status": "submitted | ...",
  "driveFolder": "string",
  "isPandaDocSigned": "boolean",
  "submittedAt": "ISO 8601",
  "numSalespeople": "number",
  "dailyVolume": "string",
  "channels": ["string"]
}
```

#### Pricing Lead Object

```json
{
  "id": "pricing-jkl012",
  "source": "pricing-calculator",
  "name": "string",
  "email": "string",
  "companyName": "string",
  "language": "cs | en",
  "submittedAt": "ISO 8601",
  "calculatorState": { /* calculator state object */ },
  "calculatorResults": { /* calculator results object */ }
}
```

#### Error Responses

**401 Unauthorized** - Invalid or missing password:
```json
{
  "error": "Unauthorized. Invalid password."
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to fetch leads",
  "details": "Internal server error"
}
```

#### Rate Limiting
- No hard limit (internal admin use)
- Recommend: 1 request per second maximum

#### Example curl Command

```bash
ADMIN_PASSWORD="your-secret-password"

# Fetch all leads
curl -X GET "https://hypedigitaly.ai/.netlify/functions/admin-leads" \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Filter by source
curl -X GET "https://hypedigitaly.ai/.netlify/functions/admin-leads?source=audit" \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Filter by date range
curl -X GET "https://hypedigitaly.ai/.netlify/functions/admin-leads?from=2026-03-01&to=2026-03-31" \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Search leads
curl -X GET "https://hypedigitaly.ai/.netlify/functions/admin-leads?search=contact%40company.cz" \
  -H "Authorization: Bearer $ADMIN_PASSWORD"

# Multiple filters
curl -X GET "https://hypedigitaly.ai/.netlify/functions/admin-leads?source=audit&leadSource=google-ads&from=2026-03-01" \
  -H "Authorization: Bearer $ADMIN_PASSWORD"
```

#### Filtering Examples

```bash
# All leads from March 2026
?from=2026-03-01&to=2026-03-31

# All audit leads
?source=audit

# GC event page survey submissions
?source=survey&leadSource=gc-event-page

# Google Ads conversions
?source=audit&leadSource=google-ads

# Search by company
?search=hypedigitaly
```

#### Notes

- **Blobs stores**: Data fetched from separate stores (audit-leads, contact-leads, survey-leads, etc.)
- **Parallel fetch**: All stores fetched in parallel for speed
- **Sorting**: Results sorted by submittedAt (newest first)
- **Search**: Full-text search on email, companyName, name, website
- **Performance**: Optimized for typical 100-500 lead queries

---

### POST /api/admin-leads-delete

Bulk delete leads with optional associated reports.

**Endpoint:** `POST /.netlify/functions/admin-leads-delete`

#### Authentication
- **Required**: Bearer token authentication via Authorization header
- **Header**: `Authorization: Bearer <ADMIN_PASSWORD>`
- **Constant-time comparison**: Timing attack resistant

#### CORS Policy
```
Access-Control-Allow-Origin: https://hypedigitaly.ai
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Max-Age: 86400
```

#### Content-Type
- `application/json`

#### Request Schema

```json
{
  "leadIds": ["string"],
  "deleteReports": false
}
```

#### Request Fields

| Field | Type | Required | Max Items | Notes |
|-------|------|----------|-----------|-------|
| leadIds | array | ✓ | 100 | Array of lead IDs to delete |
| deleteReports | boolean | ✓ | N/A | Also delete associated audit reports (only for audit leads) |

#### Lead ID Format

- Audit leads: `lead-<timestamp>-<random>`
- Contact leads: `contact-<timestamp>-<random>`
- Survey leads: `survey-<timestamp>-<random>`
- Pricing leads: `pricing-<timestamp>-<random>`

#### Success Response (200 OK)

```json
{
  "success": true,
  "deletedCount": 3,
  "errors": []
}
```

#### Partial Success Response (200 OK)

```json
{
  "success": true,
  "deletedCount": 2,
  "errors": [
    {
      "leadId": "lead-abc123",
      "error": "Lead not found"
    }
  ]
}
```

#### Error Responses

**400 Bad Request** - Invalid request:
```json
{
  "error": "Missing or invalid leadIds array"
}
```

**400 Bad Request** - Too many items:
```json
{
  "error": "Maximum 100 leads per delete request"
}
```

**401 Unauthorized** - Invalid password:
```json
{
  "error": "Unauthorized. Invalid password."
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to delete leads",
  "details": "Internal server error"
}
```

#### Deletion Behavior

1. **Audit leads** (lead-*):
   - Delete lead record
   - If `deleteReports: true`, also delete associated report & metadata
   - Update leads index

2. **Contact leads** (contact-*):
   - Delete lead record
   - Update leads index

3. **Survey leads** (survey-*):
   - Delete lead record
   - Update leads index

4. **Pricing leads** (pricing-*):
   - Delete lead record
   - Update leads index

#### Rate Limiting
- No hard limit (internal admin use)

#### Example curl Command

```bash
ADMIN_PASSWORD="your-secret-password"

# Delete 3 leads, keep reports
curl -X POST "https://hypedigitaly.ai/.netlify/functions/admin-leads-delete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -d '{
    "leadIds": ["lead-abc123", "contact-def456", "survey-ghi789"],
    "deleteReports": false
  }'

# Delete audit leads AND their reports
curl -X POST "https://hypedigitaly.ai/.netlify/functions/admin-leads-delete" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -d '{
    "leadIds": ["lead-abc123", "lead-def456"],
    "deleteReports": true
  }'
```

#### Notes

- **Bulk deletion**: Max 100 leads per request
- **Non-fatal errors**: Individual failures don't block entire request
- **Index updates**: Leads index automatically updated for each store
- **Report cleanup**: Only applies to audit leads with deleteReports=true
- **Soft deletes**: No soft delete; permanent removal from Blobs

---

## Lead Capture Endpoints

### POST /api/contact

Contact form handler that sends notification to team and confirmation to user.

**Endpoint:** `POST /.netlify/functions/contact`

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
```

#### Content-Type
- `application/json` OR `application/x-www-form-urlencoded`

#### Request Schema

**JSON Format:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "website": "string (optional)",
  "service": "string (optional)",
  "budget_onetime": "string (optional)",
  "budget_monthly": "string (optional)",
  "message": "string (optional)",
  "language": "cs | en (optional, default: cs)",
  "leadSource": "string (optional)",
  "utmSource": "string (optional)",
  "utmMedium": "string (optional)",
  "utmCampaign": "string (optional)",
  "utmContent": "string (optional)",
  "utmTerm": "string (optional)",
  "gclid": "string (optional)",
  "fbclid": "string (optional)",
  "msclkid": "string (optional)",
  "referrer": "string (optional)"
}
```

**Form-Encoded Format:**
```
name=John%20Doe&email=john%40company.cz&service=web-development&language=cs
```

#### Request Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| name | string | ✓ | 200 | Contact person name |
| email | string | ✓ | 254 | Valid email address |
| phone | string | | 20 | Phone number (optional) |
| website | string | | 500 | Company website |
| service | string | | 100 | Service interest |
| budget_onetime | string | | 100 | One-time budget (free text) |
| budget_monthly | string | | 100 | Monthly budget (free text) |
| message | string | | 5000 | Inquiry message |
| language | string | | 2 | `cs` or `en` |
| leadSource | string | | 200 | Tracking source |
| UTM parameters | string | | 300 | Google Analytics tracking |
| Click IDs | string | | 300 | Google/Facebook/Microsoft IDs |
| referrer | string | | 500 | HTTP referrer |

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Zpráva byla úspěšně odeslána!"
}
```

#### Error Responses

**400 Bad Request** - Missing required fields:
```json
{
  "success": false,
  "error": "Jméno a e-mail jsou povinné údaje."
}
```

**400 Bad Request** - Invalid email:
```json
{
  "success": false,
  "error": "Zadejte prosím platnou e-mailovou adresu."
}
```

**500 Internal Server Error** - Email configuration:
```json
{
  "success": false,
  "error": "Konfigurace e-mailu není dokončena. Kontaktujte nás prosím přímo."
}
```

#### Rate Limiting
- No hard limit
- Recommend: 1 per user per hour (frontend validation)

#### Example curl Command

```bash
curl -X POST "https://hypedigitaly.ai/.netlify/functions/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@company.cz",
    "phone": "+420777123456",
    "service": "web-development",
    "budget_monthly": "50000",
    "message": "Interested in AI transformation for our sales team",
    "language": "cs",
    "utmSource": "google",
    "utmCampaign": "spring_2026"
  }'
```

#### Processing Flow

1. Parse form data (JSON or form-encoded)
2. Validate required fields (name, email)
3. Basic email validation
4. Store in contact-leads Blobs store
5. Submit to Netlify Forms (dashboard)
6. Send team notification email via Resend
7. Send user confirmation email via Resend
8. Return 200 success

#### Email Templates

**Team Notification Subject:**
```
🆕 Nový zájemce: {name} – {serviceLabel}
```

**User Confirmation Subject:**
```
Potvrzení: Vaše poptávka pro HypeDigitaly byla přijata
```

#### Notes

- **Form storage**: Leads stored in contact-leads Blobs store
- **Netlify Forms**: Also submitted to Netlify Forms for dashboard visibility
- **Email service**: Resend API for email delivery
- **Non-blocking**: Email failures don't block form submission
- **Traffic tracking**: Full UTM & click ID support

---

### POST /api/survey

Pain-Point Discovery Survey handler with rate limiting and honeypot protection.

**Endpoint:** `POST /.netlify/functions/survey`

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: https://hypedigitaly.ai
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

#### Content-Type
- `application/json`

#### Request Schema

```json
{
  "email": "string (required)",
  "companyName": "string (required)",
  "industry": "string (required)",
  "companySize": "solo | 2-10 | 11-50 | 51-250 | 250+ (required)",
  "painPoints": ["string"] (required, 1-18 items),
  "primaryPainPoint": "string (optional)",
  "aiMaturity": "none | experimenting | active (optional)",
  "hoursLostPerWeek": "1-5 | 5-10 | 10-20 | 20-40 | 40+ (optional)",
  "contextNote": "string (optional, max 500 chars)",
  "language": "cs | en (optional, default: cs)",
  "city": "string (optional)",
  "phoneNumber": "string (optional)",
  "toolsUsed": ["string"] (optional, max 10 items),
  "websiteUrl": "string (optional, https/http only)",
  "respondentRole": "string (optional)",
  "crmUsed": "string (optional)",
  "erpUsed": "string (optional)",
  "techOpenness": "conservative | open | innovator (optional)",
  "techLevel": "none | beginner | intermediate | advanced (optional)",
  "topExamples": ["string"] (optional, max 3 items),
  "website_url": "string (honeypot, must be empty)",
  "utmSource": "string (optional)",
  "utmMedium": "string (optional)",
  "utmCampaign": "string (optional)",
  "utmContent": "string (optional)",
  "utmTerm": "string (optional)",
  "gclid": "string (optional)",
  "fbclid": "string (optional)",
  "msclkid": "string (optional)",
  "referrer": "string (optional)"
}
```

#### Request Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| email | string | ✓ | 254 | Valid email |
| companyName | string | ✓ | 200 | Company name |
| industry | string | ✓ | 200 | Industry/vertical |
| companySize | enum | ✓ | N/A | 5 size options |
| painPoints | array | ✓ | 1-18 items | Multiple pain points |
| primaryPainPoint | string | | 200 | Main pain point |
| aiMaturity | enum | | N/A | Current AI usage |
| hoursLostPerWeek | enum | | N/A | Time waste estimate |
| contextNote | string | | 500 | Additional context |
| language | string | | 2 | `cs` or `en` |
| city | string | | 100 | City/region |
| phoneNumber | string | | 20 | Valid format required |
| toolsUsed | array | | 10 items max | Current tools |
| websiteUrl | string | | 500 | Company website |
| respondentRole | enum | | N/A | User's role |
| crmUsed | enum | | N/A | CRM system |
| erpUsed | enum | | N/A | ERP system |
| techOpenness | enum | | N/A | Tech adoption level |
| techLevel | enum | | N/A | Technical skills |
| topExamples | array | | 3 items max | AI use case examples |
| website_url | string | N/A (honeypot) | 0 | Must be empty string |

#### Valid Pain Points

```
new_customers, speed_to_lead, automating_communication, customer_support,
boring_admin, reporting_data, juggling_tools, integrating_ai,
marketing_materials, content_creation, manual_data_entry,
document_processing, invoicing, scheduling,
employee_onboarding, knowledge_silos, delegation
```

#### Valid Company Sizes

```
solo, 2-10, 11-50, 51-250, 250+
```

#### Valid Enums

- **aiMaturity**: none, experimenting, active
- **hoursLostPerWeek**: 1-5, 5-10, 10-20, 20-40, 40+
- **respondentRole**: owner_ceo, sales_manager, ops_manager, it_lead, employee, other
- **crmUsed**: none, excel, hubspot_pipedrive, salesforce, raynet, custom_other
- **erpUsed**: none, pohoda, abra_helios, sap, money_s3, custom_other
- **techOpenness**: conservative, open, innovator
- **techLevel**: none, beginner, intermediate, advanced
- **topExamples**: auto_leads, ai_web, ai_assistant, ai_phone_management, voice_blog, ai_avatar_reels, ai_lead_magnet, other:*

#### Success Response (200 OK)

```json
{
  "success": true
}
```

#### Honeypot Response (200 OK) - Silent

If `website_url` (honeypot) field is not empty:
```json
{
  "success": true
}
```

Returns success silently without storing (silently discards bot submission).

#### Rate Limit Response (429 Too Many Requests)

Max 5 submissions per hour per IP:
```json
{
  "success": false,
  "error": "Too many submissions. Please try again later."
}
```

#### Validation Error Response (400 Bad Request)

```json
{
  "success": false,
  "errors": {
    "email": "Zadejte platnou e-mailovou adresu.",
    "painPoints": "Vyberte 1 az 18 bolicich mist."
  }
}
```

#### Size Limit Response (413 Payload Too Large)

```json
{
  "success": false,
  "error": "Request body too large"
}
```

#### Error Responses

**400 Bad Request** - Invalid JSON:
```json
{
  "success": false,
  "error": "Invalid JSON body"
}
```

**405 Method Not Allowed**:
```json
{
  "success": false,
  "error": "Method not allowed"
}
```

#### Rate Limiting

- **Limit**: 5 submissions per hour per IP
- **Window**: 60 seconds rolling window
- **Storage**: Separate `survey-ratelimit` Blobs store
- **Fails open**: Rate limit store unavailable = allow request

#### Example curl Command

```bash
curl -X POST "https://hypedigitaly.ai/.netlify/functions/survey" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@company.cz",
    "companyName": "Example Company s.r.o.",
    "industry": "Technology",
    "companySize": "11-50",
    "painPoints": ["manual_data_entry", "reporting_data", "boring_admin"],
    "primaryPainPoint": "Manual lead processing consumes 20% of our time",
    "aiMaturity": "experimenting",
    "hoursLostPerWeek": "10-20",
    "contextNote": "We are exploring AI solutions for sales automation",
    "language": "cs",
    "city": "Prague",
    "respondentRole": "sales_manager",
    "crmUsed": "hubspot_pipedrive",
    "techOpenness": "open",
    "topExamples": ["auto_leads", "ai_assistant"]
  }'
```

#### Processing Flow

1. Validate method (POST only)
2. Check body size (max 15 KB)
3. Parse JSON
4. Honeypot check (silent discard if triggered)
5. Rate limit check (5 per hour per IP)
6. Required field validation
7. Enum validation
8. Optional field sanitization
9. Build lead object
10. Store in survey-leads Blobs
11. Mirror to Netlify Forms
12. Send team notification email (parallel)
13. Send user confirmation email (parallel)
14. Return 200 success

#### Security Features

- **Honeypot**: website_url field discards bot submissions silently
- **Rate limiting**: Per-IP, 5 submissions/hour
- **HTML stripping**: Prevents XSS in free-text fields
- **Size limits**: Max 15 KB body, max 500 chars in long fields
- **Phone validation**: E.164 format validation
- **URL validation**: Only http/https allowed

#### Email Templates

**Team Notification Subject:**
```
Nový průzkum: {companyName} ({industry})
```

**User Confirmation Subject:**
```
Potvrzení: Vaše odpovědi byly přijaty
```

#### Notes

- **Storage**: Leads stored in survey-leads Blobs store
- **Netlify Forms**: Also mirrored for dashboard visibility
- **Email service**: Resend API
- **Parallel emails**: Both emails sent in parallel (Promise.allSettled)
- **Non-fatal**: Email failures don't block submission
- **Traffic tracking**: Full UTM & click ID support

---

### POST /api/pricing-lead

Pricing calculator lead handler with PDF attachment and comprehensive security.

**Endpoint:** `POST /.netlify/functions/pricing-lead`

#### Authentication
- None required (public endpoint)

#### CORS Policy
```
Access-Control-Allow-Origin: https://hypedigitaly.ai
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

#### Content-Type
- `application/json` (required)

#### Request Schema

```json
{
  "name": "string (required, max 100 chars)",
  "email": "string (required, valid email)",
  "companyName": "string (required, max 200 chars)",
  "pdf": "string (required, base64 or data URI)",
  "language": "cs | en (optional, default: cs)",
  "consent": true (required),
  "consentVersion": "string (optional, default: pricing-lead-v1)",
  "calculatorState": { /* object (required) */ },
  "calculatorResults": { /* object (required) */ },
  "timestamp": number (milliseconds, optional for timing check),
  "honeypot": "string (optional, must be empty)",
  "utm": {
    "source": "string (optional)",
    "medium": "string (optional)",
    "campaign": "string (optional)",
    "content": "string (optional)",
    "term": "string (optional)",
    "gclid": "string (optional)",
    "fbclid": "string (optional)",
    "referrer": "string (optional)"
  },
  "utmSource": "string (optional, fallback)",
  "utmMedium": "string (optional, fallback)",
  "utmCampaign": "string (optional, fallback)",
  "utmContent": "string (optional, fallback)",
  "utmTerm": "string (optional, fallback)",
  "gclid": "string (optional, fallback)",
  "fbclid": "string (optional, fallback)",
  "referrer": "string (optional, fallback)"
}
```

#### PDF Format

- **Encoding**: Base64 encoded PDF
- **Maximum size**: ~1 MB (1,398,102 base64 chars)
- **Magic bytes**: Must start with `%PDF`
- **Trailer**: Must end with `%%EOF`
- **Data URI**: Optional `data:application/pdf;base64,` prefix (auto-stripped)

#### Request Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|-----------|-------|
| name | string | ✓ | 100 | Lead name |
| email | string | ✓ | 254 | Valid email |
| companyName | string | ✓ | 200 | Company name |
| pdf | string | ✓ | 1.4M | Base64 PDF |
| language | string | | 2 | `cs` or `en` |
| consent | boolean | ✓ | N/A | Must be true |
| consentVersion | string | | 80 | Consent version ID |
| calculatorState | object | ✓ | N/A | Calculator form state |
| calculatorResults | object | ✓ | N/A | Calculator results |
| timestamp | number | | N/A | Submission timestamp (ms) |
| honeypot | string | | 0 | Must be empty |

#### Success Response (200 OK)

```json
{
  "success": true
}
```

#### Honeypot Response (200 OK) - Silent

If honeypot field filled:
```json
{
  "success": true
}
```

Returns success without storing (bot detected and silently discarded).

#### Timing Check Response (200 OK) - Silent

If submission completed in < 3 seconds:
```json
{
  "success": true
}
```

Returns success without storing (likely bot, timing too fast).

#### Rate Limit Response (429 Too Many Requests)

Max 3 submissions per hour per IP:
```json
{
  "success": false,
  "error": "Too many submissions. Please try again later."
}
```

#### Validation Error Responses

**400 Bad Request** - Missing required field:
```json
{
  "success": false,
  "error": "Name is required"
}
```

**400 Bad Request** - Invalid email:
```json
{
  "success": false,
  "error": "Valid email is required"
}
```

**400 Bad Request** - Missing consent:
```json
{
  "success": false,
  "error": "Consent is required"
}
```

**400 Bad Request** - Invalid PDF encoding:
```json
{
  "success": false,
  "error": "Invalid PDF encoding"
}
```

**413 Payload Too Large** - PDF too large:
```json
{
  "success": false,
  "error": "PDF exceeds 1 MB limit"
}
```

**400 Bad Request** - Invalid PDF content:
```json
{
  "success": false,
  "error": "Invalid PDF content"
}
```

**400 Bad Request** - Invalid calculator object:
```json
{
  "success": false,
  "error": "Invalid calculatorState"
}
```

**413 Payload Too Large** - Body too large:
```json
{
  "success": false,
  "error": "Request body too large"
}
```

**400 Bad Request** - Invalid JSON:
```json
{
  "success": false,
  "error": "Invalid JSON body"
}
```

**415 Unsupported Media Type**:
```json
{
  "success": false,
  "error": "Content-Type must be application/json"
}
```

**405 Method Not Allowed**:
```json
{
  "success": false,
  "error": "Method not allowed"
}
```

#### Rate Limiting

- **Limit**: 3 submissions per hour per IP
- **Window**: 3,600,000 milliseconds
- **Storage**: `pricing-ratelimit` Blobs store
- **Fails open**: If rate limit store unavailable, allow request

#### Example curl Command

```bash
# Generate PDF base64 (example with placeholder)
PDF_BASE64="JVBERi0xLjQKJeLj..."

curl -X POST "https://hypedigitaly.ai/.netlify/functions/pricing-lead" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john@company.cz\",
    \"companyName\": \"Example Corp\",
    \"pdf\": \"$PDF_BASE64\",
    \"language\": \"cs\",
    \"consent\": true,
    \"calculatorState\": {
      \"numSalespeople\": 5,
      \"avgLeadsPerDay\": 10
    },
    \"calculatorResults\": {
      \"monthlyCost\": 4900,
      \"yearlyAmount\": 58800,
      \"package\": \"professional\"
    },
    \"timestamp\": $(date +%s%3N),
    \"utm\": {
      \"source\": \"pricing_page\",
      \"campaign\": \"spring_2026\"
    }
  }"
```

#### Processing Flow

1. Preflight (OPTIONS)
2. Method guard (POST only)
3. Content-Type guard (application/json)
4. Body size guard (max 4 MB)
5. Parse JSON
6. Honeypot check (silent 200 if filled)
7. Timing check (silent 200 if < 3 seconds)
8. Rate limit check (3 per hour per IP)
9. Input validation:
   - name: non-empty, HTML stripped
   - email: valid format
   - companyName: non-empty, HTML stripped
   - pdf: base64 validation
   - consent: must be true
10. PDF validation:
    - Decode from base64
    - Check magic bytes (%PDF)
    - Check trailer (%%EOF)
    - Validate size < 1 MB
11. Calculator object validation:
    - Max 10 keys for state
    - Max 15 keys for results
    - Max 2000 chars serialized (state)
    - Max 5000 chars serialized (results)
    - No nested objects
12. Build lead object (explicit fields only)
13. Store in pricing-leads Blobs
14. Send user email with PDF attachment (parallel)
15. Send team notification email (parallel)
16. Return 200 success

#### Security Features

- **Honeypot**: Silent discard if filled
- **Timing check**: Silent discard if completed too fast (< 3s)
- **Rate limiting**: 3 per hour per IP
- **PDF validation**: Magic bytes + trailer + size check
- **HTML stripping**: Prevents XSS in name/company
- **Explicit fields**: Never spreads raw body (prevents prototype pollution)
- **Input sanitization**: All fields validated and bounded
- **Base64 validation**: Only valid base64 characters

#### PDF Attachment

- **Filename**: `hypelead-cenova-nabidka.pdf`
- **Encoding**: Base64 (sent to Resend)
- **Content**: Generated HTML report as PDF

#### Email Templates

**User Email Subject:**
```
HypeLead.ai: Vaše cenová nabídka
```

**Team Email Subject:**
```
Nový zájemce z ceníku: {name}
```

#### Notes

- **Storage**: Leads stored in pricing-leads Blobs store
- **Email service**: Resend API with PDF attachment
- **Parallel emails**: Both sent in parallel (Promise.allSettled)
- **Non-fatal**: Email failures don't block submission
- **PDF attachment**: Only sent to user, not team
- **Traffic tracking**: Full UTM support via `utm` object or fallback fields
- **Consent tracking**: `consentedAt` and `consentVersion` stored with lead

---

## Lookup Endpoints

### GET /api/ares-lookup

Czech company lookup via ARES (business registry) API.

**Endpoint:** `GET /.netlify/functions/ares-lookup?q=<ICO>`

#### Authentication
- None required (public endpoint)
- CORS locked to https://hypedigitaly.ai

#### CORS Policy
```
Access-Control-Allow-Origin: https://hypedigitaly.ai
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Max-Age: 86400
```

#### Query Parameters

| Parameter | Type | Required | Max Length | Notes |
|-----------|------|----------|-----------|-------|
| q | string | ✓ | 8 | IČO (Czech business ID) exactly 8 digits |

#### Request Validation

- **Format**: Exactly 8 numeric digits
- **Invalid formats**:
  - Too few/too many digits
  - Non-numeric characters
  - Leading zeros accepted

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "ico": "12345678",
    "companyName": "Example Company s.r.o.",
    "city": "Prague",
    "legalForm": "Limited Liability Company",
    "status": "active",
    "founded": "2015-01-15"
  }
}
```

#### Company Not Found Response (404 Not Found)

```json
{
  "success": false,
  "error": "Firma s tímto IČO nebyla nalezena v registru ARES."
}
```

#### Validation Error Response (400 Bad Request)

**Missing parameter:**
```json
{
  "success": false,
  "error": "Chybí parametr q (IČO firmy)."
}
```

**Invalid format:**
```json
{
  "success": false,
  "error": "Neplatný formát IČO. IČO musí obsahovat přesně 8 číslic."
}
```

#### Rate Limit Response (429 Too Many Requests)

Max 10 requests per minute per IP:
```json
{
  "success": false,
  "error": "Příliš mnoho požadavků. Zkuste to prosím za minutu."
}
```

#### Server Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "error": "Interní chyba serveru. Zkuste to prosím znovu."
}
```

#### Rate Limiting

- **Limit**: 10 requests per 60 seconds per IP
- **Storage**: `rate-limits` Blobs store
- **Key format**: `ares-{clientIp}`
- **Fails open**: If rate limit store unavailable, allow request

#### Example curl Command

```bash
# Single lookup
curl -X GET "https://hypedigitaly.ai/.netlify/functions/ares-lookup?q=12345678"

# Decode response
curl -s "https://hypedigitaly.ai/.netlify/functions/ares-lookup?q=12345678" | jq .

# Check rate limit (multiple rapid calls)
for i in {1..15}; do
  curl -s "https://hypedigitaly.ai/.netlify/functions/ares-lookup?q=12345678" | jq -r '.success'
  echo "Request $i"
done
```

#### ARES API Integration

- **Endpoint**: Czech ARES (Administrative Register of Economic Subjects) v3 API
- **Caching**: Responses cached per IČO (optional, depends on implementation)
- **Fallback**: Returns 404 if ARES unavailable
- **Normalization**: Returned data normalized to standard format

#### Data Returned

- **ico**: 8-digit Czech business ID
- **companyName**: Official registered company name
- **city**: Company headquarters city
- **legalForm**: Type of legal entity
- **status**: Active/inactive status
- **founded**: Founding date (if available)

#### IP Extraction

- **Primary**: `x-forwarded-for` header (Netlify standard)
- **Fallback**: `client-ip` header
- **Sanitization**: Only alphanumeric + dots/colons allowed (IPv4/IPv6)
- **Max length**: 45 characters (IPv6 max)
- **Unknown IP handling**: Rate limiting skipped

#### Example curl Command with Rate Limit Test

```bash
# Test rate limiting (make 15 requests, expect 5 to succeed, 10 to fail)
for i in {1..15}; do
  RESPONSE=$(curl -s "https://hypedigitaly.ai/.netlify/functions/ares-lookup?q=12345678")
  STATUS=$(echo $RESPONSE | jq -r '.success // .error')
  echo "Request $i: $STATUS"
done
```

#### Notes

- **CORS**: Locked to https://hypedigitaly.ai (browser security)
- **Rate limit window**: Sliding 60-second window per IP
- **Fails open**: Rate limit check failure allows request (monitoring)
- **Graceful degradation**: Missing company = 404, not 500
- **Content-Type**: Always application/json
- **Caching**: No HTTP caching (Cache-Control: no-cache)

---

## Common Patterns

### Pagination

None of the endpoints implement pagination. All results returned in a single response.
- Audit leads: Sorted newest first
- Admin leads endpoint: Handles large datasets in single response

### Error Handling

All endpoints follow consistent error response pattern:

```json
{
  "success": false,
  "error": "User-friendly error message"
}
```

For validation errors (contact, survey, pricing-lead):
```json
{
  "success": false,
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

### Authentication

- **Public endpoints**: No authentication required (audit, contact, survey, pricing-lead, ares-lookup)
- **Admin endpoints**: Bearer token via Authorization header
  - Constant-time comparison (timing attack resistant)
  - Token value in ADMIN_AUTH_PASSWORD environment variable

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| survey | 5 | 1 hour |
| pricing-lead | 3 | 1 hour |
| ares-lookup | 10 | 1 minute |

### Email Notifications

- **Service**: Resend API (https://api.resend.com/emails)
- **From address**: `HypeDigitaly <noreply@notifications.hypedigitaly.ai>`
- **Non-blocking**: Email failures don't block form submission (fire-and-forget)
- **Languages**: Czech primary, English secondary

### Traffic Tracking

All lead sources track:
- **UTM parameters**: source, medium, campaign, content, term
- **Click IDs**: gclid (Google), fbclid (Facebook), msclkid (Microsoft)
- **Referrer**: HTTP referrer
- **leadSource**: Custom lead source field

---

## Environment Variables Required

For full functionality, these environment variables must be set:

| Variable | Used By | Required |
|----------|---------|----------|
| NETLIFY_SITE_ID | All (Blobs store) | ✓ |
| NETLIFY_API_TOKEN | All (Blobs store) | ✓ |
| RESEND_API_KEY | audit, contact, survey, pricing-lead | ✓ |
| OPENROUTER_API_KEY | audit, audit-background, audit-validate | ✓ |
| TAVILY_API_KEY | audit, audit-background | ✓ |
| FIRECRAWL_API_KEY | audit-background | (optional) |
| ADMIN_AUTH_PASSWORD | admin-leads, admin-leads-delete | ✓ |

---

## Acceptance Checklist

- [x] All 10+ endpoints fully documented
- [x] Request/response JSON schemas with examples
- [x] Authentication & CORS policy per endpoint
- [x] Rate limits specified
- [x] Error responses with examples
- [x] curl command for every endpoint
- [x] Field constraints (max length, type, required)
- [x] Processing flow diagrams (step-by-step)
- [x] Notes on implementation details
- [x] Security considerations

---

**Last Updated:** 2026-03-19
**Version:** 1.0 - Complete Reference
