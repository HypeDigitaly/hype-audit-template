# Storage and Data Layer

This document describes the Netlify Blobs storage architecture, lead data schemas, and consistency guarantees for the HypeDigitaly system.

## Overview

All storage uses **Netlify Blobs** with **strong consistency** enabled (`consistency: "strong"`) across 10 blob stores. This ensures that all reads reflect the most recent writes, which is critical for the polling-based patterns used throughout the system.

### Why Strong Consistency?

The system uses frontend polling to track job progress and retrieve data (e.g., audit job status, lead lists). Strong consistency guarantees that:
- A status update written by background job is immediately readable by subsequent poll requests
- Lead indices remain coherent even under high write concurrency
- Admin dashboard aggregation queries always see current data

Without strong consistency, a client polling for status updates could see stale data and report progress as stuck.

---

## Blob Store Inventory

### 1. `audit-reports`
- **Purpose:** Store audit report HTML content and metadata
- **Key Pattern:**
  - `{reportId}` → HTML report content (string)
  - `{reportId}-meta` → JSON metadata object
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `xyz12abc34d5` → `<html>...</html>`
  - `xyz12abc34d5-meta` → `{"companyName": "...", "createdAt": "...", ...}`

### 2. `audit-leads`
- **Purpose:** Store audit leads with embedded contact and traffic source data
- **Key Pattern:**
  - `{leadId}` → JSON AuditLead object
  - `_leads_index` → JSON array of lead IDs (newest first)
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `lead-1lj2m3a4b-abc123` → `{"id": "...", "email": "...", "reportId": "...", ...}`
  - `_leads_index` → `["lead-1lj2m3a4b-abc123", "lead-1lj2m2z9a-def456", ...]`

### 3. `audit-jobs`
- **Purpose:** Track background job status for frontend polling
- **Key Pattern:**
  - `{jobId}` → JSON AuditJob object
- **TTL:** Job record persists until explicitly cleared; auto-cleanup via retention policy possible
- **Consistency:** Strong
- **Example Keys:**
  - `550e8400-e29b-41d4-a716-446655440000` → `{"status": "researching", "progress": 35, ...}`

### 4. `contact-leads`
- **Purpose:** Store contact form submissions
- **Key Pattern:**
  - `{leadId}` → JSON ContactLead object
  - `_leads_index` → JSON array of lead IDs (newest first)
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `contact-1lj2m3a4b-abc123` → `{"name": "...", "email": "...", "phone": "...", ...}`

### 5. `survey-leads`
- **Purpose:** Store Pain-Point Discovery Survey submissions
- **Key Pattern:**
  - `{leadId}` → JSON SurveyLead object
  - `_leads_index` → JSON array of lead IDs (newest first)
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `survey-1lj2m3a4b-abc123` → `{"companyName": "...", "painPoints": [...], "aiMaturity": "...", ...}`

### 6. `onboarding-leads`
- **Purpose:** Store completed HypeLead onboarding applications (draft → submitted)
- **Key Pattern:**
  - `{leadId}` → JSON OnboardingLead object
  - `_leads_index` → JSON array of lead IDs
  - `_rl:{key}` → JSON rate limit entry (internal usage)
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `onboarding-1lj2m3a4b-abc123` → `{"companyName": "...", "selectedPackage": "...", ...}`

### 7. `pricing-leads`
- **Purpose:** Store pricing calculator submissions with calculator state and results
- **Key Pattern:**
  - `{leadId}` → JSON PricingLead object
  - `_leads_index` → JSON array of lead IDs (newest first)
- **TTL:** None (permanent)
- **Consistency:** Strong
- **Example Keys:**
  - `pricing-1lj2m3a4b-abc123` → `{"name": "...", "calculatorState": {...}, "calculatorResults": {...}, ...}`

### 8. `survey-ratelimit`
- **Purpose:** Rate limit tracking for survey form (separate store to avoid polluting lead records)
- **Key Pattern:**
  - `ratelimit-{clientIP}` → JSON counter object `{count: number, firstRequest: timestamp}`
- **TTL:** Each entry valid for 1 hour; automatic expiry on read
- **Consistency:** Strong
- **Max Requests:** 5 per hour per IP
- **Example Keys:**
  - `ratelimit-192.168.1.100` → `{"count": 3, "firstRequest": 1711000000000}`

### 9. `pricing-ratelimit`
- **Purpose:** Rate limit tracking for pricing calculator (separate store)
- **Key Pattern:**
  - `rate-{clientIP}` → JSON counter object `{count: number, firstRequest: timestamp}`
- **TTL:** Each entry valid for 1 hour; automatic expiry on read
- **Consistency:** Strong
- **Max Requests:** 3 per hour per IP
- **Example Keys:**
  - `rate-192.168.1.100` → `{"count": 2, "firstRequest": 1711000000000}`

### 10. `ares-cache`
- **Purpose:** Cache Czech business registry (ARES) lookups for IČO validation (onboarding only)
- **Key Pattern:**
  - `{ico}` → JSON AresCacheEntry object
- **TTL:** 7 days (entries expire and are deleted on read)
- **Consistency:** Strong
- **Example Keys:**
  - `12345678` → `{"ico": "12345678", "name": "...", "expiresAt": "2026-03-26T...", ...}`

---

## Lead Type Schemas

### AuditLead (audit-leads store)
Stores audit form submissions with generated reports and traffic tracking.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | `string` | `lead-1lj2m3a4b-abc123` | Format: `lead-${base36ts}-${rand6}` |
| `email` | `string` | `alice@example.com` | Contact email |
| `companyName` | `string` | `TechCorp s.r.o.` | Company name |
| `website` | `string` | `https://techcorp.cz` | Company website URL |
| `city` | `string` | `Prague` | Location |
| `biggestPainPoint` | `string` | `Manual lead processing` | Free-text pain point |
| `currentTools` | `string` | `Excel, Google Sheets` | Current tooling |
| `language` | `'cs' \| 'en'` | `'cs'` | User's language preference |
| `reportId` | `string` | `xyz12abc34d5` | Links to report content in `audit-reports` store |
| `reportUrl` | `string` | `https://hypedigitaly.ai/report/xyz12abc34d5` | Public report URL |
| `submittedAt` | `string (ISO 8601)` | `2026-03-19T10:30:45.123Z` | Submission timestamp |
| `detectedIndustry` | `string?` | `SaaS` | AI-detected industry |
| `leadSource` | `string?` | `audit-page-form` | Form source identifier |
| `utmSource` | `string?` | `google` | UTM campaign source |
| `utmMedium` | `string?` | `cpc` | UTM medium |
| `utmCampaign` | `string?` | `spring-2026` | UTM campaign |
| `utmContent` | `string?` | `leadgen-banner` | UTM content |
| `utmTerm` | `string?` | `ai+automation` | UTM search term |
| `gclid` | `string?` | `EAIaIQobChMI...` | Google Ads click ID |
| `fbclid` | `string?` | `Ewo7Csjsj...` | Facebook click ID |
| `msclkid` | `string?` | `31u403i20jd...` | Microsoft click ID |
| `referrer` | `string?` | `https://google.com` | HTTP referrer |

### ContactLead (contact-leads store)
Stores general contact form submissions from the contact page.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | `string` | `contact-1lj2m3a4b-abc123` | Format: `contact-${base36ts}-${rand6}` |
| `name` | `string` | `Alice Johnson` | Contact person name |
| `email` | `string` | `alice@example.com` | Contact email (required) |
| `phone` | `string?` | `+420775123456` | Optional phone number |
| `website` | `string?` | `https://techcorp.cz` | Optional company website |
| `service` | `string?` | `custom-solutions` | Service interested in |
| `budget_onetime` | `string?` | `250000-500000 CZK` | One-time budget range |
| `budget_monthly` | `string?` | `50000-100000 CZK` | Monthly budget range |
| `message` | `string?` | `Looking for AI integration...` | Free-text message |
| `language` | `'cs' \| 'en'` | `'cs'` | User's language |
| `submittedAt` | `string (ISO 8601)` | `2026-03-19T10:30:45.123Z` | Submission timestamp |
| `source` | `'contact'` | `'contact'` | Fixed lead type marker |
| `leadSource` | `string?` | `contact-page-form` | Form origin |
| `utmSource` | `string?` | `facebook` | UTM source |
| `utmMedium` | `string?` | `organic` | UTM medium |
| `utmCampaign` | `string?` | `awareness` | UTM campaign |
| `utmContent` | `string?` | `cta-button` | UTM content |
| `utmTerm` | `string?` | `none` | UTM term |
| `gclid` | `string?` | `EAIaIQobChMI...` | Google click ID |
| `fbclid` | `string?` | `Ewo7Csjsj...` | Facebook click ID |
| `msclkid` | `string?` | `31u403i20jd...` | Microsoft click ID |
| `referrer` | `string?` | `https://linkedin.com` | HTTP referrer |

### SurveyLead (survey-leads store)
Stores Pain-Point Discovery Survey responses with comprehensive business and technical signals.

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | `string` | `survey-1lj2m3a4b-abc123` | Format: `survey-${base36ts}-${rand6}` |
| `source` | `'survey'` | `'survey'` | Fixed lead type marker |
| `email` | `string` | `alice@example.com` | Contact email (required) |
| `companyName` | `string` | `TechCorp s.r.o.` | Company name (required) |
| `industry` | `string` | `Manufacturing` | Industry/sector (required) |
| `companySize` | `'solo' \| '2-10' \| '11-50' \| '51-250' \| '250+'` | `'11-50'` | Employee count bracket |
| `painPoints` | `string[]` | `['new_customers', 'boring_admin']` | Array of pain point IDs (1–18 items) |
| `primaryPainPoint` | `string` | `new_customers` | User's self-identified top pain point |
| `aiMaturity` | `'none' \| 'experimenting' \| 'active' \| ''` | `'experimenting'` | Current AI adoption level |
| `hoursLostPerWeek` | `'1-5' \| '5-10' \| '10-20' \| '20-40' \| '40+' \| ''` | `'10-20'` | Weekly hours lost to manual work |
| `contextNote` | `string` | `We mainly struggle with...` | Free-text context (max 500 chars) |
| `language` | `'cs' \| 'en'` | `'cs'` | User's language |
| `submittedAt` | `string (ISO 8601)` | `2026-03-19T10:30:45.123Z` | Submission timestamp |
| `leadSource` | `string` | `'gc-event-page'` | Form source (default: `gc-event-page`) |
| `city` | `string?` | `Prague` | Optional city/location |
| `phoneNumber` | `string?` | `775123456` | Optional phone (digits + leading + only) |
| `toolsUsed` | `string[]?` | `['hubspot', 'zapier']` | Optional tools already in use |
| `websiteUrl` | `string?` | `https://techcorp.cz` | Optional company website (http/https only) |
| `respondentRole` | `'owner_ceo' \| 'sales_manager' \| 'ops_manager' \| 'it_lead' \| 'employee' \| 'other' \| ''` | `'sales_manager'` | Respondent's job title |
| `crmUsed` | `'none' \| 'excel' \| 'hubspot_pipedrive' \| 'salesforce' \| 'raynet' \| 'custom_other' \| ''` | `'hubspot_pipedrive'` | CRM system in use |
| `erpUsed` | `'none' \| 'pohoda' \| 'abra_helios' \| 'sap' \| 'money_s3' \| 'custom_other' \| ''` | `'pohoda'` | ERP system in use |
| `techOpenness` | `'conservative' \| 'open' \| 'innovator' \| ''` | `'innovator'` | Tech adoption mindset |
| `techLevel` | `'none' \| 'beginner' \| 'intermediate' \| 'advanced' \| ''` | `'intermediate'` | Technical skill level |
| `topExamples` | `string[]?` | `['auto_leads', 'ai_web']` | Examples of AI tools they'd like (max 3; can include `other:freetext`) |
| `biggestManualProcess` | `string?` | `Lead qualification` | Biggest manual process they struggle with |
| `manualWorkPercentage` | `string?` | `30%` | Estimated percentage of work spent on manual processes |
| `utmSource` | `string?` | `google` | UTM source |
| `utmMedium` | `string?` | `cpc` | UTM medium |
| `utmCampaign` | `string?` | `survey-2026` | UTM campaign |
| `utmContent` | `string?` | `banner` | UTM content |
| `utmTerm` | `string?` | `ai` | UTM term |
| `gclid` | `string?` | `EAIaIQobChMI...` | Google click ID |
| `fbclid` | `string?` | `Ewo7Csjsj...` | Facebook click ID |
| `msclkid` | `string?` | `31u403i20jd...` | Microsoft click ID |
| `referrer` | `string?` | `https://google.com` | HTTP referrer |

**Note on `techLevel` and `topExamples`:** These fields are stored in the raw survey lead (via survey.ts) but may not appear in the admin-leads aggregation summary type. They are included in the full SurveyLead object in the `survey-leads` store.

### OnboardingLeadSummary (admin aggregation only)
Summarized view of onboarding leads as returned by admin-leads API (full OnboardingLead stored in `onboarding-leads` store).

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | `string` | `onboarding-1lj2m3a4b-abc123` | Lead ID |
| `source` | `'onboarding'` | `'onboarding'` | Fixed lead type marker |
| `companyName` | `string` | `TechCorp s.r.o.` | Company name |
| `contactPersonEmail` | `string` | `alice@techcorp.cz` | Primary contact email |
| `contactPersonName` | `string` | `Alice Johnson` | Contact person |
| `selectedPackage` | `'starter' \| 'professional' \| 'enterprise'` | `'professional'` | Chosen service tier |
| `ico` | `string` | `12345678` | Czech company ID |
| `city` | `string` | `Prague` | Location |
| `website` | `string` | `https://techcorp.cz` | Company website |
| `status` | `string` | `'submitted'` | Onboarding status |
| `driveFolder` | `string?` | `https://drive.google.com/drive/folders/...` | Google Drive project folder (if created) |
| `isPandaDocSigned` | `boolean?` | `true` | Contract signature status |
| `submittedAt` | `string (ISO 8601)` | `2026-03-19T10:30:45.123Z` | Application timestamp |
| `numSalespeople` | `number` | `5` | Number of salespeople |
| `dailyVolume` | `string` | `50-100 leads` | Daily lead volume |
| `channels` | `string[]` | `['facebook', 'google']` | Sales channels |

### PricingLeadSummary (admin aggregation only)
Summarized view of pricing calculator submissions (full PricingLead stored in `pricing-leads` store).

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | `string` | `pricing-1lj2m3a4b-abc123` | Lead ID |
| `source` | `'pricing-calculator'` | `'pricing-calculator'` | Fixed lead type marker |
| `name` | `string` | `Alice Johnson` | Contact name |
| `email` | `string` | `alice@example.com` | Contact email |
| `companyName` | `string` | `TechCorp s.r.o.` | Company name |
| `language` | `'cs' \| 'en'` | `'cs'` | User's language |
| `submittedAt` | `string (ISO 8601)` | `2026-03-19T10:30:45.123Z` | Submission timestamp |
| `calculatorState` | `Record<string, unknown>` | `{step: 1, ...}` | Full calculator UI state (for reference) |
| `calculatorResults` | `Record<string, unknown>` | `{totalCost: 150000, ...}` | Calculated pricing results |

---

## Key Generation Patterns

### Lead ID Format: `{prefix}-${base36ts}-${rand6}`

All leads use a consistent ID format for easy identification and parsing:

```typescript
function generateLeadId(prefix: string): string {
  const timestamp = Date.now().toString(36);      // Base36-encoded milliseconds
  const random = Math.random()
    .toString(36)                                  // Base36 random string
    .substring(2, 8);                              // First 6 chars
  return `${prefix}-${timestamp}-${random}`;
}
```

**Examples:**
- Audit: `lead-1lj2m3a4b-abc123`
- Contact: `contact-1lj2m3a4b-def456`
- Survey: `survey-1lj2m3a4b-ghi789`
- Pricing: `pricing-1lj2m3a4b-jkl012`
- Onboarding: `onboarding-1lj2m3a4b-mno345`

**Advantages:**
- Sortable by insertion time (base36 timestamp is time-ascending)
- Globally unique (7-char random suffix provides 46^6 ≈ 9 trillion combinations)
- Human-readable and prefix-decodable
- No dependency on distributed ID services (generated client/server-side)

### Report ID Format: 12 alphanumeric characters

Audit reports use a simpler random ID (no timestamp):

```typescript
function generateReportId(): string {
  return Math.random().toString(36).substring(2, 14);  // 12 random base36 chars
}
```

**Example:** `xyz12abc34d5`

### Job ID Format: Browser UUID v4

Audit background jobs use browser-generated UUIDs:

```typescript
const jobId = crypto.randomUUID();  // e.g., "550e8400-e29b-41d4-a716-446655440000"
```

**Why UUID v4?**
- Guarantees uniqueness across all browser sessions
- Widely supported in modern browsers (no polyfill needed)
- Standard format recognized by backend systems
- No server coordination required

---

## Index Pattern and Race Condition Warnings

### `_leads_index` Array Structure

Each lead store maintains a JSON index array at the fixed key `_leads_index`:

```json
["lead-1lj2m3a4b-abc123", "lead-1lj2m3a4b-def456", "lead-1lj2m3a4b-ghi789"]
```

**Insertion Pattern (Audit/Contact/Survey/Pricing):**

```typescript
async function storeLead(lead: Lead): Promise<void> {
  const store = getStore('leads-store-name');

  // 1. Store individual lead record
  await store.set(lead.id, JSON.stringify(lead), { metadata: {...} });

  // 2. Read current index
  let index: string[] = [];
  try {
    const existing = await store.get('_leads_index');
    if (existing) {
      index = JSON.parse(existing);
    }
  } catch {
    // Index doesn't exist yet
  }

  // 3. Prepend new lead (newest first)
  index.unshift(lead.id);

  // 4. Write back (NOT ATOMIC!)
  await store.set('_leads_index', JSON.stringify(index));
}
```

### RACE CONDITION WARNING

**The index update uses a non-atomic read-modify-write pattern.** In high-concurrency scenarios, concurrent writes can lose updates:

```
Timeline of race condition:

Thread A: Read index → ["id1", "id2"]
                      ↓
Thread B: Read index → ["id1", "id2"]
                      ↓
Thread A: unshift("id3") → ["id3", "id1", "id2"]
         Write back
                      ↓
Thread B: unshift("id4") → ["id4", "id1", "id2"]
         Write back (CLOBBERS Thread A's write)

Final index: ["id4", "id1", "id2"]  ✗ Missing "id3"!
```

**Impact:**
- Lead record still exists in blob storage (not lost)
- Index entry missing (lead invisible to admin dashboard)
- Resolution: Rebuild index from all individual records (admin utility)

**Mitigation:**
- Onboarding uses retry-with-verification (3 attempts, detects and recovers from conflicts)
- Contact/Survey/Pricing/Audit use simple unshift (best-effort, rare in production due to low submission concurrency)
- Admin cleanup tools can rebuild indices from individual records

**Best Practice for High-Volume Systems:**
Replace `_leads_index` unshift with atomic append-only log or replace read-modify-write with `store.list()` pagination API (if available).

---

## Consistency Model

### Strong Consistency Guarantees

All stores are configured with `consistency: "strong"`:

```typescript
const store = getStore({
  name: STORE_NAME,
  siteID,
  token,
  consistency: "strong"  // ← Critical for correctness
});
```

**What This Means:**

1. **Read-After-Write:** A value written to a key is immediately visible in subsequent reads of that key (from the same or different functions)
2. **Consistency Across Replicas:** All read replicas see the same committed state
3. **No Stale Reads:** Background jobs and polling clients never see outdated data

### Why This is Required

The system uses **polling-based status tracking** for audit jobs:

```
Client (browser) polls every 1.5 seconds:
  GET /api/audit-status?jobId=xyz
    → reads from blobs (must see latest write from background job)

Background job writes status update:
  store.set(jobId, JSON.stringify({status: "researching", progress: 35}))

Next poll immediately sees:
  {status: "researching", progress: 35} ✓

With eventual consistency, client might see stale:
  {status: "pending", progress: 0} ✗ (confusing/broken UX)
```

### Cost of Strong Consistency

Strong consistency is slower (~50–100ms added latency per operation) but:
- Acceptable for low-frequency operations (polling every 1–3 seconds)
- Necessary for correctness in lead tracking and admin dashboards
- Trade-off acceptable for this use case (not high-frequency trading or real-time chat)

---

## Dual Storage for Reports

Audit reports use a dual-key pattern for separation of concerns:

### Content Storage
```typescript
// Key: {reportId}
// Value: Full HTML report (string, can be 500KB–2MB)
await store.set(reportId, htmlContent);
```

### Metadata Storage
```typescript
// Key: {reportId}-meta
// Value: JSON metadata object
await store.set(`${reportId}-meta`, JSON.stringify({
  companyName: "...",
  createdAt: "...",
  email: "...",
  website: "..."
}));
```

**Benefits:**
- **Metadata-only queries:** Admin dashboard can list reports without loading 500KB HTML files
- **Selective cleanup:** Delete metadata without losing HTML (or vice versa)
- **Analytics isolation:** Track which reports are accessed most via metadata reads
- **Storage cost optimization:** Metadata operations are cheaper (smaller payloads)

**Example Query Pattern (Admin Leads API):**

```typescript
// No metadata fetch — very fast
const metadata = await store.get(`${reportId}-meta`);

// Only fetch full HTML when user clicks "View Report"
const htmlContent = await store.get(reportId);
```

---

## Admin Aggregation: N+5 Query Pattern

The `/api/admin-leads` endpoint aggregates leads from 5 stores using an N+5 query pattern:

### Query Flow

1. **5 Index Reads (parallel):**
   ```typescript
   const [auditIndex, contactIndex, surveyIndex,
           onboardingIndex, pricingIndex] = await Promise.all([
     store.get('_leads_index') from audit-leads,
     store.get('_leads_index') from contact-leads,
     store.get('_leads_index') from survey-leads,
     store.get('_leads_index') from onboarding-leads,
     store.get('_leads_index') from pricing-leads,
   ]);
   ```

2. **N Individual Reads (parallel):**
   ```typescript
   const leadIds = [...auditIndex, ...contactIndex, ...surveyIndex,
                    ...onboardingIndex, ...pricingIndex];

   const leads = await Promise.all(
     leadIds.map(id => getLeadById(id))
   );
   ```

### Performance Characteristics

- **5 index reads:** ~200ms (parallel, strong consistency)
- **N individual reads:** ~N * 5ms (parallel batching, strong consistency)
- **Total latency:** ~200ms + (N/batch_size * 5ms)

For 100 leads: ~200ms + 25ms = **~225ms** ✓ Acceptable

For 1000 leads: ~200ms + 250ms = **~450ms** ⚠ Consider pagination

### Optimization: Filtering at Query Time

The API supports filtering before individual reads:

```typescript
// Filter by source, date range, search term BEFORE N reads
const filteredIndex = auditIndex.filter(id => {
  // Apply filters to ids only (don't need full data yet)
});

const leads = await Promise.all(
  filteredIndex.map(id => store.get(id))
);
```

---

## Metadata Approaches: Pros and Cons

The system uses two approaches to store metadata alongside blob data:

### Approach 1: Blob Metadata (Netlify Blobs native)

```typescript
await store.set(leadId, JSON.stringify(lead), {
  metadata: {
    email: lead.email,
    companyName: lead.companyName,
    submittedAt: lead.submittedAt
  }
});
```

**Pros:**
- Single API call (set + metadata together)
- Blob metadata is queryable/filterable (future API expansion)
- No separate key management
- Atomic (metadata and content written together)

**Cons:**
- Limited size (~1KB metadata per blob)
- Metadata not independently retrievable as JSON
- Not suitable for large objects

### Approach 2: Separate `-meta` Key

```typescript
// Content
await store.set(reportId, htmlContent);

// Metadata
await store.set(`${reportId}-meta`, JSON.stringify(metadata));
```

**Pros:**
- Arbitrary metadata size
- Independently queryable
- Can fetch metadata without content
- Standard key-value pattern

**Cons:**
- Two API calls (not atomic)
- Manual key naming convention
- Risk of orphaned metadata if content deleted

### Current Usage in HypeDigitaly

- **Audit reports:** Separate `-meta` key (metadata can be large, frequent metadata-only queries)
- **Leads:** Blob metadata (metadata is small, metadata-only queries rare)
- **Files:** Separate `:meta` key (metadata critical for file type/size verification)

---

## Rate Limiting Strategy

### Survey Rate Limit (survey-ratelimit store)

```typescript
// Key: ratelimit-{clientIP}
// Value: {count: number, firstRequest: timestamp}
// Limit: 5 requests per hour per IP
```

**Implementation:**
```typescript
const now = Date.now();
const ONE_HOUR = 3600000;

let counter = await store.get(rateLimitKey);
if (counter && (now - counter.firstRequest) < ONE_HOUR) {
  if (counter.count >= 5) {
    return 429; // Too Many Requests
  }
  counter.count += 1;
} else {
  counter = { count: 1, firstRequest: now };
}

await store.set(rateLimitKey, JSON.stringify(counter));
```

### Pricing Rate Limit (pricing-ratelimit store)

```typescript
// Key: rate-{clientIP}
// Value: {count: number, firstRequest: timestamp}
// Limit: 3 requests per hour per IP
```

**Implementation:**
Identical pattern to survey, but with 3-request cap and separate store.

### Design Decisions

1. **Separate stores:** Prevent rate-limit entries from polluting lead records
2. **Per-IP tracking:** Extracted from `x-forwarded-for` or `client-ip` headers (sanitized to prevent key injection)
3. **Window-based expiry:** Automatic cleanup on read (no TTL needed)
4. **Fail-open:** If rate-limit check fails, proceed (don't block legitimate users)

---

## Data Retention Policies

| Store | Retention | Manual Cleanup | Notes |
|-------|-----------|----------------|-------|
| `audit-reports` | Permanent | Admin deletion available | Large content, consider archiving after 1 year |
| `audit-leads` | Permanent | Admin deletion available | GDPR: right-to-be-forgotten may require deletion |
| `audit-jobs` | 90 days | Auto-cleanup | Background job status only, safe to expire |
| `contact-leads` | Permanent | Admin deletion available | GDPR: implement deletion workflow |
| `survey-leads` | Permanent | Admin deletion available | GDPR: implement deletion workflow |
| `onboarding-leads` | Permanent | Admin deletion available | Customer data, long-term archive |
| `pricing-leads` | Permanent | Admin deletion available | GDPR: implement deletion workflow |
| `survey-ratelimit` | 1 hour | Auto-cleanup on read | No manual intervention needed |
| `pricing-ratelimit` | 1 hour | Auto-cleanup on read | No manual intervention needed |
| `ares-cache` | 7 days | Auto-cleanup on read | Czech business registry cache, frequent updates expected |

---

## Security Considerations

### Input Validation

All text inputs are validated and sanitized:
- HTML tags stripped from free-text fields
- String lengths capped (254 for emails, 200–500 for text fields)
- Email regex validation (RFC 5321 compliant)
- URL protocol validation (http/https only)
- Base64 validation for PDF data

### Admin Authentication

Admin endpoints (`/api/admin-leads`, `/api/admin-leads-delete`) use constant-time password verification:

```typescript
import crypto from 'crypto';

function verifyAdminAuth(event: HandlerEvent): boolean {
  const provided = event.headers['authorization'] || '';
  const expected = process.env.ADMIN_PASSWORD || '';

  return crypto.timingSafeEqual(
    Buffer.from(provided),
    Buffer.from(expected)
  );
}
```

**Why constant-time?** Prevents timing-based password guessing attacks.

### Honeypot Fields

Survey and pricing forms include hidden honeypot fields to block bot submissions:

```typescript
const honeypot = body.website_url;
if (typeof honeypot === 'string' && honeypot.trim() !== '') {
  return 200; // Silent accept, no storage
}
```

### CORS Restrictions

All endpoints are CORS-restricted to `https://hypedigitaly.ai`:

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

---

## Summary Checklist

- [x] All 10 blob stores inventoried with purposes and patterns
- [x] All 5 lead schemas fully documented with field tables and examples
- [x] `_leads_index` pattern explained with race condition warnings
- [x] Key generation patterns documented (lead, report, job)
- [x] Strong consistency requirement justified and explained
- [x] Dual storage for reports (content + metadata)
- [x] Admin aggregation N+5 query pattern explained
- [x] Metadata approaches compared (blob metadata vs separate key)
- [x] Rate limiting strategy detailed for survey and pricing
- [x] Data retention and cleanup documented
- [x] Security considerations (validation, auth, honeypot, CORS)

