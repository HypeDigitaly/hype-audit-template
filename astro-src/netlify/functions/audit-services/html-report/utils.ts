// =============================================================================
// UTILS - Helper functions for HTML report generation
// =============================================================================

import {
  BENEFIT_TYPE_LABELS,
  QUADRANT_LABELS,
  IMPLEMENTATION_TYPE_LABELS,
  TECH_CATEGORY_LABELS,
  RISK_CATEGORY_LABELS,
  type BenefitTypeKey,
  type QuadrantKey,
  type ImplementationTypeKey,
  type TechCategoryKey,
  type RiskCategoryKey,
  type GlossaryEntry
} from '../glossary';

import type { BenefitType, CompanyBranding } from './types';
import { clientConfig } from '../../_config/client';

// =============================================================================
// ENHANCED LABEL HELPERS - Jargon-free labels with tooltips
// =============================================================================

/**
 * Get enhanced label for a benefit type with human-readable text
 */
export function getEnhancedBenefitLabel(type: BenefitType, lang: 'cs' | 'en'): GlossaryEntry {
  const entry = BENEFIT_TYPE_LABELS[type as BenefitTypeKey];
  if (entry) {
    return entry[lang];
  }
  // Fallback for unknown types
  return { label: type, tooltip: '' };
}

/**
 * Get enhanced label for a quadrant with tooltip explanation
 */
export function getEnhancedQuadrantLabel(quadrant: string, lang: 'cs' | 'en'): GlossaryEntry {
  const entry = QUADRANT_LABELS[quadrant as QuadrantKey];
  if (entry) {
    return entry[lang];
  }
  return { label: quadrant, tooltip: '' };
}

/**
 * Get enhanced label for implementation type
 */
export function getEnhancedImplementationTypeLabel(type: string, lang: 'cs' | 'en'): GlossaryEntry {
  const entry = IMPLEMENTATION_TYPE_LABELS[type as ImplementationTypeKey];
  if (entry) {
    return entry[lang];
  }
  return { label: type, tooltip: '' };
}

/**
 * Get enhanced label for technology category
 */
export function getEnhancedTechCategoryLabel(category: string, lang: 'cs' | 'en'): GlossaryEntry {
  const entry = TECH_CATEGORY_LABELS[category as TechCategoryKey];
  if (entry) {
    return entry[lang];
  }
  return { label: category, tooltip: '' };
}

/**
 * Get enhanced label for risk category
 */
export function getEnhancedRiskCategoryLabel(category: string, lang: 'cs' | 'en'): GlossaryEntry {
  const entry = RISK_CATEGORY_LABELS[category as RiskCategoryKey];
  if (entry) {
    return entry[lang];
  }
  return { label: category, tooltip: '' };
}

// =============================================================================
// HTML UTILITY FUNCTIONS
// =============================================================================

/**
 * Wrap text with tooltip HTML
 */
export function wrapWithTooltip(text: string, tooltip: string): string {
  if (!tooltip) return text;
  return `<span class="tooltip-term" data-tooltip="${escapeHtmlAttr(tooltip)}">${text}</span>`;
}

/**
 * Escape HTML attributes for safe tooltip content
 */
export function escapeHtmlAttr(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Escape HTML special characters for safe insertion of dynamic content
 * into HTML element text nodes or attribute values.
 * Use this as defense-in-depth for any runtime string rendered into reports.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize a URL for safe use in href attributes.
 * Only allows http://, https://, and mailto: protocols.
 * Returns empty string for dangerous protocols (javascript:, data:, vbscript:, etc.).
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  // Allow only safe protocols
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  // Allow protocol-relative or bare domains by prepending https://
  if (!trimmed.includes(':')) {
    return `https://${trimmed}`;
  }
  // Block everything else (javascript:, data:, vbscript:, etc.)
  return '';
}

// =============================================================================
// COLOR UTILITY FUNCTIONS
// =============================================================================

/**
 * Sanitize and validate color hex code
 */
export function sanitizeColor(color?: string): string | null {
  if (!color) return null;
  const cleaned = color.trim();
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(cleaned)) return null;
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}

/**
 * Lighten a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor((num >> 16) + ((255 - (num >> 16)) * percent / 100)));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + ((255 - ((num >> 8) & 0x00FF)) * percent / 100)));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + ((255 - (num & 0x0000FF)) * percent / 100)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Check if a color is a browser default that should be ignored
 * Browser defaults are often returned by Firecrawl but don't represent actual brand colors
 */
export function isBrowserDefaultColor(color: string | null | undefined): boolean {
  if (!color) return true;

  const browserDefaults = [
    '#0000EE', // Default unvisited link (blue)
    '#0000FF', // Pure blue
    '#551A8B', // Default visited link (purple)
    '#000000', // Pure black
    '#FFFFFF', // Pure white
    '#FF0000', // Pure red
    '#00FF00', // Pure green
  ];

  return browserDefaults.includes(color.toUpperCase());
}

/**
 * Smart brand color selection with priority logic.
 * Priority: accent > link > non-default primary > config brand color > generic default
 * This avoids using browser default colors like #0000EE.
 */
export function selectBrandColor(
  branding?: CompanyBranding,
  fallback: string = clientConfig.brand?.primaryColor || '#0ea5e9',
): string {
  if (!branding) return fallback;

  // Priority 1: Accent color (most reliable brand indicator from Firecrawl)
  const accentSanitized = sanitizeColor(branding.accentColor);
  if (accentSanitized && !isBrowserDefaultColor(accentSanitized)) {
    console.log(`[Branding] Using accent color: ${accentSanitized}`);
    return accentSanitized;
  }

  // Priority 2: Primary color (only if not a browser default)
  const primarySanitized = sanitizeColor(branding.primaryColor);
  if (primarySanitized && !isBrowserDefaultColor(primarySanitized)) {
    console.log(`[Branding] Using primary color: ${primarySanitized}`);
    return primarySanitized;
  }

  // Priority 3: Background color (if it's colorful, not black/white)
  const bgSanitized = sanitizeColor(branding.backgroundColor);
  if (bgSanitized && !isBrowserDefaultColor(bgSanitized)) {
    console.log(`[Branding] Using background color: ${bgSanitized}`);
    return bgSanitized;
  }

  // Fallback: config brand color or generic blue default
  console.log(`[Branding] Using fallback color: ${fallback}`);
  return fallback;
}
