// =============================================================================
// EXECUTOR - Main research orchestration
// =============================================================================

import { tavily } from '@tavily/core';
import type {
  AuditFormInputs,
  ResearchResult,
  ProgressCallback,
  TavilySearchResult,
  SearchTask
} from './types';
import type { AuditReportData } from '../html-report-generator';
import { RESEARCH_STEPS, extractDomain, generateReportId } from './config';
import { executeTavilySearch } from './tavily-search';
import { generateQuerySets } from './query-generator';
import { generateResearchPrompt } from './prompt-generator';
import { synthesizeStructuredReport } from './llm-synthesizer';
import { generateFallbackBenefitsSummary } from './fallback-report';
import { clientConfig } from '../../_config/client';

// =============================================================================
// SEARCH EXECUTION
// =============================================================================

/**
 * Execute all searches with progress callbacks
 * v3: Added technology and app searches, sequential execution for progress tracking
 */
export async function executeSearchesWithProgress(
  apiKey: string,
  formData: AuditFormInputs,
  onProgress?: ProgressCallback
): Promise<TavilySearchResult[]> {
  const client = tavily({ apiKey });
  const querySets = generateQuerySets(formData);
  const domain = extractDomain(formData.website);
  const isCzech = formData.language === 'cs';

  // Read disabled query types for filtering
  const disabledTypes = clientConfig.search?.disabledQueryTypes ?? [];
  // Defensive: ensure at least generic or domainSpecific remains
  const safeDisabled = (
    disabledTypes.includes('generic') && disabledTypes.includes('domainSpecific')
  )
    ? disabledTypes.filter((t) => t !== 'generic')
    : disabledTypes;

  // Map query set keys to SearchTask type slugs used in TavilySearchResult
  const typeMapping: Record<string, SearchTask['type']> = {
    generic: 'generic',
    domainSpecific: 'domain-specific',
    technology: 'technology',
    apps: 'apps',
    aiTools: 'ai-tools',
  };

  // Map query set keys to their default progress step
  const stepMapping: Record<string, SearchTask['step']> = {
    generic_0: 'search_company_info',
    generic_1: 'search_company_news',
    domainSpecific_0: 'search_website',
    technology_0: 'search_technologies',
    apps_0: 'search_company_apps',
    aiTools_0: 'search_ai_tools',
  };

  // Build tasks from the (already config-filtered) query sets
  const searchTasks: SearchTask[] = [];

  const addTasksForKey = (key: keyof typeof querySets, querySetType: string) => {
    const queries = querySets[key];
    for (let i = 0; i < queries.length; i++) {
      const stepKey = `${key}_${i}`;
      const step = stepMapping[stepKey] ?? 'search_company_info'; // fallback step for additional queries
      const taskType = typeMapping[querySetType] ?? 'generic';
      const taskDomain = key === 'domainSpecific' ? domain : null;
      searchTasks.push({ query: queries[i], type: taskType, domain: taskDomain, step });
    }
  };

  // Add tasks in order (query generator already filters disabled types)
  if (!safeDisabled.includes('generic')) addTasksForKey('generic', 'generic');
  if (!safeDisabled.includes('domainSpecific')) addTasksForKey('domainSpecific', 'domainSpecific');
  if (!safeDisabled.includes('technology')) addTasksForKey('technology', 'technology');
  if (!safeDisabled.includes('apps')) addTasksForKey('apps', 'apps');
  if (!safeDisabled.includes('aiTools')) addTasksForKey('aiTools', 'aiTools');

  console.log(`[Agent] Executing ${searchTasks.length} Tavily searches with progress tracking...`);
  if (domain) {
    console.log(`[Agent] Domain-specific search restricted to: ${domain}`);
  }

  const results: TavilySearchResult[] = [];

  // Execute searches sequentially to provide accurate progress updates
  for (const task of searchTasks) {
    // Report progress before each search
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS[task.step];
      const message = isCzech ? stepConfig.messageCs : stepConfig.messageEn;
      await onProgress(task.step, stepConfig.progress, message);
    }

    // Execute the search
    const result = await executeTavilySearch(client, task.query, task.type, task.domain);
    results.push(result);

    console.log(`[Agent] Search "${task.step}" completed: ${result.success ? 'success' : 'failed'}`);
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`[Agent] Search phase complete: ${successCount}/${searchTasks.length} successful`);

  return results;
}

/**
 * Execute all searches in parallel (legacy function for backward compatibility)
 */
export async function executeParallelSearches(
  apiKey: string,
  formData: AuditFormInputs
): Promise<TavilySearchResult[]> {
  return executeSearchesWithProgress(apiKey, formData);
}

/**
 * Format search results for the LLM prompt - uses FULL rawContent when available
 */
export function formatSearchResultsForPrompt(results: TavilySearchResult[]): string {
  let totalChars = 0;

  const formatted = results.map((result, index) => {
    const items = result.results.map(r => {
      // Use full raw markdown content when available, fallback to snippet
      const contentToUse = r.rawContent && r.rawContent.length > 100 ? r.rawContent : r.content;
      totalChars += contentToUse.length;
      return `- **${r.title}**\n  ${contentToUse}\n  Source: ${r.url}`;
    }).join('\n\n');

    return `### Search ${index + 1} [${result.type}]: "${result.query}"
${result.success ? items || 'No results found' : 'Search failed'}`;
  }).join('\n\n---\n\n');

  console.log(`[Agent] Total search content for LLM: ${totalChars} characters`);

  return formatted;
}

// =============================================================================
// MAIN AGENT EXECUTION
// =============================================================================

/**
 * Execute the Deep Research Agent
 * This is the main entry point called by audit.ts
 * Returns structured AuditReportData instead of markdown
 *
 * v3: Added onProgress callback for real-time status updates
 */
export async function executeDeepResearch(
  formData: AuditFormInputs,
  tavilyApiKey: string,
  openrouterApiKey: string,
  onProgress?: ProgressCallback
): Promise<ResearchResult> {
  console.log(`[Agent] Starting Deep Research Agent v3 for: ${formData.companyName} (${formData.city})`);
  console.log(`[Agent] Language: ${formData.language}, Industry: ${formData.industry}`);

  const isCzech = formData.language === 'cs';

  try {
    // Step 1: Execute Tavily searches with progress tracking
    console.log('[Agent] STEP 1: Executing web research with progress tracking...');
    const searchResults = await executeSearchesWithProgress(tavilyApiKey, formData, onProgress);

    // Separate results by type
    const companyResults = searchResults.filter(r => r.type === 'generic' || r.type === 'domain-specific');
    const technologyResults = searchResults.filter(r => r.type === 'technology');
    const appResults = searchResults.filter(r => r.type === 'apps');
    const aiToolsResults = searchResults.filter(r => r.type === 'ai-tools');

    // Check if we have any successful searches
    const hasCompanyResults = companyResults.some(r => r.success && r.results.length > 0);
    const hasTechResults = technologyResults.some(r => r.success && r.results.length > 0);
    const hasAppResults = appResults.some(r => r.success && r.results.length > 0);
    const hasToolsResults = aiToolsResults.some(r => r.success && r.results.length > 0);

    if (!hasCompanyResults) {
      console.warn('[Agent] No company search results obtained, proceeding with limited data');
    }
    if (!hasTechResults) {
      console.warn('[Agent] No technology search results obtained');
    }
    if (!hasAppResults) {
      console.warn('[Agent] No app search results obtained');
    }
    if (!hasToolsResults) {
      console.warn('[Agent] No AI tools search results obtained');
    }

    // Step 2: Format search results for LLM
    console.log('[Agent] STEP 2: Formatting search data...');
    const companySearchData = formatSearchResultsForPrompt(companyResults);
    const technologySearchData = formatSearchResultsForPrompt(technologyResults);
    const appSearchData = formatSearchResultsForPrompt(appResults);
    const aiToolsSearchData = formatSearchResultsForPrompt(aiToolsResults);

    // Combine all search data with labels
    const allSearchData = `
## COMPANY INFORMATION
${companySearchData}

## TECHNOLOGY STACK RESEARCH
${technologySearchData}

## COMPANY APPS/SOFTWARE RESEARCH
${appSearchData}
`;

    // Step 3: Generate structured research prompt
    console.log('[Agent] STEP 3: Generating structured research prompt...');
    const prompt = generateResearchPrompt(formData, allSearchData, aiToolsSearchData);

    // Step 4: Report LLM analysis progress
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS['llm_analyzing'];
      await onProgress('llm_analyzing', stepConfig.progress, isCzech ? stepConfig.messageCs : stepConfig.messageEn);
    }

    // Step 5: Synthesize structured report with LLM (with retry and model fallback)
    console.log('[Agent] STEP 4: Synthesizing structured report...');
    const synthesisResult = await synthesizeStructuredReport(prompt, openrouterApiKey, formData);

    if (!synthesisResult.success || !synthesisResult.data) {
      console.error('[Agent] Structured report synthesis failed:', synthesisResult.error);
      return {
        success: false,
        error: synthesisResult.error
      };
    }

    if (synthesisResult.usedFallbackModel) {
      console.log('[Agent] ⚠️ Report generated using fallback model (primary model failed)');
    }

    // Step 6: Report building progress
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS['building_report'];
      await onProgress('building_report', stepConfig.progress, isCzech ? stepConfig.messageCs : stepConfig.messageEn);
    }

    // Step 7: Build final AuditReportData
    console.log('[Agent] STEP 5: Building final report data...');
    const reportId = generateReportId();
    const generatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    const reportData: AuditReportData = {
      reportId,
      companyProfile: {
        name: formData.companyName,
        website: formData.website,
        city: formData.city,
        industry: formData.industry,
        detectedIndustry: synthesisResult.data.companyProfile?.detectedIndustry || formData.industry,
        employeeEstimate: synthesisResult.data.companyProfile?.employeeEstimate,
        description: synthesisResult.data.companyProfile?.description
      },
      companyContext: synthesisResult.data.companyContext,
      // New v3 fields
      detectedTechnologies: synthesisResult.data.detectedTechnologies || [],
      hasOwnApplication: synthesisResult.data.hasOwnApplication || false,
      ownApplicationDetails: synthesisResult.data.ownApplicationDetails || null,
      appIntegrationOpportunities: synthesisResult.data.appIntegrationOpportunities || [],
      industryBenchmark: synthesisResult.data.industryBenchmark || null,
      implementationTimeline: synthesisResult.data.implementationTimeline || [],
      riskAssessment: synthesisResult.data.riskAssessment || [],
      // NEW v4: Executive Summary s přínosy (business-type aware)
      expectedBenefitsSummary: synthesisResult.data.expectedBenefitsSummary || generateFallbackBenefitsSummary(
        synthesisResult.data.aiOpportunities || [],
        synthesisResult.data.roiEstimate,
        formData,
        synthesisResult.data.companyProfile?.detectedIndustry
      ),
      // Existing fields
      auditQuestions: synthesisResult.data.auditQuestions || [],
      aiOpportunities: synthesisResult.data.aiOpportunities || [],
      recommendedTools: synthesisResult.data.recommendedTools || [],
      roiEstimate: synthesisResult.data.roiEstimate || {
        totalHoursSavedPerWeek: 20,
        defaultHourlyRate: formData.language === 'cs' ? 400 : 50,
        assumptions: []
      },
      generatedAt,
      expiresAt,
      language: formData.language
    };

    console.log(`[Agent] Deep Research Agent v3 completed successfully. Report ID: ${reportId}`);
    console.log(`[Agent] Questions: ${reportData.auditQuestions.length} categories`);
    console.log(`[Agent] Opportunities: ${reportData.aiOpportunities.length} items`);
    console.log(`[Agent] Tools: ${reportData.recommendedTools.length} recommendations`);
    console.log(`[Agent] Technologies: ${reportData.detectedTechnologies?.length || 0} detected`);
    console.log(`[Agent] Has own app: ${reportData.hasOwnApplication}`);
    console.log(`[Agent] App integrations: ${reportData.appIntegrationOpportunities?.length || 0} suggestions`);

    return {
      success: true,
      reportData
    };

  } catch (error) {
    console.error('[Agent] Critical error in Deep Research Agent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown agent error'
    };
  }
}
