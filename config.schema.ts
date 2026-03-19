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

    /** Google Maps embed URL for the contact section iframe — optional */
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
};

// ---------------------------------------------------------------------------
// resolveConfig utility
// ---------------------------------------------------------------------------

/**
 * Fills in derived and default values so that runtime code never needs
 * to handle `undefined` for the fields listed below.
 *
 * Derived fields:
 *   - `domain.reportBaseUrl` → `${siteUrl}/report`
 *   - `domain.corsOrigin`    → `siteUrl`
 *   - `branding.faviconUrl`  → `"/favicon.svg"`
 *   - `contact.country`      → `"Česká republika"`
 *
 * @param config Raw config object loaded from `config.json`
 * @returns Fully resolved config with all optional fields guaranteed
 */
export function resolveConfig(config: AuditClientConfig): ResolvedConfig {
  return {
    ...config,
    domain: {
      ...config.domain,
      reportBaseUrl:
        config.domain.reportBaseUrl ||
        `${config.domain.siteUrl}/report`,
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

export interface ValidationError {
  field: string;
  message: string;
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

  // company
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

  // domain
  required("domain.siteUrl", config.domain.siteUrl);

  // branding
  required("branding.colorPrimary", config.branding.colorPrimary);
  required("branding.colorAccent", config.branding.colorAccent);
  required("branding.logoUrl", config.branding.logoUrl);

  if (config.branding.colorPrimary && !HEX_COLOR_RE.test(config.branding.colorPrimary)) {
    errors.push({ field: "branding.colorPrimary", message: '"branding.colorPrimary" must be a valid 3 or 6 digit hex color.' });
  }
  if (config.branding.colorAccent && !HEX_COLOR_RE.test(config.branding.colorAccent)) {
    errors.push({ field: "branding.colorAccent", message: '"branding.colorAccent" must be a valid 3 or 6 digit hex color.' });
  }

  // contact
  required("contact.email", config.contact.email);
  if (config.contact.email && !EMAIL_RE.test(config.contact.email)) {
    errors.push({ field: "contact.email", message: '"contact.email" must be a valid email address.' });
  }

  // team
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
    });
  }

  // notifications
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

  return errors;
}
