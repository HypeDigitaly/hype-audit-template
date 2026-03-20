/**
 * client.ts — Runtime configuration for Netlify Functions.
 *
 * Imports config.json (single source of truth) and exports a typed, immutable
 * `clientConfig` object used by all serverless functions for CORS, email
 * notifications, report generation, and branding.
 *
 * Import path: ../../../../config.json  (4 levels up: _config/ → functions/ → netlify/ → astro-src/ → repo root)
 */

import rawConfig from '../../../../config.json';
import type { AuditClientConfig } from '../../../../config.schema';
import { resolveConfig, validateConfig } from '../../../../config.schema';

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

const siteUrl = config.domain.siteUrl;
const reportBaseUrl = config.domain.reportBaseUrl || `${siteUrl}/report`;
const corsOrigin = config.domain.corsOrigin || siteUrl;

// ---------------------------------------------------------------------------
// Derived email "From" header
// ---------------------------------------------------------------------------

const fromAddress = `${config.notifications.fromName} <${config.notifications.fromEmail}>`;

// ---------------------------------------------------------------------------
// Exported clientConfig object
// ---------------------------------------------------------------------------

export const clientConfig = {
  // CORS
  corsOrigin,
  siteUrl,

  // Report
  reportBaseUrl,

  // Company identity (for reports, emails, prompts)
  company: {
    name: config.company.name,
    legalName: config.company.legalName,
    description: config.company.description,
    industry: config.company.industry,
    audience: config.company.audience,
    ico: config.company.ico || '',
    dic: config.company.dic || '',
  },

  // Contact (for report CTAs, email footers)
  contact: {
    email: config.contact.email,
    phone: config.contact.phone || '',
    street: config.contact.street || '',
    city: config.contact.city || '',
    postalCode: config.contact.postalCode || '',
    country: config.contact.country || 'Česká republika',
    mapsEmbedUrl: config.contact.mapsEmbedUrl || '',
  },

  // Team (for email signatures, report CTAs)
  team: config.team,
  primaryContact,

  // Notifications
  notifications: {
    recipients: config.notifications.recipients,
    fromEmail: config.notifications.fromEmail,
    fromName: config.notifications.fromName,
    fromAddress,
  },

  // Branding (for report generation, emails)
  brand: {
    primaryColor: config.branding.colorPrimary,
    accentColor: config.branding.colorAccent,
    logoUrl: config.branding.logoUrl,
    faviconUrl: config.branding.faviconUrl || '/favicon.svg',
  },

  // Social (for email footers, report footers)
  social: config.social,

  // LLM / AI provider settings (all fields resolved to production defaults)
  llm: config.llm,

  // System-prompt customisation (all fields may be undefined when not configured)
  prompt: config.prompt,

  // Web-search query configuration (maxQueries resolved to default)
  search: config.search,

  // Audit report rendering configuration (opportunityCount / questionCategoryCount resolved to defaults)
  report: config.report,

  // Audit submission form (painPoints / tools resolved to defaults; used for backend validation)
  auditForm: config.auditForm,

  // Transactional email copy overrides (all sub-sections may be undefined when not configured)
  email: config.email,
} as const;

export type ClientConfig = typeof clientConfig;
