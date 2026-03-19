// =============================================================================
// TOOLS SECTION - Recommended AI tools display
// =============================================================================

import type { AuditReportData, Translations } from '../types';

export function generateToolsSection(data: AuditReportData, t: Translations): string {
  const toolsHTML = data.recommendedTools.map(tool => `
    <div class="tool-card">
      <span class="cat">${tool.category}</span>
      <h4>${tool.name}</h4>
      <p>${tool.useCase}</p>
      ${tool.url ? `<a href="${tool.url}" target="_blank" class="tool-link">${data.language === 'cs' ? 'Přejít na web →' : 'Visit website →'}</a>` : ''}
    </div>
  `).join('');

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
