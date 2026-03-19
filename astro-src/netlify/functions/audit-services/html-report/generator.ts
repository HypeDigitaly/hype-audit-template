// =============================================================================
// GENERATOR - Main HTML report assembly function
// =============================================================================

import type { AuditReportData } from './types';
import { getTranslations } from './translations';
import { getStyles } from './styles';
import { getScripts } from './scripts';
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

// =============================================================================
// MAIN GENERATOR FUNCTION
// =============================================================================

/**
 * Generates the complete HTML report from audit data
 * This is the main entry point for HTML report generation
 */
export function generateHTMLReport(data: AuditReportData): string {
  const t = getTranslations(data.language);
  const styles = getStyles(data.companyBranding);
  const scripts = getScripts(data);

  return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.preAuditReport} - ${data.companyProfile.name}</title>
  <meta name="robots" content="noindex, nofollow">
  <style>${styles}</style>
</head>
<body>
  <div class="report-wrapper">
    ${generateHeader(data, t)}

    <main class="report-main">
      <div class="content-container">
        ${generateCompanySection(data, t)}

        ${generateExecutiveSummarySection(data, t)}

        <div class="secondary-grid-full">
          ${generateOpportunitiesSection(data, t)}
        </div>

        ${generateMatrixSection(data, t)}

        ${generateROISection(data, t)}

        ${generateQuestionsSection(data, t)}

        ${generateTechnologiesSection(data, t)}

        ${generateAppIntegrationSection(data, t)}

        ${generateBenchmarkSection(data, t)}

        ${generateTimelineSection(data, t)}

        ${generateRiskSection(data, t)}

        ${generateToolsSection(data, t)}

        ${generateIntroSection(data, t)}

        ${generateCTASection(data, t)}
      </div>
    </main>

    ${generateFooter(data, t)}
  </div>

  <script>${scripts}</script>
</body>
</html>`;
}
