// =============================================================================
// AUDIT SHARED TYPES - Common interfaces for audit handlers
// =============================================================================
// Shared type definitions used by both audit.ts and audit-background.ts
// =============================================================================

import type { ResearchStep } from '../audit-services/langgraph-agent';
import { clientConfig } from '../_config/client';

// =============================================================================
// BLOB STORE NAMES
// =============================================================================

export const REPORTS_STORE = "audit-reports";
export const LEADS_STORE = "audit-leads";
export const JOBS_STORE = "audit-jobs";

// Base URL for reports
export const REPORT_BASE_URL = clientConfig.reportBaseUrl;

// Recipients for notification emails
export const NOTIFICATION_RECIPIENTS = clientConfig.notifications.recipients;

// =============================================================================
// JOB STATUS TYPES
// =============================================================================

export type JobStatus =
  | 'pending'
  | 'validating'
  | 'researching'
  | 'generating'
  | 'storing'
  | 'emailing'
  | 'completed'
  | 'failed';

// =============================================================================
// JOB DATA INTERFACE
// =============================================================================

/**
 * Job data stored in Blobs for tracking background processing
 */
export interface AuditJob {
  jobId: string;
  status: JobStatus;
  statusMessage?: string;
  progress: number; // 0-100
  // Sub-step tracking for granular progress
  currentSubStep?: ResearchStep;
  subStepMessage?: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  language: 'cs' | 'en';
  reportId?: string;
  reportUrl?: string;
  error?: string;
  validationErrors?: Record<string, { isValid: boolean; errorMessage?: string }>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// =============================================================================
// FORM DATA INTERFACE
// =============================================================================

/**
 * Form data submitted from audit forms (homepage hero or dedicated audit page)
 */
export interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  industry: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
  leadSource?: string; // Track which form the lead came from
  // Traffic source tracking (UTM parameters & click IDs)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}

// =============================================================================
// LEAD DATA INTERFACE
// =============================================================================

/**
 * Lead data interface for persistent storage in Netlify Blobs
 */
export interface AuditLead {
  id: string;
  email: string;
  companyName: string;
  website: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
  reportId: string;
  reportUrl: string;
  submittedAt: string;
  detectedIndustry?: string;
  leadSource?: string; // Track which form the lead came from
  // Traffic source tracking (UTM parameters & click IDs)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}
