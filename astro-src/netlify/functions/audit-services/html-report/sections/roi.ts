// =============================================================================
// ROI SECTION - Interactive ROI calculator
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';

export function generateROISection(data: AuditReportData, t: Translations): string {
  const currency = data.language === 'cs' ? 'Kč' : '$';
  const employeesLabel = data.language === 'cs' ? 'Počet zaměstnanců' : 'Number of Employees';
  const employeesDesc = data.language === 'cs' ? '(ovlivní celkovou úsporu)' : '(affects total savings)';

  return `
    <section class="section section-fullwidth">
      <h2 class="section-title">${t.roiTitle}</h2>
      <p class="section-subtitle">${t.roiSubtitle}</p>

      <div class="roi-two-col">
        <div class="roi-col-left">
          <div class="roi-result-card yearly">
            <div class="lbl">${t.yearlySavings}</div>
            <div class="val" id="yearlySavings">0</div>
          </div>

          <div class="roi-sliders">
            <div class="roi-slider-group">
              <label>${t.hourlyRate}</label>
              <input type="range" id="hourlyRate" min="200" max="2500" value="${Number.isFinite(Number(data.roiEstimate.defaultHourlyRate)) ? data.roiEstimate.defaultHourlyRate : 500}" step="50">
              <div class="roi-display"><span id="hourlyRateValue">0</span> ${currency}/h</div>
            </div>
            <div class="roi-slider-group">
              <label>${t.hoursPerWeek}</label>
              <input type="range" id="hoursPerWeek" min="1" max="500" value="${Number.isFinite(Number(data.roiEstimate.totalHoursSavedPerWeek)) ? data.roiEstimate.totalHoursSavedPerWeek : 10}" step="5">
              <div class="roi-display"><span id="hoursPerWeekValue">0</span> h</div>
            </div>
            <div class="roi-slider-group">
              <label>${employeesLabel} <span style="font-size: 10px; font-weight: normal; text-transform: none;">${employeesDesc}</span></label>
              <input type="range" id="employeeCount" min="1" max="500" value="10" step="1">
              <div class="roi-display"><span id="employeeCountValue">10</span> ${data.language === 'cs' ? 'zaměstnanců' : 'employees'}</div>
            </div>
          </div>
        </div>

        <div class="roi-col-right">
          <div class="roi-chart-container">
            <canvas id="savingsChart" width="400" height="250"></canvas>
          </div>

          <div class="roi-assumptions">
            <h4 style="font-size: 11px; text-transform: uppercase; margin-bottom: 8px; color: var(--text-muted);">${t.assumptions}:</h4>
            <ul style="list-style: none; font-size: 12px; color: var(--text-muted); line-height: 1.6;">
              ${data.roiEstimate.assumptions.map(a => `<li>• ${escapeHtml(a)}</li>`).join('')}
              <li>• ${data.language === 'cs' ? 'Úspora času se násobí počtem zaměstnanců, kteří budou AI využívat' : 'Time savings multiplied by number of employees who will use AI'}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `;
}
