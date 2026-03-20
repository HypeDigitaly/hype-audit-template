# Audit Page Frontend Documentation

**Last Updated:** March 2026
**Status:** Complete & Production
**Page Route:** `/` (home page)
**Old Route:** `/audit` (now 301 redirects to `/`)
**Rendering:** Server-side rendered (SSR, `prerender=false`)

---

## Overview

The home page (`/`) is a high-conversion lead capture funnel that delivers free preliminary AI audits within 5 minutes. It combines:

1. **Hero + Lead Form** — Immediate value proposition with CTAs
2. **Interactive Roadmap** — Scroll-animated SVG visualization of audit journey
3. **Value Proposition** — 4 key benefits in grid layout
4. **Pricing Tiers** — Free pre-audit through enterprise transformation
5. **Final CTA** — Consultation booking call-to-action

The page implements client-side form validation, background job processing with real-time polling, and granular progress tracking through 8-step state machine.

---

## Source Files

| File Path | Purpose | Lines |
|-----------|---------|-------|
| `astro-src/src/pages/index.astro` | **New** — Main home page component (formerly audit.astro), form handler, polling logic | 1,800 |
| `astro-src/src/pages/audit.astro` | **Deprecated** — 301 redirect to `/` | ~20 |
| `astro-src/src/components/sections/AuditRoadmapAnimated.astro` | Scroll-triggered SVG road animation + 4 milestones | 450 |
| `astro-src/src/scripts/translations/audit.ts` | Bilingual (CS/EN) translation keys for home page content | 336 |
| `astro-src/src/scripts/utm-tracker.ts` | Traffic source attribution (UTM, click IDs, referrer) | 233 |
| `astro-src/src/layouts/PageLayout.astro` | Wrapper layout with nav, footer, UTM initialization | 314 |

---

## Page Structure

### Rendering & Internationalization

**Language Detection Flow:**
1. Check URL param: `?lang=en` or `?lang=cs`
2. If `cs`, redirect to clean URL (Czech default)
3. Fall back to `preferredLanguage` cookie (1-year TTL)
4. Default to Czech if no preference detected

**Cookie Settings:**
```javascript
Astro.cookies.set('preferredLanguage', langParam, {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,  // 1 year
  sameSite: 'lax'
});
```

**Translation Object:** `translations[lang]` where `lang: 'cs' | 'en'`
**Translation Keys File:** `astro-src/src/scripts/translations/audit.ts`

### SEO & Schema Markup

Rendered in `<head>` with `set:html`:

**Service Schema (JSON-LD):**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Preliminary AI Audit" (bilingual),
  "description": t.audit_meta_desc,
  "provider": { "@type": "Organization", "name": "HypeDigitaly s.r.o." },
  "url": "https://hypedigitaly.ai/audit",
  "areaServed": "Czech Republic",
  "serviceType": "AI Consulting",
  "offers": {
    "@type": "Offer",
    "availability": "InStock",
    "price": "0",
    "priceCurrency": "CZK|USD" (lang-dependent),
    "description": "Free Preliminary Audit"
  }
}
```

**BreadcrumbList Schema (JSON-LD):**
- Position 1: Home (`https://hypedigitaly.ai`)
- Position 2: Preliminary Audit (`https://hypedigitaly.ai/audit`)

---

## Form Data Model

### Configuration-Driven Form Fields

The form fields are **configurable** via `config.json` in the `auditForm` section. All labels, options, and visibility can be customized per deployment:

```json
{
  "auditForm": {
    "painPoints": [
      { "value": "new_customers", "label_cs": "...", "label_en": "..." },
      // ... additional pain points (fully configurable)
    ],
    "tools": [
      { "value": "CRM", "label": "CRM" },
      // ... additional tools (fully configurable)
    ],
    "visibility": {
      "painPoints": true,
      "tools": true,
      "city": true,
      "email": true,
      "website": true,
      "companyName": true
    }
  }
}
```

### Visible Form Fields (6 core fields)

| Field Name | Type | Required | HTML Input Type | Default Placeholder (CS) | Default Placeholder (EN) | Validation | Configurable |
|-----------|------|----------|-----------------|-------------------|-------------------|-----------|-----------|
| `website` | Text | Yes | `text` | `https://vasefirma.cz` | `https://yourcompany.com` | Non-empty string | Yes (visibility + label) |
| `email` | Text | Yes | `email` | `vas@email.cz` | `your@email.com` | Valid email format | Yes (visibility + label) |
| `companyName` | Text | Yes | `text` | `Vaše firma s.r.o.` | `Your Company Ltd.` | Non-empty string | Yes (visibility + label) |
| `city` | Text | Yes | `text` | `Kde sídlíte?` | `Where are you based?` | Non-empty string | Yes (visibility + label) |
| `biggestPainPoint` | Checkboxes (multi) | Yes | Checkbox group | — | — | At least 1 selected | Yes (options, labels, visibility) |
| `currentTools` | Checkboxes (multi) | No | Checkbox group | — | — | Optional | Yes (options, labels, visibility) |

### Pain Point Checkbox Options (10 options)

| Value | Label (CS) | Label (EN) |
|-------|-----------|-----------|
| `new_customers` | Získávání nových zákazníků | Gaining new customers |
| `automating_outreach` | Automatizace oslovování | Automating outreach |
| `inbound_leads` | Příchozí poptávky a leady | Inbound leads |
| `speed_to_lead` | Rychlost reakce na poptávky | Speed to lead |
| `automating_communication` | Automatizace komunikace | Automating communication |
| `boring_admin` | Nudná administrativa | Boring administrative work |
| `juggling_tools` | Přepínání mezi mnoha nástroji | Juggling between many software tools |
| `integrating_ai` | Integrace AI do CRM/ERP/aplikace | Integrating AI into CRM/ERP/app |
| `marketing_materials` | Tvorba marketingových materiálů | Creating marketing materials |
| `social_media` | Postování na sociální sítě | Posting on social media |

**Special Option:** "Other" with inline text input (CS: `Jiné...`, EN: `Other...`)

### Tools Checkbox Options (6 options + Other)

| Value | Label |
|-------|-------|
| `Microsoft Office` | Microsoft Office |
| `Google Workspace` | Google Workspace |
| `ChatGPT / AI` | ChatGPT / AI |
| `CRM` | CRM |
| `ERP` | ERP |
| `Slack / Teams` | Slack / Teams |

**Special Option:** "Other" with inline text input (CS: `Něco jiného?`, EN: `Anything else?`)

### Hidden/System Fields

| Field Name | Type | Source | Usage |
|-----------|------|--------|-------|
| `language` | String | SSR: `lang` variable | Tracks form language context |
| `industry` | String | — | Reserved for future LLM enrichment |
| `jobId` | UUID v4 | Client-side generated | Links form submission to background job |
| `leadSource` | String | Constant: `"audit-page-form"` | Attribution: came from dedicated audit page |

### Traffic Source Fields (UTM + Click IDs)

Extracted from URL parameters and referrer, stored in `hd_traffic_source` cookie (30-day TTL):

| Field Name | Source | Example | Usage |
|-----------|--------|---------|-------|
| `utmSource` | URL: `?utm_source=...` | `google`, `facebook`, `linkedin` | Campaign origin |
| `utmMedium` | URL: `?utm_medium=...` | `organic`, `paid`, `social` | Marketing channel |
| `utmCampaign` | URL: `?utm_campaign=...` | `q1_2026_ai_blitz` | Campaign identifier |
| `utmContent` | URL: `?utm_content=...` | `hero_banner` | Content variant |
| `utmTerm` | URL: `?utm_term=...` | Custom search term | — |
| `gclid` | URL: `?gclid=...` | Google Ads click ID | Google Ads attribution |
| `fbclid` | URL: `?fbclid=...` | Facebook click ID | Facebook/Instagram attribution |
| `msclkid` | URL: `?msclkid=...` | Microsoft/Bing click ID | Bing/Microsoft Ads attribution |
| `referrer` | Detected from `document.referrer` | `google.com`, `linkedin.com` | Organic referrer domain |

**Cookie:** `hd_traffic_source` (JSON-serialized, 30-day expiration)
**Attribution Model:** First-touch (campaign params always override existing)

### Complete Form Submission Payload

```typescript
interface AuditFormData {
  // Visible form fields
  email: string;                    // Required, valid email
  website: string;                  // Required, URL string
  companyName: string;              // Required, non-empty
  city: string;                     // Required, non-empty
  biggestPainPoint: string;         // Required, comma-separated pain point labels
  currentTools: string;             // Optional, comma-separated tool names

  // System fields
  jobId: string;                    // UUID v4, generated client-side
  language: 'cs' | 'en';           // Form language context
  leadSource: 'audit-page-form';   // Constant attribution

  // Traffic source (from utm-tracker)
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

---

## Form Validation & Error Handling

### Client-Side Validation (Pre-Submit)

**Required Fields Check:**
```typescript
const requiredFields = ['email', 'website', 'companyName', 'city'];
for (const field of requiredFields) {
  if (!data[field]) {
    // Show error: "Please fill in all required fields"
  }
}
```

**Pain Point Validation:**
```typescript
if (!data.biggestPainPoint) {
  // Show error: "Please select at least one challenge"
  // Add error styling to checkbox group container
}
```

### Error Display UX

**Error Banner:**
- ID: `#audit-error`
- Classes: `hidden` (initially), toggles with `.hidden`
- Content: Icon + translated error message
- Animation: `slideIn` (300ms ease-out, 10px translateY)

**Field-Level Error Styling:**
- Class: `field-error-border` → Red border + orange glow shadow
- Error message: `<p class="field-error">` with icon
- Auto-clear: On any `input` event on that field

**Pain Point Container Error:**
- Container: `#painpoint-container`
- Class: `field-error-container` → Red border + red bg tint
- Individual cards: Border color shifts to red

**Auto-Focus & Scroll:**
```javascript
firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
setTimeout(() => firstErrorField.focus(), 500);
```

### Server-Side Validation Response

If backend returns `400 Bad Request` with validation errors:

```typescript
interface ValidationError {
  [fieldName: string]: {
    isValid: boolean;
    errorMessage: string;
  }
}
```

**Flow:**
1. Receive validation response from `/audit-background` or `/audit` (sync fallback)
2. Call `showValidationErrors(validationErrors)`
3. Hide progress state, show form with errors
4. Iterate validation errors and apply styling

---

## JavaScript Form Flow

### Complete Client-Side Lifecycle

#### STEP 1: User Clicks Submit Button
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting) return;  // Prevent double-submit
  isSubmitting = true;
  hideError();
  // ... continue
});
```

#### STEP 2: Collect & Validate Form Data
```javascript
const formData = new FormData(form);
const jobId = generateUUID();  // UUID v4
const trafficSource = getTrafficSourceData();  // From hd_traffic_source cookie

const data = {
  jobId,
  email: formData.get('email'),
  website: formData.get('website'),
  companyName: formData.get('companyName'),
  city: formData.get('city'),
  biggestPainPoint: formData.get('biggestPainPoint'),  // Hidden field, updated by pain point listeners
  currentTools: toolsArray.join(', '),  // Collected from checked checkboxes
  language: lang,
  leadSource: 'audit-page-form',
  utmSource: trafficSource.utmSource,
  // ... all traffic source fields
};
```

#### STEP 3: Client-Side Validation
```javascript
// Required fields validation
const requiredFields = ['email', 'website', 'companyName', 'city'];
for (const field of requiredFields) {
  if (!data[field]) {
    showError('Please fill required fields');
    isSubmitting = false;
    return;
  }
}

// Pain point validation
if (!data.biggestPainPoint) {
  showError('Please select at least one challenge');
  painPointContainer.classList.add('field-error-container');
  isSubmitting = false;
  return;
}
```

#### STEP 4: Show Progress UI
```javascript
showProgressState(data.companyName);
// - Hide form state
// - Show progress state with:
//   - Spinner icon (pulse animation)
//   - Progress bar (0%)
//   - 8 step indicator dots (first one active/orange)
//   - Personalized message: "Hledáme informace o {companyName}..."
```

#### STEP 5: POST to Background Function (or Sync Fallback)
```javascript
const backgroundResponse = await fetch('/.netlify/functions/audit-background', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// If 404 (endpoint doesn't exist), fallback to sync:
if (backgroundResponse.status === 404) {
  const syncResponse = await fetch('/.netlify/functions/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  // Handle sync response and show success
  return;
}

// Check for validation errors
if (backgroundResponse.status === 400) {
  const errorData = await backgroundResponse.json();
  showValidationErrors(errorData.validationErrors || {});
  isSubmitting = false;
  return;
}

// 202 Accepted = job queued successfully
console.log('Job queued with ID:', jobId);
```

#### STEP 6: Start Polling for Job Status
```javascript
await sleep(500);  // Brief delay for job initialization
const result = await pollJobStatus(jobId);
// - Polls every 1.5 seconds
// - Max 300 attempts (~7.5 minutes total, 450 seconds)
// - Updates progress UI on each poll response
```

#### STEP 7: Handle Polling Response
**Polling Endpoint:** `/.netlify/functions/audit-status?jobId={jobId}`

```typescript
interface PollResponse {
  status: 'pending' | 'validating' | 'researching' | 'generating' | 'storing' | 'emailing' | 'completed' | 'failed';
  progress: number;          // 0-100
  statusMessage?: string;    // e.g., "Validating your data..."
  currentSubStep?: string;   // e.g., 'fetch_branding', 'search_company_info'
  subStepMessage?: string;   // Granular step description
  error?: string;           // If failed
  validationErrors?: Record<string, { isValid: boolean; errorMessage: string }>;
}
```

**On Each Poll:**
```javascript
updateProgressUI(
  data.status,
  data.progress,
  data.statusMessage,
  data.currentSubStep,
  data.subStepMessage
);
```

#### STEP 8: Wait for Completion
```javascript
if (data.status === 'completed') {
  stopPolling();
  updateProgressUI('completed', 100, null);
  await sleep(500);
  showSuccess();
  return;
}

if (data.status === 'failed') {
  stopPolling();
  if (data.validationErrors) {
    showValidationErrors(data.validationErrors);
  } else {
    showError(data.error || 'Audit failed');
  }
  return;
}
```

#### STEP 9: Show Success State
```javascript
// Hides: Progress state
// Shows: Success state with:
//   - Green checkmark icon + ping animation
//   - Translated success message
//   - "Book consultation" CTA button
//   - Link to Calendly: https://cal.com/hypedigitaly-pavelcermak/30-min-online
```

---

## Polling State Machine

### Status Flow Diagram

```
[START]
   ↓
[pending] (0-10%)
   ↓
[validating] (10-30%)
   ↓
[researching] (30-50%, with 9 granular sub-steps)
   ├→ fetch_branding
   ├→ search_company_info
   ├→ search_company_news
   ├→ search_website
   ├→ search_technologies
   ├→ search_company_apps
   ├→ search_ai_tools
   ├→ llm_analyzing
   └→ building_report
   ↓
[generating] (50-80%)
   ↓
[storing] (80-95%)
   ↓
[emailing] (95-100%)
   ↓
[completed] (100%)
   ↓
[SUCCESS] ✓

OR

[failed]
   ↓
[ERROR]
```

### Status Message Mapping

| Status | Message (CS) | Message (EN) | Progress Range |
|--------|-------------|-------------|-----------------|
| `pending` | Zahajuji audit... | Starting audit... | 0-10% |
| `validating` | Ověřuji zadané údaje... | Validating your data... | 10-30% |
| `researching` | Provádím hloubkový výzkum o Vaší společnosti... | Conducting deep research on your company... | 30-50% |
| `generating` | Generuji interaktivní HTML report... | Generating interactive HTML report... | 50-80% |
| `storing` | Ukládám report... | Storing report... | 80-95% |
| `emailing` | Odesílám email s výsledky... | Sending email with results... | 95-100% |
| `completed` | Hotovo! | Done! | 100% |
| `failed` | Došlo k chybě | An error occurred | 100% |

### Sub-Step to Dot Mapping (Researching Phase)

The UI displays 8 step indicator dots. During researching phase, sub-steps control dot progression:

| Sub-Step | Dot # | Progress % | Description (CS) | Description (EN) |
|----------|-------|-----------|------------------|------------------|
| `fetch_branding` | 3 | 30-35% | Načítám branding... | Fetching branding... |
| `search_company_info` | 3 | 35-40% | Hledám info o firmě... | Searching company info... |
| `search_company_news` | 3 | 40-45% | Hledám články o firmě... | Searching company news... |
| `search_website` | 4 | 45-46% | Analyzuji web... | Analyzing website... |
| `search_technologies` | 4 | 46-47% | Hledám technologie... | Searching technologies... |
| `search_company_apps` | 5 | 47-49% | Hledám aplikace... | Searching company apps... |
| `search_ai_tools` | 5 | 49-50% | Hledám AI nástroje... | Searching AI tools... |
| `llm_analyzing` | 6 | 50-55% | LLM analyzuje... | LLM analyzing... |
| `building_report` | 6 | 55-60% | Stavím report... | Building report... |

### Status to Dot Mapping (Non-Researching)

| Status | Dot # | Progress % |
|--------|-------|-----------|
| `pending` | 1 | 0-10% |
| `validating` | 2 | 10-30% |
| `researching` | 3-6 | 30-50% (dynamic via sub-steps) |
| `generating` | 7 | 50-80% |
| `storing` | 7 | 80-95% |
| `emailing` | 8 | 95-100% |
| `completed` | 8 | 100% |

### Step Dot Visual Updates

```javascript
function updateStepDots(activeIndex) {
  for (let i = 1; i <= 8; i++) {
    const dot = document.getElementById('step-dot-' + i);
    if (i <= activeIndex) {
      dot.classList.add('bg-orange-500');      // Orange
      dot.classList.remove('bg-neutral-200');
      if (i === activeIndex) {
        dot.classList.add('scale-125');        // Current dot slightly larger
      }
    } else {
      dot.classList.add('bg-neutral-200');     // Gray
      dot.classList.remove('bg-orange-500', 'scale-125');
    }
  }
}
```

**Classes:**
- Active dot: `bg-orange-500` + optional `scale-125` for current
- Inactive dot: `bg-neutral-200`
- Transition: `transition-all duration-300`

### Polling Configuration

```javascript
const pollJobStatus = async (jobId) => {
  const maxAttempts = 300;              // ~7.5 minutes max (450 seconds)
  let attempts = 0;
  let consecutiveErrors = 0;
  const maxConsecutiveErrors = 5;

  return new Promise((resolve, reject) => {
    pollingInterval = setInterval(async () => {
      attempts++;

      if (attempts > maxAttempts) {
        reject(new Error('Timeout reached. Check your email.'));
      }

      const response = await fetch(`/.netlify/functions/audit-status?jobId=${jobId}`);
      const data = await response.json();

      if (data.status === 'completed') {
        resolve(data);
        return;
      }
      if (data.status === 'failed') {
        reject(data.validationErrors ? { validationErrors: data.validationErrors } : new Error(data.error));
        return;
      }

    }, 1500);  // Poll every 1.5 seconds
  });
};
```

**Key Timings:**
- Poll interval: 1500ms (1.5 seconds)
- Max attempts: 300 (~7.5 minutes total, 450 seconds)
- Pre-poll delay: 500ms
- Consecutive error threshold: 5 errors → abort

---

## AuditRoadmapAnimated Component

### Purpose
Scroll-triggered animated visualization of the 4-phase AI audit journey:
1. Preliminary Audit (5 min)
2. Personal Consultation (30 min)
3. Deep Analysis (15+ interviews)
4. Implementation & Results (12-month plan)

### Props
```typescript
interface Props {
  lang: 'cs' | 'en';
  t: Record<string, string>;  // Translations object
}
```

### Section Structure

**Container:** `#audit-process` (dark background, full-width)
**Layout:** Grid of 4 steps, alternating left/right layout on desktop, vertical on mobile

### Milestone Configuration

| #  | Value | Title Key | Description Key | Icon | Color | Features (CS/EN) |
|----|-------|-----------|-----------------|------|-------|------------------|
| 1  | 01 | `audit_process_step1_title` | `audit_process_step1_desc` | `solar:document-text-bold` | primary (teal) | Analyzujeme web / Prozkoumáme obor / PDF report |
| 2  | 02 | `audit_process_step2_title` | `audit_process_step2_desc` | `solar:chat-round-call-bold` | blue | 30 minut / Probereme priority / Dohodneme kroky |
| 3  | 03 | `audit_process_step3_title` | `audit_process_step3_desc` | `solar:clipboard-check-bold` | purple | Mluvíme s lidmi / Mapujeme procesy / Počítáme úspory |
| 4  | 04 | `audit_process_step4_title` | `audit_process_step4_desc` | `solar:chart-2-bold` | orange | Co řešit hned / Plán na rok / Rychlé výhry |

### Color Scheme

```javascript
const colorMap = {
  primary: {
    bg: 'bg-primary/10',           // Teal with 10% opacity
    border: 'border-primary/30',   // Teal with 30% opacity
    text: 'text-primary',          // Solid teal
    glow: 'shadow-primary/20',     // Teal shadow
    solid: '#00A39A'               // Hex for SVG
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/20',
    solid: '#3b82f6'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
    solid: '#a855f7'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    glow: 'shadow-orange-500/20',
    solid: '#f97316'
  }
};
```

### SVG Road Path Animation

**SVG Element:** `#road-svg` (hidden on mobile: `hidden lg:block`)

**Path Definition:** Cubic Bézier curves creating winding road:
```
M 400 0
Q 400 80, 200 150        ← Bend 1 (milestone 1 approx)
Q 0 220, 200 300         ← Bend 2
Q 400 380, 600 450       ← Bend 3 (milestone 2 approx)
Q 800 520, 600 600       ← Bend 4
Q 400 680, 200 750       ← Bend 5 (milestone 3 approx)
Q 0 820, 200 900         ← Bend 6
Q 400 980, 400 1100      ← Bend 7 (milestone 4 approx)
```

**Animated Path Layers:**
1. **Background Road:** `stroke="rgba(255,255,255,0.05)"`, `stroke-width="80"` (dull white)
2. **Gradient Stroke:** `stroke="url(#roadGradient)"`, `stroke-width="6"` (animated color gradient)
3. **Center Dashes:** `stroke="rgba(255,255,255,0.15)"`, `stroke-dasharray="20 15"` (white dashes, initially hidden)

**Gradient Definition:**
```xml
<linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
  <stop offset="0%" stop-color="#00A39A" />    <!-- Teal -->
  <stop offset="33%" stop-color="#3b82f6" />   <!-- Blue -->
  <stop offset="66%" stop-color="#a855f7" />   <!-- Purple -->
  <stop offset="100%" stop-color="#f97316" />  <!-- Orange -->
</linearGradient>
```

**Animation:**
- Property: `stroke-dashoffset` (start: 2400, end: 0)
- Duration: 2s (base), scroll-based override (see below)
- Easing: `ease-out`

### Scroll-Triggered Animation

**Intersection Observer (Container):**
```javascript
const observerOptions = {
  root: null,
  rootMargin: '-10% 0px -10% 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1]
};

// Calculate scroll progress and animate road based on container visibility
const scrollProgress = Math.min(1, entry.intersectionRatio * 2);
const drawLength = pathLength * (1 - scrollProgress * 0.8);
roadPath.style.strokeDashoffset = Math.max(0, drawLength);
```

**RAF-Based Scroll Handler:**
```javascript
window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
    const rect = container.getBoundingClientRect();
    const progress = (scrollStart - containerTop) / (scrollStart - scrollEnd);

    // Animate based on scroll position
    const drawLength = pathLength * (1 - progress);
    roadPath.style.strokeDashoffset = Math.max(0, drawLength);

    // Show dashes when 40%+ drawn
    if (progress > 0.4) {
      roadDashes.style.opacity = String(Math.min(1, (progress - 0.4) * 2.5));
    }
  });
});
```

### Milestone & Content Card Animations

**Milestone Circle (Each Step):**
- Initial: `scale-90`, `opacity-0`
- On Scroll In: `scale-1`, `opacity-1`
- Duration: 700ms
- Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` (elastic bounce)
- Delay: Staggered per step (200ms, 500ms, 800ms, 1100ms)

**Glow Ring:**
- Initial: `opacity-0`
- On Scroll In: `opacity-0.3`
- Blur: `blur-xl`
- Color: Solid color (teal/blue/purple/orange per step)

**Content Card:**
- Initial: `translateX(±8)` (±8px based on step parity), `opacity-0`
- On Scroll In: `translateX(0)`, `opacity-1`
- Duration: 700ms
- Same elastic easing + staggered delays

**Pulse Ring (On Milestone):**
```css
@keyframes ping {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}
/* Applied to .animate-ping with duration: 2s */
```

### Mobile Responsive Behavior

**Mobile (< 1024px):**
- SVG hidden (`hidden lg:block`)
- Steps display vertically (centered)
- Cards use `translateY(20px)` initially instead of `translateX(±8px)`
- All cards align center, no alternating left/right

**Breakpoints:**
- `md:`: Adjusts font sizes (milestone number, title, text)
- `lg:`: Shows SVG, enables flex-row alternation, adjusted spacing

### Bottom Timeline Summary

**Container:** Centered info box at bottom
**Content:** "Pre-Audit: 5 min | Quick Strike: 2 weeks | Full Audit: 4-6 weeks"
**Animation:** `animationIn` 0.8s at 0.8s delay
**Styling:**
- Background: `bg-white/5`
- Border: `border border-white/10`
- Icon: `solar:clock-circle-bold` (teal)

---

## Styling & Animations

### Global Form Styling

**Form Input Fields:**
```css
.form-input-field {
  outline: none;
}

.form-input-field:hover {
  border-color: #d1d5db;           /* Gray border */
  background-color: #fafafa;       /* Light gray bg */
}

.form-input-field:focus {
  border-color: #f97316 !important; /* Orange border */
  background-color: #fff !important;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.15),
              0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
```

**Checkbox Card Styling:**
```css
.checkbox-card:has(input:checked) {
  border-color: #f97316 !important;        /* Orange border */
  background-color: #fff7ed !important;    /* Light orange bg */
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2),
              0 1px 3px rgba(249, 115, 22, 0.1) !important;
}

.checkbox-card:has(input:checked) span {
  color: #c2410c;      /* Dark orange text */
  font-weight: 500;
}
```

### Error Styling

**Field Error Border:**
```css
.field-error-border {
  border-color: rgb(239, 68, 68) !important;  /* Red */
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15) !important;
}
```

**Field Error Container (Pain Points):**
```css
.field-error-container {
  background-color: rgba(239, 68, 68, 0.03);
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin: -0.75rem;
  border: 2px solid rgba(239, 68, 68, 0.4);
}

.field-error-container .checkbox-card {
  border-color: rgba(239, 68, 68, 0.3) !important;
}
```

**Field Error Message:**
```css
.field-error {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Progress Bar Styling

**Container:**
```html
<div class="w-full bg-neutral-100 rounded-full h-3 overflow-hidden border border-neutral-200">
```

**Bar Fill:**
```html
<div id="progress-bar"
  class="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-full
         transition-all duration-700 ease-out relative"
  style="width: 0%">
```

**Shimmer Animation:**
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
```

### Progress Icon Animation

**Container:**
```html
<div class="relative inline-flex items-center justify-center mb-6">
  <!-- Outer pulse ring -->
  <div class="absolute inset-0 animate-pulse rounded-full bg-orange-500/10"></div>

  <!-- Main icon -->
  <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-500/5
              border-2 border-orange-500/20 flex items-center justify-center">
    <iconify-icon icon="svg-spinners:pulse-rings-multiple" class="text-5xl text-orange-500"></iconify-icon>
  </div>
</div>
```

**Animation:** `animate-pulse` (built-in Tailwind, ~2s opacity loop)

### Success Icon Animation

**Container:**
```html
<div class="relative inline-flex items-center justify-center mb-6">
  <!-- Outer ping ring -->
  <div class="absolute inset-0 animate-ping rounded-full bg-green-500/10"
       style="animation-duration: 1.5s;"></div>

  <!-- Main icon -->
  <div class="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-500/10 to-green-500/5
              border-2 border-green-500/20 flex items-center justify-center">
    <iconify-icon icon="solar:check-circle-bold" class="text-5xl text-green-600"></iconify-icon>
  </div>
</div>
```

**Animation:** `animate-ping` (custom duration 1.5s, scales 1 → 1.5 with opacity fade)

### Button Animations

**CTA Button (with floating bubbles):**
```html
<button class="... relative overflow-hidden">
  <span class="nav-bubbles-wrapper">
    <span class="nav-bubble"></span>  × 8
  </span>
  <span class="relative z-10">Button Text</span>
</button>
```

**Bubbles Animation:** Global style (not shown in audit.astro, likely in global CSS)

---

## Tailwind Classes Used

### Layout & Spacing
- `max-w-7xl`, `max-w-6xl`, `max-w-4xl`, `max-w-3xl`, `max-w-lg`, `max-w-md`, `max-w-sm`
- `mx-auto`, `px-4`, `sm:px-6`, `py-*`, `mb-*`, `mt-*`
- `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`, `lg:grid-cols-4`, `gap-*`

### Typography
- `text-*xl` (text-lg through text-6xl)
- `font-bold`, `font-semibold`, `font-medium`, `font-light`
- `text-white`, `text-neutral-*`, `text-orange-*`, `text-green-*`, `text-red-*`
- `leading-*`, `tracking-*`

### Flexbox
- `flex`, `flex-col`, `flex-row`, `flex-row-reverse`, `items-center`, `justify-center`, `justify-between`, `gap-*`
- `flex-shrink-0`, `flex-1`

### Borders & Backgrounds
- `border`, `border-2`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`
- `bg-white`, `bg-orange-500`, `bg-gradient-to-*`, `bg-transparent`
- `border-neutral-*`, `border-orange-*`, `border-red-*`

### Effects & States
- `shadow-*`, `shadow-orange-500/20`
- `hover:*`, `focus:*`, `disabled:*`
- `transition-*`, `duration-*`, `ease-out`
- `opacity-*`, `hidden`

### Animations
- `animate-on-scroll`, `animate-pulse`, `animate-ping`, `animate-shimmer`

---

## Error Scenarios & UX Behavior

| Scenario | Trigger | User Sees | Recovery Path |
|----------|---------|-----------|----------------|
| **Missing Required Field** | Submit without email/website/company/city | Error banner + red field borders + auto-scroll to first error | User fills field + error clears on input |
| **Invalid Email Format** | Submit with malformed email | Error banner | User corrects email, error clears |
| **No Pain Point Selected** | Submit without checking any pain points | Error banner + red border on checkbox container | User checks ≥1 option, error clears |
| **Network Error During Submit** | Network fails on POST to `/audit-background` | Error banner: "Check your email" (with fallback language) | User can retry submit |
| **Backend Returns 400 (Validation)** | Server-side validation fails | Progress hidden, form shows, field-level errors with messages | User fixes fields, can retry |
| **Backend Returns 500 (Server Error)** | Server crash during processing | Error banner: "Unexpected error occurred" | User can retry or check email for partial results |
| **Polling Timeout (~7.5 min exceeded)** | Job takes >7.5 minutes | Error banner: "Timeout. Check your email" | Job may still complete; results sent via email |
| **5 Consecutive Polling Errors** | Network repeatedly fails during polling | Error banner: "Failed to get status. Check email." | Results may still be delivered via email |
| **Job Status = Failed** | Backend job explicitly fails | Error banner with details (or field-level errors) | If validation errors → show form with errors; otherwise → show generic error |
| **User Closes Browser During Poll** | Tab/window closed mid-polling | (N/A — not user-facing) | Polling stops; results still emailed when complete |

---

## Accessibility & SEO

### ARIA Labels & Semantic HTML
- Form fields: `<label>` with `for=` attribute
- Error messages: Semantic `<div>` with role context
- Buttons: Semantic `<button>` with icon + text
- Checkboxes: Native `<input type="checkbox">`

### Keyboard Navigation
- All form fields keyboard accessible
- Tab order natural (top-to-bottom)
- Submit button: `Enter` key triggers submit
- Checkboxes: `Space` to toggle
- Error links/buttons: `Tab` to focus, `Enter` to activate

### Color Contrast
- Form text: Dark gray/black on white background (AA compliant)
- Error messages: Red text on light red background (AA compliant)
- Links: Orange/teal on dark/light backgrounds (tested)

### SEO Meta Tags
- `title`: t.audit_meta_title (language-specific)
- `description`: t.audit_meta_desc
- JSON-LD: Service + BreadcrumbList schemas
- Open Graph: Auto-generated from BaseLayout

---

## Pain Point & Tools Value→Label Mapping

### Pain Point Checkbox Mapping

The form collects pain point values (`new_customers`, `automating_outreach`, etc.) but submits human-readable labels to the backend for LLM processing:

```typescript
const painPointLabels = {
  'new_customers': 'Získávání nových zákazníků' | 'Gaining new customers',
  'automating_outreach': 'Automatizace oslovování' | 'Automating outreach',
  'inbound_leads': 'Příchozí poptávky a leady' | 'Inbound leads',
  'speed_to_lead': 'Rychlost reakce na poptávky' | 'Speed to lead',
  'automating_communication': 'Automatizace komunikace' | 'Automating communication',
  'boring_admin': 'Nudná administrativa' | 'Boring administrative work',
  'juggling_tools': 'Přepínání mezi mnoha nástroji' | 'Juggling between many software tools',
  'integrating_ai': 'Integrace AI do CRM/ERP/aplikace' | 'Integrating AI into CRM/ERP/app',
  'marketing_materials': 'Tvorba marketingových materiálů' | 'Creating marketing materials',
  'social_media': 'Postování na sociální sítě' | 'Posting on social media'
};
```

**Flow:**
1. User checks checkboxes (values: `new_customers`, etc.)
2. `updatePainPointValue()` maps values → labels using `painPointLabels` object
3. Hidden field `#biggestPainPoint` populated with comma-separated labels
4. Submitted to backend as string: `"Acquiring customers, Automating outreach, ..."`

### Tools Checkbox (No Special Mapping)

Tools are submitted as-is (label = value):
- `Microsoft Office`
- `Google Workspace`
- `ChatGPT / AI`
- `CRM`
- `ERP`
- `Slack / Teams`
- Plus optional "Other" text field

**Flow:**
1. User checks tool checkboxes
2. Collect checked values into array
3. Add optional "Other" text if filled
4. Join with `", "` and submit as string

---

## Language & Bilingual Behavior

### Language Preference Resolution

**Priority Order:**
1. URL parameter: `?lang=en` or `?lang=cs`
2. Cookie: `preferredLanguage` (1-year TTL)
3. Default: `cs` (Czech)

**Special Rules:**
- If `?lang=cs`, redirect to clean URL (no param)
- If explicit `?lang=en`, set cookie + stay on URL with `?lang=en`
- Cookie set by PageLayout click handlers (nav lang switcher)

### Status Message Translation

All polling status messages translated at runtime:

```typescript
const statusMessages = lang === 'cs' ? {
  'pending': 'Zahajuji audit...',
  'validating': 'Ověřuji zadané údaje...',
  'researching': 'Provádím hloubkový výzkum...',
  'generating': 'Generuji interaktivní HTML report...',
  'storing': 'Ukládám report...',
  'emailing': 'Odesílám email...',
  'completed': 'Hotovo!',
  'failed': 'Došlo k chybě'
} : {
  'pending': 'Starting audit...',
  'validating': 'Validating your data...',
  'researching': 'Conducting deep research...',
  // ... etc
};
```

### Pain Point Label Translation

Labels translated inline during value mapping (see section above).

---

## Performance Considerations

### Page Load Optimizations
- **Images:** Lazy-loaded via astro:image (if used)
- **Icons:** Iconify web font (async load)
- **Animations:** CSS-based (GPU-accelerated)
- **Scripts:** Inline `<script is:inline>` for critical form logic (no external request)

### Polling Performance
- **Interval:** 1500ms (1.5 sec) — reasonable for UX without overloading server
- **Max Duration:** ~7.5 minutes (300 attempts × 1.5s = 450 seconds) — prevents indefinite polling
- **Concurrency:** Single pollingInterval per form instance

### State Management
- **Minimal Globals:** `isSubmitting`, `pollingInterval` flags
- **DOM Queries:** Cached on form init (no repeated selectors in loops)
- **Event Delegation:** Used for checkbox listeners

---

## Testing Recommendations

### Form Validation Tests
- [ ] Submit with empty fields → Error banner
- [ ] Submit with invalid email → Error on email field
- [ ] Submit without pain points → Error on container
- [ ] Submit valid form → Success state
- [ ] Clear errors when user types → Error disappears

### Polling Tests
- [ ] Mock 202 response → Polling starts
- [ ] Mock 404 response → Fallback to sync audit
- [ ] Mock completed status → Success state
- [ ] Mock failed status → Error state with recovery
- [ ] Mock timeout (>5 min) → Error banner
- [ ] Mock network error → Retry or timeout

### Animation Tests
- [ ] Progress bar increments smoothly
- [ ] Step dots activate in sequence
- [ ] Sub-step messages update correctly
- [ ] Road SVG path draws on scroll
- [ ] Milestones bounce into view
- [ ] Success ping animation plays

### Bilingual Tests
- [ ] Form loads in correct language
- [ ] All messages translated correctly
- [ ] Language switch triggers reload
- [ ] Cookie persists language selection
- [ ] Status messages in correct language

### Accessibility Tests
- [ ] All form fields keyboard accessible
- [ ] Error messages have focus management
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader announces errors
- [ ] Submit button announces loading state

---

## Related Files & Dependencies

### Frontend Dependencies
- **Astro Framework:** 5.16
- **Tailwind CSS:** 4.1
- **Iconify Icons:** Web font (solar icons)
- **UTM Tracker:** `utm-tracker.ts` (traffic source)
- **Translations:** `translations/audit.ts` (bilingual keys)

### Backend Dependencies
- **Netlify Functions:**
  - `/.netlify/functions/audit-background` (async job submission)
  - `/.netlify/functions/audit-status?jobId=...` (polling endpoint)
  - `/.netlify/functions/audit` (fallback sync function)
- **Netlify Blobs:** Stores audit reports
- **Resend Email:** Sends audit results via email

### External Services
- **Calendly:** `https://cal.com/hypedigitaly-pavelcermak/30-min-online`
- **Search & Research APIs:** Called by backend during auditing phase

### Layout & Navigation
- **PageLayout:** Wrapper (nav, footer, UTM init)
- **Navigation:** Top navbar with language switcher
- **Footer:** Company details, links

---

## Known Issues & Future Enhancements

### Current Limitations
1. **Industry Field Not Collected:** Reserved for future LLM enrichment
2. **Company Size Field Not Visible:** Form design omits; can be added
3. **Sync Fallback:** If background function missing (404), falls back to sync
4. **Email Validation:** Client-side only (HTML5 `type="email"`); server should re-validate

### Enhancement Ideas
1. **SMS Notifications:** Send audit status updates via SMS
2. **Real-Time Progress Email:** Email user progress updates
3. **Interactive Report Preview:** Show report summary in success state
4. **A/B Testing:** Variant CTA text, form field order
5. **Analytics Integration:** GA4 event tracking for form steps
6. **Lead Magnet PDF:** Download interim results before email arrives

---

## Deployment Checklist

- [ ] Verify `/audit` route accessible in production
- [ ] Test background function (`audit-background`) deployed
- [ ] Test sync fallback function (`audit`) deployed
- [ ] Test status polling endpoint (`audit-status`) deployed
- [ ] Verify email sending configured (Resend)
- [ ] Verify Blobs storage for reports
- [ ] Test Calendly link works
- [ ] Verify UTM tracking cookie set correctly
- [ ] Test bilingual routing (?lang=en)
- [ ] Run accessibility audit (WAVE, Lighthouse)
- [ ] Test on mobile (iOS Safari, Chrome Android)
- [ ] Performance test (Lighthouse, PageSpeed Insights)
- [ ] Monitor error rate via Netlify logs

---

**End of Documentation**
