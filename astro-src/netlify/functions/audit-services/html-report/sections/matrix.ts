// =============================================================================
// MATRIX SECTION - 2x2 opportunity matrix visualization
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';

export function generateMatrixSection(data: AuditReportData, t: Translations): string {
  // Group opportunities by quadrant for grid layout
  const grouped = {
    deprioritize: data.aiOpportunities.filter(o => o.quadrant === 'deprioritize'),
    big_swing: data.aiOpportunities.filter(o => o.quadrant === 'big_swing'),
    nice_to_have: data.aiOpportunities.filter(o => o.quadrant === 'nice_to_have'),
    quick_win: data.aiOpportunities.filter(o => o.quadrant === 'quick_win')
  };

  const renderQuadrant = (key: keyof typeof grouped, label: string) => `
    <div class="matrix-quadrant">
      <span class="quadrant-label">${label}</span>
      ${grouped[key].map(opp => {
        const VALID_QUADRANTS: Record<string, string> = {
          'deprioritize': 'deprioritize',
          'big_swing': 'big-swing',
          'nice_to_have': 'nice-to-have',
          'quick_win': 'quick-win'
        };
        const safeClass = VALID_QUADRANTS[opp.quadrant] || 'deprioritize';
        return `<div class="matrix-item ${safeClass}">${escapeHtml(opp.title)}</div>`;
      }).join('')}
    </div>
  `;

  return `
    <section class="section">
      <h2 class="section-title">${t.matrixTitle}</h2>
      <p class="section-subtitle">${t.matrixSubtitle}</p>
      <div class="matrix-wrapper">
        <div class="matrix-container">
          <!-- Continuous Axes -->
          <div class="axis-line-vertical"></div>
          <div class="axis-line-horizontal"></div>

          <!-- Outside Labels -->
          <div class="matrix-label label-y-top">${t.highEffort}</div>
          <div class="matrix-label label-y-bottom">${t.lowEffort}</div>
          <div class="matrix-label label-x-left">${t.lowImpact}</div>
          <div class="matrix-label label-x-right">${t.highImpact}</div>

          <!-- Quadrants -->
          <div class="matrix-grid">
            ${renderQuadrant('deprioritize', t.deprioritize)}
            ${renderQuadrant('big_swing', t.bigSwings)}
            ${renderQuadrant('nice_to_have', t.niceToHaves)}
            ${renderQuadrant('quick_win', t.quickWins)}
          </div>
        </div>
      </div>
    </section>
  `;
}
