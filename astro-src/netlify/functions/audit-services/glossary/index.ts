// =============================================================================
// GLOSSARY MODULE - Central export point
// =============================================================================
// Re-exports all glossary functionality for backwards compatibility
// =============================================================================

// Types
export type {
  GlossaryEntry,
  BilingualGlossaryEntry,
  BenefitTypeKey,
  QuadrantKey,
  ImplementationTypeKey,
  TechCategoryKey,
  RiskCategoryKey,
  BusinessType,
  BusinessTypeMetricsConfig
} from './types';

// Benefit Labels
export { BENEFIT_TYPE_LABELS } from './benefit-labels';

// Quadrant Labels
export { QUADRANT_LABELS } from './quadrant-labels';

// Technical Terms
export { TECHNICAL_TERMS } from './technical-terms';

// Category Labels
export {
  IMPLEMENTATION_TYPE_LABELS,
  TECH_CATEGORY_LABELS,
  RISK_CATEGORY_LABELS
} from './category-labels';

// Business Types
export {
  BUSINESS_TYPE_KEYWORDS,
  BUSINESS_TYPE_METRICS,
  detectBusinessType,
  getBusinessTypeMetrics,
  getPrimaryMetricsForIndustry
} from './business-types';

// Helper Functions
export {
  getBenefitLabel,
  getQuadrantLabel,
  getImplementationTypeLabel,
  getTechCategoryLabel,
  getRiskCategoryLabel,
  getTechnicalTermExplanation,
  wrapWithTooltip
} from './helpers';
