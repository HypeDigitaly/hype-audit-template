// =============================================================================
// HTML REPORT GENERATOR - Re-export from modular html-report/ module
// =============================================================================
// This file maintains backwards compatibility by re-exporting from the
// new modular html-report/ directory structure.
//
// For new code, prefer importing directly from './html-report':
//   import { generateHTMLReport, type AuditReportData } from './html-report';
// =============================================================================

// Re-export everything from the new modular structure
export * from './html-report';

// Explicit re-export of main function for clarity
export { generateHTMLReport } from './html-report';
