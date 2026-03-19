import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import {
  executeDeepResearch,
  generateAgentFallbackReport,
  type AuditFormInputs,
  type ResearchStep
} from "./audit-services/langgraph";
import { generateHTMLReport, type AuditReportData } from "./audit-services/html-report-generator";
import {
  generateAuditNotificationEmailHTML,
  generateAuditNotificationEmailText,
  generateAuditConfirmationEmailHTML,
  generateAuditConfirmationEmailText
} from "./audit-templates";
import { validateFormWithAI } from "./audit-services/ai-field-validator";
import { fetchCompanyBranding, type CompanyBranding } from "./audit-services/branding-fetcher";

// Import shared utilities
import {
  REPORT_BASE_URL,
  NOTIFICATION_RECIPIENTS,
  type AuditFormData,
  type AuditLead,
  getAuditReportStore,
  updateJobStatus,
  initializeJob,
  createProgressCallback,
  generateLeadId,
  storeLead,
  submitToNetlifyForms,
  isValidLanguage,
  validateRequiredFields
} from "./audit-shared";
import { clientConfig } from "./_config/client";

// =============================================================================
// AI AUDIT BACKGROUND HANDLER - Netlify Background Function (15-min timeout)
// =============================================================================
// This is a BACKGROUND FUNCTION that processes audit requests asynchronously.
// It returns 202 Accepted immediately and continues processing in background.
// Frontend polls /api/audit-status to track progress.
//
// Flow:
// 1. Client generates jobId (UUID) and submits form
// 2. This function returns 202 immediately (Netlify behavior)
// 3. Processing continues in background (up to 15 minutes)
// 4. Status updates stored in Blobs for polling
// 5. On completion, emails are sent and report is stored
// =============================================================================

// Re-export types for backwards compatibility
export type { JobStatus, AuditJob, AuditFormData } from "./audit-shared";

// =============================================================================
// MAIN BACKGROUND HANDLER
// =============================================================================

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Note: Background functions automatically return 202 Accepted
  // All processing happens after that response is sent

  console.log('[Background] ========================================');
  console.log('[Background] AUDIT BACKGROUND FUNCTION STARTED');
  console.log('[Background] ========================================');

  // Only accept POST
  if (event.httpMethod !== "POST") {
    console.log('[Background] Rejected: Method not allowed');
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  let jobId: string = '';
  let formData: AuditFormData;

  try {
    // Parse request body
    const parsed = JSON.parse(event.body || "{}");
    jobId = parsed.jobId;

    if (!jobId) {
      console.error('[Background] Missing jobId in request');
      return { statusCode: 400, body: JSON.stringify({ error: "Missing jobId" }) };
    }

    const detectedLanguage = isValidLanguage(parsed.language) ? parsed.language : 'cs';

    formData = {
      email: parsed.email?.trim() || "",
      website: parsed.website?.trim() || "",
      companyName: parsed.companyName?.trim() || "",
      industry: "",
      city: parsed.city?.trim() || "",
      biggestPainPoint: parsed.biggestPainPoint?.trim() || "",
      currentTools: parsed.currentTools?.trim() || "",
      language: detectedLanguage,
      leadSource: parsed.leadSource?.trim() || 'unknown',
      // Traffic source tracking (UTM parameters & click IDs)
      utmSource: parsed.utmSource?.trim() || undefined,
      utmMedium: parsed.utmMedium?.trim() || undefined,
      utmCampaign: parsed.utmCampaign?.trim() || undefined,
      utmContent: parsed.utmContent?.trim() || undefined,
      utmTerm: parsed.utmTerm?.trim() || undefined,
      gclid: parsed.gclid?.trim() || undefined,
      fbclid: parsed.fbclid?.trim() || undefined,
      msclkid: parsed.msclkid?.trim() || undefined,
      referrer: parsed.referrer?.trim() || undefined
    };

    console.log(`[Background] Job ${jobId} - Processing: ${formData.companyName} (${formData.city})`);

    // Initialize job in Blobs
    await initializeJob(jobId, formData);

  } catch (parseError) {
    console.error('[Background] Failed to parse request:', parseError);
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const isCzech = formData.language === 'cs';

  // =========================================================================
  // STEP 1: Basic Validation
  // =========================================================================
  const basicValidation = validateRequiredFields(formData);
  if (!basicValidation.valid) {
    await updateJobStatus(jobId, 'failed', { error: basicValidation.error });
    return { statusCode: 202, body: '' }; // Background functions return 202
  }

  // Check API keys
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;

  if (!RESEND_API_KEY || !TAVILY_API_KEY || !OPENROUTER_API_KEY) {
    const missingKey = !RESEND_API_KEY ? 'RESEND' : !TAVILY_API_KEY ? 'TAVILY' : 'OPENROUTER';
    console.error(`[Background] Missing API key: ${missingKey}`);
    await updateJobStatus(jobId, 'failed', {
      error: isCzech ? 'Konfigurace serveru není dokončena.' : 'Server configuration incomplete.'
    });
    return { statusCode: 202, body: '' };
  }

  // Firecrawl is optional - will use fallback if not available
  if (!FIRECRAWL_API_KEY) {
    console.warn('[Background] FIRECRAWL_API_KEY not configured - company branding will use fallback');
  }

  // =========================================================================
  // STEP 2: AI-Powered Field Validation
  // =========================================================================
  await updateJobStatus(jobId, 'validating', {
    statusMessage: isCzech ? 'Ověřuji zadané údaje...' : 'Validating form data...'
  });

  try {
    const validationResult = await validateFormWithAI(
      {
        website: formData.website,
        email: formData.email,
        companyName: formData.companyName,
        city: formData.city,
        biggestPainPoint: formData.biggestPainPoint,
        currentTools: formData.currentTools,
        language: formData.language
      },
      OPENROUTER_API_KEY
    );

    if (!validationResult.isValid) {
      console.log(`[Background] Job ${jobId} - Validation failed`);
      await updateJobStatus(jobId, 'failed', {
        error: isCzech
          ? 'Některá pole obsahují neplatné údaje.'
          : 'Some fields contain invalid data.',
        validationErrors: validationResult.fields
      });
      return { statusCode: 202, body: '' };
    }

    console.log(`[Background] Job ${jobId} - Validation passed`);
  } catch (validationError) {
    console.error(`[Background] Job ${jobId} - Validation error (continuing):`, validationError);
    // Continue even if validation fails
  }

  // =========================================================================
  // STEP 3: Fetch Company Branding (Firecrawl)
  // =========================================================================
  let companyBranding: CompanyBranding | undefined = undefined;

  if (FIRECRAWL_API_KEY) {
    await updateJobStatus(jobId, 'researching', {
      statusMessage: isCzech ? 'Načítám branding společnosti...' : 'Fetching company branding...',
      progress: 28,
      currentSubStep: 'fetch_branding' as ResearchStep
    });

    try {
      console.log(`[Background] Job ${jobId} - Fetching company branding from Firecrawl...`);
      companyBranding = await fetchCompanyBranding(formData.website, FIRECRAWL_API_KEY);
      console.log(`[Background] Job ${jobId} - Branding fetch complete:`, {
        hasLogo: !!companyBranding.logo,
        hasFavicon: !!companyBranding.favicon,
        hasPrimaryColor: !!companyBranding.primaryColor,
        hasAccentColor: !!companyBranding.accentColor
      });
    } catch (brandingError) {
      console.error(`[Background] Job ${jobId} - Branding fetch failed (continuing):`, brandingError);
      // Continue without branding - not a critical failure
    }
  }

  // =========================================================================
  // STEP 4: Execute LangGraph Deep Research Agent
  // =========================================================================
  await updateJobStatus(jobId, 'researching', {
    statusMessage: isCzech ? 'Provádím hloubkový výzkum...' : 'Conducting deep research...'
  });

  let reportData: AuditReportData;

  const agentInput: AuditFormInputs = {
    website: formData.website,
    companyName: formData.companyName,
    city: formData.city,
    industry: formData.industry,
    biggestPainPoint: formData.biggestPainPoint,
    currentTools: formData.currentTools,
    language: formData.language
  };

  try {
    console.log(`[Background] Job ${jobId} - Starting Deep Research Agent v3 with progress tracking`);

    // Create progress callback for granular status updates
    const progressCallback = createProgressCallback(jobId);

    const agentResult = await executeDeepResearch(
      agentInput,
      TAVILY_API_KEY,
      OPENROUTER_API_KEY,
      progressCallback // Pass the callback for granular progress updates
    );

    if (agentResult.success && agentResult.reportData) {
      reportData = agentResult.reportData;
      console.log(`[Background] Job ${jobId} - Research completed. Report ID: ${reportData.reportId}`);
    } else {
      console.error(`[Background] Job ${jobId} - Agent failed:`, agentResult.error);
      console.log(`[Background] Job ${jobId} - Using fallback report`);
      reportData = generateAgentFallbackReport(agentInput);
    }
  } catch (agentError) {
    console.error(`[Background] Job ${jobId} - Agent exception:`, agentError);
    console.log(`[Background] Job ${jobId} - Using fallback report due to exception`);
    reportData = generateAgentFallbackReport(agentInput);
  }

  // Add company branding to report data
  if (companyBranding) {
    reportData.companyBranding = companyBranding;
    console.log(`[Background] Job ${jobId} - Company branding added to report`);
  }

  // =========================================================================
  // STEP 5: Generate HTML Report
  // =========================================================================
  await updateJobStatus(jobId, 'generating', {
    statusMessage: isCzech ? 'Generuji HTML report...' : 'Generating HTML report...'
  });

  const reportHtml = generateHTMLReport(reportData);
  const reportUrl = `${REPORT_BASE_URL}/${reportData.reportId}`;

  console.log(`[Background] Job ${jobId} - HTML generated. Length: ${reportHtml.length} chars`);

  // =========================================================================
  // STEP 6: Store Report and Lead Data
  // =========================================================================
  await updateJobStatus(jobId, 'storing', {
    statusMessage: isCzech ? 'Ukládám report...' : 'Storing report...'
  });

  try {
    const store = getAuditReportStore();

    // Store the HTML report
    await store.set(reportData.reportId, reportHtml, {
      metadata: {
        companyName: formData.companyName,
        email: formData.email,
        generatedAt: reportData.generatedAt,
        expiresAt: reportData.expiresAt
      }
    });

    // Store metadata separately
    const metadataKey = `${reportData.reportId}-meta`;
    await store.set(metadataKey, JSON.stringify({
      companyName: formData.companyName,
      email: formData.email,
      generatedAt: reportData.generatedAt,
      expiresAt: reportData.expiresAt
    }));

    console.log(`[Background] Job ${jobId} - Report stored in Blobs`);
  } catch (blobError) {
    console.error(`[Background] Job ${jobId} - Blob storage failed:`, blobError);
    // Continue anyway - emails might still work
  }

  // Store lead data
  const leadData: AuditLead = {
    id: generateLeadId(),
    email: formData.email,
    companyName: formData.companyName,
    website: formData.website,
    city: formData.city,
    biggestPainPoint: formData.biggestPainPoint,
    currentTools: formData.currentTools,
    language: formData.language,
    reportId: reportData.reportId,
    reportUrl: reportUrl,
    submittedAt: new Date().toISOString(),
    detectedIndustry: reportData.companyProfile?.detectedIndustry,
    leadSource: formData.leadSource || 'unknown', // Track conversion source
    // Traffic source tracking
    utmSource: formData.utmSource,
    utmMedium: formData.utmMedium,
    utmCampaign: formData.utmCampaign,
    utmContent: formData.utmContent,
    utmTerm: formData.utmTerm,
    gclid: formData.gclid,
    fbclid: formData.fbclid,
    msclkid: formData.msclkid,
    referrer: formData.referrer
  };

  await storeLead(leadData);
  await submitToNetlifyForms(formData);

  // =========================================================================
  // STEP 7: Send Emails
  // =========================================================================
  await updateJobStatus(jobId, 'emailing', {
    statusMessage: isCzech ? 'Odesílám emaily...' : 'Sending emails...'
  });

  // Send notification to team
  try {
    const notificationHtml = generateAuditNotificationEmailHTML(formData, reportData.reportId, reportUrl);
    const notificationText = generateAuditNotificationEmailText(formData, reportData.reportId, reportUrl);

    const notificationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: clientConfig.notifications.fromAddress,
        to: NOTIFICATION_RECIPIENTS,
        reply_to: formData.email,
        subject: isCzech
          ? `Nový lead: AI Předběžný audit - ${formData.companyName || formData.website}`
          : `Lead: AI Preliminary Audit - ${formData.companyName || formData.website}`,
        html: notificationHtml,
        text: notificationText,
      }),
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json().catch(() => ({}));
      console.error(`[Background] Job ${jobId} - Team notification failed:`, errorData);
    } else {
      console.log(`[Background] Job ${jobId} - Team notification sent`);
    }
  } catch (notifError) {
    console.error(`[Background] Job ${jobId} - Team notification exception:`, notifError);
  }

  // Send confirmation to user
  try {
    const confirmationHtml = generateAuditConfirmationEmailHTML(formData, reportData.reportId, reportUrl);
    const confirmationText = generateAuditConfirmationEmailText(formData, reportData.reportId, reportUrl);

    const confirmationSubject = isCzech
      ? `AI Předběžný audit pro ${formData.companyName || formData.website}`
      : `AI Preliminary audit for ${formData.companyName || formData.website}`;

    const confirmationResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: clientConfig.notifications.fromAddress,
        to: formData.email,
        subject: confirmationSubject,
        html: confirmationHtml,
        text: confirmationText
      }),
    });

    if (!confirmationResponse.ok) {
      const errorData = await confirmationResponse.json().catch(() => ({}));
      console.error(`[Background] Job ${jobId} - User confirmation failed:`, errorData);
    } else {
      console.log(`[Background] Job ${jobId} - User confirmation sent`);
    }
  } catch (confError) {
    console.error(`[Background] Job ${jobId} - User confirmation exception:`, confError);
  }

  // =========================================================================
  // STEP 8: Mark Job Complete
  // =========================================================================
  await updateJobStatus(jobId, 'completed', {
    statusMessage: isCzech ? 'Audit dokončen!' : 'Audit completed!',
    reportId: reportData.reportId,
    reportUrl: reportUrl
  });

  console.log(`[Background] ========================================`);
  console.log(`[Background] Job ${jobId} COMPLETED SUCCESSFULLY`);
  console.log(`[Background] Company: ${formData.companyName}`);
  console.log(`[Background] Report: ${reportUrl}`);
  console.log(`[Background] ========================================`);

  // Background functions return 202 automatically
  return { statusCode: 202, body: '' };
};

export { handler };
