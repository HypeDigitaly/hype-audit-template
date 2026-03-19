// =============================================================================
// LANGGRAPH TYPES - Type definitions for the deep research agent
// =============================================================================

import type { tavily } from '@tavily/core';

// =============================================================================
// FORM INPUTS & RESULTS
// =============================================================================

export interface AuditFormInputs {
  website: string;
  companyName: string;
  city: string;
  industry: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

export interface ResearchResult {
  success: boolean;
  reportData?: import('../html-report-generator').AuditReportData;
  error?: string;
}

// =============================================================================
// PROGRESS TRACKING
// =============================================================================

/**
 * Progress callback for real-time status updates
 */
export type ProgressCallback = (step: ResearchStep, progress: number, message: string) => Promise<void>;

/**
 * Research steps for progress tracking
 */
export type ResearchStep =
  | 'fetch_branding'
  | 'search_company_info'
  | 'search_company_news'
  | 'search_website'
  | 'search_technologies'
  | 'search_company_apps'
  | 'search_ai_tools'
  | 'llm_analyzing'
  | 'building_report';

// =============================================================================
// TAVILY SEARCH TYPES
// =============================================================================

export interface TavilySearchResult {
  query: string;
  results: SearchResultItem[];
  images?: Array<{
    url: string;
    description?: string;
  }>;
  usage?: {
    totalTokens?: number;
    creditUsed?: number;
  };
  success: boolean;
  type: 'generic' | 'domain-specific' | 'ai-tools' | 'technology' | 'apps';
}

export interface SearchResultItem {
  title: string;
  url: string;
  content: string;
  rawContent?: string;
  score?: number;
}

/**
 * Query set interface for organized search queries
 */
export interface QuerySets {
  generic: string[];
  domainSpecific: string[];
  technology: string[];
  apps: string[];
  aiTools: string[];
}

/**
 * Search task definition for sequential execution with progress
 */
export interface SearchTask {
  query: string;
  type: TavilySearchResult['type'];
  domain: string | null;
  step: ResearchStep;
}

// =============================================================================
// TAVILY CLIENT TYPE
// =============================================================================

export type TavilyClient = ReturnType<typeof tavily>;

// =============================================================================
// LLM SYNTHESIS TYPES
// =============================================================================

export interface SynthesisResult {
  success: boolean;
  data?: any;
  error?: string;
  usedFallbackModel?: boolean;
}

export interface ModelConfig {
  name: string;
  models: string[];
  temperature: number;
  maxRetries: number;
}
