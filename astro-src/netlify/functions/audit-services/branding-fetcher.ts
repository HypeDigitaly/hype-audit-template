// =============================================================================
// FIRECRAWL BRANDING FETCHER - Company Branding API Integration
// =============================================================================
// Fetches company branding (logo, colors, fonts) from Firecrawl API v2
// to personalize audit reports with client's brand identity.
//
// API Endpoint: POST https://api.firecrawl.dev/v2/scrape
// Required format: { formats: ["branding"] }
// =============================================================================

export interface CompanyBranding {
  logo?: string;           // Primary logo URL from Firecrawl
  favicon?: string;        // Fallback favicon URL
  primaryColor?: string;   // Main brand color (e.g., "#00A39A")
  accentColor?: string;    // Secondary/accent color
  backgroundColor?: string; // Background color
  colorScheme?: string;    // "light" or "dark"
  confidence?: number;     // Firecrawl confidence score (0-1)
}

// Inner branding data structure from Firecrawl API
interface FirecrawlBrandingData {
  colorScheme?: string;
  fonts?: Array<{ family: string; count: number }>;
  colors?: {
    primary?: string;
    accent?: string;
    background?: string;
    textPrimary?: string;
    link?: string;
  };
  typography?: {
    fontFamilies?: {
      primary?: string;
      heading?: string;
    };
    fontStacks?: {
      body?: string[];
      heading?: string[];
      paragraph?: string[];
    };
    fontSizes?: {
      h1?: string;
      h2?: string;
      body?: string;
    };
  };
  spacing?: {
    baseUnit?: number;
    borderRadius?: string;
  };
  components?: any;
  images?: {
    logo?: string;
    favicon?: string;
    ogImage?: string;
  };
  __framework_hints?: string[];
  __llm_logo_reasoning?: {
    selectedIndex?: number;
    reasoning?: string;
    confidence?: number;
  };
  __llm_button_reasoning?: {
    primary?: { index: number; text: string; reasoning: string };
    secondary?: { index: number; text: string; reasoning: string };
    confidence?: number;
  };
  confidence?: {
    buttons?: number;
    colors?: number;
    overall?: number;
  };
}

// Metadata from Firecrawl API response
interface FirecrawlMetadata {
  language?: string;
  title?: string;
  description?: string;
  favicon?: string;
  ogImage?: string;
  viewport?: string;
  url?: string;
  sourceURL?: string;
  statusCode?: number;
  scrapeId?: string;
  creditsUsed?: number;
  [key: string]: any;
}

// =============================================================================
// FIRECRAWL API V2 RESPONSE STRUCTURE
// =============================================================================
// The API wraps all data inside { success: boolean, data: { branding, metadata } }
// This was the root cause of the previous bug - we were checking response.branding
// instead of response.data.branding
// =============================================================================
interface FirecrawlApiResponse {
  success: boolean;
  data: {
    branding?: FirecrawlBrandingData;
    metadata?: FirecrawlMetadata;
  };
  // Error response structure
  error?: string;
}

/**
 * Extract domain from website URL for fallback favicon
 */
function extractDomain(website: string): string | null {
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

// =============================================================================
// RETRY CONFIGURATION FOR FIRECRAWL API
// =============================================================================
// Firecrawl sometimes returns 500 errors for transient issues or when their
// JavaScript scraper fails on certain websites. We retry with exponential
// backoff to handle transient failures gracefully.
// =============================================================================
const RETRY_CONFIG = {
  maxRetries: 2,           // Maximum number of retry attempts
  initialDelayMs: 1000,    // Initial delay before first retry (1 second)
  maxDelayMs: 5000,        // Maximum delay between retries (5 seconds)
  backoffMultiplier: 2,    // Exponential backoff multiplier
  // Error codes that are worth retrying (transient failures)
  retryableStatusCodes: [500, 502, 503, 504, 429] as const
};

/**
 * Categorize Firecrawl API errors for better monitoring and decision-making
 */
type FirecrawlErrorType =
  | 'RATE_LIMIT'        // 429 - Too many requests
  | 'SERVER_ERROR'      // 500-504 - Server-side issues
  | 'SCRAPE_FAILURE'    // Success:false with SCRAPE_ACTION_ERROR
  | 'TIMEOUT'           // Request timed out
  | 'NETWORK_ERROR'     // Network connectivity issues
  | 'UNKNOWN';          // Unclassified error

interface FirecrawlErrorInfo {
  type: FirecrawlErrorType;
  statusCode?: number;
  message: string;
  isRetryable: boolean;
}

/**
 * Classify an error response for logging and retry decisions
 */
function classifyFirecrawlError(
  statusCode?: number,
  errorBody?: string
): FirecrawlErrorInfo {
  // Rate limiting
  if (statusCode === 429) {
    return {
      type: 'RATE_LIMIT',
      statusCode,
      message: 'Rate limit exceeded - too many requests',
      isRetryable: true
    };
  }

  // Server errors (potentially transient)
  if (statusCode && statusCode >= 500 && statusCode <= 504) {
    // Check for SCRAPE_ACTION_ERROR which indicates website-specific issues
    if (errorBody?.includes('SCRAPE_ACTION_ERROR')) {
      return {
        type: 'SCRAPE_FAILURE',
        statusCode,
        message: 'Firecrawl scraper failed on target website JavaScript',
        isRetryable: false // Website-specific issues rarely resolve with retry
      };
    }
    return {
      type: 'SERVER_ERROR',
      statusCode,
      message: `Firecrawl server error (${statusCode})`,
      isRetryable: true
    };
  }

  return {
    type: 'UNKNOWN',
    statusCode,
    message: errorBody?.substring(0, 200) || 'Unknown error',
    isRetryable: false
  };
}

/**
 * Sleep for a specified duration (used for retry backoff)
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay for retry attempt with exponential backoff
 */
function calculateRetryDelay(attempt: number): number {
  const delay = RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt);
  return Math.min(delay, RETRY_CONFIG.maxDelayMs);
}

/**
 * Fetch company branding from Firecrawl API v2
 * Returns logo, favicon, and brand colors with fallback support
 *
 * Includes retry logic with exponential backoff for transient failures.
 *
 * API: POST https://api.firecrawl.dev/v2/scrape
 * Response structure: { success: boolean, data: { branding: {...}, metadata: {...} } }
 */
export async function fetchCompanyBranding(
  websiteUrl: string,
  apiKey: string
): Promise<CompanyBranding> {
  console.log(`[Branding] ========================================`);
  console.log(`[Branding] Starting Firecrawl branding fetch`);
  console.log(`[Branding] URL: ${websiteUrl}`);
  console.log(`[Branding] API Key: ${apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING'}`);

  // Prepare fallback data
  const domain = extractDomain(websiteUrl);
  const fallbackBranding: CompanyBranding = {
    favicon: domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : undefined
  };
  console.log(`[Branding] Fallback favicon: ${fallbackBranding.favicon || 'none'}`);

  const requestBody = {
    url: websiteUrl,
    onlyMainContent: false,
    maxAge: 172800000, // 2 days cache
    parsers: [],
    formats: ['branding']
  };

  console.log(`[Branding] Request body:`, JSON.stringify(requestBody));

  // Retry loop with exponential backoff
  let lastError: FirecrawlErrorInfo | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = calculateRetryDelay(attempt - 1);
      console.log(`[Branding] Retry attempt ${attempt}/${RETRY_CONFIG.maxRetries} after ${delay}ms delay`);
      await sleep(delay);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const response = await fetch('https://api.firecrawl.dev/v2/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`[Branding] Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error body');
        lastError = classifyFirecrawlError(response.status, errorText);

        console.error(`[Branding] Firecrawl API error: ${response.status}`);
        console.error(`[Branding] Error type: ${lastError.type}`);
        console.error(`[Branding] Error response: ${errorText.substring(0, 500)}`);

        // Check if we should retry
        if (lastError.isRetryable && attempt < RETRY_CONFIG.maxRetries) {
          console.log(`[Branding] Error is retryable, will attempt retry`);
          continue; // Try again
        }

        // Non-retryable or exhausted retries
        console.log(`[Branding] Error is not retryable or retries exhausted, using fallback`);
        return fallbackBranding;
      }

      // Success! Parse the JSON response
      const rawResponse = await response.text();
      console.log(`[Branding] Raw response length: ${rawResponse.length} chars`);
      console.log(`[Branding] Raw response preview: ${rawResponse.substring(0, 300)}...`);

      let apiResponse: FirecrawlApiResponse;
      try {
        apiResponse = JSON.parse(rawResponse);
      } catch (parseError) {
        console.error(`[Branding] JSON parse error:`, parseError);
        console.error(`[Branding] Raw response that failed to parse: ${rawResponse.substring(0, 1000)}`);
        return fallbackBranding;
      }

      // Log the response structure for debugging
      console.log(`[Branding] API Response structure:`);
      console.log(`[Branding]   - success: ${apiResponse.success}`);
      console.log(`[Branding]   - has data: ${!!apiResponse.data}`);
      console.log(`[Branding]   - has data.branding: ${!!apiResponse.data?.branding}`);
      console.log(`[Branding]   - has data.metadata: ${!!apiResponse.data?.metadata}`);
      console.log(`[Branding]   - error: ${apiResponse.error || 'none'}`);

      // Check for API success flag
      if (!apiResponse.success) {
        console.warn(`[Branding] Firecrawl API returned success=false`);
        console.warn(`[Branding] Error: ${apiResponse.error || 'Unknown error'}`);
        return fallbackBranding;
      }

      // Check for data wrapper (this was the bug - we weren't accessing .data)
      if (!apiResponse.data) {
        console.warn(`[Branding] No data object in Firecrawl response`);
        console.warn(`[Branding] Response keys: ${Object.keys(apiResponse).join(', ')}`);
        return fallbackBranding;
      }

      // Check for branding data inside data wrapper
      if (!apiResponse.data.branding) {
        console.warn(`[Branding] No branding data in response.data`);
        console.warn(`[Branding] Available data keys: ${Object.keys(apiResponse.data).join(', ')}`);
        return fallbackBranding;
      }

      // Extract branding and metadata from the correct nested location
      const branding = apiResponse.data.branding;
      const metadata = apiResponse.data.metadata;

      // Log what we found
      console.log(`[Branding] Branding data found:`);
      console.log(`[Branding]   - colorScheme: ${branding.colorScheme || 'not set'}`);
      console.log(`[Branding]   - colors: ${branding.colors ? JSON.stringify(branding.colors) : 'not set'}`);
      console.log(`[Branding]   - images: ${branding.images ? JSON.stringify(branding.images) : 'not set'}`);
      console.log(`[Branding]   - fonts count: ${branding.fonts?.length || 0}`);
      console.log(`[Branding]   - framework hints: ${branding.__framework_hints?.join(', ') || 'none'}`);

      if (metadata) {
        console.log(`[Branding] Metadata found:`);
        console.log(`[Branding]   - title: ${metadata.title || 'not set'}`);
        console.log(`[Branding]   - favicon: ${metadata.favicon || 'not set'}`);
        console.log(`[Branding]   - language: ${metadata.language || 'not set'}`);
      }

      // Extract branding data with fallbacks
      const result: CompanyBranding = {
        logo: branding.images?.logo || undefined,
        favicon: branding.images?.favicon || metadata?.favicon || fallbackBranding.favicon,
        primaryColor: branding.colors?.primary || undefined,
        accentColor: branding.colors?.accent || branding.colors?.link || undefined,
        backgroundColor: branding.colors?.background || undefined,
        colorScheme: branding.colorScheme || undefined,
        confidence: branding.__llm_logo_reasoning?.confidence || branding.confidence?.overall || undefined
      };

      // Final result logging
      console.log(`[Branding] ========================================`);
      console.log(`[Branding] EXTRACTION COMPLETE - Results:`);
      console.log(`[Branding]   - Logo: ${result.logo || 'NOT FOUND'}`);
      console.log(`[Branding]   - Favicon: ${result.favicon || 'NOT FOUND'}`);
      console.log(`[Branding]   - Primary Color: ${result.primaryColor || 'NOT FOUND'}`);
      console.log(`[Branding]   - Accent Color: ${result.accentColor || 'NOT FOUND'}`);
      console.log(`[Branding]   - Background Color: ${result.backgroundColor || 'NOT FOUND'}`);
      console.log(`[Branding]   - Color Scheme: ${result.colorScheme || 'NOT FOUND'}`);
      console.log(`[Branding]   - Confidence: ${result.confidence !== undefined ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'}`);
      console.log(`[Branding] ========================================`);

      return result;

    } catch (error) {
      // Handle timeout and network errors
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = {
          type: 'TIMEOUT',
          message: 'Request timed out after 20 seconds',
          isRetryable: true
        };
        console.error(`[Branding] Firecrawl API request timed out (20s)`);
      } else if (error instanceof Error) {
        lastError = {
          type: 'NETWORK_ERROR',
          message: error.message,
          isRetryable: true
        };
        console.error(`[Branding] Network error: ${error.name} - ${error.message}`);
      } else {
        lastError = {
          type: 'UNKNOWN',
          message: String(error),
          isRetryable: false
        };
        console.error(`[Branding] Unknown error:`, error);
      }

      // Check if we should retry
      if (lastError.isRetryable && attempt < RETRY_CONFIG.maxRetries) {
        console.log(`[Branding] Error is retryable, will attempt retry`);
        continue; // Try again
      }

      // Non-retryable or exhausted retries
      console.log(`[Branding] Retries exhausted or error not retryable, using fallback`);
      return fallbackBranding;
    }
  }

  // Should not reach here, but return fallback just in case
  console.warn(`[Branding] Unexpected exit from retry loop, using fallback`);
  return fallbackBranding;
}

/**
 * Get the best available logo/icon for the company
 * Returns URL in priority order: logo → favicon → Google favicon → null
 */
export function getBestLogo(branding?: CompanyBranding, websiteUrl?: string): string | null {
  if (!branding) {
    const domain = websiteUrl ? extractDomain(websiteUrl) : null;
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
  }
  
  // Priority: logo → favicon → Google favicon fallback
  if (branding.logo) return branding.logo;
  if (branding.favicon) return branding.favicon;
  
  // Last resort: Google favicon service
  const domain = websiteUrl ? extractDomain(websiteUrl) : null;
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
}

/**
 * Validate and sanitize color hex code
 * Ensures color is a valid hex format
 */
export function sanitizeColor(color?: string): string | undefined {
  if (!color) return undefined;
  
  // Remove any whitespace
  const cleaned = color.trim();
  
  // Check if it's a valid hex color (with or without #)
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(cleaned)) {
    console.warn(`[Branding] Invalid color format: ${color}`);
    return undefined;
  }
  
  // Ensure it starts with #
  return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
}
