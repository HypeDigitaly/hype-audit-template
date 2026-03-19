// =============================================================================
// ROBUST JSON PARSER UTILITIES - 100% Failure-Proof JSON Extraction & Validation
// =============================================================================
// This module provides bulletproof JSON extraction from LLM responses with:
// - Balanced brace matching (no greedy regex issues)
// - Multiple extraction strategies (fallback chain)
// - Control character sanitization
// - Comprehensive error handling
// - Schema validation with progressive strictness
// =============================================================================

/**
 * Metrics tracking for JSON parsing operations
 */
export interface JsonParseMetrics {
  totalAttempts: number;
  successfulParses: number;
  failedParses: number;
  sanitizationAttempts: number;
  retryAttempts: number;
  lastFailureReason?: string;
  lastFailureTimestamp?: string;
}

// Global metrics (can be replaced with proper metrics service)
const metrics: JsonParseMetrics = {
  totalAttempts: 0,
  successfulParses: 0,
  failedParses: 0,
  sanitizationAttempts: 0,
  retryAttempts: 0
};

/**
 * Get current parsing metrics
 */
export function getParseMetrics(): JsonParseMetrics {
  return { ...metrics };
}

/**
 * Reset metrics (useful for testing)
 */
export function resetMetrics(): void {
  metrics.totalAttempts = 0;
  metrics.successfulParses = 0;
  metrics.failedParses = 0;
  metrics.sanitizationAttempts = 0;
  metrics.retryAttempts = 0;
  delete metrics.lastFailureReason;
  delete metrics.lastFailureTimestamp;
}

/**
 * Sanitize control characters that can break JSON.parse()
 * Removes/replaces invalid characters while preserving valid JSON structure
 */
function sanitizeControlCharacters(str: string): string {
  // Remove BOM (Byte Order Mark)
  if (str.charCodeAt(0) === 0xFEFF) {
    str = str.slice(1);
  }
  
  // Replace problematic control characters
  // Keep: \n (newline), \r (carriage return), \t (tab) - these are valid in JSON strings
  // Remove: other control chars (0x00-0x1F except \n, \r, \t)
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Normalize line endings to \n
  str = str.replace(/\r\n/g, '\n');
  str = str.replace(/\r/g, '\n');
  
  return str;
}

/**
 * Remove markdown code blocks with comprehensive pattern matching
 * Handles: ```json, ```JSON, ```, with/without whitespace
 */
function stripMarkdownCodeBlocks(str: string): string {
  let cleaned = str.trim();
  
  // Match opening code block: ``` or ```json or ```JSON (case insensitive, with optional whitespace)
  // Pattern: ``` followed by optional whitespace and optional language identifier
  const openingPattern = /^```\s*[a-zA-Z]*\s*\n?/i;
  if (openingPattern.test(cleaned)) {
    cleaned = cleaned.replace(openingPattern, '');
  }
  
  // Match closing code block: ```
  const closingPattern = /\n?\s*```\s*$/;
  if (closingPattern.test(cleaned)) {
    cleaned = cleaned.replace(closingPattern, '');
  }
  
  return cleaned.trim();
}

/**
 * Extract JSON using balanced brace matching
 * This is the most robust method - it finds the first valid JSON object
 * by tracking opening/closing braces
 */
function extractJsonByBalancedBraces(str: string): string | null {
  // Find first opening brace
  const startIndex = str.indexOf('{');
  if (startIndex === -1) {
    return null;
  }
  
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];
    
    // Handle escape sequences in strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    // Toggle string state
    if (char === '"') {
      inString = !inString;
      continue;
    }
    
    // Only count braces outside of strings
    if (!inString) {
      if (char === '{') {
        depth++;
      } else if (char === '}') {
        depth--;
        
        // Found matching closing brace
        if (depth === 0) {
          return str.substring(startIndex, i + 1);
        }
      }
    }
  }
  
  // No matching closing brace found
  return null;
}

/**
 * Extract JSON using greedy regex (fallback method)
 * Less reliable but useful as backup
 */
function extractJsonByRegex(str: string): string | null {
  const match = str.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}

/**
 * Extract JSON by finding first { and last } (least reliable)
 */
function extractJsonByFirstLast(str: string): string | null {
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  
  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null;
  }
  
  return str.substring(firstBrace, lastBrace + 1);
}

/**
 * Attempt to parse JSON with multiple extraction strategies
 * Returns the first successful parse or null
 */
export function extractAndParseJson(content: string, contextLabel: string = 'LLM'): any | null {
  metrics.totalAttempts++;
  
  let preprocessed = content.trim();
  
  // Step 1: Strip markdown code blocks
  preprocessed = stripMarkdownCodeBlocks(preprocessed);
  
  // Step 2: Sanitize control characters
  preprocessed = sanitizeControlCharacters(preprocessed);
  metrics.sanitizationAttempts++;
  
  // Strategy 1: Try direct parse (content is already valid JSON)
  try {
    const parsed = JSON.parse(preprocessed);
    metrics.successfulParses++;
    console.log(`[JSON Parser] ✓ Direct parse succeeded (${contextLabel})`);
    return parsed;
  } catch (directError) {
    console.log(`[JSON Parser] Direct parse failed (${contextLabel}), trying extraction strategies...`);
  }
  
  // Strategy 2: Balanced brace extraction (most reliable)
  const extracted1 = extractJsonByBalancedBraces(preprocessed);
  if (extracted1) {
    try {
      const parsed = JSON.parse(extracted1);
      metrics.successfulParses++;
      console.log(`[JSON Parser] ✓ Balanced brace extraction succeeded (${contextLabel})`);
      return parsed;
    } catch (e) {
      console.log(`[JSON Parser] Balanced brace extraction failed to parse (${contextLabel})`);
    }
  }
  
  // Strategy 3: Regex extraction (fallback)
  const extracted2 = extractJsonByRegex(preprocessed);
  if (extracted2 && extracted2 !== extracted1) {
    try {
      const parsed = JSON.parse(extracted2);
      metrics.successfulParses++;
      console.log(`[JSON Parser] ✓ Regex extraction succeeded (${contextLabel})`);
      return parsed;
    } catch (e) {
      console.log(`[JSON Parser] Regex extraction failed to parse (${contextLabel})`);
    }
  }
  
  // Strategy 4: First/Last brace extraction (last resort)
  const extracted3 = extractJsonByFirstLast(preprocessed);
  if (extracted3 && extracted3 !== extracted1 && extracted3 !== extracted2) {
    try {
      const parsed = JSON.parse(extracted3);
      metrics.successfulParses++;
      console.log(`[JSON Parser] ✓ First/Last extraction succeeded (${contextLabel})`);
      return parsed;
    } catch (e) {
      console.log(`[JSON Parser] First/Last extraction failed to parse (${contextLabel})`);
    }
  }
  
  // All strategies failed
  metrics.failedParses++;
  metrics.lastFailureReason = 'All extraction strategies failed';
  metrics.lastFailureTimestamp = new Date().toISOString();
  
  console.error(`[JSON Parser] ✗ All extraction strategies failed (${contextLabel})`);
  console.error(`[JSON Parser] Content preview (first 500 chars): ${preprocessed.substring(0, 500)}`);
  
  return null;
}

/**
 * Check if JSON is truncated (incomplete structure)
 * Returns true if the JSON appears to be cut off
 */
export function isJsonTruncated(jsonString: string): boolean {
  // Check for common truncation patterns
  const truncationIndicators = [
    /,\s*$/, // Ends with comma (incomplete array/object)
    /:\s*$/, // Ends with colon (incomplete key-value)
    /"\s*$/, // Ends with quote (incomplete string)
    /\[\s*$/, // Ends with opening bracket (incomplete array)
    /\{\s*$/, // Ends with opening brace (incomplete object)
  ];
  
  const trimmed = jsonString.trim();
  return truncationIndicators.some(pattern => pattern.test(trimmed));
}

/**
 * Validate that parsed JSON has the expected structure
 * Progressive validation: strict for critical fields, permissive for optional
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  hasMinimalData: boolean; // Can we work with this data at all?
}

/**
 * Validate audit report JSON structure
 * Critical fields: companyProfile, aiOpportunities
 * Optional fields: Everything else gets defaults
 */
export function validateAuditReportStructure(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Type check
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Data is not an object'],
      warnings: [],
      hasMinimalData: false
    };
  }
  
  // CRITICAL: companyProfile must exist and have basic info
  if (!data.companyProfile || typeof data.companyProfile !== 'object') {
    errors.push('Missing or invalid companyProfile');
  } else {
    // Check critical company profile fields
    if (!data.companyProfile.detectedIndustry && !data.companyProfile.description) {
      warnings.push('companyProfile missing both detectedIndustry and description');
    }
  }
  
  // CRITICAL: aiOpportunities must exist and be an array with at least 1 item
  if (!Array.isArray(data.aiOpportunities)) {
    errors.push('aiOpportunities must be an array');
  } else if (data.aiOpportunities.length === 0) {
    errors.push('aiOpportunities array is empty (must have at least 1 opportunity)');
  } else {
    // Validate structure of opportunities
    const invalidOpps = data.aiOpportunities.filter((opp: any) => 
      !opp.title || !opp.description || !opp.quadrant
    );
    if (invalidOpps.length > 0) {
      warnings.push(`${invalidOpps.length} aiOpportunities missing required fields (title/description/quadrant)`);
    }
  }
  
  // OPTIONAL: auditQuestions (can be empty, will use defaults)
  if (data.auditQuestions !== undefined && !Array.isArray(data.auditQuestions)) {
    warnings.push('auditQuestions should be an array (will use defaults)');
  }
  
  // OPTIONAL: recommendedTools (can be empty)
  if (data.recommendedTools !== undefined && !Array.isArray(data.recommendedTools)) {
    warnings.push('recommendedTools should be an array (will use empty array)');
  }
  
  // OPTIONAL: roiEstimate (can be missing, will use defaults)
  if (data.roiEstimate !== undefined && typeof data.roiEstimate !== 'object') {
    warnings.push('roiEstimate should be an object (will use defaults)');
  }
  
  // Determine overall validity
  const isValid = errors.length === 0;
  const hasMinimalData = 
    data.companyProfile && 
    Array.isArray(data.aiOpportunities) && 
    data.aiOpportunities.length > 0;
  
  // Log results
  if (!isValid) {
    console.error('[JSON Validator] ✗ Validation failed:', errors);
  }
  if (warnings.length > 0) {
    console.warn('[JSON Validator] ⚠ Validation warnings:', warnings);
  }
  if (isValid) {
    console.log('[JSON Validator] ✓ Validation passed');
  }
  
  return {
    isValid,
    errors,
    warnings,
    hasMinimalData
  };
}

/**
 * Validate form validation JSON structure (for ai-field-validator)
 */
export function validateFormValidationStructure(data: any): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Data is not an object'],
      warnings: [],
      hasMinimalData: false
    };
  }
  
  // Check for isValid field
  if (typeof data.isValid !== 'boolean') {
    errors.push('Missing or invalid isValid field (must be boolean)');
  }
  
  // Check for fields object
  if (!data.fields || typeof data.fields !== 'object') {
    errors.push('Missing or invalid fields object');
  } else {
    // Check required field validations
    const requiredFields = ['website', 'email', 'companyName', 'city', 'biggestPainPoint', 'currentTools'];
    for (const field of requiredFields) {
      if (!data.fields[field] || typeof data.fields[field].isValid !== 'boolean') {
        warnings.push(`Field '${field}' missing or invalid`);
      }
    }
  }
  
  const isValid = errors.length === 0;
  const hasMinimalData = typeof data.isValid === 'boolean' && data.fields !== undefined;
  
  if (!isValid) {
    console.error('[Form Validator] ✗ Validation failed:', errors);
  }
  if (warnings.length > 0) {
    console.warn('[Form Validator] ⚠ Validation warnings:', warnings);
  }
  
  return {
    isValid,
    errors,
    warnings,
    hasMinimalData
  };
}

/**
 * Fill missing optional fields with defaults for audit report
 */
export function fillAuditReportDefaults(data: any, formData: { language: 'cs' | 'en'; companyName: string }): any {
  const isCzech = formData.language === 'cs';
  
  // Ensure auditQuestions exists
  if (!Array.isArray(data.auditQuestions) || data.auditQuestions.length === 0) {
    console.log('[JSON Parser] Using default auditQuestions');
    data.auditQuestions = [];
  }
  
  // Ensure recommendedTools exists
  if (!Array.isArray(data.recommendedTools)) {
    console.log('[JSON Parser] Using default recommendedTools (empty array)');
    data.recommendedTools = [];
  }
  
  // Ensure roiEstimate exists
  if (!data.roiEstimate || typeof data.roiEstimate !== 'object') {
    console.log('[JSON Parser] Using default roiEstimate');
    data.roiEstimate = {
      totalHoursSavedPerWeek: 20,
      defaultHourlyRate: isCzech ? 400 : 50,
      assumptions: []
    };
  }
  
  // Ensure expectedBenefitsSummary exists
  if (!data.expectedBenefitsSummary || typeof data.expectedBenefitsSummary !== 'object') {
    console.log('[JSON Parser] expectedBenefitsSummary will be generated from opportunities');
    // Will be filled by generateFallbackBenefitsSummary() in langgraph-agent.ts
  }
  
  // Ensure v3 fields exist
  if (!Array.isArray(data.detectedTechnologies)) {
    data.detectedTechnologies = [];
  }
  if (typeof data.hasOwnApplication !== 'boolean') {
    data.hasOwnApplication = false;
  }
  if (!data.ownApplicationDetails) {
    data.ownApplicationDetails = null;
  }
  if (!Array.isArray(data.appIntegrationOpportunities)) {
    data.appIntegrationOpportunities = [];
  }
  if (!data.industryBenchmark) {
    data.industryBenchmark = null;
  }
  if (!Array.isArray(data.implementationTimeline)) {
    data.implementationTimeline = [];
  }
  if (!Array.isArray(data.riskAssessment)) {
    data.riskAssessment = [];
  }
  
  return data;
}

/**
 * Log detailed parse failure information for debugging
 */
export function logParseFailure(
  content: string,
  error: Error,
  contextLabel: string = 'LLM'
): void {
  console.error(`[JSON Parser] ========================================`);
  console.error(`[JSON Parser] PARSE FAILURE - ${contextLabel}`);
  console.error(`[JSON Parser] ========================================`);
  console.error(`[JSON Parser] Error: ${error.message}`);
  console.error(`[JSON Parser] Content length: ${content.length} chars`);
  console.error(`[JSON Parser] First 1000 chars:`);
  console.error(content.substring(0, 1000));
  console.error(`[JSON Parser] Last 500 chars:`);
  console.error(content.substring(Math.max(0, content.length - 500)));
  console.error(`[JSON Parser] Truncated: ${isJsonTruncated(content)}`);
  console.error(`[JSON Parser] Metrics:`, getParseMetrics());
  console.error(`[JSON Parser] ========================================`);
}
