// =============================================================================
// TOOLS SECTION - Recommended AI tools display
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml, escapeHtmlAttr, sanitizeUrl } from '../utils';

export function generateToolsSection(data: AuditReportData, t: Translations): string {
  const toolsHTML = data.recommendedTools.map(tool => {
    const safeUrl = tool.url ? sanitizeUrl(tool.url) : '';
    const linkHTML = safeUrl
      ? `<a href="${escapeHtmlAttr(safeUrl)}" target="_blank" class="tool-link">${data.language === 'cs' ? 'Přejít na web →' : 'Visit website →'}</a>`
      : '';

    return `
    <div class="tool-card">
      <span class="cat">${escapeHtml(tool.category)}</span>
      <h4>${escapeHtml(tool.name)}</h4>
      <p>${escapeHtml(tool.useCase)}</p>
      ${linkHTML}
    </div>
  `;
  }).join('');

  return `
    <section class="section">
      <h2 class="section-title">${t.toolsTitle}</h2>
      <p class="section-subtitle">${t.toolsSubtitle}</p>
      <div class="tools-grid">
        ${toolsHTML}
      </div>
    </section>
  `;
}
