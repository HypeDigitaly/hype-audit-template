// =============================================================================
// TAVILY SEARCH - Tavily API search execution
// =============================================================================

import { tavily } from '@tavily/core';
import type {
  TavilySearchResult,
  SearchResultItem,
  TavilyClient
} from './types';

// =============================================================================
// TAVILY SEARCH IMPLEMENTATION
// =============================================================================

/**
 * Execute a single Tavily search with advanced options and detailed logging
 */
export async function executeTavilySearch(
  client: TavilyClient,
  query: string,
  type: TavilySearchResult['type'],
  domain: string | null = null
): Promise<TavilySearchResult> {
  const options: Record<string, unknown> = {
    maxResults: 5,
    searchDepth: 'advanced',
    includeImages: true,
    includeImageDescriptions: true,
    includeUsage: true,
    includeRawContent: 'markdown',
  };

  if (type === 'domain-specific' && domain) {
    options.includeDomains = [domain];
  }

  console.log(`[Tavily] [${type.toUpperCase()}] Request: "${query}"`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for advanced search

    const response = await client.search(query, options);
    clearTimeout(timeoutId);

    // Diagnostic log to verify response keys (can be removed later)
    if (response.results?.[0]) {
      console.log(`[Tavily] Response keys found: ${Object.keys(response.results[0]).join(', ')}`);
    }

    // OPTIMIZED: Truncate rawContent to 2000 chars to reduce token usage (was consuming ~1M tokens)
    const results: SearchResultItem[] = (response.results || []).map((r: Record<string, unknown>) => {
      const rawContent = (r.rawContent as string) || (r.raw_content as string) || '';
      const truncatedRaw = rawContent.length > 2000 ? rawContent.substring(0, 2000) + '...' : rawContent;

      return {
        title: (r.title as string) || 'No title',
        url: (r.url as string) || '',
        content: (r.content as string) || (r.snippet as string) || '',
        rawContent: truncatedRaw,
        score: r.score as number | undefined
      };
    });

    const totalRawLength = results.reduce((sum: number, r: SearchResultItem) => sum + (r.rawContent?.length || 0), 0);
    const totalContentLength = results.reduce((sum: number, r: SearchResultItem) => sum + (r.content?.length || 0), 0);

    console.log(`[Tavily] Response success: ${results.length} results found`);
    console.log(`[Tavily] Content length: ${totalContentLength} chars (snippets)`);
    console.log(`[Tavily] Raw content length: ${totalRawLength} chars (markdown)`);

    // Log snippets for each result
    results.forEach((r: SearchResultItem, idx: number) => {
      const snippet = r.content.substring(0, 150).replace(/\n/g, ' ');
      console.log(`[Tavily]   Result #${idx + 1}: ${r.title.substring(0, 50)}... (${r.rawContent?.length || 0} chars)`);
      console.log(`[Tavily]       Snippet: "${snippet}..."`);
    });

    return {
      query,
      results,
      images: response.images,
      usage: (response as any).usage,
      success: true,
      type
    };
  } catch (error) {
    console.error(`[Tavily] [${type.toUpperCase()}] Search failed for "${query}":`, error instanceof Error ? error.message : error);
    return {
      query,
      results: [],
      success: false,
      type
    };
  }
}

/**
 * Create a Tavily client instance
 */
export function createTavilyClient(apiKey: string): TavilyClient {
  return tavily({ apiKey });
}
