import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { verifyAdminAuth } from "./onboarding-shared/auth";
import { clientConfig } from "./_config/client";

// =============================================================================
// ADMIN LEADS DELETE API - Netlify Function
// =============================================================================
// Bulk delete leads with optional report cleanup
// Protected by admin password authentication
// =============================================================================

// Store names
const AUDIT_LEADS_STORE = "audit-leads";
const CONTACT_LEADS_STORE = "contact-leads";
const SURVEY_LEADS_STORE = "survey-leads";
const PRICING_LEADS_STORE = "pricing-leads";
const REPORTS_STORE = "audit-reports";

// Request/Response interfaces
interface DeleteRequest {
  leadIds: string[];
  deleteReports: boolean;
}

interface DeleteResponse {
  success: boolean;
  deletedCount: number;
  errors: { leadId: string; error: string }[];
}

/**
 * Get Netlify Blobs store
 */
function getBlobStore(storeName: string) {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  
  if (!siteID || !token) {
    throw new Error('Netlify Blobs not configured');
  }
  
  return getStore({
    name: storeName,
    siteID,
    token,
    consistency: "strong"
  });
}

/**
 * Delete audit lead and optionally its report
 */
async function deleteAuditLead(leadId: string, deleteReport: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const leadsStore = getBlobStore(AUDIT_LEADS_STORE);
    
    // Get lead data to find associated report
    const leadData = await leadsStore.get(leadId);
    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }
    
    const lead = JSON.parse(leadData);
    
    // Delete associated report if requested
    if (deleteReport && lead.reportId) {
      try {
        const reportsStore = getBlobStore(REPORTS_STORE);
        await reportsStore.delete(lead.reportId);
        // Also delete metadata
        await reportsStore.delete(`${lead.reportId}-meta`);
        console.log(`[Delete] Deleted report: ${lead.reportId}`);
      } catch (reportError) {
        console.error(`[Delete] Failed to delete report ${lead.reportId}:`, reportError);
        // Continue with lead deletion even if report deletion fails
      }
    }
    
    // Delete the lead
    await leadsStore.delete(leadId);
    console.log(`[Delete] Deleted audit lead: ${leadId}`);
    
    return { success: true };
  } catch (error) {
    console.error(`[Delete] Failed to delete audit lead ${leadId}:`, error);
    return { success: false, error: 'Deletion failed' };
  }
}

/**
 * Delete survey lead
 */
async function deleteSurveyLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const leadsStore = getBlobStore(SURVEY_LEADS_STORE);

    // Check if lead exists
    const leadData = await leadsStore.get(leadId);
    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    // Delete the lead
    await leadsStore.delete(leadId);
    console.log(`[Delete] Deleted survey lead: ${leadId}`);

    return { success: true };
  } catch (error) {
    console.error(`[Delete] Failed to delete survey lead ${leadId}:`, error);
    return { success: false, error: 'Deletion failed' };
  }
}

/**
 * Delete pricing lead
 */
async function deletePricingLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const leadsStore = getBlobStore(PRICING_LEADS_STORE);

    // Check if lead exists
    const leadData = await leadsStore.get(leadId);
    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }

    // Delete the lead
    await leadsStore.delete(leadId);
    console.log(`[Delete] Deleted pricing lead: ${leadId}`);

    return { success: true };
  } catch (error) {
    console.error(`[Delete] Failed to delete pricing lead ${leadId}:`, error);
    return { success: false, error: 'Deletion failed' };
  }
}

/**
 * Delete contact lead
 */
async function deleteContactLead(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const leadsStore = getBlobStore(CONTACT_LEADS_STORE);
    
    // Check if lead exists
    const leadData = await leadsStore.get(leadId);
    if (!leadData) {
      return { success: false, error: 'Lead not found' };
    }
    
    // Delete the lead
    await leadsStore.delete(leadId);
    console.log(`[Delete] Deleted contact lead: ${leadId}`);
    
    return { success: true };
  } catch (error) {
    console.error(`[Delete] Failed to delete contact lead ${leadId}:`, error);
    return { success: false, error: 'Deletion failed' };
  }
}

/**
 * Update leads index to remove deleted IDs
 */
async function updateLeadsIndex(storeName: string, deletedIds: string[]): Promise<void> {
  try {
    const store = getBlobStore(storeName);
    
    // Get current index
    const indexData = await store.get('_leads_index');
    if (!indexData) {
      console.warn(`[Delete] No leads index found in ${storeName}`);
      return;
    }
    
    const leadsIndex: string[] = JSON.parse(indexData);
    
    // Remove deleted IDs
    const updatedIndex = leadsIndex.filter(id => !deletedIds.includes(id));
    
    // Save updated index
    await store.set('_leads_index', JSON.stringify(updatedIndex));
    
    console.log(`[Delete] Updated index in ${storeName}: removed ${deletedIds.length} IDs`);
  } catch (error) {
    console.error(`[Delete] Failed to update leads index in ${storeName}:`, error);
    // Don't throw - index update failure shouldn't block the operation
  }
}

// Main handler
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": clientConfig.corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
  const responseHeaders = {
    ...corsHeaders,
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  // Only POST allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Authenticate before parsing body (defense-in-depth)
  if (!verifyAdminAuth(event)) {
    return {
      statusCode: 401,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Unauthorized. Invalid password." }),
    };
  }

  try {
    // Parse request body
    const body: DeleteRequest = JSON.parse(event.body || "{}");
    const { leadIds, deleteReports } = body;

    // Validate request
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Missing or invalid leadIds array" }),
      };
    }

    // Cap bulk deletes and validate element types
    if (leadIds.length > 100) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Maximum 100 leads per delete request" }),
      };
    }

    if (!leadIds.every(id => typeof id === 'string' && id.length > 0 && id.length < 200)) {
      return {
        statusCode: 400,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Invalid leadIds: all entries must be non-empty strings" }),
      };
    }

    console.log(`[Delete] Processing deletion of ${leadIds.length} leads (deleteReports: ${deleteReports})`);

    const errors: { leadId: string; error: string }[] = [];
    const deletedAuditIds: string[] = [];
    const deletedContactIds: string[] = [];
    const deletedSurveyIds: string[] = [];
    const deletedPricingIds: string[] = [];

    // Process each lead
    for (const leadId of leadIds) {
      // Determine lead type based on ID prefix
      const isAuditLead = leadId.startsWith('lead-');
      const isContactLead = leadId.startsWith('contact-');
      const isSurveyLead = leadId.startsWith('survey-');
      const isPricingLead = leadId.startsWith('pricing-');

      if (isAuditLead) {
        const result = await deleteAuditLead(leadId, deleteReports);
        if (result.success) {
          deletedAuditIds.push(leadId);
        } else {
          errors.push({ leadId, error: result.error || 'Unknown error' });
        }
      } else if (isContactLead) {
        const result = await deleteContactLead(leadId);
        if (result.success) {
          deletedContactIds.push(leadId);
        } else {
          errors.push({ leadId, error: result.error || 'Unknown error' });
        }
      } else if (isSurveyLead) {
        const result = await deleteSurveyLead(leadId);
        if (result.success) {
          deletedSurveyIds.push(leadId);
        } else {
          errors.push({ leadId, error: result.error || 'Unknown error' });
        }
      } else if (isPricingLead) {
        const result = await deletePricingLead(leadId);
        if (result.success) {
          deletedPricingIds.push(leadId);
        } else {
          errors.push({ leadId, error: result.error || 'Unknown error' });
        }
      } else {
        errors.push({ leadId, error: 'Unknown lead type' });
      }
    }

    // Update indices
    if (deletedAuditIds.length > 0) {
      await updateLeadsIndex(AUDIT_LEADS_STORE, deletedAuditIds);
    }
    if (deletedContactIds.length > 0) {
      await updateLeadsIndex(CONTACT_LEADS_STORE, deletedContactIds);
    }
    if (deletedSurveyIds.length > 0) {
      await updateLeadsIndex(SURVEY_LEADS_STORE, deletedSurveyIds);
    }
    if (deletedPricingIds.length > 0) {
      await updateLeadsIndex(PRICING_LEADS_STORE, deletedPricingIds);
    }

    const totalDeleted = deletedAuditIds.length + deletedContactIds.length + deletedSurveyIds.length + deletedPricingIds.length;

    const response: DeleteResponse = {
      success: true,
      deletedCount: totalDeleted,
      errors
    };

    console.log(`[Delete] Completed: ${totalDeleted} deleted, ${errors.length} errors`);

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error("[Delete] Handler error:", error);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({
        error: "Failed to delete leads",
        details: 'Internal server error'
      }),
    };
  }
};

export { handler };
