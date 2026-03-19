// =============================================================================
// AUDIT SHARED - Re-exports for common audit utilities
// =============================================================================
// Central export point for shared audit functionality
// =============================================================================

// Types
export {
  REPORTS_STORE,
  LEADS_STORE,
  JOBS_STORE,
  REPORT_BASE_URL,
  NOTIFICATION_RECIPIENTS,
  type JobStatus,
  type AuditJob,
  type AuditFormData,
  type AuditLead
} from './types';

// Storage
export {
  getJobsStore,
  getAuditReportStore,
  getLeadsStore,
  updateJobStatus,
  initializeJob,
  createProgressCallback
} from './storage';

// Lead Management
export {
  generateLeadId,
  storeLead,
  submitToNetlifyForms
} from './lead-management';

// Validation
export {
  isValidLanguage,
  validateRequiredFields
} from './validation';
