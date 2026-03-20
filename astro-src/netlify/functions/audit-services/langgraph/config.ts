// =============================================================================
// LANGGRAPH CONFIG - Configuration constants and step definitions
// =============================================================================

import type { ResearchStep, ModelConfig } from './types';
import { clientConfig } from '../../_config/client';

// =============================================================================
// RESEARCH STEP CONFIGURATION
// =============================================================================

/**
 * Step configuration for progress tracking
 */
export const RESEARCH_STEPS: Record<ResearchStep, { progress: number; messageCs: string; messageEn: string }> = {
  'fetch_branding': { progress: 28, messageCs: 'Načítám branding společnosti...', messageEn: 'Fetching company branding...' },
  'search_company_info': { progress: 30, messageCs: 'Hledám informace o společnosti...', messageEn: 'Searching company information...' },
  'search_company_news': { progress: 34, messageCs: 'Hledám novinky a reference...', messageEn: 'Searching news and references...' },
  'search_website': { progress: 38, messageCs: 'Analyzuji webové stránky...', messageEn: 'Analyzing website content...' },
  'search_technologies': { progress: 42, messageCs: 'Zjišťuji používané technologie...', messageEn: 'Detecting technologies used...' },
  'search_company_apps': { progress: 46, messageCs: 'Hledám firemní aplikace a software...', messageEn: 'Searching for company apps...' },
  'search_ai_tools': { progress: 50, messageCs: 'Hledám AI nástroje pro vaše odvětví...', messageEn: 'Searching AI tools for your industry...' },
  'llm_analyzing': { progress: 55, messageCs: 'AI analyzuje výsledky výzkumu...', messageEn: 'AI analyzing research results...' },
  'building_report': { progress: 58, messageCs: 'Sestavuji report...', messageEn: 'Building report...' }
};

// =============================================================================
// MODEL CONFIGURATIONS (config-driven with backward-compatible defaults)
// =============================================================================

/** Default models used when clientConfig provides an empty array or no override */
const DEFAULT_PRIMARY_MODELS = [
  'google/gemini-3-flash-preview',
  'google/gemini-3-pro-preview',
  'anthropic/claude-sonnet-4.5',
];

const DEFAULT_FALLBACK_MODELS = [
  'anthropic/claude-sonnet-4.5',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-3-flash-preview',
];

/**
 * Model configurations for LLM synthesis (primary + fallback).
 * Reads from clientConfig.llm with safe fallbacks to hardcoded defaults.
 */
function buildModelConfigs(): ModelConfig[] {
  const primary = clientConfig.llm.primary;
  const fallback = clientConfig.llm.fallback;

  return [
    {
      name: 'Primary',
      models: primary.models.length > 0 ? [...primary.models] : DEFAULT_PRIMARY_MODELS,
      temperature: primary.temperature,
      maxRetries: primary.maxRetries,
    },
    {
      name: 'Fallback',
      models: fallback.models.length > 0 ? [...fallback.models] : DEFAULT_FALLBACK_MODELS,
      temperature: fallback.temperature,
      maxRetries: fallback.maxRetries,
    },
  ];
}

export const MODEL_CONFIGS: ModelConfig[] = buildModelConfigs();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract domain from website URL
 */
export function extractDomain(website: string): string | null {
  try {
    if (!website) return null;
    let urlString = website.trim();
    if (!urlString.startsWith('http')) {
      urlString = `https://${urlString}`;
    }
    const url = new URL(urlString);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    return null;
  }
}

/**
 * Generate unique report ID
 */
export function generateReportId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
