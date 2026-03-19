---
name: setup-audit
description: Interactive setup for the Audit System Template. Collects ~33 client configuration values, validates inputs, generates config files, updates brand colors, and verifies the build.
alwaysApply: false
---

# Interactive Setup — Audit System Template

You are setting up a new Audit System client from the `hype-audit-template`. Your job is to collect ~33 configuration values from the user in 6 organized sections, validate all inputs, generate configuration files, update CSS tokens, and verify the build completes.

## Overview

I'll ask you questions across 6 sections to configure this audit template for your client:

1. **Section 1: Company Identity** — Company name, legal name, description, industry, audience (7 fields)
2. **Section 2: Domain & URLs** — Site URL, report base URL, CORS origin (3 fields)
3. **Section 3: Branding** — Primary color, accent color, logo, favicon (4 fields)
4. **Section 4: Contact & Team** — Email, phone, address, team members (12+ fields)
5. **Section 5: Social Media** — LinkedIn, Instagram, Facebook, Google Reviews (4 fields, all optional)
6. **Section 6: Notifications & Secrets** — Email recipients, sender address, API keys (7 environment variables)

After all sections are confirmed, I will:
- Write `config.json` with all validated values
- Generate `src/config/site.ts` and `netlify/functions/_config/client.ts`
- Update CSS tokens in `src/styles/global.css`
- Write `.env.local` with all secrets
- Build and verify the project
- Report any leftover hardcoded values

**Total configuration time: 10–15 minutes.**

---

## Section 1: Company Identity

I'll ask for 7 fields that define your company brand.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| 1 | Company name (display) | **Yes** | Acme Corp |
| 2 | Legal name | **Yes** | Acme Corp s.r.o. |
| 3 | Description | **Yes** | AI-powered B2B lead gen for Czech manufacturers |
| 4 | Industry | **Yes** | SaaS, Manufacturing, E-commerce |
| 5 | Target audience | **Yes** | B2B founders, SME owners in Czech Republic |
| 6 | IČO (Czech tax ID) | Optional | 12345678 |
| 7 | DIČ (Czech VAT ID) | Optional | CZ12345678 |

### Collection

Please provide these values:

- **Company name** (what appears in headers and emails)
- **Legal name** (full entity name, e.g., "Company s.r.o.")
- **Description** (1–2 sentences for meta tags and email copy)
- **Industry** (e.g., "SaaS", "Manufacturing", "Services")
- **Target audience** (e.g., "B2B founders", "SME owners")
- **IČO** (optional, 6–8 digits)
- **DIČ** (optional, "CZ" + 8–10 digits)

### Validation Rules

| Field | Rule |
|---|---|
| Company name | Non-empty, 1–100 characters |
| Legal name | Non-empty, 1–200 characters |
| Description | Non-empty, 1–300 characters |
| Industry | Non-empty, 1–100 characters |
| Target audience | Non-empty, 1–100 characters |
| IČO | If provided: must be 6–8 digits only (regex: `^\d{6,8}$`) |
| DIČ | If provided: must match `^CZ\d{8,10}$` format |

**Confirmation block for Section 1:**

```
Section 1: Company Identity
────────────────────────────────────
Company name:     [value]
Legal name:       [value]
Description:      [value]
Industry:         [value]
Target audience:  [value]
IČO:              [value or "—"]
DIČ:              [value or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

If the user says "edit 3", re-ask only that field. If confirmed, proceed to Section 2.

---

## Section 2: Domain & URLs

I'll ask for 3 fields: the site URL, and two optional URLs that are auto-derived if left blank.

### Fields in this section

| # | Field Name | Required | Example | Default |
|---|---|---|---|---|
| 1 | Site URL | **Yes** | https://audit.acme.com | (none) |
| 2 | Report base URL | Optional | https://audit.acme.com/report | `${siteUrl}/report` |
| 3 | CORS origin | Optional | (for subdomain APIs) | `siteUrl` |

### Collection

Please provide:

- **Site URL** (full URL with `https://`, no trailing slash, e.g., `https://audit.acme.com`)
- **Report base URL** (optional; if empty, will default to `${siteUrl}/report`)
- **CORS origin** (optional; if empty, will default to the site URL)

### Validation Rules

| Field | Rule |
|---|---|
| Site URL | Must start with `https://`, must not end with `/`, must be a valid absolute URL |
| Report base URL | If provided: must start with `https://` |
| CORS origin | If provided: must start with `https://` |

**Confirmation block for Section 2:**

```
Section 2: Domain & URLs
────────────────────────────────────
Site URL:          [value]
Report base URL:   [value or "auto: ${siteUrl}/report"]
CORS origin:       [value or "auto: ${siteUrl}"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 3: Branding

I'll ask for 4 fields: primary color, accent color, logo, and favicon.

### Fields in this section

| # | Field Name | Required | Example | Default |
|---|---|---|---|---|
| 1 | Primary color | **Yes** | #0ea5e9 | (none) |
| 2 | Accent color | **Yes** | #f59e0b | (none) |
| 3 | Logo URL | **Yes** | /assets/images/logo.svg | (none) |
| 4 | Favicon URL | Optional | /favicon.svg | /favicon.svg |

### Collection

Please provide:

- **Primary color** (hex format, e.g., `#0ea5e9` — 3 or 6 digits after `#`)
- **Accent color** (hex format, e.g., `#f59e0b`)
- **Logo URL** (relative path from `/public` or full URL, e.g., `/assets/images/logo.svg` or `https://cdn.acme.com/logo.svg`)
- **Favicon URL** (optional; defaults to `/favicon.svg` if blank)

### Validation Rules

| Field | Rule |
|---|---|
| Primary color | Must match regex `^#([0-9a-fA-F]{3}\|[0-9a-fA-F]{6})$` (e.g., `#abc` or `#0ea5e9`) |
| Accent color | Same as primary color |
| Logo URL | Non-empty; can be relative or absolute URL |
| Favicon URL | If provided: can be relative or absolute URL |

**Confirmation block for Section 3:**

```
Section 3: Branding
────────────────────────────────────
Primary color:    [value] 🟦
Accent color:     [value] 🟦
Logo URL:         [value]
Favicon URL:      [value or "/favicon.svg"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 4: Contact & Team

I'll ask for email, address, and at least 1 team member (name, title, email, phone, calendar).

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| **Contact Info** |
| 1 | Contact email | **Yes** | contact@acme.com |
| 2 | Phone | Optional | +420 123 456 789 |
| 3 | Street address | Optional | Václavské náměstí 1 |
| 4 | City | Optional | Praha |
| 5 | Postal code | Optional | 110 00 |
| **Team Member 1 (at least required)** |
| 6 | Team member name | **Yes** | Jan Novák |
| 7 | Team member title | **Yes** | CEO & Growth Strategist |
| 8 | Team member email | **Yes** | jan@acme.com |
| 9 | Team member phone | Optional | +420 987 654 321 |
| 10 | Team member calendar URL | Optional | https://cal.com/jan |
| **Team Member 2 (optional)** |
| 11 | Second team member name | Optional | Marie Dvořáková |
| 12 | Second team member email | Optional | marie@acme.com |

### Collection

**Contact information:**
- Email (required)
- Phone (optional)
- Street address (optional)
- City (optional)
- Postal code (optional)

**Team members:**

At least 1 team member is required. Collect one at a time:

1. Ask: "Team member 1 — name?"
2. Ask: "Team member 1 — title?"
3. Ask: "Team member 1 — email?"
4. Ask: "Team member 1 — phone? (optional)"
5. Ask: "Team member 1 — calendar URL (e.g., https://cal.com/jan)? (optional)"

Then ask: **"Add another team member? (yes/no)"**

If yes, repeat for team member 2.

### Validation Rules

| Field | Rule |
|---|---|
| Contact email | Must match `^[^\s@]+@[^\s@]+\.[^\s@]+$` (valid email) |
| Phone | No strict format; store as-is (e.g., "+420 123 456 789") |
| Team member name | Non-empty, 1–100 characters |
| Team member title | Non-empty, 1–100 characters |
| Team member email | Must match valid email regex |
| Team member phone | No strict format |
| Team member calendar URL | If provided: must start with `https://` |

**Confirmation block for Section 4:**

```
Section 4: Contact & Team
────────────────────────────────────
Contact Info:
  Email:        [value]
  Phone:        [value or "—"]
  Street:       [value or "—"]
  City:         [value or "—"]
  Postal code:  [value or "—"]

Team (1 or more):
  [1] Jan Novák
      Title:    CEO & Growth Strategist
      Email:    jan@acme.com
      Phone:    +420 987 654 321
      Calendar: https://cal.com/jan

  [2] Marie Dvořáková
      Title:    Head of Sales
      Email:    marie@acme.com
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 5: Social Media

I'll ask for 4 optional social media links.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| 1 | LinkedIn | Optional | https://linkedin.com/company/acme-corp |
| 2 | Instagram | Optional | https://instagram.com/acmecorp |
| 3 | Facebook | Optional | https://facebook.com/acmecorp |
| 4 | Google Reviews | Optional | https://maps.google.com/?cid=12345678 |

### Collection

Please provide any social links (all optional):

- LinkedIn company page or profile URL
- Instagram profile URL
- Facebook page URL
- Google Reviews / Google Business URL

### Validation Rules

| Field | Rule |
|---|---|
| All social links | If provided: must start with `https://` |

**Confirmation block for Section 5:**

```
Section 5: Social Media (all optional)
────────────────────────────────────
LinkedIn:       [value or "—"]
Instagram:      [value or "—"]
Facebook:       [value or "—"]
Google Reviews: [value or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 6: Notifications & Secrets

I'll ask for email notification settings and then collect API keys and secrets.

### Part 6a: Email Notifications (non-secret)

| # | Field Name | Required | Example |
|---|---|---|---|
| 1 | Notification recipients | **Yes** | sales@acme.com, jan@acme.com |
| 2 | From email | **Yes** | noreply@mail.acme.com |
| 3 | From display name | **Yes** | Acme Audit System |

**Critical note about `fromEmail`:** This address must be verified in your Resend account before deployment. Unverified addresses will fail silently.

### Collection

Please provide:

- **Notification recipients** (comma-separated list of emails that receive new lead notifications)
- **From email** (the sender address for all outbound emails — must be verified in Resend)
- **From display name** (e.g., "Acme Audit", "Acme Leads Team")

### Validation Rules

| Field | Rule |
|---|---|
| Notification recipients | Array of 1+ valid emails; each must match email regex |
| From email | Must match email regex; **must be verified in Resend account** |
| From display name | Non-empty, 1–100 characters |

### Part 6b: Secrets (API Keys)

**Warning:** The following values are secrets and will be written only to `.env.local`, which is gitignored and never committed.

| # | Field Name | Required | Example / Format |
|---|---|---|---|
| 1 | RESEND_API_KEY | **Yes** | Starts with `re_` (e.g., `re_xxxxxxxxxxxxxxxxxxxx`) |
| 2 | TAVILY_API_KEY | **Yes** | Any string (provided by Tavily after signup) |
| 3 | OPENROUTER_API_KEY | **Yes** | Starts with `sk-or-v1-` |
| 4 | FIRECRAWL_API_KEY | Optional | Provided by Firecrawl (for company branding extraction; graceful fallback if missing) |
| 5 | ADMIN_PASSWORD | Optional | If empty: will generate 32-char random password |
| 6 | NETLIFY_SITE_ID | Optional | Can be added later via `netlify env:set` |
| 7 | NETLIFY_API_TOKEN | Optional | Can be added later via `netlify env:set` |

### Collection

Ask for secrets one at a time, explaining each:

1. **RESEND_API_KEY** (required): "Your Resend API key. Generate it from https://resend.com/api-keys. Starts with `re_`."
2. **TAVILY_API_KEY** (required): "Your Tavily API key for web search. Generate it from https://tavily.com. This is the API key from your dashboard."
3. **OPENROUTER_API_KEY** (required): "Your OpenRouter API key for LLM inference. Generate it from https://openrouter.ai/keys. Starts with `sk-or-v1-`."
4. **FIRECRAWL_API_KEY** (optional): "Your Firecrawl API key for company branding extraction. Generate it from https://www.firecrawl.dev. Leave blank to skip; the template will gracefully fall back to defaults."
5. **ADMIN_PASSWORD** (optional): "A secure password for the `/admin/leads` dashboard (min 32 characters). If left blank, I will generate a random one."
6. **NETLIFY_SITE_ID** (optional): "Your Netlify site ID (can be found in Netlify dashboard or added later with `netlify env:set`)."
7. **NETLIFY_API_TOKEN** (optional): "Your Netlify API token (can be generated in Netlify settings or added later with `netlify env:set`)."

### Secret Validation Rules

| Field | Rule |
|---|---|
| RESEND_API_KEY | If provided: must start with `re_` |
| TAVILY_API_KEY | No specific format check |
| OPENROUTER_API_KEY | If provided: should start with `sk-or-v1-` |
| FIRECRAWL_API_KEY | No validation (optional) |
| ADMIN_PASSWORD | If empty: generate 32-char random (A–Z, a–z, 0–9) |
| NETLIFY_SITE_ID | No strict validation |
| NETLIFY_API_TOKEN | No strict validation |

**Confirmation block for Section 6a (Email):**

```
Section 6a: Notifications
────────────────────────────────────
Recipients:       [sales@acme.com, jan@acme.com]
From email:       [noreply@mail.acme.com]
From name:        [Acme Audit System]
────────────────────────────────────
```

**Confirmation block for Section 6b (Secrets):**

```
Section 6b: Secrets (written to .env.local only)
────────────────────────────────────
RESEND_API_KEY:         [masked: re_***]
TAVILY_API_KEY:         [masked: tavily_***]
OPENROUTER_API_KEY:     [masked: sk-or-v1-***]
FIRECRAWL_API_KEY:      [masked or "not provided"]
ADMIN_PASSWORD:         [masked or "generated: ***"]
NETLIFY_SITE_ID:        [masked or "not provided"]
NETLIFY_API_TOKEN:      [masked or "not provided"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## After All Sections Are Confirmed

Perform the following steps in order. Announce each step before executing it.

### Step 1: Write config.json

Create or overwrite `config.json` at the repository root with all collected values. The file structure must match the schema in `config.schema.ts`.

**Template structure:**

```json
{
  "company": {
    "name": "[company name]",
    "legalName": "[legal name]",
    "description": "[description]",
    "industry": "[industry]",
    "audience": "[audience]",
    "ico": "[ico or empty]",
    "dic": "[dic or empty]"
  },
  "domain": {
    "siteUrl": "[site url]",
    "reportBaseUrl": "[report base url or empty]",
    "corsOrigin": "[cors origin or empty]"
  },
  "branding": {
    "colorPrimary": "[primary hex]",
    "colorAccent": "[accent hex]",
    "logoUrl": "[logo url]",
    "faviconUrl": "[favicon url or empty]"
  },
  "contact": {
    "email": "[email]",
    "phone": "[phone or empty]",
    "street": "[street or empty]",
    "city": "[city or empty]",
    "postalCode": "[postal code or empty]",
    "country": "Česká republika",
    "mapsEmbedUrl": ""
  },
  "team": [
    {
      "name": "[name]",
      "title": "[title]",
      "email": "[email]",
      "phone": "[phone or empty]",
      "calendarUrl": "[calendar url or empty]"
    }
  ],
  "social": {
    "linkedin": "[linkedin or empty]",
    "instagram": "[instagram or empty]",
    "facebook": "[facebook or empty]",
    "googleReviews": "[google reviews or empty]"
  },
  "notifications": {
    "recipients": ["[email1]", "[email2]"],
    "fromEmail": "[from email]",
    "fromName": "[from name]"
  }
}
```

Save this to `/config.json` at the repository root.

### Step 2: Validate config.json

Read `config.schema.ts` and use its `validateConfig()` function logic to validate the written config.json. Check for:

- All required fields are non-empty
- Email fields match the email regex
- Hex colors match the color regex
- IČO (if provided) matches `^\d{6,8}$`
- DIČ (if provided) matches `^CZ\d{8,10}$`
- Team array has at least 1 member
- Notification recipients array has at least 1 email

If validation fails, report errors and ask the user to fix the values before proceeding.

If validation passes, announce: **"Configuration validated successfully."**

### Step 3: Generate src/config/site.ts

Read the template file at `astro-src/src/config/site.ts` and verify it has the correct import paths and structure. This file should already be correct in the template (it imports `config.json` and `config.schema.ts`).

Verify the file compiles by checking its syntax. No modifications needed — the file automatically reads from `config.json`.

Announce: **"Frontend config (site.ts) is ready."**

### Step 4: Generate netlify/functions/_config/client.ts

Read the template file at `astro-src/netlify/functions/_config/client.ts` and verify it has the correct import paths and structure. This file should also be pre-configured in the template.

Verify the file compiles. No modifications needed — it automatically reads from `config.json`.

Announce: **"Backend config (client.ts) is ready."**

### Step 5: Update CSS tokens in global.css

Read `astro-src/src/styles/global.css`. Find the `@theme` block (around line 19–24):

```css
@theme {
  --color-primary: #00A39A;
  --color-primary-light: #00C4B4;
  --color-primary-dark: #008B84;
  --font-family-geist: 'Geist', sans-serif;
}
```

Update `--color-primary` to the primary color from config.json. Keep `--color-primary-light` and `--color-primary-dark` with their defaults (not customized per client yet).

Also add `--color-accent` to the `@theme` block:

```css
--color-accent: [accent color from config];
```

After the `@theme` block, find all hardcoded color utility classes (`.text-primary`, `.bg-primary`, etc.) and replace their hardcoded hex values with the new primary color. For example:

**Before:**
```css
.text-primary {
  color: #00A39A !important;
}
```

**After:**
```css
.text-primary {
  color: [new primary color] !important;
}
```

Do this for all utility classes that reference `--color-primary` or the old hex value `#00A39A`.

Announce: **"CSS tokens updated in global.css."**

### Step 6: Write .env.local

Create `.env.local` at the repository root (same level as `astro-src/`, `netlify.toml`, etc.). Write all secrets as environment variables:

```
# Generated by /setup-audit — do not commit this file
RESEND_API_KEY=[value]
TAVILY_API_KEY=[value]
OPENROUTER_API_KEY=[value]
FIRECRAWL_API_KEY=[value or empty]
ADMIN_PASSWORD=[generated or provided value]
NETLIFY_SITE_ID=[value or empty]
NETLIFY_API_TOKEN=[value or empty]
```

Verify `.gitignore` at the repository root contains `.env.local`. If it does not, append it.

Announce: **"Secrets written to .env.local (gitignored)."**

### Step 7: Build the project

Navigate to `astro-src/` and run the build:

```bash
cd astro-src && npm install && npm run build
```

Report the build output. If the build succeeds, announce: **"Build completed successfully."**

If the build fails, show the error message and suggest checking `config.json` values and TypeScript errors.

### Step 8: Check for hardcoded values

Run a grep search for leftover hardcoded references to the template company ("Vzorová Firma", "hypedigitaly", "template", etc.) in the source files:

```bash
grep -r "hypedigitaly\|Vzorová\|template" --include="*.ts" --include="*.astro" astro-src/src/ astro-src/netlify/ --ignore-case
```

If matches are found, list them and warn: **"Found [N] potential hardcoded values. Review and replace these manually if they apply to your client."**

If no matches, announce: **"No leftover hardcoded template values found."**

### Step 9: Final Summary

Output a plain-text summary:

```
────────────────────────────────────────────────────────────────
Setup Complete — Audit System Template
────────────────────────────────────────────────────────────────

Company:          [company name]
Site URL:         [site url]
Configuration:    config.json ✓
Frontend config:  astro-src/src/config/site.ts ✓
Backend config:   astro-src/netlify/functions/_config/client.ts ✓
CSS tokens:       astro-src/src/styles/global.css ✓
Secrets file:     .env.local (gitignored) ✓
Build status:     [passed / failed]

Next steps:
1. Review config.json to ensure all values are correct
2. Verify RESEND_API_KEY is from a verified sender domain in Resend
3. Add .env.local variables to your Netlify site dashboard:
   - Go to Site settings → Environment variables
   - Add all 7 variables from .env.local
4. If you don't have a Netlify site yet:
   - Run: netlify sites:create --name [client-site-name]
5. Deploy to Netlify:
   - Run: netlify deploy --prod
6. Test the form at https://[your-domain]/audit

For more info, see AUDIT_TEMPLATE_PRD.md Section 4 (Setup Runbook).
────────────────────────────────────────────────────────────────
```

---

## Error Recovery

### If validation fails

Ask the user: "Which field would you like to correct? (field name or number)"

Re-ask that field, validate again, and update the confirmation block.

### If build fails

Show the error output. Ask: "Would you like to [1] check config.json values, [2] review TypeScript errors, or [3] retry the build?"

Guide the user through corrections.

### If hardcoded values are found

Provide the grep output and ask: "These values reference the template company. Should they be replaced with your client's info? I can help replace them."

---

## Finalization

After Step 9 (Final Summary) completes:

- Confirm all files are committed or staged (do NOT auto-commit; let the user review first)
- Provide links to next steps documentation
- Ask: "Are you ready to deploy, or would you like to make any adjustments?"

