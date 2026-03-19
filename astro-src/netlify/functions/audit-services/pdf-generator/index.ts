// =============================================================================
// PDF-GENERATOR MODULE - Public API exports
// =============================================================================
// This module generates professional PDF reports from markdown content.
// Main entry points:
//   - generatePDFReport(markdown, formData): Promise<PDFGenerationResult>
//   - generateFallbackPDF(formData): Buffer
// =============================================================================

// Main generator functions
export { generatePDFReport, generateFallbackPDF } from './generator';

// Type definitions
export type {
  PDFGenerationResult,
  AuditFormData,
  RGB,
  PDFColors,
  ParsedSection,
  MatrixQuadrant
} from './types';

// Styling utilities (for advanced customization)
export {
  COLORS,
  getMatrixQuadrants,
  cleanMarkdownText,
  stripEmojis,
  extractDomain,
  parseMarkdownToSections
} from './styles';

// Helper functions (for advanced customization)
export {
  initializeFonts,
  addHeader,
  addFooters,
  addContactSection,
  getFontName,
  isFontLoaded,
  loadLogoAsBase64,
  loadFontFromCDN
} from './helpers';
