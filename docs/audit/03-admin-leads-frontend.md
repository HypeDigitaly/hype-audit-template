# Admin Leads Dashboard Frontend Documentation

**File:** `astro-src/src/pages/admin/leads.astro` (3,314 lines)
**Support Module:** `astro-src/src/scripts/admin/onboarding-tab.ts` (340 lines)
**Status:** Production CRM dashboard with dual-view analytics
**Last Updated:** 2026-03-19

## Overview

The `/admin/leads` page is a password-protected CRM dashboard for managing B2B leads collected via AI Audit, Contact Forms, Pricing Surveys, and GC Event registration. The dashboard provides:

- **Table View:** Lead list with 10-column filterable table
- **Question View:** Analytics dashboard with Chart.js charts and respondent panels
- **Onboarding Tab:** Separate tab for HypeLead onboarding form submissions
- **CSV Export:** Full lead export with injection prevention
- **Bulk Delete:** Multi-select lead deletion with confirmation modal

---

## Authentication Flow

### Password Storage & Retrieval

```typescript
// sessionStorage is the single source of truth (user's current browser session)
sessionStorage.getItem('admin_password')
sessionStorage.setItem('admin_password', password)
sessionStorage.removeItem('admin_password')

// One-time migration from localStorage (legacy)
var legacyPassword = localStorage.getItem('admin_password');
if (legacyPassword) {
  sessionStorage.setItem('admin_password', legacyPassword);
  localStorage.removeItem('admin_password');
}
```

### Login Flow

1. **Page Load:** Check `sessionStorage.admin_password`
   - If exists: auto-show dashboard, call `fetchLeads()` with stored password
   - If invalid (401 response): call `handleAuthFailure()` with error message
   - If missing: show login screen

2. **Login Attempt:**
   ```javascript
   function attemptLogin() {
     password = passwordInput.value;
     if (!password) {
       loginError.textContent = 'Zadejte heslo';
       loginError.style.display = 'block';
       return;
     }

     loginError.style.display = 'none';
     loginBtn.disabled = true;
     loginBtn.innerHTML = '<iconify-icon icon="svg-spinners:ring-resize"></iconify-icon> Ověřuji...';

     fetchLeads().then(success => {
       if (success) {
         sessionStorage.setItem('admin_password', password);
         applyGlobalChartDefaults();
         showDashboard();
       } else {
         loginError.textContent = 'Nesprávné heslo';
         loginError.style.display = 'block';
         passwordInput.focus();
       }
       loginBtn.disabled = false;
       loginBtn.innerHTML = '<iconify-icon icon="solar:lock-keyhole-bold"></iconify-icon> Přihlásit se';
     });
   }
   ```

### API Authentication

All requests include `Authorization: Bearer {password}` header:

```javascript
const response = await fetch(`/.netlify/functions/admin-leads`, {
  headers: { 'Authorization': 'Bearer ' + password }
});
```

### 401 Handling

When API returns 401 (Unauthorized):

```javascript
if (response.status === 401) {
  handleAuthFailure('Relace vypršela. Přihlaste se znovu.');
  return false;
}
```

### Auth Failure Handler

```javascript
function handleAuthFailure(message) {
  sessionStorage.removeItem('admin_password');
  password = '';
  allLeads = [];
  loginScreen.style.display = 'flex';
  dashboard.classList.remove('active');
  passwordInput.value = '';
  if (message) {
    loginError.textContent = message;
    loginError.style.display = 'block';
  }
}
```

Used by:
- Logout button click
- Stale password detection
- Session expiry (401 responses)

---

## HTML Structure

### DOM Skeleton

```html
<!-- Login Screen (id="login-screen") -->
<div id="login-screen" class="login-container">
  <div class="login-box">
    <h1>Admin Dashboard</h1>
    <p>Zadejte heslo pro přístup k přehledu leadů</p>
    <div id="login-error" class="login-error">Nesprávné heslo</div>
    <input type="password" id="password-input" placeholder="Heslo..." autofocus />
    <button id="login-btn">Přihlásit se</button>
  </div>
</div>

<!-- Dashboard (id="dashboard") - hidden until authenticated -->
<div id="dashboard" class="dashboard">

  <!-- Header with action buttons -->
  <header class="header">
    <div class="header-left">
      <a href="/" class="link">
        <img src="/assets/images/HD_color_black.svg" alt="HypeDigitaly" />
      </a>
      <h1>Přehled leadů</h1>
    </div>
    <div class="header-actions">
      <button id="delete-selected-btn" class="btn btn-danger" disabled>
        Smazat vybrané (<span id="selected-count">0</span>)
      </button>
      <button id="refresh-btn" class="btn btn-secondary">Obnovit</button>
      <button id="export-btn" class="btn btn-primary">Export CSV</button>
      <button id="logout-btn" class="btn btn-secondary">Odhlásit</button>
    </div>
  </header>

  <!-- Stats Grid (6 cards) -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="label">Celkem leadů</div>
      <div class="value" id="stat-total">-</div>
    </div>
    <div class="stat-card audit">
      <div class="label">AI Audit</div>
      <div class="value" id="stat-audit">-</div>
    </div>
    <div class="stat-card contact">
      <div class="label">Kontakt</div>
      <div class="value" id="stat-contact">-</div>
    </div>
    <div class="stat-card survey">
      <div class="stat-label">Průzkum</div>
      <div class="stat-value" id="stat-survey">-</div>
    </div>
    <div class="stat-card gc-event" id="stat-card-gc-event">
      <div class="stat-label">GC Event</div>
      <div class="stat-value" id="stat-gc-event">-</div>
    </div>
    <div class="stat-card pricing">
      <div class="stat-label">Ceník</div>
      <div class="stat-value" id="stat-pricing">-</div>
    </div>
  </div>

  <!-- View Toggle Bar -->
  <div class="view-toggle-bar" id="view-toggle-bar">
    <div class="view-toggle">
      <button class="view-toggle-btn active" id="btn-table-view">
        Tabulka
      </button>
      <button class="view-toggle-btn" id="btn-question-view">
        Analýza odpovědí
      </button>
    </div>
    <div class="qv-form-selector" id="qv-form-selector" style="display:none;">
      <label for="qv-form-select">Formulář:</label>
      <select id="qv-form-select">
        <option value="">-- Vyberte formulář --</option>
        <option value="audit">AI Audit</option>
        <option value="contact">Kontakt</option>
        <option value="survey">Průzkum</option>
        <option value="gc-event">GC Event</option>
      </select>
    </div>
  </div>

  <!-- Question View Panel (hidden by default) -->
  <div id="question-view-panel" style="display:none;">
    <div id="qv-content">
      <!-- Dynamically populated by QuestionView.renderQuestionView() -->
    </div>
  </div>

  <!-- Filters -->
  <div class="filters">
    <div class="filters-row">
      <div class="filter-group">
        <label>Hledat</label>
        <input type="text" id="filter-search" placeholder="Email, firma, jméno..." />
      </div>
      <div class="filter-group">
        <label>Zdroj</label>
        <select id="filter-source">
          <option value="">Všechny</option>
          <option value="audit">AI Audit</option>
          <option value="contact">Kontakt</option>
          <option value="survey">Průzkum</option>
          <option value="pricing-calculator">Ceník</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Formulář</label>
        <select id="filter-lead-source">
          <option value="">Všechny</option>
          <option value="homepage-hero-form">🏠 Homepage Hero</option>
          <option value="audit-page-form">📄 Audit Page</option>
          <option value="contact-page-form">📞 Contact Page</option>
          <option value="hero-form">🏠 Hero (legacy)</option>
          <option value="audit-page">📄 Audit (legacy)</option>
          <option value="gc-pruzkum-page">🔬 Průzkum AI</option>
          <option value="gc-event-page">GC Event dotazník</option>
          <option value="unknown">❓ Unknown</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Platforma</label>
        <select id="filter-platform">
          <option value="">Všechny</option>
          <option value="google">🔍 Google</option>
          <option value="facebook">📘 Facebook</option>
          <option value="instagram">📸 Instagram</option>
          <option value="linkedin">💼 LinkedIn</option>
          <option value="youtube">📺 YouTube</option>
          <option value="bing">🔎 Bing</option>
          <option value="direct">🏠 Direct</option>
          <option value="other">🌐 Other</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Od</label>
        <input type="date" id="filter-from" />
      </div>
      <div class="filter-group">
        <label>Do</label>
        <input type="date" id="filter-to" />
      </div>
      <button id="clear-filters-btn" class="btn btn-secondary">Vymazat filtry</button>
    </div>
  </div>

  <!-- Table Container -->
  <div class="table-container">
    <div id="loading" class="loading">
      <iconify-icon icon="svg-spinners:ring-resize" class="spinner"></iconify-icon>
      <p>Načítám leady...</p>
    </div>
    <table id="leads-table" style="display: none;">
      <thead>
        <tr>
          <th style="width: 40px;"><input type="checkbox" id="select-all" /></th>
          <th>Datum</th>
          <th>Zdroj</th>
          <th>Formulář</th>
          <th>Platforma</th>
          <th>Email</th>
          <th>Firma / Jméno</th>
          <th>Web</th>
          <th>Město</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody id="leads-tbody"></tbody>
    </table>
    <div id="empty-state" class="empty-state" style="display: none;">
      <iconify-icon icon="solar:inbox-line-bold"></iconify-icon>
      <p>Žádné leady nenalezeny</p>
    </div>
  </div>

</div>

<!-- Delete Confirmation Modal -->
<div id="delete-modal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <h3>Smazat vybrané leady</h3>
    <p id="delete-modal-count">Opravdu chcete smazat X leadů?</p>
    <label>
      <input type="checkbox" id="delete-reports-checkbox" checked />
      <span>Smazat i přiložené reporty (audit)</span>
    </label>
    <div class="modal-actions">
      <button id="delete-cancel-btn" class="btn btn-secondary">Zrušit</button>
      <button id="delete-confirm-btn" class="btn btn-danger">Smazat</button>
    </div>
  </div>
</div>
```

---

## Stats Grid (6 Cards)

All stats are updated via `updateStats(data)` on successful `fetchLeads()`:

| Stat Card | Data Source | HTML ID | Color | Value Source |
|-----------|-------------|---------|-------|--------------|
| Celkem leadů | Total | `stat-total` | Gray | `data.total` |
| AI Audit | Count by source | `stat-audit` | Orange (#f97316) | `data.totalAudit` |
| Kontakt | Count by source | `stat-contact` | Teal (#00A39A) | `data.totalContact` |
| Průzkum | Count by source | `stat-survey` | Purple (#8b5cf6) | `data.totalSurvey` |
| GC Event | Count by leadSource | `stat-gc-event` | Gold (#D4A017) | `data.totalGcEvent` |
| Ceník | Count by source | `stat-pricing` | Pink (#ec4899) | `data.totalPricing` |

**Click Behavior:**
- GC Event card (`#stat-card-gc-event`): Activates Question View for gc-event form
- All other cards: Activates Table View

---

## Table View (10 Columns)

The table renders filtered leads with 10 columns. Each row is a lead; clicking checkbox selects it for bulk delete.

### Column Specifications

#### 1. **Checkbox** (width: 40px)
- `<input type="checkbox" class="lead-checkbox" data-id="..." data-source="..." data-report-id="..." />`
- Data attributes: `id`, `source`, `reportId` (for delete API)
- Checked leads added to `selectedLeads` Set

#### 2. **Datum** (Date)
- Format: `DD.MM.YYYY HH:MM` (Czech locale, 24-hour)
- Source: `lead.submittedAt` (ISO string)
- CSS class: `.text-muted`

#### 3. **Zdroj** (Source Badge)
- Single-letter badge with background color based on source
- **audit** → `<span class="badge badge-audit">Audit</span>` (orange bg)
- **survey** → `<span class="badge badge-survey">Průzkum</span>` (purple bg)
- **pricing-calculator** → `<span class="badge badge-pricing">Ceník</span>` (pink bg)
- **contact** (default) → `<span class="badge badge-contact">Kontakt</span>` (teal bg)

#### 4. **Formulář** (Lead Source)
- Maps `lead.leadSource` to human-readable emoji + label
- Mapping:
  ```javascript
  'homepage-hero-form': '🏠 Homepage Hero',
  'audit-page-form': '📄 Audit Page',
  'contact-page-form': '📞 Contact Page',
  'hero-form': '🏠 Hero (legacy)',
  'audit-page': '📄 Audit (legacy)',
  'gc-pruzkum-page': '🔬 Průzkum AI',
  'gc-event-page': 'GC Event dotazník',
  'unknown': '❓ Unknown'
  ```
- Fallback: escapeHtml(leadSource) if not in map
- CSS class: `.text-muted`, `font-size: 0.75rem`

#### 5. **Platforma** (Platform/UTM Source)
- Icon emoji + capitalized `lead.utmSource` (google, facebook, instagram, linkedin, youtube, bing, twitter, tiktok, direct, email, or default 🌐)
- If `lead.utmMedium`: append `/ {medium}` in muted text
- Hover title: Full UTM breakdown (Source, Medium, Campaign, Content, Term, gclid, fbclid, msclkid, referrer)
- Escape all values with `escapeHtml()`

#### 6. **Email** (Email)
- `<a href="mailto:{email}" class="link">{email}</a>`
- Source: `lead.email`
- Escaped with `escapeHtml()`

#### 7. **Firma / Jméno** (Name)
- **Audit leads:** `lead.companyName` or `-`
- **Survey leads:** `lead.companyName || lead.name` or `-`
- **Contact leads:** `lead.name` or `-`
- Escaped with `escapeHtml()`

#### 8. **Web** (Website)
- If URL present (survey uses `lead.websiteUrl`, others use `lead.website`):
  - `<a href="{safeHref(url)}" target="_blank" class="link truncate">{safeWebsite}</a>`
  - `safeHref()` validates protocol, adds https:// if missing
  - CSS: `max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`
- Else: `-`

#### 9. **Město** (City)
- Source: `lead.city` or `-`
- Escaped with `escapeHtml()`

#### 10. **Detail** (Per-source info)
- **Audit leads:**
  - If `lead.reportUrl`: `<a href="{safeHref(url)}" target="_blank" class="link">Zobrazit report</a>`
  - Else: Truncated `lead.biggestPainPoint` with title tooltip or `-`
- **Survey leads:**
  - Multi-line detail: "Obor: X | Výzvy: Y | Hlavní: Z | AI: A | Ztráta: B | Poznámka: C"
  - Maps field values through label maps (INDUSTRY_LABELS, PAIN_POINT_LABELS, GC_AI_MATURITY_LABELS, GC_HOURS_LABELS)
  - Truncates contextNote to first 100 chars
- **Contact leads:**
  - If `lead.service`: `"Služba: {service}"`
  - Else if `lead.message`: Truncated message with title tooltip
  - Else: `-`

### Table Rendering

```javascript
function renderTable() {
  let filtered = getFilteredLeads(); // Client-side filter

  if (filtered.length === 0) {
    tableEl.style.display = 'none';
    emptyStateEl.style.display = 'block';
    return;
  }

  emptyStateEl.style.display = 'none';
  tableEl.style.display = 'table';

  tbodyEl.innerHTML = filtered.map(lead => {
    // Generate <tr> with <td> cells for each column
  }).join('');
}
```

---

## Filtering System

### Client-Side Filter Logic

All filtering happens in `getFilteredLeads(options)`:

```javascript
function getFilteredLeads(options) {
  var opts = options || {};
  var applySearch = opts.applySearch !== false;
  var applySource = opts.applySource !== false;
  var applyPlatform = opts.applyPlatform !== false;
  var applyDates = opts.applyDates !== false;

  var filtered = allLeads.slice(); // Copy

  // Search: case-insensitive substring match across email, companyName, name, website
  if (applySearch) {
    var search = filterSearch.value.toLowerCase();
    if (search) {
      filtered = filtered.filter(lead => {
        return email.indexOf(search) !== -1 ||
               company.indexOf(search) !== -1 ||
               name.indexOf(search) !== -1 ||
               website.indexOf(search) !== -1;
      });
    }
  }

  // Source: filter by lead.source (audit, contact, survey, pricing-calculator)
  if (applySource) {
    var source = filterSource.value;
    if (source) {
      filtered = filtered.filter(lead => lead.source === source);
    }

    // Lead source: filter by lead.leadSource (form origin)
    var leadSource = filterLeadSource.value;
    if (leadSource) {
      filtered = filtered.filter(lead => lead.leadSource === leadSource);
    }
  }

  // Platform: filter by lead.utmSource (case-insensitive, 'other' for unknowns)
  if (applyPlatform) {
    var platform = filterPlatform.value;
    if (platform) {
      filtered = filtered.filter(lead => {
        var utmSource = (lead.utmSource || '').toLowerCase();
        if (platform === 'other') {
          var knownPlatforms = ['google', 'facebook', 'instagram', 'linkedin', 'youtube', 'bing', 'direct'];
          return utmSource && knownPlatforms.indexOf(utmSource) === -1;
        }
        return utmSource === platform;
      });
    }
  }

  // Date range: filter by lead.submittedAt (JavaScript Date comparison)
  if (applyDates) {
    var from = filterFrom.value; // YYYY-MM-DD
    var to = filterTo.value;     // YYYY-MM-DD
    if (from) {
      var fromDate = new Date(from);
      filtered = filtered.filter(lead => new Date(lead.submittedAt) >= fromDate);
    }
    if (to) {
      var toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // Include entire end day
      filtered = filtered.filter(lead => new Date(lead.submittedAt) <= toDate);
    }
  }

  return filtered;
}
```

### Filter Event Listeners

```javascript
filterSearch.addEventListener('input', debounce(renderTable, 300));
filterSource.addEventListener('change', renderTable);
filterLeadSource.addEventListener('change', renderTable);
filterPlatform.addEventListener('change', renderTable);
filterFrom.addEventListener('change', renderTable);
filterTo.addEventListener('change', renderTable);
clearFiltersBtn.addEventListener('click', () => {
  filterSearch.value = '';
  filterSource.value = '';
  filterLeadSource.value = '';
  filterPlatform.value = '';
  filterFrom.value = '';
  filterTo.value = '';
  renderTable();
});
```

---

## Question View (Analytics)

The Question View displays aggregated responses from all 4 form types: **Audit**, **Contact**, **Survey**, **GC Event**.

### FORM_REGISTRY Structure

```javascript
var FORM_REGISTRY = {
  '[formKey]': {
    label: string,                    // Display name
    color: string,                    // Hex color for charts
    leadFilter: function(lead),       // Filter predicate
    minDataThreshold: number,         // Min leads to show charts (default 3)
    sections: [
      { id: 'A', title: string, color: string },
      { id: 'B', title: string, color: string },
      ...
    ],
    questions: [
      {
        key: string,                  // Lead field name
        title: string,                // Display title
        type: 'single'|'multi'|'text', // Data type
        chartType: 'bar'|'doughnut'|'none',
        required: boolean,
        labelMap: Object,             // { key: 'Display Label' }
        orderedKeys: string[]|null,   // null = sort by frequency desc
        color: string,                // Hex color (section accent)
        section: 'A'|'B'|'C'|'D',     // Which section
        sparse?: boolean,             // Hide Neuvedeno entries
        authorField?: string,         // For text: attribute to use as author
        conditional?: boolean         // (future use)
      },
      ...
    ]
  }
};
```

### 4 Form Types

#### 1. **Audit** (formKey: `'audit'`)
- Color: `#f97316` (orange)
- Filter: `lead.source === 'audit'`
- Sections: A (Firma), B (Výzvy)
- Questions (4):

| Key | Title | Type | ChartType | LabelMap | OrderedKeys |
|-----|-------|------|-----------|----------|-------------|
| detectedIndustry | Detekované odvětví | single | bar | INDUSTRY_LABELS | null |
| city | Město | single | bar | {} | null |
| biggestPainPoint | Největší výzva | text | none | {} | null |
| currentTools | Aktuální nástroje | text | none | {} | null |

#### 2. **Contact** (formKey: `'contact'`)
- Color: `#00A39A` (teal)
- Filter: `lead.source === 'contact'`
- Sections: A (Poptávka), B (Zpráva)
- Questions (4):

| Key | Title | Type | ChartType | LabelMap | OrderedKeys |
|-----|-------|------|-----------|----------|-------------|
| service | Služba | single | bar | SERVICE_LABELS | null |
| budget_onetime | Jednorázový rozpočet | ordinal | bar | BUDGET_LABELS | ['tier1','tier2','tier3','tier4','unsure'] |
| budget_monthly | Měsíční rozpočet | ordinal | bar | BUDGET_LABELS | ['tier1','tier2','tier3','tier4','unsure'] |
| message | Zpráva | text | none | {} | null |

#### 3. **Survey** (formKey: `'survey'`)
- Color: `#8b5cf6` (purple)
- Filter: `lead.source === 'survey' && lead.leadSource !== 'gc-event-page'`
- Sections: A (Firma), B (Výzvy), C (Technologie), D (Postoj)
- Questions (11):

| Key | Title | Type | ChartType | LabelMap | OrderedKeys |
|-----|-------|------|-----------|----------|-------------|
| companySize | Velikost firmy | ordinal | bar | GC_COMPANY_SIZE_LABELS | ['solo','2-10','11-50','51-250','250+'] |
| industry | Odvětví | single | bar | INDUSTRY_LABELS | null |
| respondentRole | Role respondenta | single | bar | ROLE_LABELS | null |
| painPoints | Výzvy (multi) | multi | bar | PAIN_POINT_LABELS | null |
| primaryPainPoint | Hlavní výzva | single | bar | PAIN_POINT_LABELS | null |
| hoursLostPerWeek | Ztracené hodiny | ordinal | bar | GC_HOURS_LABELS | ['1-5','5-10','10-20','20-40','40+'] |
| crmUsed | CRM systém | single | bar | CRM_LABELS | null |
| erpUsed | ERP systém | single | bar | ERP_LABELS | null |
| aiMaturity | Vyspělost v AI | ordinal | doughnut | GC_AI_MATURITY_LABELS | ['none','experimenting','active'] |
| toolsUsed | Používané nástroje | multi | bar | TOOLS_LABELS | null |
| techOpenness | Otevřenost k tech | ordinal | doughnut | TECH_OPENNESS_LABELS | ['conservative','open','innovator'] |
| techLevel | Technická zdatnost | ordinal | bar | TECH_LEVEL_LABELS | ['none','beginner','intermediate','advanced'] |
| topExamples | Top 3 příklady | multi | bar | TOP_EXAMPLES_LABELS | null |
| contextNote | Poznámka ke kontextu | text | none | {} | null |

#### 4. **GC Event** (formKey: `'gc-event'`)
- Color: `#D4A017` (gold)
- Filter: `lead.leadSource === 'gc-event-page'`
- Sections: A (Firma), B (Výzvy), C (Technologie), D (Postoj)
- Questions (15, all same as Survey plus):

| Key | Title | Type | ChartType | LabelMap | OrderedKeys |
|-----|-------|------|-----------|----------|-------------|
| biggestManualProcess | Největší manuální proces | single | bar | MANUAL_PROCESS_LABELS | null |
| manualWorkPercentage | Podíl manuální práce | ordinal | doughnut | MANUAL_PCT_LABELS | ['under_10','10_25','25_50','over_50'] |

### Label Maps (All Values)

#### INDUSTRY_LABELS
```javascript
{
  'ecommerce': 'E-commerce',
  'retail': 'Maloobchod',
  'manufacturing': 'Výroba',
  'professional_svcs': 'Prof. služby',
  'real_estate': 'Reality',
  'hospitality': 'Pohostinství',
  'healthcare': 'Zdravotnictví',
  'education': 'Vzdělávání',
  'construction': 'Stavebnictví',
  'logistics': 'Logistika',
  'finance': 'Finance',
  'marketing_agency': 'Marketing / Agentura',
  'it_tech': 'IT / Tech',
  'other': 'Ostatní',
  'Neuvedeno': 'Neuvedeno'
}
```

#### PAIN_POINT_LABELS
```javascript
{
  'new_customers': 'Získávání zákazníků',
  'speed_to_lead': 'Pomalá reakce na poptávky',
  'automating_communication': 'Automatizace komunikace',
  'customer_support': 'Zákaznická podpora',
  'boring_admin': 'Opakující se administrativa',
  'reporting_data': 'Reporting a data',
  'juggling_tools': 'Příliš mnoho nástrojů',
  'integrating_ai': 'Zapojení AI',
  'marketing_materials': 'Marketingové materiály',
  'content_creation': 'Tvorba obsahu',
  'manual_data_entry': 'Ruční zadávání dat',
  'document_processing': 'Zpracování dokumentů',
  'other': 'Ostatní'
}
```

#### TOOLS_LABELS
```javascript
{
  'chatgpt': 'ChatGPT / Claude / Gemini',
  'automation': 'Make / n8n / Zapier',
  'crm': 'HubSpot / Pipedrive',
  'pm': 'Monday / Asana / Notion',
  'office': 'Google Workspace / M365',
  'accounting': 'Pohoda / Money S3',
  'custom': 'Vlastní řešení',
  'none': 'Žádné',
  'other': 'Ostatní'
}
```

#### ROLE_LABELS
```javascript
{
  'owner_ceo': 'Majitel / jednatel',
  'sales_manager': 'Obch. manažer',
  'ops_manager': 'Provozní manažer',
  'it_lead': 'IT vedoucí',
  'employee': 'Zaměstnanec',
  'other': 'Jiná role'
}
```

#### MANUAL_PROCESS_LABELS
```javascript
{
  'data_entry': 'Zadávání dat',
  'reporting': 'Reportování',
  'customer_comms': 'Komunikace se zákazníky',
  'scheduling': 'Plánování',
  'document_processing': 'Zpracování dokumentů',
  'invoicing': 'Fakturace',
  'onboarding': 'Nábor a onboarding',
  'other': 'Jiný'
}
```

#### CRM_LABELS
```javascript
{
  'none': 'Žádný',
  'excel': 'Excel / tabulky',
  'hubspot_pipedrive': 'HubSpot / Pipedrive',
  'salesforce': 'Salesforce',
  'raynet': 'Raynet',
  'custom_other': 'Vlastní / jiný'
}
```

#### ERP_LABELS
```javascript
{
  'none': 'Žádný',
  'pohoda': 'Pohoda',
  'abra_helios': 'ABRA / Helios',
  'sap': 'SAP',
  'money_s3': 'Money S3',
  'custom_other': 'Jiný'
}
```

#### MANUAL_PCT_LABELS
```javascript
{
  'under_10': '< 10 %',
  '10_25': '10–25 %',
  '25_50': '25–50 %',
  'over_50': '> 50 %'
}
```

#### TECH_OPENNESS_LABELS
```javascript
{
  'conservative': 'Konzervativní',
  'open': 'Otevřený',
  'innovator': 'Inovativní'
}
```

#### GC_AI_MATURITY_LABELS
```javascript
{
  'none': 'Nepoužíváme',
  'experimenting': 'Zkoušíme',
  'active': 'Aktivně používáme'
}
```

#### GC_COMPANY_SIZE_LABELS
```javascript
{
  'solo': 'Pouze já',
  '2-10': '2–10',
  '11-50': '11–50',
  '51-250': '51–250',
  '250+': '250+'
}
```

#### GC_HOURS_LABELS
```javascript
{
  '1-5': '1–5 h',
  '5-10': '5–10 h',
  '10-20': '10–20 h',
  '20-40': '20–40 h',
  '40+': '40+ h'
}
```

#### TECH_LEVEL_LABELS
```javascript
{
  'none': 'Vůbec',
  'beginner': 'Začátečník',
  'intermediate': 'Středně pokročilý',
  'advanced': 'Pokročilý'
}
```

#### TOP_EXAMPLES_LABELS
```javascript
{
  'auto_leads': 'Automatické hledání potenciálních klientů',
  'ai_web': 'Tvorba webu pomocí AI',
  'ai_assistant': 'AI asistent pro web',
  'ai_phone_management': 'Řízení byznysu z telefonu přes AI',
  'voice_blog': 'Blogové příspěvky na autopilota',
  'ai_avatar_reels': 'Reklamní příspěvky a reelska pomocí AI avatara',
  'ai_lead_magnet': 'Lead magnet pomocí AI + CRM'
}
```

### Question View Rendering Pipeline

1. **Activation:** User clicks "Analýza odpovědí" button or selects form from dropdown
2. **State Update:** `QV_STATE.visible = true`, `QV_STATE.activeFormKey = formKey`
3. **View Toggle:** Hide filters + table, show question-view-panel
4. **HTML Generation:** `QuestionView.buildQvHTML(formKey, formDef)` → dynamic HTML string
5. **Summary Bar:** `QuestionView.renderQvSummaryBar(formKey, leads, formDef)` → respondent count, date range, top stat
6. **Question Blocks:** `QuestionView.renderQuestionBlock(formKey, qDef, qNum, leads)` for each question
   - Data aggregation: single, multi, or text field
   - Chart creation or freetext rendering
   - Response bar update

### Data Aggregation Functions

#### Single-Value Fields (type: 'single' or 'ordinal')

```javascript
QuestionView.aggregateSingleField = function(leads, qDef) {
  var raw = countField(leads, qDef.key); // { keyValue: count, ... }

  // If orderedKeys defined, preserve that order + include zeros
  if (qDef.orderedKeys) {
    orderedKeys = qDef.orderedKeys;
    orderedValues = qDef.orderedKeys.map(k => raw[k] || 0);
  } else {
    // Otherwise, sort by frequency descending
    if (hasLabelMap) {
      counts = groupWithFallback(raw, knownKeys, qDef.labelMap);
    } else {
      counts = raw (minus Neuvedeno / empty);
    }
    sorted = sortedByFreqDesc(counts);
    orderedKeys = sorted.keys;
    orderedValues = sorted.values;
  }

  // Build labels, filter out empty/Neuvedeno
  labels = orderedKeys.filter(k => k !== 'Neuvedeno' && k !== '')
                       .map(k => qDef.labelMap[k] || k);
  values = corresponding counts;

  // totalResponded = count of leads with non-empty value
  totalResponded = leads.reduce((sum, lead) => {
    var v = lead[qDef.key];
    return (v && v !== '' && v !== 'Neuvedeno') ? sum + 1 : sum;
  }, 0);

  return { labels, values, totalResponded, respondents };
};
```

#### Multi-Value (Array) Fields (type: 'multi')

```javascript
QuestionView.aggregateMultiField = function(leads, qDef) {
  var raw = countArrayField(leads, qDef.key); // { arrayItem: count, ... }

  // Apply label mapping + grouping
  if (hasLabelMap) {
    counts = groupWithFallback(raw, knownKeys, qDef.labelMap);
  }
  sorted = sortedByFreqDesc(counts);

  labels = sorted.keys.map(k => qDef.labelMap[k] || k);
  values = sorted.values;

  // totalResponded = count of leads with non-empty array
  totalResponded = leads.reduce((sum, lead) => {
    var v = lead[qDef.key];
    return (Array.isArray(v) && v.length > 0) ? sum + 1 : sum;
  }, 0);

  return { labels, values, totalResponded, respondents };
};
```

#### Text Fields (type: 'text')

```javascript
QuestionView.aggregateTextField = function(leads, qDef) {
  var entries = [];
  leads.forEach(lead => {
    var text = lead[qDef.key];
    if (!text || text.trim() === '') return;
    var author = qDef.authorField ? lead[qDef.authorField] : '';
    entries.push({
      text: text.trim(),
      author: author.trim(),
      email: lead.email,
      leadId: lead.id
    });
  });
  return { entries, totalResponded: entries.length };
};
```

### Chart Rendering

#### Bar Charts (Horizontal)

```javascript
QuestionView.buildQvBarChart = function(formKey, qDef, labels, values, respondents) {
  var ctx = document.getElementById('qv-chart-' + formKey + '-' + qDef.key);

  qvChartInstances[formKey + '_' + qDef.key] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: qDef.color + '66',  // Semi-transparent
        borderColor: qDef.color,
        borderWidth: 2,
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',  // Horizontal bar
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, elements) => {
        // Show respondent panel for clicked bar
        QuestionView.showRespondentPanel(formKey, qDef.key, label, respondents.get(label));
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              var pct = Math.round(context.parsed.x / sum * 100);
              return ' ' + context.label + ': ' + context.parsed.x + ' (' + pct + '%)';
            }
          }
        }
      },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
        y: { autoSkip: false }
      }
    }
  });
};
```

#### Doughnut Charts

```javascript
QuestionView.buildQvDoughnutChart = function(formKey, qDef, labels, values, respondents) {
  var ctx = document.getElementById('qv-chart-' + formKey + '-' + qDef.key);

  var palette = ['#ef4444', '#D4A017', '#00A39A', '#6b7280', '#8b5cf6', '#f97316', '#3b82f6', '#22d3ee'];
  var bgColors = labels.map((_, i) => palette[i % palette.length]);

  qvChartInstances[formKey + '_' + qDef.key] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: bgColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      onClick: (event, elements) => {
        // Show respondent panel
        QuestionView.showRespondentPanel(formKey, qDef.key, label, respondents.get(label));
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 16, usePointStyle: true, boxWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              var pct = Math.round(context.parsed / sum * 100);
              return ' ' + context.label + ': ' + context.parsed + ' (' + pct + '%)';
            }
          }
        }
      }
    }
  });
};
```

#### Freetext List

```javascript
QuestionView.renderFreetextList = function(formKey, qDef, entries) {
  var container = document.getElementById('qv-freetext-' + formKey + '-' + qDef.key);

  if (!entries || entries.length === 0) {
    container.innerHTML = '<div class="gc-empty-field">Žádné textové odpovědi</div>';
    return;
  }

  var maxVisible = 5;
  var html = '';

  entries.forEach((entry, i) => {
    var hidden = i >= maxVisible ? ` style="display:none;" data-qv-extra="${formKey}-${qDef.key}"` : '';
    html += `<div class="gc-freetext-item"${hidden}>`;
    html += `"${escapeHtml(entry.text)}"`;
    if (entry.author) {
      html += `<div class="gc-freetext-author">— ${escapeHtml(entry.author)}</div>`;
    }
    html += `</div>`;
  });

  if (entries.length > maxVisible) {
    html += `<button class="gc-freetext-toggle" aria-expanded="false" onclick="...">
      Zobrazit vše (${entries.length})
    </button>`;
  }

  container.innerHTML = html;
};
```

### Respondent Panel

Clicking a chart bar/segment opens a respondent panel showing all people who selected that answer:

```javascript
QuestionView.showRespondentPanel = function(formKey, qKey, label, leadsList) {
  var panel = document.getElementById('qv-panel-' + formKey + '-' + qKey);

  // Toggle: clicking same bar again hides panel
  var currentLabel = panel.getAttribute('data-active-label');
  if (panel.style.display !== 'none' && currentLabel === label) {
    panel.style.display = 'none';
    return;
  }

  panel.setAttribute('data-active-label', label);

  var count = leadsList.length;
  var countText = count + ' ' + czechPlural(count, 'respondent', 'respondenti', 'respondentů');

  var html = '<div class="gc-respondent-panel__header">';
  html += '<span class="gc-respondent-panel__title">' + escapeHtml(label) + '</span>';
  html += '<span class="gc-respondent-panel__count">' + countText + '</span>';
  html += '<button class="gc-respondent-panel__close">×</button>';
  html += '</div>';
  html += '<ul class="gc-respondent-list">';

  leadsList.forEach(lead => {
    var name = lead.companyName || lead.name || '';
    var email = lead.email || '';
    html += '<li class="gc-respondent-item">';
    html += '<span class="gc-respondent-email">' + escapeHtml(email) + '</span>';
    if (name) {
      html += '<span class="gc-respondent-name">' + escapeHtml(name) + '</span>';
    }
    var date = lead.submittedAt
      ? new Date(lead.submittedAt).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';
    if (date) {
      html += '<span class="gc-respondent-date">' + date + '</span>';
    }
    html += '</li>';
  });

  html += '</ul>';
  panel.innerHTML = html;
  panel.style.display = 'block';
};
```

---

## CSV Export

### Export Format

```javascript
exportBtn.addEventListener('click', () => {
  const headers = [
    'Datum', 'Zdroj', 'Formulář', 'Platforma', 'Medium', 'Kampaň', 'Email',
    'Firma/Jméno', 'Web', 'Město', 'Telefon', 'Služba', 'Report URL', 'Jazyk',
    'GCLID', 'FBCLID', 'Referrer', 'Industry', 'Company Size', 'Pain Points',
    'Primary Pain Point', 'AI Maturity', 'Hours Lost/Week', 'Context Note',
    'Pouzivane nastroje', 'Tech Level', 'Top Examples'
  ];

  const rows = allLeads.map(lead => [
    new Date(lead.submittedAt).toISOString(),
    lead.source,
    lead.leadSource || '',
    lead.utmSource || '',
    lead.utmMedium || '',
    lead.utmCampaign || '',
    lead.email,
    lead.source === 'audit' ? (lead.companyName || '') : (lead.name || ''),
    lead.source === 'survey' ? '' : (lead.website || ''),
    lead.city || '',
    lead.phoneNumber || lead.phone || '',
    lead.service || '',
    lead.reportUrl || '',
    lead.language || '',
    lead.gclid || '',
    lead.fbclid || '',
    lead.referrer || '',
    lead.source === 'survey' ? (lead.industry || '') : '',
    lead.source === 'survey' ? (lead.companySize || '') : '',
    lead.source === 'survey' ? (lead.painPoints ? lead.painPoints.join('; ') : '') : '',
    lead.source === 'survey' ? (lead.primaryPainPoint || '') : '',
    lead.source === 'survey' ? (lead.aiMaturity || '') : '',
    lead.source === 'survey' ? (lead.hoursLostPerWeek || '') : '',
    lead.source === 'survey' ? (lead.contextNote || '') : '',
    lead.source === 'survey' ? ((lead.toolsUsed || []).join(', ') || '-') : '',
    lead.source === 'survey' ? (lead.techLevel || '') : '',
    lead.source === 'survey' ? ((lead.topExamples || []).join(', ') || '') : ''
  ].map(csvSafeValue).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
});
```

### CSV Safe Value Function

Injection prevention (Excel formula protection):

```javascript
function csvSafeValue(val) {
  let str = String(val || '').replace(/"/g, '""'); // Escape quotes
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str; // Prefix formula chars with apostrophe
  }
  return '"' + str + '"'; // Wrap in quotes
}
```

---

## Bulk Delete

### Delete Modal

```html
<div id="delete-modal" class="modal-overlay" style="display: none;">
  <div class="modal-content">
    <h3>Smazat vybrané leady</h3>
    <p id="delete-modal-count">Opravdu chcete smazat X leadů?</p>
    <label>
      <input type="checkbox" id="delete-reports-checkbox" checked />
      <span>Smazat i přiložené reporty (audit)</span>
    </label>
    <div class="modal-actions">
      <button id="delete-cancel-btn" class="btn btn-secondary">Zrušit</button>
      <button id="delete-confirm-btn" class="btn btn-danger">Smazat</button>
    </div>
  </div>
</div>
```

### Delete Flow

1. **Selection:** User checks checkboxes; `selectedLeads` Set updated
2. **Modal Trigger:** Click "Smazat vybrané (N)" button
   - Display modal with Czech plural form: "Opravdu chcete smazat X lead / leady / leadů?"
3. **Confirmation:** Click "Smazat" button → POST to `/.netlify/functions/admin-leads-delete`
   ```javascript
   {
     "leadIds": ["id1", "id2", ...],
     "deleteReports": true/false
   }
   ```
4. **Response:**
   ```json
   {
     "success": true,
     "deletedCount": 10,
     "errors": []
   }
   ```
5. **Cleanup:**
   - Clear `selectedLeads` Set
   - Re-render table via `fetchLeads()`
   - Deselect all checkboxes

---

## Client-Side State Variables

### Global Scope (Within IIFE)

```javascript
let allLeads = [];           // All leads from API (never filtered)
let password = '';            // Current session password
let selectedLeads = new Set(); // Checkbox-selected lead IDs

var QV_STATE = {
  visible: false,            // Whether Question View panel is shown
  activeFormKey: null,       // Current form: 'audit', 'contact', 'survey', 'gc-event'
  chartsRendered: {}         // { 'audit': true, ... } — tracks if rendered
};

var qvChartInstances = {};   // Chart.js instances by 'formKey_questionKey'
```

---

## Helper Functions

### XSS Prevention

```javascript
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeHref(url) {
  if (!url) return '';
  var trimmed = String(url).trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return escapeHtml(trimmed);
  }
  return escapeHtml('https://' + trimmed); // Add https:// if missing
}
```

### Data Aggregation

```javascript
function countField(leads, field) {
  return leads.reduce((acc, lead) => {
    var val = lead[field] || 'Neuvedeno';
    if (val === '') val = 'Neuvedeno';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function countArrayField(leads, field) {
  return leads.reduce((acc, lead) => {
    var values = lead[field];
    if (Array.isArray(values)) {
      values.forEach(v => {
        if (v) acc[v] = (acc[v] || 0) + 1;
      });
    }
    return acc;
  }, {});
}

function indexLeadsByField(leads, field) {
  var index = new Map();
  leads.forEach(lead => {
    var val = lead[field];
    if (!val || val === '' || val === 'Neuvedeno') return;
    if (!index.has(val)) index.set(val, []);
    index.get(val).push(lead);
  });
  return index;
}

function indexLeadsByArrayField(leads, field) {
  var index = new Map();
  leads.forEach(lead => {
    var values = lead[field];
    if (!Array.isArray(values)) return;
    values.forEach(v => {
      if (!v) return;
      if (!index.has(v)) index.set(v, []);
      index.get(v).push(lead);
    });
  });
  return index;
}

function sortedByFreqDesc(obj) {
  var entries = Object.entries(obj).sort((a, b) => b[1] - a[1]);
  return {
    keys: entries.map(e => e[0]),
    values: entries.map(e => e[1])
  };
}

function groupWithFallback(rawCounts, knownKeys, labelMap) {
  var grouped = {};
  Object.keys(rawCounts).forEach(k => {
    if (k === 'Neuvedeno' || k === '') return;
    if (knownKeys.indexOf(k) === -1) {
      grouped['other'] = (grouped['other'] || 0) + rawCounts[k];
    } else {
      grouped[k] = (grouped[k] || 0) + rawCounts[k];
    }
  });
  return grouped;
}
```

### Localization

```javascript
function czechPlural(n, one, few, many) {
  if (n === 1) return one;        // 1
  if (n >= 2 && n <= 4) return few; // 2, 3, 4
  return many;                    // 0, 5+
}
```

### Performance

```javascript
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

function setBarWrapperHeight(wrapperId, itemCount) {
  var wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    var h = Math.max(220, itemCount * 36); // Min 220px, +36px per item
    wrapper.style.height = h + 'px';
  }
}
```

### Chart Configuration

```javascript
var CHART_DEFAULTS = {
  color: '#9ca3af',
  font: { family: "'Inter', system-ui, sans-serif", size: 12 }
};

function applyGlobalChartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.color = CHART_DEFAULTS.color;
  Chart.defaults.font.family = CHART_DEFAULTS.font.family;
  Chart.defaults.font.size = CHART_DEFAULTS.font.size;
}
```

---

## Onboarding Tab Module

The `/admin/leads` page includes a secondary onboarding tab (sourced from `onboarding-tab.ts`) for HypeLead onboarding form submissions.

**File:** `astro-src/src/scripts/admin/onboarding-tab.ts` (340 lines)

### Data Structure

```typescript
interface OnboardingLead {
  id: string;
  source: 'onboarding';
  companyName: string;
  contactPersonEmail: string;
  contactPersonName: string;
  selectedPackage: 'starter' | 'professional' | 'enterprise';
  ico: string;
  city: string;
  website: string;
  status: string;
  driveFolder?: string;
  isPandaDocSigned?: boolean;
  submittedAt: string;
  numSalespeople: number;
  dailyVolume: string;
  channels: string[];
}
```

### Features

- **Pagination:** 20 items per page, prev/next/page-number buttons
- **Filters:** Search (company/email), Package (Starter/Professional/Enterprise), Status (Submitted/Processing/Completed)
- **Detail Panel:** Click row to expand and show all fields + Google Drive link + PandaDoc signature status
- **Styling:** Dark theme (inverse of main dashboard), self-contained CSS injected via `injectStyles()`

### API Integration

```typescript
export function initOnboardingTab(containerEl: HTMLElement, password: string, apiBaseUrl: string): void {
  // Fetch from /.netlify/functions/admin-leads?source=onboarding
  // Authorization: Bearer {password}
}
```

---

## Styling & Design

### Color Palette

| Component | Color | Hex |
|-----------|-------|-----|
| Primary CTA | Teal | #00A39A |
| Danger (Delete) | Red | #ef4444 |
| Audit Badge | Orange | #f97316 |
| Survey Badge | Purple | #8b5cf6 |
| Contact Badge | Teal | #00A39A |
| Pricing Badge | Pink | #ec4899 |
| GC Event Badge | Gold | #D4A017 |
| Section A (Firma) | Cyan | #00C4B4 |
| Section B (Výzvy) | Orange | #f97316 |
| Section C (Tech) | Indigo | #6366f1 |
| Section D (Postoj) | Sky | #22d3ee |
| Text (Primary) | Dark Gray | #111827 |
| Text (Muted) | Light Gray | #6b7280 |
| Border | Light Gray | #e5e7eb |
| Background | White | #ffffff |

### Fonts

- **Family:** Inter (Google Fonts)
- **Weights Used:** 300, 400, 500, 600, 700

### Responsive Design

Desktop-first, breakpoint at 768px:

```css
@media (max-width: 768px) {
  .header { padding: 1rem; }
  .stats-grid { padding: 1rem; }
  .filters { padding: 0 1rem 1rem; }
  .table-container { padding: 0 1rem 1rem; }
  .filters-row { flex-direction: column; }
  .filter-group input,
  .filter-group select {
    min-width: 100% !important;
  }
  /* ...more rules... */
}
```

---

## External Dependencies

### External Libraries

1. **Chart.js 4.4.7** (CDN)
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js" integrity="sha384-..."></script>
   ```

2. **Iconify Icon v1.0.7** (CDN)
   ```html
   <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
   ```

### Iconify Icons Used

- `solar:lock-keyhole-bold` — Login lock icon
- `solar:trash-bin-trash-bold` — Delete icon
- `solar:refresh-bold` — Refresh icon
- `solar:download-bold` — Download/Export icon
- `solar:logout-2-bold` — Logout icon
- `solar:list-bold` — Table view icon
- `solar:chart-square-bold` — Analytics view icon
- `solar:close-circle-bold` — Clear filters icon
- `svg-spinners:ring-resize` — Loading spinner
- `solar:inbox-line-bold` — Empty state icon

---

## Performance Considerations

1. **Debouncing:** Search filter debounced at 300ms to avoid excessive re-renders
2. **Chart Cleanup:** All Chart.js instances destroyed before DOM replacement to prevent memory leaks
3. **Lazy Rendering:** Chart.js canvas elements only created when Question View is activated
4. **sessionStorage:** Password persisted in browser session (not disk), clears on tab close
5. **CSV Export:** Client-side generation via Blob + download link (no backend processing)

---

## Accessibility

- **Screen Reader Support:** sr-only utility class for hidden text, ARIA labels on canvas charts
- **Keyboard Navigation:** Focus indicators on interactive elements, Enter/Space on charts opens respondent panel
- **Semantic HTML:** Proper heading hierarchy, table structure, form labels
- **Color Contrast:** All text meets WCAG AA standards
- **Reduced Motion:** CSS animations respect `prefers-reduced-motion` media query

---

## Known Limitations

1. **Concurrent Sessions:** Only one active session per browser/device (sessionStorage scope)
2. **Chart Limit:** Bar charts with 50+ items may have readability issues (height set to `Math.max(220, itemCount * 36)`)
3. **Mobile:** Table View optimized for desktop; narrow screens may require horizontal scroll
4. **Delete Max:** Bulk delete capped at 100 leads per request (backend limit)
5. **Search Case Sensitivity:** Substring match only; regex not supported

---

## Files Referenced

| File | Purpose | Lines |
|------|---------|-------|
| `astro-src/src/pages/admin/leads.astro` | Main dashboard page | 3,314 |
| `astro-src/src/scripts/admin/onboarding-tab.ts` | Onboarding tab module | 340 |
| `/.netlify/functions/admin-leads` | Fetch leads API | - |
| `/.netlify/functions/admin-leads-delete` | Delete leads API | - |

---

## Author Notes

- This page is **not pre-rendered** (`export const prerender = false`) — rendered server-side on each request to enforce authentication
- All client-side code is wrapped in an IIFE to avoid global scope pollution
- Label maps (INDUSTRY_LABELS, etc.) are defined as top-level `var` declarations (hoisting) before FORM_REGISTRY to ensure availability
- Question View uses a declarative FORM_REGISTRY pattern making it easy to add/modify forms without touching rendering logic
- CSV export includes all survey-specific fields; non-survey forms export empty strings for those columns
