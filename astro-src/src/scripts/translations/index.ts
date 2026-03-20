/**
 * Modular Translation System
 *
 * This file merges all translation modules into a single translations object
 * for backward compatibility with existing code.
 */

import type { Language } from './types';
import { coreTranslations, type CoreKeys } from './core';
import { auditTranslations, type AuditKeys } from './audit';
import { surveyTranslations, type SurveyKeys } from './survey';
import { legalTranslations, type LegalKeys } from './legal';
import { miscTranslations, type MiscKeys } from './misc';

// Re-export the Language type
export type { Language } from './types';

/**
 * Combined interface containing all translation keys
 * Extends all module interfaces for complete type safety
 */
export interface TranslationKeys extends
  CoreKeys,
  AuditKeys,
  SurveyKeys,
  LegalKeys,
  MiscKeys {
  // Index signature for dynamic key access (legacy support)
  [key: string]: string;
}

/**
 * Merges all module translations into a single object for a given language
 */
function mergeTranslations(lang: Language): TranslationKeys {
  return {
    ...coreTranslations[lang],
    ...auditTranslations[lang],
    ...surveyTranslations[lang],
    ...legalTranslations[lang],
    ...miscTranslations[lang],
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
