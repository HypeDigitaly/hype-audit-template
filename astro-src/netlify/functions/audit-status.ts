import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import type { AuditJob } from "./audit-background";

// =============================================================================
// AUDIT STATUS ENDPOINT - Check Background Job Progress
// =============================================================================
// GET /api/audit-status?jobId=xxx
// Returns the current status of an audit job for frontend polling
// =============================================================================

const JOBS_STORE = "audit-jobs";

function getJobsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  
  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured.');
  }
  
  return getStore({
    name: JOBS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Get jobId from query params
  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing jobId parameter" }),
    };
  }

  try {
    const store = getJobsStore();
    const jobData = await store.get(jobId);

    if (!jobData) {
      // Job not found - might not be initialized yet
      // Return a "pending" status to let frontend retry
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          jobId,
          status: 'pending',
          progress: 0,
          statusMessage: 'Initializing...',
          notFound: true
        }),
      };
    }

    const job: AuditJob = JSON.parse(jobData);

    // Return sanitized job status (exclude sensitive data)
    // v3: Include sub-step tracking for granular progress
    const response = {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      statusMessage: job.statusMessage,
      // New v3 fields for granular progress
      currentSubStep: job.currentSubStep,
      subStepMessage: job.subStepMessage,
      companyName: job.companyName,
      reportId: job.reportId,
      reportUrl: job.reportUrl,
      error: job.error,
      validationErrors: job.validationErrors,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      completedAt: job.completedAt
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('[Status] Error fetching job status:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch job status" }),
    };
  }
};

export { handler };
