// =============================================================================
// COMPANY SECTION - Company profile information
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml, escapeHtmlAttr, sanitizeUrl } from '../utils';

export function generateCompanySection(data: AuditReportData, t: Translations): string {
  const rawWebsite = data.companyProfile.website;
  const safeHref = sanitizeUrl(
    rawWebsite.startsWith('http') ? rawWebsite : 'https://' + rawWebsite
  );

  return `
    <section class="section">
      <h2 class="section-title">${t.companyProfile}</h2>
      <div class="company-grid">
        <div class="company-card">
          <span class="label">${t.website}</span>
          <a href="${escapeHtmlAttr(safeHref)}" target="_blank" class="value link">${escapeHtml(rawWebsite)}</a>
        </div>
        <div class="company-card">
          <span class="label">${t.city}</span>
          <span class="value">${escapeHtml(data.companyProfile.city)}</span>
        </div>
        <div class="company-card">
          <span class="label">${t.industry}</span>
          <span class="value">${escapeHtml(data.companyProfile.detectedIndustry || data.companyProfile.industry)}</span>
        </div>
      </div>
    </section>
  `;
}
