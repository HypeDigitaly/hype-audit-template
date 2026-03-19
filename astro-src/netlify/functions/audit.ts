import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import {
  executeDeepResearch,
  generateAgentFallbackReport,
  type AuditFormInputs
} from "./audit-services/langgraph";
import { generateHTMLReport, type AuditReportData } from "./audit-services/html-report-generator";
import {
  generateAuditNotificationEmailHTML,
  generateAuditNotificationEmailText,
  generateAuditConfirmationEmailHTML,
  generateAuditConfirmationEmailText
} from "./audit-templates";
import { validateFormWithAI } from "./audit-services/ai-field-validator";

// Import shared utilities
import {
  REPORT_BASE_URL,
  NOTIFICATION_RECIPIENTS,
  type AuditFormData,
  type AuditLead,
  getAuditReportStore,
  generateLeadId,
  storeLead,
  submitToNetlifyForms,
  isValidLanguage,
  validateRequiredFields
} from "./audit-shared";
import { clientConfig } from "./_config/client";

// =============================================================================
// AI AUDIT HANDLER - Netlify Function (LangGraph Deep Research Agent v2)
// =============================================================================
// Orchestrates the automated AI deep research audit workflow:
// 1. Receives form data (simplified: 6 fields)
// 2. Executes LangGraph Deep Research Agent with Tavily Web Search
// 3. Generates HTML report and stores in Netlify Blobs
// 4. Sends emails via Resend with link to report (no PDF attachment)
// =============================================================================

// Re-export types for backwards compatibility
export type { AuditFormData } from "./audit-shared";

// Main handler function
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  // Determine language early for error messages
  let detectedLanguage: 'cs' | 'en' = 'cs';

  try {
    // Parse form data
    let formData: AuditFormData;
    const contentType = event.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      const parsed = JSON.parse(event.body || "{}");
      detectedLanguage = isValidLanguage(parsed.language) ? parsed.language : 'cs';

      formData = {
        email: parsed.email?.trim() || "",
        website: parsed.website?.trim() || "",
        companyName: parsed.companyName?.trim() || "",
        industry: "", // Auto-detected by agent
        city: parsed.city?.trim() || "",
        biggestPainPoint: parsed.biggestPainPoint?.trim() || "",
        currentTools: parsed.currentTools?.trim() || "",
        language: detectedLanguage,
        leadSource: parsed.leadSource?.trim() || 'unknown',
        // Traffic source tracking
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
    } else {
      const params = new URLSearchParams(event.body || "");
      const langParam = params.get("language");
      detectedLanguage = isValidLanguage(langParam) ? langParam : 'cs';

      formData = {
        email: params.get("email")?.trim() || "",
        website: params.get("website")?.trim() || "",
        companyName: params.get("companyName")?.trim() || "",
        industry: "", // Auto-detected by agent
        city: params.get("city")?.trim() || "",
        biggestPainPoint: params.get("biggestPainPoint")?.trim() || "",
        currentTools: params.get("currentTools")?.trim() || "",
        language: detectedLanguage,
        leadSource: params.get("leadSource")?.trim() || 'unknown',
        // Traffic source tracking
        utmSource: params.get("utmSource")?.trim() || undefined,
        utmMedium: params.get("utmMedium")?.trim() || undefined,
        utmCampaign: params.get("utmCampaign")?.trim() || undefined,
        utmContent: params.get("utmContent")?.trim() || undefined,
        utmTerm: params.get("utmTerm")?.trim() || undefined,
        gclid: params.get("gclid")?.trim() || undefined,
        fbclid: params.get("fbclid")?.trim() || undefined,
        msclkid: params.get("msclkid")?.trim() || undefined,
        referrer: params.get("referrer")?.trim() || undefined
      };
    }

    // Validate required fields
    const isCzech = formData.language === 'cs';
    const validation = validateRequiredFields(formData);

    if (!validation.valid) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: validation.error }),
      };
    }

    // Check API keys
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("[Audit] RESEND_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: isCzech
            ? "Konfigurace e-mailu není dokončena."
            : "Email configuration is not complete."
        }),
      };
    }

    if (!TAVILY_API_KEY) {
      console.error("[Audit] TAVILY_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: isCzech
            ? "Konfigurace vyhledávání není dokončena."
            : "Search configuration is not complete."
        }),
      };
    }

    if (!OPENROUTER_API_KEY) {
      console.error("[Audit] OPENROUTER_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: isCzech
            ? "Konfigurace AI není dokončena."
            : "AI configuration is not complete."
        }),
      };
    }

    console.log(`[Audit] Starting Deep Research Agent v2 for: ${formData.companyName} (${formData.city})`);
    console.log(`[Audit] Form Data: ${JSON.stringify({ ...formData, email: 'redacted' })}`);

    // =========================================================================
    // STEP 0.5: AI-Powered Field Validation
    // =========================================================================
    console.log("[Audit] STEP 0.5: Running AI validation on form fields...");

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
        console.log("[Audit] Validation failed:", JSON.stringify(validationResult.fields));
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: isCzech
              ? "Některá pole obsahují neplatné údaje. Zkontrolujte prosím formulář."
              : "Some fields contain invalid data. Please check the form.",
            validationErrors: validationResult.fields
          }),
        };
      }

      console.log("[Audit] AI validation passed ✓");
    } catch (validationError) {
      console.error("[Audit] AI validation error (continuing anyway):", validationError);
      // Continue with audit even if validation fails
    }

    // =========================================================================
    // STEP 1: Execute LangGraph Deep Research Agent
    // =========================================================================
    console.log("[Audit] STEP 1: Executing LangGraph Deep Research Agent...");

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
      const agentResult = await executeDeepResearch(
        agentInput,
        TAVILY_API_KEY,
        OPENROUTER_API_KEY
      );

      if (agentResult.success && agentResult.reportData) {
        reportData = agentResult.reportData;
        console.log(`[Audit] Deep Research Agent completed. Report ID: ${reportData.reportId}`);
      } else {
        console.error("[Audit] Agent failed:", agentResult.error);
        console.log("[Audit] Using fallback report");
        reportData = generateAgentFallbackReport(agentInput);
      }
    } catch (agentError) {
      console.error("[Audit] Agent exception:", agentError);
      console.log("[Audit] Using fallback report due to exception");
      reportData = generateAgentFallbackReport(agentInput);
    }

    // =========================================================================
    // STEP 2: Generate HTML Report and Store in Blobs
    // =========================================================================
    console.log("[Audit] STEP 2: Generating HTML report and storing in Blobs...");

    const reportHtml = generateHTMLReport(reportData);
    const reportUrl = `${REPORT_BASE_URL}/${reportData.reportId}`;

    console.log(`[Audit] HTML report generated. Length: ${reportHtml.length} chars`);
    console.log(`[Audit] Report URL: ${reportUrl}`);

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

      // Store metadata separately for easy expiration checking
      const metadataKey = `${reportData.reportId}-meta`;
      await store.set(metadataKey, JSON.stringify({
        companyName: formData.companyName,
        email: formData.email,
        generatedAt: reportData.generatedAt,
        expiresAt: reportData.expiresAt
      }));

      console.log(`[Audit] Report stored in Blobs. ID: ${reportData.reportId}`);
    } catch (blobError) {
      console.error("[Audit] Failed to store report in Blobs:", blobError);
      // Continue anyway - the report won't be accessible but we can still notify
    }

    // =========================================================================
    // STEP 2.5: Store Lead Data Persistently
    // =========================================================================
    console.log("[Audit] STEP 2.5: Storing lead data...");

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
      leadSource: formData.leadSource || 'unknown',
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

    // Also submit to Netlify Forms for dashboard visibility
    await submitToNetlifyForms(formData);

    // =========================================================================
    // STEP 3: Send Notification Email to Team
    // =========================================================================
    console.log("[Audit] STEP 3: Sending notification email to team...");
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
      console.error("[Audit] Notification email failed:", errorData);
    } else {
      console.log("[Audit] Notification email sent");
    }

    // =========================================================================
    // STEP 4: Send Confirmation Email with Report Link to User
    // =========================================================================
    console.log("[Audit] STEP 4: Sending confirmation email with report link...");
    const confirmationHtml = generateAuditConfirmationEmailHTML(formData, reportData.reportId, reportUrl);
    const confirmationText = generateAuditConfirmationEmailText(formData, reportData.reportId, reportUrl);

    const confirmationSubject = isCzech
      ? `AI Předběžný audit pro ${formData.companyName || formData.website}`
      : `AI Preliminary audit for ${formData.companyName || formData.website}`;

    try {
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
        console.error("[Audit] Confirmation email failed:", errorData);
      } else {
        console.log("[Audit] Confirmation email with report link sent successfully");
      }
    } catch (confError) {
      console.error("[Audit] Confirmation email exception:", confError);
    }

    console.log(`[Audit] AI Audit v2 completed for: ${formData.companyName}. Report ID: ${reportData.reportId}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: isCzech
          ? "Váš Hloubkový AI Audit byl úspěšně odeslán na váš e-mail!"
          : "Your Deep AI Audit has been sent to your email!"
      }),
    };

  } catch (error) {
    console.error("[Audit] Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: detectedLanguage === 'cs'
          ? "Došlo k neočekávané chybě. Zkuste to prosím znovu."
          : "An unexpected error occurred. Please try again."
      }),
    };
  }
};

export { handler };
