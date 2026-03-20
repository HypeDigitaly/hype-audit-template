# Complete Replication Guide: AI Audit & Admin Leads System

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Comprehensive Rebuild Reference
**Target Audience:** Developers rebuilding the entire system from scratch

---

## Overview

This document provides a **step-by-step replication guide** for rebuilding the entire home page (audit form), background audit processing system, and `/admin/leads` CRM dashboard from a blank Astro 5.16 project. It covers infrastructure setup, code implementation, testing, and deployment with cross-references to all 12 domain documentation files.

**Key Changes in v2:**
- Home page (`/`) now contains the audit form (moved from `/audit`)
- `/audit` is now a 301 redirect for backward compatibility
- All configuration is **white-label** (no HypeDigitaly branding)
- All copy, colors, and branding are **configuration-driven** via config.json
- New config schema with 120+ fields across 10+ sections

**Time to Complete:** 16-24 hours (depending on familiarity with Astro, Netlify, and TypeScript)

**Prerequisites Knowledge:** Intermediate TypeScript, Node.js, Netlify Functions, REST APIs

---

## Prerequisites Checklist

Before starting, ensure you have all required tools, accounts, and API keys.

### Tools & Software

- [ ] **Node.js 18+** — Verify: `node --version` → `v18.x.x` or higher
- [ ] **npm 10+** — Verify: `npm --version` → `v10.x.x` or higher
- [ ] **Netlify CLI 15.0+** — Install: `npm install -g netlify-cli` → Verify: `netlify --version`
- [ ] **Git 2.30+** — Verify: `git --version` → `v2.30` or higher
- [ ] **Code Editor** — VS Code recommended with TypeScript and Astro extensions
- [ ] **GitHub Account** — For repository creation and CI/CD (optional but recommended)

### Required Accounts & Access

- [ ] **Netlify Account** — Create at [netlify.com](https://netlify.com) (free tier sufficient for testing)
- [ ] **Resend Account** — Create at [resend.com](https://resend.com) (email service)
- [ ] **Tavily Account** — Create at [tavily.com](https://tavily.com) (web search API)
- [ ] **OpenRouter Account** — Create at [openrouter.ai](https://openrouter.ai) (LLM API)
- [ ] **Firecrawl Account (Optional)** — Create at [firecrawl.dev](https://firecrawl.dev) (branding extraction)

### API Keys to Obtain

| Service | Key Name | Where to Get | Used For |
|---------|----------|--------------|----------|
| **Netlify** | `NETLIFY_SITE_ID` | Site Settings → General | Blobs storage |
| **Netlify** | `NETLIFY_API_TOKEN` | User Settings → Personal Access Tokens | Blobs access |
| **Resend** | `RESEND_API_KEY` | Dashboard → API Keys | Email delivery |
| **Tavily** | `TAVILY_API_KEY` | Dashboard → API Keys | Web search |
| **OpenRouter** | `OPENROUTER_API_KEY` | Dashboard → API Keys | LLM synthesis |
| **Firecrawl** | `FIRECRAWL_API_KEY` | Dashboard → API Keys (optional) | Branding extraction |

**Security:** Store all keys securely. Use `.env.local` in development; set in Netlify UI for production.

---

## Step 1: Create Astro 5.16 Project with Dependencies

### 1.1 Create Base Project

```bash
# Create new Astro project (no template)
npm create astro@latest my-audit-system -- --template minimal

cd my-audit-system
```

### 1.2 Install Core Dependencies

```bash
npm install astro@5.16.6 \
  @astrojs/netlify@6.6.3 \
  typescript@latest \
  tailwindcss@4.1.18 \
  autoprefixer \
  postcss
```

### 1.3 Install Netlify & Data Storage

```bash
npm install @netlify/blobs@8.1.0
```

### 1.4 Install AI & LLM Dependencies

```bash
npm install @langchain/core@0.3.0 \
  @langchain/langgraph@0.2.0 \
  @langchain/openai@0.3.0 \
  @tavily/core@0.5.0 \
  zod@3.23.0
```

### 1.5 Install Email & PDF Dependencies

```bash
npm install resend@latest \
  jspdf@2.5.1 \
  jspdf-autotable@3.8.2
```

### 1.6 Install UI & Icons

```bash
npm install astro-icon@1.1.5
```

### 1.7 Verify Installation

```bash
npm list astro @astrojs/netlify tailwindcss @netlify/blobs
# All should show correct versions
```

---

## Step 2: Configure Astro & Netlify Adapter

### 2.1 Update `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  adapter: netlify({
    edgeMiddleware: false,
  }),
  output: 'server',
  vite: {
    ssr: {
      external: ['@netlify/blobs'],
    },
  },
});
```

### 2.2 Update `tsconfig.json` (Strict Mode)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.3 Create `astro-src/netlify.toml` (Local Dev Override)

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"

[dev]
  command = "netlify dev"
```

---

## Step 3: Create Netlify Blob Stores (10 Stores)

This is **critical**. All blob stores use **strong consistency**.

### 3.1 Blob Store Inventory

Create all 10 stores in Netlify UI or via CLI. Each store must have `consistency: "strong"` enabled.

| # | Store Name | Purpose | Key Pattern | Consistency |
|---|------------|---------|------------|-------------|
| 1 | `audit-reports` | Audit report HTML + metadata | `{reportId}`, `{reportId}-meta` | strong |
| 2 | `audit-leads` | Audit form submissions | `lead-*`, `_leads_index` | strong |
| 3 | `audit-jobs` | Background job tracking | `{jobId}` | strong |
| 4 | `contact-leads` | Contact form submissions | `contact-*`, `_leads_index` | strong |
| 5 | `survey-leads` | Survey form responses | `survey-*`, `_leads_index` | strong |
| 6 | `onboarding-leads` | Onboarding applications | `onboarding-*`, `_leads_index` | strong |
| 7 | `pricing-leads` | Pricing calculator submissions | `pricing-*`, `_leads_index` | strong |
| 8 | `survey-ratelimit` | Survey rate limit tracking | `ratelimit-*` | strong |
| 9 | `pricing-ratelimit` | Pricing rate limit tracking | `rate-*` | strong |
| 10 | `ares-cache` | ARES registry cache (onboarding only) | `{ico}` | strong |

**Critical Gotcha #1:** Do NOT create a phantom `rate-limits` store. Survey uses `survey-ratelimit`, pricing uses `pricing-ratelimit`.

### 3.2 Create Stores via Netlify CLI (Optional)

```bash
# If Netlify UI doesn't have Blobs, use CLI:
netlify blobs:create audit-reports --siteId YOUR_SITE_ID
netlify blobs:create audit-leads --siteId YOUR_SITE_ID
# ... repeat for all 10 stores
```

---

## Step 4: Implement `/audit` Page Frontend

**Reference:** `02-audit-page-frontend.md`

### 4.1 Create Page File

**File:** `src/pages/audit.astro` (~1,800 lines)

Start with basic structure:

```astro
---
import Layout from '@/layouts/PageLayout.astro';
import AuditRoadmapAnimated from '@/components/sections/AuditRoadmapAnimated.astro';
import { translations } from '@/scripts/translations/audit';

// Language detection
const url = Astro.url;
const langParam = url.searchParams.get('lang');
const lang = (langParam === 'en' || langParam === 'cs') ? langParam : 'cs';
const t = translations[lang];

// Set cookie if explicit language selected
if (langParam && ['en', 'cs'].includes(langParam)) {
  Astro.cookies.set('preferredLanguage', langParam, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });
}
---

<Layout lang={lang} title={t.audit_meta_title}>
  <!-- Hero Section -->
  <section class="py-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-5xl font-bold mb-4">{t.audit_hero_title}</h1>
      <p class="text-xl text-gray-600 mb-8">{t.audit_hero_desc}</p>

      <!-- Form goes here -->
      <form id="audit-form" class="max-w-2xl mx-auto space-y-6">
        <!-- See 02-audit-page-frontend.md for complete form HTML -->
      </form>
    </div>
  </section>

  <!-- Roadmap -->
  <AuditRoadmapAnimated lang={lang} t={t} />

  <!-- JSON-LD Schema -->
  <script type:html" set:html={generateSchema(lang, t)} />
</Layout>
```

### 4.2 Implement Form Validation & Submission

Key logic from `02-audit-page-frontend.md` sections "Form Data Model" and "JavaScript Form Flow":

- 6 visible fields: `email`, `website`, `companyName`, `city`, `biggestPainPoint`, `currentTools`
- 4 hidden fields: `jobId` (UUID), `language`, `leadSource`, traffic source fields
- Pain point options: 10 checkboxes + "Other" text
- Tools options: 6 checkboxes + "Other" text
- Client-side validation before submit
- POST to `/.netlify/functions/audit-background` (202) or fallback to `/.netlify/functions/audit` (200)
- Polling on `/.netlify/functions/audit-status?jobId={jobId}` every 1.5s for up to 5 minutes

### 4.3 Implement Polling State Machine

8-step progress indicator with status flow:

```
pending (0%) → validating (10%) → researching (30-50%)
  → generating (50-80%) → storing (80-95%)
  → emailing (95-100%) → completed (100%) → SUCCESS
```

See "Polling State Machine" in `02-audit-page-frontend.md` for UI mapping.

### 4.4 Create AuditRoadmapAnimated Component

**File:** `src/components/sections/AuditRoadmapAnimated.astro` (~400 lines)

Features:
- 4-milestone animated SVG road (desktop only)
- Scroll-triggered animations
- Elastic bounce on milestone cards
- Mobile-responsive vertical layout
- Timeline summary at bottom

---

## Step 5: Implement Backend Functions

**Reference:** `04-backend-functions.md`

### 5.1 Create Shared Audit Utilities

**Directory:** `netlify/functions/audit-shared/`

#### `types.ts` (~130 lines)

```typescript
export interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
  jobId?: string;
  leadSource?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}

export interface AuditJob {
  jobId: string;
  status: 'pending' | 'validating' | 'researching' | 'generating' | 'storing' | 'emailing' | 'completed' | 'failed';
  progress: number;
  statusMessage: string;
  currentSubStep?: string;
  subStepMessage?: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  language: 'cs' | 'en';
  reportId?: string;
  reportUrl?: string;
  error?: string;
  validationErrors?: Record<string, { isValid: boolean; errorMessage: string }>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AuditLead {
  id: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
  reportId: string;
  reportUrl: string;
  submittedAt: string;
  detectedIndustry?: string;
  leadSource?: string;
  utmSource?: string;
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

Import `ResearchStep` from langgraph-agent for type definitions (see Step 6).

#### `storage.ts` (~175 lines)

Functions:
- `getJobsStore()` — Initialize audit-jobs blob store
- `getAuditReportStore()` — Initialize audit-reports blob store
- `getLeadsStore(source)` — Generic store getter for audit/contact/survey/pricing/onboarding leads
- `initializeJob(jobId, formData)` — Create initial job record
- `updateJobStatus(jobId, status, progress, ...)` — Update with strong consistency
- `createProgressCallback(jobId)` — Return callback for agent progress tracking

**Critical Gotcha #2:** ALL stores must use `consistency: "strong"` in options.

#### `validation.ts` (~80 lines)

Functions:
- `isValidLanguage(lang)` — Check if 'cs' or 'en'
- `validateRequiredFields(data)` — Validate email, website, company, city format
- Return bilingual error messages in data object

#### `lead-management.ts` (~104 lines)

Functions:
- `generateLeadId(prefix)` — Create `lead-${base36ts}-${rand6}` format
- `storeLead(leadData)` — Save to audit-leads + update `_leads_index`
- `submitToNetlifyForms(formData)` — POST to Netlify Forms API
- Race condition warning: concurrent writes to `_leads_index` can lose entries (acceptable at <10/min)

#### `index.ts` (~42 lines)

Re-export all shared utilities:

```typescript
export * from './types';
export * from './storage';
export * from './validation';
export * from './lead-management';
```

### 5.2 Create Sync Audit Handler

**File:** `netlify/functions/audit.ts` (~440 lines)

```typescript
import { Handler } from '@netlify/functions';
import { AuditFormData } from './audit-shared';
import { validateRequiredFields } from './audit-shared/validation';
import { executeDeepResearch } from './audit-services/langgraph';
import { generateHTMLReport } from './audit-services/html-report';
import { storeLead } from './audit-shared/lead-management';
import { sendAuditEmails } from './audit-services/email-handler';

export const handler: Handler = async (event) => {
  try {
    const formData = JSON.parse(event.body || '{}') as AuditFormData;

    // 1. Validate
    const validationErrors = validateRequiredFields(formData);
    if (Object.keys(validationErrors).length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ validationErrors }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    // 2. Research (no progress callback for sync)
    const agentResult = await executeDeepResearch({
      website: formData.website,
      companyName: formData.companyName,
      industry: formData.biggestPainPoint,
      language: formData.language,
    }, {
      tavilyKey: process.env.TAVILY_API_KEY!,
      openrouterKey: process.env.OPENROUTER_API_KEY!,
    });

    // 3. Generate Report
    const reportHtml = generateHTMLReport(agentResult.reportData);
    const reportId = agentResult.reportData.reportId;

    // 4. Store Report
    await storeReportInBlobs(reportId, reportHtml);

    // 5. Store Lead
    await storeLead({
      id: generateLeadId('lead'),
      ...formData,
      reportId,
      reportUrl: `https://hypedigitaly.ai/report/${reportId}`,
      submittedAt: new Date().toISOString(),
      detectedIndustry: agentResult.reportData.companyProfile.detectedIndustry,
    });

    // 6. Send Emails (non-blocking)
    await sendAuditEmails(formData, reportId, reportHtml).catch(err => {
      console.error('[Audit] Email error (continuing):', err);
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, reportId }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('[Audit] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Audit processing failed' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
```

### 5.3 Create Async Background Handler

**File:** `netlify/functions/audit-background.ts` (~437 lines)

```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  const { jobId, ...formData } = JSON.parse(event.body || '{}');

  try {
    // 1. Initialize job
    await initializeJob(jobId, formData);

    // 2. Background processing (fire-and-forget)
    // Do NOT await this - return 202 immediately
    processAuditInBackground(jobId, formData).catch(err => {
      console.error('[Audit-BG] Processing error:', err);
      updateJobStatus(jobId, 'failed', 100, { error: err.message });
    });

    return {
      statusCode: 202,
      body: 'Accepted',
      headers: { 'Content-Type': 'text/plain' },
    };
  } catch (error) {
    console.error('[Audit-BG] Init error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to queue audit' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};

async function processAuditInBackground(jobId: string, formData: AuditFormData) {
  // Update status → research → report → store → email → complete
  // Use progressCallback to track granular sub-steps
}
```

**Critical Gotcha #3:** Background function naming must be `*-background.ts`. Returns 202 immediately, processing continues asynchronously with 15-minute timeout.

### 5.4 Create Status Polling Endpoint

**File:** `netlify/functions/audit-status.ts` (~100 lines)

```typescript
export const handler: Handler = async (event) => {
  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'jobId required' }),
    };
  }

  try {
    const store = getJobsStore();
    const jobRecord = await store.get(jobId, { consistency: 'strong' });

    if (!jobRecord) {
      return {
        statusCode: 200,
        body: JSON.stringify({ notFound: true }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const job = JSON.parse(jobRecord) as AuditJob;
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: job.status,
        progress: job.progress,
        statusMessage: job.statusMessage,
        currentSubStep: job.currentSubStep,
        subStepMessage: job.subStepMessage,
        error: job.error,
        validationErrors: job.validationErrors,
        reportUrl: job.reportUrl,
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('[Audit-Status] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Status lookup failed' }),
    };
  }
};
```

### 5.5 Create Report Retrieval Endpoint

**File:** `netlify/functions/audit-report.ts` (~100 lines)

Returns stored HTML report by reportId:

```typescript
export const handler: Handler = async (event) => {
  const reportId = event.queryStringParameters?.reportId;

  if (!reportId) {
    return {
      statusCode: 400,
      body: 'Missing reportId',
    };
  }

  try {
    const store = getAuditReportStore();
    const html = await store.get(reportId);

    if (!html) {
      return { statusCode: 404, body: 'Report not found' };
    }

    // Check expiration
    const metaKey = `${reportId}-meta`;
    const meta = await store.get(metaKey).then(JSON.parse).catch(() => null);

    if (meta?.expiresAt && new Date(meta.expiresAt) < new Date()) {
      return { statusCode: 410, body: 'Report expired' };
    }

    return {
      statusCode: 200,
      body: html,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    };
  } catch (error) {
    console.error('[Audit-Report] Error:', error);
    return {
      statusCode: 500,
      body: 'Report retrieval failed',
    };
  }
};
```

### 5.6 Create Admin Leads Aggregation Endpoint

**File:** `netlify/functions/admin-leads.ts` (~200 lines)

```typescript
export const handler: Handler = async (event) => {
  // Verify admin auth
  if (!verifyAdminAuth(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
    const leads = [];

    // Fetch from all 5 lead sources
    for (const source of ['audit', 'contact', 'survey', 'onboarding', 'pricing']) {
      const store = getLeadsStore(`${source}-leads`);
      const index = JSON.parse(await store.get('_leads_index'));

      for (const leadId of index.slice(0, 100)) {
        const leadData = JSON.parse(await store.get(leadId));
        leads.push({ ...leadData, source });
      }
    }

    // Sort by submittedAt descending
    leads.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return {
      statusCode: 200,
      body: JSON.stringify(leads.slice(0, 500)),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://hypedigitaly.ai',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  } catch (error) {
    console.error('[Admin-Leads] Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch leads' }),
    };
  }
};
```

### 5.7 Create Admin Leads Delete Endpoint

**File:** `netlify/functions/admin-leads-delete.ts` (~80 lines)

DELETE endpoint to remove individual leads by ID.

---

## Step 6: Implement AI Research Pipeline

**Reference:** `05-ai-research-pipeline.md`

### 6.1 Dual Architecture: Monolith vs. Modular

**Critical Gotcha #4:** Two files serve different purposes:

1. **Monolith:** `netlify/functions/audit-services/langgraph-agent.ts` (~2,465 lines)
   - Used for: Type definitions only (`ResearchStep`)
   - Imported by: `audit-shared/types.ts`, `audit-shared/storage.ts`
   - Pattern: `import type { ResearchStep } from '../audit-services/langgraph-agent'`

2. **Modular:** `netlify/functions/audit-services/langgraph/` (~14 files, ~3,500 lines)
   - Used for: Execution
   - Imported by: `audit.ts`, `audit-background.ts`
   - Pattern: `import { executeDeepResearch } from './audit-services/langgraph'`

**Why two?** Monolith got too large (2,465 lines). Split for maintainability while keeping type definitions stable.

### 6.2 Create Modular LangGraph Directory

**Directory:** `netlify/functions/audit-services/langgraph/`

Core files:

| File | Lines | Purpose |
|------|-------|---------|
| `index.ts` | 69 | Central re-export point |
| `types.ts` | 150 | Shared type definitions |
| `config.ts` | 200 | RESEARCH_STEPS mapping, MODEL_CONFIGS |
| `tavily-search.ts` | 350 | Tavily API integration |
| `query-generator.ts` | 280 | Query set generation |
| `prompt-generator.ts` | 150 | Research synthesis prompts |
| `industry-recommendations.ts` | 200 | Industry-specific recommendations |
| `llm-synthesizer.ts` | 180 | OpenRouter LLM calls |
| `pain-point-analyzer.ts` | 120 | Pain point analysis |
| `micro-niches.ts` | 100 | Niche categorization |
| `niche-examples.ts` | 150 | Example companies |
| `value-proposition-templates.ts` | 180 | VP templates by industry |
| `fallback-report.ts` | 280 | Generates default report |
| `executor.ts` | 300 | Main `executeDeepResearch()` entry point |

### 6.3 Implement Research Pipeline (executor.ts)

```typescript
export async function executeDeepResearch(
  input: AuditFormInputs,
  config: ResearchConfig,
  progressCallback?: ProgressCallback
): Promise<ResearchResult> {
  // Step 1: Generate search queries (company info, news, website, tech, apps, ai tools)
  const queries = generateQuerySet(input);

  // Step 2: Execute 6 parallel Tavily searches with progress tracking
  const searchResults = await Promise.all([
    searchCompanyInfo(queries, config.tavilyKey),
    searchCompanyNews(queries, config.tavilyKey),
    searchWebsite(queries, config.tavilyKey),
    searchTechnologies(queries, config.tavilyKey),
    searchCompanyApps(queries, config.tavilyKey),
    searchAITools(queries, config.tavilyKey),
  ].map((promise, idx) =>
    promise.then(result => {
      progressCallback?.(RESEARCH_STEPS[idx], 30 + (idx * 3), `Researching ${RESEARCH_STEPS[idx]}...`);
      return result;
    })
  ));

  // Step 3: Synthesize results via LLM
  progressCallback?.('llm_analyzing', 50, 'LLM analyzing results...');
  const reportData = await synthesizeReport(searchResults, input, config);

  // Step 4: Fallback if synthesis fails
  if (!reportData || !reportData.aiOpportunities?.length) {
    return generateAgentFallbackReport(input);
  }

  progressCallback?.('building_report', 55, 'Building report...');
  return { success: true, reportData };
}
```

### 6.4 Implement LLM Synthesizer

**File:** `netlify/functions/audit-services/langgraph/llm-synthesizer.ts`

Calls OpenRouter with model cascade:

```typescript
const MODEL_CASCADE = [
  'openai/gpt-4-turbo',      // Primary model
  'openai/gpt-4',            // Fallback 1
  'anthropic/claude-3-opus', // Fallback 2
  'meta-llama/llama-3-70b',  // Fallback 3
];

export async function synthesizeReport(
  searchResults: TavilyResult[],
  input: AuditFormInputs,
  config: ResearchConfig
): Promise<AuditReportData | null> {
  for (const model of MODEL_CASCADE) {
    try {
      const prompt = generateSynthesisPrompt(searchResults, input);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.openrouterKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        console.warn(`[LLM] Model ${model} failed, trying next...`);
        continue;
      }

      const data = await response.json();
      const reportJson = extractAndParseJson(data.choices[0].message.content);
      return validateAndFillReport(reportJson, input);
    } catch (error) {
      console.warn(`[LLM] Error with ${model}:`, error);
      continue;
    }
  }

  return null; // All models failed, use fallback
}
```

### 6.5 Implement AI Field Validator (Optional)

**File:** `netlify/functions/audit-services/ai-field-validator.ts` (~120 lines)

Pre-submission form validation using OpenRouter.

### 6.6 Implement Branding Fetcher (Optional)

**File:** `netlify/functions/audit-services/branding-fetcher.ts` (~150 lines)

Fetches company logo, favicon, colors using Firecrawl API (gracefully falls back if not available).

---

## Step 7: Implement Report Generation System

**Reference:** `06-report-generation.md`

### 7.1 Dual Architecture: HTML Report Shim vs. Modular

**Critical Gotcha #5:** Similar pattern to LangGraph:

1. **Shim:** `netlify/functions/audit-services/html-report-generator.ts` (~16 lines)
   - Re-export wrapper for backwards compatibility
   ```typescript
   export * from './html-report';
   export { generateHTMLReport } from './html-report';
   ```

2. **Modular:** `netlify/functions/audit-services/html-report/` (~24 files, ~4,500 lines)
   - Actual implementation

### 7.2 Create HTML Report Module Structure

**Directory:** `netlify/functions/audit-services/html-report/`

Core files:

| File | Lines | Purpose |
|------|-------|---------|
| `index.ts` | 70 | Public API exports |
| `types.ts` | 300 | TypeScript interfaces |
| `generator.ts` | 150 | Main `generateHTMLReport()` function |
| `translations.ts` | 200 | Bilingual (CS/EN) content |
| `utils.ts` | 250 | HTML escape, color manipulation, helpers |
| `styles.ts` | 400 | CSS with smart color selection |
| `scripts.ts` | 150 | Embedded vanilla JS for interactivity |
| `sections/` | 3000 | 18 section generators |

### 7.3 Implement Key Section Generators

**File:** `netlify/functions/audit-services/html-report/sections/`

Generate HTML sections in order:

1. **header.ts** — Logo, title, dates, action buttons
2. **company.ts** — Company profile card (name, website, city, industry)
3. **summary.ts** — Executive benefits summary
4. **opportunities.ts** — AI opportunities with quadrant badges
5. **matrix.ts** — 2x2 effort/impact visualization
6. **roi.ts** — Interactive ROI calculator with sliders
7. **questions.ts** — Critical AI adoption questions
8. **technologies.ts** — Detected tech stack
9. **app-integration.ts** — Integration recommendations
10. **benchmark.ts** — Industry benchmarking
11. **timeline.ts** — Implementation roadmap (3 phases)
12. **risk.ts** — Risk assessment matrix
13. **tools.ts** — Recommended third-party tools
14. **cta.ts** — Call-to-action section
15. **footer.ts** — Footer with company info

### 7.4 Implement Main Generator Function

**File:** `netlify/functions/audit-services/html-report/generator.ts`

```typescript
export function generateHTMLReport(data: AuditReportData): string {
  const t = getTranslations(data.language);
  const styles = getStyles(data.companyBranding);
  const scripts = getScripts(data);

  // Assemble 15 sections in HTML5 document
  const html = `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${t.reportTitle}</title>
  <style>${styles}</style>
</head>
<body>
  ${generateHeaderSection(data, t)}
  ${generateCompanySection(data, t)}
  ${generateSummarySection(data, t)}
  ${generateOpportunitiesSection(data, t)}
  ${generateMatrixSection(data, t)}
  ${generateROISection(data, t)}
  ${generateQuestionsSection(data, t)}
  ${generateTechnologiesSection(data, t)}
  ${generateAppIntegrationSection(data, t)}
  ${generateBenchmarkSection(data, t)}
  ${generateTimelineSection(data, t)}
  ${generateRiskSection(data, t)}
  ${generateToolsSection(data, t)}
  ${generateCTASection(data, t)}
  ${generateFooterSection(data, t)}

  <script>${scripts}</script>
</body>
</html>`;

  return html;
}
```

### 7.5 Implement Color Smart Selection

**File:** `netlify/functions/audit-services/html-report/styles.ts`

```typescript
export function selectBrandColor(
  branding?: CompanyBranding,
  fallback: string = '#00A39A'
): string {
  if (!branding) return fallback;

  // Priority: Accent > Primary > Background (if colorful) > Fallback
  const candidates = [
    branding.accentColor,
    branding.primaryColor,
    branding.backgroundColor,
  ];

  for (const color of candidates) {
    if (color && isSafeColor(color) && !isBrowserDefaultColor(color)) {
      return color;
    }
  }

  return fallback;
}

function isBrowserDefaultColor(color?: string): boolean {
  const defaults = ['#0000EE', '#551A8B', '#FFFFFF', '#000000', '#C0C0C0'];
  return defaults.includes(color?.toUpperCase() || '');
}
```

---

## Step 8: Set Up Email System

**Reference:** `08-email-system.md`

### 8.1 Create Email Template Generators

**File:** `netlify/functions/audit-templates.ts` (~350 lines)

Generate 4 email templates:

1. **Team Notification** (HTML + Text)
   - To: pavelcermak@hypedigitaly.ai, cermakova@hypedigitaly.ai
   - Subject: `Nový lead: AI Předběžný audit - {company}`
   - Contains: Company info, pain points, tools, report link

2. **User Confirmation** (HTML + Text, bilingual)
   - To: User's email
   - Subject (CS): `AI Předběžný audit pro {company}`
   - Subject (EN): `AI Preliminary audit for {company}`
   - Contains: Report link, consultation CTA, company info

### 8.2 Configure Resend Integration

```typescript
async function sendAuditEmails(
  formData: AuditFormData,
  reportId: string,
  reportHtml: string
): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const reportUrl = `https://hypedigitaly.ai/report/${reportId}`;

  // 1. Notification email to team
  const notifResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'HypeDigitaly <noreply@notifications.hypedigitaly.ai>',
      to: ['pavelcermak@hypedigitaly.ai', 'cermakova@hypedigitaly.ai'],
      reply_to: formData.email,
      subject: `Nový lead: AI Předběžný audit - ${formData.companyName}`,
      html: generateAuditNotificationEmailHTML(formData, reportUrl),
      text: generateAuditNotificationEmailText(formData, reportUrl),
    }),
  });

  if (!notifResponse.ok) {
    console.warn('[Email] Notification failed (continuing):', await notifResponse.json());
  }

  // 2. Confirmation email to user
  const confirmResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'HypeDigitaly <noreply@notifications.hypedigitaly.ai>',
      to: [formData.email],
      subject: formData.language === 'en'
        ? `AI Preliminary audit for ${formData.companyName}`
        : `AI Předběžný audit pro ${formData.companyName}`,
      html: generateAuditConfirmationEmailHTML(formData, reportUrl),
      text: generateAuditConfirmationEmailText(formData, reportUrl),
    }),
  });

  if (!confirmResponse.ok) {
    console.warn('[Email] Confirmation failed (continuing):', await confirmResponse.json());
  }
}
```

**Critical Gotcha #6:** Email failures must NOT block report delivery. Use try-catch without re-throwing.

---

## Step 9: Implement Admin Leads Dashboard

**Reference:** `03-admin-leads-frontend.md`

### 9.1 Create Admin Page

**File:** `src/pages/admin/leads.astro` (~2,100 lines)

Server-rendered page (not prerendered) with password login:

```astro
---
// Admin page - server-rendered only
export const prerender = false;
---

<html>
<head>
  <title>Admin - Leads Dashboard</title>
</head>
<body>
  <!-- Login Form (shown initially) -->
  <div id="login-screen">
    <form id="login-form">
      <input type="password" id="admin-password" placeholder="Admin Password" />
      <button type="submit">Login</button>
    </form>
  </div>

  <!-- Dashboard (shown after login) -->
  <div id="dashboard-screen" style="display: none;">
    <!-- Tabs: Table View | Question View | Onboarding Tab -->
    <!-- Table with leads, filters, bulk delete, CSV export -->
    <!-- Question view with Chart.js charts -->
  </div>

  <script>
    // Login handler
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('admin-password').value;
      sessionStorage.setItem('admin_password', password);

      const response = await fetch('/.netlify/functions/admin-leads', {
        headers: { 'Authorization': `Bearer ${password}` },
      });

      if (response.ok) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'block';
        fetchLeads(password);
      } else {
        alert('Invalid password');
      }
    });
  </script>
</body>
</html>
```

### 9.2 Implement Table View

10-column table with:
- Lead ID, Source, Company Name, Email, City, Website, Pain Point, Tools, Submitted Date, Actions

Features:
- Filtering by source (Audit, Contact, Survey, Pricing, Onboarding)
- Sorting by date, company, source
- Row click to view lead details
- Bulk select checkboxes
- Delete lead action

### 9.3 Implement Question View

Analytics dashboard with Chart.js:

- Pain point frequency chart (horizontal bar)
- Industry distribution (pie chart)
- AI maturity levels (gauge)
- Response timeline (line chart)
- Individual respondent panels

### 9.4 CSV Export

Generate CSV with all leads:

```typescript
function exportCSV(leads) {
  const headers = ['ID', 'Source', 'Company', 'Email', 'City', 'Website', 'Pain Point', 'Tools', 'Date'];
  const rows = leads.map(lead => [
    lead.id,
    lead.source,
    lead.companyName,
    lead.email,
    lead.city,
    lead.website,
    lead.biggestPainPoint,
    lead.currentTools,
    new Date(lead.submittedAt).toLocaleDateString(),
  ]);

  // Apply CSV escaping (prevent formula injection)
  const escapedRows = rows.map(row =>
    row.map(cell => {
      const str = String(cell || '');
      if (str.match(/^[=+\-@]/)) {
        return `'${str}`; // Prefix with quote to prevent formula injection
      }
      return `"${str.replace(/"/g, '""')}"`;
    })
  );

  const csv = [headers, ...escapedRows]
    .map(row => row.join(','))
    .join('\n');

  downloadFile(csv, 'leads.csv', 'text/csv');
}
```

---

## Step 10: Configure Security

**Reference:** `10-security.md`

### 10.1 Set Admin Password

```bash
# Generate secure random 32-char password
openssl rand -base64 32

# Set in Netlify UI:
# Site Settings → Build & Deploy → Environment Variables
# Key: ADMIN_PASSWORD
# Value: [pasted secure string]
```

### 10.2 Implement Constant-Time Auth

**File:** `netlify/functions/onboarding-shared/auth.ts`

```typescript
import { timingSafeEqual } from 'crypto';

export function verifyAdminAuth(event: any): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('[Auth] ADMIN_PASSWORD not configured');
    return false;
  }

  const provided = event.headers?.authorization?.replace('Bearer ', '');
  if (!provided) return false;

  try {
    const aBuf = Buffer.from(provided, 'utf8');
    const bBuf = Buffer.from(adminPassword, 'utf8');

    if (aBuf.length !== bBuf.length) {
      timingSafeEqual(aBuf, aBuf); // Dummy comparison for timing safety
      return false;
    }

    return timingSafeEqual(aBuf, bBuf);
  } catch (err) {
    console.error('[Auth] Comparison error:', err);
    return false;
  }
}
```

### 10.3 Configure Security Headers

**File:** `netlify.toml` (root)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### 10.4 Configure CORS

Restrict API access to your domain:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://hypedigitaly.ai',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
};
```

### 10.5 Input Validation

Apply to all endpoints:

- Email validation: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
- URL validation: Must start with `http://` or `https://`
- HTML stripping: Remove `<...>` tags from free-text fields
- Size limits: Cap strings at 254 chars (email), 500 chars (notes)
- Prototype pollution: Filter `__proto__`, `constructor`, `prototype` keys

---

## Step 11: Configure Deployment

**Reference:** `11-environment-and-deployment.md`

### 11.1 Create Root `netlify.toml`

```toml
[build]
  base = "astro-src"
  command = "git fetch --unshallow 2>/dev/null || true && npm run build"
  functions = "netlify/functions"
  publish = "dist"
  ignore = "git diff --quiet HEAD~ HEAD -- $INCOMING_HOOK_BODY"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
  external_node_modules = ["@netlify/blobs", "@langchain/langgraph"]

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[redirects]]
  from = "/report/:reportId"
  to = "/.netlify/functions/audit-report?reportId=:reportId"
  status = 200
  force = true
```

### 11.2 Set Environment Variables in Netlify UI

Navigate to **Site Settings → Build & Deploy → Environment Variables**

| Variable | Value |
|----------|-------|
| `NETLIFY_SITE_ID` | From Site Settings |
| `NETLIFY_API_TOKEN` | From User Settings → Personal Access Tokens |
| `RESEND_API_KEY` | From Resend Dashboard |
| `TAVILY_API_KEY` | From Tavily Dashboard |
| `OPENROUTER_API_KEY` | From OpenRouter Dashboard |
| `FIRECRAWL_API_KEY` | From Firecrawl Dashboard (optional) |
| `ADMIN_PASSWORD` | Secure random 32-char string |

### 11.3 Create `.env.local` for Local Development

```bash
# .env.local (never commit)
NETLIFY_SITE_ID=your-site-id
NETLIFY_API_TOKEN=your-api-token
RESEND_API_KEY=re_xxxxx
TAVILY_API_KEY=tvly_xxxxx
OPENROUTER_API_KEY=sk-or-xxxxx
FIRECRAWL_API_KEY=fc_xxxxx
ADMIN_PASSWORD=your-secure-password
```

### 11.4 Deploy & Verify

```bash
# 1. Push to main branch (triggers automatic deploy)
git add .
git commit -m "Implement audit system"
git push origin main

# 2. Check deployment status
netlify status

# 3. Run smoke tests
curl https://your-site.netlify.app/audit
curl https://your-site.netlify.app/api/audit-background

# 4. Verify env vars loaded
# Check Netlify Function logs for confirmation messages
```

---

## Step 12: Test End-to-End

### 12.1 Form Submission Test

1. Navigate to `/audit` page
2. Fill in form:
   - Email: test@example.com
   - Website: https://techcorp.cz
   - Company: TechCorp s.r.o.
   - City: Prague
   - Pain Point: Select ≥1 checkbox
   - Tools: Select ≥1 checkbox (optional)
3. Submit form
4. Verify:
   - Progress bar appears
   - Status updates every 1.5s
   - 8 step dots animate
   - Report completes or error shows

### 12.2 Background Job Test

1. Submit form via `/audit-background` endpoint
2. Verify 202 response returned immediately
3. Poll `audit-status?jobId={jobId}` and verify:
   - Status transitions: pending → validating → researching → generating → storing → emailing → completed
   - Progress increases monotonically (0 → 100%)
   - Sub-steps track (fetch_branding, search_company_info, etc.)

### 12.3 Report Generation Test

1. Wait for audit to complete
2. Check email for report link
3. Click link → `/report/{reportId}` loads
4. Verify report contains:
   - Company name, website, city
   - 5-8 critical questions
   - 8-12 AI opportunities
   - 2x2 opportunity matrix
   - ROI calculator (interactive sliders)
   - Industry benchmarks
   - Implementation timeline
   - Risk assessment

### 12.4 Admin Dashboard Test

1. Navigate to `/admin/leads`
2. Enter admin password
3. Verify dashboard loads with:
   - Table view showing all leads
   - Filters for source (Audit, Contact, Survey, Pricing, Onboarding)
   - Sorting by date, company, source
   - Question view with charts
   - Onboarding tab
   - CSV export functionality
   - Bulk delete with confirmation

### 12.5 Email Delivery Test

1. Submit audit form with your email
2. Wait ~2 minutes for processing
3. Check inbox for:
   - **Notification email** to team (pavelcermak@hypedigitaly.ai)
     - Subject: `Nový lead: AI Předběžný audit - {company}`
     - Contains: report link
   - **Confirmation email** to user
     - Bilingual (CS/EN based on form language)
     - Subject: `AI Předběžný audit pro {company}`
     - Contains: report link, consultation CTA, company info

### 12.6 API Endpoint Tests

```bash
# Test audit-status endpoint
curl "https://your-site.netlify.app/.netlify/functions/audit-status?jobId=test-123"

# Test admin-leads endpoint (requires auth)
curl -H "Authorization: Bearer YOUR_PASSWORD" \
  "https://your-site.netlify.app/.netlify/functions/admin-leads"

# Test audit-report endpoint
curl "https://your-site.netlify.app/.netlify/functions/audit-report?reportId=xyz123"
```

---

## Critical Gotchas (10+)

These are the most common pitfalls when replicating the system.

### Gotcha 1: Blob Store Consistency

**Issue:** Using `consistency: 'eventual'` instead of `'strong'`

**Impact:** Polling returns stale data; users see stuck progress; reports appear not to exist

**Fix:** All blob stores MUST have `consistency: 'strong'`:

```typescript
const store = getStore({
  name: STORE_NAME,
  siteID,
  token,
  consistency: 'strong', // ← CRITICAL
});
```

### Gotcha 2: Background Function Naming

**Issue:** Creating `audit-process.ts` instead of `audit-background.ts`

**Impact:** Function doesn't get 15-minute timeout; treated as sync (30-sec timeout); long jobs timeout

**Fix:** File must end with `-background.ts`:

```
✓ audit-background.ts
✗ audit-process.ts
✗ audit-async.ts
```

### Gotcha 3: Dual Architectures (LangGraph & HTML Report)

**Issue:** Importing from wrong path or mixing monolith + modular

**Impact:** Type errors, duplicate code, circular imports

**Fix:** Use explicit patterns:

```typescript
// For types:
import type { ResearchStep } from '../audit-services/langgraph-agent';

// For execution:
import { executeDeepResearch } from './audit-services/langgraph';
import { generateHTMLReport } from './audit-services/html-report';
```

### Gotcha 4: Hardcoded URLs

**Issue:** Using `http://localhost:3000` or demo URLs in production code

**Impact:** Production audit links go to wrong domain; reports 404

**Fix:** Use environment variables or compute at runtime:

```typescript
const reportUrl = `https://${process.env.NETLIFY_SITE_NAME || 'hypedigitaly.ai'}/report/${reportId}`;
```

Find all hardcoded URLs:
- `REPORT_BASE_URL` in types.ts
- Email template links
- Success state links in frontend
- Redirects in netlify.toml

### Gotcha 5: _redirects Force Rule

**Issue:** Creating `/report` route without `!` suffix in `_redirects`

**Impact:** Astro SSR intercepts redirects; function never called

**Fix:** Use force rule syntax:

```
# public/_redirects
/report/:reportId /.netlify/functions/audit-report?reportId=:reportId 200 !
```

The `!` suffix forces Netlify to rewrite even if SSR matches.

### Gotcha 6: Email Failures Blocking Flow

**Issue:** Throwing exceptions when email fails

**Impact:** Users never see completion; reports marked failed even if generated

**Fix:** Use best-effort pattern with `.catch()` at end of audit processing:

```typescript
await sendAuditEmails(formData, reportId, reportHtml).catch(err => {
  console.error('[Audit] Email error (continuing):', err);
  // DON'T throw - job is still complete
});
```

### Gotcha 7: Survey Rate Limit Store Name

**Issue:** Using `rate-limits` instead of `survey-ratelimit`

**Impact:** Survey rate limiting doesn't work; multiple submissions allowed

**Fix:** Exact store names matter:
```
✓ survey-ratelimit
✓ pricing-ratelimit
✗ rate-limits
```

### Gotcha 8: No ares-cache Store (Onboarding Only)

**Issue:** Creating `ares-cache` store for audit system

**Impact:** Unused phantom store; storage quota bloat; audit code doesn't need it

**Fix:** `ares-cache` is ONLY for onboarding (Step 8 in site-builder). Don't create for audit system.

### Gotcha 9: Lead Index Race Condition

**Issue:** Multiple concurrent submissions lose index entries

**Impact:** Leads submitted simultaneously might not appear in admin dashboard

**Fix:** Acceptable at <10/min scale. For production, implement:
- Distributed lock (via Blobs)
- Compare-and-swap retry loop
- Or migrate to database with transactions

Current code uses simple unshift:

```typescript
leadsIndex.unshift(lead.id); // O(n) but concurrent writes can lose entries
```

### Gotcha 10: PDF Magic Bytes Validation

**Issue:** Not validating PDF uploads from external sources

**Impact:** Malformed or malicious PDFs stored; potential RCE on server

**Fix:** Validate PDF magic bytes on upload:

```typescript
function validatePDFMagicBytes(data: Buffer): boolean {
  const pdfHeader = Buffer.from('%PDF-', 'utf8');
  return data.slice(0, 5).equals(pdfHeader);
}
```

### Gotcha 11: Report IDs Are Unguessable But Not Authenticated

**Issue:** Assuming report IDs are secret enough for security

**Impact:** Anyone with reportId can view audit report (intended behavior for sharing)

**Fix:** If reports should be private, add authentication layer or short TTL (currently 30 days).

---

## Verification Checklist (20+ Items)

Run all tests before marking system complete.

### Form & Submission (5 tests)
- [ ] `/audit` page loads with form
- [ ] Form validation works (required fields, email format, pain point selection)
- [ ] Submit button triggers 202 response from background function
- [ ] Fallback to sync function if background 404
- [ ] Progress UI shows and updates every 1.5s

### Polling & Progress (6 tests)
- [ ] `audit-status` endpoint returns correct status for jobId
- [ ] Progress bar increases smoothly (0→100%)
- [ ] Step dots activate in sequence (1→8)
- [ ] Sub-step messages display correctly
- [ ] Polling stops after completion (no infinite requests)
- [ ] Timeout error appears after 5 minutes

### Report Generation (5 tests)
- [ ] Report HTML generated successfully
- [ ] Report stored in audit-reports blob with strong consistency
- [ ] Report ID used in email links is correct
- [ ] `/report/{reportId}` endpoint returns HTML (200)
- [ ] Report PDF export works (Save to PDF button)

### Email Delivery (4 tests)
- [ ] Team notification email sent to pavelcermak@hypedigitaly.ai
  - Subject: `Nový lead: AI Předběžný audit - {company}`
  - Contains company name, pain point, tools, report link
- [ ] User confirmation email sent to form email
  - Bilingual (subject in CS/EN)
  - Contains report link, consultation CTA
- [ ] Email failure doesn't block report completion
- [ ] Both HTML and text versions sent

### Admin Dashboard (5 tests)
- [ ] `/admin/leads` requires password (shows login form)
- [ ] Correct password logs in; wrong password shows error
- [ ] Table view shows all leads (audit, contact, survey, pricing, onboarding)
- [ ] Filters work (by source, company, date)
- [ ] Bulk delete with confirmation modal
- [ ] CSV export works (valid CSV format, no formula injection)
- [ ] Question view shows charts and analytics
- [ ] Onboarding tab displays onboarding leads separately

### API Endpoints (5 tests)
- [ ] GET `/api/audit-status?jobId=xxx` returns correct status
- [ ] POST `/api/audit` (sync) returns 200 with success
- [ ] POST `/api/audit-background` returns 202 immediately
- [ ] GET `/api/audit-report?reportId=xxx` returns HTML (200)
- [ ] GET `/api/admin-leads` requires auth header (401 without password)

### Database (3 tests)
- [ ] Leads stored in audit-leads blob (check Netlify UI)
- [ ] Report HTML stored in audit-reports blob
- [ ] Job record created in audit-jobs and updated during processing

### Bilingual Support (3 tests)
- [ ] `/audit?lang=en` loads English version
- [ ] `/audit?lang=cs` redirects to `/audit` (default)
- [ ] Status messages, labels, emails translate correctly

### Performance (2 tests)
- [ ] `/audit` page loads in <3 seconds
- [ ] Report generation completes in <5 minutes (including research)

### Security (3 tests)
- [ ] Admin password constant-time comparison (timing attack resistant)
- [ ] CORS headers block cross-origin access
- [ ] Security headers set (X-Frame-Options, X-XSS-Protection, etc.)
- [ ] Email validation prevents header injection (newlines stripped)
- [ ] HTML stripping prevents XSS (free-text fields sanitized)

---

## Troubleshooting Quick Reference

| Issue | Cause | Solution |
|-------|-------|----------|
| `Netlify Blobs not configured` | NETLIFY_SITE_ID or TOKEN missing | Check Netlify env vars, verify site ID in Settings |
| `audit-background returns 404` | File not named `audit-background.ts` | Rename to correct filename with `-background` suffix |
| `Polling stuck at researching` | Eventual consistency (not strong) | Edit blob stores in Netlify UI, enable `consistency: strong` |
| `Report link 404` | Hardcoded `http://localhost` in email | Update email templates to use dynamic domain |
| `Email not sent` | RESEND_API_KEY invalid or revoked | Regenerate key in Resend dashboard, update env vars |
| `Admin dashboard shows 401` | Password not set in env vars | Set ADMIN_PASSWORD in Netlify UI |
| `Audit fails with "undefined" error` | Missing LLM key (OPENROUTER_API_KEY) | Set key in Netlify env vars |
| `Report generation very slow` | Model cascade taking too long | Lower timeout or skip fallback models |
| `Leads not appearing in admin` | Index update race condition | Not critical at <10/min; acceptable behavior |

---

## Final Deployment Checklist

- [ ] All 10 blob stores created with strong consistency
- [ ] All environment variables set in Netlify UI
- [ ] `netlify.toml` configured with correct build command
- [ ] `astro.config.mjs` uses Netlify adapter
- [ ] Security headers configured
- [ ] CORS headers set on all API endpoints
- [ ] Hardcoded URLs updated to production domain
- [ ] Email templates configured with correct recipients
- [ ] `/audit` page accessible and form works
- [ ] Background function returns 202 immediately
- [ ] Polling updates correctly
- [ ] Report generates and stores
- [ ] Emails sent (check team inbox)
- [ ] Admin dashboard password protected
- [ ] All 20+ verification items pass

---

## Reference to All 11 Domain Documents

| # | Document | Coverage |
|---|----------|----------|
| **01** | [architecture.md](01-architecture.md) | System overview, master file inventory, data models, patterns, tech stack |
| **02** | [audit-page-frontend.md](02-audit-page-frontend.md) | `/audit` page form, validation, polling, animations, bilingual support |
| **03** | [admin-leads-frontend.md](03-admin-leads-frontend.md) | `/admin/leads` dashboard, table view, question view, CSV export, authentication |
| **04** | [backend-functions.md](04-backend-functions.md) | Netlify Functions (audit, status, report, admin-leads), shared utilities |
| **05** | [ai-research-pipeline.md](05-ai-research-pipeline.md) | LangGraph agent, Tavily search, LLM synthesis, dual architecture, fallback strategy |
| **06** | [report-generation.md](06-report-generation.md) | HTML report generator, 18 section components, bilingual content, PDF generation |
| **07** | [storage-and-data.md](07-storage-and-data.md) | Blob store inventory (10 stores), lead schemas, key generation, consistency requirements |
| **08** | [email-system.md](08-email-system.md) | Resend integration, email templates, notification/confirmation flows, bilingual support |
| **09** | [api-reference.md](09-api-reference.md) | All endpoint specs, request/response schemas, error codes |
| **10** | [security.md](10-security.md) | Authentication, CORS, input validation, rate limiting, security headers |
| **11** | [environment-and-deployment.md](11-environment-and-deployment.md) | Env vars, build pipeline, local dev setup, production deployment, troubleshooting |

---

## Implementation Time Estimates

| Step | Task | Time |
|------|------|------|
| 1 | Astro setup & dependencies | 30 min |
| 2 | Astro & Netlify config | 30 min |
| 3 | Create 10 blob stores | 30 min |
| 4 | `/audit` page frontend | 3 hours |
| 5 | Backend functions (audit, status, report, admin) | 4 hours |
| 6 | AI research pipeline (LangGraph + modular) | 3 hours |
| 7 | Report generation (HTML + 18 sections) | 3 hours |
| 8 | Email system (Resend templates) | 1 hour |
| 9 | Admin dashboard (table, charts, CSV) | 2.5 hours |
| 10 | Security (auth, headers, validation) | 1 hour |
| 11 | Deployment & env config | 1 hour |
| 12 | Testing & verification | 2 hours |
| **TOTAL** | | **21.5 hours** |

---

**End of Replication Guide**

*For questions on specific components, refer to the corresponding domain document number (01-11).*

*Last updated: 2026-03-19 | Maintained by: Documentation Engineer*
