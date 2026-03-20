// =============================================================================
// GENERATOR - Main HTML report assembly function
// =============================================================================

import type { AuditReportData } from './types';
import type { Translations } from './types';
import { getTranslations } from './translations';
import { getStyles } from './styles';
import { getScripts } from './scripts';
import { escapeHtml } from './utils';
import {
  generateHeader,
  generateCompanySection,
  generateIntroSection,
  generateQuestionsSection,
  generateExecutiveSummarySection,
  generateOpportunitiesSection,
  generateMatrixSection,
  generateTechnologiesSection,
  generateAppIntegrationSection,
  generateBenchmarkSection,
  generateTimelineSection,
  generateRiskSection,
  generateToolsSection,
  generateROISection,
  generateCTASection,
  generateFooter
} from './sections';
import { clientConfig } from '../../_config/client';

// =============================================================================
// SECTION REGISTRY
// Default rendering order for all optional (non-pinned) sections.
// "header" is always rendered first; "footer" is always rendered last.
// =============================================================================

type SectionRenderer = (data: AuditReportData, t: Translations) => string;

/**
 * Mapping from section name slug to its render function and optional wrapper.
 * The wrapper is used when a section needs an outer container element.
 */
const SECTION_RENDERERS: Record<string, { render: SectionRenderer; wrapper?: string }> = {
  company:     { render: generateCompanySection },
  summary:     { render: generateExecutiveSummarySection },
  opportunities: {
    render: generateOpportunitiesSection,
    wrapper: 'secondary-grid-full',
  },
  matrix:      { render: generateMatrixSection },
  roi:         { render: generateROISection },
  questions:   { render: generateQuestionsSection },
  technologies: { render: generateTechnologiesSection },
  'app-integration': { render: generateAppIntegrationSection },
  benchmark:   { render: generateBenchmarkSection },
  timeline:    { render: generateTimelineSection },
  risk:        { render: generateRiskSection },
  tools:       { render: generateToolsSection },
  intro:       { render: generateIntroSection },
  cta:         { render: generateCTASection },
};

/** Default section order when no override is provided via config. */
const DEFAULT_SECTION_ORDER: string[] = [
  'company',
  'summary',
  'opportunities',
  'matrix',
  'roi',
  'questions',
  'technologies',
  'app-integration',
  'benchmark',
  'timeline',
  'risk',
  'tools',
  'intro',
  'cta',
];

// =============================================================================
// MAIN GENERATOR FUNCTION
// =============================================================================

/**
 * Generates the complete HTML report from audit data.
 * This is the main entry point for HTML report generation.
 *
 * Section rendering is config-driven:
 *   - clientConfig.report.sections.order  — custom rendering order
 *   - clientConfig.report.sections.disabled — sections to omit entirely
 *
 * "header" and "footer" are always pinned: header is rendered first,
 * footer last, and neither can be disabled via config.
 */
export function generateHTMLReport(data: AuditReportData): string {
  const t = getTranslations(data.language);
  const styles = getStyles(data.companyBranding);
  const scripts = getScripts(data);

  // Resolve section order and disabled list from config (with safe defaults).
  const sectionOrder: string[] =
    clientConfig.report.sections?.order ?? DEFAULT_SECTION_ORDER;
  const disabledSections: readonly string[] =
    clientConfig.report.sections?.disabled ?? [];

  // Build the inner content HTML for each optional section in order.
  const sectionHtml = sectionOrder
    .filter((name) => !disabledSections.includes(name))
    .map((name) => {
      const entry = SECTION_RENDERERS[name];
      if (!entry) return ''; // Unknown section names are silently skipped.

      const rendered = entry.render(data, t);
      if (!entry.wrapper) return rendered;
      return `<div class="${entry.wrapper}">\n          ${rendered}\n        </div>`;
    })
    .join('\n\n        ');

  return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.preAuditReport} - ${escapeHtml(data.companyProfile.name)}</title>
  <meta name="robots" content="noindex, nofollow">
  <style>${styles}</style>
</head>
<body>
  <div class="report-wrapper">
    ${generateHeader(data, t)}

    <main class="report-main">
      <div class="content-container">
        ${sectionHtml}
      </div>
    </main>

    ${generateFooter(data, t)}
  </div>

  <script>${scripts}</script>
</body>
</html>`;
}
