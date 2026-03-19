// =============================================================================
// COMPANY SECTION - Company profile information
// =============================================================================

import type { AuditReportData, Translations } from '../types';

export function generateCompanySection(data: AuditReportData, t: Translations): string {
  return `
    <section class="section">
      <h2 class="section-title">${t.companyProfile}</h2>
      <div class="company-grid">
        <div class="company-card">
          <span class="label">${t.website}</span>
          <a href="${data.companyProfile.website.startsWith('http') ? data.companyProfile.website : 'https://' + data.companyProfile.website}" target="_blank" class="value link">${data.companyProfile.website}</a>
        </div>
        <div class="company-card">
          <span class="label">${t.city}</span>
          <span class="value">${data.companyProfile.city}</span>
        </div>
        <div class="company-card">
          <span class="label">${t.industry}</span>
          <span class="value">${data.companyProfile.detectedIndustry || data.companyProfile.industry}</span>
        </div>
      </div>
    </section>
  `;
}
