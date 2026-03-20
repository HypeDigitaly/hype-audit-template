/**
 * site.ts — Frontend configuration for Astro pages and components.
 *
 * Imports config.json (single source of truth) and exports a typed, immutable
 * `site` object. All optional fields are resolved to safe defaults so that
 * component authors never need to handle `undefined`.
 *
 * Import path: ../../../config.json  (3 levels up: config/ → src/ → astro-src/ → repo root)
 */

import rawConfig from '../../../config.json';
import type { AuditClientConfig } from '../../../config.schema';
import { resolveConfig, validateConfig } from '../../../config.schema';

const config = resolveConfig(rawConfig as AuditClientConfig);

const _validationErrors = validateConfig(rawConfig as AuditClientConfig);
if (_validationErrors.length > 0) {
  console.warn(
    '[config] Validation warnings:',
    _validationErrors.map(e => `${e.field}: ${e.message}`).join('; '),
  );
}

// ---------------------------------------------------------------------------
// Primary contact — first team member, or a fully-typed empty sentinel.
// Typed explicitly so `as const` does not widen the fallback to `never`.
// ---------------------------------------------------------------------------

type TeamMember = AuditClientConfig['team'][number];

const EMPTY_TEAM_MEMBER: TeamMember = {
  name: '',
  title: '',
  email: '',
  phone: '',
  calendarUrl: '',
};

const primaryContact: TeamMember = config.team[0] ?? EMPTY_TEAM_MEMBER;

// ---------------------------------------------------------------------------
// Derived URL values
// ---------------------------------------------------------------------------

const reportBaseUrl =
  config.domain.reportBaseUrl || `${config.domain.siteUrl}/report`;

// ---------------------------------------------------------------------------
// Exported site object
// ---------------------------------------------------------------------------

export const site = {
  // Company
  name: config.company.name,
  legalName: config.company.legalName,
  description: config.company.description,

  // URLs
  url: config.domain.siteUrl,
  reportBaseUrl,

  // Branding
  primaryColor: config.branding.colorPrimary,
  accentColor: config.branding.colorAccent,
  logoUrl: config.branding.logoUrl,
  faviconUrl: config.branding.faviconUrl || '/favicon.svg',

  // Contact
  email: config.contact.email,
  phone: config.contact.phone || '',
  address: {
    street: config.contact.street || '',
    city: config.contact.city || '',
    postalCode: config.contact.postalCode || '',
    country: config.contact.country || 'Česká republika',
  },
  mapsEmbedUrl: config.contact.mapsEmbedUrl || '',

  // Team
  primaryContact,
  team: config.team,

  // Social
  social: config.social,

  // SEO meta
  meta: {
    title: `${config.company.name} — AI Audit`,
    description: config.company.description,
    ogImage: config.branding.logoUrl,
  },

  // Legal identifiers
  ico: config.company.ico || '',
  dic: config.company.dic || '',

  // Analytics tracking IDs (all fields may be undefined when not configured)
  analytics: config.analytics,

  // SEO & structured-data enhancements (all fields may be undefined when not configured)
  seo: config.seo,

  // Page content overrides (section exists; individual fields may be undefined)
  content: config.content,

  // Audit submission form configuration (all fields resolved to defaults)
  auditForm: config.auditForm,

  // Navigation configuration (ctaButton may be undefined when not configured)
  nav: config.nav,

  // Transactional email copy overrides (all sub-sections may be undefined when not configured)
  // Named `emailConfig` to avoid collision with the top-level `email` contact address field.
  emailConfig: config.email,
} as const;

export type Site = typeof site;
