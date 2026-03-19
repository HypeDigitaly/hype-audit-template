// =============================================================================
// HTML-REPORT MODULE - Public API exports
// =============================================================================
// This module generates interactive HTML reports for AI audits.
// Main entry point: generateHTMLReport(data: AuditReportData): string
// =============================================================================

// Main generator function - primary export
export { generateHTMLReport } from './generator';

// Type definitions - for external use
export type {
  AuditQuestion,
  BenefitType,
  OpportunityBenefit,
  AIOpportunity,
  ExpectedBenefitsSummary,
  RecommendedTool,
  ROIEstimate,
  CompanyProfile,
  CompanyBranding,
  DetectedTechnology,
  AppIntegrationOpportunity,
  IndustryBenchmark,
  ImplementationTimelinePhase,
  ImplementationTimeline,
  RiskAssessmentItem,
  RiskAssessment,
  AuditReportData,
  Translations
} from './types';

// Translations - for external use in emails/other contexts
export { getTranslations } from './translations';

// Utility functions - for external use
export {
  getEnhancedBenefitLabel,
  getEnhancedQuadrantLabel,
  getEnhancedImplementationTypeLabel,
  getEnhancedTechCategoryLabel,
  getEnhancedRiskCategoryLabel,
  wrapWithTooltip,
  escapeHtmlAttr,
  sanitizeColor,
  lightenColor,
  isBrowserDefaultColor,
  selectBrandColor
} from './utils';

// Section generators - for advanced customization
export {
  generateHeader,
  generateCompanySection,
  generateIntroSection,
  generateQuestionsSection,
  generateExecutiveSummarySection,
  generateOpportunitiesSection,
  generateMatrixSection,
  generateTechnologiesSection,
  generateAppIntegrationSection,
  generateBenchmarkSection,
  generateTimelineSection,
  generateRiskSection,
  generateToolsSection,
  generateROISection,
  generateCTASection,
  generateFooter
} from './sections';
