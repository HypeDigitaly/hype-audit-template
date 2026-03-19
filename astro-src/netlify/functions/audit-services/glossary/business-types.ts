// =============================================================================
// BUSINESS TYPES - Detection & Primary Metrics Mapping
// =============================================================================

import type { BusinessType, BenefitTypeKey, BusinessTypeMetricsConfig } from './types';

// =============================================================================
// BUSINESS TYPE KEYWORDS - For detection from industry string
// =============================================================================

export const BUSINESS_TYPE_KEYWORDS: Record<BusinessType, string[]> = {
  'community_membership': [
    'komunita', 'community', 'klub', 'club', 'spolek', 'association',
    'membership', 'členství', 'network', 'síť', 'growth club', 'mastermind',
    'networking', 'members', 'členové'
  ],
  'ecommerce': [
    'e-commerce', 'ecommerce', 'e-shop', 'eshop', 'online obchod', 'online store',
    'retail', 'maloobchod', 'velkoobchod', 'wholesale', 'prodej', 'sales'
  ],
  'software_it': [
    'software', 'it ', 'development', 'vývoj', 'technologie', 'technology',
    'saas', 'aplikace', 'app', 'programování', 'coding', 'digital'
  ],
  'marketing_agency': [
    'marketing', 'agentura', 'agency', 'reklama', 'advertising', 'media',
    'digitální agentura', 'digital agency', 'pr ', 'kreativní', 'creative'
  ],
  'service_business': [
    'fitness', 'gym', 'posilovna', 'salon', 'kadeřnictví', 'beauty', 'wellness',
    'autoservis', 'auto repair', 'servis', 'služby', 'services', 'coworking'
  ],
  'manufacturing': [
    'výroba', 'manufacturing', 'průmysl', 'industry', 'factory', 'továrna',
    'produkce', 'production'
  ],
  'education': [
    'vzdělávání', 'education', 'škola', 'school', 'kurzy', 'courses',
    'training', 'školení', 'akademie', 'academy', 'učení', 'learning'
  ],
  'healthcare': [
    'zdravotnictví', 'healthcare', 'klinika', 'clinic', 'ordinace', 'medical',
    'lékař', 'doctor', 'nemocnice', 'hospital', 'zubní', 'dental'
  ],
  'finance': [
    'finance', 'účetnictví', 'accounting', 'pojišťovna', 'insurance',
    'banka', 'bank', 'investice', 'investment', 'finanční', 'financial'
  ],
  'consulting': [
    'poradenství', 'consulting', 'konzultace', 'advisory', 'b2b',
    'business services', 'profesionální služby'
  ],
  'real_estate': [
    'reality', 'real estate', 'stavebnictví', 'construction', 'nemovitosti',
    'property', 'development', 'developer'
  ],
  'logistics': [
    'logistika', 'logistics', 'doprava', 'transport', 'skladování', 'warehouse',
    'spedice', 'shipping', 'delivery', 'doručování'
  ],
  'hospitality': [
    'restaurace', 'restaurant', 'hotel', 'kavárna', 'café', 'coffee',
    'horeca', 'catering', 'pohostinství', 'hospitality', 'bar'
  ],
  'generic': []
};

// =============================================================================
// BUSINESS TYPE METRICS - Primary metrics configuration for each business type
// =============================================================================

export const BUSINESS_TYPE_METRICS: Record<BusinessType, BusinessTypeMetricsConfig> = {
  'community_membership': {
    primaryMetrics: ['member_acquisition', 'churn_reduction', 'member_engagement', 'event_attendance'],
    secondaryMetrics: ['time_savings', 'customer_satisfaction', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši komunitu',
      en: 'Expected benefits for your community'
    },
    valueProposition: {
      cs: 'AI vám pomůže získat více členů, snížit jejich odchod a zvýšit zapojení celé komunity.',
      en: 'AI will help you acquire more members, reduce churn, and increase engagement across your community.'
    }
  },
  'ecommerce': {
    primaryMetrics: ['revenue_increase', 'conversion_rate', 'products_sold', 'new_customers'],
    secondaryMetrics: ['cart_abandonment_reduction', 'customer_satisfaction', 'time_savings'],
    headline: {
      cs: 'Očekávané přínosy pro váš e-shop',
      en: 'Expected benefits for your e-commerce'
    },
    valueProposition: {
      cs: 'AI zvýší vaše tržby díky personalizaci, lepší konverzi a automatizované zákaznické podpoře.',
      en: 'AI will increase your revenue through personalization, better conversion, and automated customer support.'
    }
  },
  'software_it': {
    primaryMetrics: ['time_savings', 'cost_reduction', 'error_reduction', 'response_time'],
    secondaryMetrics: ['revenue_increase', 'customer_satisfaction', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši IT firmu',
      en: 'Expected benefits for your IT company'
    },
    valueProposition: {
      cs: 'AI zrychlí vývoj, sníží náklady a automatizuje opakující se úkoly vašeho týmu.',
      en: 'AI will accelerate development, reduce costs, and automate repetitive tasks for your team.'
    }
  },
  'marketing_agency': {
    primaryMetrics: ['lead_generation', 'new_customers', 'conversion_rate', 'time_savings'],
    secondaryMetrics: ['revenue_increase', 'customer_satisfaction', 'response_time'],
    headline: {
      cs: 'Očekávané přínosy pro vaši agenturu',
      en: 'Expected benefits for your agency'
    },
    valueProposition: {
      cs: 'AI vám přinese více klientů, automatizuje tvorbu obsahu a zefektivní vaše kampaně.',
      en: 'AI will bring you more clients, automate content creation, and optimize your campaigns.'
    }
  },
  'service_business': {
    primaryMetrics: ['new_customers', 'customer_satisfaction', 'time_savings', 'availability'],
    secondaryMetrics: ['revenue_increase', 'response_time', 'error_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaše služby',
      en: 'Expected benefits for your services'
    },
    valueProposition: {
      cs: 'AI automatizuje rezervace, zlepší zákaznickou zkušenost a přinese vám více klientů.',
      en: 'AI will automate bookings, improve customer experience, and bring you more clients.'
    }
  },
  'manufacturing': {
    primaryMetrics: ['cost_reduction', 'error_reduction', 'time_savings', 'revenue_increase'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši výrobu',
      en: 'Expected benefits for your manufacturing'
    },
    valueProposition: {
      cs: 'AI sníží náklady, minimalizuje chyby a optimalizuje výrobní procesy.',
      en: 'AI will reduce costs, minimize errors, and optimize production processes.'
    }
  },
  'education': {
    primaryMetrics: ['student_acquisition', 'course_completion', 'customer_satisfaction', 'time_savings'],
    secondaryMetrics: ['revenue_increase', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaše vzdělávání',
      en: 'Expected benefits for your education business'
    },
    valueProposition: {
      cs: 'AI přiláká více studentů, zvýší dokončení kurzů a personalizuje vzdělávací zážitek.',
      en: 'AI will attract more students, increase course completion, and personalize the learning experience.'
    }
  },
  'healthcare': {
    primaryMetrics: ['time_savings', 'customer_satisfaction', 'response_time', 'error_reduction'],
    secondaryMetrics: ['new_customers', 'availability', 'cost_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaše zdravotnické zařízení',
      en: 'Expected benefits for your healthcare facility'
    },
    valueProposition: {
      cs: 'AI zrychlí administrativu, zlepší péči o pacienty a sníží čekací doby.',
      en: 'AI will speed up administration, improve patient care, and reduce wait times.'
    }
  },
  'finance': {
    primaryMetrics: ['time_savings', 'error_reduction', 'cost_reduction', 'customer_satisfaction'],
    secondaryMetrics: ['response_time', 'availability', 'new_customers'],
    headline: {
      cs: 'Očekávané přínosy pro vaše finanční služby',
      en: 'Expected benefits for your financial services'
    },
    valueProposition: {
      cs: 'AI automatizuje zpracování dokumentů, sníží chybovost a zrychlí vyřizování požadavků.',
      en: 'AI will automate document processing, reduce errors, and speed up request handling.'
    }
  },
  'consulting': {
    primaryMetrics: ['lead_generation', 'time_savings', 'new_customers', 'revenue_increase'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaše poradenství',
      en: 'Expected benefits for your consulting'
    },
    valueProposition: {
      cs: 'AI vám pomůže získat více klientů, automatizovat analýzy a ušetřit čas na administrativě.',
      en: 'AI will help you acquire more clients, automate analyses, and save time on administration.'
    }
  },
  'real_estate': {
    primaryMetrics: ['lead_generation', 'new_customers', 'time_savings', 'conversion_rate'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši realitní činnost',
      en: 'Expected benefits for your real estate business'
    },
    valueProposition: {
      cs: 'AI automatizuje oslovování klientů, zrychlí párování nemovitostí a zlepší komunikaci.',
      en: 'AI will automate client outreach, speed up property matching, and improve communication.'
    }
  },
  'logistics': {
    primaryMetrics: ['cost_reduction', 'time_savings', 'error_reduction', 'customer_satisfaction'],
    secondaryMetrics: ['response_time', 'availability', 'revenue_increase'],
    headline: {
      cs: 'Očekávané přínosy pro vaši logistiku',
      en: 'Expected benefits for your logistics'
    },
    valueProposition: {
      cs: 'AI optimalizuje trasy, sníží náklady a automatizuje sledování zásilek.',
      en: 'AI will optimize routes, reduce costs, and automate shipment tracking.'
    }
  },
  'hospitality': {
    primaryMetrics: ['new_customers', 'customer_satisfaction', 'revenue_increase', 'time_savings'],
    secondaryMetrics: ['response_time', 'availability', 'error_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaši provozovnu',
      en: 'Expected benefits for your establishment'
    },
    valueProposition: {
      cs: 'AI přiláká více hostů, zlepší jejich zážitek a automatizuje rezervace.',
      en: 'AI will attract more guests, improve their experience, and automate reservations.'
    }
  },
  'generic': {
    primaryMetrics: ['time_savings', 'revenue_increase', 'cost_reduction', 'new_customers'],
    secondaryMetrics: ['customer_satisfaction', 'error_reduction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši firmu',
      en: 'Expected benefits for your company'
    },
    valueProposition: {
      cs: 'AI ušetří čas, zvýší efektivitu a pomůže vám růst rychleji.',
      en: 'AI will save time, increase efficiency, and help you grow faster.'
    }
  }
};

// =============================================================================
// DETECTION FUNCTIONS
// =============================================================================

/**
 * Detect business type from industry string
 */
export function detectBusinessType(industry: string | undefined): BusinessType {
  if (!industry) return 'generic';

  const lowerIndustry = industry.toLowerCase();

  // Check each business type's keywords
  for (const [businessType, keywords] of Object.entries(BUSINESS_TYPE_KEYWORDS)) {
    if (businessType === 'generic') continue;

    for (const keyword of keywords) {
      if (lowerIndustry.includes(keyword.toLowerCase())) {
        return businessType as BusinessType;
      }
    }
  }

  return 'generic';
}

/**
 * Get metrics configuration for a business type
 */
export function getBusinessTypeMetrics(businessType: BusinessType): BusinessTypeMetricsConfig {
  return BUSINESS_TYPE_METRICS[businessType] || BUSINESS_TYPE_METRICS['generic'];
}

/**
 * Get primary metrics for a detected industry
 */
export function getPrimaryMetricsForIndustry(industry: string | undefined): BenefitTypeKey[] {
  const businessType = detectBusinessType(industry);
  return BUSINESS_TYPE_METRICS[businessType]?.primaryMetrics || BUSINESS_TYPE_METRICS['generic'].primaryMetrics;
}
