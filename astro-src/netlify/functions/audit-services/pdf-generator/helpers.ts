// =============================================================================
// HELPERS - PDF helper functions for fonts, logos, headers, footers
// =============================================================================

import { jsPDF } from 'jspdf';
import type { AuditFormData } from './types';
import { COLORS, extractDomain } from './styles';
import { clientConfig } from '../../../_config/client';

// Track font state
let fontName = 'helvetica';
let fontLoaded = false;

export function getFontName(): string {
  return fontName;
}

export function isFontLoaded(): boolean {
  return fontLoaded;
}

// =============================================================================
// FONT LOADING
// =============================================================================

/**
 * Fetch font data from reliable CDN and convert to Base64 for jsPDF
 * IMPORTANT: jsPDF requires TTF format - WOFF/WOFF2 will NOT work!
 */
export async function loadFontFromCDN(fontWeight: 'regular' | 'bold' = 'regular'): Promise<string> {
  const fontUrls = {
    regular: [
      'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Regular.ttf',
      'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf'
    ],
    bold: [
      'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Bold.ttf',
      'https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf'
    ]
  };

  const urls = fontUrls[fontWeight];

  for (const url of urls) {
    try {
      console.log(`[PDF] Attempting to load TTF font from: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': '*/*' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[PDF] Font fetch returned ${response.status} from ${url}`);
        continue;
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength < 50000) {
        console.warn(`[PDF] Font data too small for full TTF (${buffer.byteLength} bytes) from ${url}`);
        continue;
      }

      console.log(`[PDF] Successfully loaded TTF font (${buffer.byteLength} bytes) from ${url}`);
      return Buffer.from(buffer).toString('base64');
    } catch (error) {
      console.warn(`[PDF] Failed to load font from ${url}:`, error instanceof Error ? error.message : error);
    }
  }

  console.warn('[PDF] All TTF font loading attempts failed, will use Helvetica fallback');
  return '';
}

/**
 * Load brand logo and return as Base64 data URL
 */
export async function loadLogoAsBase64(url: string): Promise<string> {
  try {
    console.log(`[PDF] Loading logo from: ${url}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'image/*' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[PDF] Logo fetch returned ${response.status}`);
      return '';
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const buffer = await response.arrayBuffer();

    if (buffer.byteLength < 100) {
      console.warn(`[PDF] Logo data too small (${buffer.byteLength} bytes)`);
      return '';
    }

    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = contentType.includes('png') ? 'image/png' :
                     contentType.includes('jpeg') || contentType.includes('jpg') ? 'image/jpeg' :
                     'image/png';

    console.log(`[PDF] Successfully loaded logo (${buffer.byteLength} bytes)`);
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.warn(`[PDF] Failed to load logo:`, error instanceof Error ? error.message : error);
    return '';
  }
}

/**
 * Initialize fonts for the PDF document
 */
export async function initializeFonts(doc: jsPDF): Promise<void> {
  console.log('[PDF] Initializing fonts...');

  try {
    const robotoRegular = await loadFontFromCDN('regular');

    if (robotoRegular && robotoRegular.length > 50000) {
      console.log(`[PDF] Adding Roboto Regular to VFS (${robotoRegular.length} base64 chars)...`);
      doc.addFileToVFS('Roboto-Regular.ttf', robotoRegular);
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

      try {
        doc.setFont('Roboto', 'normal');
        doc.getStringUnitWidth('Test');
        console.log('[PDF] Roboto Regular font verified working');

        const robotoBold = await loadFontFromCDN('bold');
        if (robotoBold && robotoBold.length > 50000) {
          console.log(`[PDF] Adding Roboto Bold to VFS (${robotoBold.length} base64 chars)...`);
          doc.addFileToVFS('Roboto-Bold.ttf', robotoBold);
          doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
          console.log('[PDF] Roboto Bold font added');
        }

        fontName = 'Roboto';
        fontLoaded = true;
        console.log('[PDF] Roboto fonts initialized successfully');
        return;
      } catch (verifyError) {
        console.warn('[PDF] Roboto font registered but verification failed:', verifyError);
      }
    } else {
      console.log(`[PDF] Roboto font data insufficient (${robotoRegular?.length || 0} chars), using Helvetica`);
    }
  } catch (error) {
    console.warn('[PDF] Font initialization error:', error);
  }

  console.log('[PDF] Using Helvetica fallback font');
  fontName = 'helvetica';
  fontLoaded = false;
  doc.setFont('helvetica', 'normal');
}

// =============================================================================
// HEADER AND FOOTER
// =============================================================================

/**
 * Add company name as text when logo fails to load
 */
export function addCompanyNameAsLogoFallback(doc: jsPDF, formData: AuditFormData, pageWidth: number): void {
  const companyName = formData.companyName || extractDomain(formData.website);
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(14);
  doc.setFont(fontName, 'bold');
  const displayName = companyName.length > 20 ? companyName.substring(0, 18) + '...' : companyName;
  doc.text(displayName, pageWidth - 15, 20, { align: 'right' });
}

/**
 * Add professional header with dual logos
 */
export async function addHeader(
  doc: jsPDF,
  formData: AuditFormData,
  companyLogoUrl?: string
): Promise<void> {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background
  doc.setFillColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Primary accent line
  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Left Logo: Brand logo
  const hdLogoUrl = clientConfig.brand.logoUrl;
  const hdLogo = await loadLogoAsBase64(hdLogoUrl);

  if (hdLogo) {
    try {
      doc.addImage(hdLogo, 'PNG', 15, 10, 50, 16);
    } catch (e) {
      console.warn('[PDF] Failed to add HD logo to PDF:', e);
      doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
      doc.setFontSize(18);
      doc.setFont(fontName, 'bold');
      doc.text(clientConfig.company.name, 15, 20);
    }
  } else {
    doc.setTextColor(COLORS.white.r, COLORS.white.g, COLORS.white.b);
    doc.setFontSize(18);
    doc.setFont(fontName, 'bold');
    doc.text(clientConfig.company.name, 15, 20);
  }

  // Right Logo: Company Logo
  if (companyLogoUrl) {
    const companyLogo = await loadLogoAsBase64(companyLogoUrl);
    if (companyLogo) {
      try {
        doc.addImage(companyLogo, 'PNG', pageWidth - 55, 10, 40, 16, undefined, 'FAST');
      } catch (e) {
        console.warn('[PDF] Failed to add company logo to PDF:', e);
        addCompanyNameAsLogoFallback(doc, formData, pageWidth);
      }
    } else {
      addCompanyNameAsLogoFallback(doc, formData, pageWidth);
    }
  } else {
    addCompanyNameAsLogoFallback(doc, formData, pageWidth);
  }

  // Tagline under HD logo
  doc.setTextColor(COLORS.textMuted.r, COLORS.textMuted.g, COLORS.textMuted.b);
  doc.setFontSize(8);
  doc.setFont(fontName, 'normal');
  const tagLine = formData.language === 'cs' ? 'AI TRANSFORMACNI PARTNER' : 'AI TRANSFORMATION PARTNER';
  doc.text(tagLine, 15, 32);

  // Date on right
  const dateStr = new Date().toLocaleDateString(formData.language === 'cs' ? 'cs-CZ' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  doc.text(dateStr, pageWidth - 15, 32, { align: 'right' });
}

/**
 * Add footer to all pages
 */
export function addFooters(doc: jsPDF): void {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`${i} / ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
    doc.text(`${clientConfig.siteUrl.replace('https://', '')} | ${clientConfig.contact.email}`, 15, pageHeight - 10);
  }
}

/**
 * Add contact/next steps section at the end
 */
export function addContactSection(doc: jsPDF, currentY: number, language: 'cs' | 'en'): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  if (currentY > pageHeight - 60) {
    doc.addPage();
    currentY = 50;
  }

  doc.setFillColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 45, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont(fontName, 'bold');
  const contactTitle = language === 'cs' ? 'DALSI KROKY & KONTAKT' : 'NEXT STEPS & CONTACT';
  doc.text(contactTitle, margin + 10, currentY + 12);

  doc.setFontSize(10);
  doc.setFont(fontName, 'normal');
  const contactName = `${clientConfig.primaryContact.name} - ${clientConfig.primaryContact.title}`;
  doc.text(contactName, margin + 10, currentY + 22);

  doc.setFontSize(9);
  doc.text(`${clientConfig.primaryContact.email} | ${clientConfig.primaryContact.phone}`, margin + 10, currentY + 30);

  doc.setTextColor(COLORS.primaryLight.r, COLORS.primaryLight.g, COLORS.primaryLight.b);
  const calUrl = (clientConfig.primaryContact.calendarUrl || '').replace('https://', '');
  const bookingText = language === 'cs'
    ? `Rezervovat konzultaci: ${calUrl}`
    : `Book consultation: ${calUrl}`;
  doc.text(bookingText, margin + 10, currentY + 38);

  return currentY + 50;
}
