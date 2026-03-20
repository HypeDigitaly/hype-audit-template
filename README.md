# Audit System Template

White-label AI audit website — Astro 5.16 + Netlify + LangGraph research agent + CRM dashboard. Fully config-driven: deploy a unique-looking, unique-sounding audit site for any client without touching code.

## What This Is

- **One-page audit site** — Landing page with lead capture form at `/`, privacy policy, admin dashboard
- **AI research agent** — LangGraph-powered analysis of company online presence via Tavily + OpenRouter
- **HTML report** — Personalized audit report (emailed + downloadable, 30-day expiry)
- **Admin CRM** — Password-protected dashboard to manage leads, view submissions, export data
- **120+ config fields** — Branding, page copy, form fields, pricing tiers, LLM models, prompt customization, search queries, report sections, email templates — all via `config.json`

## Getting Started (4 Steps)

1. **Clone:** `git clone [repo-url] my-audit && cd my-audit`
2. **Setup:** Run `/setup-audit` skill in Claude Code — interactive Q&A with progressive disclosure (9 basic sections + 7 optional advanced sections)
3. **Build:** `cd astro-src && npm install && npm run build`
4. **Deploy:** Push to GitHub, connect Netlify, import env vars via `netlify env:import .env.local`

## File Organization

```
config.json                              <- Client config (source of truth, 120+ fields)
config.schema.ts                         <- TypeScript schema + validation + defaults
config.template.json                     <- Documented template for new clients
.env.example                             <- API key reference (7 keys)
astro-src/
  src/pages/index.astro                  <- Home page (audit landing + form)
  src/pages/audit.astro                  <- 301 redirect to / (backward compat)
  src/pages/privacy-policy.astro         <- GDPR privacy policy
  src/pages/admin/leads.astro            <- CRM dashboard (password-protected)
  src/pages/404.astro                    <- Custom error page
  src/config/site.ts                     <- Frontend config consumer (auto-resolved)
  src/layouts/BaseLayout.astro           <- Root layout (SEO, analytics, structured data)
  src/components/navigation/             <- Navigation + MobileMenu (config-driven)
  src/components/sections/Footer.astro   <- Footer (config-driven)
  src/styles/global.css                  <- Design system (CSS custom properties)
  src/scripts/translations/              <- i18n (Czech + English)
  netlify/functions/audit.ts             <- Sync audit handler
  netlify/functions/audit-background.ts  <- Async handler (15-min timeout)
  netlify/functions/audit-status.ts      <- Progress polling endpoint
  netlify/functions/audit-report.ts      <- Report retrieval
  netlify/functions/audit-services/
    langgraph/                           <- AI research pipeline (config-driven)
    html-report/                         <- Report generator (16 sections, all XSS-safe)
    pdf-generator/                       <- PDF export
  netlify/functions/_config/client.ts    <- Backend config consumer
.claude/commands/setup-audit.md          <- Interactive setup skill
docs/audit/                              <- System documentation (12 files)
AUDIT_TEMPLATE_PRD.md                    <- Full PRD + specs
```

## What Setup Does

**Basic Setup (Sections 1-9):**
1. Company identity (name, legal name, industry, audience)
2. Domain & URLs
3. Branding (colors, logo, favicon)
4. Contact & team members
5. Social media links
6. Notifications & API secrets
7. Analytics & tracking (GA4, Clarity, Facebook Pixel, GTM)
8. SEO & identity (founder, slogan, geo coordinates, knowsAbout)
9. Page content — hero headlines, subheadlines, badge text

**Advanced Setup (Sections 10-16, optional):**
10. Form configuration (pain points, tools, visibility toggles)
11. Pricing tiers (currency, names, prices, features, CTAs)
12. LLM configuration (models, temperature, max tokens, timeout)
13. Prompt customization (tone, focus areas, brand mentions, custom instructions)
14. Search configuration (max queries, disabled types, additional queries)
15. Report configuration (section ordering, disabled sections, opportunity count)
16. Email templates (subject lines, greetings, CTAs)

## Customization

Everything is config-driven. No code changes needed.

| Need | Location |
|------|----------|
| Brand colors | `config.json` → `branding` (auto-applies to entire site via CSS vars) |
| Page copy (hero, form, pricing, CTA) | `config.json` → `content` section |
| Form fields (pain points, tools) | `config.json` → `auditForm` section |
| AI audit prompts & tone | `config.json` → `prompt` section |
| LLM models & settings | `config.json` → `llm` section |
| Report sections & CTA | `config.json` → `report` section |
| Email templates | `config.json` → `email` section |
| Analytics (GA4, Clarity, etc.) | `config.json` → `analytics` section |
| Navigation CTA | `config.json` → `nav` section |
| SEO & structured data | `config.json` → `seo` section |

## Security

- **XSS prevention** — `escapeHtml()` / `sanitizeUrl()` applied across all 16 report sections
- **Prompt injection defense** — Blocklist with 14+ patterns (EN + CZ), zero-width char stripping, length limits, sandboxed injection points
- **URL validation** — Protocol allowlist (`https://`, `http://`, `/`) on all URL config fields
- **Analytics ID validation** — Strict regex per provider (GA4, Clarity, FB Pixel, GTM)
- **Config validation** — `validateConfig()` runs at startup, warns on issues
- **Admin auth** — Timing-safe password comparison for CRM dashboard

## Deployment Checklist

- [ ] Create new Netlify site (base dir: `astro-src`)
- [ ] Push to GitHub (auto-deploys on push)
- [ ] Import secrets: `netlify env:import .env.local`
- [ ] Test: visit `/` (audit form), submit test audit, check email, verify `/admin/leads`
- [ ] Verify `/audit` redirects to `/`

## Documentation

- Full PRD: [AUDIT_TEMPLATE_PRD.md](./AUDIT_TEMPLATE_PRD.md)
- Architecture docs: [docs/audit/](./docs/audit/)
- Config schema: [config.schema.ts](./config.schema.ts)
- Setup guide: [.claude/commands/setup-audit.md](./.claude/commands/setup-audit.md)

---

**Next:** Run `cd astro-src && npm install && npm run dev` to start the dev server locally.
