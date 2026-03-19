// =============================================================================
// TYPES - PDF Generator type definitions
// =============================================================================

import type { AuditFormData } from '../openrouter-analysis';

// Re-export AuditFormData for convenience
export type { AuditFormData };

// =============================================================================
// COLOR DEFINITIONS
// =============================================================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PDFColors {
  primary: RGB;
  primaryLight: RGB;
  orange: RGB;
  blue: RGB;
  purple: RGB;
  green: RGB;
  dark: RGB;
  darkGray: RGB;
  text: RGB;
  textMuted: RGB;
  white: RGB;
  black: RGB;
}

// =============================================================================
// RESULT TYPES
// =============================================================================

export interface PDFGenerationResult {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
}

export interface ParsedSection {
  title: string;
  content: string;
}

// =============================================================================
// QUADRANT DEFINITION
// =============================================================================

export interface MatrixQuadrant {
  x: number;
  y: number;
  color: RGB;
  title: string;
  desc: string;
}
