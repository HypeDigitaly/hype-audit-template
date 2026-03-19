import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { verifyAdminAuth } from "./onboarding-shared/auth";
import { clientConfig } from "./_config/client";

// =============================================================================
// ADMIN LEADS API - Netlify Function
// =============================================================================
// Provides API endpoint for fetching all leads from Netlify Blobs
// Used by the admin dashboard at /admin/leads
// Protected by simple password authentication
// =============================================================================

// Store names
const AUDIT_LEADS_STORE = "audit-leads";
const CONTACT_LEADS_STORE = "contact-leads";
const SURVEY_LEADS_STORE = "survey-leads";
const ONBOARDING_LEADS_STORE = "onboarding-leads";
const PRICING_LEADS_STORE = "pricing-leads";

// Lead interfaces
interface AuditLead {
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
  source?: 'audit';
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

interface SurveyLead {
  id: string;
  source: 'survey';
  email: string;
  companyName: string;
  industry: string;
  companySize: string;
  painPoints: string[];
  primaryPainPoint: string;
  aiMaturity: string;
  hoursLostPerWeek: string;
  contextNote: string;
  language: 'cs' | 'en';
  submittedAt: string;
  leadSource: string;
  city?: string;
  phoneNumber?: string;
  toolsUsed?: string[];
  websiteUrl?: string;
  respondentRole?: string;
  biggestManualProcess?: string;
  crmUsed?: string;
  erpUsed?: string;
  manualWorkPercentage?: string;
  techOpenness?: string;
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

interface OnboardingLeadSummary {
  id: string;
  source: 'onboarding';
  companyName: string;
  contactPersonEmail: string;
  contactPersonName: string;
  selectedPackage: 'starter' | 'professional' | 'enterprise';
  ico: string;
  city: string;
  website: string;
  status: string;
  driveFolder?: string;
  isPandaDocSigned?: boolean;
  submittedAt: string; // maps to createdAt
  numSalespeople: number;
  dailyVolume: string;
  channels: string[];
}

interface PricingLeadSummary {
  id: string;
  source: 'pricing-calculator';
  name: string;
  email: string;
  companyName: string;
  language: 'cs' | 'en';
  submittedAt: string;
  calculatorState: Record<string, unknown>;
  calculatorResults: Record<string, unknown>;
}

type Lead = (AuditLead & { source: 'audit' }) | ContactLead | SurveyLead | OnboardingLeadSummary | PricingLeadSummary;

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
 * Fetch all leads from a store
 */
async function fetchLeadsFromStore(storeName: string, source: 'audit' | 'contact' | 'survey' | 'onboarding' | 'pricing-calculator'): Promise<Lead[]> {
  try {
    const store = getBlobStore(storeName);

    // Get the leads index
    const indexData = await store.get('_leads_index');
    if (!indexData) {
      return [];
    }

    const leadIds: string[] = JSON.parse(indexData);
    const leads: Lead[] = [];

    // Fetch each lead (in parallel for speed)
    const leadPromises = leadIds.map(async (id) => {
      try {
        const leadData = await store.get(id);
        if (leadData) {
          const lead = JSON.parse(leadData);

          // For onboarding leads, extract only summary fields
          if (source === 'onboarding') {
            const summary: OnboardingLeadSummary = {
              id: lead.id || id,
              source: 'onboarding',
              companyName: lead.companyName || '',
              contactPersonEmail: lead.contactPersonEmail || lead.email || '',
              contactPersonName: lead.contactPersonName || lead.contactName || '',
              selectedPackage: lead.selectedPackage || 'starter',
              ico: lead.ico || lead.ICO || '',
              city: lead.city || '',
              website: lead.website || lead.websiteUrl || '',
              status: lead.status || 'submitted',
              driveFolder: lead.driveFolder,
              isPandaDocSigned: lead.isPandaDocSigned,
              submittedAt: lead.createdAt || lead.submittedAt || new Date().toISOString(),
              numSalespeople: lead.numSalespeople || 0,
              dailyVolume: lead.dailyVolume || '',
              channels: Array.isArray(lead.channels) ? lead.channels : [],
            };
            return summary as Lead;
          }

          // For pricing-calculator leads, extract only summary fields
          if (source === 'pricing-calculator') {
            const summary: PricingLeadSummary = {
              id: lead.id || id,
              source: 'pricing-calculator',
              name: lead.name || '',
              email: lead.email || '',
              companyName: lead.companyName || '',
              language: lead.language || 'cs',
              submittedAt: lead.submittedAt || new Date().toISOString(),
              calculatorState: lead.calculatorState || {},
              calculatorResults: lead.calculatorResults || {},
            };
            return summary as Lead;
          }

          return { ...lead, source } as Lead;
        }
      } catch (e) {
        console.warn(`Failed to fetch lead ${id}:`, e);
      }
      return null;
    });

    const results = await Promise.all(leadPromises);
    return results.filter((lead): lead is Lead => lead !== null);
  } catch (error) {
    console.error(`Failed to fetch leads from ${storeName}:`, error);
    return [];
  }
}

// Main handler
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": clientConfig.corsOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  // Only GET allowed
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Constant-time password authentication via header
  if (!verifyAdminAuth(event)) {
    return {
      statusCode: 401,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Unauthorized. Invalid password." }),
    };
  }

  try {
    // Fetch leads from all stores
    const [auditLeads, contactLeads, surveyLeads, onboardingLeads, pricingLeads] = await Promise.all([
      fetchLeadsFromStore(AUDIT_LEADS_STORE, 'audit'),
      fetchLeadsFromStore(CONTACT_LEADS_STORE, 'contact'),
      fetchLeadsFromStore(SURVEY_LEADS_STORE, 'survey'),
      fetchLeadsFromStore(ONBOARDING_LEADS_STORE, 'onboarding'),
      fetchLeadsFromStore(PRICING_LEADS_STORE, 'pricing-calculator'),
    ]);

    // Combine and sort by submittedAt (newest first)
    const allLeads = [...auditLeads, ...contactLeads, ...surveyLeads, ...onboardingLeads, ...pricingLeads].sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    // Parse query params for filtering
    const { source, search, from, to } = event.queryStringParameters || {};
    const leadSource = event.queryStringParameters?.leadSource || '';

    let filteredLeads = allLeads;

    // Filter by source
    if (source && ['audit', 'contact', 'survey', 'onboarding', 'pricing-calculator'].includes(source)) {
      filteredLeads = filteredLeads.filter(lead => lead.source === source);
    }

    // Filter by leadSource (strict equality)
    if (leadSource) {
      filteredLeads = filteredLeads.filter(lead => (lead as { leadSource?: string }).leadSource === leadSource);
    }

    // Filter by date range
    if (from) {
      const fromDate = new Date(from);
      filteredLeads = filteredLeads.filter(lead => new Date(lead.submittedAt) >= fromDate);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // Include the entire "to" day
      filteredLeads = filteredLeads.filter(lead => new Date(lead.submittedAt) <= toDate);
    }

    // Filter by search term (email, company name, name)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead => {
        const emailMatch = ('email' in lead ? (lead.email as string) : (lead as OnboardingLeadSummary).contactPersonEmail || '').toLowerCase().includes(searchLower);
        const companyMatch = 'companyName' in lead && (lead.companyName as string)?.toLowerCase().includes(searchLower);
        const nameMatch = 'name' in lead && (lead as ContactLead).name?.toLowerCase().includes(searchLower);
        const websiteMatch = 'website' in lead && (lead as { website?: string }).website?.toLowerCase().includes(searchLower);
        return emailMatch || companyMatch || nameMatch || websiteMatch;
      });
    }

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({
        success: true,
        total: filteredLeads.length,
        totalAudit: filteredLeads.filter(l => l.source === 'audit').length,
        totalContact: filteredLeads.filter(l => l.source === 'contact').length,
        totalSurvey: filteredLeads.filter(l => l.source === 'survey').length,
        totalOnboarding: filteredLeads.filter(l => l.source === 'onboarding').length,
        totalPricing: filteredLeads.filter(l => l.source === 'pricing-calculator').length,
        totalGcEvent: filteredLeads.filter(l => (l as { leadSource?: string }).leadSource === 'gc-event-page').length,
        leads: filteredLeads
      }),
    };

  } catch (error) {
    console.error("[Admin Leads] Error:", error);
    return {
      statusCode: 500,
      headers: responseHeaders,
      body: JSON.stringify({
        error: "Failed to fetch leads",
        details: 'Internal server error'
      }),
    };
  }
};

export { handler };
