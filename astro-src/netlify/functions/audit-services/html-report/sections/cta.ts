// =============================================================================
// CTA SECTION - Call-to-action with contact information
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml, escapeHtmlAttr, sanitizeUrl } from '../utils';
import { clientConfig } from '../../../_config/client';

export function generateCTASection(data: AuditReportData, t: Translations): string {
  const lang = data.language;

  // ---------------------------------------------------------------------------
  // CTA copy — prefer config overrides, fall back to translation strings.
  // config.report.cta fields are bilingual { cs, en }; select by report language.
  // ---------------------------------------------------------------------------
  const ctaConfig = clientConfig.report.cta;
  const ctaTitle      = (ctaConfig?.title      ? ctaConfig.title[lang]      : null) ?? t.ctaTitle;
  const ctaSubtitle   = (ctaConfig?.subtitle   ? ctaConfig.subtitle[lang]   : null) ?? t.ctaSubtitle;
  const ctaButtonText = (ctaConfig?.buttonText ? ctaConfig.buttonText[lang] : null) ?? t.ctaButton;
  const ctaButtonUrl  = ctaConfig?.buttonUrl ?? clientConfig.primaryContact.calendarUrl ?? '';

  // ---------------------------------------------------------------------------
  // Google Reviews — only render the link when a URL is configured.
  // ---------------------------------------------------------------------------
  const googleReviewsUrl = clientConfig.social?.googleReviews;
  const reviewsText = lang === 'cs' ? 'Naše Google recenze' : 'Our Google Reviews';
  const googleReviewsHtml = googleReviewsUrl
    ? `<a href="${escapeHtmlAttr(sanitizeUrl(googleReviewsUrl))}" target="_blank" class="cta-reviews-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="color: #FBBC04;">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            ${reviewsText}
          </a>`
    : '';

  return `
    <section class="section cta-section">
      <h2>${escapeHtml(ctaTitle)}</h2>
      <p>${escapeHtml(ctaSubtitle)}</p>
      <a href="${escapeHtmlAttr(sanitizeUrl(ctaButtonUrl))}" target="_blank" class="btn btn-white" style="display: inline-flex; margin: 0 auto;">
        ${escapeHtml(ctaButtonText)}
      </a>

      <div class="cta-contact-info cta-contact-3col">
        <div class="cta-contact-col">
          <strong>${escapeHtml(clientConfig.primaryContact.name)}</strong><br>
          ${escapeHtml(clientConfig.primaryContact.title)}<br>
          <a href="mailto:${escapeHtmlAttr(clientConfig.primaryContact.email)}" style="color: rgba(255,255,255,0.9);">${escapeHtml(clientConfig.primaryContact.email)}</a><br>
          ${clientConfig.primaryContact.phone ? `<a href="tel:${escapeHtmlAttr(clientConfig.primaryContact.phone.replace(/\s/g, ''))}" style="color: rgba(255,255,255,0.9);">${escapeHtml(clientConfig.primaryContact.phone)}</a>` : ''}
        </div>
        <div class="cta-contact-col cta-contact-center">
          ${googleReviewsHtml}
        </div>
        <div class="cta-contact-col cta-contact-right">
          <strong>${escapeHtml(clientConfig.company.legalName)}</strong><br>
          ${escapeHtml(clientConfig.contact.street)}<br>
          ${escapeHtml(clientConfig.contact.city)}, ${escapeHtml(clientConfig.contact.postalCode)}<br>
          ${escapeHtml(clientConfig.contact.country)}
        </div>
      </div>
    </section>
  `;
}
