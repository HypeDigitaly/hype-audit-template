// =============================================================================
// HEADER SECTION - Report header with logo and actions
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { clientConfig } from '../../../_config/client';

export function generateHeader(data: AuditReportData, t: Translations): string {
  const generatedDate = new Date(data.generatedAt).toLocaleDateString(
    data.language === 'cs' ? 'cs-CZ' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  // Get company logo with fallback chain
  let logoUrl = clientConfig.brand.logoUrl; // Final fallback
  let logoAlt = clientConfig.company.name;

  if (data.companyBranding) {
    // Priority: logo → favicon → Google favicon
    if (data.companyBranding.logo) {
      logoUrl = data.companyBranding.logo;
      logoAlt = data.companyProfile.name;
    } else if (data.companyBranding.favicon) {
      logoUrl = data.companyBranding.favicon;
      logoAlt = data.companyProfile.name;
    } else {
      // Try Google favicon as last resort before brand logo
      try {
        const url = new URL(data.companyProfile.website.startsWith('http') ? data.companyProfile.website : `https://${data.companyProfile.website}`);
        const domain = url.hostname.replace(/^www\./, '');
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        logoAlt = data.companyProfile.name;
      } catch {
        // Keep brand logo as final fallback
      }
    }
  }

  return `
    <header class="report-header">
      <div class="header-inner">
        <div class="header-logo-group">
          <img src="${logoUrl}"
               alt="${logoAlt}"
               class="logo"
               onerror="this.onerror=null; this.src='${clientConfig.brand.logoUrl}';">
          <div class="header-title-info">
            <h1>${t.preAuditReport}</h1>
            <span class="meta">${data.companyProfile.name} • ${generatedDate}</span>
          </div>
        </div>
        <div class="header-actions">
          <a href="${clientConfig.primaryContact.calendarUrl || ''}" target="_blank" class="btn btn-primary">
            📅 ${t.ctaButton}
          </a>
          <button onclick="window.print()" class="btn btn-secondary">
            ${t.downloadPdf}
          </button>
        </div>
      </div>
    </header>
  `;
}
