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
// SYSTEM MESSAGE BUILDER
// =============================================================================

/** Default style paragraph used when no tone override is configured */
const DEFAULT_STYLE_PARAGRAPH =
  'TEMPERATURE GUIDANCE: Be creative and varied in your language. Don\'t repeat the same phrases across different opportunities. Each description should feel fresh and specifically crafted.';

/** Map config tone values to concrete writing instructions */
const TONE_MAP: Record<string, string> = {
  professional: DEFAULT_STYLE_PARAGRAPH,
  conversational:
    'STYLE GUIDANCE: Write in a warm, approachable style as if speaking directly to the reader. Use everyday language, short sentences, and a friendly voice. Make the reader feel like they are having a helpful conversation with a knowledgeable colleague.',
  technical:
    'STYLE GUIDANCE: Write in a precise, data-driven style using industry terminology. Favor concrete metrics, technical specifications, and structured argumentation. Assume the reader has domain expertise.',
  consultative:
    'STYLE GUIDANCE: Write as a trusted advisor offering strategic counsel. Balance authority with empathy, frame recommendations as options with trade-offs, and reference industry best practices to build credibility.',
};

/**
 * Build the system message, injecting optional systemIdentity and tone
 * from clientConfig.prompt while preserving backward compatibility.
 */
function buildSystemMessage(): string {
  const systemIdentity = clientConfig.prompt?.systemIdentity;
  const tone = clientConfig.prompt?.tone;

  // Identity clause — only appended when defined
  const identityClause = systemIdentity
    ? ` working on behalf of ${systemIdentity}`
    : '';

  // Choose the style paragraph: tone overrides the default completely
  const styleParagraph = tone
    ? (TONE_MAP[tone] ?? DEFAULT_STYLE_PARAGRAPH)
    : DEFAULT_STYLE_PARAGRAPH;

  return `You are an expert AI auditor, CREATIVE COPYWRITER, and PERSONALIZATION SPECIALIST${identityClause}. Your output must be:
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

${styleParagraph}

Ensure the JSON is complete and not truncated.`;
}

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
 * - Config-driven max_tokens, timeout, systemIdentity, and tone
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

  // Calculate per-attempt timeout to stay within the total budget
  const totalTimeout = clientConfig.llm.timeout;
  const totalAttemptsAcrossAll = MODEL_CONFIGS.reduce(
    (sum, c) => sum + c.maxRetries + 1,
    0,
  );
  const perAttemptTimeout = Math.floor(totalTimeout / totalAttemptsAcrossAll);

  // Per-config maxTokens: primary (index 0) uses primary.maxTokens, fallback uses fallback.maxTokens
  const maxTokensByConfig = [
    clientConfig.llm.primary.maxTokens,
    clientConfig.llm.fallback.maxTokens,
  ];

  // Try each model configuration
  for (let configIndex = 0; configIndex < MODEL_CONFIGS.length; configIndex++) {
    const config = MODEL_CONFIGS[configIndex];
    console.log(`[Agent] ========================================`);
    console.log(`[Agent] Attempt ${configIndex + 1}/${MODEL_CONFIGS.length}: ${config.name}`);

    const maxTokens = maxTokensByConfig[configIndex] ?? maxTokensByConfig[0];

    for (let retry = 0; retry <= config.maxRetries; retry++) {
      if (retry > 0) {
        console.log(`[Agent] Retry ${retry}/${config.maxRetries} for ${config.name}`);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), perAttemptTimeout);

        // Build the system message with optional systemIdentity and tone
        const systemMessage = buildSystemMessage();

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
                content: systemMessage,
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: maxTokens,
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
