// =============================================================================
// STYLES - PDF colors and styling constants
// =============================================================================

import type { PDFColors, MatrixQuadrant } from './types';

// =============================================================================
// COLOR CONSTANTS - Matching HypeDigitaly branding
// =============================================================================

export const COLORS: PDFColors = {
  primary: { r: 0, g: 163, b: 154 },      // #00A39A
  primaryLight: { r: 0, g: 196, b: 180 }, // #00C4B4
  orange: { r: 249, g: 115, b: 22 },      // #F97316 (Opportunity Matrix / Quick Wins)
  blue: { r: 59, g: 130, b: 246 },        // #3B82F6 (Strategic)
  purple: { r: 168, g: 85, b: 247 },      // #A855F7 (Future)
  green: { r: 34, g: 197, b: 94 },        // #22C55E (Success)
  dark: { r: 10, g: 10, b: 10 },          // #0A0A0A
  darkGray: { r: 40, g: 40, b: 40 },      // #282828
  text: { r: 229, g: 229, b: 229 },       // #E5E5E5
  textMuted: { r: 163, g: 163, b: 163 },  // #A3A3A3
  white: { r: 255, g: 255, b: 255 },
  black: { r: 0, g: 0, b: 0 }
};

// =============================================================================
// MATRIX QUADRANT DEFINITIONS
// =============================================================================

export function getMatrixQuadrants(
  startX: number,
  currentY: number,
  boxSize: number,
  gap: number,
  language: 'cs' | 'en'
): MatrixQuadrant[] {
  return [
    {
      x: startX,
      y: currentY,
      color: COLORS.orange,
      title: language === 'cs' ? 'Rychle vyhry' : 'Quick Wins',
      desc: language === 'cs' ? 'Vysoka hodnota / Nizka narocnost' : 'High Impact / Low Effort'
    },
    {
      x: startX + boxSize + gap,
      y: currentY,
      color: COLORS.blue,
      title: language === 'cs' ? 'Velke sazky' : 'Big Swings',
      desc: language === 'cs' ? 'Vysoka hodnota / Vysoka narocnost' : 'High Impact / High Effort'
    },
    {
      x: startX,
      y: currentY + boxSize + gap,
      color: COLORS.textMuted,
      title: language === 'cs' ? 'Doplnky' : 'Nice-to-Haves',
      desc: language === 'cs' ? 'Nizka hodnota / Nizka narocnost' : 'Low Impact / Low Effort'
    },
    {
      x: startX + boxSize + gap,
      y: currentY + boxSize + gap,
      color: COLORS.darkGray,
      title: language === 'cs' ? 'Nizka priorita' : 'Deprioritize',
      desc: language === 'cs' ? 'Nizka hodnota / Vysoka narocnost' : 'Low Impact / High Effort'
    }
  ];
}

// =============================================================================
// TEXT PROCESSING UTILITIES
// =============================================================================

/**
 * Clean markdown for text display (strip formatting but keep structure)
 */
export function cleanMarkdownText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^[-*]\s+/gm, '• ')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .trim();
}

/**
 * Remove emojis from text for PDF compatibility
 * Uses character ranges that work without the unicode flag
 */
export function stripEmojis(text: string): string {
  if (!text) return '';
  // Remove common emoji ranges and symbols that jsPDF can't render
  return text
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '') // Surrogate pairs (emojis)
    .replace(/[\u2600-\u27BF]/g, '') // Misc symbols
    .replace(/[\u2300-\u23FF]/g, '') // Misc technical
    .replace(/[\u2B50-\u2B55]/g, '') // Stars
    .replace(/[\u231A-\u231B]/g, '') // Watch/hourglass
    .replace(/[\u25AA-\u25AB]/g, '') // Squares
    .replace(/[\u25B6\u25C0]/g, '') // Play buttons
    .replace(/[\u25FB-\u25FE]/g, '') // Squares
    .replace(/[\u00A9\u00AE\u2122]/g, '') // ©®™
    .replace(/[\u2139]/g, '') // Info
    .replace(/[\u2194-\u21AA]/g, '') // Arrows
    .replace(/[\u23E9-\u23F3]/g, '') // Media controls
    .replace(/[\u23F8-\u23FA]/g, '') // Media controls
    .replace(/[\u25AA-\u25AB]/g, '') // Squares
    .trim();
}

/**
 * Extract domain from URL for logo fetching
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0];
  }
}

/**
 * Convert markdown to structured content for PDF
 */
export function parseMarkdownToSections(markdown: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)/);
    const h2Match = line.match(/^##\s+(.+)/);

    if (h1Match || h2Match) {
      if (currentTitle || currentContent.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentContent.join('\n').trim()
        });
      }
      currentTitle = (h1Match || h2Match)?.[1] || '';
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle || currentContent.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentContent.join('\n').trim()
    });
  }

  return sections;
}
