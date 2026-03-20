// =============================================================================
// QUERY GENERATOR - Search query generation logic
// =============================================================================

import type { AuditFormInputs, QuerySets } from './types';
import { extractDomain } from './config';
import { clientConfig } from '../../_config/client';

// =============================================================================
// QUERY GENERATION
// =============================================================================

/**
 * Resolve placeholders in a query string with actual form data values.
 * Supports: {companyName}, {city}, {domain}, {industry}
 */
function resolvePlaceholders(
  query: string,
  formData: AuditFormInputs,
  domain: string | null,
): string {
  return query
    .replace(/\{companyName\}/g, formData.companyName)
    .replace(/\{city\}/g, formData.city)
    .replace(/\{domain\}/g, domain ?? '')
    .replace(/\{industry\}/g, formData.industry);
}

/**
 * Generate search queries split into categories
 * v3: Added technology stack and app detection queries
 * v4: Config-driven additionalQueries, industryKeywords, maxQueries, disabledQueryTypes
 */
export function generateQuerySets(formData: AuditFormInputs): QuerySets {
  const { companyName, city, industry, language, website } = formData;

  // Extract domain for specific searches
  const domain = extractDomain(website);

  // Detect industry for AI tools search
  const industryKeywords = detectIndustryKeywords(industry, language);

  // Read config-driven search settings
  const disabledTypes = clientConfig.search?.disabledQueryTypes ?? [];
  const maxQueries = clientConfig.search.maxQueries;
  const additionalQueries = clientConfig.search?.additionalQueries ?? [];

  // Defensive: ensure at least generic or domainSpecific remains enabled
  const safeDisabled = (
    disabledTypes.includes('generic') && disabledTypes.includes('domainSpecific')
  )
    ? disabledTypes.filter((t) => t !== 'generic')
    : disabledTypes;

  // Helper: return queries for a type only if not disabled
  const ifEnabled = (type: string, queries: string[]): string[] =>
    safeDisabled.includes(type) ? [] : queries;

  let querySets: QuerySets;

  if (language === 'cs') {
    querySets = {
      generic: ifEnabled('generic', [
        `"${companyName}" ${city} IČO rejstřík firem informace o společnosti`,
        `"${companyName}" novinky reference recenze`
      ]),
      domainSpecific: ifEnabled('domainSpecific', [
        `"${companyName}" služby produkty nabídka v čem podniká předmět podnikání`
      ]),
      technology: ifEnabled('technology', [
        `"${companyName}" technologie software platforma systém používá ${domain ? `site:${domain}` : ''}`
      ]),
      apps: ifEnabled('apps', [
        `"${companyName}" mobilní aplikace software produkt iOS Android web app`
      ]),
      aiTools: ifEnabled('aiTools', [
        `best AI tools ${industryKeywords} automation 2026 chatbot voicebot links`
      ])
    };
  } else {
    querySets = {
      generic: ifEnabled('generic', [
        `"${companyName}" ${city} company registry business information`,
        `"${companyName}" news reviews testimonials`
      ]),
      domainSpecific: ifEnabled('domainSpecific', [
        `"${companyName}" services products business type industry`
      ]),
      technology: ifEnabled('technology', [
        `"${companyName}" technology stack software platform system uses ${domain ? `site:${domain}` : ''}`
      ]),
      apps: ifEnabled('apps', [
        `"${companyName}" mobile app software product iOS Android web application`
      ]),
      aiTools: ifEnabled('aiTools', [
        `best AI tools ${industryKeywords} automation 2026 chatbot voicebot`
      ])
    };
  }

  // Merge additional queries (resolve placeholders, group by type)
  for (const aq of additionalQueries) {
    const resolved = resolvePlaceholders(aq.query, formData, domain);
    const targetType = aq.type as keyof QuerySets;
    if (querySets[targetType]) {
      querySets[targetType].push(resolved);
    } else {
      // Unknown type falls into generic
      querySets.generic.push(resolved);
    }
  }

  // Enforce maxQueries cap across all query sets
  let totalCount = Object.values(querySets).reduce((sum, arr) => sum + arr.length, 0);
  if (totalCount > maxQueries) {
    // Truncate from the end of each set proportionally, starting from aiTools backwards
    const setOrder: (keyof QuerySets)[] = ['aiTools', 'apps', 'technology', 'domainSpecific', 'generic'];
    for (const key of setOrder) {
      if (totalCount <= maxQueries) break;
      const excess = totalCount - maxQueries;
      const canRemove = Math.min(excess, querySets[key].length);
      if (canRemove > 0) {
        querySets[key] = querySets[key].slice(0, querySets[key].length - canRemove);
        totalCount -= canRemove;
      }
    }
  }

  return querySets;
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

  // Extend with config-driven industry keywords
  const configKeywords = clientConfig.search?.industryKeywords;
  if (configKeywords) {
    for (const [key, value] of Object.entries(configKeywords)) {
      industryMap[key] = value;
    }
  }

  return industryMap[industry] || industryMap['other'];
}
