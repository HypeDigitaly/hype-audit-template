# Environment Setup & Deployment Guide

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Implementation Reference

This document defines environment configuration, secrets management, build pipeline, and deployment procedures for the HypeDigitaly audit system and admin platform. It covers local development setup, production deployment, troubleshooting, and hardcoded URL management.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables - Audit & Admin Scoped](#environment-variables---audit--admin-scoped)
3. [Local Development Setup](#local-development-setup)
4. [Build Pipeline](#build-pipeline)
5. [Production Deployment](#production-deployment)
6. [Netlify Configuration Files](#netlify-configuration-files)
7. [Hardcoded URLs & Production Updates](#hardcoded-urls--production-updates)
8. [Background Functions (15-Min Timeout)](#background-functions-15-min-timeout)
9. [Blob Store Configuration](#blob-store-configuration)
10. [Troubleshooting](#troubleshooting)
11. [Out-of-Scope (Onboarding Only)](#out-of-scope-onboarding-only)

---

## Prerequisites

**Required Tools:**
- Node.js 18+ (specified in `netlify.toml` as `NODE_VERSION = "18"`)
- npm 10+ (comes with Node 18)
- Netlify CLI 15.0+ (`npm install -g netlify-cli`)
- Git 2.30+ (for build history fetching in Netlify)
- Bash or compatible shell

**Verify Installation:**
```bash
node --version          # Should be v18.x or higher
npm --version           # Should be v10.x or higher
netlify --version       # Should be v15.0 or higher
git --version           # Should be v2.30 or higher
```

---

## Config Schema Overview

The template now uses a **hierarchical configuration schema** (extends from ~33 to ~120+ fields):

**Configuration Sections (10 main areas):**
1. **company** — Legal name, industry, description, contact info (7 fields)
2. **domain** — URLs, CORS origin (3 fields)
3. **branding** — Logo, favicon, primary/accent colors (4 fields)
4. **contact** — Street, city, postal code, country, maps embed (7 fields)
5. **team[]** — Team members with names, titles, emails, calendar links (5 fields × N members)
6. **social** — LinkedIn, Instagram, Facebook, Google Reviews (4 fields)
7. **notifications** — Email recipients, sender email/name (3 fields)
8. **content** — Hero copy, CTA text, pricing tiers (optional, 10+ fields)
9. **auditForm** — Form field options, visibility toggles, pain points (optional, 15+ fields)
10. **nav** — Navigation menu items, link customization (optional, 5+ fields)
11. **llm** — Model selection, temperature, token limits, timeout (8 fields)
12. **prompt** — System identity, tone, focus areas, brand mentions, custom instructions (5+ fields)
13. **search** — Query customization, max results, disabled search types (4+ fields)
14. **report** — Section ordering, CTA customization, quadrant distribution (10+ fields)
15. **email** — Email template customization, template URLs (8+ fields)
16. **analytics** — GA4, Segment, Mixpanel IDs (4 fields)
17. **seo** — Meta descriptions, OG tags, canonical URLs (6+ fields)

**Total Fields:** 120+ (all optional except core identity fields)

All fields are **validated at runtime** with:
- Type checking
- Format validation (hex colors, URLs, emails, regex patterns)
- Prompt injection blocklist
- Character validation

---

## Environment Variables - Audit & Admin Scoped

### Variable Reference Table

This table documents **ONLY audit and admin-scoped** environment variables. Onboarding-specific variables are listed separately in [Out-of-Scope](#out-of-scope-onboarding-only).

| Variable | Required | Module | Used By | Failure Mode | Where to Get | Retry-Safe |
|----------|----------|--------|---------|--------------|--------------|-----------|
| **NETLIFY_SITE_ID** | YES | Blobs | `audit-shared/storage.ts`, `audit-status.ts`, `audit-report.ts`, `admin-leads.ts`, `admin-leads-delete.ts`, `ares-lookup.ts` | "Netlify Blobs not configured" error; leads/reports not stored; admin dashboard fails | Netlify Site Settings > General > Site ID | YES |
| **NETLIFY_API_TOKEN** | YES | Blobs | `audit-shared/storage.ts`, `audit-status.ts`, `audit-report.ts`, `admin-leads.ts`, `admin-leads-delete.ts`, `ares-lookup.ts` | 401 Unauthorized to Blobs; leads/reports not accessible | Netlify User Settings > Applications > Personal Access Tokens (create new token with "blobs" scope) | NO |
| **RESEND_API_KEY** | YES | Email | `audit.ts`, `audit-background.ts` (lines 140, 130) | Email sending fails; leads don't receive reports; errors at status 'emailing' | Resend Dashboard > API Keys > Copy your key | NO |
| **TAVILY_API_KEY** | YES | Search | `audit.ts`, `audit-background.ts` (lines 141, 131) | Research agent cannot search; falls back to dummy data; audit report quality degrades | Tavily API Dashboard > API Key | NO |
| **OPENROUTER_API_KEY** | YES | LLM | `audit.ts`, `audit-background.ts` (lines 142, 132); `audit-services/langgraph/executor.ts` | LLM synthesis fails; report generation incomplete; job fails at 'generating' status | OpenRouter Dashboard > API Keys > Create Key | NO |
| **FIRECRAWL_API_KEY** | NO | Branding | `audit-background.ts` (line 133) | Company branding (logo, favicon, colors) unavailable; fallback to generic branding used | Firecrawl Dashboard > API Keys (optional, gracefully degrades) | NO |
| **ADMIN_PASSWORD** | YES | Auth | `onboarding-shared/auth.ts` (line 47) – used by admin API auth middleware | Admin endpoints return 401; `/admin/leads` dashboard inaccessible | Set to secure random string; store in Netlify Secrets | YES (stateless) |

### Variable Scope Summary

**Audit & Admin System (This Guide Covers):**
- `NETLIFY_SITE_ID` – Blobs storage
- `NETLIFY_API_TOKEN` – Blobs storage
- `RESEND_API_KEY` – Email sending
- `TAVILY_API_KEY` – Web search
- `OPENROUTER_API_KEY` – LLM synthesis
- `FIRECRAWL_API_KEY` – Optional branding fetch
- `ADMIN_PASSWORD` – Admin auth

**NOT Covered Here (Onboarding-Only):**
- `FROM_EMAIL`, `GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_DRIVE_API_KEY`, `GOOGLE_DRIVE_API_SECRET`, `PANDADOC_API_TOKEN`, `INTERNAL_API_SECRET`
- See [Out-of-Scope (Onboarding Only)](#out-of-scope-onboarding-only) for details

---

## Local Development Setup

### Step 1: Clone Repository & Install Dependencies

```bash
cd /path/to/hypedigitaly-web-2
cd astro-src
npm install
```

This installs all dependencies from `package.json`, including:
- `astro` (5.16.6)
- `@netlify/blobs` (8.1.0) – required for local Blob testing
- `@tavily/core` (0.5.0) – required for search agent
- `@langchain/*` – required for LLM integration
- `resend` – required for email testing

### Step 2: Create `.env.local` File

Create `astro-src/.env.local` (never commit this file) with all required variables:

```bash
# Netlify Blobs Storage
NETLIFY_SITE_ID=your-netlify-site-id-here
NETLIFY_API_TOKEN=your-netlify-api-token-here

# Email Service (Resend)
RESEND_API_KEY=re_your-resend-api-key-here

# Web Search (Tavily)
TAVILY_API_KEY=tvly_your-tavily-api-key-here

# LLM Synthesis (OpenRouter)
OPENROUTER_API_KEY=sk-or-your-openrouter-key-here

# Company Branding (Optional)
FIRECRAWL_API_KEY=fc_your-firecrawl-api-key-here

# Admin Authentication
ADMIN_PASSWORD=your-secure-random-password-here
```

**Permissions:**
- Add to `.gitignore` (already ignored if `.env.local` pattern is present)
- Store securely; never share in chat or version control

### Step 3: Start Local Development Server

**Option A: Astro Dev Server (Fast, No Functions)**
```bash
npm run dev
# Server runs at http://localhost:3000
# Static pages work; Netlify Functions unavailable
```

**Option B: Netlify Dev Server (Full Local Environment)**
```bash
netlify dev
# Server runs at http://localhost:8888
# Netlify Functions run locally via Functions Emulator
# Blobs storage uses local mock (not persistent)
```

**Recommended for Testing Audit Forms:**
```bash
cd astro-src
netlify dev --debug
```

This enables:
- Full Netlify Functions support
- Blobs emulation (temporary, session-scoped)
- Form submission to local handlers
- Email preview (Resend mock responses)

### Step 4: Verify Environment Variables Are Loaded

In browser console or log output, confirm:
```
[Blobs] Connected to site {NETLIFY_SITE_ID}
[Audit] API keys validated: RESEND, TAVILY, OPENROUTER
[Firecrawl] Optional branding fetch enabled
```

If not present, check:
1. `.env.local` file exists in `astro-src/` directory
2. All required keys are set (no empty values)
3. `netlify dev` is running with `--debug` flag
4. Restart `netlify dev` after `.env.local` changes

---

## Build Pipeline

### Build Steps

The build pipeline is defined in `netlify.toml` (production) and `astro-src/netlify.toml` (local dev).

**Production Build (`netlify.toml`):**

```bash
# Step 1: Prebuild - Generate sitemap metadata
npm run prebuild

# Step 2: Build - Compile Astro + TypeScript
npm run build

# Step 3: Output - Deploy dist/ directory
# Result: HTML, CSS, JS, and Netlify Functions
```

**Build Command:**
```
base = "astro-src"
command = "git fetch --unshallow 2>/dev/null || true && npm run build"
publish = "dist"
```

**Build Steps Breakdown:**

1. **Git History Fetch** (`git fetch --unshallow`)
   - Purpose: Fetch full commit history for accurate sitemap `lastmod` dates
   - Fallback: `2>/dev/null || true` suppresses errors if already unshallow
   - Location: `netlify.toml` line 4

2. **Prebuild Step** (`npm run prebuild`)
   - Script: `node scripts/generate-sitemap-data.js`
   - Purpose: Generate sitemap metadata from source files
   - Output: Used by sitemap generator during build

3. **Build Step** (`npm run build`)
   - Script: `astro build`
   - Transpiles: TypeScript → JavaScript
   - Compiles: `.astro` pages → HTML
   - Bundles: CSS, JS, assets
   - Output: `dist/` directory with static site + `.netlify/functions/` bundled

4. **Post-Build Optimization** (Netlify automatic)
   - Minify CSS, JS, HTML (enabled in `netlify.toml`)
   - Compress images (enabled)
   - Generate asset fingerprints for caching

### Build Verification

**Check Local Build:**
```bash
cd astro-src
npm run build
# Look for success message: "✓ build complete"
# Check dist/ exists: ls -la dist/
```

**Check Build Logs on Netlify:**
```bash
netlify logs --function audit
# Shows last 50 lines of build output
```

**Common Build Issues:**
- TypeScript errors → Fix in source; rebuild
- Missing .env variables → Set in Netlify UI; rebuild
- Duplicate function names → Check `netlify/functions/` for naming conflicts

---

## Production Deployment

### Prerequisites Before Deploy

1. **All Environment Variables Set**
   ```bash
   netlify env:list
   # Verify: NETLIFY_SITE_ID, NETLIFY_API_TOKEN, RESEND_API_KEY, etc.
   ```

2. **Local Build Success**
   ```bash
   cd astro-src
   npm run build
   # No errors, dist/ generated
   ```

3. **Git Branch Clean**
   ```bash
   git status
   # No uncommitted changes
   ```

### Deploy via Netlify CLI

**Automatic Deploy (Recommended):**
```bash
# Push to main branch triggers automatic Netlify build
git add .
git commit -m "Feature: audit system improvements"
git push origin main
# Netlify deploys within 1-2 minutes
# Check status: netlify status
```

**Manual Deploy:**
```bash
netlify deploy --prod
# Prompts: Select site, confirm build command, confirm publish directory
# Output: Unique deploy URL + timestamp
```

**Preview Deploy (Before Production):**
```bash
netlify deploy
# Creates preview URL without affecting production
# Share for review; merge to main when approved
```

### Post-Deploy Verification

**Check Deployment Status:**
```bash
netlify status
# Output: Current branch, last deploy time, production URL
```

**Test Audit Endpoints:**
```bash
# Test status polling
curl https://hypedigitaly.ai/api/audit-status?jobId=test-job-id

# Test report retrieval
curl https://hypedigitaly.ai/api/audit-report?reportId=test-report-id

# Test admin auth
curl -X GET https://hypedigitaly.ai/api/admin-leads \
  -H "Authorization: Bearer $ADMIN_PASSWORD"
```

**Monitor Netlify Functions:**
```bash
netlify logs --functions
# Streams logs from all functions in real-time
# Check for errors, timing, API responses
```

---

## Netlify Configuration Files

### Root `netlify.toml` (Production)

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\netlify.toml`

**Key Sections:**

#### 1. Build Configuration
```toml
[build]
  base = "astro-src"  # Build from this directory
  command = "git fetch --unshallow 2>/dev/null || true && npm run build"
  publish = "dist"    # Deploy dist/ directory
```
- **base:** Tells Netlify which directory contains `package.json`
- **command:** Runs before every deployment
- **publish:** Output directory to deploy (relative to `base`)

#### 2. Functions Configuration
```toml
[functions]
  directory = "netlify/functions"  # Location of all function handlers
  timeout = 60                     # Sync function timeout (seconds)
```
- **timeout:** Default 60 seconds; overridden per function via `schedule` or override directive
- Background functions use separate `[functions."name"]` blocks with `schedule` directive

#### 3. Node.js Version
```toml
[build.environment]
  NODE_VERSION = "18"              # Required for TypeScript, modern features
  GIT_LFS_SKIP_SMUDGE = "1"       # Skip Git LFS file downloads (speed improvement)
```

#### 4. Build Processing
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true                   # Combine CSS files
  minify = true                   # Remove unnecessary characters

[build.processing.js]
  bundle = true                   # Combine JavaScript
  minify = true                   # Remove unnecessary characters

[build.processing.html]
  pretty_urls = true              # Convert index.html to /

[build.processing.images]
  compress = true                 # Optimize image size
```

#### 5. Security Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"                           # Prevent iframe embedding
    X-XSS-Protection = "1; mode=block"                 # XSS attack prevention
    X-Content-Type-Options = "nosniff"                 # MIME-type sniffing prevention
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=()"    # Deny hardware access
```

#### 6. Caching Strategy
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"  # 1 year cache for hashed assets

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"  # Astro bundles with content hash

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"                      # Allow font usage from any domain
```

#### 7. Special URL Headers (iframe embedding)
```toml
[[headers]]
  for = "/hypelead-cenik-flyer.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"                         # Allow embedding within hypedigitaly.ai only

[[headers]]
  for = "/marketing-sluzby-flyer.html"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
```

#### 8. API Proxy Redirects
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```
- **Purpose:** Maps `/api/audit` → `/.netlify/functions/audit`
- **status = 200:** Transparent redirect (URL stays as `/api/audit`)
- **Applies to all functions:** Any file in `netlify/functions/` is accessible via `/api/{filename}`

#### 9. Scheduled Tasks (Cron)
```toml
[functions."onboarding-cleanup"]
  schedule = "@daily"             # Runs at midnight UTC every day
```
- **Purpose:** Triggers `netlify/functions/onboarding-cleanup.ts`
- **Frequency:** Once per day
- **Note:** Separate from audit functions; mentioned for reference

---

### Local Dev `astro-src/netlify.toml`

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/netlify.toml`

**Contents:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[dev]
  command = "npm run dev:local"
```

**Explanation:**
- **Stripped-down config** for local `netlify dev` command only
- Root `netlify.toml` used for production builds
- `[dev]` section specifies local dev command
- No security headers or caching headers needed locally

---

### Astro Configuration

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/astro.config.mjs`

**Key Settings:**
```javascript
export default defineConfig({
  adapter: netlify(),         // Use Netlify adapter (enables Functions)
  devToolbar: {
    enabled: false            // Disable Astro dev toolbar
  },
  build: {
    inlineStylesheets: 'always',  // Inline CSS for LCP optimization
    assets: '_astro'          // Asset directory
  },
  compressHTML: true,         // Minify HTML
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,     // Split CSS by page
      minify: 'esbuild',      // Fast minification
      rollupOptions: {
        output: {
          manualChunks: {
            'cookie-consent': ['./src/scripts/cookie-consent.ts']
          }
        }
      }
    }
  }
});
```

---

## Hardcoded URLs & Production Updates

### Report Base URL

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/netlify/functions/audit-shared/types.ts`
**Line:** 18
**Current Value:**
```typescript
export const REPORT_BASE_URL = "https://hypedigitaly.ai/report";
```

**Usage:** Appears in email templates; allows users to access stored reports via `/report/{reportId}`

**Production Update When Deploying to New Domain:**
1. Edit line 18 in `audit-shared/types.ts`
2. Change `"https://hypedigitaly.ai/report"` → `"https://new-domain.com/report"`
3. Rebuild and redeploy
4. All new email links will point to new domain

**Fallback Pattern:** If not updated, reports still accessible via old domain; migration not necessary immediately.

---

### Netlify Forms Submission URL

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/netlify/functions/audit-shared/lead-management.ts`
**Line:** 86
**Current Value:**
```typescript
const response = await fetch('https://hypedigitaly.ai/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formBody.toString()
});
```

**Usage:** Posts audit form to Netlify Forms endpoint for dashboard visibility

**Purpose:** Creates records in Netlify Forms → visible in Netlify UI → exportable as CSV

**Production Update When Deploying to New Domain:**
1. Edit line 86 in `lead-management.ts`
2. Change `'https://hypedigitaly.ai/'` → `'https://new-domain.com/'`
3. Redeploy
4. New leads will submit to new domain's Netlify Forms

**Fallback Pattern:** If not updated, submissions silently fail; leads still stored in Blobs via `storeLead()`, but Netlify Forms dashboard won't show them.

---

### CORS & Function Origins

**Where Checked:**
- `audit.ts` and `audit-background.ts` validate request origin headers
- Response headers set in function handlers:
  ```typescript
  headers: {
    'Access-Control-Allow-Origin': 'https://hypedigitaly.ai',
    'Access-Control-Allow-Methods': 'POST, GET, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }
  ```

**Production Update When Domain Changes:**
1. Search all function files for hardcoded domain:
   ```bash
   grep -r "hypedigitaly.ai" astro-src/netlify/functions/ --include="*.ts"
   ```
2. Replace in origin checks and CORS headers
3. Rebuild and redeploy

---

## Background Functions (15-Min Timeout)

### Naming Convention

Functions ending in `-background.ts` automatically receive 15-minute timeout for long-running processes.

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2/netlify.toml` lines 12-17

```toml
# Background function for audit processing (15-min timeout)
# The audit-background.ts function processes audits asynchronously:
# - Returns 202 Accepted immediately
# - Continues processing in background for up to 15 minutes
# - Frontend polls audit-status endpoint for progress updates
```

**Mechanism:**
1. **Frontend submits form** → `audit.ts` or `audit-background.ts`
2. **Sync handlers (audit.ts):** Returns immediately with report (≤60 seconds)
3. **Async handlers (audit-background.ts):** Returns 202 Accepted immediately; processing continues for up to 15 minutes
4. **Frontend polls** `/api/audit-status?jobId=...` every 1.5 seconds
5. **Background job continues** in Netlify environment until completion or timeout

**Why 15 Minutes?**
- Claude Sonnet research agent takes 8-12 minutes for high-quality audits
- Report generation, branding fetch, email sending: 2-3 minutes
- Total: 10-15 minutes required

**Function Timeout Config:**
```toml
[functions]
  directory = "netlify/functions"
  timeout = 60  # Default: sync functions timeout after 60 seconds
```

**Per-Function Override:**
Background functions don't need explicit override; naming convention `-background.ts` triggers Netlify's automatic 15-minute timeout.

To verify timeout is active:
```bash
# Check function context
curl -X OPTIONS https://hypedigitaly.ai/api/audit-status \
  -v 2>&1 | grep -i "x-function-timeout"
```

---

## Blob Store Configuration

### Blob Store Names & Purposes

**File:** `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/netlify/functions/audit-shared/types.ts` lines 13-15

```typescript
export const REPORTS_STORE = "audit-reports";      // HTML audit reports (30-day expiration)
export const LEADS_STORE = "audit-leads";          // Lead data (persistent)
export const JOBS_STORE = "audit-jobs";            // Job status tracking (30-day expiration)
```

### Store Initialization

Each store is accessed via getter function in `audit-shared/storage.ts`:

```typescript
export function getJobsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.');
  }

  return getStore({
    name: JOBS_STORE,
    siteID,
    token,
    consistency: "strong"  // Strong consistency: reads see all prior writes
  });
}
```

**Key Setting: `consistency: "strong"`**
- **Purpose:** Frontend polling for job status always sees latest update
- **Trade-off:** Slightly higher latency; ensures correct progress display

### Usage Patterns

**Job Status Tracking:**
```typescript
// Initialize job
await initializeJob(jobId, formData);

// Update progress during research
await updateJobStatus(jobId, 'researching', {
  progress: 30,
  currentSubStep: 'Analyzing industry trends',
  subStepMessage: 'Gathering competitive data...'
});

// Mark complete
await updateJobStatus(jobId, 'completed', {
  reportId: reportId,
  reportUrl: reportUrl
});
```

**Lead Storage:**
```typescript
// Store lead after successful audit
await storeLead({
  id: leadId,
  email: formData.email,
  companyName: formData.companyName,
  reportId: reportId,
  reportUrl: reportUrl,
  // ... other fields
});

// Also updates _leads_index for quick retrieval
```

**Report Retrieval:**
```typescript
// Fetch stored HTML report by ID
const report = await getAuditReportStore().get(reportId);
// Returns HTML string; served directly to browser
```

### Blob Storage Limits

**Per-Store Limits (Netlify Blobs):**
- Storage: 100 GB per site
- Object size: 200 MB per object (more than enough for HTML reports)
- Metadata: 5 KB per object

**Key Implications:**
- Thousands of leads can be stored without concern
- Old reports (30+ days) should be archived or deleted
- No indexing needed; use `_leads_index` pattern for rapid access

---

## Troubleshooting

### 1. Netlify Blobs Connection Error

**Error Message:**
```
[Blobs] Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.
```

**Cause:** Missing or empty environment variables in Netlify

**Solution:**
```bash
# Check current env vars
netlify env:list

# Get site ID
netlify status | grep "Site ID"

# Get API token
# 1. Visit https://app.netlify.com/user/applications/personal-access-tokens
# 2. Click "New access token"
# 3. Name: "Blobs API"
# 4. Copy token
# 5. Set: netlify env:set NETLIFY_API_TOKEN "your-token"

# Set both variables
netlify env:set NETLIFY_SITE_ID "your-site-id"
netlify env:set NETLIFY_API_TOKEN "your-api-token"

# Redeploy to apply
netlify deploy --prod
```

**Verify:**
```bash
# Local test
cd astro-src
npm run build
netlify dev --debug
# Check logs for "[Blobs] Connected to site {SITE_ID}"
```

---

### 2. Email Sending Fails (Resend 401)

**Error Message:**
```
[Email] Resend API returned 401: Unauthorized
```

**Cause:** Invalid or missing `RESEND_API_KEY`

**Solution:**
```bash
# Get new key
# 1. Visit https://resend.com/api-keys
# 2. Create new API key (or regenerate existing)
# 3. Copy key starting with "re_"
# 4. Update env var
netlify env:set RESEND_API_KEY "re_your-new-key-here"

# Redeploy
netlify deploy --prod

# Test send
curl -X POST https://hypedigitaly.ai/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "website": "https://example.com",
    "companyName": "Test Co",
    "city": "Prague",
    "biggestPainPoint": "AI implementation",
    "currentTools": "Excel",
    "language": "cs"
  }'
```

**Check API Key Format:**
- Must start with `re_`
- Must be exactly 32+ characters
- Can be tested on Resend dashboard

---

### 3. Web Search Fails (Tavily API Error)

**Error Message:**
```
[Research] Tavily API returned 429: Rate limit exceeded
[Research] Tavily API returned 400: Invalid API key
```

**Cause:**
- Rate limit exceeded (10 searches/minute free tier)
- Invalid or expired Tavily API key

**Solution:**
```bash
# Check rate limits
# 1. Visit https://app.tavily.com/home
# 2. Check "Recent Queries" and rate limit status

# Get/regenerate API key
# 1. Visit https://app.tavily.com/api_key
# 2. Copy key or create new one
# 3. Update env var
netlify env:set TAVILY_API_KEY "tvly_your-new-key-here"

# Redeploy and retry
netlify deploy --prod

# Wait 1 minute and resubmit form
```

**Rate Limit Recovery:**
- Free tier: 10 searches/minute
- If exceeded, wait 60 seconds before retry
- Check function logs for exact error:
  ```bash
  netlify logs --function audit-background | grep -i tavily
  ```

---

### 4. LLM Synthesis Fails (OpenRouter Error)

**Error Message:**
```
[LLM] OpenRouter API returned 401: Unauthorized
[LLM] OpenRouter returned 429: Rate limit exceeded
[LLM] OpenRouter returned 400: Invalid model name
```

**Cause:**
- Invalid OpenRouter API key
- Rate limit or quota exceeded
- Model name changed/deprecated

**Solution:**
```bash
# Get/regenerate API key
# 1. Visit https://openrouter.ai/keys
# 2. Create or copy existing key
# 3. Update env var
netlify env:set OPENROUTER_API_KEY "sk-or-your-new-key-here"

# Check current model in config
grep -r "claude-3-5-sonnet" astro-src/netlify/functions/audit-services/

# Update model if needed (in langgraph/config.ts)
# Current: claude-3-5-sonnet-20241022

# Redeploy
netlify deploy --prod
```

**Check Account Status:**
- Verify credits on https://openrouter.ai/account/billing/limits
- Ensure account is not suspended

---

### 5. Report Retrieval Returns 404

**Error Message:**
```
Report not found: reportId={reportId}
```

**Cause:**
- Report ID invalid or expired (30-day retention)
- Blobs store credentials misconfigured
- Network error during report storage

**Solution:**
```bash
# Check if report exists in Blobs
netlify blobs:list audit-reports

# If empty or missing:
# 1. Re-run audit to generate new report
# 2. Check audit-background logs for failures:
netlify logs --function audit-background | grep -i "report\|error"

# If report was stored but can't retrieve:
# 1. Verify NETLIFY_SITE_ID and NETLIFY_API_TOKEN
# 2. Check token has "blobs" scope
# 3. Redeploy with fresh credentials
netlify env:set NETLIFY_API_TOKEN "your-new-token"
netlify deploy --prod
```

---

### 6. Admin Dashboard Returns 401 (Auth Failed)

**Error Message:**
```
401 Unauthorized: Invalid admin password
```

**Cause:**
- Missing or incorrect `ADMIN_PASSWORD` header
- Header name mismatch (should be `X-Admin-Password`)

**Solution:**
```bash
# Check password is set
netlify env:list | grep ADMIN_PASSWORD

# Verify password strength
# Should be 32+ characters, random string
# Example: openssl rand -base64 32

# Set new secure password
netlify env:set ADMIN_PASSWORD "$(openssl rand -base64 32)"

# Redeploy
netlify deploy --prod

# Test dashboard access
curl -X GET https://hypedigitaly.ai/api/admin-leads \
  -H "Authorization: Bearer your-password-here"
```

**Check Function Code:**
Location: `C:\Users\Pavli\Desktop\HypeDigitaly\GIT\hypedigitaly-web-2\astro-src/netlify/functions/onboarding-shared/auth.ts` line 47
```typescript
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword || password !== adminPassword) {
  return { statusCode: 401, body: 'Invalid admin password' };
}
```

---

### 7. Job Status Polling Stuck (No Updates)

**Symptom:**
- Frontend shows progress at 0-30% indefinitely
- No completion after 15 minutes
- Job status endpoint returns same data repeatedly

**Cause:**
- Background function crashed silently
- Blobs write permissions revoked
- Job storage inconsistency (strong consistency enabled)

**Solution:**
```bash
# Check background function logs
netlify logs --function audit-background | tail -50

# Look for:
# - Stack traces
# - "Error updating job status"
# - "Blobs store error"

# If logs show no activity:
# 1. Background function may have crashed
# 2. Check Netlify deployment logs
netlify logs --functions | head -100

# Check job data directly
netlify blobs:list audit-jobs

# If job exists but not updating:
# 1. Verify NETLIFY_API_TOKEN hasn't expired
# 2. Recreate token with "blobs" scope
# 3. Update NETLIFY_API_TOKEN env var
# 4. Redeploy
```

**Manual Recovery:**
```bash
# Delete stuck job if necessary
netlify blobs:list audit-jobs
# Note jobId from list

# Cannot delete via CLI; use Blobs UI:
# 1. Visit Netlify dashboard > Site settings > Blobs
# 2. Select "audit-jobs" store
# 3. Find stuck jobId
# 4. Delete manually
# 5. Resubmit form to generate new jobId
```

---

### 8. CORS Headers Rejected (Fetch Blocked)

**Error Message:**
```
Access to XMLHttpRequest at 'https://hypedigitaly.ai/api/audit' from origin
'http://localhost:3000' has been blocked by CORS policy
```

**Cause:**
- Request origin not in CORS allowed list
- Headers not sent by server
- Incorrect domain in production

**Solution:**
```bash
# Check CORS headers in response
curl -X OPTIONS https://hypedigitaly.ai/api/audit \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v 2>&1 | grep -i "access-control"

# Should show:
# Access-Control-Allow-Origin: https://hypedigitaly.ai
# Access-Control-Allow-Methods: POST, GET, DELETE
# Access-Control-Allow-Headers: Content-Type, Authorization

# If missing:
# 1. Check netlify/functions/audit.ts for CORS headers
# 2. Verify origin matches deployed domain
# 3. Search for hardcoded domain: grep -r "hypedigitaly.ai" astro-src/
# 4. Update to new domain if needed
# 5. Redeploy
netlify deploy --prod
```

---

### 9. Function Timeout (15-min Exceeded)

**Error Message:**
```
[Background] Job {jobId} status: failed - Execution timeout exceeded
```

**Cause:**
- Research agent took too long (>15 minutes)
- Email sending blocked or extremely slow
- Network latency to search/LLM APIs

**Solution:**
```bash
# Check function logs for slowest step
netlify logs --function audit-background | grep "status:"

# Look for timestamps to identify bottleneck:
# [2026-03-19T10:00:00Z] researching (at 0:02)
# [2026-03-19T10:08:00Z] researching (at 8:15) <- slow
# [2026-03-19T10:15:00Z] TIMEOUT

# Optimize slowest step:
# 1. Tavily search too slow → increase query parallelism in langgraph/executor.ts
# 2. LLM synthesis slow → check OpenRouter response times on https://openrouter.ai/status
# 3. Email sending slow → check Resend API status on https://status.resend.com

# Increase function timeout (if Netlify tier allows):
# 1. Netlify Pro or higher: can request 30-min timeout
# 2. Contact support; provide justification
# 3. Update netlify.toml if approved
```

**Temporary Workaround:**
```bash
# Use sync audit handler instead of background
# edit audit.ts to return report immediately (no polling)
# Trade-off: user waits 15 minutes for response (poor UX)
# Not recommended for production
```

---

### 10. Duplicate Lead Entries in Blobs

**Symptom:**
- Same email appears multiple times in leads list
- Multiple reportIds for same company
- Race condition visible in admin dashboard

**Cause:**
- Form submitted multiple times due to network latency
- User re-submitted form before first job completed
- Double-click on submit button

**Solution:**
```bash
# Check for duplicates in leads store
netlify blobs:list audit-leads

# Identify duplicates by email:
# lead-{timestamp}-{random} (earliest = original)

# Delete duplicate entries via Netlify UI:
# 1. Visit Netlify dashboard > Site settings > Blobs
# 2. Select "audit-leads" store
# 3. Find entries with duplicate email
# 4. Delete duplicates (keep original, newest)

# Or implement deduplication in lead-management.ts:
# Check if lead with same email exists before storing
# Use _leads_index to search by email field

# Prevention: Add idempotency key to form
# 1. Generate unique ID for form submission
# 2. Include in audit request
# 3. Check if this idempotencyKey already processed
# 4. If yes, return existing reportId instead of reprocessing
```

---

### 11. Email Not Received by User

**Error Message:**
```
[Email] Email sent successfully to user@example.com (messageId={id})
```
**But:** User reports no email received

**Cause:**
- Email marked as spam/junk
- Email address invalid (typo in form)
- Resend authentication issue
- Rate limit on recipient's email server

**Solution:**
```bash
# Check email was actually sent
netlify logs --function audit-background | grep -i "email\|resend" | tail -20

# If logs show successful send but user didn't receive:
# 1. Check Resend dashboard > Messages
#    Should show delivery status (sent, delivered, bounced)
# 2. If bounced: email address was invalid
# 3. If delivered: check spam folder

# If logs show error:
# 1. Check error message for specific reason
# 2. Common: "Invalid email address"
#    → Validate email in form before sending
# 3. Check Resend API status: https://status.resend.com

# Resend email limits:
# - Free tier: 100 emails/day
# - Pro: Unlimited
# - Check usage: https://resend.com/usage

# If rate limited:
netlify env:get RESEND_API_KEY  # Verify it's Pro tier key
# Contact Resend support if hitting limits despite Pro tier
```

---

### 12. TypeScript Build Errors

**Error Message:**
```
error TS2304: Cannot find name 'AuditJob'
error TS4023: Exported variable 'REPORT_BASE_URL' has or is using name from external module
```

**Cause:**
- Missing type import in function file
- Circular import in audit-shared/
- TypeScript config too strict

**Solution:**
```bash
# Full type check before build
cd astro-src
npx tsc --noEmit

# Check for circular imports
grep -r "import.*from.*audit-shared" netlify/functions/ | sort | uniq -d

# Fix missing imports
# Example: audit.ts missing AuditJob type
# Add: import type { AuditJob } from './audit-shared/types';

# Rebuild
npm run build

# If still fails, check tsconfig.json
cat astro-src/tsconfig.json
# Should have: "extends": "astro/tsconfigs/strict"
```

---

### 13. Function Naming Conflicts

**Error Message:**
```
[Netlify] Duplicate function name detected: audit.ts and audit/index.ts
```

**Cause:**
- Two files generate the same function name
- Directory + file both export handler
- Inconsistent naming convention

**Solution:**
```bash
# List all functions
ls -la astro-src/netlify/functions/

# Check for conflicts
# Rule: file name = function name
# ✓ audit.ts → function "audit"
# ✓ audit/index.ts → function "audit"
# ✗ Can't have both

# Fix: Use one approach
# Option A: Keep audit.ts, delete audit/
# Option B: Keep audit/index.ts, delete audit.ts
# Recommended: Keep flat structure (Option A)

# Rebuild and redeploy
npm run build
netlify deploy --prod

# Verify function list
netlify functions:list
# Should show: audit, audit-background, audit-status, admin-leads, etc.
```

---

## Out-of-Scope (Onboarding Only)

The following environment variables are **required for onboarding client website generation** and are **NOT documented in this guide**. They are managed separately by the `/site-builder` skill and onboarding infrastructure.

### Onboarding-Specific Variables

| Variable | Used By | Scope |
|----------|---------|-------|
| `FROM_EMAIL` | Email service for onboarding notifications | Onboarding only |
| `GOOGLE_DRIVE_FOLDER_ID` | Store generated blueprints | Onboarding only |
| `GOOGLE_DRIVE_API_KEY` | Authenticate with Google Drive | Onboarding only |
| `GOOGLE_DRIVE_API_SECRET` | Secure Google Drive auth | Onboarding only |
| `PANDADOC_API_TOKEN` | Generate/sign contracts | Onboarding only |
| `INTERNAL_API_SECRET` | Authenticate inter-service calls | Onboarding only |

**Why Separated:**
- Audit/admin system is stateless; these are stateful
- Onboarding uses Google Drive for persistence; audit uses Netlify Blobs
- PandaDoc contracts are only needed for onboarding workflow
- Isolating allows independent deployment of audit vs. onboarding

**For Onboarding Setup:** See `HYPELEAD_ONBOARDING_PRD.md` Section 14 (Environment Configuration)

---

## Summary Checklist

### Local Development
- [ ] Node 18+ installed
- [ ] `.env.local` created with all 7 audit variables
- [ ] `netlify dev` runs without errors
- [ ] Test form submission works
- [ ] Email preview appears in logs
- [ ] Job status polls and completes

### Production Deployment
- [ ] All 7 env vars set in Netlify UI
- [ ] Local build passes: `npm run build`
- [ ] Git commit clean and on main
- [ ] `netlify deploy --prod` succeeds
- [ ] All URLs updated if domain changed (2 locations: types.ts, lead-management.ts)
- [ ] Post-deploy verification: audit endpoints return 200
- [ ] Admin dashboard accessible with password
- [ ] Email delivery confirmed (check Resend dashboard)

### Ongoing Maintenance
- [ ] Monitor function logs weekly: `netlify logs --functions`
- [ ] Check Blobs storage usage monthly: `netlify blobs:list`
- [ ] Archive old reports (>30 days)
- [ ] Renew API tokens before expiration
- [ ] Test admin password reset procedure
- [ ] Verify CORS headers on deployment changes

---

**End of Document**
