// =============================================================================
// BENCHMARK SECTION - Industry AI benchmark comparison
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';

export function generateBenchmarkSection(data: AuditReportData, t: Translations): string {
  if (!data.industryBenchmark) {
    return '';
  }

  const benchmark = data.industryBenchmark;

  const useCasesHTML = benchmark.topUseCases.map(useCase => `
    <li><span class="usecase-bullet">→</span> ${escapeHtml(useCase)}</li>
  `).join('');

  return `
    <section class="section benchmark-section">
      <h2 class="section-title">${t.benchmarkTitle}</h2>
      <p class="section-subtitle">${t.benchmarkSubtitle}</p>

      <div class="benchmark-grid">
        <div class="benchmark-card adoption-card">
          <div class="benchmark-stat">
            <span class="stat-value">${Number.isFinite(Number(benchmark.aiAdoptionRate)) ? benchmark.aiAdoptionRate : 0}%</span>
            <span class="stat-label">${t.benchmarkAdoption}</span>
          </div>
          <div class="adoption-bar">
            <div class="adoption-fill" style="width: ${Number.isFinite(Number(benchmark.aiAdoptionRate)) ? benchmark.aiAdoptionRate : 0}%"></div>
          </div>
        </div>

        <div class="benchmark-card">
          <h4>${t.benchmarkUseCases}</h4>
          <ul class="usecases-list">
            ${useCasesHTML}
          </ul>
        </div>

        <div class="benchmark-card">
          <h4>${t.benchmarkCompetitors}</h4>
          <p>${escapeHtml(benchmark.competitorInsights)}</p>
        </div>

        <div class="benchmark-card trend-card">
          <h4>${t.benchmarkTrend}</h4>
          <p>${escapeHtml(benchmark.marketTrend)}</p>
        </div>
      </div>
    </section>
  `;
}
