---
name: setup-audit
description: Interactive setup for the Audit System Template. Collects 50+ core config values (Sections 1-9) with optional advanced setup (Sections 10-16) for form, pricing, LLM, prompts, search, reports, and emails. Validates all inputs against config.schema.ts, generates config files, updates CSS tokens, and verifies the build.
alwaysApply: false
---

# Interactive Setup — Audit System Template

You are setting up a new Audit System client from the `hype-audit-template`. Your job is to collect configuration values from the user in organized sections, validate all inputs, generate configuration files, update CSS tokens, and verify the build completes.

## Overview

I'll guide you through two phases of setup:

**PHASE 1: BASIC SETUP** (always asked — essential for a working deployment)
Covers Sections 1-9 with ~50 core configuration fields:

1. **Section 1: Company Identity** — Company name, legal name, description, industry, audience (7 fields)
2. **Section 2: Domain & URLs** — Site URL, report base URL, CORS origin (3 fields)
3. **Section 3: Branding** — Primary color, accent color, logo, favicon (4 fields)
4. **Section 4: Contact & Team** — Email, phone, address, team members (12+ fields)
5. **Section 5: Social Media** — LinkedIn, Instagram, Facebook, Google Reviews (4 fields, all optional)
6. **Section 6: Notifications & Secrets** — Email recipients, sender address, API keys (7 environment variables)
7. **Section 7: Analytics & Tracking** — GA4, Clarity, Facebook Pixel, GTM IDs (4 fields, all optional)
8. **Section 8: SEO & Identity** — Founder info, founding date, employee count, slogan, geo coordinates, topics (10+ fields, all optional)
9. **Section 9: Page Content — Hero** — Badge, headlines, subheadline in Czech & English (4 fields, all optional)

**PHASE 2: ADVANCED SETUP** (optional — customize form, pricing, LLM, prompts, search, reports, emails)
Prompted as: "Would you like to customize further? (form fields, pricing, LLM, etc.) [y/N]"
Covers Sections 10-16 with ~80 advanced configuration fields.

After all sections are confirmed, I will:
- Write `config.json` with all validated values
- Generate `src/config/site.ts` and `netlify/functions/_config/client.ts`
- Update CSS tokens in `src/styles/global.css`
- Write `.env.local` with all secrets
- Build and verify the project
- Report any leftover hardcoded values

**Total configuration time: 15–25 minutes (depending on whether you opt into advanced setup).**

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

## Section 7: Analytics & Tracking

I'll ask for 4 optional analytics and tracking service IDs.

### Fields in this section

| # | Field Name | Required | Format | Example |
|---|---|---|---|---|
| 1 | Google Analytics 4 ID | Optional | G-XXXXXXXXXX | G-AB1234CD5E |
| 2 | Microsoft Clarity ID | Optional | 8-14 lowercase alphanumeric | abc12def45 |
| 3 | Facebook Pixel ID | Optional | 12-16 digits | 1234567890123456 |
| 4 | GTM Container ID | Optional | GTM-XXXXXXX | GTM-AB1234 |

### Collection

Please provide any analytics IDs (all optional):

- **Google Analytics 4 ID** (e.g., "G-XXXXXXXXXX" where X is alphanumeric; find in GA4 admin panel)
- **Microsoft Clarity ID** (e.g., "abc12def45"; 8–14 lowercase alphanumeric characters; find at clarity.microsoft.com)
- **Facebook Pixel ID** (e.g., "1234567890123456"; numeric 12–16 digits; find in Meta Business Suite)
- **GTM Container ID** (e.g., "GTM-XXXXXX"; 6–8 uppercase alphanumeric after "GTM-"; find in Google Tag Manager)

### Validation Rules

| Field | Rule |
|---|---|
| Google Analytics 4 ID | If provided: must match regex `^G-[A-Z0-9]{6,12}$` |
| Microsoft Clarity ID | If provided: must be 8–14 lowercase alphanumeric characters (regex: `^[a-z0-9]{8,14}$`) |
| Facebook Pixel ID | If provided: must be 12–16 digits (regex: `^\d{12,16}$`) |
| GTM Container ID | If provided: must match regex `^GTM-[A-Z0-9]{6,8}$` |

**Confirmation block for Section 7:**

```
Section 7: Analytics & Tracking (all optional)
────────────────────────────────────
Google Analytics 4 ID:   [value or "—"]
Microsoft Clarity ID:    [value or "—"]
Facebook Pixel ID:       [value or "—"]
GTM Container ID:        [value or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 8: SEO & Identity

I'll ask for optional founder information, founding date, employee count, slogan, geo coordinates, and topics the company is known for.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| **Founder Information** |
| 1 | Founder/Owner name | Optional | Jan Novák |
| 2 | Founder title | Optional | CEO & Founder |
| 3 | Founder LinkedIn URL | Optional | https://linkedin.com/in/jannovak |
| **Company Metadata** |
| 4 | Founding date | Optional | 2018-01-15 or "2018" |
| 5 | Employee count range | Optional | 2-10, 11-50, 51-200, etc. |
| **Slogan (Bilingual)** |
| 6 | Slogan — Czech | Optional | Umělá inteligence pro váš obchod |
| 7 | Slogan — English | Optional | AI for your business |
| **Geographic Information** |
| 8 | Geo latitude | Optional | 50.0755 |
| 9 | Geo longitude | Optional | 14.4378 |
| **Topics & Expertise** |
| 10 | knowsAbout topics | Optional | supply chain, logistics, e-commerce (comma-separated) |

### Collection

**Founder information (all optional):**
- Founder/owner name (full name, e.g., "Jan Novák")
- Founder job title (e.g., "CEO & Growth Strategist")
- Founder LinkedIn URL (e.g., "https://linkedin.com/in/jannovak")

**Company metadata (all optional):**
- Founding date (ISO 8601 format like "2018-01-15" or just year "2018")
- Employee count range (e.g., "2-10", "11-50", "51-200", "201-500", "501-1000", "1000+")

**Slogan in both languages (optional):**
- Slogan in Czech (max 100 chars)
- Slogan in English (max 100 chars)

**Geographic coordinates (optional):**
- Latitude (decimal degrees, e.g., 50.0755 for Prague)
- Longitude (decimal degrees, e.g., 14.4378 for Prague)

**Topics & expertise (optional):**
- Comma-separated list of topics the company is known for (e.g., "supply chain, customer retention, AI integration")

### Validation Rules

| Field | Rule |
|---|---|
| Founder name | If provided: non-empty, 1–100 characters |
| Founder title | If provided: non-empty, 1–100 characters |
| Founder LinkedIn URL | If provided: must start with `https://` |
| Founding date | If provided: ISO 8601 format (YYYY-MM-DD) or just year (YYYY) |
| Employee count | If provided: common ranges like "2-10", "11-50", etc. |
| Slogan (Czech & English) | If provided: non-empty, max 100 characters each |
| Latitude | If provided: valid decimal number (-90.0 to 90.0) |
| Longitude | If provided: valid decimal number (-180.0 to 180.0) |
| Topics | If provided: comma-separated strings, no special operators |

**Confirmation block for Section 8:**

```
Section 8: SEO & Identity
────────────────────────────────────
Founder Information:
  Name:             [value or "—"]
  Title:            [value or "—"]
  LinkedIn URL:     [value or "—"]

Company Metadata:
  Founding date:    [value or "—"]
  Employee count:   [value or "—"]

Slogan:
  Czech:            [value or "—"]
  English:          [value or "—"]

Geographic:
  Latitude:         [value or "—"]
  Longitude:        [value or "—"]

Topics:           [comma-separated or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 9: Page Content — Hero Section

I'll ask for optional hero section copy in both Czech and English: badge text, two headline lines, and subheadline.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| **Hero Badge** |
| 1 | Badge text — Czech | Optional | Bezplatný audit AI |
| 2 | Badge text — English | Optional | Free AI Audit |
| **Headlines** |
| 3 | Headline line 1 — Czech | Optional | Analýza vašeho webu |
| 4 | Headline line 1 — English | Optional | Your website analyzed |
| 5 | Headline line 2 — Czech | Optional | pomocí umělé inteligence |
| 6 | Headline line 2 — English | Optional | by AI in seconds |
| **Subheadline** |
| 7 | Subheadline — Czech | Optional | Získejte konkrétní doporučení pro zlepšení |
| 8 | Subheadline — English | Optional | Get actionable recommendations for improvement |

### Collection

All fields in this section are optional. If left blank, default translations from the template will be used.

**Hero badge (optional):**
- Badge text in Czech (e.g., "Bezplatný audit AI")
- Badge text in English (e.g., "Free AI Audit")

**Headlines (optional):**
- Headline line 1 in Czech (e.g., "Analýza vašeho webu")
- Headline line 1 in English (e.g., "Your website analyzed")
- Headline line 2 in Czech (e.g., "pomocí umělé inteligence")
- Headline line 2 in English (e.g., "by AI in seconds")

**Subheadline (optional):**
- Subheadline in Czech (e.g., "Získejte konkrétní doporučení pro zlepšení")
- Subheadline in English (e.g., "Get actionable recommendations for improvement")

### Validation Rules

| Field | Rule |
|---|---|
| All hero content fields | If provided: non-empty, max 200 characters each |

**Confirmation block for Section 9:**

```
Section 9: Page Content — Hero
────────────────────────────────────
Badge:
  Czech:                [value or "—"]
  English:              [value or "—"]

Headlines:
  Line 1 (Czech):       [value or "—"]
  Line 1 (English):     [value or "—"]
  Line 2 (Czech):       [value or "—"]
  Line 2 (English):     [value or "—"]

Subheadline:
  Czech:                [value or "—"]
  English:              [value or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Optional Advanced Setup

After confirming Section 9, ask:

**"Would you like to customize further? (form fields, pricing, LLM, prompts, search, report, emails) [y/N]"**

If the user answers **no**, skip to "After All Sections Are Confirmed" (write config.json with whatever is collected).

If the user answers **yes**, proceed to Sections 10-16 (Advanced Setup).

---

## Section 10: Form Configuration

I'll ask about pain-point and tool options, and visibility toggles for form fields.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| 1 | List pain points | Optional | Show/add/remove from defaults |
| 2 | List tools | Optional | Show/add/remove from defaults |
| 3 | Show city field? | Optional | yes/no (default: yes) |
| 4 | Show tools section? | Optional | yes/no (default: yes) |
| 5 | Show pain points? | Optional | yes/no (default: yes) |
| 6 | Allow custom "Other" for pain points? | Optional | yes/no (default: yes) |
| 7 | Allow custom "Other" for tools? | Optional | yes/no (default: yes) |

### Collection

**Current pain-point defaults:**
Display the 10 default pain points from config.schema.ts:
1. Acquiring new customers
2. Automating outreach
3. Inbound leads & inquiries
4. Speed to lead
5. Automating communication
6. Repetitive admin tasks
7. Too many tools & systems
8. Integrating AI into processes
9. Creating marketing materials
10. Managing social media

Ask: **"Would you like to [1] keep all defaults, [2] add custom pain points, [3] remove some, or [4] replace all?"**

**Current tool defaults:**
Display the 6 default tools:
1. Microsoft Office 365
2. Google Workspace
3. ChatGPT / AI nástroje
4. CRM systém
5. ERP systém
6. Slack / Microsoft Teams

Ask: **"Would you like to [1] keep all defaults, [2] add custom tools, [3] remove some, or [4] replace all?"**

**Form visibility toggles:**
Ask for each:
- "Show city field? (yes/no, default: yes)"
- "Show tools checklist section? (yes/no, default: yes)"
- "Show pain-points checklist? (yes/no, default: yes)"
- "Allow respondents to type a custom pain point? (yes/no, default: yes)"
- "Allow respondents to type a custom tool? (yes/no, default: yes)"

### Validation Rules

| Field | Rule |
|---|---|
| Pain points | Each must have a value (slug) and bilingual label |
| Tools | Each must have a value (slug) and label |
| Visibility flags | Must be true or false |

**Confirmation block for Section 10:**

```
Section 10: Form Configuration
────────────────────────────────────
Pain Points:  [N items]
  - Acquiring new customers
  - ...

Tools:        [N items]
  - Microsoft Office 365
  - ...

Visibility:
  Show city field:              [yes/no]
  Show tools section:           [yes/no]
  Show pain points section:     [yes/no]
  Allow custom pain point:      [yes/no]
  Allow custom tool:            [yes/no]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 11: Pricing Tiers

I'll ask for currency and up to 3 pricing tier definitions with name, price, description, features, CTA, and featured flag.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| 1 | Currency | Optional | Kč, $, €, etc. (default: Kč) |
| **Tier 1** |
| 2 | Tier 1 name (cs/en) | Optional | Starter, Professional, etc. |
| 3 | Tier 1 price (cs/en) | Optional | Free, 5 000 Kč, etc. |
| 4 | Tier 1 description (cs/en) | Optional | For small teams |
| 5 | Tier 1 features (comma-separated) | Optional | Basic audit, Email report, etc. |
| 6 | Tier 1 CTA text (cs/en) | Optional | Get started, Learn more |
| 7 | Tier 1 CTA URL | Optional | https://example.com/contact |
| 8 | Tier 1 featured? | Optional | yes/no (default: no) |
| 9 | Tier 1 badge (cs/en) | Optional | Most popular, Recommended |
| **Tier 2** |
| 10–17 | (same as Tier 1) |
| **Tier 3** |
| 18–25 | (same as Tier 1) |

### Collection

**Currency:**
Ask: "Currency symbol or code? (default: 'Kč')"

**For each tier (ask if user wants to add tiers):**
Ask: "Add a pricing tier? (yes/no)"

If yes:
- Tier name in Czech & English
- Tier price in Czech & English (e.g., "Free" or "5 000 Kč")
- Tier description in Czech & English (max 100 chars each)
- Comma-separated features (e.g., "Basic audit, Email report, 1 recommendation")
  - For each feature, ask: "Included in this tier? (yes/no)"
- CTA button text in Czech & English
- CTA button URL (optional)
- Featured (visually highlighted) flag (yes/no, default: no)
- Badge text in Czech & English (optional, e.g., "Most popular")

### Validation Rules

| Field | Rule |
|---|---|
| Currency | Non-empty string, max 10 chars (e.g., "Kč", "$", "€") |
| Tier name | Non-empty, bilingual |
| Tier price | Non-empty, bilingual |
| Tier description | Max 100 chars each language |
| Features | Array of objects with text (bilingual) and included (boolean) |
| CTA text | Non-empty, bilingual |
| CTA URL | If provided: must start with `https://`, `http://`, or `/` |
| Featured flag | Boolean |
| Badge | Optional, bilingual if provided |

**Confirmation block for Section 11:**

```
Section 11: Pricing Tiers
────────────────────────────────────
Currency:     [Kč]

Tier 1:
  Name:       [Starter / Začátek]
  Price:      [Free / Zdarma]
  Features:   [Basic audit, Email report]
  CTA:        [Get started / Začít]
  URL:        [value or "—"]
  Featured:   [no]
  Badge:      [value or "—"]

Tier 2:       [similar]
Tier 3:       [similar]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [tier number])"**

---

## Section 12: LLM Configuration

I'll ask for primary and fallback model settings, plus timeout.

### Fields in this section

| # | Field Name | Required | Range / Format | Default |
|---|---|---|---|---|
| **Primary Models** |
| 1 | Primary models | Optional | Comma-separated model IDs | google/gemini-3-flash-preview, google/gemini-3-pro-preview, anthropic/claude-sonnet-4.5 |
| 2 | Primary temperature | Optional | 0.0–1.0 | 0.7 |
| 3 | Primary max tokens | Optional | 16 000–64 000 | 32 000 |
| **Fallback Models** |
| 4 | Fallback models | Optional | Comma-separated model IDs | anthropic/claude-sonnet-4.5, anthropic/claude-3.5-sonnet |
| 5 | Fallback temperature | Optional | 0.0–1.0 | 0.6 |
| **Timeout** |
| 6 | LLM request timeout | Optional | 10 000–60 000 ms | 30 000 |

### Collection

**Primary models:**
Ask: "Primary model list? (comma-separated, e.g., 'google/gemini-3-flash-preview, anthropic/claude-sonnet-4.5') [default shown]"

**Primary temperature:**
Ask: "Primary model temperature? (0.0–1.0, where 0.0 is deterministic and 1.0 is creative, default: 0.7)"

**Primary max tokens:**
Ask: "Primary max tokens per response? (16 000–64 000, default: 32 000)"

**Fallback models:**
Ask: "Fallback model list? (comma-separated, e.g., 'anthropic/claude-sonnet-4.5') [default shown]"

**Fallback temperature:**
Ask: "Fallback temperature? (0.0–1.0, default: 0.6)"

**Timeout:**
Ask: "LLM request timeout in milliseconds? (10 000–60 000, default: 30 000)"

### Validation Rules

| Field | Rule |
|---|---|
| Primary models | Non-empty array of model IDs |
| Primary temperature | Must be between 0.0 and 1.0 |
| Primary max tokens | Must be between 16 000 and 64 000 |
| Fallback models | Non-empty array of model IDs |
| Fallback temperature | Must be between 0.0 and 1.0 |
| Timeout | Must be between 10 000 and 60 000 milliseconds |

**Confirmation block for Section 12:**

```
Section 12: LLM Configuration
────────────────────────────────────
Primary Models:
  Models:           [google/gemini-3-flash-preview, google/gemini-3-pro-preview, anthropic/claude-sonnet-4.5]
  Temperature:      [0.7]
  Max tokens:       [32 000]

Fallback Models:
  Models:           [anthropic/claude-sonnet-4.5, anthropic/claude-3.5-sonnet]
  Temperature:      [0.6]

Timeout:            [30 000 ms]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 13: Prompt Customization

I'll ask for system identity, focus areas, tone, brand mentions, and custom instructions.

### Fields in this section

| # | Field Name | Required | Constraints | Example |
|---|---|---|---|---|
| 1 | System identity | Optional | Max 100 chars, allowed: letters, digits, spaces, diacritics, -&.,!'() | Acme Consulting |
| 2 | Industry context | Optional | Free-form text | Manufacturing, IoT, Industry 4.0 |
| 3 | Focus areas | Optional | Comma-separated | supply chain, lead generation, CRM |
| 4 | Tone | Optional | One of: professional, conversational, technical, consultative (default: professional) | professional |
| 5 | Custom instructions | Optional | Max 2 000 chars | Always mention ROI impact, focus on scalability |

### Collection

**System identity:**
Ask: "System identity for the LLM? (max 100 chars, used to prime the model with who it is; e.g., 'Acme Consulting') [optional]"

**Industry context:**
Ask: "Industry context or description? (e.g., 'Manufacturing, IoT, Industry 4.0') [optional]"

**Focus areas:**
Ask: "What should the audit focus on? (comma-separated, e.g., 'lead generation, CRM integration, marketing automation') [optional]"

**Tone:**
Ask: "Desired tone of the report? (professional / conversational / technical / consultative, default: professional)"

**Custom instructions:**
Ask: "Additional instructions for the LLM? (max 2 000 chars; e.g., 'Always mention ROI, focus on team skills') [optional]"

### Validation Rules

| Field | Rule |
|---|---|
| System identity | If provided: max 100 chars, matches regex `^[a-zA-Z0-9\s\-&.,!'()čďěéíňóřšťúůýžČĎĚÉÍŇÓŘŠŤÚŮÝŽ]+$` |
| System identity | Must NOT contain prompt-injection terms (ignore, override, forget, system:, etc.) |
| Industry context | No strict validation |
| Focus areas | Comma-separated strings |
| Tone | Must be one of: professional, conversational, technical, consultative |
| Custom instructions | If provided: max 2 000 chars |
| Custom instructions | Must NOT contain prompt-injection terms |

**Confirmation block for Section 13:**

```
Section 13: Prompt Customization
────────────────────────────────────
System identity:      [Acme Consulting or "—"]
Industry context:     [Manufacturing, IoT, ... or "—"]
Focus areas:          [supply chain, lead gen, ... or "—"]
Tone:                 [professional]
Custom instructions:  [Always mention ROI, ... or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 14: Search Configuration

I'll ask for max search queries and disabled query types.

### Fields in this section

| # | Field Name | Required | Range / Options | Default |
|---|---|---|---|---|
| 1 | Max search queries | Optional | 1–12 | 6 |
| 2 | Disabled query types | Optional | Comma-separated from: generic, domainSpecific, technology, apps, aiTools | (none) |

### Collection

**Max search queries:**
Ask: "Maximum number of web search queries to run? (1–12, default: 6)"

**Disabled query types:**
Ask: "Disable certain query types? (comma-separated from: generic, domainSpecific, technology, apps, aiTools) [optional]"
Explain: "Example: if you disable 'generic', the audit will skip general industry-wide searches."

### Validation Rules

| Field | Rule |
|---|---|
| Max queries | Must be between 1 and 12 |
| Disabled types | Must be comma-separated strings from the allowed list |
| Constraint | Cannot disable both "generic" and "domainSpecific" — at least one must remain active |

**Confirmation block for Section 14:**

```
Section 14: Search Configuration
────────────────────────────────────
Max search queries:     [6]
Disabled query types:   [value or "none"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 15: Report Configuration

I'll ask for disabled sections, opportunity count, question category count, and CTA button URL.

### Fields in this section

| # | Field Name | Required | Range / Format | Default |
|---|---|---|---|---|
| 1 | Disabled sections | Optional | Comma-separated (cannot include "header" or "footer") | (none) |
| 2 | AI opportunities | Optional | 3–20 | 10 |
| 3 | Question categories | Optional | 3–10 | 7 |
| 4 | Report CTA button URL | Optional | Full or relative URL | (optional) |

### Collection

**Disabled sections:**
Ask: "Hide any report sections? (comma-separated from: benchmark, risk, summary, diagnostic, opportunities, recommendations) [optional]"
Note: "Cannot hide 'header' or 'footer'."

**AI opportunities:**
Ask: "Number of AI-generated opportunities to show? (3–20, default: 10)"

**Question categories:**
Ask: "Number of diagnostic question categories? (3–10, default: 7)"

**Report CTA button URL:**
Ask: "Report CTA button URL? (optional, e.g., 'https://example.com/contact') [optional]"

### Validation Rules

| Field | Rule |
|---|---|
| Disabled sections | Cannot include "header" or "footer" |
| Opportunities | Must be between 3 and 20 |
| Question categories | Must be between 3 and 10 |
| CTA URL | If provided: must start with `https://`, `http://`, or `/` |

**Confirmation block for Section 15:**

```
Section 15: Report Configuration
────────────────────────────────────
Disabled sections:      [value or "none"]
AI opportunities:       [10]
Question categories:    [7]
Report CTA URL:         [value or "—"]
────────────────────────────────────
```

Ask: **"Does this look correct? (yes / edit [field number])"**

---

## Section 16: Email Templates

I'll ask for subject lines for transactional emails in Czech and English.

### Fields in this section

| # | Field Name | Required | Example |
|---|---|---|---|
| **Lead Confirmation Email** |
| 1 | Lead confirmation subject (Czech) | Optional | Díky za vaši účast v auditu |
| 2 | Lead confirmation subject (English) | Optional | Thank you for your audit submission |
| **Report Delivery Email** |
| 3 | Report delivery subject (Czech) | Optional | Váš audit je připraven |
| 4 | Report delivery subject (English) | Optional | Your audit report is ready |
| **Team Notification Email** |
| 5 | Team notification subject (Czech) | Optional | Nový lead: {name} |
| 6 | Team notification subject (English) | Optional | New lead: {name} |

### Collection

**Lead confirmation email (sent to respondent):**
Ask: "Lead confirmation email subject in Czech? [optional]"
Ask: "Lead confirmation email subject in English? [optional]"

**Report delivery email (sent to respondent with report link):**
Ask: "Report delivery email subject in Czech? [optional]"
Ask: "Report delivery email subject in English? [optional]"

**Team notification email (internal, sent to notification recipients):**
Ask: "Team notification email subject in Czech? [optional]"
Ask: "Team notification email subject in English? [optional]"

### Validation Rules

| Field | Rule |
|---|---|
| Subject lines | If provided: non-empty, max 200 characters each |
| Subject lines | May include template variable {name} for personalization |

**Confirmation block for Section 16:**

```
Section 16: Email Templates
────────────────────────────────────
Lead Confirmation:
  Czech:              [value or "—"]
  English:            [value or "—"]

Report Delivery:
  Czech:              [value or "—"]
  English:            [value or "—"]

Team Notification:
  Czech:              [value or "—"]
  English:            [value or "—"]
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
  },
  "analytics": {
    "gaId": "[G-XXXXXXXXXX or empty]",
    "clarityId": "[abc12345 or empty]",
    "facebookPixel": "[numeric id or empty]",
    "gtmContainerId": "[GTM-XXXXXXX or empty]"
  },
  "seo": {
    "founder": {
      "name": "[founder name or empty]",
      "title": "[founder title or empty]",
      "linkedinUrl": "[linkedin url or empty]"
    },
    "foundingDate": "[ISO 8601 date or year or empty]",
    "employeeCount": "[2-10, 11-50, etc. or empty]",
    "slogan": {
      "cs": "[Czech slogan or empty]",
      "en": "[English slogan or empty]"
    },
    "geoCoordinates": {
      "latitude": "[numeric or empty]",
      "longitude": "[numeric or empty]"
    },
    "knowsAbout": ["[topic1]", "[topic2]"]
  },
  "content": {
    "hero": {
      "badge": {
        "cs": "[Czech badge or empty]",
        "en": "[English badge or empty]"
      },
      "headline1": {
        "cs": "[Czech headline 1 or empty]",
        "en": "[English headline 1 or empty]"
      },
      "headline2": {
        "cs": "[Czech headline 2 or empty]",
        "en": "[English headline 2 or empty]"
      },
      "subheadline": {
        "cs": "[Czech subheadline or empty]",
        "en": "[English subheadline or empty]"
      }
    },
    "pricing": {
      "currency": "[Kč or $ or €]",
      "tiers": [
        {
          "name": { "cs": "[name]", "en": "[name]" },
          "price": { "cs": "[price]", "en": "[price]" },
          "description": { "cs": "[desc]", "en": "[desc]" },
          "ctaText": { "cs": "[cta]", "en": "[cta]" },
          "ctaUrl": "[url or empty]",
          "featured": false,
          "badge": { "cs": "[badge or empty]", "en": "[badge or empty]" },
          "features": [
            { "text": { "cs": "[feature]", "en": "[feature]" }, "included": true }
          ]
        }
      ]
    }
  },
  "auditForm": {
    "painPoints": [
      { "value": "new_customers", "label": { "cs": "...", "en": "..." } }
    ],
    "tools": [
      { "value": "microsoft_office", "label": "Microsoft Office 365" }
    ],
    "showCity": true,
    "showTools": true,
    "showPainPoints": true,
    "allowCustomPainPoint": true,
    "allowCustomTool": true
  },
  "llm": {
    "primary": {
      "models": ["google/gemini-3-flash-preview", "anthropic/claude-sonnet-4.5"],
      "temperature": 0.7,
      "maxTokens": 32000
    },
    "fallback": {
      "models": ["anthropic/claude-sonnet-4.5"],
      "temperature": 0.6,
      "maxTokens": 32000
    },
    "timeout": 30000
  },
  "prompt": {
    "systemIdentity": "[identity or empty]",
    "industryContext": "[context or empty]",
    "focusAreas": ["[area1]", "[area2]"],
    "tone": "professional",
    "customInstructions": "[instructions or empty]"
  },
  "search": {
    "maxQueries": 6,
    "disabledQueryTypes": ["[type1]"]
  },
  "report": {
    "opportunityCount": 10,
    "questionCategoryCount": 7,
    "cta": {
      "buttonUrl": "[url or empty]"
    }
  },
  "email": {
    "leadConfirm": {
      "subject": { "cs": "[subject]", "en": "[subject]" }
    },
    "reportDelivery": {
      "subject": { "cs": "[subject]", "en": "[subject]" }
    },
    "teamNotification": {
      "subject": { "cs": "[subject]", "en": "[subject]" }
    }
  }
}
```

Save this to `/config.json` at the repository root.

### Step 2: Validate config.json

Read `config.schema.ts` and use its `validateConfig()` function logic to validate the written config.json. Check for:

**Basic validation (Sections 1-6):**
- All required fields are non-empty
- Email fields match the email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Hex colors match the color regex `^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`
- IČO (if provided) matches `^\d{6,8}$`
- DIČ (if provided) matches `^CZ\d{8,10}$`
- Team array has at least 1 member
- Notification recipients array has at least 1 email
- URLs (if provided) start with `https://`, `http://`, or `/`

**Analytics validation (Section 7):**
- Google Analytics 4 ID (if provided) matches `^G-[A-Z0-9]{6,12}$`
- Microsoft Clarity ID (if provided) matches `^[a-z0-9]{8,14}$` (8-14 lowercase alphanumeric)
- Facebook Pixel ID (if provided) matches `^\d{12,16}$` (12-16 digits)
- GTM Container ID (if provided) matches `^GTM-[A-Z0-9]{6,8}$`

**SEO validation (Section 8):**
- Founder LinkedIn URL (if provided) starts with `https://`
- Latitude (if provided) is a valid decimal number between -90.0 and 90.0
- Longitude (if provided) is a valid decimal number between -180.0 and 180.0

**Form validation (Section 10):**
- Pain points and tools arrays have at least one item if provided
- Visibility flags are boolean

**LLM validation (Section 12):**
- Primary and fallback models are non-empty arrays (if provided)
- Temperature values are between 0.0 and 1.0
- maxTokens values are between 16,000 and 64,000
- Timeout is between 10,000 and 60,000 milliseconds

**Prompt validation (Section 13):**
- systemIdentity max 100 characters, matches allowed character set
- systemIdentity and customInstructions do NOT contain prompt-injection terms (ignore, override, forget, system:, role:, etc.)
- customInstructions max 2,000 characters

**Search validation (Section 14):**
- maxQueries is between 1 and 12
- Cannot disable both "generic" and "domainSpecific"

**Report validation (Section 15):**
- opportunityCount is between 3 and 20
- questionCategoryCount is between 3 and 10
- Disabled sections do not include "header" or "footer"

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

