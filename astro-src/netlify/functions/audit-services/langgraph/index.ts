// =============================================================================
// LANGGRAPH MODULE - Central export point
// =============================================================================
// Re-exports all langgraph functionality for backwards compatibility
// =============================================================================

// Types
export type {
  AuditFormInputs,
  ResearchResult,
  ProgressCallback,
  ResearchStep,
  TavilySearchResult,
  SearchResultItem,
  QuerySets,
  SearchTask,
  TavilyClient,
  SynthesisResult,
  ModelConfig
} from './types';

// Config
export {
  RESEARCH_STEPS,
  MODEL_CONFIGS,
  extractDomain,
  generateReportId
} from './config';

// Tavily Search
export {
  executeTavilySearch,
  createTavilyClient
} from './tavily-search';

// Query Generator
export {
  generateQuerySets,
  detectIndustryKeywords
} from './query-generator';

// Prompt Generator
export { generateResearchPrompt } from './prompt-generator';

// Industry Recommendations
export { getIndustrySpecificRecommendations } from './industry-recommendations';

// LLM Synthesizer
export { synthesizeStructuredReport } from './llm-synthesizer';

// Fallback Report
export {
  generateFallbackBenefitsSummary,
  generateDefaultQuestions,
  generateDefaultOpportunities,
  generateDefaultTools,
  generateDefaultTimeline,
  generateDefaultRisks,
  generateAgentFallbackReport
} from './fallback-report';

// Executor (Main Entry Points)
export {
  executeSearchesWithProgress,
  executeParallelSearches,
  formatSearchResultsForPrompt,
  executeDeepResearch
} from './executor';
