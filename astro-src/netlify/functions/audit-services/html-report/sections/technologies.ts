// =============================================================================
// TECHNOLOGIES SECTION - Detected technologies display
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { getEnhancedTechCategoryLabel, escapeHtml, escapeHtmlAttr } from '../utils';

export function generateTechnologiesSection(data: AuditReportData, t: Translations): string {
  if (!data.detectedTechnologies || data.detectedTechnologies.length === 0) {
    return '';
  }

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'cms': '📝',
      'ecommerce': '🛒',
      'crm': '👥',
      'erp': '🏢',
      'custom_app': '📱',
      'framework': '⚙️',
      'database': '🗄️',
      'cloud': '☁️',
      'other': '🔧'
    };
    return icons[category] || '🔧';
  };

  const getConfidenceClass = (confidence: string): string => {
    return confidence === 'high' ? 'confidence-high' : confidence === 'medium' ? 'confidence-medium' : 'confidence-low';
  };

  const getConfidenceLabel = (confidence: string): string => {
    if (confidence === 'high') return t.confidenceHigh;
    if (confidence === 'medium') return t.confidenceMedium;
    return t.confidenceLow;
  };

  const techHTML = data.detectedTechnologies.map(tech => {
    // Get enhanced category label from glossary
    const categoryLabel = getEnhancedTechCategoryLabel(tech.category, data.language);
    const tooltipAttr = categoryLabel.tooltip ? ` data-tooltip="${escapeHtmlAttr(categoryLabel.tooltip)}"` : '';

    return `
    <div class="tech-card">
      <div class="tech-icon">${getCategoryIcon(tech.category)}</div>
      <div class="tech-info">
        <h4>${escapeHtml(tech.name)}</h4>
        <span class="tech-category tooltip-term"${tooltipAttr}>${escapeHtml(categoryLabel.label)}</span>
        ${tech.description ? `<p>${escapeHtml(tech.description)}</p>` : ''}
      </div>
      <span class="tech-confidence ${getConfidenceClass(tech.confidence)}">${getConfidenceLabel(tech.confidence)}</span>
    </div>
  `;}).join('');

  return `
    <section class="section tech-section">
      <h2 class="section-title">${t.technologiesTitle}</h2>
      <p class="section-subtitle">${t.technologiesSubtitle}</p>
      <div class="tech-grid">
        ${techHTML}
      </div>
    </section>
  `;
}
