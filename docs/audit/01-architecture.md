# AI Audit & Admin Leads System - Architecture Overview

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Foundational Reference

This document establishes the technical architecture for the `/audit` page, background audit processing system, and `/admin/leads` dashboard. It defines shared vocabulary, file inventory, data models, and core patterns.

---

## Table of Contents

1. [Master File Inventory](#master-file-inventory)
2. [System Overview](#system-overview)
3. [Routing & Page Structure](#routing--page-structure)
4. [Dual Architecture Patterns](#dual-architecture-patterns)
5. [Data Flow Pipeline](#data-flow-pipeline)
6. [Data Models](#data-models)
7. [Core Patterns & Conventions](#core-patterns--conventions)
8. [Technology Stack](#technology-stack)

---

## Master File Inventory

### Pages & Components

| Path | Lines | Purpose |
|------|-------|---------|
| `src/pages/index.astro` | ~1,800 | Home page (formerly `/audit`) — Server-rendered audit form with language routing, SEO, hero section, form, process timeline, value props, pricing comparison |
| `src/pages/audit.astro` | ~50 | **Deprecated** — Now a 301 redirect to `/` for backward compatibility |
| `src/pages/admin/leads.astro` | ~2,100 | Admin dashboard for viewing leads from all sources (audit, contact, survey, pricing, onboarding) with filtering, sorting, bulk actions |
| `src/components/sections/AuditRoadmapAnimated.astro` | ~400 | Animated 4-step roadmap component used on home page |

### Netlify Functions - Audit System

#### Main Entry Points

| Path | Type | Purpose |
|------|------|---------|
| `netlify/functions/audit.ts` | Sync Handler | Synchronous audit handler (~440 lines). Form validation, AI field validation, agent execution, report generation, email sending. Returns 200 immediately. |
| `netlify/functions/audit-background.ts` | Background Handler | Async background function (~437 lines, 15-min timeout). Accepts form with jobId, returns 202 immediately, processes asynchronously. Includes validation, branding fetch, research, report generation, email. |

#### Status & Admin Functions

| Path | Type | Purpose |
|------|------|---------|
| `netlify/functions/audit-status.ts` | Sync GET | Polls job progress from Blobs. Returns 200 with `notFound: true` if job not found (strong consistency polling). Imports `AuditJob` type from `audit-background.ts` (known duplication from audit-shared/types.ts). |
| `netlify/functions/audit-validate.ts` | Sync POST | Pre-submission form validation endpoint. |
| `netlify/functions/audit-report.ts` | Sync GET | Retrieves stored HTML report from Blobs by reportId. Serves cached reports. |
| `netlify/functions/audit-templates.ts` | Sync GET | Returns email template data for testing/preview. |
| `netlify/functions/admin-leads.ts` | Sync GET | Fetches all leads (audit, contact, survey, pricing, onboarding). Password-protected. Returns aggregated lead list. |
| `netlify/functions/admin-leads-delete.ts` | Sync POST | Deletes individual lead by ID. Password-protected. Only handles audit, contact, survey, and pricing leads (onboarding leads are read-only). |

#### Related Lead Functions (Other Sources)

| Path | Type | Purpose |
|------|------|---------|
| `netlify/functions/contact.ts` | Sync POST | Contact form handler. Stores contact leads, sends emails. |
| `netlify/functions/survey.ts` | Sync POST | Survey form handler. Stores survey leads. |
| `netlify/functions/pricing-lead.ts` | Sync POST | Pricing page lead capture. Stores pricing leads. |
| `netlify/functions/ares-lookup.ts` | Sync POST | Czech ARES registry API lookup for company validation. |

### Shared Audit Utilities

| Path | Lines | Purpose |
|------|-------|---------|
| `netlify/functions/audit-shared/index.ts` | ~42 | Central re-export point for all shared audit utilities. |
| `netlify/functions/audit-shared/types.ts` | ~130 | Core type definitions: `AuditFormData`, `AuditJob`, `AuditLead`, `JobStatus`. Imports `ResearchStep` from langgraph-agent. |
| `netlify/functions/audit-shared/storage.ts` | ~175 | Blob store management: `getJobsStore()`, `getAuditReportStore()`, `getLeadsStore()`. Job initialization, status updates, progress callbacks with strong consistency. |
| `netlify/functions/audit-shared/validation.ts` | ~80 | Form field validation: `isValidLanguage()`, `validateRequiredFields()` with bilingual error messages. |
| `netlify/functions/audit-shared/lead-management.ts` | ~104 | Lead storage and tracking: `generateLeadId()`, `storeLead()`, `submitToNetlifyForms()`. Maintains `_leads_index` in Blobs. |

### AI Research Services

#### LangGraph Research Agent (Dual Architecture)

**Monolith File (Imports for Type Definitions):**
- `netlify/functions/audit-services/langgraph-agent.ts` (~2,465 lines)
  - Full end-to-end research implementation (legacy, not used directly for execution)
  - Imported by `audit-shared/types.ts` for `ResearchStep` type
  - Imported by `audit-shared/storage.ts` for progress callback typing
  - Contains full Tavily search logic, LLM prompt construction, JSON parsing

**Modular Directory (Imports for Execution):**
- `netlify/functions/audit-services/langgraph/` (~14 files, ~3,500 total lines)
  - **`index.ts`** (~69 lines): Central export point. Re-exports all functionality from modular files.
  - **`types.ts`** (~150 lines): Shared type definitions (AuditFormInputs, ResearchResult, ProgressCallback, SearchTask, TavilyClient, etc.)
  - **`config.ts`** (~200 lines): RESEARCH_STEPS mapping, MODEL_CONFIGS, utility functions (extractDomain, generateReportId)
  - **`tavily-search.ts`** (~350 lines): Tavily client creation and search execution with result formatting
  - **`query-generator.ts`** (~280 lines): Query set generation for different search types, industry keyword detection
  - **`prompt-generator.ts`** (~150 lines): Research synthesis prompts for OpenRouter
  - **`industry-recommendations.ts`** (~200 lines): Industry-specific tool and opportunity recommendations
  - **`llm-synthesizer.ts`** (~180 lines): Calls OpenRouter API to synthesize structured audit report from search results
  - **`pain-point-analyzer.ts`** (~120 lines): Analyzes user's biggest pain point against industry benchmarks
  - **`micro-niches.ts`** (~100 lines): Defines micro-niche categorization for B2B industries
  - **`niche-examples.ts`** (~150 lines): Example companies and use cases for micro-niches
  - **`value-proposition-templates.ts`** (~180 lines): Pre-written value proposition templates by industry
  - **`fallback-report.ts`** (~280 lines): Generates default report structure when agent fails (`generateAgentFallbackReport`)
  - **`executor.ts`** (~300 lines): Main entry point `executeDeepResearch()` with progress tracking, parallel search execution
  - Used by: `audit.ts` (sync) and `audit-background.ts` (async with jobId and progress callback)

**Import Resolution Pattern:**
```typescript
// audit.ts and audit-background.ts use modular version for execution:
import { executeDeepResearch, generateAgentFallbackReport } from "./audit-services/langgraph";

// audit-shared/types.ts uses monolith for type definitions:
import type { ResearchStep } from '../audit-services/langgraph-agent';

// TypeScript resolves 'from "../langgraph"' to directory index.ts for execution
// but imports 'from "../langgraph-agent"' for type-only imports
```

#### Other AI Services

| Path | Lines | Purpose |
|------|-------|---------|
| `netlify/functions/audit-services/ai-field-validator.ts` | ~120 | Validates form inputs using OpenRouter API before audit starts. Checks website validity, email format, company name plausibility. |
| `netlify/functions/audit-services/branding-fetcher.ts` | ~150 | Fetches company branding (logo, favicon, colors) from website using Firecrawl API (optional). Fallback-safe. |
| `netlify/functions/audit-services/jina-search.ts` | ~80 | Jina.ai reader API for extracting website content (unused in current flow, available for future use). |
| `netlify/functions/audit-services/openrouter-analysis.ts` | ~120 | Wrapper for OpenRouter API calls. Handles model selection, request formatting, error handling. |
| `netlify/functions/audit-services/json-parser-utils.ts` | ~200 | JSON parsing utilities: `extractAndParseJson()`, `validateAuditReportStructure()`, `fillAuditReportDefaults()`, truncation detection. |

#### Report Generation (Dual Architecture)

**Backwards Compatibility Shim:**
- `netlify/functions/audit-services/html-report-generator.ts` (~16 lines)
  - Simple re-export file pointing to modular html-report/
  - Used by legacy code or for clarity

**Modular Report System:**
- `netlify/functions/audit-services/html-report/` (~24 files, ~4,500 total lines)
  - **`index.ts`** (~70 lines): Public API exports (generateHTMLReport, types, utilities, section generators)
  - **`types.ts`** (~300 lines): Core data model interfaces (AuditQuestion, AIOpportunity, RecommendedTool, ROIEstimate, CompanyProfile, CompanyBranding, DetectedTechnology, AppIntegrationOpportunity, IndustryBenchmark, ImplementationTimeline, RiskAssessment, AuditReportData)
  - **`generator.ts`** (~150 lines): Main `generateHTMLReport()` function orchestrating section rendering
  - **`translations.ts`** (~200 lines): Bilingual translation strings for report sections
  - **`utils.ts`** (~250 lines): Helper functions (HTML escaping, color manipulation, label enhancement with tooltips)
  - **`styles.ts`** (~400 lines): Embedded CSS styles for HTML report (responsive design, animations, print-friendly)
  - **`scripts.ts`** (~150 lines): Embedded JavaScript for interactivity (tab switching, tooltip triggering)
  - **`sections/`** (18 generator files, ~3,000 total lines)
    - `header.ts`: Report title, company name, generation date
    - `company.ts`: Company profile section with logo/favicon
    - `intro.ts`: Executive summary intro text
    - `questions.ts`: Critical AI adoption questions
    - `summary.ts`: Executive summary of key findings
    - `opportunities.ts`: Main AI opportunities with quadrant matrix
    - `matrix.ts`: Effort vs. Impact visualization
    - `technologies.ts`: Detected technologies and AI-ready assessment
    - `app-integration.ts`: Recommended integrations with existing apps
    - `benchmark.ts`: Industry benchmarking data
    - `roi.ts`: ROI calculations and payback periods
    - `timeline.ts`: Implementation roadmap with phases
    - `risk.ts`: Risk assessment matrix and mitigation strategies
    - `tools.ts`: Recommended third-party AI tools
    - `cta.ts`: Call-to-action section
    - `footer.ts`: Footer with company info
    - `index.ts`: Section generator exports

#### Glossary (Dual Architecture - Type Definitions Only)

**Monolith File (Contains All Logic):**
- `netlify/functions/audit-services/glossary.ts` (~1,200 lines)
  - BENEFIT_TYPE_LABELS: Bilingual labels for all benefit types (time_savings, lead_generation, conversion_rate, etc.)
  - BUSINESS_TYPE_METRICS: Metrics, benchmarks, and recommendations by industry
  - detectBusinessType(): Identifies industry from form data
  - getBusinessTypeMetrics(): Returns industry-specific recommendations

**Modular Directory (Future Refactor, Unused):**
- `netlify/functions/audit-services/glossary/` (~8 files)
  - Not currently imported by any consumer
  - Exists as planned refactor for future modularization

#### Email Templates

| Path | Lines | Purpose |
|------|-------|---------|
| `netlify/functions/audit-templates.ts` | ~350 | Generates 4 email templates: audit notification (HTML+Text), audit confirmation with report link (HTML+Text). Bilingual strings. |
| `netlify/functions/email-templates.ts` | ~400 | Contact form email templates (notification + confirmation). Shared with contact.ts. |
| `netlify/functions/survey-templates.ts` | ~300 | Survey form email templates. |
| `netlify/functions/pricing-templates.ts` | ~280 | Pricing lead email templates. |

### Client-Side Scripts

| Path | Lines | Purpose |
|------|-------|---------|
| `src/scripts/translations/audit.ts` | ~400 | Audit page translation strings (Czech + English). Form labels, validation, success messages. Imported by audit.astro. |
| `src/scripts/utm-tracker.ts` | ~150 | Extracts and stores UTM parameters (utm_source, utm_medium, etc.) and click IDs (gclid, fbclid, msclkid) in sessionStorage for lead tracking. |
| `src/scripts/admin/onboarding-tab.ts` | ~200 | Manages admin dashboard tab switching and data display. |

### Configuration Files

| Path | Purpose |
|------|---------|
| `netlify.toml` (root) | Production Netlify configuration. Build command, function directory, headers, redirects, API proxy. 15-min timeout for background functions. |
| `astro-src/netlify.toml` | Local dev override for Netlify CLI. |
| `astro-src/public/_redirects` | URL rewrites: /report/* → audit-report function, language parameter redirects |
| `astro.config.mjs` | Astro 5.16 configuration with Netlify adapter |
| `tsconfig.json` | TypeScript strict mode configuration |
| `astro-src/package.json` | Dependencies: Astro 5.16, Tailwind 4.1, LangChain/LangGraph, Tavily, Resend, jsPDF |

---

## System Overview

### High-Level Architecture

The AI audit system is a **lead generation + background processing platform** that:

1. **Captures** business information through a web form (home page at `/`)
2. **Researches** company context using AI + web search (LangGraph + Tavily)
3. **Generates** customized HTML audit reports (structured data → interactive HTML)
4. **Delivers** reports via email + persistent storage (Netlify Blobs + Resend)
5. **Tracks** all leads in admin dashboard (/admin/leads)

### Entry Points

**For Users:**
- GET `/` → Home page with audit form + hero section
- GET `/audit` → **301 redirect** to `/` (backward compatibility)
- POST `/.netlify/functions/audit` → Sync handler (immediate response)
- POST `/.netlify/functions/audit-background` → Async handler (202 Accepted, background processing)
- GET `/.netlify/functions/audit-status?jobId=xxx` → Poll job progress
- GET `/report/{reportId}` → View stored HTML report

**For Admins:**
- GET `/admin/leads` → Dashboard with all leads (Audit + Contact + Survey + Pricing + Onboarding)
- GET `/.netlify/functions/admin-leads` → API endpoint (password-protected)
- DELETE `/.netlify/functions/admin-leads-delete?id=xxx` → Remove lead

### Dual Execution Paths

The system supports **two execution paths** to handle varying latency requirements:

```
Path A: Sync Handler (Fast, 60-second timeout)
  audit.ts → executeDeepResearch() → generateHTMLReport() → email → 200

Path B: Background Handler (Slow, 15-min timeout)
  audit-background.ts (returns 202 immediately)
    → initializeJob() → updateJobStatus('pending')
    → ... background processing up to 15 minutes ...
    → updateJobStatus('completed')
  Frontend polls audit-status every 1.5s to track progress
```

---

## Routing & Page Structure

### URL Structure (v2 Generalization)

The template uses a **white-label URL structure** with the audit form moved to the home page:

| Route | Status | Purpose | Files |
|-------|--------|---------|-------|
| `/` | **Live** | Home page with audit form, hero, roadmap, CTAs | `src/pages/index.astro` |
| `/audit` | **Deprecated (301)** | Redirect to `/` for backward compatibility | `src/pages/audit.astro` |
| `/report/{reportId}` | **Live** | View/print generated audit report | `netlify/functions/audit-report.ts` |
| `/admin/leads` | **Live** | Password-protected admin dashboard | `src/pages/admin/leads.astro` |
| `/privacy-policy` | **Live** | Privacy & GDPR compliance | `src/pages/privacy-policy.astro` |

### Configuration-Driven Navigation

All page content is now **configuration-driven** via `config.json`:

| Config Section | Used For | Files |
|---|---|---|
| `company.*` | Page headers, footers, legal info | Navigation, Footer, email templates |
| `domain.*` | Site URL, report URLs, CORS origin | Audit handlers, email links |
| `branding.*` | Logo, favicon, primary/accent colors | Global CSS tokens, components |
| `contact.*` | Company address, phone, email | Footer, contact forms |
| `team[]` | Team member info, calendar links | CTA sections, email signatures |
| `social.*` | LinkedIn, Instagram, Facebook, Google Reviews | Footer, social sharing |
| `notifications.*` | Recipient emails, sender email/name | Audit email handlers |
| `content.*` | Hero section copy, pricing tiers, CTAs | Home page sections (optional) |
| `auditForm.*` | Form field visibility, pain point options | Audit form configuration (optional) |
| `nav.*` | Navigation links, menu items | Top navbar (optional) |
| `llm.*` | Model selection, temperature, token limits | LLM agent configuration |
| `prompt.*` | System identity, tone, focus areas | Prompt generation |
| `search.*` | Query types, max queries | LangGraph search executor |
| `report.*` | Section ordering, CTA customization | Report generator |
| `email.*` | Email template customization | Email handlers |
| `analytics.*` | GA4, Segment, Mixpanel IDs | Analytics tracking |
| `seo.*` | Meta descriptions, OG tags | Meta tag generation |

---

## Dual Architecture Patterns

### Pattern 1: LangGraph Research Agent (Monolith vs. Modular)

**Problem:** The research agent grew to 2,465 lines. Needed to split for maintainability while keeping type definitions stable.

**Solution:** Two files serve different purposes:

**File A: `audit-services/langgraph-agent.ts` (Monolith)**
- Contains complete, historical research implementation
- **Used for:** Type imports only (`ResearchStep`)
- **Why:** audit-shared/ needs to reference ResearchStep for job status tracking
- **Import Pattern:**
  ```typescript
  import type { ResearchStep } from '../audit-services/langgraph-agent';
  ```

**File B: `audit-services/langgraph/index.ts` (Modular Directory)**
- 14 focused files, each with single responsibility
- **Used for:** Actual execution
- **Why:** audit.ts and audit-background.ts both import executeDeepResearch()
- **Import Pattern:**
  ```typescript
  import { executeDeepResearch, generateAgentFallbackReport } from "./audit-services/langgraph";
  ```

**TypeScript Resolution:**
- `.ts` file imports resolve to the file
- Directory imports resolve to `index.ts`
- No conflicts because monolith is type-only, modular is execution

### Pattern 2: HTML Report Generator (Shim vs. Modular)

**Problem:** Original html-report-generator.ts was a monolith. Refactored into 24 focused files in `/html-report/` directory.

**Solution:** Backwards compatibility shim maintains old import path:

**File A: `audit-services/html-report-generator.ts` (Shim)**
- Simple re-export wrapper (~16 lines)
- ```typescript
  export * from './html-report';
  export { generateHTMLReport } from './html-report';
  ```
- **Why:** Old code can keep using `from "./html-report-generator"`

**File B: `audit-services/html-report/index.ts` (Modular)**
- Actual implementation, 24 focused files
- **Why:** New code imports from here for clarity

**Both work:** `audit.ts` and `audit-background.ts` both import `generateHTMLReport` — they'll find it either way.

### Pattern 3: Glossary (Monolith Only, No Execution Refactor Yet)

**Status:** Monolith file exists; modular directory planned but not consumed.

**File A: `audit-services/glossary.ts` (Monolith, ~1,200 lines)**
- All consumers import from here
- Contains all industry metrics, benefit labels, business type detection

**File B: `audit-services/glossary/` (Directory, exists but unused)**
- Planned for future refactoring
- Not currently imported by any function
- No breaking changes needed to use it when ready

---

## Data Flow Pipeline

### 7-Hop Async Pipeline (Background Handler)

```
[1] User submits form
     ↓
[2] audit-background.ts receives POST (returns 202 immediately)
     │
     ├─→ initializeJob(jobId, formData) - creates job record in audit-jobs Blob store
     │   Status: 'pending' (0%)
     │
     ├─→ validateRequiredFields(formData) - basic validation
     │   Status: 'validating' (10%)
     │
     ├─→ fetchCompanyBranding(website, FIRECRAWL_API_KEY) - optional
     │   Status: 'researching' (28%, currentSubStep: 'fetch_branding')
     │
     ├─→ executeDeepResearch(agentInput, tavilyKey, openrouterKey, progressCallback)
     │   Status: 'researching' (30-55%, granular sub-steps)
     │   Sub-steps: search_company_info → search_news → search_website
     │             → search_technologies → search_apps → search_ai_tools
     │             → llm_analyzing → building_report
     │
[3] LangGraph Agent executes (5 tasks in parallel):
     │ Task A: Tavily search for company info (company_info, industry, size)
     │ Task B: Tavily search for company news (recent activity, projects)
     │ Task C: Tavily search website (service offerings, target market)
     │ Task D: Tavily search for technologies (tech stack detection)
     │ Task E: Tavily search for AI tools already in use
     │
     │ → Synthesize results via OpenRouter LLM
     │ → Extract structured data (AuditReportData)
     │
[4] generateHTMLReport(reportData)
     └─→ Generates complete interactive HTML (15KB-50KB)
         Status: 'generating' (60%), 'storing' (80%)

         └─→ Store in audit-reports Blob: key=reportId, value=htmlString
             Store metadata: key=reportId-meta, value=metadata JSON

[5] storeLead(leadData)
     └─→ Store in audit-leads Blob: key=lead-uuid, value=leadJSON
         Update _leads_index: unshift(leadId) - prepend to array

     └─→ submitToNetlifyForms(formData) - Netlify Forms dashboard record

[6] Send emails (Resend API)
     │
     ├─→ Team notification email (HTML + Text)
     │   To: notification recipients
     │   Subject: "Nový lead: AI Audit - {companyName}"
     │
     └─→ User confirmation email (HTML + Text)
         To: user's email
         Body: Includes link to /report/{reportId}

[7] updateJobStatus(jobId, 'completed', { reportId, reportUrl })
     └─→ Frontend polls audit-status, receives reportUrl
         Redirects user to report view
```

### Sync Pipeline (Fast Handler)

```
User submits form
    ↓
audit.ts validates + runs agent (no jobId tracking)
    │
    ├─→ validateFormWithAI() (optional)
    ├─→ executeDeepResearch() (no progress callback)
    ├─→ generateHTMLReport()
    ├─→ Store report in Blobs
    ├─→ storeLead()
    ├─→ Send emails (best effort, errors don't break flow)
    │
    └─→ Return 200 { success: true }
        (Report link sent via email only, not in response)
```

### Admin Aggregation (N+5 Query Pattern)

```
GET /api/admin-leads
    │
    ├─→ Get _leads_index from audit-leads Blob
    │   ↓
    ├─→ Get first N leads from audit-leads (map over indices)
    │
    ├─→ Get _leads_index from contact-leads Blob
    │   ↓
    ├─→ Get first N leads from contact-leads
    │
    ├─→ Get _leads_index from survey-leads Blob
    │   ↓
    ├─→ Get first N leads from survey-leads
    │
    ├─→ Get _leads_index from onboarding-leads Blob
    │   ↓
    ├─→ Get first N leads from onboarding-leads
    │
    ├─→ Get _leads_index from pricing-leads Blob
    │   ↓
    └─→ Get first N leads from pricing-leads

Result: Merged array of leads from all sources, sorted by submittedAt desc
```

---

## Data Models

### 1. AuditFormData (Input)

**Source:** Form submission from `/audit` page
**Storage:** Not persisted directly; incorporated into AuditLead after processing

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `email` | string | ✓ | User email (validated format) |
| `website` | string | ✓ | Company website URL (with/without http) |
| `companyName` | string | ✓ | Company name for display |
| `industry` | string | | Auto-detected by agent, stored empty in form |
| `city` | string | ✓ | City where company operates |
| `biggestPainPoint` | string | | User's description of main challenge |
| `currentTools` | string | | Tools/software currently in use |
| `language` | 'cs' \| 'en' | ✓ | User's language preference |
| `leadSource` | string | | Form source tracking (e.g., 'hero', 'audit-page') |
| `utmSource` | string | | UTM source parameter |
| `utmMedium` | string | | UTM medium parameter |
| `utmCampaign` | string | | UTM campaign parameter |
| `utmContent` | string | | UTM content parameter |
| `utmTerm` | string | | UTM term parameter |
| `gclid` | string | | Google Ads click ID |
| `fbclid` | string | | Facebook click ID |
| `msclkid` | string | | Microsoft click ID |
| `referrer` | string | | HTTP referrer header |

**Validation Rules:**
- Email: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Website: Valid URL (with auto-prefix https://)
- Required: email, website, companyName, city
- Language: Only 'cs' or 'en' accepted

### 2. AuditJob (Job Tracking in Background)

**Storage:** Netlify Blobs `audit-jobs` store
**Key:** `{jobId}` (UUID generated client-side)
**Used by:** audit-status endpoint for progress polling

| Field | Type | Purpose |
|-------|------|---------|
| `jobId` | string | Unique identifier (UUID) |
| `status` | JobStatus | Current job state (pending, validating, researching, generating, storing, emailing, completed, failed) |
| `progress` | number | 0-100 percentage |
| `statusMessage` | string | Localized human-readable message |
| `currentSubStep` | ResearchStep | Current research step (search_company_info, llm_analyzing, etc.) |
| `subStepMessage` | string | Sub-step specific message |
| `email` | string | User's email |
| `companyName` | string | Company name |
| `website` | string | Company website |
| `city` | string | Company city |
| `language` | 'cs' \| 'en' | User's language |
| `reportId` | string | Generated report ID (set on completion) |
| `reportUrl` | string | Full URL to report (set on completion) |
| `error` | string | Error message if failed |
| `validationErrors` | object | Field-level validation errors |
| `createdAt` | ISO 8601 | Job creation timestamp |
| `updatedAt` | ISO 8601 | Last update timestamp |
| `completedAt` | ISO 8601 | Completion timestamp (if completed/failed) |

**Status Progression:**
```
pending (0%) → validating (10%) → researching (30-55%)
  → generating (60%) → storing (80%) → emailing (90%) → completed (100%)

[At any point] → failed (keeps current progress)
```

**Progress Callback (v3 Enhancement):**
```typescript
createProgressCallback(jobId) returns async (step: ResearchStep, progress: number, message: string)
  → Called by agent during research
  → Updates job status with granular sub-step + progress
```

### 3. AuditLead (Persistent Lead Record)

**Storage:** Netlify Blobs `audit-leads` store
**Key:** `lead-{timestamp}-{random}` (generated server-side)
**Index:** `_leads_index` (array of lead IDs, most recent first)
**Persistence:** 30+ years (no expiration)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | string | Unique lead identifier |
| `email` | string | User's email |
| `companyName` | string | Company name |
| `website` | string | Company website |
| `city` | string | Company city |
| `biggestPainPoint` | string | User's stated challenge |
| `currentTools` | string | Tools already in use |
| `language` | 'cs' \| 'en' | Language preference |
| `reportId` | string | Associated report ID |
| `reportUrl` | string | Link to /report/{reportId} |
| `submittedAt` | ISO 8601 | When form was submitted |
| `detectedIndustry` | string | Industry detected by agent |
| `leadSource` | string | Form source (audit, contact, survey, pricing, onboarding) |
| `utmSource`, `utmMedium`, etc. | string | Traffic source tracking |
| `gclid`, `fbclid`, `msclkid` | string | Ad platform tracking |
| `referrer` | string | Page referrer |

**Query Pattern:**
```typescript
// Get all leads
const index = await store.get('_leads_index'); // [lead-123, lead-122, ...]
const leadsData = await Promise.all(
  JSON.parse(index).slice(0, 100).map(id => store.get(id))
);
```

### 4. AuditReportData (Research Output)

**Storage:** NOT persisted directly; embedded in HTML report blob
**Generation:** Produced by `executeDeepResearch()` → synthesized by LLM
**Location:** `netlify/functions/audit-services/html-report/types.ts`

**Core Sections:**

| Section | Type | Purpose |
|---------|------|---------|
| `reportId` | string | Unique report ID (uuid + date) |
| `generatedAt` | ISO 8601 | Report generation timestamp |
| `expiresAt` | ISO 8601 | Report expiration (30 days) |
| `companyProfile` | CompanyProfile | Company info (name, website, city, industry, size estimate) |
| `companyBranding` | CompanyBranding | Logo, favicon, colors (from Firecrawl) |
| `detectedTechnologies` | DetectedTechnology[] | Tech stack detected (WordPress, Shopify, custom code, etc.) |
| `questions` | AuditQuestion[] | Critical AI adoption questions (5-8 questions) |
| `opportunities` | AIOpportunity[] | Top 8-12 AI opportunities (with quadrant matrix position) |
| `expectedBenefits` | ExpectedBenefitsSummary | Aggregate benefits (time savings, lead generation, revenue, etc.) |
| `appIntegrations` | AppIntegrationOpportunity[] | Recommended integrations with existing tools |
| `roiEstimate` | ROIEstimate | Hours saved per week + hourly rate assumptions |
| `industryBenchmark` | IndustryBenchmark | How company stacks against industry peers |
| `timeline` | ImplementationTimeline | Implementation roadmap (Phase 1, 2, 3) |
| `risks` | RiskAssessment | Risks and mitigation strategies |
| `recommendedTools` | RecommendedTool[] | Third-party AI tools matched to opportunities |
| `language` | 'cs' \| 'en' | Report language |

**AIOpportunity Details:**

| Field | Type | Possible Values |
|-------|------|-----------------|
| `title` | string | "Automated Lead Follow-up" |
| `shortDescription` | string | "AI chatbot for initial contact" (max 15 words) |
| `description` | string | Detailed explanation |
| `quadrant` | string | 'quick_win' \| 'big_swing' \| 'nice_to_have' \| 'deprioritize' |
| `estimatedSavingsHoursPerWeek` | number | 5-40 |
| `implementationEffort` | string | 'low' \| 'medium' \| 'high' |
| `aiType` | string | 'automation' \| 'ml' \| 'genai' \| 'hybrid' |
| `expectedBenefits` | OpportunityBenefit[] | Array of benefits with specific metrics |

**BenefitType Enum (v6, 20+ types):**
```typescript
'time_savings' | 'lead_generation' | 'conversion_rate' | 'new_customers'
| 'revenue_increase' | 'cost_reduction' | 'error_reduction' | 'customer_satisfaction'
| 'response_time' | 'availability' | 'member_acquisition' | 'churn_reduction'
| 'member_engagement' | 'event_attendance' | 'products_sold'
| 'cart_abandonment_reduction' | 'student_acquisition' | 'course_completion'
```

---

## Core Patterns & Conventions

### Pattern 1: 202+Polling Async Pattern

**Used by:** Background handlers with long-running tasks
**Timeout:** 15 minutes for background functions (Netlify limit)
**Frontend Polling:** Every 1.5 seconds, max 300 polls (300 × 1.5s = 450s = ~7.5 minutes user timeout)

**Implementation:**

```typescript
// audit-background.ts returns 202 automatically for background functions
// Frontend stores jobId in sessionStorage:

const jobId = generateUUID();
const response = await fetch('/api/audit-background', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jobId, formData })
});
// Returns 202 Accepted immediately

// Client-side polling loop:
let attempts = 0;
const maxAttempts = 300;
const interval = setInterval(async () => {
  attempts++;
  const status = await fetch(`/api/audit-status?jobId=${jobId}`).then(r => r.json());

  if (status.notFound && attempts < 10) {
    // Job not initialized yet, retry
    return;
  }

  if (status.status === 'completed') {
    clearInterval(interval);
    window.location.href = status.reportUrl;
  } else if (status.status === 'failed') {
    clearInterval(interval);
    showError(status.error);
  } else if (attempts >= maxAttempts) {
    clearInterval(interval);
    showTimeout();
  }
}, 1500);
```

**Strong Consistency Guarantee:**
- All store operations use `consistency: "strong"`
- Polling response is always up-to-date (no stale reads)
- `notFound` status returns 200, not 404 (allows retry logic)

### Pattern 2: Blob Index Management (Unshift Pattern)

**Used by:** Lead storage, job tracking
**Pattern:** Maintain index array `_leads_index` for efficient pagination

```typescript
// storeLead() updates index
let leadsIndex = [];
try {
  const existingIndex = await store.get('_leads_index');
  if (existingIndex) {
    leadsIndex = JSON.parse(existingIndex);
  }
} catch {
  // Index doesn't exist yet
}

leadsIndex.unshift(lead.id); // Add new lead at beginning (O(n) but n < 10k)
await store.set('_leads_index', JSON.stringify(leadsIndex));

// admin-leads.ts retrieves paginated leads
const index = JSON.parse(await store.get('_leads_index'));
const leadIds = index.slice(0, 100); // First 100
const leads = await Promise.all(leadIds.map(id => store.get(id).then(JSON.parse)));
```

**Race Condition Warning:**
- Multiple concurrent submissions could lose one index update
- Acceptable risk at current scale (<10 submissions/min)
- Future: Use atomic compare-and-swap or distributed lock

### Pattern 3: Fallback-Everything Architecture

**Philosophy:** No single point of failure
**Principle:** Continue processing even if optional services fail

**Cascading Fallbacks:**

```typescript
// 1. Optional AI field validation
try {
  const validationResult = await validateFormWithAI(...);
  if (!validationResult.isValid) {
    return error; // Only mandatory stage that blocks
  }
} catch (validationError) {
  console.error('Validation error (continuing):', validationError);
  // Don't block - user submitted valid form anyway
}

// 2. Optional company branding fetch
if (FIRECRAWL_API_KEY) {
  try {
    companyBranding = await fetchCompanyBranding(...);
  } catch (brandingError) {
    console.error('Branding fetch failed (continuing):', brandingError);
    // Report will just have no logo
  }
} else {
  console.warn('FIRECRAWL_API_KEY not configured - skipping branding');
}

// 3. LangGraph agent fallback
try {
  const agentResult = await executeDeepResearch(...);
  if (agentResult.success) {
    reportData = agentResult.reportData;
  } else {
    reportData = generateAgentFallbackReport(agentInput);
  }
} catch (agentError) {
  reportData = generateAgentFallbackReport(agentInput);
}

// 4. Blob storage - continue even if fails
try {
  await store.set(reportData.reportId, reportHtml, { metadata });
} catch (blobError) {
  console.error('Blob storage failed (continuing):', blobError);
  // Emails still sent, user can request manual report
}

// 5. Email delivery - continue even if one fails
try {
  // Send notification email
} catch (notifError) {
  console.error('Notification email failed (continuing):', notifError);
  // User gets confirmation email anyway
}

try {
  // Send confirmation email
} catch (confError) {
  console.error('Confirmation email failed (continuing):', confError);
  // Job still marked complete
}
```

### Pattern 4: Lead ID Prefix Dispatch

**Used by:** admin-leads.ts to aggregate leads from multiple sources
**Convention:** Lead ID prefix indicates source (except onboarding which uses raw UUIDs)

| Prefix | Source | Example | Notes |
|--------|--------|---------|-------|
| `lead-` | Audit | `lead-1a2b3c-xyz` | Generated with timestamp prefix |
| `contact-` | Contact form | `contact-1a2b3c-xyz` | Generated with timestamp prefix |
| `survey-` | Survey | `survey-1a2b3c-xyz` | Generated with timestamp prefix |
| `pricing-` | Pricing page | `pricing-1a2b3c-xyz` | Generated with timestamp prefix |
| (UUID) | Onboarding | `a1b2c3d4-e5f6...` | Pure UUID, no prefix (read-only in admin) |

**Dispatch Logic:**
```typescript
function getLeadSource(leadId: string): string {
  if (leadId.startsWith('lead-')) return 'audit';
  if (leadId.startsWith('contact-')) return 'contact';
  if (leadId.startsWith('survey-')) return 'survey';
  if (leadId.startsWith('pricing-')) return 'pricing';
  // Onboarding leads are pure UUIDs with no prefix (cannot be deleted via admin-leads-delete)
  return 'unknown';
}

function getLeadStore(source: string) {
  switch (source) {
    case 'audit': return getLeadsStore('audit-leads');
    case 'contact': return getLeadsStore('contact-leads');
    case 'survey': return getLeadsStore('survey-leads');
    case 'pricing': return getLeadsStore('pricing-leads');
    case 'onboarding': return getLeadsStore('onboarding-leads');
  }
}
```

### Pattern 5: Background Function Naming Convention

**Convention:** `*-background.ts` = Netlify Background Function
**Characteristics:**
- 15-minute execution timeout (vs. 60-second for sync)
- Returns 202 Accepted immediately
- Processing continues asynchronously
- No response body (202 + empty body)
- Uses Blobs for state persistence (strong consistency required)

**Files:**
- `audit-background.ts` — Primary background handler
- Others available: contact-background, survey-background, etc. (not currently used)

### Pattern 6: Strong Consistency Requirement

**Applied to:** All Blobs stores used by polling
**Why:** Frontend must see immediate updates when checking status

```typescript
// All job/report stores use consistency: "strong"
const store = getStore({
  name: JOBS_STORE,
  siteID,
  token,
  consistency: "strong"  // ← Critical for polling
});
```

**Weak Consistency Would Fail:**
```typescript
// ❌ DON'T USE
consistency: "eventual" // Could return stale data to poll requests
```

### Pattern 7: Language Flow (URL → Cookie → Default)

**Applied to:** All user-facing pages
**Priority Chain:**
1. URL parameter: `?lang=en` or `?lang=cs` (highest priority)
2. Cookie: `preferredLanguage` (if set from previous visit)
3. Default: `'cs'` (Czech as default for Czech business)

**Implementation (audit.astro):**
```typescript
const url = Astro.url;
const langParam = url.searchParams.get('lang');

// Redirect clean URL if ?lang=cs (default)
if (langParam === 'cs') {
  return Astro.redirect(cleanUrl); // Remove param
}

const cookieLang = Astro.cookies.get('preferredLanguage')?.value;
const lang = (langParam === 'en' || langParam === 'cs') ? langParam :
             (cookieLang === 'en' || cookieLang === 'cs') ? cookieLang : 'cs';

// Set cookie if explicitly selected
if (langParam && ['en', 'cs'].includes(langParam)) {
  Astro.cookies.set('preferredLanguage', langParam, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365 // 1 year
  });
}
```

### Pattern 8: Cross-Domain Dependency (Admin Auth)

**Used by:** admin-leads.ts and admin-leads-delete.ts
**Location:** Auth logic in different module

```typescript
// admin-leads.ts imports from onboarding module (cross-domain)
import { verifyAdminAuth } from "./onboarding-shared/auth";

const handler: Handler = async (event, context) => {
  const password = event.headers.authorization?.replace('Bearer ', '');
  if (!verifyAdminAuth(password)) {
    return { statusCode: 401, body: 'Unauthorized' };
  }
  // ... continue with lead retrieval
};
```

**Rationale:**
- Authentication logic shared across multiple lead sources
- Located in onboarding-shared/ for reuse
- Acceptable coupling: both are admin functions

### Pattern 9: Email Fallibility (Best-Effort Delivery)

**Philosophy:** Email failure should never block report delivery

```typescript
try {
  const confirmationResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { /* ... */ },
    body: JSON.stringify({ /* ... */ })
  });

  if (!confirmationResponse.ok) {
    const errorData = await confirmationResponse.json().catch(() => ({}));
    console.error("[Audit] Confirmation email failed:", errorData);
    // DON'T THROW - continue to completion
  } else {
    console.log("[Audit] Confirmation email sent");
  }
} catch (confError) {
  console.error("[Audit] Confirmation email exception:", confError);
  // DON'T THROW - report is still complete in Blobs
}
```

---

## Technology Stack

### Runtime & Build

| Component | Version | Purpose |
|-----------|---------|---------|
| **Astro** | 5.16.6 | Framework for pages and SSR |
| **Node.js** | 18 (Netlify) | Runtime for functions and build |
| **TypeScript** | Latest (strict) | Type safety for all functions |

### Frontend Frameworks & Styling

| Component | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.1.18 | Utility-first styling |
| **astro-icon** | 1.1.5 | Icon component system |
| **Iconify JSON** | Multiple | Icon packs (MDI, Solar, Simple Icons, Logos) |

### AI & LLM

| Component | Version | Purpose |
|-----------|---------|---------|
| **@langchain/core** | 0.3.0 | LLM orchestration framework |
| **@langchain/langgraph** | 0.2.0 | Agentic workflows (research agent) |
| **@langchain/openai** | 0.3.0 | OpenAI model integration |
| **@tavily/core** | 0.5.0 | Web search API client |

### Data & Storage

| Component | Version | Purpose |
|-----------|---------|---------|
| **@netlify/blobs** | 8.1.0 | Persistent serverless storage (reports, leads, jobs) |
| **Resend** | Latest | Email delivery API (no version pinned) |

### PDF & Report Generation

| Component | Version | Purpose |
|-----------|---------|---------|
| **jsPDF** | 2.5.1 | PDF generation (used in report footer) |
| **jsPDF-AutoTable** | 3.8.2 | PDF table formatting |

### Validation & Parsing

| Component | Version | Purpose |
|-----------|---------|---------|
| **zod** | 3.23.0 | Schema validation and type inference |

### Netlify

| Component | Version | Purpose |
|-----------|---------|---------|
| **@astrojs/netlify** | 6.6.3 | Netlify adapter for Astro (SSR + Functions) |

### Build & Development

**Local Development:**
```bash
npm run dev                 # Astro dev server + Netlify CLI
npm run build              # npm run prebuild && astro build
npm run prebuild           # Generate sitemap data (git history for lastmod)
```

**Environment Variables Required:**
```
RESEND_API_KEY            # Email sending
TAVILY_API_KEY            # Web search
OPENROUTER_API_KEY        # LLM synthesis
FIRECRAWL_API_KEY         # Branding extraction (optional)
NETLIFY_SITE_ID           # Blobs store access
NETLIFY_API_TOKEN         # Blobs store access
```

---

## Key Files Reference

**Core Entry Points:**
- `/src/pages/audit.astro` — User-facing audit page
- `/src/pages/admin/leads.astro` — Admin dashboard
- `netlify/functions/audit.ts` — Sync handler
- `netlify/functions/audit-background.ts` — Async handler (15-min)
- `netlify/functions/audit-status.ts` — Progress polling
- `netlify/functions/audit-report.ts` — Report retrieval

**Type Definitions:**
- `netlify/functions/audit-shared/types.ts` — Core types (AuditFormData, AuditJob, AuditLead)
- `netlify/functions/audit-services/html-report/types.ts` — Report types (AuditReportData)
- `netlify/functions/audit-services/langgraph/types.ts` — Agent types

**Shared Utilities:**
- `netlify/functions/audit-shared/` — Validation, storage, lead management
- `netlify/functions/audit-services/glossary.ts` — Industry metrics and benefit labels

**AI Research:**
- `netlify/functions/audit-services/langgraph/executor.ts` — Main research entry point
- `netlify/functions/audit-services/langgraph/` — Modular agent components

**Report Generation:**
- `netlify/functions/audit-services/html-report/generator.ts` — Main report generator
- `netlify/functions/audit-services/html-report/sections/` — Report section components

**Configuration:**
- `netlify.toml` (root) — Deployment, function config, redirects
- `astro.config.mjs` — Astro + Netlify adapter config
- `public/_redirects` — URL rewrite rules

---

## Document Purpose

This document serves as the **foundational reference** for all subsequent audit & admin system documentation. It establishes:

1. **Shared Vocabulary:** AuditJob, AuditLead, ResearchStep, Blob stores
2. **File Inventory:** Complete list of all system files with line counts and purposes
3. **Architectural Patterns:** 9+ core patterns used throughout the system
4. **Data Models:** Interfaces with field descriptions and constraints
5. **Technology Stack:** Exact versions and dependencies

**Subsequent Documents Should:**
- Reference file paths relative to `astro-src/`
- Use terminology defined in this document
- Link to specific lines in Master File Inventory
- Follow patterns documented in Core Patterns & Conventions section

---

*Last updated: 2026-03-19 | Maintained by: Documentation Engineer*
