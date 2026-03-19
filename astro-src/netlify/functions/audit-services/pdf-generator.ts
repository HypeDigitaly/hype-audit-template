// =============================================================================
// PDF GENERATOR SERVICE - Re-export from modular pdf-generator/ module
// =============================================================================
// This file maintains backwards compatibility by re-exporting from the
// new modular pdf-generator/ directory structure.
//
// For new code, prefer importing directly from './pdf-generator':
//   import { generatePDFReport, generateFallbackPDF } from './pdf-generator';
// =============================================================================

// Re-export everything from the new modular structure
export * from './pdf-generator/index';

// Explicit re-export of main functions for clarity
export { generatePDFReport, generateFallbackPDF } from './pdf-generator/index';
