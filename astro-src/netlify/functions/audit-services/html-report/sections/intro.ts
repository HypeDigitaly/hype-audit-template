// =============================================================================
// INTRO SECTION - Introduction/conclusion text
// =============================================================================

import type { AuditReportData, Translations } from '../types';

export function generateIntroSection(data: AuditReportData, t: Translations): string {
  // Use personalized company context if available
  const contextParagraph = data.companyContext || t.introText;

  return `
    <section class="section intro-section">
      <h2 class="section-title">${t.introTitle}</h2>
      <div class="intro-content">
        <p>${contextParagraph}</p>
      </div>
    </section>
  `;
}
