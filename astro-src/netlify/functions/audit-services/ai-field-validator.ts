// =============================================================================
// AI FIELD VALIDATOR - Intelligent Form Validation with LLM
// =============================================================================
// Uses OpenRouter LLM to validate form fields with human-like intelligence.
// Catches edge cases that regex can't: vulgar content, gibberish, malformed URLs,
// disposable emails, meme references, and creative bypass attempts.
//
// v2.0 - Now uses robust JSON parsing from json-parser-utils.ts
// =============================================================================

import {
  extractAndParseJson,
  validateFormValidationStructure,
  logParseFailure,
  getParseMetrics
} from './json-parser-utils';
import { clientConfig } from '../_config/client';

export interface FieldValidationResult {
  isValid: boolean;
  errorMessage?: string;
  errorCode?: 'INVALID_FORMAT' | 'INAPPROPRIATE' | 'NONSENSICAL' | 'SUSPICIOUS';
}

export interface FormValidationResult {
  isValid: boolean;
  fields: {
    website: FieldValidationResult;
    email: FieldValidationResult;
    companyName: FieldValidationResult;
    city: FieldValidationResult;
    biggestPainPoint: FieldValidationResult;
    currentTools: FieldValidationResult;
  };
}

export interface AuditFormValidationInput {
  website: string;
  email: string;
  companyName: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

/**
 * Generate the validation prompt for the LLM
 */
function generateValidationPrompt(formData: AuditFormValidationInput): string {
  const isCzech = formData.language === 'cs';
  
  const systemInstructions = isCzech ? `
Jsi profesionální validátor formulářů pro službu AI auditu pro firmy. Validuj přesně a jasně, bez humoru a emojis.

## VALIDAČNÍ PRAVIDLA

### Website URL
- Musí být platná, profesionální firemní URL
- ZAMÍTNI: Vulgární domény, nesmysly, localhost, IP adresy, špatně formátované URL (extra lomítka, neplatné znaky)
- ZAMÍTNI: Vtipné/meme domény, nevhodný obsah
- Příklady ŠPATNÝCH: "https://fuckyourmom.com", "http://asdfghjkl.xyz", "https://example.com\\\\"

### Email
- Musí být platný emailový formát
- AKCEPTUJ: Osobní emaily (gmail.com, outlook.com, yahoo.com, seznam.cz, email.cz, centrum.cz, hotmail.com, etc.) - jsou v pořádku!
- ZAMÍTNI: Dočasné/jednorázové emailové služby (mailinator, tempmail, guerrillamail, yopmail, 10minutemail, throwaway, temp-mail, fakeinbox, dispostable, etc.)
- ZAMÍTNI: Zjevně falešné emaily (test@test.test, a@a.a, admin@admin.admin, fake@fake.fake)

### Company Name (Název společnosti)
- Musí být věrohodný název firmy
- ZAMÍTNI: Vulgární výrazy, memes ("Deez Nuts Inc"), nesmysly, urážlivý obsah
- ZAMÍTNI: Jednotlivé znaky, samá čísla, náhodné stisknutí kláves
- OK: Normální názvy firem, zkratky, zahraniční jména

### City (Město)
- Musí být skutečné jméno města (české nebo mezinárodní)
- ZAMÍTNI: Vtipy ("Ur Mom's House", "Tvojemama"), nesmysly, vulgární výrazy
- OK: "Praha", "Prague", "Praha 1", "New York", "Ústí nad Labem", "Brno"

### Pain Point (Největší problém - volitelné)
- Mělo by popisovat skutečný obchodní problém
- ZAMÍTNI: Nesmysly, vulgární stížnosti, úplně mimo téma
- OK: Prázdné (je volitelné), jakýkoliv legitimní obchodní problém

### Tools (Nástroje - volitelné)
- Měly by být skutečné názvy software/nástrojů
- ZAMÍTNI: Vulgární obsah, naprosté nesmysly
- OK: Prázdné, jakékoliv rozpoznatelné nástroje

## STYL CHYBOVÝCH HLÁŠEK
- Profesionální, jasný, konkrétní
- BEZ emojis, BEZ humoru
- Stručné (max 80 znaků)
- V češtině pro české uživatele
- Příklady:
  - "Zadejte prosím platnou webovou adresu vaší firmy."
  - "URL obsahuje neplatné znaky. Zkontrolujte formát."
  - "Zadejte prosím platnou emailovou adresu."
  - "Tato emailová služba není podporována."
  - "Zadejte prosím skutečný název firmy."
  - "Zadejte prosím platné město."
` : `
You are a professional form validator for a business AI audit service. Validate precisely and clearly, without humor or emojis.

## VALIDATION RULES

### Website URL
- Must be a valid, professional business URL
- REJECT: Vulgar domains, gibberish, localhost, IP addresses, malformed URLs (extra slashes, invalid chars)
- REJECT: Joke/meme domains, inappropriate content domains
- Examples of BAD: "https://fuckyourmom.com", "http://asdfghjkl.xyz", "https://example.com\\\\"

### Email
- Must be a valid email format
- ACCEPT: Personal emails (gmail.com, outlook.com, yahoo.com, hotmail.com, icloud.com, etc.) - these are fine!
- REJECT: Disposable/temporary email services (mailinator, tempmail, guerrillamail, yopmail, 10minutemail, throwaway, temp-mail, fakeinbox, dispostable, etc.)
- REJECT: Obviously fake emails (test@test.test, a@a.a, admin@admin.admin, fake@fake.fake)

### Company Name
- Must be a plausible business name
- REJECT: Vulgar terms, memes ("Deez Nuts Inc"), gibberish, offensive content
- REJECT: Single characters, all numbers, keyboard smashes
- OK: Normal company names, abbreviations, foreign names

### City
- Must be a real city name (Czech or international)
- REJECT: Jokes ("Ur Mom's House", "Yourtown"), gibberish, vulgar terms
- OK: "Praha", "Prague", "Praha 1", "New York", "Ústí nad Labem", "Brno"

### Pain Point (optional - only validate if provided)
- Should describe an actual business problem
- REJECT: Gibberish, vulgar rants, completely off-topic content
- OK: Empty (it's optional), any legitimate business concern

### Tools (optional - only validate if provided)
- Should be real software/tool names
- REJECT: Vulgar content, complete gibberish
- OK: Empty, any recognizable tools

## ERROR MESSAGE STYLE
- Professional, clear, specific
- NO emojis, NO humor
- Concise (max 80 characters)
- In English for English users
- Examples:
  - "Please enter a valid company website URL."
  - "URL contains invalid characters. Please check the format."
  - "Please enter a valid email address."
  - "This email service is not supported."
  - "Please enter a valid company name."
  - "Please enter a valid city name."
`;


  return `${systemInstructions}

## FORM DATA TO VALIDATE

Website: ${formData.website}
Email: ${formData.email}
Company Name: ${formData.companyName}
City: ${formData.city}
Pain Point: ${formData.biggestPainPoint || '(empty - optional field)'}
Tools: ${formData.currentTools || '(empty - optional field)'}

## IMPORTANT
- Output ONLY valid JSON, no markdown, no explanations
- The JSON must be directly parseable by JSON.parse()
- For optional fields (Pain Point, Tools), only set isValid=false if they contain BAD content (not if empty)
- Error messages should be short (max 100 chars), friendly, and slightly humorous

## OUTPUT FORMAT (JSON only)
{
  "isValid": true/false,
  "fields": {
    "website": { "isValid": true/false, "errorMessage": "..." },
    "email": { "isValid": true/false, "errorMessage": "..." },
    "companyName": { "isValid": true/false, "errorMessage": "..." },
    "city": { "isValid": true/false, "errorMessage": "..." },
    "biggestPainPoint": { "isValid": true/false, "errorMessage": "..." },
    "currentTools": { "isValid": true/false, "errorMessage": "..." }
  }
}

Output the JSON now:`;
}

/**
 * Parse LLM JSON response with robust error handling
 * v2.0 - Now uses robust extraction from json-parser-utils.ts
 */
function parseValidationResponse(content: string): FormValidationResult | null {
  // STEP 1: Extract and parse JSON
  const parsed = extractAndParseJson(content, 'Form Validator');
  
  if (!parsed) {
    console.error('[Validator] Failed to extract valid JSON from LLM response');
    logParseFailure(content, new Error('Extraction failed'), 'Form Validator');
    return null;
  }
  
  // STEP 2: Validate structure
  const validation = validateFormValidationStructure(parsed);
  
  if (!validation.isValid) {
    console.error('[Validator] Invalid response structure:', validation.errors);
    return null;
  }
  
  // STEP 3: Return validated data
  console.log('[Validator] ✓ JSON parsed and validated successfully');
  return parsed as FormValidationResult;
}

/**
 * Main validation function - calls OpenRouter LLM to validate all fields
 */
export async function validateFormWithAI(
  formData: AuditFormValidationInput,
  openrouterApiKey: string
): Promise<FormValidationResult> {
  console.log('[Validator] Starting AI validation...');
  
  const prompt = generateValidationPrompt(formData);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for validation
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': clientConfig.siteUrl,
        'X-Title': `${clientConfig.company.name} AI Form Validator`
      },
      body: JSON.stringify({
        models: [
          'google/gemini-3-flash-preview',    // Primary - fast, good for validation
          'google/gemini-3-pro-preview',      // Fallback 1 - Google's capable model
          'anthropic/claude-sonnet-4.5'       // Fallback 2 - highest quality fallback
        ],
        messages: [
          {
            role: 'system',
            content: 'You are an expert form validator. You MUST output ONLY valid JSON, no markdown, no explanations. The JSON must be directly parseable by JSON.parse().'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000, // Increased for safety
        temperature: 0.2  // Low temperature for consistent validation
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Validator] API error:', response.status, errorData);
      throw new Error(`Validation API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (!responseData.choices?.[0]?.message?.content) {
      console.error('[Validator] Invalid API response structure');
      throw new Error('Invalid validation response');
    }
    
    const content = responseData.choices[0].message.content;
    const actualModel = responseData.model;
    
    console.log(`[Validator] Response from model: ${actualModel}`);
    if (actualModel !== 'google/gemini-3-flash-preview') {
      console.log(`[Validator] ⚠️ Used fallback model: ${actualModel}`);
    }
    
    const validationResult = parseValidationResponse(content);
    
    if (!validationResult) {
      throw new Error('Failed to parse validation response');
    }
    
    console.log(`[Validator] Validation complete. Overall valid: ${validationResult.isValid}`);
    
    return validationResult;
    
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Validator] Request timed out');
    } else {
      console.error('[Validator] Validation error:', error);
    }
    
    // Return permissive fallback on validation failure (don't block users if validation fails)
    // TRACK THIS: This indicates the validator had issues and allowed submission through
    console.warn('[Validator] ========================================');
    console.warn('[Validator] ⚠️ USING PERMISSIVE FALLBACK');
    console.warn('[Validator] Validation system encountered an error');
    console.warn('[Validator] Allowing submission to proceed (user-friendly)');
    console.warn('[Validator] Error:', error instanceof Error ? error.message : 'Unknown');
    console.warn('[Validator] Parse metrics:', getParseMetrics());
    console.warn('[Validator] ========================================');
    
    return {
      isValid: true,
      fields: {
        website: { isValid: true },
        email: { isValid: true },
        companyName: { isValid: true },
        city: { isValid: true },
        biggestPainPoint: { isValid: true },
        currentTools: { isValid: true }
      }
    };
  }
}
