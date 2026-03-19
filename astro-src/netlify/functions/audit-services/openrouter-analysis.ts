// =============================================================================
// OPENROUTER ANALYSIS SERVICE - LEGACY/FALLBACK Module
// =============================================================================
// This file is kept for backward compatibility with the PDF generator.
// The main AI analysis is now handled by the LangGraph Deep Research Agent.
// Only the AuditFormData interface and fallback report function are used.
// =============================================================================

import { clientConfig } from '../../_config/client';

export interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  industry: string;
  city: string;
  companySize?: string; // Optional for backward compatibility
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

/**
 * Company size details for ROI calculations (kept for PDF generator compatibility)
 */
interface CompanySizeDetails {
  employeeRange: string;
  avgEmployees: number;
  revenueRange: string;
  avgHourlyRate: number;
  currency: string;
}

/**
 * Get company size details based on size category and language
 * Used by PDF generator for ROI estimation section
 */
export function getCompanySizeDetails(size: string | undefined, language: 'cs' | 'en'): CompanySizeDetails {
  const isCzech = language === 'cs';
  const currency = isCzech ? 'Kč' : '$';
  
  const sizes: Record<string, CompanySizeDetails> = {
    'micro': {
      employeeRange: isCzech ? '1-10 zaměstnanců' : '1-10 employees',
      avgEmployees: 5,
      revenueRange: isCzech ? '1-10 mil. Kč ročně' : '$50K-$500K annually',
      avgHourlyRate: isCzech ? 350 : 25,
      currency
    },
    'small': {
      employeeRange: isCzech ? '11-50 zaměstnanců' : '11-50 employees',
      avgEmployees: 25,
      revenueRange: isCzech ? '10-50 mil. Kč ročně' : '$500K-$2.5M annually',
      avgHourlyRate: isCzech ? 400 : 35,
      currency
    },
    'medium': {
      employeeRange: isCzech ? '51-250 zaměstnanců' : '51-250 employees',
      avgEmployees: 120,
      revenueRange: isCzech ? '50-500 mil. Kč ročně' : '$2.5M-$25M annually',
      avgHourlyRate: isCzech ? 500 : 50,
      currency
    },
    'large': {
      employeeRange: isCzech ? '250+ zaměstnanců' : '250+ employees',
      avgEmployees: 500,
      revenueRange: isCzech ? '500+ mil. Kč ročně' : '$25M+ annually',
      avgHourlyRate: isCzech ? 600 : 75,
      currency
    }
  };
  
  // Default to 'small' if size not provided or invalid
  return sizes[size || 'small'] || sizes['small'];
}

/**
 * Generate a fallback report if AI analysis fails
 * @deprecated Use generateAgentFallbackReport from langgraph-agent.ts instead
 */
export function generateFallbackReport(formData: AuditFormData): string {
  const isCzech = formData.language === 'cs';
  const companyName = formData.companyName || formData.website;
  const title = isCzech ? `Hloubkový AI Audit pro ${companyName}` : `Deep AI Audit for ${companyName}`;
  
  if (isCzech) {
    return `
# 🎯 ${title}

## Děkujeme za váš zájem!

Obdrželi jsme vaši žádost o AI audit a náš tým ji právě zpracovává.

**Vaše údaje:**
- Web: ${formData.website}
- Odvětví: ${formData.industry}
- Město: ${formData.city}
- Používané nástroje: ${formData.currentTools || 'Neuvedeno'}
- Co chcete zefektivnit: ${formData.biggestPainPoint || 'Neuvedeno'}

## Další kroky

1. **Do 24 hodin** vás bude kontaktovat náš konzultant
2. Naplánujeme **30minutovou bezplatnou konzultaci**
3. Připravíme **detailní analýzu** na míru vašim potřebám

## Kontakt

${clientConfig.primaryContact.name} (${clientConfig.primaryContact.title})
📧 ${clientConfig.primaryContact.email}
📞 ${clientConfig.primaryContact.phone}
🌐 ${clientConfig.siteUrl.replace('https://', '')}

---
*${clientConfig.company.name} - Váš AI transformační partner*
    `.trim();
  }

  return `
# 🎯 ${title}

## Thank you for your interest!

We have received your AI audit request and our team is processing it.

**Your Information:**
- Website: ${formData.website}
- Industry: ${formData.industry}
- City: ${formData.city}
- Tools Used: ${formData.currentTools || 'Not specified'}
- What to Optimize: ${formData.biggestPainPoint || 'Not specified'}

## Next Steps

1. A consultant will contact you **within 24 hours**
2. We'll schedule a **free 30-minute consultation**
3. We'll prepare a **detailed analysis** tailored to your needs

## Contact

${clientConfig.primaryContact.name} (${clientConfig.primaryContact.title})
📧 ${clientConfig.primaryContact.email}
📞 ${clientConfig.primaryContact.phone}
🌐 ${clientConfig.siteUrl.replace('https://', '')}

---
*${clientConfig.company.name} - Your AI Transformation Partner*
  `.trim();
}
