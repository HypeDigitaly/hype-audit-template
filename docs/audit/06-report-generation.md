# Report Generation System

Complete documentation of the audit report generation system, covering HTML report building, bilingual content delivery, interactive features, PDF generation, storage, and expiration logic.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [HTML Report Generation](#html-report-generation)
   - [Parent Files](#parent-files)
   - [Section Generators](#section-generators)
3. [Data Schema: AuditReportData](#data-schema-auditreportdata)
4. [Glossary System](#glossary-system)
   - [Dual Architecture](#dual-architecture)
   - [Structure & Resolution](#structure--resolution)
5. [PDF Generation](#pdf-generation)
6. [Report Storage & Serving](#report-storage--serving)
7. [Bilingual Support](#bilingual-support)
8. [Interactive Features](#interactive-features)
9. [Styling & Branding](#styling--branding)

---

## Architecture Overview

The report generation system consists of three primary layers:

1. **HTML Report Module** (`html-report/`)
   - Generates responsive, interactive HTML reports with inlined CSS/JS
   - 15 section generators for different content types
   - Bilingual (Czech/English) support

2. **PDF Generator Module** (`pdf-generator/`)
   - Converts markdown to PDF using jsPDF + jsPDF-AutoTable
   - Font handling with Czech language support
   - Fallback generation for failed conversions

3. **Report Serving** (`audit-report.ts`)
   - Netlify Blobs storage: dual-key pattern (`{reportId}` HTML + `{reportId}-meta` JSON)
   - 30-day expiration with lazy deletion
   - Status codes: 200 (success), 404 (not found), 410 (expired), 500 (error)

### Re-export Shims

Two files at `audit-services/` root maintain backwards compatibility:

```typescript
// html-report-generator.ts - re-exports from ./html-report
export * from './html-report';

// pdf-generator.ts - re-exports from ./pdf-generator/index
export * from './pdf-generator/index';
```

This allows consumers to import from either location:
- Old: `import { generateHTMLReport } from './html-report-generator'`
- New: `import { generateHTMLReport } from './html-report'`

---

## HTML Report Generation

### Parent Files

#### `html-report/generator.ts`
**Purpose:** Main HTML report assembly function

**Function:** `generateHTMLReport(data: AuditReportData): string`

**Returns:** Complete HTML5 document (self-contained, single file)

**Key behaviors:**
- Reads `AuditReportData` input
- Loads translations via `getTranslations(data.language)`
- Loads CSS via `getStyles(data.companyBranding)` with smart color selection
- Loads inline JavaScript via `getScripts(data)` for interactive features
- Calls all 15 section generators in order
- Assembles into single HTML document with:
  - `<!DOCTYPE html>` + language attributes
  - Meta tags: `noindex, nofollow` (temporary/preview document)
  - Inlined `<style>` block (Tailwind-compiled CSS)
  - Inlined `<script>` block (vanilla JS, no framework)

**Section order in document:**
1. Header (logo, dates, action buttons)
2. Company profile card
3. Executive summary (benefits overview)
4. Opportunities (detailed cards)
5. Matrix visualization (2x2 grid)
6. ROI calculator (interactive sliders)
7. Questions section
8. Technologies detected
9. App integration opportunities
10. Benchmark data
11. Implementation timeline
12. Risk assessment
13. Tools recommendations
14. Intro/closing statement
15. CTA section
16. Footer

#### `html-report/index.ts`
**Purpose:** Public API exports

**Exports:**
- `generateHTMLReport()` - main function
- All type definitions (`AuditReportData`, `AIOpportunity`, etc.)
- `getTranslations()` - translation function
- Helper functions: `getEnhancedBenefitLabel()`, `selectBrandColor()`, `sanitizeColor()`, etc.
- All 15 section generators (for advanced customization)

#### `html-report/types.ts`
**Purpose:** TypeScript interfaces for report data

**Key interfaces:**

```typescript
// Core company information
interface CompanyProfile {
  name: string;
  website: string;
  city: string;
  industry: string;
  detectedIndustry?: string;
  employeeEstimate?: string;
  description?: string;
}

// Company branding from Firecrawl API
interface CompanyBranding {
  logo?: string;           // Company logo URL
  favicon?: string;        // Favicon URL
  primaryColor?: string;   // Hex color (may be browser default)
  accentColor?: string;    // Hex color
  backgroundColor?: string;
  confidence?: number;     // 0-100, trustworthiness score
}

// Individual benefit for an opportunity
interface OpportunityBenefit {
  type: BenefitType;      // 'time_savings', 'lead_generation', etc.
  value: string;          // "15-25", "30%", "24/7"
  unit: string;           // "h/týden", "%", "leadů/měsíc"
  label: string;          // Display label
  icon: string;           // Emoji
}

// AI opportunity recommendation
interface AIOpportunity {
  title: string;
  shortDescription?: string;  // Max 15 words, product explanation
  description: string;
  quadrant: 'quick_win' | 'big_swing' | 'nice_to_have' | 'deprioritize';
  estimatedSavingsHoursPerWeek: number;
  implementationEffort: 'low' | 'medium' | 'high';
  aiType: 'automation' | 'ml' | 'genai' | 'hybrid';
  expectedBenefits?: OpportunityBenefit[];
}

// ROI calculator configuration
interface ROIEstimate {
  totalHoursSavedPerWeek: number;
  defaultHourlyRate: number;  // Default employee rate
  assumptions: string[];      // Display assumptions
}

// Main report data container
interface AuditReportData {
  reportId: string;
  companyProfile: CompanyProfile;
  companyContext?: string;  // Personalized intro from news/activities
  companyBranding?: CompanyBranding;
  expectedBenefitsSummary?: ExpectedBenefitsSummary;

  // Technology detection
  detectedTechnologies?: DetectedTechnology[];
  hasOwnApplication?: boolean;
  ownApplicationDetails?: string | null;
  appIntegrationOpportunities?: AppIntegrationOpportunity[];

  // Market insights
  industryBenchmark?: IndustryBenchmark | null;
  implementationTimeline?: ImplementationTimelinePhase[];
  riskAssessment?: RiskAssessmentItem[];

  // Core recommendations
  auditQuestions: AuditQuestion[];
  aiOpportunities: AIOpportunity[];
  recommendedTools: RecommendedTool[];
  roiEstimate: ROIEstimate;

  // Metadata
  generatedAt: string;  // ISO timestamp
  expiresAt: string;    // ISO timestamp (30 days from generated)
  language: 'cs' | 'en';
}
```

**Benefit types** (comprehensive enum):
- Time-based: `time_savings`, `response_time`
- Revenue: `lead_generation`, `conversion_rate`, `new_customers`, `revenue_increase`
- Cost: `cost_reduction`, `error_reduction`
- Experience: `customer_satisfaction`, `availability`
- Community: `member_acquisition`, `churn_reduction`, `member_engagement`, `event_attendance`
- E-commerce: `products_sold`, `cart_abandonment_reduction`
- Education: `student_acquisition`, `course_completion`

#### `html-report/styles.ts`
**Purpose:** Generate CSS stylesheet with smart color selection

**Function:** `getStyles(branding?: CompanyBranding): string`

**Features:**
- Smart color selection priority:
  1. Accent color (most reliable)
  2. Primary color (if not browser default)
  3. Background color (if colorful)
  4. Fallback to `#00A39A` (HypeDigitaly brand)
- Filters out browser defaults (`#0000EE`, `#551A8B`, `#FFFFFF`, etc.)
- Color lightening: generates lighter variants for hover states
- CSS Custom Properties: `--primary`, `--primary-light`, `--orange`, etc.
- Tooltip system with hover pseudo-elements
- Print stylesheet optimizations (for PDF export)
- Responsive grid layouts (mobile-first)

**Color sanitization:**
- Validates hex format: `#RRGGBB` or `RRGGBB`
- Rejects invalid formats
- Returns null for unsafe colors

#### `html-report/translations.ts`
**Purpose:** Bilingual content (Czech/English)

**Function:** `getTranslations(lang: 'cs' | 'en'): Translations`

**Content covers:**
- Report metadata labels
- Section titles and subtitles
- Quadrant labels with tooltips
- Benefit type labels (human-readable)
- Interactive element labels
- CTA text
- Risk category labels
- Technical term explanations (jargon-free)

**Example:**
```typescript
const t = getTranslations('cs');
console.log(t.quickWinsTooltip); // "Vysoký přínos, snadná implementace - ideální start"
```

#### `html-report/scripts.ts`
**Purpose:** Vanilla JavaScript for interactive features

**Function:** `getScripts(data: AuditReportData): string`

**Features:**
- ROI calculator with real-time updates
- Opportunity card selection checkboxes
- Interactive benefit aggregation
- Chart.js integration for savings visualization
- Currency formatting (Czech Kč vs English $)
- Responsive slider interactions
- Benefit card highlighting on selection

**No external dependencies** (except Chart.js loaded separately)

#### `html-report/utils.ts`
**Purpose:** Utility functions for rendering, HTML escaping, color manipulation

**Functions:**

```typescript
// Enhanced label generation from glossary
getEnhancedBenefitLabel(type: BenefitType, lang: 'cs' | 'en'): GlossaryEntry
getEnhancedQuadrantLabel(quadrant: string, lang: 'cs' | 'en'): GlossaryEntry
getEnhancedImplementationTypeLabel(type: string, lang: 'cs' | 'en'): GlossaryEntry
getEnhancedTechCategoryLabel(category: string, lang: 'cs' | 'en'): GlossaryEntry
getEnhancedRiskCategoryLabel(category: string, lang: 'cs' | 'en'): GlossaryEntry

// HTML safety
wrapWithTooltip(text: string, tooltip: string): string
escapeHtmlAttr(text: string): string  // Escapes &, ", ', <, >

// Color manipulation
sanitizeColor(color?: string): string | null
lightenColor(hex: string, percent: number): string  // Lightens by percentage
isBrowserDefaultColor(color: string | null | undefined): boolean
selectBrandColor(branding?: CompanyBranding, fallback?: string): string
```

---

### Section Generators

Each section is generated by a separate file in `html-report/sections/`. All follow the same signature:

```typescript
export function generate[Section]Section(data: AuditReportData, t: Translations): string
```

#### `sections/header.ts`
**Generates:** Page header with logo, metadata, action buttons

**Output HTML:**
```html
<header class="report-header">
  <div class="header-inner">
    <div class="header-logo-group">
      <img src="[company-logo-or-fallback]" alt="[company-name]" class="logo">
      <div class="header-title-info">
        <h1>Předběžný audit</h1>
        <span class="meta">Company Name • 19. března 2026</span>
      </div>
    </div>
    <div class="header-actions">
      <a href="https://cal.com/..." class="btn btn-primary">📅 Domluvit schůzku</a>
      <button onclick="window.print()" class="btn btn-secondary">Uložit do PDF</button>
    </div>
  </div>
</header>
```

**Logo fallback chain:**
1. Company logo (if available)
2. Company favicon (if available)
3. Google favicon for domain
4. HypeDigitaly logo (final fallback)

**Date formatting:** Locale-aware (`toLocaleDateString`)

#### `sections/company.ts`
**Generates:** Company profile card with website, location, industry

**Input data:**
- `companyProfile.name`
- `companyProfile.website`
- `companyProfile.city`
- `companyProfile.detectedIndustry || industry`

**Output:** Grid of 3 cards with labels and values

#### `sections/intro.ts`
**Generates:** Closing statement and call-to-action

**Content:** Custom Czech/English message explaining report purpose

**Typical text:**
```
"Vytvořili jsme pro Vás předběžný audit s návrhy, jak by mohla umělá inteligence
pomoci zvýšit efektivitu a automatizovat manuální procesy..."
```

#### `sections/questions.ts`
**Generates:** List of questions to consider before AI adoption

**Input data:** `auditQuestions` array

**Output:** Organized by category with icons

```typescript
interface AuditQuestion {
  category: string;      // e.g., "Strategie"
  icon: string;          // Emoji
  questions: string[];   // Array of question strings
}
```

#### `sections/summary.ts` - Executive Summary
**Generates:** Benefits overview for C-level decision-makers

**Key logic:**
- Detects business type from industry (community, ecommerce, software, etc.)
- Customizes benefit display by business type
- Shows primary metrics prominently (e.g., "Member Acquisition" for communities)
- Sorts benefits by business-type relevance

**Input data:** `expectedBenefitsSummary`

```typescript
interface ExpectedBenefitsSummary {
  introText: string;           // Intro paragraph
  benefits: OpportunityBenefit[];
  disclaimer: string;          // e.g., "Estimates are based on..."
}
```

**Output:** Card-based layout with:
- Intro text
- Benefit cards with icons, values, units
- Disclaimer footer

#### `sections/opportunities.ts` - AI Recommendations
**Generates:** Detailed opportunity cards with benefits breakdown

**Output per card:**
- Quadrant badge (Quick Win, Big Swing, Nice to Have, Deprioritize) with tooltip
- Title
- Short description (if provided)
- Full description
- Benefits grid:
  - Each benefit shows: icon, value, unit, label
  - Primary metrics highlighted
  - Tooltip explanations from glossary
- Implementation effort tag

**Selection feature:**
- Checkbox in each card
- Selected cards highlighted
- Benefits aggregated in ROI section

#### `sections/matrix.ts`
**Generates:** 2x2 Opportunity Matrix visualization

**Structure:**
```
            ↑ HIGH EFFORT
            │
LOW IMPACT  │  DEPRIORITIZE  │  BIG SWING  │
────────────┼────────────────┼─────────────┼────→ HIGH IMPACT
            │                │             │
            │  NICE TO HAVE  │  QUICK WIN  │
            ↓ LOW EFFORT
```

**Input data:** `aiOpportunities` filtered by quadrant

**Output:** CSS Grid with:
- Continuous axis lines
- Outside axis labels
- Quadrant boxes colored by type
- Opportunity titles within boxes

#### `sections/roi.ts` - Interactive ROI Calculator
**Generates:** Interactive sliders for ROI estimation

**Controls:**
- Hourly rate slider (200-2500 Kč/h or $/h)
- Hours per week slider (1-500)
- Employee count slider (1-500)

**Real-time calculations:**
- Monthly savings: `(hours × rate × weeksPerMonth) × employeeCount`
- Yearly savings: `monthly × monthsPerYear`
- Chart visualization updated on input change

**Assumptions shown:**
- Static text from `roiEstimate.assumptions`
- Plus: "Time savings multiplied by number of employees"

#### `sections/technologies.ts`
**Generates:** Detected technologies list

**Input data:** `detectedTechnologies`

```typescript
interface DetectedTechnology {
  name: string;
  category: 'cms' | 'ecommerce' | 'crm' | 'erp' | 'custom_app' | 'framework' | 'database' | 'cloud' | 'other';
  confidence: 'high' | 'medium' | 'low';
  description?: string;
}
```

**Output:** Cards grouped by category with:
- Technology name
- Category label (from glossary)
- Confidence badge
- Description if available

#### `sections/app-integration.ts`
**Generates:** AI integration opportunities for own applications

**Conditional output:**
- **If company has own app** (`hasOwnApplication: true`):
  - List of integration opportunities
  - Implementation type (API, widget, chatbot, voice, etc.)
  - Effort estimate
  - Potential impact

- **If no app** (`hasOwnApplication: false`):
  - Suggests creating AI solutions for customers
  - Alternative implementation paths

#### `sections/benchmark.ts`
**Generates:** Industry benchmarking data

**Input data:** `industryBenchmark`

```typescript
interface IndustryBenchmark {
  aiAdoptionRate: number;      // Percentage
  topUseCases: string[];
  competitorInsights: string;
  marketTrend: string;
}
```

**Output:** Informational cards showing:
- Adoption rate in industry
- Common use cases
- Competitive landscape
- Market direction

#### `sections/timeline.ts`
**Generates:** Implementation roadmap

**Input data:** `implementationTimeline`

```typescript
interface ImplementationTimelinePhase {
  phase: 'quick_start' | 'short_term' | 'medium_term' | 'long_term';
  title: string;
  duration: string;  // e.g., "1-2 týdny"
  items: string[];   // Action items
}
```

**Output:** Vertical timeline with:
- Phase labels
- Duration
- Action items as checklist

#### `sections/risk.ts`
**Generates:** Risk assessment and mitigation strategies

**Input data:** `riskAssessment`

```typescript
interface RiskAssessmentItem {
  category: 'data_privacy' | 'employee_adoption' | 'technical' | 'regulatory' | 'financial';
  title: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}
```

**Output:** Cards per risk with:
- Category label (from glossary)
- Severity badge (color-coded)
- Description
- Mitigation strategy

#### `sections/tools.ts`
**Generates:** Recommended tools/software

**Input data:** `recommendedTools`

```typescript
interface RecommendedTool {
  name: string;
  category: string;  // "Document Analysis", "Content Generation", etc.
  useCase: string;   // How it helps
  url?: string;      // Link to tool
}
```

**Output:** Grid of tool cards with:
- Tool name
- Category badge
- Use case description
- Link (if available)

#### `sections/cta.ts`
**Generates:** Call-to-action section

**Content:** Fixed CTA:
- Headline: "Chcete vědět, kde přesně začít?"
- Subtitle: Invitation to schedule meeting
- Primary button: Links to Calendly
- Secondary text: Email contact option

#### `sections/footer.ts`
**Generates:** Report footer

**Content:**
- "Powered by HypeDigitaly" branding
- Report ID for reference
- Copyright/disclaimer

---

## Data Schema: AuditReportData

Complete reference for the main report data container.

### Structure Overview

```typescript
{
  // Metadata
  reportId: "audit-2024-03-19-abc123",
  language: "cs",
  generatedAt: "2026-03-19T10:30:00Z",
  expiresAt: "2026-04-18T10:30:00Z",

  // Company Information
  companyProfile: {
    name: "Vzorová Firma s.r.o.",
    website: "www.example.cz",
    city: "Praha",
    industry: "Software Development",
    detectedIndustry: "Software/IT Services",
    employeeEstimate: "25-50",
    description: "Custom web application development"
  },

  // Personalization
  companyContext: "Společnost se v poslední době zaměřila na...",

  // Branding
  companyBranding: {
    logo: "https://example.com/logo.png",
    favicon: "https://example.com/favicon.ico",
    primaryColor: "#1F2937",
    accentColor: "#FF6B35",
    backgroundColor: "#FFFFFF",
    confidence: 92
  },

  // Technology Detection
  detectedTechnologies: [
    {
      name: "React",
      category: "framework",
      confidence: "high",
      description: "Frontend framework"
    }
  ],
  hasOwnApplication: true,
  ownApplicationDetails: "Custom CRM system for customer management",

  // Market Data
  industryBenchmark: {
    aiAdoptionRate: 42,
    topUseCases: ["Customer Support", "Content Generation"],
    competitorInsights: "Competitors are adopting AI for...",
    marketTrend: "Market moving towards AI-assisted workflows"
  },

  // Recommendations
  aiOpportunities: [
    {
      title: "Chatbot pro zákaznickou podporu",
      shortDescription: "24/7 instant responses to customer questions",
      description: "Implementujte AI chatbot...",
      quadrant: "quick_win",
      estimatedSavingsHoursPerWeek: 20,
      implementationEffort: "low",
      aiType: "genai",
      expectedBenefits: [
        {
          type: "time_savings",
          value: "15-20",
          unit: "h/týden",
          label: "Úspora času",
          icon: "⏱️"
        }
      ]
    }
  ],

  // ROI Data
  roiEstimate: {
    totalHoursSavedPerWeek: 45,
    defaultHourlyRate: 500,
    assumptions: [
      "Based on 8-hour workday",
      "Assumes 60% process automation"
    ]
  },

  // Supporting Data
  auditQuestions: [
    {
      category: "Strategie",
      icon: "🎯",
      questions: ["Jaké jsou vaše hlavní obchodní cíle?", "..."]
    }
  ],

  recommendedTools: [
    {
      name: "ChatGPT",
      category: "Text Generation",
      useCase: "Customer communication",
      url: "https://chat.openai.com"
    }
  ],

  // Optional Detailed Data
  expectedBenefitsSummary: {
    introText: "AI nabízí následující přínosy...",
    benefits: [/* array of OpportunityBenefit */],
    disclaimer: "Odhady jsou orientační..."
  },

  appIntegrationOpportunities: [
    {
      title: "AI-powered search",
      description: "...",
      implementationType: "api_integration",
      estimatedEffort: "medium",
      potentialImpact: "High relevance improvement"
    }
  ],

  implementationTimeline: [
    {
      phase: "quick_start",
      title: "Příprava",
      duration: "1-2 týdny",
      items: ["Audit stávajících procesů", "..."]
    }
  ],

  riskAssessment: [
    {
      category: "data_privacy",
      title: "Ochrana osobních údajů",
      severity: "high",
      description: "...",
      mitigation: "..."
    }
  ]
}
```

### Field Requirements

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `reportId` | string | ✓ | Unique identifier, used as Blob key |
| `companyProfile` | object | ✓ | Name, website, city, industry |
| `aiOpportunities` | array | ✓ | At least 1 opportunity |
| `roiEstimate` | object | ✓ | Hours, rate, assumptions |
| `auditQuestions` | array | ✓ | Questions by category |
| `recommendedTools` | array | ✓ | Tools with category/useCase |
| `language` | enum | ✓ | 'cs' or 'en' |
| `generatedAt` | ISO string | ✓ | Timestamp |
| `expiresAt` | ISO string | ✓ | 30 days from generated |
| `companyBranding` | object | ✗ | Logo, favicon, colors (optional) |
| `expectedBenefitsSummary` | object | ✗ | Executive summary benefits |
| `detectedTechnologies` | array | ✗ | Technology stack |
| `hasOwnApplication` | boolean | ✗ | If company has custom app |
| `appIntegrationOpportunities` | array | ✗ | App integration ideas |
| `industryBenchmark` | object | ✗ | Market data |
| `implementationTimeline` | array | ✗ | Roadmap phases |
| `riskAssessment` | array | ✗ | Risk mitigation strategies |

---

## Glossary System

### Dual Architecture

The glossary system has two parallel implementations:

#### 1. Monolith: `glossary.ts` (ACTIVE)
**Path:** `audit-services/glossary.ts`
**Lines:** ~1,038
**Status:** Production

This is a single large file that exports all glossary data and helpers:

```typescript
// From glossary.ts
export const BENEFIT_TYPE_LABELS: Record<BenefitTypeKey, BilingualGlossaryEntry> = { ... }
export const QUADRANT_LABELS: Record<QuadrantKey, BilingualGlossaryEntry> = { ... }
export const TECHNICAL_TERMS: Record<string, BilingualGlossaryEntry> = { ... }
export const IMPLEMENTATION_TYPE_LABELS: Record<ImplementationTypeKey, BilingualGlossaryEntry> = { ... }
export const TECH_CATEGORY_LABELS: Record<TechCategoryKey, BilingualGlossaryEntry> = { ... }
export const RISK_CATEGORY_LABELS: Record<RiskCategoryKey, BilingualGlossaryEntry> = { ... }
export const BUSINESS_TYPE_KEYWORDS: Record<BusinessType, string[]> = { ... }
export const BUSINESS_TYPE_METRICS: Record<BusinessType, BusinessTypeMetricsConfig> = { ... }

export function detectBusinessType(industry: string): BusinessType { ... }
export function getBusinessTypeMetrics(type: BusinessType): BusinessTypeMetricsConfig { ... }
```

#### 2. Modular Refactor: `glossary/` (UNUSED)
**Path:** `audit-services/glossary/`
**Files:** 6 files
- `index.ts` - re-exports
- `benefit-labels.ts` - benefit type glossary
- `quadrant-labels.ts` - quadrant names
- `technical-terms.ts` - technical vocabulary
- `category-labels.ts` - category names
- `business-types.ts` - business type detection
- `helpers.ts` - utility functions
- `types.ts` - TypeScript interfaces

**Status:** Refactoring in progress (not actively imported)

### Structure & Resolution

**Why the dual system exists:**

TypeScript module resolution loads the **file** (`glossary.ts`) before the **directory** (`glossary/index.ts`). When consumers import from `../glossary`:

1. TypeScript looks for `glossary.ts` (FOUND) → uses that
2. Never reaches `glossary/index.ts` (SKIPPED)

**Current code organization:**
- Monolith (`glossary.ts`) is the active implementation
- Modular directory is a refactoring in progress
- Once complete, monolith can be deleted and directory will become active

### Glossary Content

#### Benefit Type Labels
Maps benefit types to human-readable labels with explanations:

```typescript
BENEFIT_TYPE_LABELS = {
  'time_savings': {
    cs: { label: 'Úspora času', tooltip: 'Hodiny práce, které AI ušetří Vašemu týmu každý týden' },
    en: { label: 'Time Savings', tooltip: 'Hours of work AI will save your team every week' }
  },
  'lead_generation': {
    cs: { label: 'Nové obchodní příležitosti', tooltip: '...' },
    en: { label: 'New Business Opportunities', tooltip: '...' }
  },
  // ... 18 more types
}
```

**Benefit types covered:**
- Core: time_savings, lead_generation, conversion_rate, new_customers, revenue_increase, cost_reduction, error_reduction, customer_satisfaction, response_time, availability
- Community: member_acquisition, churn_reduction, member_engagement, event_attendance
- E-commerce: products_sold, cart_abandonment_reduction
- Education: student_acquisition, course_completion

#### Quadrant Labels
Maps opportunity quadrants to descriptions:

```typescript
QUADRANT_LABELS = {
  'quick_win': {
    cs: { label: 'Řešit hned', tooltip: 'Vysoký přínos, snadná implementace - ideální start' },
    en: { label: 'Quick Win', tooltip: 'High impact, easy to implement - ideal starting point' }
  },
  'big_swing': { /* ... */ },
  'nice_to_have': { /* ... */ },
  'deprioritize': { /* ... */ }
}
```

#### Technical Terms
Explains jargon in CEO-friendly language:

```typescript
TECHNICAL_TERMS = {
  'API': {
    cs: { label: 'API (Rozhraní)', tooltip: 'Způsob, jak spolu komunikují programy...' },
    en: { label: 'API (Application Interface)', tooltip: '...' }
  },
  'Machine Learning': { /* ... */ },
  // ... more terms
}
```

#### Category Labels
Human-readable names for system categories:

```typescript
IMPLEMENTATION_TYPE_LABELS = {
  'api_integration': {
    cs: { label: 'API integrace', tooltip: '...' },
    en: { label: 'API Integration', tooltip: '...' }
  },
  'chatbot_embed': { /* ... */ },
  // ... more types
}

TECH_CATEGORY_LABELS = {
  'cms': { cs: { label: 'CMS (Web content)', tooltip: '...' }, ... },
  'ecommerce': { /* ... */ },
  // ... more categories
}

RISK_CATEGORY_LABELS = {
  'data_privacy': { cs: { label: 'Ochrana dat', tooltip: '...' }, ... },
  'employee_adoption': { /* ... */ },
  // ... more categories
}
```

#### Business Type Detection
Maps industries to benefit priorities:

```typescript
BUSINESS_TYPE_KEYWORDS = {
  'community_membership': ['komunita', 'klub', 'členství', 'association', 'membership'],
  'ecommerce': ['eshop', 'e-commerce', 'shop', 'obchod', 'prodej'],
  'software_it': ['software', 'it', 'dev', 'tech'],
  // ... 10+ more types
}

BUSINESS_TYPE_METRICS = {
  'ecommerce': {
    primaryMetrics: ['products_sold', 'cart_abandonment_reduction', 'conversion_rate'],
    description: 'E-commerce focused metrics'
  },
  'community_membership': {
    primaryMetrics: ['member_acquisition', 'churn_reduction', 'member_engagement'],
    description: 'Community membership metrics'
  },
  // ... more types
}

function detectBusinessType(industry: string): BusinessType {
  const lower = industry.toLowerCase();
  for (const [type, keywords] of Object.entries(BUSINESS_TYPE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return type as BusinessType;
    }
  }
  return 'generic';
}
```

**Business types:**
- community_membership
- ecommerce
- software_it
- marketing_agency
- service_business
- manufacturing
- education
- healthcare
- finance
- consulting
- real_estate
- logistics
- hospitality
- generic

### Usage in HTML Report

The glossary is consumed by:

1. **utils.ts** - retrieves labels and tooltips for display
2. **sections/summary.ts** - sorts benefits by business type
3. **sections/opportunities.ts** - highlights primary metrics
4. **styles.ts** - (via utils) applies colored styling

Example flow:
```typescript
// In opportunities.ts
const businessType = detectBusinessType(data.companyProfile.detectedIndustry);
const metricsConfig = getBusinessTypeMetrics(businessType);
const isPrimary = metricsConfig.primaryMetrics.includes(benefit.type);
// Render benefit with 'benefit-primary' class if isPrimary
```

---

## PDF Generation

### Architecture

PDF generation is a separate module with its own structure, designed to convert markdown content or HTML reports to PDF files.

**Path:** `audit-services/pdf-generator/`

**Entry points:**
- `pdf-generator.ts` (re-export shim at audit-services root)
- `pdf-generator/index.ts` (actual module)

### Core Files

#### `pdf-generator/generator.ts`
**Purpose:** Main PDF generation logic

**Functions:**

```typescript
async function generatePDFReport(markdown: string, formData: AuditFormData): Promise<PDFGenerationResult> {
  // Converts markdown to PDF with jsPDF + jsPDF-AutoTable
}

function generateFallbackPDF(formData: AuditFormData): Buffer {
  // Generates minimal PDF if markdown processing fails
}
```

**Process:**
1. Initialize jsPDF document with fonts
2. Add header with company logo and metadata
3. Parse markdown into sections
4. Render sections to PDF:
   - Text content with proper formatting
   - Opportunity matrix (2x2 grid with colored boxes)
   - Tables for tools, technologies, risks
   - Charts for ROI visualization
5. Add footers on each page
6. Add contact section at end
7. Return PDF as Buffer

**Font handling:**
- Czech language support via custom fonts
- Font loading from CDN
- Fallback fonts for missing glyphs

#### `pdf-generator/types.ts`
**Purpose:** Type definitions for PDF generator

**Key types:**

```typescript
interface PDFGenerationResult {
  success: boolean;
  pdfBuffer?: Buffer;    // PDF data if successful
  error?: string;        // Error message if failed
}

interface ParsedSection {
  title: string;
  content: string;
}

interface MatrixQuadrant {
  x: number;           // Position
  y: number;
  color: RGB;          // Fill color
  title: string;
  desc: string;
}

interface RGB {
  r: number;           // 0-255
  g: number;
  b: number;
}
```

#### `pdf-generator/styles.ts`
**Purpose:** PDF styling and content parsing

**Functions:**

```typescript
function getMatrixQuadrants(
  startX: number,
  startY: number,
  boxSize: number,
  gap: number,
  language: 'cs' | 'en'
): MatrixQuadrant[] {
  // Returns 4 quadrants positioned in 2x2 grid
}

function cleanMarkdownText(markdown: string): string {
  // Removes markdown syntax, cleans whitespace
}

function stripEmojis(text: string): string {
  // Removes emoji characters (PDF font compatibility)
}

function extractDomain(url: string): string {
  // Extracts domain from URL for favicon loading
}

function parseMarkdownToSections(markdown: string): ParsedSection[] {
  // Splits markdown by # headers into sections
}
```

**Color system:**
```typescript
const COLORS = {
  primary: { r: 0, g: 163, b: 154 },     // #00A39A
  primaryLight: { r: 51, g: 187, b: 179 },
  orange: { r: 249, g: 115, b: 22 },     // #F97316
  blue: { r: 59, g: 130, b: 246 },
  purple: { r: 168, g: 85, b: 247 },
  green: { r: 34, g: 197, b: 94 },
  dark: { r: 55, g: 65, b: 81 },
  darkGray: { r: 107, g: 114, b: 128 },
  text: { r: 26, g: 26, b: 26 },
  textMuted: { r: 102, g: 102, b: 102 },
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 }
}
```

#### `pdf-generator/helpers.ts`
**Purpose:** Font and asset loading utilities

**Functions:**

```typescript
async function initializeFonts(): Promise<void> {
  // Loads Czech fonts from CDN
}

function addHeader(doc: jsPDF, logoUrl: string, companyName: string, language: 'cs' | 'en'): void {
  // Adds header with logo and company info
}

function addFooters(doc: jsPDF, pageCount: number, language: 'cs' | 'en'): void {
  // Adds page numbers and company info to all pages
}

function addContactSection(doc: jsPDF, email: string, url: string, language: 'cs' | 'en'): void {
  // Adds contact information at end
}

function getFontName(): string {
  // Returns currently loaded font name (with Czech support)
}

function isFontLoaded(): boolean {
  // Checks if font is ready
}

async function loadLogoAsBase64(url: string): Promise<string> {
  // Converts image URL to base64 for embedding in PDF
}

async function loadFontFromCDN(fontUrl: string): Promise<ArrayBuffer> {
  // Fetches font from CDN
}
```

#### `pdf-generator/index.ts`
**Purpose:** Public API exports

**Exports:**
- `generatePDFReport()` - main async function
- `generateFallbackPDF()` - sync fallback
- Type definitions
- Styling utilities
- Helper functions

### PDF Generation Flow

```
Input: AuditReportData
       ↓
Convert to Markdown (via LLM or template)
       ↓
generatePDFReport(markdown, formData)
       ├─ Initialize jsPDF + fonts
       ├─ Load company logo
       ├─ Add header
       ├─ Parse markdown to sections
       ├─ Render each section:
       │  ├─ Text with proper formatting
       │  ├─ Opportunity matrix (2x2 grid)
       │  ├─ Tables (tools, technologies, risks)
       │  └─ Charts (ROI, benefits)
       ├─ Add page footers
       ├─ Add contact section
       ├─ Compile to PDF buffer
       └─ Return PDFGenerationResult
       ↓
Output: Buffer (PDF bytes)
        OR Error message
```

### Output Size & Performance

- **Typical report:** 8-12 MB (depends on images, charts)
- **Font file:** ~400 KB (cached in browser)
- **Generation time:** 2-5 seconds (async)
- **Fallback:** Always available if main fails

---

## Report Storage & Serving

### Architecture

Reports are stored in **Netlify Blobs** (serverless object storage) using a dual-key pattern:

```
audit-reports/
├── report-uuid-123              ← HTML content
└── report-uuid-123-meta         ← JSON metadata
```

### Storage Pattern

#### HTML Blob: `{reportId}`
**Content type:** `text/html`
**Size:** 150-400 KB (inlined styles & scripts)
**Format:** Complete HTML5 document, self-contained

**Example:**
```html
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Předběžný audit - Company Name</title>
  <style>/* All CSS inlined */</style>
</head>
<body>
  <!-- All content -->
  <script>/* All JavaScript inlined */</script>
</body>
</html>
```

**Why inlined?**
- Single file download
- No external requests
- No CSS/JS file dependencies
- Can be stored/shared as-is
- Browser renders immediately

#### Metadata Blob: `{reportId}-meta`
**Content type:** `text/json`
**Format:**
```json
{
  "companyName": "Vzorová Firma s.r.o.",
  "generatedAt": "2026-03-19T10:30:00Z",
  "expiresAt": "2026-04-18T10:30:00Z",
  "email": "contact@example.com"
}
```

**Used for:**
- Expiration checks (without parsing HTML)
- Email lookups in admin dashboards
- Analytics/audit trails
- Lazy deletion

### Report Serving

**File:** `audit-report.ts`

**Endpoint:** `/report/{reportId}`

**Handler function:**
```typescript
async function handler(event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse>
```

**Logic flow:**

```
Request: GET /report/{reportId}
  ↓
Extract reportId from URL path
  ↓
Validate reportId (not empty, not 'audit-report' or 'report')
  ↓
Get Netlify Blobs store
  ├─ NETLIFY_SITE_ID
  ├─ NETLIFY_API_TOKEN
  └─ consistency: "strong"
  ↓
Fetch HTML: store.get(reportId, { type: "text" })
  ├─ Found → Continue
  └─ Not found → Return 404 HTML page
  ↓
Fetch metadata: store.get("{reportId}-meta", { type: "text" })
  ├─ Found:
  │   ├─ Parse JSON
  │   ├─ Check expiration: now > expiresAt?
  │   │   ├─ Expired → Delete both blobs → Return 410 Gone
  │   │   └─ Valid → Continue
  │   └─ Catch parsing errors → Log, continue
  └─ Not found → Continue (metadata optional)
  ↓
Return 200 with HTML
  ├─ Content-Type: text/html; charset=utf-8
  ├─ Cache-Control: public, max-age=3600
  ├─ X-Report-ID: {reportId}
  └─ Body: HTML content
  ↓
Response sent to client
```

### Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | Success | Report found and valid |
| 400 | Bad Request | Invalid/missing reportId |
| 404 | Not Found | Report doesn't exist |
| 410 | Gone | Report expired, deleted |
| 500 | Server Error | Blobs connection failed |

### Error Pages

#### 404 Not Found
```html
<h1>Report nenalezen</h1>
<p>Tento report neexistuje nebo byl odstraněn.</p>
<a href="https://hypedigitaly.ai/audit">Vytvořit nový audit</a>
```

#### 410 Expired
```html
<h1>Report vypršel</h1>
<p>Tento report byl dostupný po dobu 30 dní a jeho platnost již vypršela.</p>
<div class="buttons">
  <a href="https://hypedigitaly.ai/audit">Nový audit</a>
  <a href="https://cal.com/hypedigitaly-pavelcermak/30-min-online">Konzultace</a>
</div>
```

#### 500 Server Error
```html
<h1>Chyba serveru</h1>
<p>Došlo k neočekávané chybě. Zkuste to prosím později.</p>
```

All error pages are:
- Self-contained (styled inline)
- Responsive (mobile-friendly)
- Bilingual (Czech/English)
- Dark theme (matching HypeDigitaly brand)

### Expiration Logic

**Timeline:**
1. Report created: `generatedAt = now`
2. Expiration set: `expiresAt = now + 30 days`
3. After 30 days: Report becomes stale
4. On access: Expiration checked
5. If expired:
   - Delete `{reportId}` (HTML)
   - Delete `{reportId}-meta` (metadata)
   - Return 410 Gone
   - Log deletion

**Expiration check code:**
```typescript
if (metadataJson) {
  try {
    const metadata: ReportMetadata = JSON.parse(metadataJson);
    const expiresAt = new Date(metadata.expiresAt);

    if (new Date() > expiresAt) {
      // Expired - delete both blobs
      await store.delete(reportId);
      await store.delete(`${reportId}-meta`);
      return { statusCode: 410, body: generateExpiredPage() };
    }
  } catch (e) {
    // Invalid metadata - log warning, continue
    console.warn(`Failed to parse metadata for ${reportId}:`, e);
  }
}
```

**Why lazy deletion?**
- No background job needed
- Deletion happens on access (natural cleanup)
- Metadata-first check (fast, no HTML parsing)
- Failed parses don't break serving (logged, continue)

### Caching

**HTTP headers for valid reports:**
```
Cache-Control: public, max-age=3600
```

**Caching strategy:**
- Cache for 1 hour (3600 seconds)
- Prevents unnecessary Blobs requests
- Reports don't change after generation
- Expiration handled server-side (no client cache stale data)

### Environment Configuration

**Required environment variables:**
```
NETLIFY_SITE_ID     # Site ID for authentication
NETLIFY_API_TOKEN   # Token for Blobs access
```

**Error if missing:**
```
[Blobs] Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN environment variables
Error: Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.
```

---

## Bilingual Support

### Language Support

All content supports **Czech (cs)** and **English (en)**.

**Language selection:**
```typescript
// Stored in AuditReportData
language: 'cs' | 'en'

// Used throughout report
const t = getTranslations(data.language);
document.documentElement.lang = data.language;
```

### Content Areas

#### Static Text
**File:** `html-report/translations.ts`

Covers ~80 keys:
- Section titles
- Button labels
- Quadrant names
- Risk categories
- Benefit types
- Interactive element text

**Example:**
```typescript
const czechTranslations: Translations = {
  reportTitle: 'Předběžný audit',
  quickWins: 'Řešit hned',
  riskDataPrivacy: 'Ochrana dat',
  // ... 80+ more keys
};

const englishTranslations: Translations = {
  reportTitle: 'Pre-Audit Report',
  quickWins: 'Quick Wins',
  riskDataPrivacy: 'Data Privacy',
  // ... corresponding English text
};
```

#### Glossary Entries
**File:** `glossary.ts` (monolith) or `glossary/*.ts` (modular)

Each glossary entry has both languages:

```typescript
BENEFIT_TYPE_LABELS = {
  'time_savings': {
    cs: { label: 'Úspora času', tooltip: '...' },
    en: { label: 'Time Savings', tooltip: '...' }
  }
}
```

#### Dynamic Content
Dynamic content (company names, opportunity descriptions, etc.) is passed in `AuditReportData` as-is (not translated by report generator).

### Locale-Aware Features

**Date formatting:**
```typescript
new Date(data.generatedAt).toLocaleDateString(
  data.language === 'cs' ? 'cs-CZ' : 'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' }
)
// Czech: 19. března 2026
// English: March 19, 2026
```

**Currency formatting:**
```typescript
new Intl.NumberFormat(
  data.language === 'cs' ? 'cs-CZ' : 'en-US'
).format(value) + (data.language === 'cs' ? ' Kč' : ' $')
// Czech: 150 000 Kč
// English: 150,000 $
```

**Number formatting:**
- Czech: 1 234,56 (comma decimal, space thousands)
- English: 1,234.56 (period decimal, comma thousands)

### PDF Language Support

PDF generator includes Czech fonts for:
- Special characters: č, š, ž, ů, etc.
- Proper text rendering in PDF
- Font loaded from CDN, cached in browser

---

## Interactive Features

### ROI Calculator

**Location:** `sections/roi.ts` (HTML generation) + `scripts.ts` (JavaScript)

**UI Elements:**
- Hourly rate slider (200-2500)
- Hours per week slider (1-500)
- Employee count slider (1-500)
- Real-time results display
- Chart visualization

**Calculations:**
```javascript
monthlyBonus = (hoursPerWeek * hourlyRate * weeksPerMonth) * employeeCount
yearlySavings = monthlyBonus * monthsPerYear

// Currency formatting applied (Kč vs $)
```

**Dynamic chart:**
- Chart.js library (external script)
- Draws savings by employee count
- Updates on slider change
- Color-coded bars (primary brand color)

### Benefit Aggregation

**Feature:** Select opportunities to see aggregate benefits

**UI:**
- Checkbox in each opportunity card
- Cards highlight when selected
- Benefits aggregated from selected cards
- Display in collapsible panel below

**JavaScript logic** (in `scripts.ts`):
```javascript
function aggregateCheckedBenefits() {
  const benefitTotals = {};

  oppCheckboxes.forEach(checkbox => {
    if (!checkbox.checked) return;

    const benefits = JSON.parse(checkbox.dataset.benefits);
    benefits.forEach(benefit => {
      if (!benefitTotals[benefit.type]) {
        benefitTotals[benefit.type] = { total: 0, count: 0 };
      }
      benefitTotals[benefit.type].total += parseBenefitValue(benefit.value);
      benefitTotals[benefit.type].count++;
    });
  });

  return benefitTotals;
}
```

**Benefit value parsing:**
- Handles ranges: "15-25" → 20 (average)
- Handles percentages: "30%" → 30
- Handles single numbers: "100" → 100
- Removes non-numeric characters

### Tooltip System

**Purpose:** Explain jargon in context

**Implementation:**
- CSS tooltip with hover pseudo-elements
- Data attribute carries tooltip text
- HTML-escaped for safety

**CSS:**
```css
.tooltip-term:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  background: var(--text-main);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: normal;
  max-width: 280px;
}
```

**HTML:**
```html
<span class="tooltip-term" data-tooltip="Hodiny práce, které AI ušetří">
  Úspora času
</span>
```

### Print/PDF Export

**Feature:** Button to export report as PDF

**Implementation:**
```html
<button onclick="window.print()" class="btn btn-secondary">
  Uložit do PDF
</button>
```

**How it works:**
1. User clicks "Uložit do PDF"
2. Browser opens print dialog
3. User selects "Save as PDF"
4. Browser renders report to PDF with print stylesheet
5. File downloaded as `PreauditReport-CompanyName.pdf`

**Print stylesheet:**
- Removes header/footer actions (no print URLs)
- Adjusts colors for paper
- Page breaks between sections
- Hides interactive elements

---

## Styling & Branding

### CSS Architecture

**Generation:** `styles.ts` produces complete inlined CSS stylesheet

**Customization:** Smart color selection from company branding

### Color Selection Algorithm

**Priority order:**
1. **Accent color** (if valid and not browser default)
   - Most reliable brand indicator from Firecrawl API
2. **Primary color** (if not browser default)
   - Often a safe brand color
3. **Background color** (if colorful, not black/white)
   - Fallback if colors are available
4. **#00A39A** (HypeDigitaly brand)
   - Final safe fallback

**Browser defaults filtered:**
```typescript
const browserDefaults = [
  '#0000EE', // Default unvisited link
  '#551A8B', // Default visited link
  '#000000', // Pure black
  '#FFFFFF', // Pure white
  '#FF0000', // Pure red
  '#00FF00', // Pure green
  '#0000FF'  // Pure blue
];
```

**Why filter?**
- Firecrawl may return browser default colors
- These don't represent actual brand colors
- Filtering ensures authentic branding

### CSS Variables

**Auto-generated from branding:**
```css
:root {
  --primary: #[selected-color];
  --primary-light: [lightened variant];
  --orange: #F97316;
  --blue: #3B82F6;
  --purple: #A855F7;
  --green: #22C55E;
  --bg-white: #FFFFFF;
  --bg-light: #F8F9FA;
  --text-main: #1A1A1A;
  --text-muted: #666666;
  --border: #E5E5E5;
  --radius: 16px;
}
```

**Usage in components:**
```css
.button {
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
}

.button:hover {
  background: var(--primary-light);
}
```

### Responsive Design

**Mobile-first approach:**
- Base styles for mobile (320px+)
- Media queries for tablet (768px+)
- Media queries for desktop (1024px+)

**Key responsive features:**
- Header stacks on mobile
- Grid layouts adjust column count
- Text size increases for readability
- Buttons full-width on mobile
- Charts responsive via Chart.js

### Print Stylesheet

**Hidden on print:**
- Header action buttons
- Interactive form elements
- Footer with unnecessary info

**Optimized on print:**
- Black text on white background
- All colors preserved (charts, badges)
- Page breaks between sections
- Compact margins

---

## Implementation Checklist

Use this checklist when building or modifying the report generation system:

### HTML Report
- [ ] All 15 sections generate valid HTML
- [ ] Bilingual text verified (Czech + English)
- [ ] Company branding applied (logo, colors)
- [ ] Interactive features working (calculator, checkboxes, tooltips)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Print/PDF export functional
- [ ] All internal links work
- [ ] No external requests (inlined CSS/JS)
- [ ] Performance: < 2s to render
- [ ] Accessibility: WCAG AA compliant

### Data Schema
- [ ] `reportId` unique
- [ ] `language` is 'cs' or 'en'
- [ ] `generatedAt` and `expiresAt` valid ISO timestamps
- [ ] `expiresAt = generatedAt + 30 days`
- [ ] All required fields present
- [ ] No null values in critical sections
- [ ] Benefit types valid (from enum)
- [ ] Quadrants valid (quick_win, big_swing, etc.)

### Storage
- [ ] Both blobs stored: `{reportId}` + `{reportId}-meta`
- [ ] HTML < 500 KB
- [ ] Metadata valid JSON
- [ ] 30-day expiration set correctly
- [ ] Blobs accessible from audit-report.ts

### Serving
- [ ] Endpoint accessible: `/report/{reportId}`
- [ ] Valid report returns 200 + HTML
- [ ] Missing report returns 404
- [ ] Expired report returns 410 + deletes blobs
- [ ] Error handling graceful
- [ ] Cache headers set (1 hour)

### Glossary
- [ ] All benefit types have labels
- [ ] All quadrants have explanations
- [ ] Business type detection working
- [ ] Primary metrics correct per industry
- [ ] Tooltips helpful and concise
- [ ] No hardcoded English terms

### PDF Generation
- [ ] PDF generation function works
- [ ] Czech fonts load correctly
- [ ] PDF < 15 MB
- [ ] All sections rendered
- [ ] Charts visible and readable
- [ ] Fallback PDF works if main fails
- [ ] Font loading timeout handled

---

## Troubleshooting

### Common Issues

**Report not found (404)**
- Verify `reportId` exists in Blobs
- Check Netlify Blobs authentication
- Confirm Blob key format: `{reportId}` (no prefix)

**Report expired (410)**
- Expected behavior after 30 days
- User should generate new audit
- Blobs should have been auto-deleted

**Missing branding (colors, logo)**
- Firecrawl may not have detected brand
- Fallback colors/logos used automatically
- Check `companyBranding.confidence` score

**Bilingual content missing**
- Verify `language` field in AuditReportData
- Check `translations.ts` for all keys
- Glossary entries should have both languages

**Interactive calculator not working**
- Check for JavaScript errors in browser console
- Verify Chart.js library loads
- Confirm data attributes on opportunity cards

**PDF export blank/broken**
- Ensure report renders in HTML first
- Check browser print dialog settings
- Try different browser (Chromium-based recommended)

**Tooltip not showing**
- Verify CSS loaded (no style tag removed)
- Check data-tooltip attribute present
- Hover area correct (span element)

---

## Related Documentation

- **01-architecture.md** — System-wide design
- **02-audit-flow.md** — Audit generation pipeline
- **03-data-integration.md** — Data flow from input to report
- **04-storage-layer.md** — Netlify Blobs configuration
- **05-serving-layer.md** — HTTP endpoints and delivery

---

**Last updated:** 2026-03-19
**Version:** 1.0
**Author:** Documentation Engineer
