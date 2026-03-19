// =============================================================================
// QUERY GENERATOR - Search query generation logic
// =============================================================================

import type { AuditFormInputs, QuerySets } from './types';
import { extractDomain } from './config';

// =============================================================================
// QUERY GENERATION
// =============================================================================

/**
 * Generate search queries split into categories
 * v3: Added technology stack and app detection queries
 */
export function generateQuerySets(formData: AuditFormInputs): QuerySets {
  const { companyName, city, industry, language, website } = formData;

  // Extract domain for specific searches
  const domain = extractDomain(website);

  // Detect industry for AI tools search
  const industryKeywords = detectIndustryKeywords(industry, language);

  if (language === 'cs') {
    return {
      generic: [
        `"${companyName}" ${city} IČO rejstřík firem informace o společnosti`,
        `"${companyName}" novinky reference recenze`
      ],
      domainSpecific: [
        `"${companyName}" služby produkty nabídka v čem podniká předmět podnikání`
      ],
      technology: [
        `"${companyName}" technologie software platforma systém používá ${domain ? `site:${domain}` : ''}`
      ],
      apps: [
        `"${companyName}" mobilní aplikace software produkt iOS Android web app`
      ],
      aiTools: [
        `best AI tools ${industryKeywords} automation 2026 chatbot voicebot links`
      ]
    };
  }

  return {
    generic: [
      `"${companyName}" ${city} company registry business information`,
      `"${companyName}" news reviews testimonials`
    ],
    domainSpecific: [
      `"${companyName}" services products business type industry`
    ],
    technology: [
      `"${companyName}" technology stack software platform system uses ${domain ? `site:${domain}` : ''}`
    ],
    apps: [
      `"${companyName}" mobile app software product iOS Android web application`
    ],
    aiTools: [
      `best AI tools ${industryKeywords} automation 2026 chatbot voicebot`
    ]
  };
}

/**
 * Detect industry keywords for AI tools search
 */
export function detectIndustryKeywords(industry: string, language: 'cs' | 'en'): string {
  const industryMap: Record<string, string> = {
    'it_software': 'software development coding programming',
    'manufacturing': 'manufacturing production factory',
    'retail': 'retail ecommerce sales',
    'finance': 'finance banking accounting',
    'healthcare': 'healthcare medical',
    'construction': 'construction real estate',
    'logistics': 'logistics shipping supply chain',
    'marketing': 'marketing agency advertising digital marketing',
    'education': 'education training learning',
    'public': 'government public sector',
    'other': 'business SMB'
  };

  return industryMap[industry] || industryMap['other'];
}
