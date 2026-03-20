// =============================================================================
// QUESTIONS SECTION - Audit questions to consider
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';

export function generateQuestionsSection(data: AuditReportData, t: Translations): string {
  const questionsHTML = data.auditQuestions.map(category => `
    <div class="question-category">
      <h3>${category.icon ? `<span class="cat-icon">${escapeHtml(category.icon)}</span> ` : ''}${escapeHtml(category.category)}</h3>
      <ul>
        ${category.questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  return `
    <section class="section">
      <h2 class="section-title">${t.questionsTitle}</h2>
      <p class="section-subtitle">${t.questionsSubtitle}</p>
      <div class="questions-grid">
        ${questionsHTML}
      </div>
    </section>
  `;
}
