// =============================================================================
// APP INTEGRATION SECTION - AI integration opportunities for applications
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { getEnhancedImplementationTypeLabel, escapeHtmlAttr } from '../utils';

export function generateAppIntegrationSection(data: AuditReportData, t: Translations): string {
  if (!data.appIntegrationOpportunities || data.appIntegrationOpportunities.length === 0) {
    return '';
  }

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'api_integration': '🔗',
      'widget': '🧩',
      'standalone_module': '📦',
      'voice_interface': '🎤',
      'chatbot_embed': '💬'
    };
    return icons[type] || '🤖';
  };

  const getEffortBadge = (effort: string): string => {
    const badges: Record<string, { label: string; class: string }> = {
      'low': { label: t.low, class: 'effort-low' },
      'medium': { label: t.medium, class: 'effort-medium' },
      'high': { label: t.high, class: 'effort-high' }
    };
    const badge = badges[effort] || badges['medium'];
    return `<span class="effort-badge ${badge.class}">${badge.label}</span>`;
  };

  const title = data.hasOwnApplication ? t.appIntegrationTitle : t.appIntegrationNoApp;
  const subtitle = data.hasOwnApplication ? t.appIntegrationSubtitle : t.appIntegrationNoAppSubtitle;

  const integrationsHTML = data.appIntegrationOpportunities.map(opp => {
    // Get enhanced implementation type label from glossary
    const typeLabel = getEnhancedImplementationTypeLabel(opp.implementationType, data.language);
    const typeTooltipAttr = typeLabel.tooltip ? ` data-tooltip="${escapeHtmlAttr(typeLabel.tooltip)}"` : '';
    const impactLabel = data.language === 'cs' ? 'Očekávaný přínos:' : 'Expected benefit:';

    return `
    <div class="integration-card">
      <div class="integration-header">
        <span class="integration-icon tooltip-term"${typeTooltipAttr}>${getTypeIcon(opp.implementationType)}</span>
        <h4>${opp.title}</h4>
        ${getEffortBadge(opp.estimatedEffort)}
      </div>
      <p class="integration-desc">${opp.description}</p>
      <div class="integration-impact">
        <strong>${impactLabel}</strong> ${opp.potentialImpact}
      </div>
    </div>
  `;}).join('');

  // Add app details if company has own app
  const appDetailsHTML = data.hasOwnApplication && data.ownApplicationDetails ? `
    <div class="app-details-card">
      <div class="app-details-icon">📱</div>
      <div class="app-details-content">
        <h4>${data.language === 'cs' ? 'Vaše aplikace' : 'Your Application'}</h4>
        <p>${data.ownApplicationDetails}</p>
      </div>
    </div>
  ` : '';

  return `
    <section class="section integration-section">
      <h2 class="section-title">${title}</h2>
      <p class="section-subtitle">${subtitle}</p>
      ${appDetailsHTML}
      <div class="integrations-grid">
        ${integrationsHTML}
      </div>
    </section>
  `;
}
