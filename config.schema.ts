/**
 * config.schema.ts
 *
 * Single source of truth for all per-client configuration in the
 * hype-audit-template. Every Netlify Function, Astro page, and
 * email template reads from a runtime object that satisfies this
 * interface.
 *
 * Usage:
 *   import type { AuditClientConfig } from './config.schema';
 *   import { resolveConfig } from './config.schema';
 *   import rawConfig from './config.json';
 *   const config = resolveConfig(rawConfig as AuditClientConfig);
 */

// ---------------------------------------------------------------------------
// Shared bilingual string type
// ---------------------------------------------------------------------------

/** A string that exists in both Czech and English. */
export interface BilingualString {
  cs: string;
  en: string;
}

// ---------------------------------------------------------------------------
// Core interface
// ---------------------------------------------------------------------------

export interface AuditClientConfig {
  // -------------------------------------------------------------------------
  /** Company identity */
  // -------------------------------------------------------------------------
  company: {
    /** Display / brand name shown in headings and emails (e.g., "Acme Corp") */
    name: string;

    /** Full legal entity name used in contracts and invoices
     *  (e.g., "Acme Corp s.r.o.") */
    legalName: string;

    /** One-line company description used in meta tags and intro copy
     *  (e.g., "AI-powered B2B lead generation for Czech manufacturers") */
    description: string;

    /** Industry vertical — used to tailor copy and benchmark comparisons
     *  (e.g., "SaaS", "Manufacturing", "E-commerce") */
    industry: string;

    /** Primary target audience — used in CTAs and email subject lines
     *  (e.g., "B2B founders", "SME owners in the Czech Republic") */
    audience: string;

    /** Czech IČO company registration number — 8 digits, optional
     *  (e.g., "12345678") */
    ico?: string;

    /** Czech DIČ VAT identification number — optional
     *  (e.g., "CZ12345678") */
    dic?: string;
  };

  // -------------------------------------------------------------------------
  /** Domain & URL configuration */
  // -------------------------------------------------------------------------
  domain: {
    /** Canonical site URL including protocol, no trailing slash
     *  (e.g., "https://audit.client.com") */
    siteUrl: string;

    /** Base URL for individual audit report pages.
     *  Derived automatically as `${siteUrl}/report` when omitted.
     *  (e.g., "https://audit.client.com/report") */
    reportBaseUrl?: string;

    /** Allowed CORS origin for Netlify Functions.
     *  Derived automatically from `siteUrl` when omitted.
     *  Override only when the API is served from a different subdomain. */
    corsOrigin?: string;
  };

  // -------------------------------------------------------------------------
  /** Brand identity */
  // -------------------------------------------------------------------------
  branding: {
    /** Primary brand color as CSS hex (e.g., "#0ea5e9").
     *  Used for buttons, headings, and chart fills. */
    colorPrimary: string;

    /** Accent / CTA color as CSS hex (e.g., "#f59e0b").
     *  Used for highlight badges, hover states, and email CTAs. */
    colorAccent: string;

    /** Logo image — relative path from /public or full URL
     *  (e.g., "/assets/images/logo.svg" or "https://cdn.client.com/logo.svg") */
    logoUrl: string;

    /** Favicon URL — relative path or full URL.
     *  Defaults to "/favicon.svg" when omitted. */
    faviconUrl?: string;
  };

  // -------------------------------------------------------------------------
  /** Contact information */
  // -------------------------------------------------------------------------
  contact: {
    /** Primary business contact email displayed in the footer and emails */
    email: string;

    /** Phone number with country code — optional
     *  (e.g., "+420 123 456 789") */
    phone?: string;

    /** Street address (street name + number) — optional
     *  (e.g., "Václavské náměstí 1") */
    street?: string;

    /** City — optional (e.g., "Praha") */
    city?: string;

    /** Postal / ZIP code — optional (e.g., "110 00") */
    postalCode?: string;

    /** Country — optional, defaults to "Česká republika" */
    country?: string;

    /** Google Maps embed URL for the contact section iframe — optional.
     *  Must match https://www.google.com/maps/embed or https://google.com/maps/embed */
    mapsEmbedUrl?: string;
  };

  // -------------------------------------------------------------------------
  /** Team members shown in CTA sections, email signatures, and report footers */
  // -------------------------------------------------------------------------
  team: Array<{
    /** Full name (e.g., "Jan Novák") */
    name: string;

    /** Job title displayed under the name (e.g., "CEO & Growth Strategist") */
    title: string;

    /** Direct email address for this team member */
    email: string;

    /** Direct phone number — optional (e.g., "+420 987 654 321") */
    phone?: string;

    /** Calendar booking URL (e.g., cal.com link) — optional.
     *  Rendered as a "Book a call" button in CTAs and email footers. */
    calendarUrl?: string;
  }>;

  // -------------------------------------------------------------------------
  /** Social media profile links — all optional */
  // -------------------------------------------------------------------------
  social: {
    /** LinkedIn company page or personal profile URL */
    linkedin?: string;

    /** Instagram profile URL */
    instagram?: string;

    /** Facebook page URL */
    facebook?: string;

    /** Google Business / Maps reviews URL */
    googleReviews?: string;
  };

  // -------------------------------------------------------------------------
  /** Email notification settings */
  // -------------------------------------------------------------------------
  notifications: {
    /** Array of email addresses that receive a copy of each new lead notification */
    recipients: string[];

    /** Resend-verified sender address used as the `from` field in all outbound
     *  emails (e.g., "noreply@mail.client.com") */
    fromEmail: string;

    /** Display name paired with `fromEmail` (e.g., "Acme Corp Audit") */
    fromName: string;
  };

  // -------------------------------------------------------------------------
  /** Analytics & tracking IDs — all optional, conditional rendering */
  // -------------------------------------------------------------------------
  analytics?: {
    /** Google Analytics 4 measurement ID (e.g., "G-XXXXXXXXXX") */
    gaId?: string;

    /** Microsoft Clarity project ID (e.g., "abc12345") */
    clarityId?: string;

    /** Meta / Facebook Pixel numeric ID (e.g., "1234567890123456") */
    facebookPixel?: string;

    /** Google Tag Manager container ID (e.g., "GTM-XXXXXXX") */
    gtmContainerId?: string;
  };

  // -------------------------------------------------------------------------
  /** SEO & structured data enhancements */
  // -------------------------------------------------------------------------
  seo?: {
    /** Primary founder for Person schema */
    founder?: {
      name: string;
      title: string;
      linkedinUrl: string;
    };

    /** ISO 8601 date the company was founded (e.g., "2018-01-01") */
    foundingDate?: string;

    /** Approximate employee count range for structured data
     *  (e.g., "1-10", "11-50") */
    employeeCount?: string;

    /** Brand slogan in both languages */
    slogan?: BilingualString;

    /** GPS coordinates for LocalBusiness schema */
    geoCoordinates?: {
      latitude: number;
      longitude: number;
    };

    /** Topics the company is known for — used in knowsAbout schema property */
    knowsAbout?: string[];
  };

  // -------------------------------------------------------------------------
  /** Page content overrides — all text fields are bilingual.
   *  When omitted the translation files serve as defaults. */
  // -------------------------------------------------------------------------
  content?: {
    /** Hero section copy */
    hero?: {
      badge?: BilingualString;
      headline1?: BilingualString;
      headline2?: BilingualString;
      subheadline?: BilingualString;
      stats?: Array<{
        icon: string;
        text: BilingualString;
      }>;
      trustBadges?: Array<{
        icon: string;
        text: BilingualString;
      }>;
    };

    /** Audit submission form copy */
    form?: {
      title?: BilingualString;
      description?: BilingualString;
      submitButton?: BilingualString;
      successTitle?: BilingualString;
      successDescription?: BilingualString;
      errorMessage?: BilingualString;
    };

    /** Value proposition section copy */
    value?: {
      sectionTitle?: BilingualString;
      sectionSubtitle?: BilingualString;
      items?: Array<{
        icon: string;
        title: BilingualString;
        description: BilingualString;
      }>;
    };

    /** Pricing tiers section */
    pricing?: {
      sectionTitle?: BilingualString;
      sectionSubtitle?: BilingualString;

      /** ISO 4217 currency code (e.g., "CZK", "EUR") */
      currency?: string;

      tiers?: Array<{
        name: BilingualString;
        description?: BilingualString;
        price: BilingualString;
        priceDetail?: BilingualString;
        ctaText: BilingualString;
        ctaUrl?: string;
        /** Visually highlighted (most popular / recommended) tier */
        featured?: boolean;
        badge?: BilingualString;
        features: Array<{
          text: BilingualString;
          included: boolean;
        }>;
      }>;
    };

    /** Process / how-it-works section */
    process?: {
      sectionTitle?: BilingualString;
      sectionSubtitle?: BilingualString;
      steps?: Array<{
        title: BilingualString;
        description: BilingualString;
        features?: BilingualString[];
      }>;
    };

    /** Bottom-of-page CTA section */
    finalCta?: {
      title?: BilingualString;
      description?: BilingualString;
      buttonText?: BilingualString;
    };
  };

  // -------------------------------------------------------------------------
  /** Audit submission form configuration */
  // -------------------------------------------------------------------------
  auditForm?: {
    /** Pain-point options shown as checkboxes.
     *  Each value is a stable slug; label is bilingual. */
    painPoints?: Array<{
      value: string;
      label: BilingualString;
    }>;

    /** Software-tool options shown as checkboxes.
     *  Label is a single display string (tool names are not translated). */
    tools?: Array<{
      value: string;
      label: string;
    }>;

    /** Allow the respondent to type a custom pain point */
    allowCustomPainPoint?: boolean;

    /** Allow the respondent to type a custom tool */
    allowCustomTool?: boolean;

    /** Show the city field */
    showCity?: boolean;

    /** Show the tools checklist */
    showTools?: boolean;

    /** Show the pain-points checklist */
    showPainPoints?: boolean;
  };

  // -------------------------------------------------------------------------
  /** Navigation configuration */
  // -------------------------------------------------------------------------
  nav?: {
    /** Primary CTA button in the top navigation bar */
    ctaButton?: {
      text?: BilingualString;
      href?: string;
    };
  };

  // -------------------------------------------------------------------------
  /** LLM / AI provider settings */
  // -------------------------------------------------------------------------
  llm?: {
    /** Primary model configuration — used for the main audit generation pass */
    primary?: {
      /** Ordered list of model IDs to try (first available wins).
       *  Must be non-empty when provided. */
      models?: string[];

      /** Sampling temperature: 0.0 (deterministic) – 1.0 (creative) */
      temperature?: number;

      /** Maximum tokens to generate per request: 16 000 – 64 000 */
      maxTokens?: number;

      /** Number of automatic retries on transient errors */
      maxRetries?: number;
    };

    /** Fallback model configuration — used when primary models are unavailable */
    fallback?: {
      /** Ordered list of fallback model IDs. Must be non-empty when provided. */
      models?: string[];

      /** Sampling temperature: 0.0 – 1.0 */
      temperature?: number;

      /** Maximum tokens per request: 16 000 – 64 000 */
      maxTokens?: number;

      /** Number of automatic retries */
      maxRetries?: number;
    };

    /** Total request timeout in milliseconds: 10 000 – 60 000 */
    timeout?: number;
  };

  // -------------------------------------------------------------------------
  /** System-prompt customisation for the LLM audit generator */
  // -------------------------------------------------------------------------
  prompt?: {
    /** Short identity statement injected at the top of the system prompt.
     *  Max 100 characters. Allowed characters: letters (incl. Czech diacritics),
     *  digits, spaces, and -&.,!'() */
    systemIdentity?: string;

    /** Free-form description of the industry context used to prime the model.
     *  Injected after systemIdentity. */
    industryContext?: string;

    /** Specific areas the audit should focus on (e.g., ["lead generation", "CRM"]) */
    focusAreas?: string[];

    /** Desired tone of the generated audit report */
    tone?: 'professional' | 'conversational' | 'technical' | 'consultative';

    /** Brand and product mentions the model should weave into the report */
    brandMentions?: Array<{
      /** Brand / product name — max 100 chars */
      name: string;
      /** Short description — max 500 chars */
      description: string;
      /** Guidance on when to mention it — max 100 chars */
      when: string;
    }>;

    /** Additional free-form instructions appended to the system prompt.
     *  Max 2 000 characters. Subject to prompt-injection sanitisation. */
    customInstructions?: string;
  };

  // -------------------------------------------------------------------------
  /** Web-search query configuration for the research phase */
  // -------------------------------------------------------------------------
  search?: {
    /** Extra queries injected into the search step alongside auto-generated ones */
    additionalQueries?: Array<{
      /** Search query string — max 200 chars */
      query: string;
      /** Query category type (e.g., "competitor", "industry", "trend") */
      type: string;
      /** Pipeline step that should execute this query (e.g., "research") */
      step: string;
    }>;

    /** Mapping from industry keyword slug to display label
     *  (e.g., { "saas": "SaaS / Software" }) */
    industryKeywords?: Record<string, string>;

    /** Maximum total queries the search phase may execute: 1 – 12.
     *  At least one of "generic" or "domainSpecific" must NOT be in
     *  disabledQueryTypes. */
    maxQueries?: number;

    /** Query-type slugs that should be skipped entirely during search */
    disabledQueryTypes?: string[];
  };

  // -------------------------------------------------------------------------
  /** Audit report rendering configuration */
  // -------------------------------------------------------------------------
  report?: {
    /** Section visibility and ordering */
    sections?: {
      /** Ordered list of section IDs to render */
      order?: string[];

      /** Section IDs to hide entirely. Cannot include "header" or "footer". */
      disabled?: string[];
    };

    /** Number of AI-generated opportunities to include: 3 – 20 */
    opportunityCount?: number;

    /** Number of question categories in the diagnostic: 3 – 10 */
    questionCategoryCount?: number;

    /** Report-page CTA block */
    cta?: {
      title?: BilingualString;
      subtitle?: BilingualString;
      buttonText?: BilingualString;
      /** Absolute or relative URL for the CTA button */
      buttonUrl?: string;
    };
  };

  // -------------------------------------------------------------------------
  /** Transactional email copy overrides */
  // -------------------------------------------------------------------------
  email?: {
    /** Lead confirmation email sent to the respondent */
    leadConfirm?: {
      subject?: BilingualString;
      greeting?: BilingualString;
      intro?: BilingualString;
      closing?: BilingualString;
    };

    /** Report delivery email containing the audit link */
    reportDelivery?: {
      subject?: BilingualString;
      greeting?: BilingualString;
      intro?: BilingualString;
      ctaText?: BilingualString;
      closing?: BilingualString;
    };

    /** Internal team notification email */
    teamNotification?: {
      subject?: BilingualString;
      intro?: BilingualString;
    };
  };
}

// ---------------------------------------------------------------------------
// Resolved config — optional fields guaranteed to be populated
// ---------------------------------------------------------------------------

/**
 * AuditClientConfig with all derived/optional fields filled in.
 * Produced by `resolveConfig()` — use this type inside runtime code.
 */
export type ResolvedConfig = AuditClientConfig & {
  domain: Required<AuditClientConfig["domain"]>;
  branding: Required<AuditClientConfig["branding"]>;
  contact: AuditClientConfig["contact"] & {
    country: string; // guaranteed non-undefined after resolution
  };
  /** Analytics section is always present after resolution (fields may still be undefined) */
  analytics: NonNullable<AuditClientConfig["analytics"]>;
  /** SEO section is always present after resolution */
  seo: NonNullable<AuditClientConfig["seo"]>;
  /** Content section is always present after resolution */
  content: NonNullable<AuditClientConfig["content"]>;
  /** Audit form with all defaults filled in */
  auditForm: Required<
    Pick<
      NonNullable<AuditClientConfig["auditForm"]>,
      | "painPoints"
      | "tools"
      | "allowCustomPainPoint"
      | "allowCustomTool"
      | "showCity"
      | "showTools"
      | "showPainPoints"
    >
  >;
  /** Navigation section is always present after resolution */
  nav: NonNullable<AuditClientConfig["nav"]>;
  /** LLM config with all defaults filled in */
  llm: {
    primary: Required<NonNullable<NonNullable<AuditClientConfig["llm"]>["primary"]>>;
    fallback: Required<NonNullable<NonNullable<AuditClientConfig["llm"]>["fallback"]>>;
    timeout: number;
  };
  /** Prompt section is always present after resolution */
  prompt: NonNullable<AuditClientConfig["prompt"]>;
  /** Search config with maxQueries guaranteed */
  search: NonNullable<AuditClientConfig["search"]> & {
    maxQueries: number;
  };
  /** Report config with counts guaranteed */
  report: NonNullable<AuditClientConfig["report"]> & {
    opportunityCount: number;
    questionCategoryCount: number;
  };
  /** Email section is always present after resolution */
  email: NonNullable<AuditClientConfig["email"]>;
};

// ---------------------------------------------------------------------------
// Default pain-points (sourced from audit.astro)
// ---------------------------------------------------------------------------

const DEFAULT_PAIN_POINTS: NonNullable<NonNullable<AuditClientConfig["auditForm"]>["painPoints"]> = [
  { value: "new_customers",           label: { cs: "Získávání nových zákazníků",            en: "Acquiring new customers" } },
  { value: "automate_outreach",       label: { cs: "Automatizace oslovování",               en: "Automating outreach" } },
  { value: "inbound_leads",           label: { cs: "Příchozí poptávky a leady",             en: "Inbound leads & inquiries" } },
  { value: "speed_to_lead",           label: { cs: "Rychlost reakce na leady",              en: "Speed to lead" } },
  { value: "automate_communication",  label: { cs: "Automatizace komunikace",               en: "Automating communication" } },
  { value: "boring_admin",            label: { cs: "Opakující se administrativní úkoly",    en: "Repetitive admin tasks" } },
  { value: "tool_juggling",           label: { cs: "Příliš mnoho nástrojů a systémů",       en: "Too many tools & systems" } },
  { value: "ai_integration",          label: { cs: "Integrace AI do procesů",               en: "Integrating AI into processes" } },
  { value: "marketing_materials",     label: { cs: "Tvorba marketingových materiálů",       en: "Creating marketing materials" } },
  { value: "social_media",            label: { cs: "Správa sociálních sítí",                en: "Managing social media" } },
];

// ---------------------------------------------------------------------------
// Default tools (sourced from audit.astro)
// ---------------------------------------------------------------------------

const DEFAULT_TOOLS: NonNullable<NonNullable<AuditClientConfig["auditForm"]>["tools"]> = [
  { value: "microsoft_office",   label: "Microsoft Office 365" },
  { value: "google_workspace",   label: "Google Workspace" },
  { value: "chatgpt_ai",         label: "ChatGPT / AI nástroje" },
  { value: "crm",                label: "CRM systém" },
  { value: "erp",                label: "ERP systém" },
  { value: "slack_teams",        label: "Slack / Microsoft Teams" },
];

// ---------------------------------------------------------------------------
// resolveConfig utility
// ---------------------------------------------------------------------------

/**
 * Fills in derived and default values so that runtime code never needs
 * to handle `undefined` for the fields listed below.
 *
 * Derived fields:
 *   - domain.reportBaseUrl         defaults to siteUrl + "/report"
 *   - domain.corsOrigin            defaults to siteUrl
 *   - branding.faviconUrl          defaults to "/favicon.svg"
 *   - contact.country              defaults to "Ceska republika"
 *   - auditForm.painPoints         defaults to 10 built-in pain-point slugs
 *   - auditForm.tools              defaults to 6 built-in tool slugs
 *   - auditForm.allowCustom/show   defaults to true
 *   - llm.primary models           defaults to production model list
 *   - llm.fallback models          defaults to fallback model list
 *   - llm.timeout                  defaults to 30000 ms
 *   - search.maxQueries            defaults to 6
 *   - report.opportunityCount      defaults to 10
 *   - report.questionCategoryCount defaults to 7
 *
 * @param config Raw config object loaded from `config.json`
 * @returns Fully resolved config with all optional fields guaranteed
 */
export function resolveConfig(config: AuditClientConfig): ResolvedConfig {
  const rawForm = config.auditForm ?? {};
  const rawLlm = config.llm ?? {};
  const rawPrimary = rawLlm.primary ?? {};
  const rawFallback = rawLlm.fallback ?? {};
  const rawSearch = config.search ?? {};
  const rawReport = config.report ?? {};

  return {
    ...config,

    domain: {
      ...config.domain,
      reportBaseUrl:
        config.domain.reportBaseUrl || `${config.domain.siteUrl}/report`,
      corsOrigin:
        config.domain.corsOrigin || config.domain.siteUrl,
    },

    branding: {
      ...config.branding,
      faviconUrl: config.branding.faviconUrl || "/favicon.svg",
    },

    contact: {
      ...config.contact,
      country: config.contact.country || "Česká republika",
    },

    analytics: config.analytics ?? {},

    seo: config.seo ?? {},

    content: config.content ?? {},

    auditForm: {
      painPoints:         rawForm.painPoints         ?? DEFAULT_PAIN_POINTS,
      tools:              rawForm.tools              ?? DEFAULT_TOOLS,
      allowCustomPainPoint: rawForm.allowCustomPainPoint ?? true,
      allowCustomTool:    rawForm.allowCustomTool    ?? true,
      showCity:           rawForm.showCity           ?? true,
      showTools:          rawForm.showTools          ?? true,
      showPainPoints:     rawForm.showPainPoints     ?? true,
    },

    nav: config.nav ?? {},

    llm: {
      primary: {
        models:      rawPrimary.models      ?? [
          "google/gemini-3-flash-preview",
          "google/gemini-3-pro-preview",
          "anthropic/claude-sonnet-4.5",
        ],
        temperature: rawPrimary.temperature ?? 0.7,
        maxTokens:   rawPrimary.maxTokens   ?? 32000,
        maxRetries:  rawPrimary.maxRetries  ?? 1,
      },
      fallback: {
        models:      rawFallback.models      ?? [
          "anthropic/claude-sonnet-4.5",
          "anthropic/claude-3.5-sonnet",
        ],
        temperature: rawFallback.temperature ?? 0.6,
        maxTokens:   rawFallback.maxTokens   ?? 32000,
        maxRetries:  rawFallback.maxRetries  ?? 1,
      },
      timeout: rawLlm.timeout ?? 30000,
    },

    prompt: config.prompt ?? {},

    search: {
      ...rawSearch,
      maxQueries: rawSearch.maxQueries ?? 6,
    },

    report: {
      ...rawReport,
      opportunityCount:      rawReport.opportunityCount      ?? 10,
      questionCategoryCount: rawReport.questionCategoryCount ?? 7,
    },

    email: config.email ?? {},
  };
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/** Regex for a 6–8 digit Czech IČO */
const ICO_RE = /^\d{6,8}$/;
/** Regex for Czech DIČ: "CZ" followed by 8–10 digits */
const DIC_RE = /^CZ\d{8,10}$/;
/** Minimal e-mail format check */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Hex color: 3 or 6 digit */
const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Google Analytics 4 measurement ID */
const GA4_RE = /^G-[A-Z0-9]{6,12}$/;
/** Microsoft Clarity project ID */
const CLARITY_RE = /^[a-z0-9]{8,14}$/;
/** Meta / Facebook Pixel numeric ID */
const FB_PIXEL_RE = /^\d{12,16}$/;
/** Google Tag Manager container ID */
const GTM_RE = /^GTM-[A-Z0-9]{6,8}$/;
/** Allowed characters in system identity */
const SYSTEM_IDENTITY_RE =
  /^[a-zA-Z0-9\s\-&.,!'()čďěéíňóřšťúůýžČĎĚÉÍŇÓŘŠŤÚŮÝŽ]+$/;
/** Google Maps embed URL prefix — requires query-string separator to prevent path traversal */
const MAPS_EMBED_RE = /^https:\/\/(www\.)?google\.com\/maps\/embed\?/;

/**
 * Prompt-injection blocklist — terms that must not appear in user-controlled
 * text fields that are forwarded to the LLM system prompt.
 * Checked case-insensitively after lowercasing the processed value.
 */
const PROMPT_INJECTION_TERMS = [
  "ignore",
  "override",
  "forget",
  "system:",
  "role:",
  "assistant:",
  "user:",
  "|im_",
  "[inst",
  "<<sys",
  "respond",
  "output:",
  "ignoruj",
  "zapomen",
  "prepis",
] as const;

/**
 * Returns true when the supplied string contains any prompt-injection term.
 * Pre-processes: lowercase, strip zero-width characters.
 */
function containsPromptInjection(raw: string): boolean {
  // Strip zero-width chars and lowercase
  const cleaned = raw
    .replace(/[\u200B-\u200D\uFEFF\u2060]/g, "")
    .toLowerCase();

  for (const term of PROMPT_INJECTION_TERMS) {
    if (cleaned.includes(term)) return true;
  }

  // Reject lines that start with markdown heading markers
  const lines = cleaned.split(/\r?\n/);
  for (const line of lines) {
    if (/^#{1,2}\s/.test(line.trimStart())) return true;
  }

  return false;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Centralized URL validator.
 * Accepts:
 *   - Absolute https:// or http:// URLs
 *   - Relative paths starting with /
 * Rejects dangerous schemes: javascript:, data:, vbscript:, blob:
 *
 * @param url       The URL string to validate
 * @param fieldName Dot-notation field name for error reporting
 * @param errors    Mutable array to push errors into
 */
function validateUrl(
  url: string,
  fieldName: string,
  errors: ValidationError[],
): void {
  const trimmed = url.trim();
  if (!trimmed) return; // empty is allowed — use required() separately

  const lower = trimmed.toLowerCase();

  const dangerous = ["javascript:", "data:", "vbscript:", "blob:"];
  for (const scheme of dangerous) {
    if (lower.startsWith(scheme)) {
      errors.push({
        field: fieldName,
        message: `"${fieldName}" uses a disallowed URL scheme ("${scheme}").`,
      });
      return;
    }
  }

  if (
    !lower.startsWith("https://") &&
    !lower.startsWith("http://") &&
    !trimmed.startsWith("/")
  ) {
    errors.push({
      field: fieldName,
      message: `"${fieldName}" must start with https://, http://, or / (relative path).`,
    });
  }
}

/**
 * Validates a raw config object and returns a list of errors.
 * An empty array means the config is valid.
 *
 * @example
 * const errors = validateConfig(raw);
 * if (errors.length) throw new Error(errors.map(e => e.message).join('\n'));
 */
export function validateConfig(config: AuditClientConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  const required = (field: string, value: string | undefined) => {
    if (!value || value.trim() === "" || value === "https://") {
      errors.push({ field, message: `"${field}" is required and must not be empty.` });
    }
  };

  // ---- company ---------------------------------------------------------------
  required("company.name", config.company.name);
  required("company.legalName", config.company.legalName);
  required("company.description", config.company.description);
  required("company.industry", config.company.industry);
  required("company.audience", config.company.audience);

  if (config.company.ico && !ICO_RE.test(config.company.ico)) {
    errors.push({ field: "company.ico", message: '"company.ico" must be 6–8 digits.' });
  }
  if (config.company.dic && !DIC_RE.test(config.company.dic)) {
    errors.push({ field: "company.dic", message: '"company.dic" must match CZ followed by 8–10 digits.' });
  }

  // ---- domain ----------------------------------------------------------------
  required("domain.siteUrl", config.domain.siteUrl);
  validateUrl(config.domain.siteUrl,       "domain.siteUrl",       errors);
  validateUrl(config.domain.reportBaseUrl ?? "", "domain.reportBaseUrl", errors);
  validateUrl(config.domain.corsOrigin    ?? "", "domain.corsOrigin",    errors);

  // ---- branding --------------------------------------------------------------
  required("branding.colorPrimary", config.branding.colorPrimary);
  required("branding.colorAccent",  config.branding.colorAccent);
  required("branding.logoUrl",      config.branding.logoUrl);

  if (config.branding.colorPrimary && !HEX_COLOR_RE.test(config.branding.colorPrimary)) {
    errors.push({ field: "branding.colorPrimary", message: '"branding.colorPrimary" must be a valid 3 or 6 digit hex color.' });
  }
  if (config.branding.colorAccent && !HEX_COLOR_RE.test(config.branding.colorAccent)) {
    errors.push({ field: "branding.colorAccent", message: '"branding.colorAccent" must be a valid 3 or 6 digit hex color.' });
  }

  validateUrl(config.branding.logoUrl,      "branding.logoUrl",    errors);
  validateUrl(config.branding.faviconUrl ?? "", "branding.faviconUrl", errors);

  // ---- contact ---------------------------------------------------------------
  required("contact.email", config.contact.email);
  if (config.contact.email && !EMAIL_RE.test(config.contact.email)) {
    errors.push({ field: "contact.email", message: '"contact.email" must be a valid email address.' });
  }

  if (config.contact.mapsEmbedUrl && config.contact.mapsEmbedUrl.trim() !== "") {
    if (!MAPS_EMBED_RE.test(config.contact.mapsEmbedUrl)) {
      errors.push({
        field: "contact.mapsEmbedUrl",
        message:
          '"contact.mapsEmbedUrl" must be a Google Maps embed URL starting with https://google.com/maps/embed or https://www.google.com/maps/embed.',
      });
    }
  }

  // ---- team ------------------------------------------------------------------
  if (!Array.isArray(config.team) || config.team.length === 0) {
    errors.push({ field: "team", message: '"team" must contain at least one member.' });
  } else {
    config.team.forEach((member, i) => {
      if (!member.name?.trim()) {
        errors.push({ field: `team[${i}].name`, message: `"team[${i}].name" is required.` });
      }
      if (!member.title?.trim()) {
        errors.push({ field: `team[${i}].title`, message: `"team[${i}].title" is required.` });
      }
      if (!member.email?.trim()) {
        errors.push({ field: `team[${i}].email`, message: `"team[${i}].email" is required.` });
      } else if (!EMAIL_RE.test(member.email)) {
        errors.push({ field: `team[${i}].email`, message: `"team[${i}].email" must be a valid email address.` });
      }
      validateUrl(member.calendarUrl ?? "", `team[${i}].calendarUrl`, errors);
    });
  }

  // ---- social ----------------------------------------------------------------
  validateUrl(config.social.linkedin     ?? "", "social.linkedin",     errors);
  validateUrl(config.social.instagram    ?? "", "social.instagram",    errors);
  validateUrl(config.social.facebook     ?? "", "social.facebook",     errors);
  validateUrl(config.social.googleReviews ?? "", "social.googleReviews", errors);

  // ---- notifications ---------------------------------------------------------
  if (!Array.isArray(config.notifications.recipients) || config.notifications.recipients.length === 0) {
    errors.push({ field: "notifications.recipients", message: '"notifications.recipients" must contain at least one email address.' });
  } else {
    config.notifications.recipients.forEach((addr, i) => {
      if (!EMAIL_RE.test(addr)) {
        errors.push({ field: `notifications.recipients[${i}]`, message: `"notifications.recipients[${i}]" must be a valid email address.` });
      }
    });
  }

  required("notifications.fromEmail", config.notifications.fromEmail);
  if (config.notifications.fromEmail && !EMAIL_RE.test(config.notifications.fromEmail)) {
    errors.push({ field: "notifications.fromEmail", message: '"notifications.fromEmail" must be a valid email address.' });
  }
  required("notifications.fromName", config.notifications.fromName);

  // ---- analytics (all optional) ----------------------------------------------
  if (config.analytics) {
    const a = config.analytics;

    if (a.gaId && !GA4_RE.test(a.gaId)) {
      errors.push({
        field: "analytics.gaId",
        message: '"analytics.gaId" must match the format G-XXXXXXXXXX (G- followed by 6–12 uppercase alphanumeric characters).',
      });
    }
    if (a.clarityId && !CLARITY_RE.test(a.clarityId)) {
      errors.push({
        field: "analytics.clarityId",
        message: '"analytics.clarityId" must be 8–14 lowercase alphanumeric characters.',
      });
    }
    if (a.facebookPixel && !FB_PIXEL_RE.test(a.facebookPixel)) {
      errors.push({
        field: "analytics.facebookPixel",
        message: '"analytics.facebookPixel" must be 12–16 digits.',
      });
    }
    if (a.gtmContainerId && !GTM_RE.test(a.gtmContainerId)) {
      errors.push({
        field: "analytics.gtmContainerId",
        message: '"analytics.gtmContainerId" must match the format GTM-XXXXXXX (GTM- followed by 6–8 uppercase alphanumeric characters).',
      });
    }
  }

  // ---- seo.founder -----------------------------------------------------------
  if (config.seo?.founder) {
    validateUrl(config.seo.founder.linkedinUrl, "seo.founder.linkedinUrl", errors);
  }

  // ---- content (URL fields inside pricing tiers) -----------------------------
  if (config.content?.pricing?.tiers) {
    config.content.pricing.tiers.forEach((tier, i) => {
      if (tier.ctaUrl) {
        validateUrl(tier.ctaUrl, `content.pricing.tiers[${i}].ctaUrl`, errors);
      }
    });
  }

  // ---- nav -------------------------------------------------------------------
  if (config.nav?.ctaButton?.href) {
    validateUrl(config.nav.ctaButton.href, "nav.ctaButton.href", errors);
  }

  // ---- llm -------------------------------------------------------------------
  if (config.llm) {
    const llm = config.llm;

    if (llm.timeout !== undefined) {
      if (llm.timeout < 10000 || llm.timeout > 60000) {
        errors.push({
          field: "llm.timeout",
          message: '"llm.timeout" must be between 10 000 and 60 000 milliseconds.',
        });
      }
    }

    const validateLlmTier = (
      tier: NonNullable<AuditClientConfig["llm"]>["primary"],
      prefix: string,
    ) => {
      if (!tier) return;

      if (tier.models !== undefined) {
        if (!Array.isArray(tier.models) || tier.models.length === 0) {
          errors.push({
            field: `${prefix}.models`,
            message: `"${prefix}.models" must be a non-empty array when provided.`,
          });
        }
      }
      if (tier.temperature !== undefined) {
        if (tier.temperature < 0 || tier.temperature > 1) {
          errors.push({
            field: `${prefix}.temperature`,
            message: `"${prefix}.temperature" must be between 0.0 and 1.0.`,
          });
        }
      }
      if (tier.maxTokens !== undefined) {
        if (tier.maxTokens < 16000 || tier.maxTokens > 64000) {
          errors.push({
            field: `${prefix}.maxTokens`,
            message: `"${prefix}.maxTokens" must be between 16 000 and 64 000.`,
          });
        }
      }
    };

    validateLlmTier(llm.primary,  "llm.primary");
    validateLlmTier(llm.fallback, "llm.fallback");
  }

  // ---- prompt ----------------------------------------------------------------
  if (config.prompt) {
    const p = config.prompt;

    if (p.systemIdentity !== undefined) {
      if (p.systemIdentity.length > 100) {
        errors.push({
          field: "prompt.systemIdentity",
          message: '"prompt.systemIdentity" must not exceed 100 characters.',
        });
      } else if (!SYSTEM_IDENTITY_RE.test(p.systemIdentity)) {
        errors.push({
          field: "prompt.systemIdentity",
          message:
            '"prompt.systemIdentity" contains disallowed characters. ' +
            "Only letters (including Czech diacritics), digits, spaces, and -&.,!\'() are allowed.",
        });
      }
      if (containsPromptInjection(p.systemIdentity)) {
        errors.push({
          field: "prompt.systemIdentity",
          message: '"prompt.systemIdentity" contains a disallowed term.',
        });
      }
    }

    if (p.industryContext !== undefined) {
      if (p.industryContext.length > 500) {
        errors.push({
          field: "prompt.industryContext",
          message: '"prompt.industryContext" must not exceed 500 characters.',
        });
      }
      if (containsPromptInjection(p.industryContext)) {
        errors.push({
          field: "prompt.industryContext",
          message: '"prompt.industryContext" contains a disallowed term.',
        });
      }
    }

    if (p.focusAreas !== undefined) {
      p.focusAreas.forEach((area, i) => {
        if (area.length > 100) {
          errors.push({
            field: `prompt.focusAreas[${i}]`,
            message: `"prompt.focusAreas[${i}]" must not exceed 100 characters.`,
          });
        }
        if (containsPromptInjection(area)) {
          errors.push({
            field: `prompt.focusAreas[${i}]`,
            message: `"prompt.focusAreas[${i}]" contains a disallowed term.`,
          });
        }
      });
    }

    if (p.customInstructions !== undefined) {
      if (p.customInstructions.length > 2000) {
        errors.push({
          field: "prompt.customInstructions",
          message: '"prompt.customInstructions" must not exceed 2 000 characters.',
        });
      }
      if (containsPromptInjection(p.customInstructions)) {
        errors.push({
          field: "prompt.customInstructions",
          message: '"prompt.customInstructions" contains a disallowed term.',
        });
      }
    }

    if (p.brandMentions) {
      p.brandMentions.forEach((mention, i) => {
        if (mention.name.length > 100) {
          errors.push({
            field: `prompt.brandMentions[${i}].name`,
            message: `"prompt.brandMentions[${i}].name" must not exceed 100 characters.`,
          });
        }
        if (containsPromptInjection(mention.name)) {
          errors.push({
            field: `prompt.brandMentions[${i}].name`,
            message: `"prompt.brandMentions[${i}].name" contains a disallowed term.`,
          });
        }

        if (mention.description.length > 500) {
          errors.push({
            field: `prompt.brandMentions[${i}].description`,
            message: `"prompt.brandMentions[${i}].description" must not exceed 500 characters.`,
          });
        }
        if (containsPromptInjection(mention.description)) {
          errors.push({
            field: `prompt.brandMentions[${i}].description`,
            message: `"prompt.brandMentions[${i}].description" contains a disallowed term.`,
          });
        }

        if (mention.when.length > 100) {
          errors.push({
            field: `prompt.brandMentions[${i}].when`,
            message: `"prompt.brandMentions[${i}].when" must not exceed 100 characters.`,
          });
        }
        if (containsPromptInjection(mention.when)) {
          errors.push({
            field: `prompt.brandMentions[${i}].when`,
            message: `"prompt.brandMentions[${i}].when" contains a disallowed term.`,
          });
        }
      });
    }
  }

  // ---- search ----------------------------------------------------------------
  if (config.search) {
    const s = config.search;

    if (s.maxQueries !== undefined) {
      if (s.maxQueries < 1 || s.maxQueries > 12) {
        errors.push({
          field: "search.maxQueries",
          message: '"search.maxQueries" must be between 1 and 12.',
        });
      }
      if (Array.isArray(s.disabledQueryTypes)) {
        const disabled = s.disabledQueryTypes;
        if (disabled.includes("generic") && disabled.includes("domainSpecific")) {
          errors.push({
            field: "search.disabledQueryTypes",
            message:
              '"search.disabledQueryTypes" must not disable both "generic" and "domainSpecific" — at least one must remain active.',
          });
        }
      }
    }

    if (s.additionalQueries) {
      const DISALLOWED_OPERATORS = ["OR", "AND", "site:", "inurl:", "filetype:"];
      s.additionalQueries.forEach((q, i) => {
        if (q.query.length > 200) {
          errors.push({
            field: `search.additionalQueries[${i}].query`,
            message: `"search.additionalQueries[${i}].query" must not exceed 200 characters.`,
          });
        }
        for (const op of DISALLOWED_OPERATORS) {
          if (q.query.includes(op)) {
            errors.push({
              field: `search.additionalQueries[${i}].query`,
              message: `"search.additionalQueries[${i}].query" must not contain the operator "${op}".`,
            });
          }
        }
      });
    }
  }

  // ---- report ----------------------------------------------------------------
  if (config.report) {
    const r = config.report;

    if (r.opportunityCount !== undefined) {
      if (r.opportunityCount < 3 || r.opportunityCount > 20) {
        errors.push({
          field: "report.opportunityCount",
          message: '"report.opportunityCount" must be between 3 and 20.',
        });
      }
    }

    if (r.questionCategoryCount !== undefined) {
      if (r.questionCategoryCount < 3 || r.questionCategoryCount > 10) {
        errors.push({
          field: "report.questionCategoryCount",
          message: '"report.questionCategoryCount" must be between 3 and 10.',
        });
      }
    }

    if (r.sections?.disabled) {
      if (r.sections.disabled.includes("header")) {
        errors.push({
          field: "report.sections.disabled",
          message: '"report.sections.disabled" must not include "header".',
        });
      }
      if (r.sections.disabled.includes("footer")) {
        errors.push({
          field: "report.sections.disabled",
          message: '"report.sections.disabled" must not include "footer".',
        });
      }
    }

    if (r.cta?.buttonUrl) {
      validateUrl(r.cta.buttonUrl, "report.cta.buttonUrl", errors);
    }
  }

  return errors;
}
