// =============================================================================
// HELPERS - Glossary utility functions
// =============================================================================

import type {
  BenefitTypeKey,
  QuadrantKey,
  ImplementationTypeKey,
  TechCategoryKey,
  RiskCategoryKey,
  GlossaryEntry
} from './types';

import { BENEFIT_TYPE_LABELS } from './benefit-labels';
import { QUADRANT_LABELS } from './quadrant-labels';
import { TECHNICAL_TERMS } from './technical-terms';
import {
  IMPLEMENTATION_TYPE_LABELS,
  TECH_CATEGORY_LABELS,
  RISK_CATEGORY_LABELS
} from './category-labels';

// =============================================================================
// LABEL GETTER FUNCTIONS
// =============================================================================

/**
 * Get enhanced label for a benefit type
 */
export function getBenefitLabel(type: BenefitTypeKey, lang: 'cs' | 'en'): GlossaryEntry {
  return BENEFIT_TYPE_LABELS[type]?.[lang] || { label: type, tooltip: '' };
}

/**
 * Get enhanced label for a quadrant
 */
export function getQuadrantLabel(quadrant: QuadrantKey, lang: 'cs' | 'en'): GlossaryEntry {
  return QUADRANT_LABELS[quadrant]?.[lang] || { label: quadrant, tooltip: '' };
}

/**
 * Get enhanced label for an implementation type
 */
export function getImplementationTypeLabel(type: ImplementationTypeKey, lang: 'cs' | 'en'): GlossaryEntry {
  return IMPLEMENTATION_TYPE_LABELS[type]?.[lang] || { label: type, tooltip: '' };
}

/**
 * Get enhanced label for a technology category
 */
export function getTechCategoryLabel(category: TechCategoryKey, lang: 'cs' | 'en'): GlossaryEntry {
  return TECH_CATEGORY_LABELS[category]?.[lang] || { label: category, tooltip: '' };
}

/**
 * Get enhanced label for a risk category
 */
export function getRiskCategoryLabel(category: RiskCategoryKey, lang: 'cs' | 'en'): GlossaryEntry {
  return RISK_CATEGORY_LABELS[category]?.[lang] || { label: category, tooltip: '' };
}

/**
 * Get explanation for a technical term
 */
export function getTechnicalTermExplanation(term: string, lang: 'cs' | 'en'): GlossaryEntry | null {
  const upperTerm = term.toUpperCase();
  const lowerTerm = term.toLowerCase();

  // Try exact match first
  if (TECHNICAL_TERMS[term]) {
    return TECHNICAL_TERMS[term][lang];
  }

  // Try uppercase
  if (TECHNICAL_TERMS[upperTerm]) {
    return TECHNICAL_TERMS[upperTerm][lang];
  }

  // Try lowercase
  if (TECHNICAL_TERMS[lowerTerm]) {
    return TECHNICAL_TERMS[lowerTerm][lang];
  }

  return null;
}

// =============================================================================
// HTML HELPER FUNCTIONS
// =============================================================================

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Wrap a technical term with tooltip HTML
 */
export function wrapWithTooltip(text: string, tooltip: string): string {
  return `<span class="tooltip-term" data-tooltip="${escapeHtml(tooltip)}">${text}</span>`;
}
