# AI Research Pipeline Documentation

**Location:** `astro-src/netlify/functions/audit-services/`

**Version:** v3 (LangGraph Deep Research Agent)

**Language:** TypeScript + Node.js

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Dual Architecture Pattern](#dual-architecture-pattern)
3. [Research Pipeline Flow](#research-pipeline-flow)
4. [Research Steps & Progress](#research-steps--progress)
5. [Modular Components (14 Files)](#modular-components-14-files)
6. [Monolith Implementation](#monolith-implementation)
7. [Model Cascade & LLM Configuration](#model-cascade--llm-configuration)
8. [Integration Modules](#integration-modules)
9. [Fallback & Error Handling](#fallback--error-handling)
10. [Output Schema](#output-schema)
11. [State Machine Diagram](#state-machine-diagram)

---

## Architecture Overview

The AI research pipeline is a sophisticated system that conducts **comprehensive deep research** on companies and generates **personalized AI audit reports**. The system employs a **dual architecture pattern**: a modular LangGraph implementation (recommended) alongside a monolithic fallback for backward compatibility.

### Key Features

- **9-step research pipeline** with real-time progress tracking (configuration-driven)
- **Tavily web search integration** for company research (configurable search types and limits)
- **Firecrawl branding extraction** (optional) for company logos/colors
- **LLM-powered analysis** with configurable model selection and parameters
- **Prompt customization** (system identity, tone, focus areas, brand mentions)
- **Jina AI search** for website content extraction
- **JSON parser** with 4-layer fallback extraction strategy
- **Field validator** with AI-powered form validation
- **Structured output** generation for HTML report rendering

### Tech Stack

- **Search APIs:** Tavily (primary), Jina AI (website content)
- **Branding:** Firecrawl API v2 (optional, with retry logic)
- **LLM:** OpenRouter (model cascade: Gemini Flash → Gemini Pro → Claude Sonnet)
- **Validation:** OpenRouter + robust JSON parsing
- **Storage:** Netlify Blobs (reports, leads, job status)
- **Progress Tracking:** Callback-based real-time updates

---

## Dual Architecture Pattern

### Why Two Architectures?

The codebase maintains **both monolithic and modular implementations** for different reasons:

1. **Modular (Preferred):** Cleaner separation of concerns, easier testing, better maintainability
2. **Monolithic (Backward Compatible):** Single-file entry point for legacy integrations

### Import Paths & Relationships

```
audit-services/
├── langgraph-agent.ts          # MONOLITH (2465 lines) - Exports: executeDeepResearch()
│                                # Used by: audit.ts (legacy calls)
│                                # Imports from: html-report-generator, json-parser-utils, glossary
│
└── langgraph/
    ├── index.ts                # Central export hub - Re-exports all modular functionality
    ├── config.ts               # RESEARCH_STEPS, MODEL_CONFIGS, utility functions
    ├── types.ts                # All TypeScript interfaces
    ├── executor.ts             # MAIN ENTRY: executeDeepResearch() - orchestrates pipeline
    ├── tavily-search.ts        # Tavily API execution
    ├── query-generator.ts      # Generate search queries
    ├── prompt-generator.ts     # Build LLM prompts
    ├── llm-synthesizer.ts      # OpenRouter API calls + model cascade
    ├── fallback-report.ts      # Fallback report generation
    ├── industry-recommendations.ts  # Industry-specific prompts
    ├── pain-point-analyzer.ts  # Pain point categorization
    ├── niche-examples.ts       # Show-and-tell examples for LLM
    ├── value-proposition-templates.ts  # Copywriting patterns
    └── micro-niches.ts         # 40+ niche definitions

    # IMPORTS FROM ELSEWHERE:
    ├── json-parser-utils.ts    # JSON extraction & validation
    ├── ai-field-validator.ts   # Form field validation
    ├── branding-fetcher.ts     # Firecrawl branding API
    ├── jina-search.ts          # Jina AI website extraction
    ├── openrouter-analysis.ts  # Legacy fallback (for PDF generator)
    └── shared/
        ├── types.ts            # AuditFormData, AuditJob, AuditLead, JobStatus
        └── storage.ts          # Netlify Blobs operations
```

### Which One to Use?

- **New code:** Use modular `langgraph/index.ts` exports
- **Existing code:** May use monolithic `langgraph-agent.ts` directly
- **Backward compatibility:** Monolith remains supported

**Example calls:**

```typescript
// MODULAR (recommended)
import { executeDeepResearch } from './langgraph';
const result = await executeDeepResearch(formData, tavilyKey, openrouterKey, onProgress);

// MONOLITHIC (legacy)
import { executeDeepResearch } from './langgraph-agent';
const result = await executeDeepResearch(formData, tavilyKey, openrouterKey, onProgress);
```

Both have identical signatures and behavior.

---

## Research Pipeline Flow

The research pipeline follows a **sequential 9-step process**:

```
1. fetch_branding (28%)
   ↓
2. search_company_info (30%)
   ↓
3. search_company_news (34%)
   ↓
4. search_website (38%)
   ↓
5. search_technologies (42%)
   ↓
6. search_company_apps (46%)
   ↓
7. search_ai_tools (50%)
   ↓
8. llm_analyzing (55%)
   ↓
9. building_report (58%)
```

### Step Details

#### Step 1: fetch_branding (28%)

**File:** `branding-fetcher.ts`

**Purpose:** Fetch company branding (logo, colors, fonts) from Firecrawl API v2

**Configuration:**
- API: `POST https://api.firecrawl.dev/v2/scrape`
- Format: `{ formats: ["branding"] }`
- Timeout: 20 seconds
- Retries: 2 with exponential backoff (1s → 2s → 5s max)
- Retryable errors: 429, 500-504

**Output:** `CompanyBranding` object
```typescript
interface CompanyBranding {
  logo?: string;           // Primary logo URL
  favicon?: string;        // Fallback favicon
  primaryColor?: string;   // Brand hex color
  accentColor?: string;    // Secondary color
  backgroundColor?: string;
  colorScheme?: string;    // "light" or "dark"
  confidence?: number;     // 0-1 Firecrawl confidence
}
```

**Fallback:** Google Favicon service (`https://www.google.com/s2/favicons?domain=...`)

**Status:** Optional (non-blocking failures)

---

#### Steps 2-4: Web Research (30%, 34%, 38%)

**Files:** `executor.ts` (orchestration) + `tavily-search.ts` (execution)

**Search Types:**
- **Step 2 (search_company_info):** Generic company information
  - Query: `"${companyName}" ${city} IČO rejstřík firem` (Czech) or `company registry business information` (English)
  - Type: `generic`

- **Step 3 (search_company_news):** News, reviews, testimonials
  - Query: `"${companyName}" novinky reference recenze` (Czech) or `news reviews testimonials` (English)
  - Type: `generic`

- **Step 4 (search_website):** Domain-specific information
  - Query: `"${companyName}" služby produkty nabídka...` (Czech) or `services products business type` (English)
  - Type: `domain-specific` (restricted to company website domain)
  - Domain restriction: `includeDomains: [domain]` header

**Tavily Configuration:**
- API: Tavily SDK (`@tavily/core`)
- Max results: 5
- Search depth: `advanced` (comprehensive)
- Include images: true
- Include raw content: `markdown` format
- Timeout: 15 seconds

**Output:** `TavilySearchResult`
```typescript
interface TavilySearchResult {
  query: string;
  results: SearchResultItem[];  // Up to 5 results
  images?: Array<{ url: string; description?: string }>;
  success: boolean;
  type: 'generic' | 'domain-specific' | 'technology' | 'apps' | 'ai-tools';
}

interface SearchResultItem {
  title: string;
  url: string;
  content: string;        // Snippet
  rawContent?: string;    // Full markdown (truncated to 2000 chars)
  score?: number;
}
```

---

#### Steps 5-7: Specialized Research (42%, 46%, 50%)

**Step 5 (search_technologies):**
- Query: `"${companyName}" technologie software platforma...`
- Type: `technology`
- Purpose: Detect tech stack (Shopify, WordPress, custom CRM, etc.)

**Step 6 (search_company_apps):**
- Query: `"${companyName}" mobilní aplikace software produkt iOS Android...`
- Type: `apps`
- Purpose: Detect if company has own applications/software products

**Step 7 (search_ai_tools):**
- Query: `best AI tools ${industryKeywords} automation 2026 chatbot voicebot`
- Type: `ai-tools`
- Purpose: Research industry-standard AI tools for recommendations

**All use same Tavily configuration** as web research steps.

---

#### Step 8: LLM Analysis (55%)

**Files:** `llm-synthesizer.ts`, `prompt-generator.ts`

**Purpose:** Synthesize research results into structured JSON using LLM

**Prompt Construction:**
- Combines all Tavily search results
- Includes industry-specific recommendations
- Uses niche examples for personalization
- Incorporates pain point analysis
- Provides value proposition templates

**Files involved in prompt generation:**
- `prompt-generator.ts`: Main prompt builder
- `industry-recommendations.ts`: Industry-specific content
- `pain-point-analyzer.ts`: Pain point categorization
- `niche-examples.ts`: Show-and-tell examples
- `value-proposition-templates.ts`: Copywriting patterns
- `micro-niches.ts`: 40+ detailed niche definitions

---

#### Step 9: Report Building (58%)

**Files:** `executor.ts` (orchestration), `fallback-report.ts` (defaults)

**Purpose:** Assemble final `AuditReportData` structure with all components

**Components assembled:**
- Company profile (detected industry, description)
- Company context (personalized intro)
- Detected technologies
- App integration opportunities
- Industry benchmark data
- Implementation timeline
- Risk assessment
- Audit questions (5+ categories)
- AI opportunities (10 items)
- Recommended tools
- ROI estimate
- Expected benefits summary

---

## Research Steps & Progress

### RESEARCH_STEPS Configuration

**Location:** `langgraph/config.ts`

```typescript
export const RESEARCH_STEPS: Record<ResearchStep, {
  progress: number;
  messageCs: string;
  messageEn: string;
}> = {
  'fetch_branding': { progress: 28, messageCs: 'Načítám branding...' },
  'search_company_info': { progress: 30, messageCs: 'Hledám informace...' },
  'search_company_news': { progress: 34, messageCs: 'Hledám novinky...' },
  'search_website': { progress: 38, messageCs: 'Analyzuji webové stránky...' },
  'search_technologies': { progress: 42, messageCs: 'Zjišťuji technologie...' },
  'search_company_apps': { progress: 46, messageCs: 'Hledám aplikace...' },
  'search_ai_tools': { progress: 50, messageCs: 'Hledám AI nástroje...' },
  'llm_analyzing': { progress: 55, messageCs: 'AI analyzuje...' },
  'building_report': { progress: 58, messageCs: 'Sestavuji report...' }
}
```

### Progress Callback System

**Type:** `ProgressCallback`

```typescript
export type ProgressCallback = (
  step: ResearchStep,
  progress: number,
  message: string
) => Promise<void>;
```

**Usage:** Frontend polls job status in real-time

**Storage:** Job status stored in `audit-shared/storage.ts` (Netlify Blobs)

**Integration:** Called sequentially during `executeDeepResearch()`

---

## Modular Components (14 Files)

### 1. **langgraph/index.ts**

**Purpose:** Central export hub for modular architecture

**Exports:**

```typescript
// Types
export type { AuditFormInputs, ResearchStep, TavilySearchResult, ... }

// Config
export { RESEARCH_STEPS, MODEL_CONFIGS, extractDomain, generateReportId }

// Tavily Search
export { executeTavilySearch, createTavilyClient }

// Query Generator
export { generateQuerySets, detectIndustryKeywords }

// Prompt Generator
export { generateResearchPrompt }

// Industry Recommendations
export { getIndustrySpecificRecommendations }

// LLM Synthesizer
export { synthesizeStructuredReport }

// Fallback Report
export { generateFallbackBenefitsSummary, generateDefaultQuestions, ... }

// Executor (Main Entry Points)
export { executeSearchesWithProgress, executeDeepResearch }
```

**Critical:** This is the **preferred import source** for all langgraph functionality.

---

### 2. **langgraph/config.ts**

**Purpose:** Configuration constants and utility functions

**Key Exports:**

| Export | Purpose |
|--------|---------|
| `RESEARCH_STEPS` | Progress tracking config (9 steps) |
| `MODEL_CONFIGS` | Primary + fallback model arrays |
| `extractDomain()` | Parse URL to domain |
| `generateReportId()` | Create unique report ID (12 chars) |

**MODEL_CONFIGS Detail:**

```typescript
export const MODEL_CONFIGS: ModelConfig[] = [
  {
    name: 'Primary',
    models: [
      'google/gemini-3-flash-preview',  // Fastest, good for varied output
      'google/gemini-3-pro-preview',     // Fallback 1
      'anthropic/claude-sonnet-4.5'      // Fallback 2
    ],
    temperature: 0.7,  // Creative, varied output
    maxRetries: 1
  },
  {
    name: 'Fallback (Claude)',
    models: [
      'anthropic/claude-sonnet-4.5',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-3-flash-preview'
    ],
    temperature: 0.6,  // Slightly more structured
    maxRetries: 1
  }
];
```

---

### 3. **langgraph/types.ts**

**Purpose:** All TypeScript interfaces for langgraph module

**Key Types:**

```typescript
// Form inputs
interface AuditFormInputs {
  website: string;
  companyName: string;
  city: string;
  industry: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

// Research result wrapper
interface ResearchResult {
  success: boolean;
  reportData?: AuditReportData;
  error?: string;
}

// Progress callback
type ProgressCallback = (step: ResearchStep, progress: number, message: string) => Promise<void>;

// Research steps (9 total)
type ResearchStep = 'fetch_branding' | 'search_company_info' | ... | 'building_report';

// Tavily search result
interface TavilySearchResult {
  query: string;
  results: SearchResultItem[];
  images?: Array<{ url: string; description?: string }>;
  success: boolean;
  type: 'generic' | 'domain-specific' | 'ai-tools' | 'technology' | 'apps';
}

// LLM synthesis
interface SynthesisResult {
  success: boolean;
  data?: any;
  error?: string;
  usedFallbackModel?: boolean;
}

interface ModelConfig {
  name: string;
  models: string[];        // Array for model cascade
  temperature: number;     // 0.6-0.7
  maxRetries: number;      // Usually 1
}
```

---

### 4. **langgraph/executor.ts**

**Purpose:** Main orchestration and entry points

**Key Functions:**

#### `executeDeepResearch()` - PRIMARY ENTRY POINT

```typescript
export async function executeDeepResearch(
  formData: AuditFormInputs,
  tavilyApiKey: string,
  openrouterApiKey: string,
  onProgress?: ProgressCallback  // Real-time status callback
): Promise<ResearchResult>
```

**Steps:**
1. Execute Tavily searches with progress tracking
2. Format search results for LLM
3. Generate research prompt
4. Synthesize structured report
5. Build final AuditReportData

**Returns:**
```typescript
{
  success: true,
  reportData: {
    reportId: string;
    companyProfile: { ... };
    aiOpportunities: AIOpportunity[];
    // ... full AuditReportData
  }
}
// OR
{
  success: false,
  error: string;
}
```

#### `executeSearchesWithProgress()`

```typescript
export async function executeSearchesWithProgress(
  apiKey: string,
  formData: AuditFormInputs,
  onProgress?: ProgressCallback
): Promise<TavilySearchResult[]>
```

**Executes 6 Tavily searches sequentially:**
1. Company info (generic)
2. Company news (generic)
3. Website content (domain-specific)
4. Technology stack (technology type)
5. Company apps (apps type)
6. AI tools (ai-tools type)

#### `executeParallelSearches()` (Legacy)

Backward compatibility wrapper around `executeSearchesWithProgress()`.

#### `formatSearchResultsForPrompt()`

```typescript
export function formatSearchResultsForPrompt(results: TavilySearchResult[]): string
```

**Purpose:** Format search results into markdown for LLM prompt

**Logic:** Uses `rawContent` (full markdown) when available, falls back to `content` (snippet)

---

### 5. **langgraph/tavily-search.ts**

**Purpose:** Tavily API execution

**Key Function:**

```typescript
export async function executeTavilySearch(
  client: TavilyClient,
  query: string,
  type: TavilySearchResult['type'],
  domain?: string | null
): Promise<TavilySearchResult>
```

**Configuration:**
- Search depth: `advanced`
- Max results: 5
- Include images: true
- Include raw content: `markdown`
- Timeout: 15 seconds
- Domain restriction: For `domain-specific` type only

**Optimizations:**
- Truncates `rawContent` to 2000 chars max (reduces token usage)
- Logs response keys for debugging
- Detailed logging per result

**Helper:**

```typescript
export function createTavilyClient(apiKey: string): TavilyClient
```

---

### 6. **langgraph/query-generator.ts**

**Purpose:** Generate search queries based on form data

**Key Functions:**

#### `generateQuerySets()`

```typescript
export function generateQuerySets(formData: AuditFormInputs): QuerySets
```

**Returns 5 query categories:**

```typescript
interface QuerySets {
  generic: string[];           // 2 queries
  domainSpecific: string[];    // 1 query
  technology: string[];        // 1 query
  apps: string[];              // 1 query
  aiTools: string[];           // 1 query (industry-specific)
}
```

**Czech Example:**
```typescript
generic: [
  `"Company Name" City IČO rejstřík firem informace`,
  `"Company Name" novinky reference recenze`
]
domainSpecific: [
  `"Company Name" služby produkty nabídka...`
]
technology: [
  `"Company Name" technologie software platforma...`
]
apps: [
  `"Company Name" mobilní aplikace software...`
]
aiTools: [
  `best AI tools marketing automation 2026...`
]
```

#### `detectIndustryKeywords()`

```typescript
export function detectIndustryKeywords(industry: string, language: 'cs' | 'en'): string
```

**Maps industries to keywords:**
- `it_software` → `software development coding programming`
- `manufacturing` → `manufacturing production factory`
- `retail` → `retail ecommerce sales`
- ... (11 total mappings)

---

### 7. **langgraph/prompt-generator.ts**

**Purpose:** Construct comprehensive LLM prompt for research synthesis

**Key Function:**

```typescript
export function generateResearchPrompt(
  formData: AuditFormInputs,
  searchData: string,
  aiToolsData: string
): string
```

**Prompt Components:**

1. **System Instructions:** Tells LLM to be creative copywriter, personalize to company, avoid jargon
2. **JSON Schema:** Full schema for expected output structure
3. **Company-Specific Instructions:** 7 categories of audit questions
4. **AI Opportunities Section:** 10 specific recommendations with quadrant mapping
5. **Industry Recommendations:** Dynamic based on detected business type
6. **Language-Specific Rules:** Czech vs English copywriting standards

**Prompt is ~10,000-15,000 characters** and includes:
- All Tavily search results (company info + tech + apps)
- Industry-specific recommendations
- Niche examples for personalization
- Pain point analysis
- Value proposition templates
- Copywriting guidelines

---

### 8. **langgraph/llm-synthesizer.ts**

**Purpose:** OpenRouter API calls with model cascade and error handling

**Key Function:**

```typescript
export async function synthesizeStructuredReport(
  prompt: string,
  openrouterApiKey: string,
  formData: AuditFormInputs
): Promise<SynthesisResult>
```

**Process:**

1. **Model Cascade:** Tries PRIMARY first, then FALLBACK
2. **Retry Logic:** Each config gets `maxRetries` attempts
3. **JSON Extraction:** Uses robust 4-layer fallback extraction
4. **Validation:** Checks JSON structure, fills defaults
5. **Truncation Detection:** Warns if response appears cut off

**Configuration:**

```typescript
const request = {
  models: MODEL_CONFIGS[idx].models,  // Model cascade array
  messages: [
    { role: 'system', content: creativityInstructions },
    { role: 'user', content: prompt }
  ],
  max_tokens: 32000,                   // Prevent truncation
  temperature: MODEL_CONFIGS[idx].temperature  // 0.7 for creative
}
```

**Response Handling:**

1. Check `response.ok`
2. Extract `response.choices[0].message.content`
3. Call `extractAndParseJson()` for robust extraction
4. Call `validateAuditReportStructure()` to validate
5. Call `fillAuditReportDefaults()` to add missing fields
6. Return `SynthesisResult` with `usedFallbackModel` flag

**Timeouts:** 30 seconds

---

### 9. **langgraph/fallback-report.ts**

**Purpose:** Generate fallback content when LLM fails or provides incomplete data

**Key Functions:**

#### `generateFallbackBenefitsSummary()`

```typescript
export function generateFallbackBenefitsSummary(
  opportunities: AIOpportunity[],
  roiEstimate: ROIEstimate | undefined,
  formData: AuditFormInputs,
  detectedIndustry?: string
): ExpectedBenefitsSummary
```

**Features:**
- Business-type aware (communities, e-commerce, education, software, etc.)
- Generates 4 relevant benefits per business type
- Conservative estimates (ranges, not single numbers)
- Bilingual (Czech/English)

**Business-Type Mapping:**
| Type | Primary Metrics |
|------|-----------------|
| `community_membership` | member_acquisition, churn_reduction, member_engagement, time_savings |
| `ecommerce` | revenue_increase, conversion_rate, new_customers, cart_abandonment_reduction |
| `education` | student_acquisition, course_completion, customer_satisfaction, time_savings |
| `software_it` | time_savings, cost_reduction, error_reduction, response_time |
| `default` | time_savings, revenue_increase, new_customers, error_reduction |

#### `generateDefaultQuestions()`

```typescript
export function generateDefaultQuestions(isCzech: boolean): AuditQuestion[]
```

**Generates 5 question categories:**
1. Role a tým (Role & Team)
2. Pracovní postupy (Processes & Workflow)
3. Nástroje a technologie (Tools & Technology)
4. Bezpečnost a AI Act (Security & Legal)
5. Kultura a vedení (Culture & Leadership)

**Each with 3-5 deep questions**

#### `generateDefaultOpportunities()`

```typescript
export function generateDefaultOpportunities(isCzech: boolean): AIOpportunity[]
```

**Generates 7 default AI opportunities:**
- AI Chatbot for customer support (quick_win)
- Automated content generation (quick_win)
- Email management assistant (quick_win)
- Meeting transcripts & summaries (quick_win)
- Content creation assistant (nice_to_have)
- Voice AI for phone calls (big_swing)
- B2B outreach automation (big_swing)

#### Other Generators

- `generateDefaultTools()` → 5 recommended tools
- `generateDefaultTimeline()` → 4 implementation phases
- `generateDefaultRisks()` → 3 risk categories

#### `generateAgentFallbackReport()`

**Complete fallback when agent completely fails:**

```typescript
export function generateAgentFallbackReport(
  formData: AuditFormInputs
): AuditReportData
```

**Returns full `AuditReportData` with all default components**

---

### 10. **langgraph/industry-recommendations.ts**

**Purpose:** Industry-specific AI solution recommendations for LLM prompt

**Key Function:**

```typescript
export function getIndustrySpecificRecommendations(language: 'cs' | 'en'): string
```

**Returns large prompt template** (~5,000+ lines) with:

**5 Business Categories (A-E):**

1. **Category A: Client Acquisition Businesses**
   - Who: Agencies, consultants, coaches, realtors, freelancers, B2B services, communities, education platforms
   - Recommendations: AI Outreach + Inbound Lead Magnet

2. **Category B: Service Businesses**
   - Who: Gyms, salons, clinics, auto repairs, restaurants, coworking
   - Recommendations: AI Booking Assistant, Customer Service, Appointment Reminders

3. **Category C: Product/E-Commerce Businesses**
   - Who: E-shops, manufacturers, retailers
   - Recommendations: AI Product Recommendations, Customer Support, Video Generation

4. **Category D: Content/Information Businesses**
   - Who: Publishers, knowledge bases, training platforms
   - Recommendations: AI Content Generation, SEO Optimization, Personalized Content

5. **Category E: Complex/Enterprise Businesses**
   - Who: Large enterprises, government, financial services
   - Recommendations: Advanced analytics, fraud detection, compliance automation

**Each category includes:**
- Problem description
- Specific AI solutions (3-5 per category)
- Metrics and ROI expectations
- Implementation considerations

---

### 11. **langgraph/pain-point-analyzer.ts**

**Purpose:** Categorize pain points and map to AI solutions

**Key Interface:**

```typescript
interface PainPointCategory {
  id: string;
  name: { cs: string; en: string };
  description: { cs: string; en: string };
  keywords: { cs: string[]; en: string[] };
  mappedSolutions: string[];
  promptEmphasis: { cs: string; en: string };
  emotionalHook: { cs: string; en: string };
}
```

**10 Pain Point Categories:**

1. `customer_communication` - Answering inquiries, slow response, email overload
2. `time_efficiency` - Manual work, repetitive tasks, slow processes
3. `lead_generation` - Getting new customers, outreach, sales pipeline
4. `data_management` - Organizing information, reporting, data analysis
5. `team_coordination` - Internal communication, project management, bottlenecks
6. `content_creation` - Writing materials, marketing content, presentations
7. `decision_making` - Analyzing data, predicting trends, optimizing strategies
8. `quality_control` - Errors, inconsistency, process compliance
9. `customer_retention` - Keeping customers engaged, reducing churn
10. `system_integration` - Connecting tools, data flow, automation

**Each mapped to specific AI solutions** and includes emotional hooks for persuasive prompts.

---

### 12. **langgraph/niche-examples.ts**

**Purpose:** Show-and-tell examples for LLM personalization

**Structure:**

```typescript
interface NicheExample {
  nicheId: string;
  nicheLabel: { cs: string; en: string };
  parentCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  companyContextExample: { bad: { ... }, good: { ... } };
  opportunityDescriptionExample: { bad: { ... }, good: { ... } };
  introTextExample: { cs: string; en: string };
  industryTerms: { cs: string[]; en: string[] };
  emotionalTriggers: { cs: string[]; en: string[] };
}
```

**Example Niches (40+):**
- Community / Membership Club
- Agency (Digital Marketing, Consulting, etc.)
- Fitness / Gym
- Salon / Beauty
- Auto Repair / Car Service
- Restaurant / Café / Bar
- E-commerce / Online Shop
- Software / IT Company
- Education / Academy / Courses
- SaaS / Cloud Software Company

**Shows LLM:**
- Good vs. bad company context writing
- Good vs. bad opportunity descriptions
- Industry-specific terminology
- Emotional triggers for persuasion

---

### 13. **langgraph/value-proposition-templates.ts**

**Purpose:** Copywriting patterns and storytelling templates

**Key Exports:**

```typescript
export const VARIETY_OPENERS = {
  cs: [
    'Představte si situaci:',
    'Každý den se opakuje stejný scénář:',
    'Váš tým pravděpodobně zná tento problém:',
    'Co kdyby [činnost] probíhala automaticky?',
    // ... 6 more
  ],
  en: [
    'Picture this scenario:',
    'Every day, the same pattern repeats:',
    // ... 8 more
  ]
}

export const STORYTELLING_PATTERNS: StorytellingPattern[] = [
  { id: 'problem_agitation_solution', pattern: '...' },
  { id: 'current_state_desired_state', pattern: '...' },
  { id: 'before_after_transformation', pattern: '...' },
  // More patterns
]

export const BENEFIT_FRAMEWORKS = { ... }
```

**Critical:** Forces LLM to use **different openers for each AI opportunity** (not repetitive).

---

### 14. **langgraph/micro-niches.ts**

**Purpose:** 40+ detailed niche definitions for hyper-personalized recommendations

**Structure:**

```typescript
interface MicroNiche {
  id: string;
  label: { cs: string; en: string };
  parentBusinessType: BusinessType;
  parentCategory: 'A' | 'B' | 'C' | 'D' | 'E';
  keywords: string[];
  specificPainPoints: { cs: string; en: string }[];
  primarySolutions: {
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    primaryBenefit: BenefitTypeKey;
  }[];
  competitorContext: { cs: string; en: string };
}
```

**Example Niches:**

**Category A (Client Acquisition):**
- Community / Membership
- Consulting / Coaching
- Digital Agency
- Real Estate / Properties
- Educational Platform

**Category B (Service Businesses):**
- Fitness / Gym
- Salon / Beauty
- Auto Repair
- Medical Clinic
- Restaurant / Café

**Category C (Product/E-Commerce):**
- E-commerce / Online Shop
- SaaS / Cloud Software
- Manufacturing / Factory

**Category D (Content):**
- Publishing / News
- Training / Academy

**Category E (Complex/Enterprise):**
- Large Enterprise
- Government Agency

**Each micro-niche includes:**
- Detection keywords
- Specific pain points (3-5 per niche)
- Primary solutions (2-4 per niche)
- Competitor context for market positioning

---

## Monolith Implementation

**File:** `langgraph-agent.ts` (2,465 lines)

### Why Keep It?

- **Backward compatibility** with existing code
- **Single-file operation** for simpler debugging
- **Self-contained** - doesn't depend on modular files
- **Legacy integrations** may directly import from here

### Key Differences from Modular

The monolith includes **inline versions** of:
- `generateQuerySets()` (inline)
- `detectIndustryKeywords()` (inline)
- `generateResearchPrompt()` (inline, extremely long)
- `formatSearchResultsForPrompt()` (inline)
- `executeSearchesWithProgress()` (inline)
- `executeTavilySearch()` (inline)

All inline implementations have **identical logic** to modular versions.

### Primary Export

```typescript
export async function executeDeepResearch(
  formData: AuditFormInputs,
  tavilyApiKey: string,
  openrouterApiKey: string,
  onProgress?: ProgressCallback
): Promise<ResearchResult>
```

**Identical behavior to modular version** but all code in one file.

### Types Imported

```typescript
import type { AuditReportData, ... } from './html-report-generator';
import { extractAndParseJson, validateAuditReportStructure, ... } from './json-parser-utils';
import { detectBusinessType, getBusinessTypeMetrics } from './glossary';
```

Imports come from **shared utilities**, not from modular `langgraph/` folder.

---

## Model Cascade & LLM Configuration

### Configuration-Driven LLM Settings

**File:** `config.json` (new v2 feature)

All LLM parameters are now **fully configurable** via config.json:

```json
{
  "llm": {
    "primaryModel": "google/gemini-3-flash-preview",
    "fallbackModels": [
      "google/gemini-3-pro-preview",
      "anthropic/claude-sonnet-4.5"
    ],
    "temperature": 0.7,
    "maxTokens": 32000,
    "timeout": 30000
  },
  "prompt": {
    "systemIdentity": "You are a professional AI consultant...",
    "tone": "professional",
    "focusAreas": ["automation", "efficiency", "cost-reduction"],
    "brandMentions": ["Company Name"],
    "customInstructions": "Additional context..."
  },
  "search": {
    "additionalQueries": ["custom search 1", "custom search 2"],
    "maxQueries": 6,
    "disabledQueryTypes": ["ai-tools"]  // Disable specific search types
  }
}
```

### Primary Model Configuration (Hard-Coded Defaults)

**File:** `langgraph/config.ts`

These defaults are used if config.json doesn't override them:

```typescript
export const MODEL_CONFIGS: ModelConfig[] = [
  {
    name: 'Primary',
    models: [
      'google/gemini-3-flash-preview',    // Model 1 (fastest)
      'google/gemini-3-pro-preview',      // Model 2 (better quality)
      'anthropic/claude-sonnet-4.5'       // Model 3 (highest quality)
    ],
    temperature: 0.7,
    maxRetries: 1
  },
  {
    name: 'Fallback (Claude)',
    models: [
      'anthropic/claude-sonnet-4.5',
      'anthropic/claude-3.5-sonnet',
      'google/gemini-3-flash-preview'
    ],
    temperature: 0.6,
    maxRetries: 1
  }
];
```

### Prompt Customization

**File:** `config.json` (llm.prompt section)

The system prompt can be customized to reflect:

| Config Field | Purpose | Example |
|---|---|---|
| `systemIdentity` | Model's role and expertise | "You are an expert AI strategist for manufacturing..." |
| `tone` | Writing style | "professional", "casual", "technical", "sales-focused" |
| `focusAreas` | What to emphasize in recommendations | `["automation", "cost-reduction", "customer-experience"]` |
| `brandMentions` | Brand names to incorporate | `["Acme Corp", "our platform"]` |
| `customInstructions` | Additional context or constraints | "Always mention ROI in dollars, not hours..." |

**Implementation:** Used in `prompt-generator.ts` when building the research synthesis prompt.

### Search Configuration

**File:** `config.json` (search section)

Control which searches run and what additional queries are used:

```json
{
  "search": {
    "additionalQueries": [
      "best practices in ${industry}",
      "AI trends for ${industry} in 2026"
    ],
    "maxQueries": 6,
    "disabledQueryTypes": [],  // Can disable: ["ai-tools", "apps", "technology"]
    "searchDepth": "advanced",
    "resultsPerSearch": 5
  }
}
```

| Config Field | Type | Default | Purpose |
|---|---|---|---|
| `additionalQueries` | string[] | `[]` | Extra search queries to run beyond the standard 6 |
| `maxQueries` | number | 6 | Total number of searches to execute |
| `disabledQueryTypes` | string[] | `[]` | Query types to skip (e.g., `"ai-tools"`) |
| `searchDepth` | string | `"advanced"` | Tavily search depth ("basic" or "advanced") |
| `resultsPerSearch` | number | 5 | Results per Tavily search request |

### Model Selection Logic

1. **Primary config (Models 1-3):**
   - Tries Gemini Flash first (fastest)
   - Falls back to Gemini Pro (better)
   - Falls back to Claude Sonnet (best)

2. **If entire primary fails, Fallback config (Models 1-3):**
   - Tries Claude Sonnet (highest quality)
   - Falls back to Claude 3.5 Sonnet (alternative)
   - Falls back to Gemini Flash (fast backup)

3. **Temperature:**
   - Primary: 0.7 (creative, varied, personalized output)
   - Fallback: 0.6 (slightly more structured)

### OpenRouter API Call

**File:** `langgraph/llm-synthesizer.ts`

```typescript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${openrouterApiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://hypedigitaly.ai',
    'X-Title': 'HypeDigitaly AI Deep Research Agent v3'
  },
  body: JSON.stringify({
    models: config.models,           // Array for cascading fallback
    messages: [
      { role: 'system', content: systemInstructions },
      { role: 'user', content: prompt }
    ],
    max_tokens: 32000,               // Prevent truncation
    temperature: config.temperature
  })
});
```

### Key Parameters

| Parameter | Value | Reason |
|-----------|-------|--------|
| `max_tokens` | 32000 | Prevent truncation of large reports |
| `temperature` | 0.6-0.7 | Balance creativity with structure |
| `searchDepth` (Tavily) | `advanced` | Comprehensive results |
| `Timeout` (requests) | 30s (LLM), 15s (Tavily) | Prevent hanging |
| `Retries` | 1 per model | Transient error handling |

### Model Availability

| Model | Provider | Speed | Quality | Cost |
|-------|----------|-------|---------|------|
| `google/gemini-3-flash-preview` | Google | Very Fast | Good | Cheap |
| `google/gemini-3-pro-preview` | Google | Medium | Better | Medium |
| `anthropic/claude-sonnet-4.5` | Anthropic | Medium | Excellent | Higher |
| `anthropic/claude-3.5-sonnet` | Anthropic | Medium | Excellent | Higher |

---

## Integration Modules

### 1. **json-parser-utils.ts**

**Location:** `astro-src/netlify/functions/audit-services/`

**Purpose:** Robust JSON extraction and validation from LLM responses

**Key Functions:**

#### `extractAndParseJson()`

```typescript
export function extractAndParseJson(
  content: string,
  contextLabel: string = 'LLM'
): any | null
```

**4-Layer Extraction Strategy:**

1. **Direct parse** - Try parsing as-is
2. **Balanced brace extraction** - Find first `{` and match closing `}` (most reliable)
3. **Regex extraction** - Greedy `\{[\s\S]*\}` pattern
4. **First/Last brace** - Substring from first `{` to last `}`

**Preprocessing:**
- Remove BOM (Byte Order Mark)
- Remove control characters (except \n, \r, \t)
- Strip markdown code blocks ` ```json ... ``` `
- Normalize line endings

#### `validateAuditReportStructure()`

```typescript
export function validateAuditReportStructure(data: any): ValidationResult
```

**Checks:**
- `companyProfile` exists and has data
- `aiOpportunities` is array with 1+ items
- Optional fields (audítQuestions, recommendedTools, etc.)

**Returns:** `{ isValid, errors, warnings, hasMinimalData }`

#### `fillAuditReportDefaults()`

```typescript
export function fillAuditReportDefaults(
  data: any,
  formData: { language: 'cs' | 'en'; companyName: string }
): any
```

**Fills missing optional fields with sensible defaults:**
- `auditQuestions` → empty array
- `recommendedTools` → empty array
- `roiEstimate` → { totalHoursSavedPerWeek: 20, ... }
- `detectedTechnologies` → empty array
- etc.

#### `isJsonTruncated()`

```typescript
export function isJsonTruncated(jsonString: string): boolean
```

**Detects truncation patterns:**
- Ends with `,` (incomplete array)
- Ends with `:` (incomplete key-value)
- Ends with `"` (incomplete string)
- Ends with `[` or `{` (incomplete structure)

---

### 2. **ai-field-validator.ts**

**Location:** `astro-src/netlify/functions/audit-services/`

**Purpose:** LLM-powered form validation catching edge cases

**Key Function:**

```typescript
export async function validateFormWithAI(
  formData: AuditFormValidationInput,
  openrouterApiKey: string
): Promise<FormValidationResult>
```

**Validates 6 Fields:**

1. **Website URL**
   - Must be valid, professional
   - Rejects vulgar, malformed, localhost

2. **Email**
   - Accepts personal emails (gmail, outlook, seznam.cz)
   - Rejects disposable (mailinator, tempmail, 10minutemail)

3. **Company Name**
   - Rejects gibberish, memes, vulgar terms
   - Accepts normal business names

4. **City**
   - Must be real city name
   - Rejects jokes, gibberish

5. **Pain Point** (optional)
   - Should describe business problem
   - Rejects pure nonsense

6. **Current Tools** (optional)
   - Should be real tool names
   - Rejects vulgar content

**Model Cascade:**

```typescript
models: [
  'google/gemini-3-flash-preview',    // Primary - fast
  'google/gemini-3-pro-preview',      // Fallback 1
  'anthropic/claude-sonnet-4.5'       // Fallback 2
],
temperature: 0.2  // Low temperature for consistent validation
```

**Output:**

```typescript
interface FormValidationResult {
  isValid: boolean;
  fields: {
    website: { isValid: boolean; errorMessage?: string };
    email: { isValid: boolean; errorMessage?: string };
    companyName: { isValid: boolean; errorMessage?: string };
    city: { isValid: boolean; errorMessage?: string };
    biggestPainPoint: { isValid: boolean; errorMessage?: string };
    currentTools: { isValid: boolean; errorMessage?: string };
  };
}
```

---

### 3. **branding-fetcher.ts**

**Location:** `astro-src/netlify/functions/audit-services/`

**Purpose:** Extract company branding from Firecrawl API v2

**Key Function:**

```typescript
export async function fetchCompanyBranding(
  websiteUrl: string,
  apiKey: string
): Promise<CompanyBranding>
```

**Firecrawl API v2 Endpoint:**

```
POST https://api.firecrawl.dev/v2/scrape
Headers:
  Authorization: Bearer ${apiKey}
  Content-Type: application/json

Body:
{
  url: "https://example.com",
  onlyMainContent: false,
  maxAge: 172800000,  // 2 days cache
  formats: ["branding"]
}
```

**Response Structure:**

```
{
  success: boolean,
  data: {
    branding: {
      colorScheme?: string,
      fonts?: Array,
      colors?: { primary, accent, background },
      images?: { logo, favicon },
      confidence?: { overall }
    },
    metadata?: { favicon, title }
  }
}
```

**Retry Configuration:**

- Max retries: 2
- Initial delay: 1 second
- Backoff multiplier: 2x (1s → 2s → 5s max)
- Retryable: 429, 500-504
- Not retryable: SCRAPE_ACTION_ERROR (website-specific)
- Timeout: 20 seconds

**Fallback:** Google Favicon service

**Helper Function:**

```typescript
export function getBestLogo(
  branding?: CompanyBranding,
  websiteUrl?: string
): string | null
```

Priority: logo → favicon → Google favicon → null

---

### 4. **jina-search.ts**

**Location:** `astro-src/netlify/functions/audit-services/`

**Purpose:** Website content extraction via Jina AI

**Key Function:**

```typescript
export async function performAuditResearch(
  formData: AuditFormInputs,
  apiKey: string
): Promise<AuditResearchData>
```

**Search Strategy:**

- **3 site-specific** (with `X-Site` header): company website, services, about
- **2 open web** (no restriction): registry/business data, news/reviews
- **5 searches total, all parallel**

**API Call:**

```
GET https://s.jina.ai/?q=${encodeURIComponent(query)}
Headers:
  Authorization: Bearer ${apiKey}
  Accept: application/json
  X-Engine: direct
  X-Site: ${domain}  // Optional, for site-specific searches
```

**Output:**

```typescript
interface AuditResearchData {
  companyWebsite: JinaSearchResult;
  companyServices: JinaSearchResult;
  companyAbout: JinaSearchResult;
  companyRegistry: JinaSearchResult;
  companyNews: JinaSearchResult;
  companyLogoUrl?: string;  // Clearbit: https://logo.clearbit.com/${domain}
}
```

**Timeout:** 8 seconds per search

---

### 5. **openrouter-analysis.ts**

**Location:** `astro-src/netlify/functions/audit-services/`

**Purpose:** Legacy/fallback module for PDF generator compatibility

**Status:** Mostly deprecated, kept for backward compatibility

**Key Exports:**

```typescript
export interface AuditFormData { /* legacy form data */ }

export function getCompanySizeDetails(
  size: 'micro' | 'small' | 'medium' | 'large' | undefined,
  language: 'cs' | 'en'
): CompanySizeDetails
```

**Company Size Details:**

| Size | Employees | Hourly Rate (CZK) | Hourly Rate (USD) |
|------|-----------|-------------------|------------------|
| micro | 5 avg | 350 | 25 |
| small | 25 avg | 400 | 35 |
| medium | 120 avg | 500 | 50 |
| large | 500 avg | 600 | 75 |

**Deprecated Function:**

```typescript
@deprecated Use generateAgentFallbackReport from langgraph-agent.ts
export function generateFallbackReport(formData: AuditFormData): string
```

---

### 6. **shared/types.ts**

**Location:** `astro-src/netlify/functions/audit-shared/`

**Purpose:** Shared types for audit system

**Key Interfaces:**

```typescript
// Form submission
export interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  industry: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
  utmSource?: string;
  gclid?: string;  // Google Ads
  fbclid?: string; // Facebook Ads
  // ... traffic tracking fields
}

// Lead storage
export interface AuditLead {
  id: string;
  email: string;
  companyName: string;
  reportId: string;
  reportUrl: string;
  submittedAt: string;
  // ... rest of form data
}

// Job tracking
export interface AuditJob {
  jobId: string;
  status: JobStatus;  // pending | validating | researching | generating | storing | emailing | completed | failed
  progress: number;   // 0-100
  currentSubStep?: ResearchStep;
  email: string;
  companyName: string;
  reportId?: string;
  reportUrl?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type JobStatus =
  | 'pending'
  | 'validating'
  | 'researching'
  | 'generating'
  | 'storing'
  | 'emailing'
  | 'completed'
  | 'failed';
```

---

### 7. **shared/storage.ts**

**Location:** `astro-src/netlify/functions/audit-shared/`

**Purpose:** Netlify Blobs operations for persistent storage

**Key Functions:**

```typescript
export function getJobsStore() // Job status tracking
export function getAuditReportStore() // Report storage
export function getLeadsStore() // Lead persistence

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  updates?: Partial<AuditJob>
): Promise<void>

export async function initializeJob(
  jobId: string,
  formData: AuditFormData
): Promise<void>

export function createProgressCallback(jobId: string): ProgressCallback
```

**Blob Stores:**

- `audit-reports` - Report JSON (30-day expiry)
- `audit-leads` - Lead records (persistent)
- `audit-jobs` - Job status (persistent tracking)

**Progress Mapping:**

```typescript
const PROGRESS_MAP: Record<JobStatus, number> = {
  'pending': 0,
  'validating': 10,
  'researching': 30,
  'generating': 60,
  'storing': 80,
  'emailing': 90,
  'completed': 100,
  'failed': 0  // Keeps current progress
};
```

---

## Fallback & Error Handling

### Scenario 1: Complete LLM Failure

**Trigger:** Both model configs fail or parsing never succeeds

**Response:**
```typescript
executeDeepResearch() → ResearchResult {
  success: false,
  error: "Failed to synthesize report"
}
```

**Handler in audit.ts:**
- Calls `generateAgentFallbackReport(formData)`
- Returns basic report with default content
- User still gets report (less personalized)

### Scenario 2: Partial Failure (Minimal Data)

**Trigger:** JSON validation fails but has minimal required data

**Response:**
- Fills defaults via `fillAuditReportDefaults()`
- Continues with best-effort report
- Marks `usedFallbackModel: true` in `SynthesisResult`

### Scenario 3: Search Failure

**Trigger:** Tavily or Jina search returns no results

**Response:**
- Continues with empty search results
- LLM generates report with form data only
- Less accurate but still functional

### Scenario 4: Field Validation Failure

**Trigger:** AI form validator throws error

**Response:**
```typescript
validateFormWithAI() → FormValidationResult {
  isValid: true,  // Permissive fallback
  fields: { /* all valid */ }
}
```

**Reasoning:** Don't block user submission if validation service fails

### Scenario 5: Branding Fetch Failure

**Trigger:** Firecrawl API returns 500, times out, or returns no data

**Response:**
- Returns minimal `CompanyBranding` with fallback favicon only
- Non-blocking (research continues)
- No impact on final report

---

## Output Schema

### AuditReportData (Final Output)

**Type:** Defined in `html-report-generator.ts`

**Structure:**

```typescript
export interface AuditReportData {
  // Metadata
  reportId: string;
  generatedAt: string;  // ISO timestamp
  expiresAt: string;    // 30 days from now
  language: 'cs' | 'en';

  // Company Info
  companyProfile: {
    name: string;
    website: string;
    city: string;
    industry: string;
    detectedIndustry: string;  // AI-detected
    employeeEstimate?: number;
    description: string;
  };
  companyContext: string;  // Personalized 2-3 sentence intro

  // Technology Detection (v3)
  detectedTechnologies: DetectedTechnology[];
  hasOwnApplication: boolean;
  ownApplicationDetails: string | null;
  appIntegrationOpportunities: AppIntegrationOpportunity[];

  // Market Analysis
  industryBenchmark: IndustryBenchmark | null;

  // Strategic Planning
  implementationTimeline: ImplementationTimelinePhase[];
  riskAssessment: RiskAssessmentItem[];

  // Content
  companyContext: string;
  auditQuestions: AuditQuestion[];
  aiOpportunities: AIOpportunity[];
  recommendedTools: RecommendedTool[];

  // Financials
  roiEstimate: ROIEstimate;
  expectedBenefitsSummary: ExpectedBenefitsSummary;
}
```

### Nested Types

#### `AuditQuestion`

```typescript
interface AuditQuestion {
  category: string;           // e.g., "Role a tým"
  icon: string;              // Single emoji
  questions: string[];       // 3-5 questions per category
}
```

#### `AIOpportunity`

```typescript
interface AIOpportunity {
  title: string;                              // Catchy name
  description: string;                        // 4-5 sentences
  quadrant: 'quick_win' | 'big_swing' | 'nice_to_have' | 'deprioritize';
  estimatedSavingsHoursPerWeek: number;
  implementationEffort: 'low' | 'medium' | 'high';
  aiType: 'automation' | 'ml' | 'genai' | 'hybrid';
  expectedBenefits: OpportunityBenefit[];
}

interface OpportunityBenefit {
  type: BenefitType;  // time_savings, lead_generation, conversion_rate, etc.
  value: string;      // "10-15", "20%", etc.
  unit: string;       // "h/week", "customers/month", etc.
  label: string;      // "Úspora času"
  icon: string;       // Single emoji
}
```

#### `RecommendedTool`

```typescript
interface RecommendedTool {
  name: string;      // Tool name
  category: string;  // e.g., "CRM", "Meetings"
  useCase: string;   // How this company would use it
  url: string;       // Direct link to tool
}
```

#### `ROIEstimate`

```typescript
interface ROIEstimate {
  totalHoursSavedPerWeek: number;
  defaultHourlyRate: number;                 // CZK or USD
  assumptions: string[];                     // Explanation of estimates
}
```

#### `ExpectedBenefitsSummary`

```typescript
interface ExpectedBenefitsSummary {
  introText: string;                         // 2-3 sentences intro
  benefits: OpportunityBenefit[];            // 4 primary benefits
  disclaimer: string;                        // Disclaimer about estimates
}
```

---

## State Machine Diagram

### Research Pipeline State Flow

```
START
  │
  ├─→ fetch_branding (28%)
  │   └─→ Firecrawl API (optional, non-blocking)
  │
  ├─→ search_company_info (30%)
  │   └─→ Tavily: Generic search 1
  │
  ├─→ search_company_news (34%)
  │   └─→ Tavily: Generic search 2
  │
  ├─→ search_website (38%)
  │   └─→ Tavily: Domain-specific search
  │
  ├─→ search_technologies (42%)
  │   └─→ Tavily: Tech stack detection
  │
  ├─→ search_company_apps (46%)
  │   └─→ Tavily: Company apps detection
  │
  ├─→ search_ai_tools (50%)
  │   └─→ Tavily: Industry AI tools
  │
  ├─→ llm_analyzing (55%)
  │   ├─→ OpenRouter: Primary Model Config
  │   │   ├─→ Model 1: Gemini Flash
  │   │   ├─→ Model 2: Gemini Pro (fallback)
  │   │   └─→ Model 3: Claude Sonnet (fallback)
  │   │
  │   └─→ If Primary fails → Fallback Model Config
  │       ├─→ Model 1: Claude Sonnet
  │       ├─→ Model 2: Claude 3.5 (fallback)
  │       └─→ Model 3: Gemini Flash (fallback)
  │
  ├─→ JSON Extraction (4-layer strategy)
  │   ├─→ Direct parse
  │   ├─→ Balanced brace extraction
  │   ├─→ Regex extraction
  │   └─→ First/Last brace
  │
  ├─→ Validation
  │   ├─→ Check structure
  │   └─→ Fill defaults
  │
  ├─→ building_report (58%)
  │   └─→ Assemble AuditReportData
  │
  └─→ SUCCESS
      └─→ Return ResearchResult { success: true, reportData }

      OR

      FALLBACK (all LLM attempts fail)
      └─→ Return ResearchResult { success: false, error }
          └─→ Handler calls generateAgentFallbackReport()
              └─→ User still gets report (basic defaults)
```

### JSON Extraction Fallback Chain

```
LLM Response
  │
  ├─→ Try: Direct JSON.parse()
  │   └─→ Success? Return parsed JSON
  │   └─→ Fail? Continue
  │
  ├─→ Try: Balanced Brace Extraction
  │   ├─→ Remove markdown code blocks
  │   ├─→ Sanitize control characters
  │   ├─→ Find first { and match closing }
  │   └─→ JSON.parse() extracted substring
  │       └─→ Success? Return parsed JSON
  │       └─→ Fail? Continue
  │
  ├─→ Try: Regex Extraction
  │   ├─→ Pattern: /\{[\s\S]*\}/
  │   └─→ JSON.parse() matched string
  │       └─→ Success? Return parsed JSON
  │       └─→ Fail? Continue
  │
  ├─→ Try: First/Last Brace
  │   ├─→ Substring from first { to last }
  │   └─→ JSON.parse() substring
  │       └─→ Success? Return parsed JSON
  │       └─→ Fail? Continue
  │
  └─→ All Failed
      └─→ Metrics logged
      └─→ Return null
      └─→ Synthesizer tries next model config
          └─→ If all models fail → synthesizeStructuredReport returns error
```

### Model Fallback Chain

```
synthesizeStructuredReport()
  │
  ├─→ CONFIG 1: Primary
  │   │
  │   ├─→ Attempt 1
  │   │   ├─→ Models: [Gemini Flash, Gemini Pro, Claude Sonnet]
  │   │   ├─→ Temp: 0.7
  │   │   ├─→ Timeout: 30s
  │   │   └─→ Success? → Return with usedFallbackModel: false
  │   │
  │   └─→ Attempt 2 (Retry 1/1)
  │       └─→ Same models, same config
  │
  ├─→ CONFIG 2: Fallback
  │   │
  │   ├─→ Attempt 1
  │   │   ├─→ Models: [Claude Sonnet, Claude 3.5, Gemini Flash]
  │   │   ├─→ Temp: 0.6
  │   │   └─→ Success? → Return with usedFallbackModel: true
  │   │
  │   └─→ Attempt 2 (Retry 1/1)
  │       └─→ Same models, same config
  │
  └─→ All Configs Failed
      └─→ Return { success: false, error: "..." }
```

---

## Integration Points

### Called By

**Main entry point:** `astro-src/netlify/functions/audit.ts`

```typescript
import { executeDeepResearch } from '../audit-services/langgraph';

// In background handler
const result = await executeDeepResearch(formData, tavilyKey, openrouterKey, onProgress);
```

### Calls To

- **Tavily API:** Web search
- **OpenRouter API:** LLM synthesis
- **Firecrawl API:** Branding (optional)
- **Jina AI:** Website extraction (optional)
- **Netlify Blobs:** Job status, reports, leads
- **Netlify Functions:** Email sending (Resend)

### Configuration

**Environment Variables:**
```
TAVILY_API_KEY           # Required
OPENROUTER_API_KEY       # Required
FIRECRAWL_API_KEY        # Optional
JINA_API_KEY             # Optional
NETLIFY_SITE_ID          # Required
NETLIFY_API_TOKEN        # Required
```

---

## Performance Characteristics

### Typical Execution Time

| Phase | Duration | Parallelization |
|-------|----------|-----------------|
| Branding fetch | 2-5s | Independent |
| Web research (6 searches) | 15-30s | Sequential (for progress) |
| LLM synthesis | 15-30s | Single request |
| JSON parsing | <1s | Instant |
| Report assembly | <1s | Instant |
| **Total** | **35-70s** | — |

### Token Usage

- **Input tokens:** ~15,000-20,000 (searches + prompt)
- **Output tokens:** ~8,000-12,000 (full JSON report)
- **Total:** ~23,000-32,000 tokens per audit

### Cost Estimate (USD)

- Tavily: ~$0.10/search × 6 = $0.60
- OpenRouter (Gemini Flash): ~$0.01/1K tokens → ~$0.25
- **Total per audit:** ~$1.00

---

## Monitoring & Debugging

### Logging

All components log with **context prefixes:**
- `[Agent]` - Main orchestration
- `[Tavily]` - Search execution
- `[Branding]` - Firecrawl API
- `[JSON Parser]` - Extraction
- `[Validator]` - Form validation

**Example log sequence:**
```
[Agent] Starting Deep Research Agent v3 for: Company Name (City)
[Agent] Executing 6 Tavily searches with progress tracking...
[Tavily] [GENERIC] Request: "Company Name..."
[Tavily] Response success: 5 results found
[Agent] Search "search_company_info" completed: success
...
[Agent] STEP 2: Formatting search data...
[Agent] STEP 3: Generating structured research prompt...
[Agent] STEP 4: Synthesizing structured report...
[Agent] LLM response received from model: google/gemini-3-flash-preview
[Agent] ✓ JSON extracted and parsed successfully
[Agent] ✓ JSON validation passed
[Agent] STEP 5: Building final report data...
[Agent] Deep Research Agent v3 completed successfully. Report ID: abc123xyz...
```

### Metrics

**JSON Parser Metrics:**
```typescript
interface JsonParseMetrics {
  totalAttempts: number;
  successfulParses: number;
  failedParses: number;
  sanitizationAttempts: number;
  retryAttempts: number;
  lastFailureReason?: string;
}
```

Access via: `getParseMetrics()` from `json-parser-utils.ts`

### Debugging Tips

1. **Check monolith vs modular:** Both should produce identical results
2. **Enable verbose logging:** All [Agent] logs go to Netlify function logs
3. **Test JSON extraction locally:** Use `extractAndParseJson()` with sample LLM responses
4. **Validate model cascade:** Check which model actually succeeded in logs
5. **Monitor token usage:** Check OpenRouter dashboard for cost/usage patterns

---

## Future Enhancements

- [ ] Caching of search results (same company input)
- [ ] Streaming LLM responses for faster feedback
- [ ] Multi-language detection beyond CS/EN
- [ ] Video content extraction
- [ ] Competitor analysis integration
- [ ] Real-time industry data feeds
- [ ] A/B testing of prompt variations
- [ ] Custom model fine-tuning

---

## References

- **LangGraph Docs:** https://js.langchain.com/docs/langgraph
- **Tavily API:** https://tavily.com/docs
- **OpenRouter Models:** https://openrouter.ai/models
- **Firecrawl API:** https://docs.firecrawl.dev
- **Jina AI:** https://jina.ai/search-index

---

**Last Updated:** 2026-03-19

**Maintainer:** HypeDigitaly Development Team
