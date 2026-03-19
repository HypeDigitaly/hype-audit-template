/**
 * Modular Translation System
 *
 * This file merges all translation modules into a single translations object
 * for backward compatibility with existing code.
 */

import type { Language } from './types';
import { coreTranslations, type CoreKeys } from './core';
import { landingTranslations, type LandingKeys } from './landing';
import { servicePagesTranslations, type ServicePagesKeys } from './service-pages';
import { chatbotTranslations, type ChatbotKeys } from './chatbot';
import { contactTranslations, type ContactKeys } from './contact';
import { consultTranslations, type ConsultKeys } from './consult';
import { dataprepTranslations, type DataprepKeys } from './dataprep';
import { auditTranslations, type AuditKeys } from './audit';
import { surveyTranslations, type SurveyKeys } from './survey';
import { blogTranslations, type BlogKeys } from './blog';
import { legalTranslations, type LegalKeys } from './legal';
import { miscTranslations, type MiscKeys } from './misc';
import { onboardingTranslations, type OnboardingKeys } from './onboarding';
import { pricingTranslations, type PricingKeys } from './pricing';

// Re-export the Language type
export type { Language } from './types';

/**
 * Combined interface containing all translation keys
 * Extends all module interfaces for complete type safety
 */
export interface TranslationKeys extends
  CoreKeys,
  LandingKeys,
  ServicePagesKeys,
  ChatbotKeys,
  ContactKeys,
  ConsultKeys,
  DataprepKeys,
  AuditKeys,
  SurveyKeys,
  BlogKeys,
  LegalKeys,
  MiscKeys,
  OnboardingKeys,
  PricingKeys {
  // Index signature for dynamic key access (legacy support)
  [key: string]: string;
}

/**
 * Merges all module translations into a single object for a given language
 */
function mergeTranslations(lang: Language): TranslationKeys {
  return {
    ...coreTranslations[lang],
    ...landingTranslations[lang],
    ...servicePagesTranslations[lang],
    ...chatbotTranslations[lang],
    ...contactTranslations[lang],
    ...consultTranslations[lang],
    ...dataprepTranslations[lang],
    ...auditTranslations[lang],
    ...surveyTranslations[lang],
    ...blogTranslations[lang],
    ...legalTranslations[lang],
    ...miscTranslations[lang],
    ...onboardingTranslations[lang],
    ...pricingTranslations[lang],
  } as TranslationKeys;
}

/**
 * Main translations object containing all translations for both languages
 */
export const translations: Record<Language, TranslationKeys> = {
  cs: mergeTranslations('cs'),
  en: mergeTranslations('en'),
};

/**
 * Helper function for key-based translation lookup
 * @param key - The translation key to look up
 * @param lang - The language to use (defaults to Czech)
 * @returns The translated string or the key itself if not found
 */
export function t(key: string, lang: Language = 'cs'): string {
  return translations[lang][key] || key;
}

/**
 * Generates a localized href for internal navigation links.
 * - Czech (cs): Returns clean URL (default language, no param needed)
 * - English (en): Appends ?lang=en to the URL
 *
 * Handles existing query parameters and hash fragments properly.
 */
export function getLocalizedHref(path: string, lang: Language): string {
  // Czech is default - return clean URL
  if (lang === 'cs') {
    return path;
  }

  // For English, append ?lang=en
  // Handle paths with existing query params or hash
  if (path.includes('?')) {
    // Already has query params - append &lang=en
    const [basePath, queryAndHash] = path.split('?');
    if (queryAndHash.includes('#')) {
      const [query, hash] = queryAndHash.split('#');
      return `${basePath}?${query}&lang=en#${hash}`;
    }
    return `${path}&lang=en`;
  } else if (path.includes('#')) {
    // Has hash but no query - insert ?lang=en before hash
    const [basePath, hash] = path.split('#');
    return `${basePath}?lang=en#${hash}`;
  }

  // Simple path - just append ?lang=en
  return `${path}?lang=en`;
}
