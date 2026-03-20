// =============================================================================
// FOOTER SECTION - Report footer with metadata
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';
import { clientConfig } from '../../../_config/client';

export function generateFooter(data: AuditReportData, t: Translations): string {
  return `
    <footer class="report-footer report-footer-minimal">
      <div class="footer-bottom">
        <p class="footer-meta">${t.reportId}: ${escapeHtml(data.reportId)}</p>
        <p class="footer-meta">© ${new Date().getFullYear()} ${clientConfig.company.legalName}</p>
      </div>
    </footer>
  `;
}
