// =============================================================================
// GENERATOR - Main PDF generation functions
// =============================================================================

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { PDFGenerationResult, AuditFormData } from './types';
import { clientConfig } from '../../../_config/client';
import {
  COLORS,
  getMatrixQuadrants,
  cleanMarkdownText,
  stripEmojis,
  extractDomain,
  parseMarkdownToSections
} from './styles';
import {
  initializeFonts,
  addHeader,
  addFooters,
  addContactSection,
  getFontName,
  isFontLoaded
} from './helpers';

// =============================================================================
// CONTENT RENDERING
// =============================================================================

/**
 * Draw Opportunity Matrix (2x2 Grid)
 */
function drawOpportunityMatrix(doc: jsPDF, startY: number, language: 'cs' | 'en'): number {
  const margin = 15;
  const fontName = getFontName();
  let currentY = startY + 8;

  doc.setFontSize(14);
  doc.setFont(fontName, 'bold');
  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  const matrixTitle = language === 'cs' ? 'Matice prilezitosti' : 'Opportunity Matrix';
  doc.text(matrixTitle, margin, currentY);
  currentY += 8;

  const boxSize = 38;
  const gap = 2;
  const quadrants = getMatrixQuadrants(margin, currentY, boxSize, gap, language);

  quadrants.forEach(q => {
    doc.setFillColor(q.color.r, q.color.g, q.color.b);
    doc.rect(q.x, q.y, boxSize, boxSize, 'F');

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(q.x, q.y, boxSize, boxSize, 'S');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(fontName, 'bold');
    doc.text(q.title, q.x + 3, q.y + 12);

    doc.setFont(fontName, 'normal');
    doc.setFontSize(6);
    const descLines = doc.splitTextToSize(q.desc, boxSize - 6);
    doc.text(descLines, q.x + 3, q.y + 18);
  });

  return currentY + (boxSize * 2) + gap + 15;
}

/**
 * Render text content to PDF
 */
function renderTextContent(
  doc: jsPDF,
  content: string,
  startY: number,
  margin: number,
  contentWidth: number,
  pageHeight: number
): number {
  let currentY = startY;
  const fontName = getFontName();
  const cleanContent = cleanMarkdownText(content);
  if (!cleanContent) return currentY;

  doc.setTextColor(COLORS.black.r, COLORS.black.g, COLORS.black.b);
  doc.setFontSize(10);
  doc.setFont(fontName, 'normal');

  const lines = cleanContent.split('\n').filter(l => l.trim());

  for (const line of lines) {
    if (currentY > pageHeight - 25) {
      doc.addPage();
      currentY = 50;
    }

    if (line.startsWith('###')) {
      doc.setFont(fontName, 'bold');
      doc.setFontSize(11);
      doc.setTextColor(COLORS.darkGray.r, COLORS.darkGray.g, COLORS.darkGray.b);
      const headerText = stripEmojis(line.replace(/^###\s*/, ''));
      doc.text(headerText, margin, currentY);
      currentY += 6;
      doc.setFont(fontName, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(COLORS.black.r, COLORS.black.g, COLORS.black.b);
      continue;
    }

    const isBullet = line.startsWith('•') || line.startsWith('-');
    const processedLine = stripEmojis(line);

    const splitLines = doc.splitTextToSize(processedLine, isBullet ? contentWidth - 5 : contentWidth);

    for (let i = 0; i < splitLines.length; i++) {
      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 50;
      }

      const xPos = isBullet && i > 0 ? margin + 5 : margin;
      doc.text(splitLines[i], xPos, currentY);
      currentY += 5;
    }
    currentY += 1;
  }

  return currentY;
}

/**
 * Add a section to the PDF with autotable support for tables
 */
function addSection(doc: jsPDF, title: string, content: string, startY: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const fontName = getFontName();
  const contentWidth = pageWidth - (margin * 2);
  let currentY = startY;

  if (currentY > pageHeight - 40) {
    doc.addPage();
    currentY = 50;
  }

  if (title) {
    const cleanTitle = stripEmojis(title);
    doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.setFontSize(13);
    doc.setFont(fontName, 'bold');
    doc.text(cleanTitle, margin, currentY);
    currentY += 5;

    doc.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, margin + Math.min(doc.getTextWidth(cleanTitle), 60), currentY);
    currentY += 6;
  }

  const tableRegex = /(\|[^\n]+\|\n(?:\|[\s:\-]+\|\n)?(?:\|[^\n]+\|\n?)+)/g;
  const parts = content.split(tableRegex);

  for (const part of parts) {
    if (!part || !part.trim()) continue;

    if (part.trim().startsWith('|') && part.includes('\n')) {
      try {
        const lines = part.trim().split('\n').filter(l => l.trim());
        if (lines.length >= 2) {
          const headers = lines[0].split('|').filter(s => s.trim()).map(s => stripEmojis(s.trim()));
          const dataStartIndex = lines[1].includes('---') ? 2 : 1;
          const data = lines.slice(dataStartIndex).map(line =>
            line.split('|').filter(s => s.trim()).map(s => stripEmojis(s.trim()))
          ).filter(row => row.length > 0);

          if (headers.length > 0 && data.length > 0) {
            if (currentY > pageHeight - 60) {
              doc.addPage();
              currentY = 50;
            }

            (doc as any).autoTable({
              head: [headers],
              body: data,
              startY: currentY,
              margin: { left: margin, right: margin },
              styles: {
                font: fontName,
                fontSize: 8,
                cellPadding: 3
              },
              headStyles: {
                fillColor: [COLORS.primary.r, COLORS.primary.g, COLORS.primary.b],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
              },
              alternateRowStyles: {
                fillColor: [245, 245, 245]
              },
              tableLineColor: [200, 200, 200],
              tableLineWidth: 0.1
            });
            currentY = (doc as any).lastAutoTable.finalY + 8;
          }
        }
      } catch (tableError) {
        console.warn('[PDF] Table rendering error:', tableError);
        currentY = renderTextContent(doc, part, currentY, margin, contentWidth, pageHeight);
      }
    } else {
      currentY = renderTextContent(doc, part, currentY, margin, contentWidth, pageHeight);
    }
  }

  return currentY;
}

// =============================================================================
// MAIN GENERATION FUNCTIONS
// =============================================================================

/**
 * Main PDF Generation function
 */
export async function generatePDFReport(
  reportMarkdown: string,
  formData: AuditFormData
): Promise<PDFGenerationResult> {
  console.log('[PDF] Starting PDF generation...');
  console.log(`[PDF] Report markdown length: ${reportMarkdown?.length || 0} characters`);

  try {
    if (!reportMarkdown || reportMarkdown.trim().length < 100) {
      console.error(`[PDF] Report markdown is too short or empty (Length: ${reportMarkdown?.length || 0})`);
      return {
        success: false,
        error: `Report content is too short (${reportMarkdown?.length || 0} chars)`
      };
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    await initializeFonts(doc);
    const fontName = getFontName();
    console.log(`[PDF] Using font: ${fontName} (Loaded: ${isFontLoaded()})`);

    const sections = parseMarkdownToSections(reportMarkdown);
    console.log(`[PDF] Parsed ${sections.length} sections from markdown`);

    if (sections.length === 0) {
      console.error('[PDF] No sections parsed from markdown.');
      return {
        success: false,
        error: 'Failed to parse report content into sections'
      };
    }

    const domain = extractDomain(formData.website);
    const companyLogoUrl = `https://logo.clearbit.com/${domain}`;

    console.log('[PDF] Adding header...');
    await addHeader(doc, formData, companyLogoUrl);

    let currentY = 52;
    const companyName = formData.companyName || domain;

    doc.setFontSize(20);
    doc.setFont(fontName, 'bold');
    doc.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b);
    const mainTitle = formData.language === 'cs'
      ? 'PREDBEZNY AUDIT VYUZITI AI'
      : 'PRELIMINARY AI AUDIT';
    doc.text(mainTitle, 15, currentY);
    currentY += 10;

    doc.setFontSize(16);
    doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
    doc.text(stripEmojis(companyName), 15, currentY);
    currentY += 18;

    console.log('[PDF] Drawing opportunity matrix...');
    currentY = drawOpportunityMatrix(doc, currentY, formData.language);

    console.log('[PDF] Rendering sections...');
    for (const section of sections) {
      if (!section.title && !section.content) continue;
      console.log(`[PDF] Rendering section: "${section.title}"`);
      currentY = addSection(doc, section.title, section.content, currentY);
      currentY += 8;
    }

    console.log('[PDF] Adding contact section...');
    currentY = addContactSection(doc, currentY, formData.language);

    addFooters(doc);

    console.log('[PDF] Generating final PDF output...');
    const pdfOutput = doc.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfOutput);

    console.log(`[PDF] PDF generation completed. Final size: ${pdfBuffer.length} bytes, Pages: ${doc.getNumberOfPages()}`);

    return {
      success: true,
      pdfBuffer
    };

  } catch (error) {
    console.error('[PDF] Critical exception during PDF generation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Generate a fallback PDF if main generation fails
 */
export function generateFallbackPDF(formData: AuditFormData): Buffer {
  console.log('[PDF] Generating fallback PDF...');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let currentY = 30;

  doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${clientConfig.company.name} - AI Transformation Partner`, margin, 13);

  currentY = 40;
  doc.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b);
  doc.setFontSize(18);
  const title = formData.language === 'cs'
    ? 'Predbezny AI Audit'
    : 'Preliminary AI Audit';
  doc.text(title, margin, currentY);
  currentY += 12;

  doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
  doc.setFontSize(14);
  doc.text(formData.companyName || formData.website, margin, currentY);
  currentY += 20;

  doc.setTextColor(COLORS.black.r, COLORS.black.g, COLORS.black.b);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const messages = formData.language === 'cs' ? [
    'Dekujeme za vas zajem o AI audit!',
    '',
    'Obdrzeli jsme vasi zadost a nas tym ji prave zpracovava.',
    'Budeme vas brzy kontaktovat s detailni analyzou.',
    '',
    'Vase udaje:',
    `- Web: ${formData.website}`,
    `- Odvetvi: ${formData.industry || 'Neuvedeno'}`,
    `- Mesto: ${formData.city || 'Neuvedeno'}`,
    `- Velikost firmy: ${formData.companySize || 'Neuvedeno'}`,
    `- Co chteji zefektivnit: ${formData.biggestPainPoint || 'Neuvedeno'}`,
    '',
    'Dalsi kroky:',
    '1. Nas konzultant vas bude kontaktovat do 24 hodin',
    '2. Naplanuji bezplatnou 30minutovou konzultaci',
    '3. Pripravime detailni analyzu na miru vasim potrebam',
    '',
    'Kontakt:',
    `${clientConfig.primaryContact.name} - ${clientConfig.primaryContact.title}`,
    clientConfig.primaryContact.email,
    clientConfig.primaryContact.phone,
    (clientConfig.primaryContact.calendarUrl || '').replace('https://', '')
  ] : [
    'Thank you for your interest in AI audit!',
    '',
    'We have received your request and our team is processing it.',
    'We will contact you soon with a detailed analysis.',
    '',
    'Your information:',
    `- Website: ${formData.website}`,
    `- Industry: ${formData.industry || 'Not specified'}`,
    `- City: ${formData.city || 'Not specified'}`,
    `- Company Size: ${formData.companySize || 'Not specified'}`,
    `- What to Optimize: ${formData.biggestPainPoint || 'Not specified'}`,
    '',
    'Next steps:',
    '1. A consultant will contact you within 24 hours',
    '2. We will schedule a free 30-minute consultation',
    '3. We will prepare a detailed analysis tailored to your needs',
    '',
    'Contact:',
    `${clientConfig.primaryContact.name} - ${clientConfig.primaryContact.title}`,
    clientConfig.primaryContact.email,
    clientConfig.primaryContact.phone,
    (clientConfig.primaryContact.calendarUrl || '').replace('https://', '')
  ];

  for (const line of messages) {
    doc.text(line, margin, currentY);
    currentY += 6;
  }

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`${clientConfig.siteUrl.replace('https://', '')} | ${clientConfig.contact.email}`, margin, pageHeight - 15);
  doc.text(new Date().toLocaleDateString(formData.language === 'cs' ? 'cs-CZ' : 'en-US'), pageWidth - margin, pageHeight - 15, { align: 'right' });

  console.log('[PDF] Fallback PDF generated');
  return Buffer.from(doc.output('arraybuffer'));
}
