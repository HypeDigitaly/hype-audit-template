// =============================================================================
// AUDIT STORAGE - Netlify Blobs operations for audit system
// =============================================================================
// Shared storage utilities for reports, leads, and job status management
// =============================================================================

import { getStore } from "@netlify/blobs";
import type { ResearchStep } from '../audit-services/langgraph-agent';
import {
  REPORTS_STORE,
  LEADS_STORE,
  JOBS_STORE,
  type JobStatus,
  type AuditJob,
  type AuditFormData
} from './types';

// =============================================================================
// BLOB STORE GETTERS
// =============================================================================

/**
 * Get Netlify Blobs store for job status tracking
 */
export function getJobsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.');
  }

  return getStore({
    name: JOBS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

/**
 * Get Netlify Blobs store for audit reports
 */
export function getAuditReportStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.');
  }

  return getStore({
    name: REPORTS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

/**
 * Get Netlify Blobs store for leads (persistent, no expiration)
 */
export function getLeadsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.');
  }

  return getStore({
    name: LEADS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

// =============================================================================
// JOB STATUS MANAGEMENT
// =============================================================================

/**
 * Progress percentages for each job status
 */
const PROGRESS_MAP: Record<JobStatus, number> = {
  'pending': 0,
  'validating': 10,
  'researching': 30,
  'generating': 60,
  'storing': 80,
  'emailing': 90,
  'completed': 100,
  'failed': 0 // Will be overridden to keep current progress
};

/**
 * Update job status in Blobs for frontend polling
 */
export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  updates: Partial<AuditJob> = {}
): Promise<void> {
  try {
    const store = getJobsStore();
    const existingData = await store.get(jobId);

    if (!existingData) {
      console.error(`[Background] Job ${jobId} not found for status update`);
      return;
    }

    const job: AuditJob = JSON.parse(existingData);

    // Use custom progress if provided in updates, otherwise use the status map
    // For 'failed' status, keep the current progress
    const newProgress = updates.progress !== undefined
      ? updates.progress
      : (status === 'failed' ? job.progress : PROGRESS_MAP[status]);

    const updatedJob: AuditJob = {
      ...job,
      ...updates,
      status,
      progress: newProgress,
      updatedAt: new Date().toISOString(),
      ...(status === 'completed' || status === 'failed' ? { completedAt: new Date().toISOString() } : {})
    };

    await store.set(jobId, JSON.stringify(updatedJob));
    console.log(`[Background] Job ${jobId} status: ${status} (${updatedJob.progress}%) ${updates.currentSubStep ? `- SubStep: ${updates.currentSubStep}` : ''}`);
  } catch (error) {
    console.error(`[Background] Failed to update job status:`, error);
  }
}

/**
 * Initialize a new job in Blobs
 */
export async function initializeJob(jobId: string, formData: AuditFormData): Promise<void> {
  const store = getJobsStore();

  const job: AuditJob = {
    jobId,
    status: 'pending',
    progress: 0,
    email: formData.email,
    companyName: formData.companyName,
    website: formData.website,
    city: formData.city,
    language: formData.language,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await store.set(jobId, JSON.stringify(job));
  console.log(`[Background] Job ${jobId} initialized for ${formData.companyName}`);
}

/**
 * Create a progress callback for the research agent
 * This allows the agent to report granular progress during execution
 */
export function createProgressCallback(jobId: string) {
  return async (step: ResearchStep, progress: number, message: string): Promise<void> => {
    await updateJobStatus(jobId, 'researching', {
      progress,
      statusMessage: message,
      currentSubStep: step,
      subStepMessage: message
    });
  };
}
