// =============================================================================
// RISK SECTION - Risk assessment with severity and mitigation
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { getEnhancedRiskCategoryLabel, escapeHtmlAttr } from '../utils';

export function generateRiskSection(data: AuditReportData, t: Translations): string {
  if (!data.riskAssessment || data.riskAssessment.length === 0) {
    return '';
  }

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'data_privacy': t.riskDataPrivacy,
      'employee_adoption': t.riskEmployeeAdoption,
      'technical': t.riskTechnical,
      'regulatory': t.riskRegulatory,
      'financial': t.riskFinancial
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'data_privacy': '🔒',
      'employee_adoption': '👥',
      'technical': '⚙️',
      'regulatory': '📋',
      'financial': '💰'
    };
    return icons[category] || '⚠️';
  };

  const getSeverityClass = (severity: string): string => {
    return `severity-${severity}`;
  };

  const risksHTML = data.riskAssessment.map(risk => {
    // Get enhanced risk category label from glossary
    const categoryInfo = getEnhancedRiskCategoryLabel(risk.category, data.language);
    const tooltipAttr = categoryInfo.tooltip ? ` data-tooltip="${escapeHtmlAttr(categoryInfo.tooltip)}"` : '';

    return `
    <div class="risk-card ${getSeverityClass(risk.severity)}">
      <div class="risk-header">
        <span class="risk-icon">${getCategoryIcon(risk.category)}</span>
        <div class="risk-title-group">
          <h4>${risk.title}</h4>
          <span class="risk-category tooltip-term"${tooltipAttr}>${categoryInfo.label || getCategoryLabel(risk.category)}</span>
        </div>
        <span class="severity-badge">${risk.severity === 'low' ? t.low : risk.severity === 'medium' ? t.medium : t.high}</span>
      </div>
      <p class="risk-description">${risk.description}</p>
      <div class="risk-mitigation">
        <strong>${t.riskMitigation}:</strong> ${risk.mitigation}
      </div>
    </div>
  `;}).join('');

  return `
    <section class="section risk-section">
      <h2 class="section-title">${t.riskTitle}</h2>
      <p class="section-subtitle">${t.riskSubtitle}</p>
      <div class="risks-grid">
        ${risksHTML}
      </div>
    </section>
  `;
}
