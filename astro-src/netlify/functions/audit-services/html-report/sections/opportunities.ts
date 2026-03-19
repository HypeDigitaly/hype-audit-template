// =============================================================================
// OPPORTUNITIES SECTION - AI opportunity cards with benefits
// =============================================================================

import type { AuditReportData, Translations, AIOpportunity, OpportunityBenefit } from '../types';
import { getEnhancedBenefitLabel, escapeHtmlAttr } from '../utils';
import { sortBenefitsByBusinessType, getBusinessTypeSummaryLabel } from './summary';
import {
  detectBusinessType,
  getBusinessTypeMetrics,
  type BenefitTypeKey
} from '../../glossary';

export function generateOpportunitiesSection(data: AuditReportData, t: Translations): string {
  // Detect business type for customized display
  const businessType = detectBusinessType(data.companyProfile?.detectedIndustry || data.companyProfile?.industry);
  const metricsConfig = getBusinessTypeMetrics(businessType);

  // Use business-type-specific counter label
  const benefitsLabel = t.expectedBenefitsLabel;

  // Helper function to generate benefit tags for an opportunity with enhanced labels
  // Sort benefits to show primary metrics first
  const generateBenefitTags = (benefits: OpportunityBenefit[] | undefined): string => {
    if (!benefits || benefits.length === 0) return '';

    // Sort benefits: primary metrics first
    const sortedBenefits = sortBenefitsByBusinessType(benefits, businessType, metricsConfig.primaryMetrics);

    return `
      <div class="opp-benefits">
        <span class="opp-benefits-label">${benefitsLabel}:</span>
        <div class="opp-benefits-grid">
          ${sortedBenefits.map(benefit => {
            // Get enhanced label from glossary
            const enhancedLabel = getEnhancedBenefitLabel(benefit.type, data.language);
            const displayLabel = enhancedLabel.label || benefit.label;
            const tooltipAttr = enhancedLabel.tooltip ? ` data-tooltip="${escapeHtmlAttr(enhancedLabel.tooltip)}"` : '';

            // Highlight primary metrics
            const isPrimary = metricsConfig.primaryMetrics.includes(benefit.type as BenefitTypeKey);
            const primaryClass = isPrimary ? ' benefit-primary' : '';

            return `
            <div class="benefit-tag benefit-${benefit.type}${primaryClass}"${tooltipAttr}>
              <span class="benefit-icon">${benefit.icon}</span>
              <div class="benefit-content">
                <div class="benefit-numbers">
                  <span class="benefit-value">${benefit.value}</span>
                  <span class="benefit-unit">${benefit.unit}</span>
                </div>
                <span class="benefit-label">${displayLabel}</span>
              </div>
            </div>
          `;}).join('')}
        </div>
      </div>
    `;
  };

  // Helper function to get quadrant info with tooltip
  const getQuadrantInfo = (quadrantKey: string) => {
    const quadrantMap: Record<string, { label: string; tooltip: string; class: string }> = {
      'quick_win': { label: t.quickWins, tooltip: t.quickWinsTooltip, class: 'quick-win' },
      'big_swing': { label: t.bigSwings, tooltip: t.bigSwingsTooltip, class: 'big-swing' },
      'nice_to_have': { label: t.niceToHaves, tooltip: t.niceToHavesTooltip, class: 'nice-to-have' },
      'deprioritize': { label: t.deprioritize, tooltip: t.deprioritizeTooltip, class: 'deprioritize' }
    };
    return quadrantMap[quadrantKey] || { label: quadrantKey, tooltip: '', class: 'deprioritize' };
  };

  // Helper function to generate a single opportunity card
  const generateOpportunityCard = (opp: AIOpportunity, index: number): string => {
    const quadrant = getQuadrantInfo(opp.quadrant);

    const effortLabel = opp.implementationEffort === 'low' ? t.low : (opp.implementationEffort === 'medium' ? t.medium : t.high);

    // Generate benefits HTML if available
    const benefitsHTML = generateBenefitTags(opp.expectedBenefits);

    // Add tooltip to quadrant badge
    const tooltipAttr = quadrant.tooltip ? ` data-tooltip="${escapeHtmlAttr(quadrant.tooltip)}"` : '';

    // Generate short description HTML if available
    const shortDescHTML = opp.shortDescription
      ? `<p class="opp-short-desc">${opp.shortDescription}</p>`
      : '';

    return `
      <div class="opportunity-card">
        <div class="opp-header">
          <span class="opp-badge ${quadrant.class}"${tooltipAttr}>${quadrant.label}</span>
        </div>
        <h3>${opp.title}</h3>
        ${shortDescHTML}
        <p class="opp-description">${opp.description}</p>
        ${benefitsHTML}
        <div class="opp-meta">
          <span class="meta-tag">${t.implementationEffort}: ${effortLabel}</span>
        </div>
      </div>
    `;
  };

  // Split opportunities into two columns (5 left, 5 right or balanced if different count)
  const midpoint = Math.ceil(data.aiOpportunities.length / 2);
  const leftColumnOpps = data.aiOpportunities.slice(0, midpoint);
  const rightColumnOpps = data.aiOpportunities.slice(midpoint);

  const leftColumnHTML = leftColumnOpps.map((opp, i) => generateOpportunityCard(opp, i)).join('');
  const rightColumnHTML = rightColumnOpps.map((opp, i) => generateOpportunityCard(opp, i + midpoint)).join('');

  return `
    <section class="section section-fullwidth">
      <h2 class="section-title">${t.opportunitiesTitle}</h2>
      <p class="section-subtitle">${t.opportunitiesSubtitle}</p>

      <div class="opportunities-two-col">
        <div class="opportunities-column">
          ${leftColumnHTML}
        </div>
        <div class="opportunities-column">
          ${rightColumnHTML}
        </div>
      </div>
    </section>
  `;
}
