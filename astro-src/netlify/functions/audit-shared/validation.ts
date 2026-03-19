// =============================================================================
// AUDIT VALIDATION - Form field validation helpers
// =============================================================================
// Shared validation functions for audit form data
// =============================================================================

import type { AuditFormData } from './types';

// =============================================================================
// LANGUAGE VALIDATION
// =============================================================================

/**
 * Type guard for validating language parameter
 */
export function isValidLanguage(lang: unknown): lang is 'cs' | 'en' {
  return lang === 'cs' || lang === 'en';
}

// =============================================================================
// REQUIRED FIELDS VALIDATION
// =============================================================================

interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate that all required fields are present and properly formatted
 */
export function validateRequiredFields(formData: AuditFormData): ValidationResult {
  const isCzech = formData.language === 'cs';

  // Define required fields with bilingual labels
  const requiredFields: { key: keyof AuditFormData; labelCs: string; labelEn: string }[] = [
    { key: 'email', labelCs: 'E-mail', labelEn: 'Email' },
    { key: 'website', labelCs: 'Webová stránka', labelEn: 'Website' },
    { key: 'companyName', labelCs: 'Název společnosti', labelEn: 'Company Name' },
    { key: 'city', labelCs: 'Město', labelEn: 'City' },
  ];

  // Check for missing required fields
  for (const field of requiredFields) {
    if (!formData[field.key]) {
      return {
        valid: false,
        error: isCzech
          ? `Pole "${field.labelCs}" je povinné.`
          : `Field "${field.labelEn}" is required.`
      };
    }
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      valid: false,
      error: isCzech
        ? "Zadejte prosím platnou e-mailovou adresu."
        : "Please enter a valid email address."
    };
  }

  // URL format validation
  try {
    new URL(formData.website.startsWith('http') ? formData.website : `https://${formData.website}`);
  } catch {
    return {
      valid: false,
      error: isCzech
        ? "Zadejte prosím platnou webovou adresu."
        : "Please enter a valid website URL."
    };
  }

  return { valid: true };
}
