// =============================================================================
// CTA SECTION - Call-to-action with contact information
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { clientConfig } from '../../../_config/client';

export function generateCTASection(data: AuditReportData, t: Translations): string {
  const reviewsText = data.language === 'cs' ? 'Naše Google recenze' : 'Our Google Reviews';

  return `
    <section class="section cta-section">
      <h2>${t.ctaTitle}</h2>
      <p>${t.ctaSubtitle}</p>
      <a href="${clientConfig.primaryContact.calendarUrl || ''}" target="_blank" class="btn btn-white" style="display: inline-flex; margin: 0 auto;">
        📅 ${t.ctaButton}
      </a>

      <div class="cta-contact-info cta-contact-3col">
        <div class="cta-contact-col">
          <strong>${clientConfig.primaryContact.name}</strong><br>
          ${clientConfig.primaryContact.title}<br>
          <a href="mailto:${clientConfig.primaryContact.email}" style="color: rgba(255,255,255,0.9);">${clientConfig.primaryContact.email}</a><br>
          <a href="tel:${clientConfig.primaryContact.phone.replace(/\s/g, '')}" style="color: rgba(255,255,255,0.9);">${clientConfig.primaryContact.phone}</a>
        </div>
        <div class="cta-contact-col cta-contact-center">
          <a href="https://share.google/TSK90V06h2slFwrgC" target="_blank" class="cta-reviews-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: #FBBC04;">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            ${reviewsText}
          </a>
        </div>
        <div class="cta-contact-col cta-contact-right">
          <strong>${clientConfig.company.legalName}</strong><br>
          ${clientConfig.contact.street}<br>
          ${clientConfig.contact.city}, ${clientConfig.contact.postalCode}<br>
          ${clientConfig.contact.country}
        </div>
      </div>
    </section>
  `;
}
