# Audit System Template

Pre-built AI audit website scaffold — Astro 5.16 + Netlify + LangGraph research agent + CRM dashboard.

## What This Is

- **Audit form** — Self-guided questionnaire that captures company data
- **AI research agent** — LangGraph-powered analysis of company online presence
- **HTML report** — Client-facing audit report (emailed + downloadable)
- **Admin CRM** — Dashboard to manage leads, view submissions, export data
- **Fully configurable** — ~33 values per client (branding, company info, API keys, prompts)

## Getting Started (4 Steps)

1. **Clone:** `git clone [repo-url] my-audit && cd my-audit`
2. **Setup:** Run `/setup-audit` skill in Claude Code — interactive Q&A (~33 questions) that configures everything
3. **Build:** `cd astro-src && npm install && npm run build`
4. **Deploy:** Push to GitHub, connect Netlify, import env vars via `netlify env:import .env.local`

## File Organization

```
config.json                           ← Client config (source of truth)
.env.example                          ← API key reference
astro-src/
  src/config/site.ts                  ← Frontend config (auto-generated)
  src/pages/audit.astro               ← Audit form page
  src/pages/admin/leads.astro         ← CRM dashboard
  src/components/audit-form.astro     ← Form component
  netlify/functions/submit-audit      ← Form handler
  netlify/functions/research-agent    ← LangGraph audit runner
  netlify/functions/admin-leads       ← CRM API endpoint
.claude/skills/setup-audit/SKILL.md   ← Interactive setup
docs/audit/                           ← System documentation (13 files)
AUDIT_TEMPLATE_PRD.md                 ← Full PRD + specs
```

## What Setup Does

1. Reads config schema
2. Prompts 6 groups (company info, domain, branding, contact, social, API secrets)
3. Validates inputs (emails, hex colors, URLs)
4. Writes `config.json` → generates `site.ts` → creates `.env.local`
5. Updates CSS brand tokens, verifies build

## Customization

| Need | Location |
|------|----------|
| Brand colors | `config.json` → `branding` section |
| Copy/content | `config.json` → `company`, `contact` sections |
| AI audit prompts | `audit-services/langgraph/prompt-generator.ts` |
| Report sections | `audit-services/html-report/sections/` |

## Deployment Checklist

- [ ] Create new Netlify site (base dir: `astro-src`)
- [ ] Push to GitHub (auto-deploys on push)
- [ ] Import secrets: `netlify env:import .env.local`
- [ ] Test form submission → check email delivery → verify admin dashboard

## Documentation

Full PRD: [AUDIT_TEMPLATE_PRD.md](./AUDIT_TEMPLATE_PRD.md)
Architecture docs: [docs/audit/](./docs/audit/)

---

**Next:** Run `cd astro-src && npm install && npm run dev` to start the dev server locally.
