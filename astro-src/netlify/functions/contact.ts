import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  generateNotificationEmailHTML,
  generateNotificationEmailText,
  generateConfirmationEmailHTML,
  generateConfirmationEmailText,
  SERVICE_LABELS_CS,
  SERVICE_LABELS_EN,
  type ContactFormData,
  type EmailLanguage
} from "./email-templates";
import { clientConfig } from "./_config/client";

// =============================================================================
// CONTACT FORM HANDLER - Netlify Function
// =============================================================================
// Receives form submissions via AJAX, sends notification to team and 
// confirmation to the user. Uses Resend for email delivery.
// Also stores leads in Netlify Blobs and submits to Netlify Forms.
// =============================================================================

// Blob store name for contact leads
const CONTACT_LEADS_STORE = "contact-leads";

// Recipients for notification emails
const NOTIFICATION_RECIPIENTS = clientConfig.notifications.recipients;

// Contact lead interface for persistent storage
interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  service?: string;
  budget_onetime?: string;
  budget_monthly?: string;
  message?: string;
  language: 'cs' | 'en';
  submittedAt: string;
  source: 'contact';
  leadSource?: string;
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

/**
 * Get Netlify Blobs store for contact leads
 */
function getContactLeadsStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  
  if (!siteID || !token) {
    console.warn('[Blobs] Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN environment variables');
    return null;
  }
  
  return getStore({
    name: CONTACT_LEADS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

/**
 * Generate unique lead ID
 */
function generateLeadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `contact-${timestamp}-${random}`;
}

/**
 * Store contact lead data persistently in Netlify Blobs
 */
async function storeContactLead(lead: ContactLead): Promise<void> {
  try {
    const store = getContactLeadsStore();
    if (!store) {
      console.warn('[Blobs] Store not available, skipping lead storage');
      return;
    }
    
    // Store individual lead
    await store.set(lead.id, JSON.stringify(lead), {
      metadata: {
        email: lead.email,
        name: lead.name,
        submittedAt: lead.submittedAt
      }
    });
    
    // Also update leads index for easy retrieval
    let leadsIndex: string[] = [];
    try {
      const existingIndex = await store.get('_leads_index');
      if (existingIndex) {
        leadsIndex = JSON.parse(existingIndex);
      }
    } catch {
      // Index doesn't exist yet, start fresh
    }
    
    leadsIndex.unshift(lead.id); // Add new lead at beginning
    await store.set('_leads_index', JSON.stringify(leadsIndex));
    
    console.log(`[Contact Leads] Lead stored successfully: ${lead.id}`);
  } catch (error) {
    console.error('[Contact Leads] Failed to store lead:', error);
    // Don't throw - lead storage failure shouldn't break the contact flow
  }
}

/**
 * Submit form data to Netlify Forms for dashboard visibility
 */
async function submitToNetlifyForms(formData: ContactFormData): Promise<void> {
  try {
    const formBody = new URLSearchParams({
      'form-name': 'contact',
      'name': formData.name,
      'email': formData.email,
      'phone': formData.phone || '',
      'website': formData.website || '',
      'service': formData.service || '',
      'budget_onetime': formData.budget_onetime || '',
      'budget_monthly': formData.budget_monthly || '',
      'message': formData.message || '',
      'language': formData.language || 'cs'
    });

    const response = await fetch(`${clientConfig.siteUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString()
    });

    if (response.ok) {
      console.log('[Netlify Forms] Contact form submission recorded successfully');
    } else {
      console.warn(`[Netlify Forms] Submission returned status ${response.status}`);
    }
  } catch (error) {
    console.error('[Netlify Forms] Failed to submit to Netlify Forms:', error);
    // Don't throw - Netlify Forms failure shouldn't break the contact flow
  }
}

// Main handler function
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers for frontend
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    // Parse form data
    let formData: ContactFormData;
    const contentType = event.headers["content-type"] || "";
    
    if (contentType.includes("application/json")) {
      formData = JSON.parse(event.body || "{}");
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(event.body || "");
      const langParam = params.get("language");
      formData = {
        name: params.get("name") || "",
        email: params.get("email") || "",
        phone: params.get("phone") || undefined,
        website: params.get("website") || undefined,
        service: params.get("service") || undefined,
        budget_onetime: params.get("budget_onetime") || undefined,
        budget_monthly: params.get("budget_monthly") || undefined,
        message: params.get("message") || undefined,
        language: (langParam === 'en' || langParam === 'cs') ? langParam : undefined,
      };
    } else {
      formData = JSON.parse(event.body || "{}");
    }

    // Validate required fields
    if (!formData.name || !formData.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: "Jméno a e-mail jsou povinné údaje." 
        }),
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: "Zadejte prosím platnou e-mailovou adresu." 
        }),
      };
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: "Konfigurace e-mailu není dokončena. Kontaktujte nás prosím přímo." 
        }),
      };
    }

    // Determine language for bilingual support
    const lang: EmailLanguage = (formData.language === 'en' || formData.language === 'cs') 
      ? formData.language 
      : 'cs';
    
    // Get service label for notification (always Czech for internal team)
    const serviceLabel = SERVICE_LABELS_CS[formData.service || ''] || 'Obecný dotaz';

    // 1. SEND NOTIFICATION TO TEAM
    const notificationHtml = generateNotificationEmailHTML(formData);
    const notificationText = generateNotificationEmailText(formData);

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
        subject: `🆕 Nový zájemce: ${formData.name} – ${serviceLabel}`,
        html: notificationHtml,
        text: notificationText,
      }),
    });

    if (!notificationResponse.ok) {
      const errorData = await notificationResponse.json();
      console.error("Resend notification error:", errorData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu." 
        }),
      };
    }

    // 2. STORE LEAD IN BLOBS & SUBMIT TO NETLIFY FORMS
    const contactLead: ContactLead = {
      id: generateLeadId(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      service: formData.service,
      budget_onetime: formData.budget_onetime,
      budget_monthly: formData.budget_monthly,
      message: formData.message,
      language: lang,
      submittedAt: new Date().toISOString(),
      source: 'contact',
      leadSource: formData.leadSource || 'contact-page-form',
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
    
    // Store in Blobs (non-blocking)
    await storeContactLead(contactLead);
    
    // Submit to Netlify Forms for dashboard visibility (non-blocking)
    await submitToNetlifyForms(formData);

    // 3. SEND CONFIRMATION TO USER
    // Must await in serverless environments to prevent premature termination
    // Subject is bilingual based on user's language preference.
    // Uses clientConfig.email overrides when configured, otherwise falls back to defaults.
    const defaultConfirmationSubjectEn = `Confirmation: Your inquiry to ${clientConfig.company.name} has been received`;
    const defaultConfirmationSubjectCs = `Potvrzení: Vaše poptávka pro ${clientConfig.company.name} byla přijata`;
    const confirmationSubject = lang === 'en'
      ? clientConfig.email?.leadConfirm?.subject?.en || defaultConfirmationSubjectEn
      : clientConfig.email?.leadConfirm?.subject?.cs || defaultConfirmationSubjectCs;

    try {
      const confirmationHtml = generateConfirmationEmailHTML(formData);
      const confirmationText = generateConfirmationEmailText(formData);

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
          text: confirmationText,
        }),
      });

      if (!confirmationResponse.ok) {
        const errorData = await confirmationResponse.json();
        console.error("Confirmation email failed (non-blocking):", errorData);
      }
    } catch (confError) {
      console.error("Error sending confirmation email (non-blocking):", confError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: "Zpráva byla úspěšně odeslána!" 
      }),
    };

  } catch (error) {
    console.error("Contact form handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: "Došlo k neočekávané chybě. Zkuste to prosím znovu." 
      }),
    };
  }
};

export { handler };
