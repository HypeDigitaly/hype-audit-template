# Email System Documentation

## Overview

The HypeDigitaly web platform uses **Resend** for transactional email delivery across four distinct lead sources. This document provides comprehensive technical specifications for email workflows, template management, and failure handling patterns.

- **Email Service:** [Resend](https://resend.com/) (API-based, no SMTP)
- **API Endpoint:** `https://api.resend.com/emails` (POST)
- **Authentication:** Bearer token via `RESEND_API_KEY` environment variable
- **Bilingual Support:** Czech (cs) and English (en)
- **Failure Isolation:** Email failures do NOT block lead storage or user responses

---

## 1. Resend API Integration

### 1.1 Authentication & Endpoint

**Request Format:**
```bash
POST https://api.resend.com/emails
Authorization: Bearer $RESEND_API_KEY
Content-Type: application/json
```

**Environment Variable:**
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
```

### 1.2 Basic Payload Structure

```json
{
  "from": "Display Name <noreply@notifications.hypedigitaly.ai>",
  "to": ["recipient@example.com"],
  "reply_to": "optional@example.com",
  "subject": "Email Subject",
  "html": "<html>...</html>",
  "text": "Plain text version (fallback)",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64-encoded-content"
    }
  ]
}
```

### 1.3 Headers Used

| Header | Value |
|--------|-------|
| `Authorization` | `Bearer $RESEND_API_KEY` |
| `Content-Type` | `application/json` |

### 1.4 Response Handling

**Success (2xx):**
```json
{
  "id": "email_xxx",
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

**Error (4xx/5xx):**
```json
{
  "message": "Invalid email address"
}
```

**Pattern:** Check `response.ok` then await `response.json()` for error details.

---

## 2. Email Flows by Lead Source

### 2.1 Contact Form (`contact.ts`)

**Source:** Homepage contact form + service landing pages
**Template Module:** `email-templates.ts`
**Lead Store:** Netlify Blobs (`contact-leads`)

#### Flow:

1. **Validation** → Check required fields (name, email)
2. **Notification Email** → Send to team
3. **Lead Storage** → Save to Blobs and Netlify Forms (non-blocking)
4. **Confirmation Email** → Send to user (non-blocking)

#### Notification Email (To Team)

| Field | Value |
|-------|-------|
| **From** | `HypeDigitaly <noreply@notifications.hypedigitaly.ai>` |
| **To** | `pavelcermak@hypedigitaly.ai`, `cermakova@hypedigitaly.ai` |
| **Reply-To** | User's email |
| **Subject** | `🆕 Nový zájemce: {name} – {service}` |
| **Language** | Always Czech (team preference) |
| **Template** | `generateNotificationEmailHTML()` / `generateNotificationEmailText()` |

**Email Sections:**
- Header with logo and metadata (user language displayed)
- Contact info (name, email, phone, website)
- Service interest (with localized label from `SERVICE_LABELS_CS`)
- Budget tier (one-time and monthly, labeled)
- Message (if provided)
- Call-to-action button ("Odpovědět zájemci" — "Reply to lead")
- Footer with timestamp and site link

**Example Rendered Subject:**
```
🆕 Nový zájemce: Jan Novotný – AI Chatbot
```

#### Confirmation Email (To User)

| Field | Value |
|-------|-------|
| **From** | `HypeDigitaly <noreply@notifications.hypedigitaly.ai>` |
| **To** | User's email |
| **Subject** | Bilingual: `Potvrzení: Vaše poptávka...` (CS) or `Confirmation: Your inquiry...` (EN) |
| **Language** | User's choice (from form) |
| **Template** | `generateConfirmationEmailHTML()` / `generateConfirmationEmailText()` |

**Email Sections:**
- Bilingual greeting
- Confirmation message with service name
- Free consultation booking CTA (Cal.com link)
- Case studies section with blog post and stats
- YouTube video embed
- Social media links (LinkedIn, Instagram, Facebook, YouTube)
- Footer with tagline

**Bilingual Content (from `contact.ts`):**
```javascript
const lang = formData.language || 'cs';
const confirmationSubject = lang === 'en'
  ? `Confirmation: Your inquiry to HypeDigitaly has been received`
  : `Potvrzení: Vaše poptávka pro HypeDigitaly byla přijata`;
```

#### Service Labels (Bilingual)

**Czech (`SERVICE_LABELS_CS`):**
```
audit → "AI Audit"
chatbot → "AI Chatbot"
voicebot → "AI Voicebot"
agent → "AI Agent"
automation → "Automatizace procesů"
dev → "Vývoj aplikací"
web → "Web Design"
consult → "AI Konzultace"
dataprep → "Příprava dat (RAGus.ai)"
other → "Jiné"
```

**English (`SERVICE_LABELS_EN`):**
```
audit → "AI Audit"
chatbot → "AI Chatbot"
voicebot → "AI Voicebot"
agent → "AI Agent"
automation → "Process Automation"
dev → "App Development"
web → "Web Design"
consult → "AI Consultation"
dataprep → "Data Preparation (RAGus.ai)"
other → "Other"
```

#### Code Example (Notification)

```typescript
// From contact.ts lines 263-277
const notificationResponse = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "HypeDigitaly <noreply@notifications.hypedigitaly.ai>",
    to: ["pavelcermak@hypedigitaly.ai", "cermakova@hypedigitaly.ai"],
    reply_to: formData.email,
    subject: `🆕 Nový zájemce: ${formData.name} – ${serviceLabel}`,
    html: notificationHtml,
    text: notificationText,
  }),
});
```

---

### 2.2 AI Audit (`audit.ts` & `audit-background.ts`)

**Source:** Dedicated audit page or homepage hero section
**Template Module:** `audit-templates.ts`
**Lead Store:** Netlify Blobs (`audit-leads` + `audit-reports`)

#### Flow:

1. **Form Validation** → Validate 6 fields (email, website, company, city, pain point, tools)
2. **AI Research Agent** → Execute LangGraph with Tavily Web Search
3. **Report Generation** → Create HTML report, store in Blobs
4. **Notification Email** → Send to team with report link
5. **Confirmation Email** → Send to user with report link (bilingual)

#### Notification Email (To Team)

| Field | Value |
|--------|-------|
| **From** | `HypeDigitaly <noreply@notifications.hypedigitaly.ai>` |
| **To** | `pavelcermak@hypedigitaly.ai`, `cermakova@hypedigitaly.ai` |
| **Reply-To** | User's email |
| **Subject** | `Nový lead: AI Předběžný audit - {company}` (CS) or `Lead: AI Preliminary Audit...` (EN) |
| **Language** | Always Czech (team preference) |
| **Template** | `generateAuditNotificationEmailHTML()` / `generateAuditNotificationEmailText()` |

**Email Sections:**
- Company name, website, email, city
- Biggest pain point
- Current tools used
- Link to report (clickable button)

**Report Link Pattern:**
```
https://hypedigitaly.ai/report/{reportId}
```

#### Confirmation Email (To User)

| Field | Value |
|--------|-------|
| **From** | `HypeDigitaly <noreply@notifications.hypedigitaly.ai>` |
| **To** | User's email |
| **Subject** | `AI Předběžný audit pro {company}` (CS) or `AI Preliminary audit for {company}` (EN) |
| **Language** | User's choice from form |
| **Template** | `generateAuditConfirmationEmailHTML()` / `generateAuditConfirmationEmailText()` |

**Email Sections:**
- Bilingual greeting and introduction
- Direct link to report (button)
- Explanation of report contents and recommendations
- Meeting booking CTA (Cal.com link)
- Company address, CEO contact info
- Google Reviews link
- Social media links
- Footer

**Code Example (from `audit.ts` lines 349-365):**
```typescript
const notificationResponse = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "HypeDigitaly <noreply@notifications.hypedigitaly.ai>",
    to: NOTIFICATION_RECIPIENTS,  // ["pavelcermak@hypedigitaly.ai", "cermakova@hypedigitaly.ai"]
    reply_to: formData.email,
    subject: isCzech
      ? `Nový lead: AI Předběžný audit - ${formData.companyName || formData.website}`
      : `Lead: AI Preliminary Audit - ${formData.companyName || formData.website}`,
    html: notificationHtml,
    text: notificationText,
  }),
});
```

#### Report Storage & Expiration

- **Store:** Netlify Blobs (`audit-reports`)
- **Key Format:** `{reportId}` (e.g., `audit-uuid-timestamp`)
- **Expiration:** 30 days from generation
- **URL Pattern:** `https://hypedigitaly.ai/report/{reportId}`

---

### 2.3 Pain-Point Survey (`survey.ts`)

**Source:** Google Cloud event page and dedicated survey page
**Template Module:** `survey-templates.ts`
**Lead Store:** Netlify Blobs (`survey-leads`)

#### Flow:

1. **Validation** → Check required fields (email, company, pain points, size, industry)
2. **Rate Limiting** → Max 5 requests per hour per IP
3. **Lead Storage** → Save to Blobs and Netlify Forms
4. **Notification Email** → Send to team (always Czech)
5. **Confirmation Email** → Send to user (bilingual)

#### Notification Email (To Team)

| Field | Value |
|--------|-------|
| **From** | `HypeDigitaly Pruzkum <noreply@notifications.hypedigitaly.ai>` |
| **To** | `pavelcermak@hypedigitaly.ai`, `cermakova@hypedigitaly.ai` |
| **Subject** | `Nový průzkum: {company} ({industry})` |
| **Language** | Always Czech |
| **Template** | `generateSurveyNotificationEmailHTML()` |

**Email Sections:**
- Contact info (name, email, company, industry, size)
- Pain points (human-readable labels from `PAIN_POINT_LABELS_CS`)
- AI maturity level
- Hours lost per week
- Additional context (tools, CRM, ERP, tech openness)
- City, phone number (if provided)

**Code Example (from `survey.ts` lines 514-526):**
```typescript
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'HypeDigitaly Pruzkum <noreply@notifications.hypedigitaly.ai>',
    to: ['pavelcermak@hypedigitaly.ai', 'cermakova@hypedigitaly.ai'],
    subject: `Nový průzkum: ${lead.companyName} (${lead.industry})`.substring(0, 120),
    html: generateSurveyNotificationEmailHTML(lead),
  }),
});
```

#### Confirmation Email (To User)

| Field | Value |
|--------|-------|
| **From** | `HypeDigitaly <noreply@notifications.hypedigitaly.ai>` |
| **To** | User's email |
| **Subject** | User's language preference |
| **Language** | Bilingual (CS/EN) |
| **Template** | `generateSurveyConfirmationEmailHTML()` |

**Email Sections:**
- Bilingual thank-you message
- Summary of survey responses
- AI resources and next steps
- Booking CTA
- Social media links

#### Pain Point Labels (Sample)

**Czech (`PAIN_POINT_LABELS_CS`):**
```
new_customers → "Shánění nových zákazníků..."
speed_to_lead → "Pomalé odpovídání na poptávky..."
automating_communication → "Ruční posílání e-mailů..."
customer_support → "Lidi v týmu pořád dokola řeší stejné dotazy..."
boring_admin → "Administrativa, co by zvládl i stroj..."
// ... 17+ more pain point labels
```

**English (`PAIN_POINT_LABELS_EN`):**
```
new_customers → "Finding and qualifying new customers"
speed_to_lead → "Slow response to inquiries"
automating_communication → "Automating customer communication"
// ... etc
```

---

### 2.4 Pricing Calculator (`pricing-lead.ts`)

**Source:** HypeLead pricing calculator page
**Template Module:** `pricing-templates.ts`
**Lead Store:** Netlify Blobs (`pricing-leads`)

#### Flow:

1. **Validation** → Check required fields (name, email, company, PDF)
2. **Security Checks** → Honeypot, timing, rate limit, PDF validation
3. **Lead Storage** → Save to Blobs
4. **Confirmation Email** → Send to user with **PDF attachment**
5. **Notification Email** → Send to team (no attachment)

#### Notification Email (To Team)

| Field | Value |
|--------|-------|
| **From** | `HypeLead.ai <noreply@notifications.hypedigitaly.ai>` |
| **To** | `pavelcermak@hypedigitaly.ai` |
| **Subject** | `Nový zájemce z ceníku: {name}` |
| **Language** | Always Czech |
| **Template** | `generatePricingNotificationEmailHTML()` / `generatePricingNotificationPlainText()` |

**Email Sections:**
- Contact info (name, email, company, language, timestamp)
- Calculator configuration (support level, volumes, campaigns)
- Calculated results (setup fee, monthly fee, savings %)
- UTM tracking data (if present)
- Call-to-action button

**Code Example (from `pricing-lead.ts` lines 440-451):**
```typescript
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: "HypeLead.ai <noreply@notifications.hypedigitaly.ai>",
    to: "pavelcermak@hypedigitaly.ai",
    subject: `Nový zájemce z ceníku: ${name}`,
    html: generatePricingNotificationEmailHTML(templateLead),
    text: generatePricingNotificationPlainText(templateLead),
  }),
});
```

#### Confirmation Email (To User) — WITH PDF ATTACHMENT

| Field | Value |
|--------|-------|
| **From** | `HypeLead.ai <noreply@notifications.hypedigitaly.ai>` |
| **To** | User's email |
| **Reply-To** | `pavelcermak@hypedigitaly.ai` |
| **Subject** | `Vaše cenová nabídka HypeLead.ai` (CS) or `Your HypeLead.ai Price Quote` (EN) |
| **Language** | User's choice |
| **Attachment** | `hypelead-cenova-nabidka.pdf` (base64) |
| **Template** | `generatePricingConfirmationEmailHTML()` / `generatePricingConfirmationPlainText()` |

**Attachment Details:**

```typescript
attachments: [
  {
    filename: "hypelead-cenova-nabidka.pdf",
    content: cleanBase64Pdf  // Base64-encoded PDF binary
  }
]
```

**PDF Validation (from `pricing-lead.ts` lines 352-366):**
- Magic bytes check: First 4 bytes must be `%PDF` (0x25 0x50 0x44 0x46)
- Trailer check: Last 1024 bytes must contain `%%EOF`
- Size limit: ≤ 1 MB (base64)

**Code Example (from `pricing-lead.ts` lines 421-434):**
```typescript
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${RESEND_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: "HypeLead.ai <noreply@notifications.hypedigitaly.ai>",
    to: email,
    reply_to: "pavelcermak@hypedigitaly.ai",
    subject: getPricingConfirmationSubject(language),
    html: generatePricingConfirmationEmailHTML(templateLead, language),
    text: generatePricingConfirmationPlainText(templateLead, language),
    attachments: [
      {
        filename: "hypelead-cenova-nabidka.pdf",
        content: cleanBase64Pdf
      }
    ],
  }),
});
```

**Email Sections:**
- Bilingual greeting
- Statement about PDF attachment
- Quote summary (package, volumes, pricing)
- Call-to-action email link
- Footer

---

## 3. From Headers Reference

All emails are sent from a single domain: `notifications.hypedigitaly.ai`

### From Headers by Function

| Function | Notification From | User Confirmation From |
|----------|------------------|----------------------|
| **contact.ts** | `HypeDigitaly <noreply@...>` | `HypeDigitaly <noreply@...>` |
| **audit.ts** | `HypeDigitaly <noreply@...>` | `HypeDigitaly <noreply@...>` |
| **survey.ts** | `HypeDigitaly Pruzkum <noreply@...>` | `HypeDigitaly <noreply@...>` |
| **pricing-lead.ts** | `HypeLead.ai <noreply@...>` | `HypeLead.ai <noreply@...>` |

**Full Format:**
- `HypeDigitaly <noreply@notifications.hypedigitaly.ai>`
- `HypeDigitaly Pruzkum <noreply@notifications.hypedigitaly.ai>` (Survey only)
- `HypeLead.ai <noreply@notifications.hypedigitaly.ai>` (Pricing only)

---

## 4. Team Notification Recipients

**All lead sources notify the same two team members:**

```typescript
const NOTIFICATION_RECIPIENTS = [
  "pavelcermak@hypedigitaly.ai",
  "cermakova@hypedigitaly.ai",
];
```

**Defined in:**
- `contact.ts` (line 26-29)
- `audit-shared/types.ts` (line 21-24) — imported by `audit.ts` and `audit-background.ts`
- `survey.ts` (hardcoded on line 522)
- `pricing-lead.ts` (hardcoded on line 446)

---

## 5. Bilingual Content Strategy

All user-facing confirmation emails support two languages: **Czech (cs)** and **English (en)**.

### 5.1 Language Detection

```typescript
const lang = formData.language || 'cs';  // Default to Czech
```

Language is explicitly submitted by the form and stored in the lead object.

### 5.2 Bilingual Implementation Pattern

Example from `email-templates.ts` (generateConfirmationEmailHTML):

```typescript
const content = {
  cs: {
    title: "Děkujeme za Váš dotaz!",
    greeting: `Dobrý den, ${name},`,
    body: "Děkujeme za Váš zájem...",
  },
  en: {
    title: "Thank you for your inquiry!",
    greeting: `Hello ${name},`,
    body: "Thank you for your interest...",
  }
};

const t = content[lang];
return `<html>...<h1>${t.title}</h1>...<p>${t.greeting}</p>...`;
```

### 5.3 Label Localization

Service labels, budget tiers, pain points, and AI maturity levels are stored as language-keyed maps:

```typescript
// Service labels (contact form)
SERVICE_LABELS_CS: { audit: "AI Audit", chatbot: "AI Chatbot", ... }
SERVICE_LABELS_EN: { audit: "AI Audit", chatbot: "AI Chatbot", ... }

// Pain points (survey)
PAIN_POINT_LABELS_CS: { new_customers: "Shánění nových...", ... }
PAIN_POINT_LABELS_EN: { new_customers: "Finding and qualifying...", ... }
```

**Helper functions:**
```typescript
function getServiceLabel(service: string | undefined, lang: EmailLanguage): string {
  const labels = lang === 'en' ? SERVICE_LABELS_EN : SERVICE_LABELS_CS;
  return service ? labels[service] || service : fallback;
}
```

---

## 6. Failure Handling & Isolation Pattern

**Critical principle:** Email failures do NOT block lead storage or user-facing responses.

### 6.1 Isolation Pattern

**All email sends are wrapped in try-catch and are non-blocking:**

From `contact.ts` (lines 332-357):
```typescript
try {
  const confirmationResponse = await fetch("https://api.resend.com/emails", {
    // ... email payload
  });

  if (!confirmationResponse.ok) {
    const errorData = await confirmationResponse.json();
    console.error("Confirmation email failed (non-blocking):", errorData);
    // Don't throw — let the function continue
  }
} catch (confError) {
  console.error("Error sending confirmation email (non-blocking):", confError);
  // Don't throw — let the function continue
}
```

### 6.2 Non-Blocking Lead Storage

Lead storage in Netlify Blobs and Netlify Forms submission also use non-blocking patterns:

From `contact.ts`:
```typescript
// Store in Blobs (non-blocking)
await storeContactLead(contactLead);

// Submit to Netlify Forms (non-blocking)
await submitToNetlifyForms(formData);
```

Both are awaited before sending confirmation email, but failures are logged and don't throw.

### 6.3 Parallel Email Sends

Pricing and Survey functions use `Promise.allSettled()` to send multiple emails in parallel:

From `pricing-lead.ts` (lines 418-456):
```typescript
await Promise.allSettled([
  // User email with PDF attachment
  (async () => {
    try {
      const res = await fetch("https://api.resend.com/emails", { ... });
      if (!res.ok) console.error(`User email failed (${res.status})`);
    } catch (e) { console.error("User email send error:", e); }
  })(),
  // Team notification
  (async () => {
    try {
      const res = await fetch("https://api.resend.com/emails", { ... });
      if (!res.ok) console.error(`Team notification failed (${res.status})`);
    } catch (e) { console.error("Team notification send error:", e); }
  })(),
]);
```

**Key benefit:** If one email fails, the other still sends. If both fail, the function still returns `statusCode: 200`.

### 6.4 Response to User

Always return success to the user, even if emails fail:

```typescript
return {
  statusCode: 200,
  headers,
  body: JSON.stringify({
    success: true,
    message: "Zpráva byla úspěšně odeslána!"
  }),
};
```

**Rationale:** Lead is already stored. Email delivery is best-effort. User sees success regardless.

---

## 7. Template Files Reference

### 7.1 Contact Form Templates

**File:** `email-templates.ts`
**Functions:**
- `generateNotificationEmailHTML(data: ContactFormData): string`
- `generateNotificationEmailText(data: ContactFormData): string`
- `generateConfirmationEmailHTML(data: ContactFormData): string`
- `generateConfirmationEmailText(data: ContactFormData): string`

**Data Interface:**
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  service?: string;
  budget_onetime?: string;
  budget_monthly?: string;
  message?: string;
  language?: EmailLanguage;
  leadSource?: string;
  // UTM tracking fields
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  // ... more tracking fields
}
```

### 7.2 AI Audit Templates

**File:** `audit-templates.ts`
**Functions:**
- `generateAuditNotificationEmailHTML(data: AuditFormData, reportId: string, reportUrl: string): string`
- `generateAuditNotificationEmailText(...): string`
- `generateAuditConfirmationEmailHTML(...): string`
- `generateAuditConfirmationEmailText(...): string`

**Data Interface:**
```typescript
interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  industry: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}
```

### 7.3 Survey Templates

**File:** `survey-templates.ts`
**Functions:**
- `generateSurveyNotificationEmailHTML(lead: SurveyLead): string`
- `generateSurveyConfirmationEmailHTML(lead: SurveyLead): string`
- `getSurveyConfirmationSubject(lang: EmailLanguage): string`

**Data Interface:**
```typescript
interface SurveyLead {
  id: string;
  source: 'survey';
  email: string;
  companyName: string;
  industry: string;
  companySize: 'solo' | '2-10' | '11-50' | '51-250' | '250+';
  painPoints: string[];
  primaryPainPoint: string;
  aiMaturity: 'none' | 'experimenting' | 'active' | '';
  hoursLostPerWeek: string;
  contextNote: string;
  language: 'cs' | 'en';
  // ... more fields
}
```

### 7.4 Pricing Calculator Templates

**File:** `pricing-templates.ts`
**Functions:**
- `generatePricingConfirmationEmailHTML(lead: PricingLeadData, lang: 'cs' | 'en'): string`
- `generatePricingConfirmationPlainText(lead: PricingLeadData, lang: 'cs' | 'en'): string`
- `getPricingConfirmationSubject(lang: 'cs' | 'en'): string`
- `generatePricingNotificationEmailHTML(lead: PricingLeadData): string`
- `generatePricingNotificationPlainText(lead: PricingLeadData): string`

**Data Interface:**
```typescript
interface PricingLeadData {
  name: string;
  email: string;
  companyName: string;
  language: 'cs' | 'en';
  submittedAt: string;
  calculatorState: {
    dailyCompanies: number;
    emailDomains: number;
    emailAddresses: number;
    campaigns: number;
    supportLevel: string;
  };
  calculatorResults: {
    monthlyCompanies: number;
    setupFee: number;
    monthlyFee: number;
    total3Months: number;
    equivalentSalespeople: number;
    salesTeamCost: number;
    savingsPercent: number;
  };
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}
```

---

## 8. HTML Email Design Standards

### 8.1 Design Patterns

**All HTML emails follow these conventions:**

1. **DOCTYPE & Meta Tags:** Proper HTML5 with charset UTF-8
2. **Color Scheme:** Dark theme matching brand
   - Background: `#0a0a0a` or `#1a1a1a` (outer)
   - Container: `#111111`
   - Text: `#ffffff` (primary), `rgba(255,255,255,0.x)` (secondary)
   - Accent: `#00A39A` (teal)
3. **Typography:** System font stack
   ```
   -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
   ```
4. **Layout:** Nested tables for email client compatibility
5. **Gradients:** Used for headers and CTAs

### 8.2 CTA Buttons

**Standard style:**
```html
<a href="..." style="
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #00A39A 0%, #008f87 100%);
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0,163,154,0.4);
">
  Action Button
</a>
```

### 8.3 XSS Prevention

All user input is escaped using HTML entity encoding:

```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

**Applied to:** Company name, user email, service labels, budget tiers, message content.

---

## 9. Security Measures

### 9.1 Input Validation

**All functions validate before sending emails:**

| Function | Validations |
|----------|-------------|
| `contact.ts` | Email regex, required fields (name, email) |
| `audit.ts` | Email regex, required fields, AI validation |
| `survey.ts` | Email regex, enum allowlists, pain point array, rate limit |
| `pricing-lead.ts` | Email regex, PDF magic bytes, base64 encoding, rate limit, honeypot |

### 9.2 CORS Locked Domains

Survey and Pricing functions lock CORS to origin:

```typescript
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://hypedigitaly.ai",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```

### 9.3 Honeypot & Timing Checks

Pricing calculator (lines 250-261):
```typescript
// Honeypot: silent 200 if field is filled (indicates bot)
const honeypot = body.honeypot;
if (typeof honeypot === "string" && honeypot !== "") {
  return { statusCode: 200, ... };
}

// Timing: silent 200 if form submitted < 3 seconds (indicates automation)
if (ts > 0 && Date.now() - ts < 3000) {
  return { statusCode: 200, ... };
}
```

### 9.4 Rate Limiting

| Function | Limit | Window | Key |
|----------|-------|--------|-----|
| **pricing-lead.ts** | 3 req/IP | 1 hour | `pricing-ratelimit` store |
| **survey.ts** | 5 req/IP | 1 hour | `survey-ratelimit` store |

Failures to rate-check fail open (don't block legitimate traffic).

---

## 10. Environment Configuration

### 10.1 Required Environment Variables

```bash
# Email service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx

# Netlify Blobs (for lead storage)
NETLIFY_SITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NETLIFY_API_TOKEN=nfp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# AI Audit dependencies (audit.ts only)
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 10.2 Deployment

**Netlify Functions:** Environment variables are configured in Netlify dashboard under **Site settings > Build & deploy > Environment**.

**Local Testing:** Use `.env.local` (not committed to git).

---

## 11. Monitoring & Debugging

### 11.1 Log Patterns

All functions log at key checkpoints:

```typescript
// Success
console.log("[Contact] Notification email sent");
console.log("[Audit] Confirmation email sent successfully");

// Failure (non-blocking)
console.warn("[Contact] Lead storage failed:", error);
console.error("[Audit] Notification email failed:", errorData);

// Security
console.warn("[SECURITY] Honeypot triggered");
console.warn("[SECURITY] Timing check failed");
```

### 11.2 Debugging Email Sends

**Check in Netlify Functions logs:**
1. Authorization header presence (`Bearer ${RESEND_API_KEY}`)
2. Response status code (should be 200-201 for success)
3. Error JSON from Resend (if response not ok)
4. Lead ID and email address (for correlation)

**Example error:**
```
Confirmation email failed (non-blocking): { message: "Invalid email address" }
```

---

## 12. Testing Checklist

### 12.1 Email Sending

- [ ] Notification email arrives at team address within 60 seconds
- [ ] User confirmation email arrives at submitted address within 60 seconds
- [ ] Emails render correctly in Gmail, Outlook, Apple Mail
- [ ] Links are clickable and unbroken
- [ ] Bilingual content displays in correct language
- [ ] PDF attachment (pricing) is valid and downloadable

### 12.2 Failure Isolation

- [ ] Form submission succeeds even if notification email fails
- [ ] Lead is stored in Blobs even if any email fails
- [ ] User receives HTTP 200 response even if both emails fail
- [ ] Error logs contain Resend error details for debugging

### 12.3 Security

- [ ] XSS attempts in free-text fields are escaped
- [ ] Rate limit blocks excessive submissions
- [ ] Honeypot doesn't break legitimate submissions
- [ ] PDF validation rejects invalid/malicious files
- [ ] CORS prevents cross-origin abuse

### 12.4 Bilingual Content

- [ ] CS language selection sends Czech emails
- [ ] EN language selection sends English emails
- [ ] Notification emails are always Czech (team language)
- [ ] Service labels render in correct language
- [ ] Pain point labels render in correct language

---

## 13. Resend API Documentation Links

- **API Docs:** https://resend.com/docs/api-reference/emails/send
- **Email Templates Guide:** https://resend.com/docs/templates
- **Attachments Guide:** https://resend.com/docs/features/attachments
- **Bounces & Suppressions:** https://resend.com/docs/features/bounces

---

## 14. Common Resend Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid email address` | Bad format in `to` field | Validate regex before sending |
| `Missing required header "Authorization"` | No RESEND_API_KEY set | Check environment variables |
| `Invalid API key` | Wrong or expired key | Rotate key in Resend dashboard |
| `Rate limit exceeded` | Too many requests from IP | Add request throttling |
| `Email send failed` | Temporary service outage | Retry with exponential backoff |

---

## 15. Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│              LEAD SUBMISSION FORMS                       │
│  (Contact, Audit, Survey, Pricing Calculator)            │
└────────────────┬────────────────────────────────────────┘
                 │ POST to Netlify Function
                 ↓
    ┌────────────────────────────────┐
    │   INPUT VALIDATION & SECURITY   │
    │  (Regex, Rate Limit, Honeypot)  │
    └────────────┬───────────────────┘
                 │
    ┌────────────v───────────────────┐
    │   LEAD STORAGE (Netlify Blobs)  │
    │   (Non-blocking, auto-retry)    │
    └────────────┬───────────────────┘
                 │
    ┌────────────v───────────────────┐
    │   EMAIL GENERATION              │
    │  (Template rendering, escape)    │
    └────────────┬───────────────────┘
                 │
    ┌────────────v───────────────────┐
    │  RESEND API (Parallel requests) │
    │  1. Notification (to team)      │
    │  2. Confirmation (to user)      │
    │  (with optional PDF attachment) │
    └────────────┬───────────────────┘
                 │
    ┌────────────v───────────────────┐
    │  FAILURE ISOLATION              │
    │  Email failures don't block OK  │
    └────────────┬───────────────────┘
                 │
    ┌────────────v───────────────────┐
    │  RESPONSE TO USER               │
    │  HTTP 200 (always, even if fail)│
    └────────────────────────────────┘
```

---

## Appendix: Template Export List

### Contact Form (`email-templates.ts`)

1. `generateNotificationEmailHTML(data)`
2. `generateNotificationEmailText(data)`
3. `generateConfirmationEmailHTML(data)`
4. `generateConfirmationEmailText(data)`
5. `SERVICE_LABELS_CS`, `SERVICE_LABELS_EN`
6. `BUDGET_ONETIME_LABELS_CS`, `BUDGET_ONETIME_LABELS_EN`
7. `BUDGET_MONTHLY_LABELS_CS`, `BUDGET_MONTHLY_LABELS_EN`

### Audit (`audit-templates.ts`)

1. `generateAuditNotificationEmailHTML(data, reportId, reportUrl)`
2. `generateAuditNotificationEmailText(data, reportId, reportUrl)`
3. `generateAuditConfirmationEmailHTML(data, reportId, reportUrl)`
4. `generateAuditConfirmationEmailText(data, reportId, reportUrl)`

### Survey (`survey-templates.ts`)

1. `generateSurveyNotificationEmailHTML(lead)`
2. `generateSurveyConfirmationEmailHTML(lead)`
3. `getSurveyConfirmationSubject(lang)`
4. `PAIN_POINT_LABELS_CS`, `PAIN_POINT_LABELS_EN`
5. `AI_MATURITY_LABELS_CS`
6. `COMPANY_SIZE_LABELS`

### Pricing (`pricing-templates.ts`)

1. `generatePricingConfirmationEmailHTML(lead, lang)`
2. `generatePricingConfirmationPlainText(lead, lang)`
3. `getPricingConfirmationSubject(lang)`
4. `generatePricingNotificationEmailHTML(lead)`
5. `generatePricingNotificationPlainText(lead)`

---

**Document Version:** 1.0
**Last Updated:** 2026-03-19
**Status:** Complete
