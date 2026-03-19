# AI Audit & Admin CRM Template — Product Requirements Document

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Sections 1-8 (Complete)
**Target Audience:** Claude Code (AI configurator), developers extending the template
**Reference:** See `docs/audit/01-architecture.md` for system architecture overview

---

## Table of Contents

- [Section 1: Template Overview](#section-1-template-overview)
- [Section 2: Config Schema Complete Reference](#section-2-config-schema-complete-reference)
- [Section 3: Two-Layer Config Architecture](#section-3-two-layer-config-architecture)
- [Section 4: Setup Runbook (10 Steps)](#section-4-setup-runbook-10-steps)
- [Section 5: File Modification Map](#section-5-file-modification-map)
- [Section 6: Hardcoded Values Registry](#section-6-hardcoded-values-registry)
- [Section 7: Verification Checklist](#section-7-verification-checklist)
- [Section 8: Gotchas & Known Issues](#section-8-gotchas--known-issues)

---

## Section 1: Template Overview

### What is the Audit Template?

The **AI Audit & Admin CRM Template** (`hype-audit-template`) is a production-ready lead generation platform with four core capabilities:

1. **AI Lead Magnet** — Self-service audit form (`/audit` page) that collects business information and generates personalized HTML reports
2. **LangGraph AI Research Agent** — Autonomous AI agent that researches companies via web search + LLM synthesis
3. **Interactive HTML Report Generator** — Converts research data into high-impact PDF-ready HTML reports
4. **Admin CRM Dashboard** — Unified `/admin/leads` dashboard aggregating leads from 5 sources (Audit, Contact, Survey, Pricing, Onboarding)

### Tech Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Framework** | Astro 5.16.6 | Server-rendered pages + SSR, zero client-side JavaScript required |
| **Styling** | Tailwind CSS 4.1.18 | Utility-first CSS with CSS token theming |
| **Language** | TypeScript (strict mode) | Type-safe backend functions and pages |
| **Runtime** | Netlify Functions + Blobs | Serverless backend, persistent JSON storage |
| **AI Services** | LangGraph, Tavily, OpenRouter | Autonomous research + web search + LLM synthesis |
| **Email** | Resend API | Verified email delivery for notifications + confirmations |
| **Optional** | Firecrawl API | Company branding extraction (optional, graceful fallback) |

### System Architecture (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         END-TO-END AUDIT FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

SYNC PATH (60-sec timeout):
User Browser          Netlify Edge           Functions               Services
    │                     │                      │                      │
    ├─[1. Form Submit]───▶│                      │                      │
    │                     ├──[POST /audit]──────▶│                      │
    │                     │                      ├──[Validate]──────────▶│
    │                     │                      ├──[Research]──────────▶│ (Tavily + OpenRouter)
    │                     │                      ├──[Generate Report]───▶│
    │                     │                      ├──[Store Blob]        │
    │                     │                      ├──[Send Email]────────▶│ (Resend)
    │◀─────[200 OK]───────◀┤                      │                      │
    │                     │                      │                      │


ASYNC PATH (15-min timeout + polling):
User Browser          Netlify Edge           Background Fn          Services
    │                     │                      │                      │
    ├─[1. Form Submit]───▶│                      │                      │
    │ (jobId in local)    │                      │                      │
    │◀───[202 Accepted]───◀┤──────[returns]──────│                      │
    │                     │                  [bg continues →→→]         │
    │                     │                      ├──[Validate]──────────▶│
    │                     │                      ├──[Fetch Branding]────▶│ (Firecrawl)
    │                     │                      ├──[Research]──────────▶│ (Tavily + OpenRouter)
    │                     │                      ├──[Generate Report]───▶│
    │                     │                      ├──[Store Blobs]       │
    │                     │                      ├──[Store Lead]        │
    │                     │                      ├──[Send Emails]───────▶│ (Resend)
    │                     │                      ├──[Update Status]     │
    │                     │                      │ (completion + URL)    │
    │                     │                      │                      │
    │[2. Poll Status]    │                      │                      │
    ├─[GET /audit-status?jobId=xxx]───────────▶│                      │
    │◀─[200 + progress]───┤                      │                      │
    │                     │                      │                      │
    │[3. Poll Status]    │                      │                      │
    ├─[GET /audit-status?jobId=xxx]───────────▶│                      │
    │◀─[200 + reportUrl]──┤                      │                      │
    │                     │                      │                      │
    ├─[4. Redirect]──────▶ /report/{reportId}   │                      │
    │◀─────[200 HTML]─────┤                      │                      │


ADMIN CRM (Password-Protected):
Admin Browser         Netlify Edge           Functions
    │                     │                      │
    ├─[GET /admin/leads]─▶│                      │
    │ (with ?password)    │                      │
    │                     ├──[GET /admin-leads]─▶│
    │                     │  (verify auth)       │
    │                     │  (fetch from 5 Blob  │
    │                     │   stores: audit,     │
    │                     │   contact, survey,   │
    │                     │   pricing, onboard)  │
    │◀────[200 HTML]──────┤                      │
    │  (dashboard with    │                      │
    │   all leads merged)  │                      │

REPORT SERVING (Persistent, 30+ years):
User Browser          Netlify Edge           Functions          Blob Storage
    │                     │                      │                      │
    ├─[GET /report/{reportId}]─────────────────▶│                      │
    │                     │  ├────────────────────────[GET reportId]───▶│
    │                     │  │                      ◀───[return HTML]────│
    │◀────[200 HTML]──────┤◀─┤                      │                      │
    │  (interactive,      │  │                      │                      │
    │   printable PDF,    │  │                      │                      │
    │   no auth needed)   │  │                      │                      │
    │  [Save as PDF]──────────────────────────────────────────────────▶│
    │  (via browser print)│                      │                      │
```

### What's INCLUDED in this Template

| Feature | Status | Details |
|---------|--------|---------|
| **Audit Form Page** | ✓ Complete | Full `/audit` page with bilingual (Czech/English) form, validation, hero section |
| **AI Research Agent** | ✓ Complete | 5-parallel-task LangGraph agent: company info, news, website, technologies, AI tools |
| **HTML Report Generator** | ✓ Complete | 18-section interactive report: company profile, opportunities matrix, ROI, timeline, risks |
| **Admin Leads Dashboard** | ✓ Complete | Aggregated view of 5 lead types (Audit, Contact, Survey, Pricing, Onboarding) with filtering, sorting, bulk delete |
| **Email Notifications** | ✓ Complete | Team notification (new lead) + user confirmation (with report link) via Resend |
| **Netlify Blobs Storage** | ✓ Complete | Persistent storage for reports, leads, job status (30+ year TTL) |
| **Background Processing** | ✓ Complete | 15-minute async handler with progress polling (202 Accepted pattern) |
| **Lead Tracking** | ✓ Complete | UTM parameters, click IDs (gclid, fbclid, msclkid), referrer tracking |
| **Branding Customization** | ✓ Complete | CSS token theming + logo/favicon + brand colors + social links |
| **Contact Forms** | ✓ Complete | 4 additional lead sources: Contact, Survey, Pricing Page, Onboarding |

### What's EXCLUDED from this Template

| Feature | Reason |
|---------|--------|
| **Blog / Content Marketing** | Out of scope. Template focuses on B2B lead generation. Blog can be added as separate Astro collection. |
| **HypeLead Onboarding Pages** | Out of scope. Separate skill: `/site-builder` handles full client website generation. |
| **Proposal Generator** | Out of scope. PandaDoc templates managed separately. |
| **Custom Integrations** | Out of scope. Zapier/Make.com webhooks can be added via custom functions. |
| **Multi-Language Support** | Partial. Czech + English hardcoded. Russian/Polish support requires additional translation strings. |
| **Mobile App** | Out of scope. Web-only platform. Responsive design optimized for mobile viewing. |

### File Count Summary

| Directory | File Count | Purpose |
|-----------|-----------|---------|
| `src/pages/` | 3 | Audit page, Admin dashboard, Privacy policy |
| `src/components/` | 25+ | UI components, layouts, sections (AuditRoadmap, etc.) |
| `src/scripts/` | 4 | Translation strings, UTM tracking, tab management |
| `src/styles/` | 2 | Global CSS with token theming + cookie consent |
| `netlify/functions/` | 45+ | Audit handlers, admin functions, email templates, AI services |
| `netlify/functions/audit-services/` | 35+ | LangGraph agent (14 files), HTML report (24 files), glossary |
| `netlify/functions/audit-shared/` | 5 | Types, validation, storage, lead management |
| `docs/audit/` | 12 | Architecture, replication guide, implementation specs |
| **Total** | ~150 | Fully functional template with comprehensive documentation |

---

## Section 2: Config Schema Complete Reference

### Overview

The **complete configuration schema** is defined in `config.schema.ts`. All per-client customization flows through a single `config.json` file → TypeScript interface → generated files (`site.ts`, `client.ts`).

**Total Fields: 33 required + optional**

### 2.1 Company Identity (7 fields)

These fields define the client company's brand identity in reports, emails, and page headers.

| Field Name | Type | Required | Validation | Example Value | Where Used |
|------------|------|----------|-----------|---------------|-----------|
| `company.name` | string | **Yes** | Non-empty, 1-100 chars | "Acme Corp" | Reports, emails, page headings, meta tags |
| `company.legalName` | string | **Yes** | Non-empty, 1-200 chars | "Acme Corp s.r.o." | Contract signatures, invoices, legal docs |
| `company.description` | string | **Yes** | Non-empty, 1-300 chars | "AI-powered B2B lead gen for Czech manufacturers" | Meta description (search engines), email intros |
| `company.industry` | string | **Yes** | Non-empty, 1-100 chars | "SaaS", "Manufacturing", "E-commerce", "Services" | Benchmarking, report recommendations |
| `company.audience` | string | **Yes** | Non-empty, 1-100 chars | "B2B founders", "SME owners in Czech Republic" | CTA copy, email subject lines |
| `company.ico` | string | Optional | Regex: `^\d{6,8}$` (Czech format) | "12345678" | Legal/invoicing, audit reports |
| `company.dic` | string | Optional | Regex: `^CZ\d{8,10}$` (Czech VAT) | "CZ12345678" | Tax documents, invoices |

### 2.2 Domain & URL Configuration (3 fields)

These define the deployment URLs for reports and API CORS.

| Field Name | Type | Required | Validation | Example Value | Default | Where Used |
|------------|------|----------|-----------|---------------|---------|-----------|
| `domain.siteUrl` | string | **Yes** | Valid HTTPS URL, no trailing slash | "https://audit.acme.com" | (none) | CORS origin, report links, email URLs, meta canonicals |
| `domain.reportBaseUrl` | string | Optional | Valid URL | "https://audit.acme.com/report" | `${siteUrl}/report` | Report page redirect, email confirmation links |
| `domain.corsOrigin` | string | Optional | Valid URL | (for subdomain APIs) | `siteUrl` | Netlify Functions CORS headers, fetch origin validation |

### 2.3 Brand Identity (4 fields)

These control the visual appearance: colors, logo, favicon.

| Field Name | Type | Required | Validation | Example Value | Default | Where Used |
|------------|------|----------|-----------|---------------|---------|-----------|
| `branding.colorPrimary` | string | **Yes** | Hex color `^#([0-9a-fA-F]{3}\|[0-9a-fA-F]{6})$` | "#0ea5e9" (Sky Blue) | (none) | Buttons, headings, chart fills, Tailwind CSS tokens |
| `branding.colorAccent` | string | **Yes** | Hex color (3 or 6 digit) | "#f59e0b" (Amber) | (none) | Hover states, badges, CTA accents, email highlights |
| `branding.logoUrl` | string | **Yes** | Path or full URL | "/assets/images/logo.svg" or "https://cdn.acme.com/logo.svg" | (none) | Page header, report header, email signature |
| `branding.faviconUrl` | string | Optional | Path or URL | "/favicon.svg" | "/favicon.svg" | Browser tab, bookmarks |

**Implementation Detail:** Colors are embedded into `src/styles/global.css` as CSS custom properties:
```css
@theme {
  --color-brand-primary: var(--config-primary);
  --color-brand-accent: var(--config-accent);
}
```

### 2.4 Contact Information (7 fields)

Primary contact details shown in footer, email templates, and contact forms.

| Field Name | Type | Required | Validation | Example Value | Default | Where Used |
|------------|------|----------|-----------|---------------|---------|-----------|
| `contact.email` | string | **Yes** | Valid email `^[^\s@]+@[^\s@]+\.[^\s@]+$` | "contact@acme.com" | (none) | Page footer, email reply-to, contact forms |
| `contact.phone` | string | Optional | Format: `+420 123 456 789` | "+420 123 456 789" | (none) | Contact page, team member listings |
| `contact.street` | string | Optional | 1-100 chars | "Václavské náměstí 1" | (none) | Address block, contact form |
| `contact.city` | string | Optional | 1-50 chars | "Praha" | (none) | Address block, location badge |
| `contact.postalCode` | string | Optional | 1-20 chars (flexible) | "110 00" | (none) | Address block |
| `contact.country` | string | Optional | 1-50 chars | "Česká republika" | "Česká republika" | Address block, shipping info |
| `contact.mapsEmbedUrl` | string | Optional | Valid Google Maps embed URL | `https://www.google.com/maps/embed?pb=...` | (none) | Contact page iframe, location display |

### 2.5 Team Members (1 array, 5 fields per member)

Team members displayed in CTA sections, email signatures, and report footers.

**Array requirement:** At least 1 team member required.

| Field Name | Type | Required | Validation | Example Value | Where Used |
|------------|------|----------|-----------|---------------|-----------|
| `team[0].name` | string | **Yes** | Non-empty, 1-100 chars | "Jan Novák" | CTAs, email signature, report footer |
| `team[0].title` | string | **Yes** | Non-empty, 1-100 chars | "CEO & Growth Strategist" | CTAs, email signature |
| `team[0].email` | string | **Yes** | Valid email format | "jan@acme.com" | Email signature, contact button, direct message |
| `team[0].phone` | string | Optional | Format: `+420 987 654 321` | "+420 987 654 321" | Team member card, direct contact |
| `team[0].calendarUrl` | string | Optional | Valid booking URL | "https://cal.com/jan" (Calendly, Cal.com, etc.) | "Book a call" button in CTAs and emails |

**Multiple team members:**
```json
{
  "team": [
    { "name": "Jan Novák", "title": "CEO", "email": "jan@acme.com", "phone": "", "calendarUrl": "https://cal.com/jan" },
    { "name": "Marie Dvořáková", "title": "Head of Sales", "email": "marie@acme.com", "phone": "+420 123 456 789", "calendarUrl": "" }
  ]
}
```

### 2.6 Social Media Links (4 fields)

All optional. Provide full URLs including `https://`.

| Field Name | Type | Required | Validation | Example Value | Where Used |
|------------|------|----------|-----------|---------------|-----------|
| `social.linkedin` | string | Optional | Valid URL | "https://linkedin.com/company/acme-corp" | Page footer, social sharing, team bios |
| `social.instagram` | string | Optional | Valid URL | "https://instagram.com/acmecorp" | Page footer, social links |
| `social.facebook` | string | Optional | Valid URL | "https://facebook.com/acmecorp" | Page footer, social links |
| `social.googleReviews` | string | Optional | Valid URL | "https://maps.google.com/?cid=12345678" | Reviews section, trust badges |

### 2.7 Email Notifications (3 fields)

Configure who receives lead notifications and from which address.

| Field Name | Type | Required | Validation | Example Value | Where Used |
|------------|------|----------|-----------|---------------|-----------|
| `notifications.recipients` | array | **Yes** | Array of valid emails, min 1 | `["sales@acme.com", "jan@acme.com"]` | Team notification emails for new leads |
| `notifications.fromEmail` | string | **Yes** | Valid email + Resend verified | "noreply@mail.acme.com" | "From:" header in all outbound emails |
| `notifications.fromName` | string | **Yes** | 1-100 chars | "Acme Audit System" | Display name paired with fromEmail |

**Critical:** `fromEmail` must be a **sender address verified in your Resend account**. Unverified addresses will fail silently.

---

## Section 3: Two-Layer Config Architecture

### Design Rationale

The template uses a **two-layer configuration system** to balance security, maintainability, and type safety:

- **Layer 1 (Source of Truth):** `config.json` — committed to repo, human-readable
- **Layer 2 (Secrets Only):** `.env.local` — gitignored, never committed, 7 environment variables

**Why NOT placeholder tokens?** (e.g., `${COMPANY_NAME}`, `{@email}`)
- The codebase has 31K+ lines of TypeScript across 45 functions
- Placeholder tokens require string replacement at build time (fragile, regex-prone)
- Tokens would scatter across 150+ files (hard to track all usages)
- Missing token replacements fail silently or partially (user never knows)

**Why direct TypeScript imports?** (e.g., `import site from '../config/site.ts'`)
- Compiler catches missing/wrong fields at build time (compile errors vs. runtime errors)
- IDE autocomplete works for all config fields
- No string manipulation, no regex leakage
- Type-safe: `config.company.name` is guaranteed to exist and be a string

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TWO-LAYER CONFIG FLOW                        │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: SOURCE OF TRUTH (Repository)
┌──────────────────┐
│  config.json     │  ← Human-readable config
│  (committed)     │     33 fields, bilingual support
└────────┬─────────┘
         │
         │ [Build Time: /setup-audit skill generates]
         │
         ├──────────────────────────────────────────┐
         │                                          │
         ▼                                          ▼
    ┌─────────────────────────┐    ┌───────────────────────────┐
    │  src/config/site.ts     │    │  netlify/functions/       │
    │  (Frontend config)      │    │  _config/client.ts        │
    │                         │    │  (Backend config)         │
    │  Imports:              │    │                           │
    │  - company.name        │    │  Imports:                 │
    │  - company.description │    │  - all fields             │
    │  - branding colors     │    │  - domain.corsOrigin      │
    │  - social links        │    │  - notifications.fromEmail│
    │  - team info           │    │  - domain.reportBaseUrl   │
    │                         │    │                           │
    │  Used by:              │    │  Used by:                 │
    │  - audit.astro         │    │  - audit.ts               │
    │  - components/         │    │  - audit-background.ts    │
    │  - email templates     │    │  - admin-leads.ts         │
    │  - meta tags           │    │  - all functions          │
    └─────────────────────────┘    └───────────────────────────┘
         │                              │
         │ [Also generated at build]    │
         │                              │
         ▼                              │
    ┌──────────────────────────┐        │
    │  src/styles/global.css   │◀───────┘
    │  (CSS theme variables)   │
    │                          │
    │  @theme {               │
    │    --color-primary:      │
    │    --color-accent:       │
    │    --logo-url:           │
    │  }                       │
    │                          │
    │  Used by: Tailwind build │
    └──────────────────────────┘


LAYER 2: SECRETS (Environment)
┌─────────────────────────────┐
│  .env.local                 │  ← Gitignored, never committed
│  (secrets only)             │     7 API keys + passwords
│                             │
│  RESEND_API_KEY             │
│  TAVILY_API_KEY             │
│  OPENROUTER_API_KEY         │
│  FIRECRAWL_API_KEY          │  (optional)
│  NETLIFY_SITE_ID            │
│  NETLIFY_API_TOKEN          │
│  ADMIN_PASSWORD             │
└──────────────┬──────────────┘
               │
               │ [netlify env:import]
               │
               ▼
         ┌─────────────────┐
         │  Netlify Build  │
         │  Environment    │
         │                 │
         │  Functions      │
         │  access via:    │
         │  process.env.*  │
         └─────────────────┘


COMBINED: Build Process
┌───────────────────────────────────────┐
│  npm run build                        │
│                                       │
│  [1] Read config.json                 │
│  [2] Validate against schema          │
│  [3] Generate site.ts (frontend)      │
│  [4] Generate client.ts (backend)     │
│  [5] Update global.css (tokens)       │
│  [6] Build Astro site                 │
│  [7] Read .env.local                  │
│  [8] Import env vars to Netlify       │
│  [9] Deploy functions                 │
│                                       │
│  Result: Type-safe, validated config  │
│          across all layers            │
└───────────────────────────────────────┘
```

### Layer 1: config.json → Generated Files

**Inputs:**
- `config.json` — 33 fields from Section 2
- `config.schema.ts` — TypeScript interface + validation

**Outputs (auto-generated by `/setup-audit` skill):**
- `src/config/site.ts` — Frontend config (Astro pages, components)
- `netlify/functions/_config/client.ts` — Backend config (all functions)
- `src/styles/global.css` (updated) — CSS tokens for theme colors + logo

**Generation Process:**
```typescript
// /setup-audit skill:
import { validateConfig } from '../config.schema';
import rawConfig from '../config.json';

const config = rawConfig as AuditClientConfig;
const errors = validateConfig(config);

if (errors.length > 0) {
  throw new Error(`Config validation failed:\n${errors.map(e => e.message).join('\n')}`);
}

// [1] Generate site.ts (frontend)
const siteTs = `
export const site = ${JSON.stringify(config, null, 2)};
export type SiteConfig = typeof site;
`;
writeFileSync('src/config/site.ts', siteTs);

// [2] Generate client.ts (backend)
const clientTs = `
export const clientConfig = ${JSON.stringify(config, null, 2)};
export type ClientConfig = typeof clientConfig;
`;
writeFileSync('netlify/functions/_config/client.ts', clientTs);

// [3] Update global.css with tokens
const globalCss = fs.readFileSync('src/styles/global.css', 'utf-8');
const updatedCss = globalCss.replace(
  /@theme \{[\s\S]*?\}/,
  `@theme {
    --color-primary: ${config.branding.colorPrimary};
    --color-accent: ${config.branding.colorAccent};
    --logo-url: url('${config.branding.logoUrl}');
    --favicon-url: url('${config.branding.faviconUrl}');
  }`
);
writeFileSync('src/styles/global.css', updatedCss);
```

### Layer 2: .env.local → Netlify Environment

**Inputs:**
- `.env.local` — 7 secret API keys (gitignored)

**Outputs:**
- Netlify built-in environment (accessible via `process.env.*`)

**All 7 Environment Variables:**

| Variable | Required | Provider | Example | Where Used |
|----------|----------|----------|---------|-----------|
| `RESEND_API_KEY` | Yes | Resend | `re_xxx...` | All email sending (audit, contact, survey, pricing, onboarding) |
| `TAVILY_API_KEY` | Yes | Tavily | `tvly_xxx...` | Web search in LangGraph agent |
| `OPENROUTER_API_KEY` | Yes | OpenRouter | `sk-or-v1-xxx...` | LLM synthesis of research data |
| `FIRECRAWL_API_KEY` | No (optional) | Firecrawl | `fcrawl_xxx...` | Company branding extraction (graceful fallback if missing) |
| `NETLIFY_SITE_ID` | Yes | Netlify | `a1b2c3d4-e5f6...` | Blobs store authentication |
| `NETLIFY_API_TOKEN` | Yes | Netlify | `nflx_xxx...` | Blobs store authentication |
| `ADMIN_PASSWORD` | Yes | Custom | `MySecurePassword123!` | Admin dashboard access (`/admin/leads`) |

**Setup Command:**
```bash
netlify env:import .env.local
```

---

## Section 4: Setup Runbook (10 Steps)

This is a **sequential checklist** for configuring any new instance of the audit template from scratch.

### Prerequisites

Before starting, ensure:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 10+ installed (`npm --version`)
- [ ] Netlify CLI 15+ installed (`netlify --version`)
- [ ] Git 2.30+ installed (`git --version`)
- [ ] Netlify account created (free tier OK)
- [ ] All 7 API keys obtained (see Step 3)

### Step 1: Clone Template Repository

Clone the hype-audit-template from GitHub and install dependencies.

```bash
# Clone the template
git clone https://github.com/HypeDigitaly/hype-audit-template.git my-audit-instance
cd my-audit-instance/astro-src

# Install dependencies
npm install

# Verify build works (before customization)
npm run build
# Expected output: ✓ built in 1.5s, 0 TS errors
```

**Files Created:** All 150+ template files in `astro-src/`

**Verification:** No errors from `npm install` or `npm run build`

---

### Step 2: Run `/setup-audit` Skill (Interactive Configuration)

The `/setup-audit` skill is a custom Claude Code skill that guides you through collecting all 33 configuration values interactively. It validates each field and generates the config files.

```bash
# Activate the skill (from Claude Code context)
/setup-audit

# The skill will ask ~33 questions in this order:
# SECTION 1: Company Identity
#   - Company name (e.g., "Acme Corp")
#   - Legal name (e.g., "Acme Corp s.r.o.")
#   - Description
#   - Industry
#   - Target audience
#   - [Optional] IČO registration number
#   - [Optional] DIČ VAT number
#
# SECTION 2: Domain & URLs
#   - Site URL (e.g., "https://audit.acme.com")
#   - [Optional] Report base URL (auto-fills if left blank)
#   - [Optional] CORS origin (auto-fills if left blank)
#
# SECTION 3: Brand Identity
#   - Primary brand color (hex, e.g., "#0ea5e9")
#   - Accent color (hex, e.g., "#f59e0b")
#   - Logo URL (path or full URL)
#   - [Optional] Favicon URL (auto-fills to "/favicon.svg")
#
# SECTION 4: Contact Information
#   - Primary email
#   - [Optional] Phone
#   - [Optional] Street address
#   - [Optional] City
#   - [Optional] Postal code
#   - [Optional] Country (defaults to "Česká republika")
#   - [Optional] Google Maps embed URL
#
# SECTION 5: Team Members (at least 1)
#   - Team member 1 name
#   - Team member 1 title
#   - Team member 1 email
#   - [Optional] Team member 1 phone
#   - [Optional] Team member 1 calendar booking URL
#   - [Repeat for additional team members]
#
# SECTION 6: Social Media Links
#   - [Optional] LinkedIn company URL
#   - [Optional] Instagram profile URL
#   - [Optional] Facebook page URL
#   - [Optional] Google Maps reviews URL
#
# SECTION 7: Email Notification Settings
#   - Notification recipients (emails, at least 1)
#   - Verified sender email address (must be verified in Resend)
#   - Display name for sender

# After all questions, the skill will:
# [✓] Write config.json
# [✓] Generate src/config/site.ts
# [✓] Generate netlify/functions/_config/client.ts
# [✓] Update src/styles/global.css with theme colors
# [✓] Create .env.local template
```

**Output Files:**
- `config.json` — Human-readable config (Section 2 schema)
- `src/config/site.ts` — Auto-generated frontend config
- `netlify/functions/_config/client.ts` — Auto-generated backend config
- `src/styles/global.css` (updated) — CSS token colors
- `.env.local.template` — Template with empty API keys

**What the Skill Does:**
1. Validates each field against `config.schema.ts` regex patterns
2. Derives optional fields (reportBaseUrl, corsOrigin, faviconUrl, country)
3. Generates TypeScript config files with `JSON.stringify()`
4. Updates Tailwind CSS token colors
5. Creates `.env.local` template with placeholders

**Validation Rules Applied:**
- Email: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- IČO: `^\d{6,8}$` (6-8 digits)
- DIČ: `^CZ\d{8,10}$` (CZ prefix + 8-10 digits)
- Hex color: `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$` (3 or 6 digit hex)
- URL: Valid HTTPS, no trailing slash
- Team: At least 1 member required
- Recipients: At least 1 email required

---

### Step 3: Populate Environment Variables

The `/setup-audit` skill creates `.env.local.template`. Copy it to `.env.local` and fill in all 7 API keys.

```bash
# Copy template
cp .env.local.template .env.local

# Edit in your editor
# nano .env.local  (or use VS Code, etc.)
```

**Fill in all 7 values:**

| Variable | How to Get | Action |
|----------|-----------|--------|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | Create new API key → Copy to .env.local |
| `TAVILY_API_KEY` | [tavily.com/sign-in](https://tavily.com/sign-in) | Login → API Keys section → Copy |
| `OPENROUTER_API_KEY` | [openrouter.ai/keys](https://openrouter.ai/keys) | Create API key → Copy |
| `FIRECRAWL_API_KEY` | [firecrawl.dev](https://firecrawl.dev) | (Optional) Create API key → Copy. Leave blank if not needed. |
| `NETLIFY_SITE_ID` | Step 8 (below) | Create Netlify site → Copy ID from settings |
| `NETLIFY_API_TOKEN` | [app.netlify.com/user/applications](https://app.netlify.com/user/applications) | Create personal access token → Copy |
| `ADMIN_PASSWORD` | You choose | Create strong password (used for `/admin/leads` access) |

**Example .env.local:**
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TAVILY_API_KEY=tvly_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FIRECRAWL_API_KEY=fcrawl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NETLIFY_SITE_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890
NETLIFY_API_TOKEN=nflx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_PASSWORD=MySecurePassword123!
```

**Verification:**
```bash
# Check file is created
cat .env.local

# Check all 7 variables are set
grep -c "^[A-Z]" .env.local  # Should output: 7
```

**Security Reminder:**
- `.env.local` is in `.gitignore` — **never commit this file**
- Store API keys in Netlify UI or password manager
- Rotate keys periodically (especially ADMIN_PASSWORD)

---

### Step 4: Update Brand Assets (Logo & Favicon)

Replace the placeholder logo and favicon with your client's branding.

```bash
# Logo file (referenced in config.branding.logoUrl)
# Copy your logo to: astro-src/public/assets/images/logo.svg
cp /path/to/your/logo.svg public/assets/images/logo.svg

# Favicon file (referenced in config.branding.faviconUrl)
# Copy your favicon to: astro-src/public/favicon.svg
cp /path/to/your/favicon.svg public/favicon.svg
```

**Format Requirements:**

| Asset | Format | Size | Location |
|-------|--------|------|----------|
| Logo | SVG (preferred) or PNG/WebP | 200-400px width, transparent bg | `public/assets/images/logo.svg` |
| Favicon | SVG (preferred) or ICO/PNG | 16x16 - 512x512 (modern) | `public/favicon.svg` |

**CSS Tokens Updated:**
- Logo URL: embedded in `src/styles/global.css` as CSS custom property
- Colors: primary & accent hex colors embedded in Tailwind config
- (No manual CSS edits needed — automated by `/setup-audit`)

---

### Step 5: Verify Local Build

Run a full build to ensure all config files are valid and TypeScript compiles.

```bash
# From astro-src/
npm run build

# Expected output:
# ✓ Checked 0 errors (TypeScript)
# ✓ Built 45 pages in 1.5s
# ✓ Functions copied
# ✓ No warnings

# Check for any red flags:
# - "Cannot find module" = config files not generated (rerun /setup-audit)
# - "TS error" = type mismatch in config (validate config.json)
# - "Build failed" = misconfigured colors/URLs (check config values)
```

**Verification Checklist:**
- [ ] No TypeScript errors (0 errors)
- [ ] Build completes in <2 seconds
- [ ] All 45 pages built
- [ ] Functions copied to `.netlify/functions/`
- [ ] `src/config/site.ts` is readable (not empty)
- [ ] `netlify/functions/_config/client.ts` is readable

**Troubleshooting:**

| Error | Cause | Fix |
|-------|-------|-----|
| "Cannot find module src/config/site.ts" | `/setup-audit` didn't run successfully | Re-run `/setup-audit` skill, check for validation errors |
| "Invalid hex color" | Color format wrong in config.json | Check branding.colorPrimary/colorAccent — must be `#RGB` or `#RRGGBB` |
| "TS error: Property 'company' does not exist" | config.json missing top-level keys | Check config.json structure matches Section 2 schema |
| "Build failed: Cannot read property 'name' of undefined" | config.company.name is empty | Fill all required fields in config.json |

---

### Step 6: Local Development Test

Start the local development server and test the audit form manually.

```bash
# From astro-src/
npm run dev

# Output:
# ┌─────────────────────────────────────────┐
# │  Local:    http://localhost:3000/       │
# │  Audit:    http://localhost:3000/audit  │
# │  Admin:    http://localhost:3000/admin/leads
# └─────────────────────────────────────────┘

# Test the audit form:
# [1] Navigate to http://localhost:3000/audit
# [2] Fill in all form fields (use test data)
# [3] Click "Send Audit Request"
# [4] Check console for errors
# [5] Watch for success/error message

# Test admin dashboard:
# [1] Navigate to http://localhost:3000/admin/leads
# [2] Enter the ADMIN_PASSWORD from .env.local
# [3] Should see leads from local Blobs store
```

**Expected Behavior:**
- Audit form validates fields in real-time
- Form submission shows loading state
- Success message appears after 30-60 seconds (or polling status)
- Report link is sent via email (check Resend dashboard)
- Admin dashboard shows new lead in the list

**Note on Local Development:**
- Netlify Functions run via `netlify dev` (not Node directly)
- Blobs store data locally in `.netlify/blobs/` (not production)
- Email sends via Resend API (real emails, uses your API key)
- No LangGraph agent runs locally (requires Tavily + OpenRouter keys)

---

### Step 7: Create Netlify Site

Create a new Netlify site and link it to the Git repository.

```bash
# Option A: Via Netlify UI (Recommended)
# [1] Login to app.netlify.com
# [2] Click "Add new site" → "Import an existing project"
# [3] Choose "GitHub" (or GitLab/Bitbucket)
# [4] Authorize Netlify to access your repo
# [5] Select the repository
# [6] Build settings:
#     Branch to deploy: main
#     Base directory: astro-src
#     Build command: npm run build
#     Publish directory: dist
# [7] Click "Deploy site"

# Option B: Via Netlify CLI
netlify sites:create --name=my-audit-instance
# Follow prompts to connect Git repo

# Verify site created:
netlify status
# Output should show: Site name, Site ID, Site URL
```

**Netlify Site Settings (after creation):**
- **Base directory:** `astro-src` (functions + pages are in this dir)
- **Build command:** `npm run build`
- **Publish directory:** `dist` (generated by Astro)
- **Functions directory:** `netlify/functions` (auto-detected)
- **Node version:** 18 (default or explicit in runtime.txt)

**Copy NETLIFY_SITE_ID:**
```bash
# From Netlify UI:
# Settings → General → Site ID (looks like: a1b2c3d4-e5f6-7890)

# Or via CLI:
netlify status | grep "Site ID"
```

**Update .env.local:**
```bash
# From Step 3, fill in NETLIFY_SITE_ID if not already done
echo "NETLIFY_SITE_ID=YOUR_SITE_ID" >> .env.local
```

---

### Step 8: Import Environment Variables

Push all 7 environment variables from `.env.local` to Netlify's built-in environment.

```bash
# From astro-src/
netlify env:import .env.local

# Output:
# Imported 7 environment variables

# Verify variables imported:
netlify env:list

# Output should show all 7 variables (values hidden for security):
# RESEND_API_KEY ••••••••••
# TAVILY_API_KEY ••••••••••
# OPENROUTER_API_KEY ••••••••••
# FIRECRAWL_API_KEY ••••••••••
# NETLIFY_SITE_ID ••••••••••
# NETLIFY_API_TOKEN ••••••••••
# ADMIN_PASSWORD ••••••••••
```

**Verification:**
- [ ] All 7 variables listed with `netlify env:list`
- [ ] No warnings or errors
- [ ] Variables are available in all function environments

**Troubleshooting:**
```bash
# If import fails:
netlify logout && netlify login  # Re-authenticate
netlify env:import .env.local    # Retry

# If variable missing:
netlify env:set MISSING_VAR value  # Set individually
```

---

### Step 9: Deploy and Verify

Deploy the site to Netlify and verify all functions work in production.

```bash
# Option A: Deploy via Git push (automatic)
git add -A
git commit -m "Configure audit template for Acme Corp"
git push origin main

# Netlify will automatically:
# [1] Detect push to main branch
# [2] Run npm run build in astro-src/
# [3] Deploy dist/ to Netlify CDN
# [4] Deploy functions to Netlify Functions
# [5] Show build log at app.netlify.com

# Option B: Deploy manually via CLI
netlify deploy --prod

# Verify deployment:
# [1] Check app.netlify.com → Deployments
# [2] Status should be "Published"
# [3] Click site URL to verify pages load
```

**Deployment Checklist:**

| Item | Status | How to Verify |
|------|--------|---------------|
| Build successful | ✓ | "Published" status in Netlify UI |
| Functions deployed | ✓ | `netlify functions:list` shows 12+ functions |
| Environment vars set | ✓ | `netlify env:list` shows all 7 vars |
| Blobs store created | ✓ | (Auto-created on first function call) |
| Site accessible | ✓ | https://your-site.netlify.app loads |
| Audit form loads | ✓ | https://your-site.netlify.app/audit (no 404) |
| Admin dashboard loads | ✓ | https://your-site.netlify.app/admin/leads (no 404) |

**Post-Deployment Tests:**

```bash
# Test audit form (production)
curl -X POST https://your-site.netlify.app/.netlify/functions/audit-validate \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "website": "https://example.com", "companyName": "Test Co", "city": "Prague", "language": "cs"}'
# Expected: { "valid": true } or { "errors": [...] }

# Test admin authentication
curl https://your-site.netlify.app/.netlify/functions/admin-leads \
  -H "Authorization: Bearer YOUR_ADMIN_PASSWORD"
# Expected: JSON array of leads (or [])

# Test report storage (after first audit)
curl https://your-site.netlify.app/report/abc-123
# Expected: HTML report page (or 404 if no audits yet)
```

---

### Step 10: Human Review Checkpoint & Go-Live

Before sending the audit form to users, review all configurations and test end-to-end.

**Final Verification Checklist:**

| Check | Who | Action | ✓ |
|-------|-----|--------|---|
| **Company Info** | Product | Verify company name, description in audit page header | |
| **Brand Colors** | Design | Verify primary/accent colors appear on buttons, badges, charts | |
| **Logo & Favicon** | Design | Verify logo appears in header, favicon in browser tab | |
| **Email Sender** | Ops | Verify "From:" name/email in Resend test (matches config) | |
| **Team Info** | Sales | Verify team members appear in CTA sections + email signature | |
| **Admin Password** | Security | Change ADMIN_PASSWORD from /setup-audit temp value | |
| **CNAME / DNS** | DevOps | (Optional) Verify custom domain DNS points to Netlify | |
| **Form Submission** | QA | Submit test audit, verify report generates + email sent | |
| **Report Quality** | Product | Review generated report: logo, sections, recommendations | |
| **Admin Dashboard** | Ops | Login to admin dashboard, verify leads display correctly | |
| **SSL Certificate** | DevOps | Verify https:// works (Netlify auto-generates) | |
| **CSP Headers** | Security | Verify no console errors in browser (CSP policies check) | |

**Go-Live Steps:**

1. **Share Audit Form URL** with sales team
   - URL: `https://your-site.netlify.app/audit`
   - Share in email, website, LinkedIn, ads

2. **Monitor First Leads** (first 24 hours)
   - Check admin dashboard for new submissions
   - Verify emails arrive to team inbox
   - Test report links work

3. **Set Up Lead Routing** (optional)
   - Configure Zapier/Make.com webhook to forward leads
   - Integrate with CRM (HubSpot, Pipedrive, etc.)
   - Set up auto-follow-up sequences

4. **Track Metrics** (ongoing)
   - Monitor Netlify Functions usage (cost)
   - Track audit completion rate
   - Monitor email delivery (Resend dashboard)
   - Check Tavily/OpenRouter API usage

---

## Summary: Configuration Complete

After completing all 10 steps, your audit template is fully configured and ready for production.

**Key Deliverables:**
- [x] `config.json` — Single source of truth (33 fields)
- [x] `src/config/site.ts` — Frontend config (auto-generated, type-safe)
- [x] `netlify/functions/_config/client.ts` — Backend config (auto-generated, type-safe)
- [x] `.env.local` — Secrets (7 API keys, gitignored)
- [x] `src/styles/global.css` — Brand colors (auto-generated)
- [x] `public/assets/images/logo.svg` — Company logo
- [x] `public/favicon.svg` — Company favicon
- [x] Netlify site created, functions deployed, environment vars set
- [x] End-to-end tested (audit form → report → email)

**Next Steps:**
- Sections 5-8 of this PRD cover: Data Models, API Endpoints, Email Templates, Deployment & Monitoring
- See `docs/audit/01-architecture.md` for system architecture overview
- See `docs/audit/12-replication-guide.md` for complete rebuild from scratch

---

---

## Section 5: File Modification Map

This section provides a complete inventory of all files in the template and categorizes them by modification requirements during setup.

### 5.1 VERBATIM Files (No Changes Needed)

These files ship as-is to every client without modification. They contain no hardcoded values specific to HypeDigitaly.

**LangGraph AI Research Agent (14 files)**
- `netlify/functions/audit-services/langgraph-agent.ts` — Main agent orchestrator
- `netlify/functions/audit-services/langgraph/task-executor.ts` — Parallel task runner
- `netlify/functions/audit-services/langgraph/query-generator.ts` — Web search query formatter
- `netlify/functions/audit-services/langgraph/llm-synthesizer.ts` — OpenRouter LLM synthesis
- `netlify/functions/audit-services/langgraph/micro-niches.ts` — Industry micro-niche detector
- `netlify/functions/audit-services/langgraph/niche-examples.ts` — Niche example generator
- `netlify/functions/audit-services/langgraph/pain-point-analyzer.ts` — Customer pain point analyzer
- `netlify/functions/audit-services/langgraph/industry-recommendations.ts` — Industry-specific recommendations
- `netlify/functions/audit-services/langgraph/value-proposition-templates.ts` — Value proposition generator
- `netlify/functions/audit-services/langgraph/fallback-report.ts` — Fallback report when API fails
- `netlify/functions/audit-services/branding-fetcher.ts` — Firecrawl branding extraction
- `netlify/functions/audit-services/ai-field-validator.ts` — Form field AI validation
- `netlify/functions/audit-services/openrouter-analysis.ts` — OpenRouter API integration
- (Generic exports and types for LangGraph)

**Audit Services Shared Layer (5 files)**
- `netlify/functions/audit-shared/validation.ts` — Form validation rules
- `netlify/functions/audit-shared/index.ts` — Shared exports
- `netlify/functions/audit-shared/types.ts` — Core TypeScript types (contains "HypeDigitaly" in comments/docs only, not in functional code)
- `netlify/functions/audit-shared/lead-management.ts` — Lead storage and retrieval logic
- `netlify/functions/audit-shared/blob-helpers.ts` — Netlify Blobs CRUD helpers

**PDF & HTML Report Generator (18 files)**
- `netlify/functions/audit-services/pdf-generator/generator.ts` — PDF conversion logic
- `netlify/functions/audit-services/pdf-generator/helpers.ts` — PDF utility functions (contains HypeDigitaly branding color #00A39A in comments only)
- `netlify/functions/audit-services/pdf-generator/styles.ts` — PDF CSS styling
- `netlify/functions/audit-services/html-report/generator.ts` — HTML report orchestrator
- `netlify/functions/audit-services/html-report/utils.ts` — HTML utility functions (contains #00A39A in CSS comments only)
- `netlify/functions/audit-services/html-report/styles.ts` — HTML report CSS
- `netlify/functions/audit-services/html-report/scripts.ts` — HTML report inline JavaScript
- `netlify/functions/audit-services/html-report/sections/` (12 files) — Individual report sections
  - `header.ts` — Report header (contains "HypeDigitaly" in comments only)
  - `executive-summary.ts` — Executive summary section
  - `company-profile.ts` — Company profile section
  - `market-analysis.ts` — Market analysis section
  - `recommendations.ts` — Recommendations matrix
  - `roi-analysis.ts` — ROI calculation section
  - `timeline.ts` — Implementation timeline (contains "HypeDigitaly" in comments only)
  - `risks.ts` — Risk assessment section
  - `cta.ts` — Call-to-action section (imported from config)
  - `glossary.ts` — AI glossary (monolith, ~2000 terms)
  - `directory.ts` — Useful resources directory

**Config Files (TypeScript) — Auto-generated**
- `src/config/site.ts` — Frontend config (GENERATED by `/setup-audit`)
- `netlify/functions/_config/client.ts` — Backend config (GENERATED by `/setup-audit`)

**Netlify Functions (Backend) — No Hardcoded Values**
- `netlify/functions/audit.ts` — Form submission handler
- `netlify/functions/audit-background.ts` — 15-minute async handler
- `netlify/functions/audit-validate.ts` — Field validation endpoint
- `netlify/functions/audit-status.ts` — Job status polling
- `netlify/functions/audit-report.ts` — Report retrieval
- `netlify/functions/admin-leads.ts` — Admin dashboard data (uses `clientConfig`)
- `netlify/functions/admin-leads-delete.ts` — Bulk lead deletion
- `netlify/functions/contact.ts` — Contact form handler (uses `clientConfig`)
- `netlify/functions/survey.ts` — Survey form handler (uses `clientConfig`)
- `netlify/functions/pricing-lead.ts` — Pricing form handler (uses `clientConfig`)
- `netlify/functions/onboarding.ts` — Onboarding lead handler (uses `clientConfig`)
- `netlify/functions/ares-lookup.ts` — Czech business registry lookup

**Astro Pages — No Hardcoded Values**
- `src/pages/audit.astro` — Main audit form page (reads from `site`)
- `src/pages/admin/leads.astro` — Admin dashboard (reads from `site`)
- `src/pages/index.astro` — Home page (if present, reads from `site`)

**Privacy Policy & Legal**
- `src/pages/privacy-policy.astro` — CONTAINS HARDCODED EMAIL: `info@hypedigitaly.ai` (see Section 6)

**UI Components (No Config)**
- `src/components/ui/` — All UI components (buttons, cards, forms, etc.)
- `src/components/navigation/` — Nav, header, mobile menu (reads company name from `site`)
- `src/components/sections/AuditRoadmapAnimated.astro` — Animated roadmap (VERBATIM — no hardcoded values)

**Styling & Assets**
- `src/styles/global.css` — GENERATED by `/setup-audit` with CSS tokens
- `src/styles/cookie-consent.css` — VERBATIM
- `src/styles/tokens.css` — VERBATIM theme tokens
- `public/favicon.svg` — Updated by `/setup-audit`
- `public/assets/images/logo.svg` — Updated by `/setup-audit`

---

### 5.2 PARAMETERIZE Files (Require Config Imports)

These files contain hardcoded values specific to HypeDigitaly and must be updated during setup. **THE `/setup-audit` SKILL MUST HANDLE THESE AUTOMATICALLY.**

| File Path | Hardcoded Values | Replacement(s) | Config Key(s) |
|-----------|------------------|-----------------|----------------|
| `src/components/sections/Footer.astro` | LinkedIn: `hypedigitaly`; Instagram: `hypedigitaly_ai`; Facebook: `HypeDigitalyAI`; Company: `HypeDigitaly s.r.o.`; Address (4 fields); IČO: `17665655`; DIČ: `CZ17665655`; Pavel Čermák (name, email, phone); Miroslava Čermáková (name, email, phone); Cal.com URL: `hypedigitaly-pavelcermak/30-min-online`; Maps embed URL | `clientConfig.social.linkedin`, `clientConfig.social.instagram`, `clientConfig.social.facebook`, `clientConfig.company.name`, `clientConfig.contact.street`, `.city`, `.postalCode`, `.country`, `clientConfig.company.ico`, `clientConfig.company.dic`, `clientConfig.team[0].name`, `.team[0].email`, `.team[0].phone`, `.team[1].*`, `.team[0].calendarUrl`, `clientConfig.contact.mapsEmbedUrl` | Multiple |
| `src/pages/privacy-policy.astro` | Email: `info@hypedigitaly.ai`; Social links (Facebook, Instagram, LinkedIn, YouTube) with HypeDigitaly handles | `clientConfig.contact.email`, `clientConfig.social.*` | Multiple |
| `netlify/functions/email-templates.ts` | Logo URL: `https://hypedigitaly.ai/assets/images/HD_Color_white.png`; Company name & URL: `hypedigitaly.ai`; Cal.com URL: `https://cal.com/hypedigitaly-pavelcermak/30-min-online`; Blog URL: `https://hypedigitaly.ai/blog/pripadova-studie-5-kraju-cr`; LinkedIn: `https://linkedin.com/company/hypedigitaly`; Instagram: `https://www.instagram.com/hypedigitaly_ai/`; YouTube: `https://www.youtube.com/@PavelCermakAI`; Brand color: `#00A39A` | `clientConfig.branding.logoUrl`, `clientConfig.domain.siteUrl`, `clientConfig.team[0].calendarUrl`, `clientConfig.social.linkedin`, `clientConfig.social.instagram`, (YouTube/blog links: PENDING manual post-setup), `clientConfig.branding.colorPrimary` | Multiple |
| `netlify/functions/audit-templates.ts` | Cal.com URL: `https://cal.com/hypedigitaly-pavelcermak/30-min-online` | `clientConfig.team[0].calendarUrl` | Multiple |
| `src/scripts/translations/legal.ts` | Hardcoded references to `HypeDigitaly` branding in Czech legal text | Should be parameterized in future versions; currently template-locked | TBD |

**Total Parameterize Files: 5 critical files**
- 3 require immediate /setup-audit automation: Footer.astro, privacy-policy.astro, email-templates.ts
- 1 requires light automation: audit-templates.ts
- 1 requires future translation parameterization: translations/legal.ts

---

### 5.3 EXCLUDE Files (Not in Template)

These features are explicitly excluded from the hype-audit-template and should not be packaged:

| Feature | File(s) | Reason |
|---------|---------|--------|
| Blog / Content Hub | `src/pages/blog/*`, `src/content/blog/*` | Out of scope. Template focuses on B2B lead generation. Blog can be added as separate Astro collection post-setup. |
| E-commerce / Pricing Catalog | `src/pages/products/*`, `src/pages/pricing-page/*` | Out of scope. Pricing form handler exists (`pricing-lead.ts`), but no product listing UI. |
| Custom CRM Integration | `netlify/functions/crm-*` | Out of scope. Zapier/Make.com webhooks can be added via custom functions post-setup. |
| SMS Notifications | `netlify/functions/sms-*` | Out of scope. Email-only template. Twilio integration can be added post-setup. |
| Video Hosting | `src/pages/videos/*` | Out of scope. Links to external YouTube videos only. |
| Multi-tenant Admin | `netlify/functions/admin/orgs/*` | Out of scope. Single-client per Netlify site. |
| i18n Beyond Czech/English | `src/locales/ru.json`, `src/locales/pl.json` | Partial support only. Czech + English hardcoded. Russian/Polish requires additional translation strings. |
| Mobile App | `src/mobile/*`, `src/native/*` | Out of scope. Web-only platform. |

---

## Section 6: Hardcoded Values Registry

**THE DEFINITIVE FIND-AND-REPLACE REFERENCE.**

This section lists every hardcoded value found in the template source code. The `/setup-audit` skill **MUST** automate replacing all **PARAMETERIZE** values (marked with ⚠️).

### 6.1 Domain & Website URLs

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:68` | `mailto:info@hypedigitaly.ai` | `mailto:${clientConfig.contact.email}` | Email link | Contact form |
| `src/components/sections/Footer.astro:70` | `info@hypedigitaly.ai` | `${clientConfig.contact.email}` | Email display | Contact fallback |
| `src/components/sections/Footer.astro:76` | `https://linkedin.com/company/hypedigitaly` | `${clientConfig.social.linkedin}` | Social link | Footer social |
| `src/components/sections/Footer.astro:179` | `https://www.instagram.com/hypedigitaly_ai/` | `${clientConfig.social.instagram}` | Social link | Footer social |
| `src/components/sections/Footer.astro:182` | `https://www.facebook.com/HypeDigitalyAI/` | `${clientConfig.social.facebook}` | Social link | Footer social |
| `src/pages/privacy-policy.astro:55` | `info@hypedigitaly.ai` | `${clientConfig.contact.email}` | Email display | Privacy policy |
| `src/pages/privacy-policy.astro:325` | `https://www.facebook.com/HypeDigitalyAI` | `${clientConfig.social.facebook}` | Social link | Privacy table |
| `src/pages/privacy-policy.astro:325` | `https://www.instagram.com/hypedigitaly_ai/` | `${clientConfig.social.instagram}` | Social link | Privacy table |
| `src/pages/privacy-policy.astro:325` | `https://www.linkedin.com/in/cermakai/` | (PENDING) | Social link | Privacy table |
| `src/pages/privacy-policy.astro:325` | `https://www.youtube.com/@HypeDigitalyAI` | (PENDING) | Social link | Privacy table |

### 6.2 Company Name & Legal Identity

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:170` | `HypeDigitaly` (in img alt) | `${clientConfig.company.name}` | Alt text | Logo accessibility |
| `src/components/sections/Footer.astro:193` | `HypeDigitaly s.r.o.` | `${clientConfig.company.legalName}` | Legal name | Address block |
| `src/components/sections/Footer.astro:196` | `Velká Hradební` | `${clientConfig.contact.street}` | Street address | Address block |
| `src/components/sections/Footer.astro:199` | `2800/54` | (DERIVE from street) | House number | Address block |
| `src/components/sections/Footer.astro:202` | `400 01` | `${clientConfig.contact.postalCode}` | Postal code | Address block |
| `src/components/sections/Footer.astro:205` | `Ústí nad Labem` | `${clientConfig.contact.city}` | City | Address block |
| `src/components/sections/Footer.astro:208` | Czech | `${clientConfig.contact.country}` | Country | Address block |
| `src/components/sections/Footer.astro:214` | `17665655` | `${clientConfig.company.ico}` | IČO number | Company info |
| `src/components/sections/Footer.astro:218` | `CZ17665655` | `${clientConfig.company.dic}` | DIČ number | Company info |
| `src/components/sections/Footer.astro:284` | `© 2025 HypeDigitaly s.r.o.` | `` © YYYY ${clientConfig.company.legalName}`` | Copyright | Footer |

### 6.3 Team Members (Names, Emails, Phones, Calendar URLs)

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:225` | `Pavel Čermák` | `${clientConfig.team[0].name}` | Name | Team section |
| `src/components/sections/Footer.astro:226` | (title from translation) | `${clientConfig.team[0].title}` | Title | Team section |
| `src/components/sections/Footer.astro:228` | `mailto:pavelcermak@hypedigitaly.ai` | `mailto:${clientConfig.team[0].email}` | Email link | Team card |
| `src/components/sections/Footer.astro:230` | `pavelcermak@hypedigitaly.ai` | `${clientConfig.team[0].email}` | Email display | Team card |
| `src/components/sections/Footer.astro:232` | `+420774996248` | `${clientConfig.team[0].phone}` | Phone | Team card |
| `src/components/sections/Footer.astro:239` | `Miroslava Čermáková` | `${clientConfig.team[1]?.name}` | Name | Team section |
| `src/components/sections/Footer.astro:240` | (title) | `${clientConfig.team[1]?.title}` | Title | Team section |
| `src/components/sections/Footer.astro:242` | `mailto:cermakova@hypedigitaly.ai` | `mailto:${clientConfig.team[1]?.email}` | Email link | Team card |
| `src/components/sections/Footer.astro:244` | `cermakova@hypedigitaly.ai` | `${clientConfig.team[1]?.email}` | Email display | Team card |
| `src/components/sections/Footer.astro:246` | `+420775197255` | `${clientConfig.team[1]?.phone}` | Phone | Team card |
| `src/components/sections/Footer.astro:148` | `hypedigitaly-pavelcermak/30-min-online` | `${extractCalLink(clientConfig.team[0].calendarUrl)}` | Cal.com link | Calendar widget |
| `src/components/sections/Footer.astro:150` | `#00A39A` | `${clientConfig.branding.colorPrimary}` | Brand color | Calendar widget |

### 6.4 Email Templates (HTML)

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `netlify/functions/email-templates.ts:163` | `https://hypedigitaly.ai/assets/images/HD_Color_white.png` | `${clientConfig.branding.logoUrl}` | Logo URL | Email header |
| `netlify/functions/email-templates.ts:168` | `hypedigitaly.ai` | `${extractDomain(clientConfig.domain.siteUrl)}` | Domain | Email footer |
| `netlify/functions/email-templates.ts:315` | `HypeDigitaly s.r.o.` + `https://hypedigitaly.ai` | `${clientConfig.company.legalName}` + `${clientConfig.domain.siteUrl}` | Company | Email footer |
| `netlify/functions/email-templates.ts:433` | `https://hypedigitaly.ai/assets/images/HD_Color_white.png` | `${clientConfig.branding.logoUrl}` | Logo URL | Email header |
| `netlify/functions/email-templates.ts:467` | `https://cal.com/hypedigitaly-pavelcermak/30-min-online` | `${clientConfig.team[0].calendarUrl}` | Calendar link | Email CTA |
| `netlify/functions/email-templates.ts:468` | `#00A39A` | `${clientConfig.branding.colorPrimary}` | Brand color | Button style |
| `netlify/functions/email-templates.ts:496` | `https://hypedigitaly.ai/blog/pripadova-studie-5-kraju-cr` | (PENDING — Manual post-setup) | Blog link | Email content |
| `netlify/functions/email-templates.ts:536` | `https://linkedin.com/company/hypedigitaly` | `${clientConfig.social.linkedin}` | Social link | Email footer |
| `netlify/functions/email-templates.ts:541` | `https://www.instagram.com/hypedigitaly_ai/` | `${clientConfig.social.instagram}` | Social link | Email footer |
| `netlify/functions/email-templates.ts:545` | `https://www.facebook.com/HypeDigitalyAI/` | `${clientConfig.social.facebook}` | Social link | Email footer |
| `netlify/functions/email-templates.ts:550` | `https://www.youtube.com/@PavelCermakAI` | (PENDING) | Social link | Email footer |
| `netlify/functions/email-templates.ts:564` | `HypeDigitaly s.r.o.` + `https://hypedigitaly.ai` | `${clientConfig.company.legalName}` + `${clientConfig.domain.siteUrl}` | Company | Email footer |

### 6.5 Calendar Links (Cal.com)

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `netlify/functions/audit-templates.ts:170` | `https://cal.com/hypedigitaly-pavelcermak/30-min-online` | `${clientConfig.team[0].calendarUrl}` | Calendar link | Audit report CTA |
| `netlify/functions/email-templates.ts:467,598,633` | `https://cal.com/hypedigitaly-pavelcermak/30-min-online` (3x) | `${clientConfig.team[0].calendarUrl}` | Calendar link | Email CTA (3 places) |
| `src/components/sections/Footer.astro:148` | `hypedigitaly-pavelcermak/30-min-online` | (EXTRACT from calendarUrl) | Cal.com path | Calendar widget |

### 6.6 Brand Colors (CSS Hex)

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:150` | `#00A39A` | `${clientConfig.branding.colorPrimary}` | Accent color | Calendar widget |
| `netlify/functions/email-templates.ts:162` | `rgba(0,163,154,0.3)` (teal, derived from #00A39A) | Dynamic from `clientConfig.branding.colorPrimary` | Border color | Email template |
| `netlify/functions/email-templates.ts:468,500` | `#00A39A` (2x) | `${clientConfig.branding.colorPrimary}` | Button color | Email CTA |

### 6.7 Maps Embed URL

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:307` | `https://www.google.com/maps/embed?pb=...HypeDigitaly...` | `${clientConfig.contact.mapsEmbedUrl}` | Maps iframe | Footer map |

### 6.8 Logo URL

| File | Hardcoded Value | Replacement | Type | Impact |
|------|-----------------|-------------|------|--------|
| `src/components/sections/Footer.astro:170` | `/assets/images/logo.png` | `${site.logoUrl}` (from site.ts) | Logo path | Footer logo |
| `netlify/functions/email-templates.ts:163,433` | `https://hypedigitaly.ai/assets/images/HD_Color_white.png` | `${clientConfig.branding.logoUrl}` | Logo URL | Email headers (2x) |

### 6.9 Social Media Links — Complete Matrix

| Platform | File | Hardcoded Value | Replacement | Config Key |
|----------|------|-----------------|-------------|-----------|
| **LinkedIn** | Footer.astro:76 | `hypedigitaly` | `${social.linkedin}` | `clientConfig.social.linkedin` |
| **LinkedIn** | privacy-policy.astro:325 | `cermakai/` | (PENDING) | TBD |
| **LinkedIn** | email-templates.ts:536 | `hypedigitaly` | `${social.linkedin}` | `clientConfig.social.linkedin` |
| **Instagram** | Footer.astro:179 | `hypedigitaly_ai` | `${social.instagram}` | `clientConfig.social.instagram` |
| **Instagram** | privacy-policy.astro:325 | `hypedigitaly_ai/` | `${social.instagram}` | `clientConfig.social.instagram` |
| **Instagram** | email-templates.ts:541 | `hypedigitaly_ai/` | `${social.instagram}` | `clientConfig.social.instagram` |
| **Facebook** | Footer.astro:182 | `HypeDigitalyAI` | `${social.facebook}` | `clientConfig.social.facebook` |
| **Facebook** | privacy-policy.astro:325 | `HypeDigitalyAI` | `${social.facebook}` | `clientConfig.social.facebook` |
| **Facebook** | email-templates.ts:545 | `HypeDigitalyAI/` | `${social.facebook}` | `clientConfig.social.facebook` |
| **YouTube** | privacy-policy.astro:325 | `HypeDigitalyAI` | (PENDING) | TBD |
| **YouTube** | email-templates.ts:550` | `PavelCermakAI` | (PENDING) | TBD |

---

## Section 7: Verification Checklist

After completing setup with the `/setup-audit` skill and deploying to Netlify, run this **20+ item verification checklist** to confirm the template is correctly configured.

### Pre-Deployment Verification (Local)

| # | Check | Command / Method | Expected Result | Status |
|---|-------|-----------------|-----------------|--------|
| 1 | Config file exists | `cat config.json` | Valid JSON with all 33 fields | [ ] |
| 2 | Config validates | `npm run validate-config` (via /setup-audit) | 0 errors, no warnings | [ ] |
| 3 | Frontend config generated | `cat src/config/site.ts` | TypeScript exports `site` object with company, branding, contact data | [ ] |
| 4 | Backend config generated | `cat netlify/functions/_config/client.ts` | TypeScript exports `clientConfig` with all settings | [ ] |
| 5 | CSS tokens updated | `grep "cal-brand" src/styles/global.css` | Hex color matches `branding.colorPrimary` from config | [ ] |
| 6 | Build passes | `npm run build` | `✓ Built X pages in <2s, 0 TS errors` | [ ] |
| 7 | No TypeScript errors | `npm run build` output | `0 TS errors` | [ ] |
| 8 | All pages generated | `ls -la dist/` | 45+ pages in dist/ | [ ] |
| 9 | Functions copied | `ls -la .netlify/functions/` | 40+ .ts files in functions/ | [ ] |
| 10 | .env.local has 7 vars | `wc -l .env.local` | 7 lines (one per API key) | [ ] |

### Post-Deployment Verification (Production)

| # | Check | Command / Method | Expected Result | Status |
|---|-------|-----------------|-----------------|--------|
| 11 | Site accessible | `curl https://your-site.netlify.app/` | HTTP 200, HTML response | [ ] |
| 12 | No HypeDigitaly references | `grep -r "hypedigitaly" dist/ src/` (outside comments/docs) | 0 matches (or only in comments) | [ ] |
| 13 | No hardcoded emails | `grep -r "pavelcermak@" dist/` | 0 matches in dist/ | [ ] |
| 14 | No hardcoded cal.com links | `grep -r "cal.com/hypedigitaly" dist/` | 0 matches in dist/ | [ ] |
| 15 | Logo loads | Navigate to site, check header | Logo displays (from `branding.logoUrl`) | [ ] |
| 16 | Favicon displays | Open in browser, check tab | Favicon visible (from `branding.faviconUrl`) | [ ] |
| 17 | Brand colors applied | Check buttons/headings/badges | Primary color matches `branding.colorPrimary` | [ ] |
| 18 | Footer company info correct | Visit `/` and scroll to footer | Company name, address, ICO, DIČ all match config | [ ] |
| 19 | Footer team members correct | Check footer CTA section | Team names, emails, phone numbers match config | [ ] |
| 20 | Footer social links correct | Hover footer social icons | LinkedIn, Instagram, Facebook all correct | [ ] |
| 21 | CORS allows origin | `curl -H "Origin: https://your-site.netlify.app" https://your-site.netlify.app/.netlify/functions/audit-validate` | `Access-Control-Allow-Origin` header present | [ ] |
| 22 | Admin dashboard password works | Navigate to `/admin/leads`, enter password | Dashboard loads, shows existing leads | [ ] |
| 23 | Audit form submits | Fill and submit test audit | No errors, polling starts | [ ] |
| 24 | Report generates | Wait for report, check link | Report HTML loads with correct company branding | [ ] |
| 25 | Email sent to correct recipient | Check email inbox | Email arrives to `notifications.recipients[0]` address | [ ] |
| 26 | Email "From" header correct | Check email properties | "From:" field shows `${fromName} <${fromEmail}>` | [ ] |
| 27 | Email signature correct | Check email footer | Company legal name and domain match config | [ ] |
| 28 | Calendar link works | Click "Book a call" in email | Cal.com page loads with correct team member's calendar | [ ] |
| 29 | Report PDF exports | Click "Save as PDF" on report | PDF downloads, contains correct company branding | [ ] |
| 30 | Privacy policy email correct | Navigate to `/privacy-policy` | Contact email matches `contact.email` | [ ] |
| 31 | Bilingual support works | Switch language toggle (cs/en) | All text translates, config values stay consistent | [ ] |
| 32 | Netlify Functions logged | Check Netlify Functions logs | No errors in audit.ts, audit-background.ts, email-templates.ts | [ ] |
| 33 | Blobs store persists | Submit 2 audits, check admin dashboard | Both leads visible, data persists across deployments | [ ] |
| 34 | API key validation | Check Netlify env vars | `netlify env:list` shows all 7 vars (values masked) | [ ] |
| 35 | Firecrawl graceful fallback (optional) | Submit audit without valid FIRECRAWL_API_KEY | Report still generates without branding extraction | [ ] |

---

## Section 8: Gotchas & Known Issues

### 8.1 Critical Gotchas (Must Know)

#### 1. LLM Prompt Identity — White-Label Clients May Need Customization

**Issue:** The LangGraph agent system prompts contain HypeDigitaly-specific copywriting voice and context:
- Prompt mentions "AI transformation for Czech businesses"
- References HypeDigitaly case studies in synthesis
- Example language in `langgraph/llm-synthesizer.ts` uses HypeDigitaly tonality

**Impact:** Generated reports may sound like HypeDigitaly recommendations even for white-label clients.

**Mitigation:**
- Review `netlify/functions/audit-services/langgraph/llm-synthesizer.ts` (lines ~50-120)
- Replace HypeDigitaly references with client company name
- Update case study examples to client's own examples
- Customize prompt in `openrouter-analysis.ts` (lines ~30-80)

**Future Work:** Add `clientConfig.promptCustomization` field to schema.

---

#### 2. Blob Store Isolation — Each Client = Separate Netlify Site

**Issue:** Netlify Blobs are scoped per site. If you deploy multiple clients to the **same** Netlify site, all leads will be mixed in one Blobs store.

**Impact:** Data leakage between clients, no segregation.

**Mitigation:** **Each client MUST have their own Netlify site.** This is non-negotiable for:
- `audit-leads/` blob
- `audit-reports/` blob
- `audit-status/` blob
- `contact-leads/`, `survey-leads/`, `pricing-leads/`, `onboarding-leads/` blobs

**Implementation:** `/site-builder` skill automatically creates separate Netlify sites per client.

---

#### 3. Email Template Content Layer — YouTube IDs, Blog URLs Hardcoded Post-Setup

**Issue:** Email templates contain two categories of hardcoded values:
- **Parameterized (auto-replaced):** Company name, logo, calendar link, social links, brand color
- **NOT Parameterized (manual post-setup):** YouTube video IDs, blog post URLs, case study links

These are in `netlify/functions/email-templates.ts` lines:
- Line 496: Blog URL `https://hypedigitaly.ai/blog/przypadova-studie-5-kraju-cr`
- Line 515: YouTube video `https://www.youtube.com/watch?v=bHMZn4ga9DE`
- Line 550: YouTube channel `https://www.youtube.com/@PavelCermakAI`

**Impact:** Email content will still reference HypeDigitaly's case studies and videos.

**Mitigation:**
1. After `/setup-audit` runs, manually edit `email-templates.ts`
2. Search for `hypedigitaly.ai/blog` and replace with client's blog posts
3. Search for YouTube URLs and replace with client's video content (or remove if none exist)
4. Test email sending before go-live

**Future Work:** Add optional fields to config schema:
```json
{
  "content": {
    "caseStudyUrl": "https://client.com/case-studies/...",
    "youtubeVideoId": "ABC123",
    "youtubeChannelUrl": "https://youtube.com/@client"
  }
}
```

---

#### 4. Background Function Timeout — *-background.ts = 15-min Max, Then Forced Abort

**Issue:** Netlify Functions timeout at 10 seconds by default, but Netlify Background Functions extend this to 15 minutes. However:
- If audit generation exceeds 15 minutes, the function is **forcibly terminated**
- No graceful shutdown, no error notification

**Impact:** For very large companies (50+ news articles, 1000+ web search results), report generation may time out.

**Mitigation:**
1. Monitor `netlify/functions/audit-background.ts` logs
2. If timeouts occur, increase search limits in `langgraph-agent.ts` (reduce web search results per task)
3. Add fallback in `langgraph/fallback-report.ts` to return partial report if timeout detected
4. Alert user via email if timeout occurs

**Current Status:** Fallback already implemented in `langgraph/fallback-report.ts`.

---

#### 5. Strong Consistency Required — Blobs May Have Stale Reads

**Issue:** Netlify Blobs implement **eventual consistency**, not strong consistency. Immediately after writing a report to Blobs:
- The write may not be readable from all edge locations for 1-2 seconds
- User polling `GET /audit-status?jobId=ABC` may see stale data

**Impact:** Race condition where user gets report URL before report is actually readable.

**Mitigation:**
- Status polling includes a 500ms retry delay (in `audit-status.ts`)
- Report retrieval includes a 3-retry loop with 1-second backoff (in `audit-report.ts`)
- User emails include report link only after 100% confirmation of write

**Current Status:** Implemented in `audit-status.ts` (lines ~60-90) and `audit-report.ts` (lines ~40-70).

---

#### 6. _redirects Force Rule — Trailing Slash Enforcement

**Issue:** Netlify uses `_redirects` file (auto-generated) with force rule:
```
/* /404.html 404
```
This can conflict with custom redirect rules if added manually.

**Impact:** Custom redirects may be ignored or cause 404s.

**Mitigation:**
1. Do NOT manually edit `_redirects` (it's auto-generated by Astro)
2. If custom redirects needed, add them via `netlify.toml`:
```toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

**Current Status:** Not an issue unless team manually edits `dist/_redirects`.

---

#### 7. CORS Origin Must Match Deployment URL

**Issue:** `/setup-audit` defaults `domain.corsOrigin` to `domain.siteUrl`. If Netlify site changes domain (e.g., during custom domain setup), CORS becomes invalid:
- Old: `https://my-site-abc123.netlify.app`
- New: `https://audit.client.com`

Functions will reject requests with `Origin` header mismatch.

**Impact:** Audit form stops working after custom domain is added if config not updated.

**Mitigation:**
1. After custom domain setup, update `config.json`:
   ```json
   {
     "domain": {
       "siteUrl": "https://audit.client.com",
       "corsOrigin": "https://audit.client.com"
     }
   }
   ```
2. Rebuild and redeploy
3. Verify CORS headers: `curl -H "Origin: https://audit.client.com" https://audit.client.com/.netlify/functions/audit-validate`

---

#### 8. Admin Password in Environment — Rotate Regularly

**Issue:** `ADMIN_PASSWORD` stored as plain text in Netlify environment. If leaked:
- Attacker can access `/admin/leads` dashboard
- Can delete all lead records
- Can export company contact information

**Impact:** Data breach, loss of lead history.

**Mitigation:**
1. Rotate `ADMIN_PASSWORD` every 90 days:
   ```bash
   netlify env:set ADMIN_PASSWORD "NewSecurePassword123!"
   ```
2. Store old passwords in secure password manager
3. Alert team when password rotated
4. Monitor admin dashboard access logs (future feature)

**Current Status:** No access logs implemented yet.

---

#### 9. Email Sender Address Must Be Verified in Resend

**Issue:** `notifications.fromEmail` is imported from config, but Resend only allows emails that are **verified in your account**. If not verified:
- Email sends fail silently
- No error thrown in function
- User never receives confirmation email

**Impact:** Silent failure, user has no idea audit was submitted.

**Mitigation:**
1. Before setup, verify sender email in Resend dashboard: https://resend.com/emails
2. Click "Add domain" or "Add email address"
3. Follow verification steps (DKIM, DMARC, etc.)
4. Only after verification is complete, fill in `notifications.fromEmail` in config
5. Test: Submit a test audit from localhost and check Resend dashboard for send status

---

#### 10. Tavily API Rate Limits — Web Search May Fail Under Load

**Issue:** Tavily API has rate limits (varies by plan). Under heavy load:
- Web search requests start failing with 429 (Too Many Requests)
- LangGraph agent retries up to 3x, then falls back to limited results

**Impact:** Report quality degrades (fewer research findings) for users during traffic spikes.

**Mitigation:**
1. Check Tavily plan: https://tavily.com/pricing
2. Upgrade plan if expecting high volume (100+ audits/day)
3. Implement request queuing in `audit-background.ts` (not yet implemented)
4. Monitor Tavily API usage: `netlify functions:logs audit-background --timeout=600`

**Current Status:** No queuing implemented; falls back gracefully.

---

#### 11. OpenRouter API Key Scoped to Specific Models

**Issue:** Some OpenRouter API keys are scoped to specific LLM models. If the prompt requests an unavailable model, request fails with 401.

**Impact:** LangGraph agent crashes, report generation fails.

**Mitigation:**
1. Verify OpenRouter API key has access to models used in:
   - `openrouter-analysis.ts`: Check `model` field in API call (default: "meta-llama/llama-2-70b-chat")
   - Adjust config if needed
2. Test in localhost: `npm run dev` and submit test audit
3. Check function logs for model errors

**Current Status:** Default model (Llama 2) is available on most plans.

---

### 8.2 Known Limitations (By Design)

#### A. Single Language Pair Only

- Template hardcodes Czech (cs) + English (en)
- Russian, Polish, German require manual translation (not automated)
- Add to `src/scripts/translations/` and wire into all components

#### B. No Real-Time Collaboration

- Admin dashboard doesn't support concurrent users
- Multiple team members editing leads simultaneously may overwrite each other

#### C. No Lead Scoring or Lead Qualification

- All leads stored as-is, no automatic scoring
- Manual CRM integration required for lead qualification workflows

#### D. PDF Export Quality Varies by Browser

- HTML → PDF via browser `print` API (not headless Chrome)
- Desktop browsers: better quality
- Mobile browsers: may have formatting issues

---

### 8.3 Debugging Tips

| Issue | Symptom | Debug Step |
|-------|---------|-----------|
| Audit form not submitting | Form hangs, no error message | Check `netlify/functions/audit.ts` logs: `netlify functions:logs audit` |
| Report not generating | Polling shows progress stuck at 50% | Check `netlify/functions/audit-background.ts` logs (15-min timeout?) |
| Email not received | User never gets confirmation email | Check Resend dashboard: is `notifications.fromEmail` verified? |
| Admin dashboard won't load | 401 Unauthorized | Verify `ADMIN_PASSWORD` in browser DevTools → Network → auth header |
| CORS error in browser console | "No 'Access-Control-Allow-Origin' header" | Verify `domain.corsOrigin` in config matches request origin |
| Config values showing in email as `undefined` | Email has `${company.name}` instead of actual name | Check `site.ts` was generated (not gitignored) |
| Blue links appear instead of brand color | Buttons not using accent color | Check `src/styles/global.css` has `--color-brand-accent` token |

---

**End of Sections 5-8**

*Prepared by: Documentation Engineer*
*Date: 2026-03-19*
*For: AI Code (Claude Code) Configuration Workflows*
