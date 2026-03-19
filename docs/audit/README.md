# AI Audit & Admin Leads — System Documentation

**Complete technical reference for the HypeDigitaly AI audit platform, admin dashboard, and supporting infrastructure.**

---

## Quick Navigation

| Document | Purpose | Scope |
|----------|---------|-------|
| **[01-architecture.md](./01-architecture.md)** | System Architecture & Data Flow | Master file inventory, system overview, dual architecture patterns, data flow pipeline, data models, core patterns, technology stack |
| **[02-audit-page-frontend.md](./02-audit-page-frontend.md)** | /audit Page Frontend | Lead capture funnel, form validation, interactive roadmap component, page structure, state machine, client-side flow |
| **[03-admin-leads-frontend.md](./03-admin-leads-frontend.md)** | /admin/leads CRM Dashboard | Admin dashboard UI, lead filtering/sorting, bulk actions, data aggregation from multiple sources (audit, contact, survey, pricing, onboarding) |
| **[04-backend-functions.md](./04-backend-functions.md)** | Netlify Backend Functions | 13 serverless functions, audit handlers (sync/async/background), lead management, validation endpoints, configuration & security |
| **[05-ai-research-pipeline.md](./05-ai-research-pipeline.md)** | AI Research Pipeline | LangGraph agent architecture, Tavily search integration, query generation, LLM synthesis, industry recommendations, micro-niche analysis |
| **[06-report-generation.md](./06-report-generation.md)** | Report Generation System | HTML report templating, styling, data binding, dynamic sections, email-friendly HTML, report storage in Blobs |
| **[07-storage-and-data.md](./07-storage-and-data.md)** | Storage & Data Layer | Netlify Blobs configuration, job/lead/report storage, strong consistency patterns, index management, data retention |
| **[08-email-system.md](./08-email-system.md)** | Email System | Resend integration, email templates (confirmation, report delivery, admin notifications), retry logic, bounce handling, tracking |
| **[09-api-reference.md](./09-api-reference.md)** | API Reference | Complete endpoint documentation, request/response schemas, error codes, authentication, CORS, usage examples for all 10+ endpoints |
| **[10-security.md](./10-security.md)** | Security | Password-protected admin endpoints, ARES API validation, environment secrets, CORS policies, input validation, rate limiting considerations |
| **[11-environment-and-deployment.md](./11-environment-and-deployment.md)** | Environment & Deployment | Netlify configuration, environment variables, build process, secrets management, deployment pipeline, monitoring |
| **[12-replication-guide.md](./12-replication-guide.md)** | Replication Guide | Step-by-step rebuild from blank project, prerequisites, gotchas, verification checklist |

---

## Start Here

### For Understanding the System
Begin with **[01-architecture.md](./01-architecture.md)** — it establishes the foundational concepts, shared vocabulary, file inventory, and data flow that all other documents reference.

### For Rebuilding or Replicating
Start with **[12-replication-guide.md](./12-replication-guide.md)** for the complete step-by-step rebuild instructions, then reference **[11-environment-and-deployment.md](./11-environment-and-deployment.md)** for environment setup and **[04-backend-functions.md](./04-backend-functions.md)** for function deployment.

### For Frontend Development
Read **[02-audit-page-frontend.md](./02-audit-page-frontend.md)** and **[03-admin-leads-frontend.md](./03-admin-leads-frontend.md)** together to understand the lead capture funnel and admin dashboard.

### For API Integration
Use **[09-api-reference.md](./09-api-reference.md)** as the primary reference for all endpoint specifications, request/response schemas, and error handling.

### For Adding Features
Consult the architecture doc first (01), then reference the specific system doc (e.g., 05 for AI changes, 08 for email changes, 07 for data storage changes).

---

## System Overview

The HypeDigitaly audit system is a serverless platform that delivers automated AI audits to B2B companies within 5 minutes. Users submit their company details via the `/audit` lead capture funnel, which triggers background research powered by LangGraph, Tavily search, and OpenRouter LLM. The system generates an HTML report, emails it to the user, and stores all leads in an admin-accessible CRM dashboard at `/admin/leads`. The entire platform runs on Astro static pages + Netlify serverless functions + Blobs storage.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Astro 5.16, Tailwind CSS 4.1, TypeScript, vanilla JavaScript |
| **Backend** | Netlify Functions (Node.js), TypeScript |
| **Storage** | Netlify Blobs (key-value for jobs, leads, reports) |
| **AI/Research** | OpenRouter API (LLM synthesis), Tavily (web search) |
| **Email** | Resend (transactional email delivery) |
| **Deployment** | Netlify (static + serverless) |
| **Data Exchange** | JSON, Netlify Forms backend |

---

## Document Dependencies

```
01-architecture.md (foundation)
├── 02-audit-page-frontend.md (consumes architecture)
├── 03-admin-leads-frontend.md (consumes architecture)
├── 04-backend-functions.md (consumes architecture)
│   ├── 05-ai-research-pipeline.md (executes in audit.ts)
│   ├── 06-report-generation.md (executes in audit.ts)
│   └── 08-email-system.md (executes in audit.ts)
├── 07-storage-and-data.md (consumed by 04, 05, 06)
├── 09-api-reference.md (reference for all endpoints in 04)
├── 10-security.md (applies to all 04 functions)
├── 11-environment-and-deployment.md (deployment context for entire system)
└── 12-replication-guide.md (rebuild reference, consumes 01, 04, 11)
```

---

## Key Patterns

- **Dual Entry Points:** Synchronous (`audit.ts`) for immediate responses, asynchronous (`audit-background.ts`) for long-running research
- **Strong Consistency Polling:** Job status checks via `/api/audit-status` with eventual consistency guarantees
- **Modular AI Services:** LangGraph agent split into 14+ focused modules for maintainability
- **Bilingual Support:** All forms, templates, and responses support Czech (`_cs`) and English (`_en`)
- **Lead Aggregation:** Admin dashboard consolidates leads from audit, contact, survey, pricing, and onboarding sources

---

**Last Updated:** 2026-03-19
**Documentation Version:** 1.0
**Status:** Complete Reference
