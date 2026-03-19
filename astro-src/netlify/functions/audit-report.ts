// =============================================================================
// AUDIT REPORT FUNCTION - Serve HTML Reports from Netlify Blobs
// =============================================================================
// This function serves pre-generated HTML audit reports stored in Netlify Blobs.
// URL format: /report/{reportId}
// Reports expire after 30 days.
// =============================================================================

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { clientConfig } from "./_config/client";

// Store name for audit reports
const REPORTS_STORE = "audit-reports";

// Report metadata interface
interface ReportMetadata {
  companyName: string;
  generatedAt: string;
  expiresAt: string;
  email: string;
}

/**
 * Get Netlify Blobs store with proper configuration
 * Uses environment variables for authentication
 */
function getAuditReportStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;
  
  if (!siteID || !token) {
    console.warn('[Blobs] Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN environment variables');
    throw new Error('Netlify Blobs not configured. Set NETLIFY_SITE_ID and NETLIFY_API_TOKEN.');
  }
  
  return getStore({
    name: REPORTS_STORE,
    siteID,
    token,
    consistency: "strong"
  });
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Common headers for all responses
  const baseHeaders: { [header: string]: string } = {
    "Content-Type": "text/html; charset=utf-8"
  };

  // Extract report ID from path
  // Expected path: /report/{reportId} or /.netlify/functions/audit-report/{reportId}
  const pathSegments = event.path.split('/').filter(Boolean);
  const reportId = pathSegments[pathSegments.length - 1];

  // Validate report ID
  if (!reportId || reportId === 'audit-report' || reportId === 'report') {
    return {
      statusCode: 400,
      headers: baseHeaders,
      body: generateErrorPage("Invalid Report ID", "cs"),
    };
  }

  console.log(`[AuditReport] Fetching report: ${reportId}`);

  try {
    // Get the blob store with proper configuration
    const store = getAuditReportStore();

    // Try to fetch the report HTML
    const reportHtml = await store.get(reportId, { type: "text" });

    if (!reportHtml) {
      console.log(`[AuditReport] Report not found: ${reportId}`);
      return {
        statusCode: 404,
        headers: baseHeaders,
        body: generateErrorPage("Report Not Found", "cs"),
      };
    }

    // Try to get metadata to check expiration
    const metadataKey = `${reportId}-meta`;
    const metadataJson = await store.get(metadataKey, { type: "text" });
    
    if (metadataJson) {
      try {
        const metadata: ReportMetadata = JSON.parse(metadataJson);
        const expiresAt = new Date(metadata.expiresAt);
        
        if (new Date() > expiresAt) {
          console.log(`[AuditReport] Report expired: ${reportId}`);
          // Delete expired report
          await store.delete(reportId);
          await store.delete(metadataKey);
          
          return {
            statusCode: 410, // Gone
            headers: baseHeaders,
            body: generateExpiredPage("cs"),
          };
        }
      } catch (e) {
        console.warn(`[AuditReport] Failed to parse metadata for ${reportId}:`, e);
      }
    }

    console.log(`[AuditReport] Serving report: ${reportId}`);

    return {
      statusCode: 200,
      headers: {
        ...baseHeaders,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Report-ID": reportId,
      },
      body: reportHtml,
    };

  } catch (error) {
    console.error(`[AuditReport] Error fetching report ${reportId}:`, error);
    
    return {
      statusCode: 500,
      headers: baseHeaders,
      body: generateErrorPage("Server Error", "cs"),
    };
  }
};

/**
 * Generate error page HTML
 */
function generateErrorPage(errorType: string, lang: 'cs' | 'en'): string {
  const isCs = lang === 'cs';
  
  const content = {
    notFound: {
      title: isCs ? 'Report nenalezen' : 'Report Not Found',
      message: isCs 
        ? 'Tento report neexistuje nebo byl odstraněn.' 
        : 'This report does not exist or has been removed.',
    },
    invalid: {
      title: isCs ? 'Neplatné ID reportu' : 'Invalid Report ID',
      message: isCs 
        ? 'Zadané ID reportu není platné.' 
        : 'The provided report ID is not valid.',
    },
    error: {
      title: isCs ? 'Chyba serveru' : 'Server Error',
      message: isCs 
        ? 'Došlo k neočekávané chybě. Zkuste to prosím později.' 
        : 'An unexpected error occurred. Please try again later.',
    }
  };

  const c = errorType === 'Report Not Found' ? content.notFound :
            errorType === 'Invalid Report ID' ? content.invalid :
            content.error;

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.title} | ${clientConfig.company.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A0A0A;
      color: #E5E5E5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 40px;
    }
    .logo {
      height: 50px;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 16px;
      color: #EF4444;
    }
    p {
      color: #A3A3A3;
      margin-bottom: 32px;
    }
    a {
      display: inline-block;
      padding: 12px 24px;
      background: #00A39A;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
    a:hover { background: #008f87; }
  </style>
</head>
<body>
  <div class="container">
    <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" class="logo">
    <h1>${c.title}</h1>
    <p>${c.message}</p>
    <a href="${clientConfig.siteUrl}/audit">${isCs ? 'Vytvořit nový audit' : 'Create new audit'}</a>
  </div>
</body>
</html>`;
}

/**
 * Generate expired report page HTML
 */
function generateExpiredPage(lang: 'cs' | 'en'): string {
  const isCs = lang === 'cs';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isCs ? 'Report vypršel' : 'Report Expired'} | ${clientConfig.company.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0A0A0A;
      color: #E5E5E5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 40px;
      max-width: 500px;
    }
    .logo {
      height: 50px;
      margin-bottom: 40px;
    }
    .icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 16px;
      color: #F97316;
    }
    p {
      color: #A3A3A3;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    a {
      display: inline-block;
      padding: 12px 24px;
      background: #00A39A;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
    a:hover { background: #008f87; }
    a.secondary {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
    }
    a.secondary:hover {
      background: rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" class="logo">
    <div class="icon">⏰</div>
    <h1>${isCs ? 'Report vypršel' : 'Report Expired'}</h1>
    <p>${isCs
      ? 'Tento report byl dostupný po dobu 30 dní a jeho platnost již vypršela. Můžete si vytvořit nový audit nebo nás kontaktovat pro další informace.'
      : 'This report was available for 30 days and has now expired. You can create a new audit or contact us for more information.'}</p>
    <div class="buttons">
      <a href="${clientConfig.siteUrl}/audit">${isCs ? 'Nový audit' : 'New Audit'}</a>
      <a href="${clientConfig.primaryContact.calendarUrl || ''}" class="secondary">${isCs ? 'Konzultace' : 'Consultation'}</a>
    </div>
  </div>
</body>
</html>`;
}

export { handler };
