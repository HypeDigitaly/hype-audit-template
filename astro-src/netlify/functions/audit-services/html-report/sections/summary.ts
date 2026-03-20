// =============================================================================
// SUMMARY SECTION - Executive summary with benefits
// =============================================================================

import type { AuditReportData, Translations, OpportunityBenefit, BenefitType } from '../types';
import { getEnhancedBenefitLabel, escapeHtml, escapeHtmlAttr } from '../utils';
import {
  detectBusinessType,
  getBusinessTypeMetrics,
  type BusinessType,
  type BenefitTypeKey
} from '../../glossary';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Sort benefits to show primary metrics first based on business type
 */
export function sortBenefitsByBusinessType(
  benefits: OpportunityBenefit[],
  businessType: BusinessType,
  primaryMetrics: BenefitTypeKey[]
): OpportunityBenefit[] {
  return [...benefits].sort((a, b) => {
    const aIsPrimary = primaryMetrics.includes(a.type as BenefitTypeKey);
    const bIsPrimary = primaryMetrics.includes(b.type as BenefitTypeKey);

    if (aIsPrimary && !bIsPrimary) return -1;
    if (!aIsPrimary && bIsPrimary) return 1;

    // If both are primary, sort by their position in primaryMetrics array
    if (aIsPrimary && bIsPrimary) {
      return primaryMetrics.indexOf(a.type as BenefitTypeKey) - primaryMetrics.indexOf(b.type as BenefitTypeKey);
    }

    return 0;
  });
}

/**
 * Get business-type-specific summary label for opportunities counter
 */
export function getBusinessTypeSummaryLabel(businessType: BusinessType, language: 'cs' | 'en'): string {
  const labels: Record<BusinessType, { cs: string; en: string }> = {
    'community_membership': {
      cs: 'Vybrané přínosy pro komunitu',
      en: 'Selected community benefits'
    },
    'ecommerce': {
      cs: 'Vybrané přínosy pro e-shop',
      en: 'Selected e-commerce benefits'
    },
    'software_it': {
      cs: 'Odhadovaná úspora času týdně',
      en: 'Estimated weekly time savings'
    },
    'marketing_agency': {
      cs: 'Vybrané přínosy pro agenturu',
      en: 'Selected agency benefits'
    },
    'service_business': {
      cs: 'Vybrané přínosy pro služby',
      en: 'Selected service benefits'
    },
    'manufacturing': {
      cs: 'Odhadované úspory týdně',
      en: 'Estimated weekly savings'
    },
    'education': {
      cs: 'Vybrané přínosy pro vzdělávání',
      en: 'Selected education benefits'
    },
    'healthcare': {
      cs: 'Odhadovaná úspora času týdně',
      en: 'Estimated weekly time savings'
    },
    'finance': {
      cs: 'Odhadovaná úspora času týdně',
      en: 'Estimated weekly time savings'
    },
    'consulting': {
      cs: 'Vybrané přínosy pro poradenství',
      en: 'Selected consulting benefits'
    },
    'real_estate': {
      cs: 'Vybrané přínosy pro reality',
      en: 'Selected real estate benefits'
    },
    'logistics': {
      cs: 'Odhadované úspory týdně',
      en: 'Estimated weekly savings'
    },
    'hospitality': {
      cs: 'Vybrané přínosy pro provoz',
      en: 'Selected hospitality benefits'
    },
    'generic': {
      cs: 'Odhadované přínosy týdně',
      en: 'Estimated weekly benefits'
    }
  };

  return labels[businessType]?.[language] || labels['generic'][language];
}

// =============================================================================
// MAIN SECTION GENERATOR
// =============================================================================

export function generateExecutiveSummarySection(data: AuditReportData, t: Translations): string {
  const summary = data.expectedBenefitsSummary;

  // If no summary data, generate a basic fallback
  if (!summary) {
    return '';
  }

  // Detect business type for customized display
  const businessType = detectBusinessType(data.companyProfile?.detectedIndustry || data.companyProfile?.industry);
  const metricsConfig = getBusinessTypeMetrics(businessType);

  // Use business-type-specific headline
  const headline = data.language === 'cs'
    ? metricsConfig.headline.cs
    : metricsConfig.headline.en;

  // Executive summary now shows only the intro text (no metrics cards)
  // The intro text should be a personalized summary of all benefits in words
  return `
    <section class="section executive-summary-section">
      <h2 class="section-title">${headline}</h2>
      <div class="exec-intro">
        <p>${escapeHtml(summary.introText)}</p>
      </div>
      <p class="exec-disclaimer">${escapeHtml(summary.disclaimer)}</p>
    </section>
  `;
}
