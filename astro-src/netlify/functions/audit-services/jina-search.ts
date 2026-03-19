// =============================================================================
// JINA AI SEARCH SERVICE - Web Research Module
// =============================================================================
// Uses Jina AI's search API to gather information about companies and industries
// for the automated pre-audit system.
// Enhanced with X-Site header for domain-specific searches and X-Engine: direct.
// =============================================================================

export interface JinaSearchResult {
  query: string;
  results: string;
  success: boolean;
  error?: string;
  siteRestricted?: boolean;
}

export interface JinaSearchOptions {
  site?: string;  // Domain to restrict search to via X-Site header
}

export interface AuditResearchData {
  companyWebsite: JinaSearchResult;   // Site-specific: main website content
  companyServices: JinaSearchResult;  // Site-specific: services/products
  companyAbout: JinaSearchResult;     // Site-specific: about/team page
  companyRegistry: JinaSearchResult;  // Open web: business registry
  companyNews: JinaSearchResult;      // Open web: news/reviews
  companyLogoUrl?: string;
}

/**
 * Perform a single Jina AI search with optional site restriction
 */
async function jinaSearch(
  query: string, 
  apiKey: string,
  options?: JinaSearchOptions
): Promise<JinaSearchResult> {
  const siteInfo = options?.site ? ` [Site: ${options.site}]` : ' [Open Web]';
  console.log(`[Jina] Searching for: "${query}"${siteInfo}`);
  
  try {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://s.jina.ai/?q=${encodedQuery}`;
    
    // Add 8 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // Build headers with X-Engine and optional X-Site
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Engine': 'direct'
    };
    
    // Add site restriction header if provided
    if (options?.site) {
      headers['X-Site'] = options.site;
      console.log(`[Jina] Using X-Site header: ${options.site}`);
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Jina] API error for "${query}":`, response.status, errorText);
      return {
        query,
        results: '',
        success: false,
        error: `API error: ${response.status}`,
        siteRestricted: !!options?.site
      };
    }

    const data = await response.json();
    console.log(`[Jina] Response received for "${query}"`);
    
    // Extract and format results
    let formattedResults = '';
    if (data.data && Array.isArray(data.data)) {
      console.log(`[Jina] Found ${data.data.length} results for "${query}"${siteInfo}`);
      formattedResults = data.data.slice(0, 5).map((item: any, idx: number) => {
        const title = item.title || 'No title';
        const content = item.description || item.content || 'No content';
        console.log(`[Jina] Result ${idx + 1}: ${title.substring(0, 50)}... (${content.length} chars)`);
        return `**${title}**\n${content}\nURL: ${item.url || 'N/A'}\n`;
      }).join('\n---\n');
    } else if (typeof data === 'string') {
      console.log(`[Jina] Received string response for "${query}" (${data.length} chars)`);
      formattedResults = data;
    } else {
      console.log(`[Jina] Received structured response for "${query}"`);
      formattedResults = JSON.stringify(data, null, 2);
    }

    return {
      query,
      results: formattedResults || 'No results found',
      success: true,
      siteRestricted: !!options?.site
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`[Jina] Timeout for "${query}" (8s limit exceeded)`);
      return {
        query,
        results: '',
        success: false,
        error: 'Search timed out',
        siteRestricted: !!options?.site
      };
    }
    console.error(`[Jina] Exception for "${query}":`, error);
    return {
      query,
      results: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      siteRestricted: !!options?.site
    };
  }
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0];
  }
}

/**
 * Get full site URL for X-Site header
 */
function getFullSiteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
}

/**
 * Form inputs for audit research
 */
export interface AuditFormInputs {
  website: string;
  companyName: string;
  industry: string;
  city: string;
  companySize: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

/**
 * Search query definition with optional site restriction
 */
interface SearchQuery {
  key: keyof Omit<AuditResearchData, 'companyLogoUrl'>;
  query: string;
  site?: string;
}

/**
 * Generate search queries based on form data
 * Uses hybrid strategy: site-specific for company data, open web for registry/news
 */
function generateSearchQueries(formData: AuditFormInputs): SearchQuery[] {
  const fullSiteUrl = getFullSiteUrl(formData.website);
  const companyName = formData.companyName;
  const city = formData.city;
  
  if (formData.language === 'cs') {
    return [
      // Site-specific queries (with X-Site header) - get data from company website
      {
        key: 'companyWebsite',
        query: companyName,
        site: fullSiteUrl
      },
      {
        key: 'companyServices',
        query: 'služby produkty nabídka portfolio ceník',
        site: fullSiteUrl
      },
      {
        key: 'companyAbout',
        query: 'o nás o společnosti o firmě kontakt tým reference',
        site: fullSiteUrl
      },
      // Open web queries (no site restriction) - get external data
      {
        key: 'companyRegistry',
        query: `"${companyName}" ${city} rejstřík firem IČO obchodní rejstřík`
      },
      {
        key: 'companyNews',
        query: `"${companyName}" ${city} novinky reference recenze hodnocení`
      }
    ];
  }
  
  // English queries
  return [
    // Site-specific queries
    {
      key: 'companyWebsite',
      query: companyName,
      site: fullSiteUrl
    },
    {
      key: 'companyServices',
      query: 'services products offerings portfolio pricing',
      site: fullSiteUrl
    },
    {
      key: 'companyAbout',
      query: 'about us company team contact references',
      site: fullSiteUrl
    },
    // Open web queries
    {
      key: 'companyRegistry',
      query: `"${companyName}" ${city} company registry business registration`
    },
    {
      key: 'companyNews',
      query: `"${companyName}" news reviews testimonials`
    }
  ];
}

/**
 * Perform comprehensive audit research using Jina AI
 * Uses hybrid search strategy: site-specific + open web searches
 * Executes all searches in parallel for performance
 */
export async function performAuditResearch(
  formData: AuditFormInputs,
  apiKey: string
): Promise<AuditResearchData> {
  const queries = generateSearchQueries(formData);
  
  console.log(`[Jina] Starting research for: ${formData.companyName} (${formData.website})`);
  console.log(`[Jina] Query strategy: ${queries.filter(q => q.site).length} site-specific, ${queries.filter(q => !q.site).length} open web`);
  
  // Execute all searches in parallel
  const results = await Promise.all(
    queries.map(q => jinaSearch(
      q.query, 
      apiKey, 
      q.site ? { site: q.site } : undefined
    ))
  );
  
  // Map results to research data structure
  const researchData: Partial<AuditResearchData> = {};
  queries.forEach((q, idx) => {
    researchData[q.key] = results[idx];
  });

  // Get company logo from Clearbit
  const domain = extractDomain(formData.website);
  const companyLogoUrl = `https://logo.clearbit.com/${domain}`;
  
  // Log summary
  const successCount = results.filter(r => r.success).length;
  console.log(`[Jina] Research completed: ${successCount}/${results.length} queries successful`);

  return {
    companyWebsite: researchData.companyWebsite!,
    companyServices: researchData.companyServices!,
    companyAbout: researchData.companyAbout!,
    companyRegistry: researchData.companyRegistry!,
    companyNews: researchData.companyNews!,
    companyLogoUrl
  };
}

/**
 * Format research data into a string for the AI prompt
 */
export function formatResearchForPrompt(research: AuditResearchData): string {
  const sections = [
    {
      title: 'Company Website Content (from company site)',
      data: research.companyWebsite,
      icon: '🌐'
    },
    {
      title: 'Company Services & Products (from company site)',
      data: research.companyServices,
      icon: '📦'
    },
    {
      title: 'About the Company (from company site)',
      data: research.companyAbout,
      icon: '👥'
    },
    {
      title: 'Company Registry & Business Data (public records)',
      data: research.companyRegistry,
      icon: '📋'
    },
    {
      title: 'News & Reviews (public sources)',
      data: research.companyNews,
      icon: '📰'
    }
  ];

  return sections.map(section => {
    const status = section.data.success ? '✓' : '✗';
    const source = section.data.siteRestricted ? '[Site-Specific]' : '[Open Web]';
    const content = section.data.success 
      ? section.data.results 
      : `Research unavailable: ${section.data.error || 'Unknown error'}`;
    
    return `### ${section.icon} ${section.title} ${status} ${source}\n**Query:** ${section.data.query}\n\n${content}`;
  }).join('\n\n---\n\n');
}
