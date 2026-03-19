// =============================================================================
// LLM SYNTHESIZER - OpenRouter API calls and response handling
// =============================================================================

import type { AuditFormInputs, SynthesisResult } from './types';
import { MODEL_CONFIGS } from './config';
import { clientConfig } from '../../_config/client';
import {
  extractAndParseJson,
  validateAuditReportStructure,
  fillAuditReportDefaults,
  isJsonTruncated,
  logParseFailure,
  getParseMetrics
} from '../json-parser-utils';

// =============================================================================
// LLM SYNTHESIS
// =============================================================================

/**
 * Synthesize structured report using LLM with retry logic and model fallback
 *
 * Features:
 * - Primary and fallback model configurations
 * - Automatic retry on failure
 * - JSON extraction and validation
 * - Truncation detection
 */
export async function synthesizeStructuredReport(
  prompt: string,
  openrouterApiKey: string,
  formData: AuditFormInputs
): Promise<SynthesisResult> {
  console.log('[Agent] ========================================');
  console.log('[Agent] Synthesizing structured report with LLM');
  console.log(`[Agent] Prompt length: ${prompt.length} characters`);

  let lastError: Error | null = null;
  let usedFallbackModel = false;

  // Try each model configuration
  for (let configIndex = 0; configIndex < MODEL_CONFIGS.length; configIndex++) {
    const config = MODEL_CONFIGS[configIndex];
    console.log(`[Agent] ========================================`);
    console.log(`[Agent] Attempt ${configIndex + 1}/${MODEL_CONFIGS.length}: ${config.name}`);

    for (let retry = 0; retry <= config.maxRetries; retry++) {
      if (retry > 0) {
        console.log(`[Agent] Retry ${retry}/${config.maxRetries} for ${config.name}`);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': clientConfig.siteUrl,
            'X-Title': `${clientConfig.company.name} AI Deep Research Agent v3`
          },
          body: JSON.stringify({
            models: config.models,
            messages: [
              {
                role: 'system',
                content: `You are an expert AI auditor, CREATIVE COPYWRITER, and PERSONALIZATION SPECIALIST. Your output must be:
1. ONLY valid JSON, directly parseable by JSON.parse()
2. 100% ORIGINAL and UNIQUELY TAILORED to this specific company
3. COMPELLING and SALES-ORIENTED - you are helping sell AI consulting services
4. Written in natural, conversational language (no jargon without explanation)
5. PRIMARILY driven by user's form inputs (company name, industry, pain point, current tools)

CREATIVITY & PERSONALIZATION MANDATE:
- You will see examples in the prompt - these show STYLE and QUALITY, NOT content to copy
- DO NOT copy example phrases, scenarios, or metrics - CREATE YOUR OWN
- Every report must be UNIQUE - imagine you're writing for the first time
- Use the ACTUAL facts from search results about THIS company
- If user provided a pain point, make it the CENTRAL THEME of recommendations

CRITICAL REQUIREMENTS:
- Every AI opportunity description MUST be 4-5 sentences with ORIGINAL storytelling scenarios
- Create vivid, specific scenarios relevant to THIS company's actual situation
- The introText MUST summarize benefits in words, personalized to their industry
- Use the company name naturally throughout
- Generic, template-like, or recycled output is STRICTLY FORBIDDEN

TEMPERATURE GUIDANCE: Be creative and varied in your language. Don't repeat the same phrases across different opportunities. Each description should feel fresh and specifically crafted.

Ensure the JSON is complete and not truncated.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 32000, // Increased to 32K to prevent any truncation
            temperature: config.temperature
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`[Agent] LLM API error (${config.name}):`, response.status, errorData);
          lastError = new Error(`LLM API error: ${response.status}`);
          continue; // Try next retry or config
        }

        const responseData = await response.json();

        if (!responseData.choices?.[0]?.message?.content) {
          console.error(`[Agent] Invalid LLM response structure (${config.name})`);
          lastError = new Error('Invalid LLM response structure');
          continue;
        }

        const content = responseData.choices[0].message.content;
        const actualModel = responseData.model;

        console.log(`[Agent] LLM response received from model: ${actualModel}`);
        console.log(`[Agent] Response length: ${content.length} characters`);
        console.log(`[Agent] Response preview: ${content.substring(0, 200)}...`);

        // Check for truncation
        if (isJsonTruncated(content)) {
          console.warn('[Agent] ⚠️ Response appears truncated (incomplete JSON structure)');
          console.warn('[Agent] This might cause parsing issues. Consider increasing max_tokens further.');
        }

        // STEP 1: Extract and parse JSON using robust extraction
        console.log('[Agent] STEP 1: Extracting and parsing JSON...');
        const parsedData = extractAndParseJson(content, `Agent ${config.name}`);

        if (!parsedData) {
          console.error(`[Agent] ✗ Failed to extract valid JSON (${config.name})`);
          logParseFailure(content, new Error('Extraction failed'), config.name);
          lastError = new Error('Failed to extract valid JSON from LLM response');
          continue; // Try next retry or config
        }

        console.log('[Agent] ✓ JSON extracted and parsed successfully');

        // STEP 2: Validate structure
        console.log('[Agent] STEP 2: Validating JSON structure...');
        const validation = validateAuditReportStructure(parsedData);

        if (!validation.isValid) {
          console.error(`[Agent] ✗ JSON validation failed (${config.name}):`, validation.errors);
          lastError = new Error(`Invalid JSON structure: ${validation.errors.join(', ')}`);

          // If we have minimal data, we might still be able to use it with defaults
          if (validation.hasMinimalData) {
            console.warn('[Agent] ⚠️ Data has minimal required fields, will fill defaults and continue');
            const filledData = fillAuditReportDefaults(parsedData, formData);
            console.log('[Agent] ✓ Defaults filled, using data despite validation issues');

            // Mark that we used fallback
            if (configIndex > 0) {
              usedFallbackModel = true;
            }

            console.log('[Agent] Parse metrics:', getParseMetrics());
            console.log('[Agent] ========================================');

            return {
              success: true,
              data: filledData,
              usedFallbackModel
            };
          }

          continue; // Try next retry or config
        }

        console.log('[Agent] ✓ JSON validation passed');

        // STEP 3: Fill defaults for optional fields
        console.log('[Agent] STEP 3: Filling defaults for optional fields...');
        const filledData = fillAuditReportDefaults(parsedData, formData);
        console.log('[Agent] ✓ Defaults filled successfully');

        // Mark that we used fallback model
        if (configIndex > 0) {
          usedFallbackModel = true;
          console.log('[Agent] ✓ Successfully used fallback model configuration');
        }

        console.log('[Agent] Parse metrics:', getParseMetrics());
        console.log('[Agent] ========================================');

        return {
          success: true,
          data: filledData,
          usedFallbackModel
        };

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error(`[Agent] LLM request timed out (${config.name})`);
          lastError = new Error('LLM request timed out');
        } else {
          console.error(`[Agent] LLM synthesis error (${config.name}):`, error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
        // Continue to next retry or config
      }
    }
  }

  // All attempts failed
  console.error('[Agent] ========================================');
  console.error('[Agent] ✗ ALL SYNTHESIS ATTEMPTS FAILED');
  console.error('[Agent] Final error:', lastError?.message);
  console.error('[Agent] Parse metrics:', getParseMetrics());
  console.error('[Agent] ========================================');

  return {
    success: false,
    error: lastError?.message || 'Failed to synthesize report',
    usedFallbackModel: false
  };
}
