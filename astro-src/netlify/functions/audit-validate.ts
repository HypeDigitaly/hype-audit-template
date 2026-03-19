import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { validateFormWithAI, type FormValidationResult } from "./audit-services/ai-field-validator";

// =============================================================================
// AUDIT VALIDATION ENDPOINT - Fast Validation-Only Response
// =============================================================================
// This endpoint ONLY performs form validation (basic + AI) and returns immediately.
// It does NOT execute the full audit workflow (research, report generation, emails).
// 
// Purpose: Allow frontend to show accurate validation progress that ends exactly
// when AI validation completes (~1-3 seconds), not when the full audit finishes.
//
// Flow:
// 1. Frontend calls /audit-validate → shows validation progress
// 2. This endpoint validates → returns immediately when AI responds
// 3. Frontend transitions to main progress → calls /audit for full workflow
// =============================================================================

// Form data interface
interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

// Type guard for language
function isValidLanguage(lang: unknown): lang is 'cs' | 'en' {
  return lang === 'cs' || lang === 'en';
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Only POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  // Determine language early for error messages
  let detectedLanguage: 'cs' | 'en' = 'cs';

  try {
    // Parse form data
    let formData: AuditFormData;
    const contentType = event.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      const parsed = JSON.parse(event.body || "{}");
      detectedLanguage = isValidLanguage(parsed.language) ? parsed.language : 'cs';
      
      formData = {
        email: parsed.email?.trim() || "",
        website: parsed.website?.trim() || "",
        companyName: parsed.companyName?.trim() || "",
        city: parsed.city?.trim() || "",
        biggestPainPoint: parsed.biggestPainPoint?.trim() || "",
        currentTools: parsed.currentTools?.trim() || "",
        language: detectedLanguage
      };
    } else {
      const params = new URLSearchParams(event.body || "");
      const langParam = params.get("language");
      detectedLanguage = isValidLanguage(langParam) ? langParam : 'cs';
      
      formData = {
        email: params.get("email")?.trim() || "",
        website: params.get("website")?.trim() || "",
        companyName: params.get("companyName")?.trim() || "",
        city: params.get("city")?.trim() || "",
        biggestPainPoint: params.get("biggestPainPoint")?.trim() || "",
        currentTools: params.get("currentTools")?.trim() || "",
        language: detectedLanguage
      };
    }

    const isCzech = formData.language === 'cs';

    // =========================================================================
    // STEP 1: Basic Required Field Validation
    // =========================================================================
    console.log(`[Audit-Validate] Starting validation for: ${formData.companyName}`);
    
    const requiredFields: { key: keyof AuditFormData; labelCs: string; labelEn: string }[] = [
      { key: 'email', labelCs: 'E-mail', labelEn: 'Email' },
      { key: 'website', labelCs: 'Webová stránka', labelEn: 'Website' },
      { key: 'companyName', labelCs: 'Název společnosti', labelEn: 'Company Name' },
      { key: 'city', labelCs: 'Město', labelEn: 'City' },
    ];

    for (const field of requiredFields) {
      if (!formData[field.key]) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            isValid: false,
            error: isCzech
              ? `Pole "${field.labelCs}" je povinné.`
              : `Field "${field.labelEn}" is required.`
          }),
        };
      }
    }

    // =========================================================================
    // STEP 2: Basic Format Validation (Email & URL)
    // =========================================================================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          isValid: false,
          error: isCzech
            ? "Zadejte prosím platnou e-mailovou adresu."
            : "Please enter a valid email address."
        }),
      };
    }

    try {
      new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          isValid: false,
          error: isCzech
            ? "Zadejte prosím platnou webovou adresu."
            : "Please enter a valid website URL."
        }),
      };
    }

    // =========================================================================
    // STEP 3: Check API Key
    // =========================================================================
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error("[Audit-Validate] OPENROUTER_API_KEY is not configured");
      // Return success anyway - don't block users due to missing config
      // The main /audit endpoint will handle this error
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          isValid: true,
          message: "Validation skipped (config issue)"
        }),
      };
    }

    // =========================================================================
    // STEP 4: AI-Powered Field Validation (OpenRouter)
    // =========================================================================
    console.log("[Audit-Validate] Running AI validation...");
    
    const validationResult = await validateFormWithAI(
      {
        website: formData.website,
        email: formData.email,
        companyName: formData.companyName,
        city: formData.city,
        biggestPainPoint: formData.biggestPainPoint,
        currentTools: formData.currentTools,
        language: formData.language
      },
      OPENROUTER_API_KEY
    );

    if (!validationResult.isValid) {
      console.log("[Audit-Validate] Validation failed:", JSON.stringify(validationResult.fields));
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          isValid: false,
          error: isCzech
            ? "Některá pole obsahují neplatné údaje. Zkontrolujte prosím formulář."
            : "Some fields contain invalid data. Please check the form.",
          validationErrors: validationResult.fields
        }),
      };
    }

    // =========================================================================
    // SUCCESS: All validation passed
    // =========================================================================
    console.log("[Audit-Validate] All validation passed ✓");
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        isValid: true,
        message: isCzech
          ? "Validace úspěšná. Spouštíme audit..."
          : "Validation successful. Starting audit..."
      }),
    };

  } catch (error) {
    console.error("[Audit-Validate] Handler error:", error);
    
    // On unexpected errors, return success to not block users
    // The main /audit endpoint will handle actual processing errors
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        isValid: true,
        message: "Validation completed with fallback"
      }),
    };
  }
};

export { handler };
