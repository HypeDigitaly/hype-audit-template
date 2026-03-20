// =============================================================================
// TIMELINE SECTION - Implementation timeline phases
// =============================================================================

import type { AuditReportData, Translations } from '../types';
import { escapeHtml } from '../utils';

export function generateTimelineSection(data: AuditReportData, t: Translations): string {
  if (!data.implementationTimeline || data.implementationTimeline.length === 0) {
    return '';
  }

  const getPhaseLabel = (phase: string): string => {
    const labels: Record<string, string> = {
      'quick_start': t.timelineQuickStart,
      'short_term': t.timelineShortTerm,
      'medium_term': t.timelineMediumTerm,
      'long_term': t.timelineLongTerm
    };
    return labels[phase] || phase;
  };

  const getPhaseColor = (phase: string): string => {
    const colors: Record<string, string> = {
      'quick_start': '#22C55E',
      'short_term': '#00A39A',
      'medium_term': '#3B82F6',
      'long_term': '#A855F7'
    };
    return colors[phase] || '#00A39A';
  };

  const timelineHTML = data.implementationTimeline.map((phase, index) => `
    <div class="timeline-phase" style="--phase-color: ${getPhaseColor(phase.phase)}">
      <div class="timeline-marker">
        <span class="phase-number">${index + 1}</span>
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h4>${escapeHtml(phase.title)}</h4>
          <span class="timeline-duration">${escapeHtml(phase.duration)}</span>
        </div>
        <span class="timeline-phase-label">${getPhaseLabel(phase.phase)}</span>
        <ul class="timeline-items">
          ${phase.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  return `
    <section class="section timeline-section">
      <h2 class="section-title">${t.timelineTitle}</h2>
      <p class="section-subtitle">${t.timelineSubtitle}</p>
      <div class="timeline-container">
        ${timelineHTML}
      </div>
    </section>
  `;
}
