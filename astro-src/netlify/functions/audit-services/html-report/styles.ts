// =============================================================================
// STYLES - CSS styles for HTML report
// =============================================================================

import type { CompanyBranding } from './types';
import { sanitizeColor, lightenColor, selectBrandColor } from './utils';

export function getStyles(branding?: CompanyBranding): string {
  // Smart color selection that avoids browser defaults
  const primaryColor = selectBrandColor(branding, '#00A39A');
  const accentColor = sanitizeColor(branding?.accentColor) || '#F97316';
  const primaryLight = lightenColor(primaryColor, 10);

  return `
    :root {
      --primary: ${primaryColor};
      --primary-light: ${primaryLight};
      --orange: ${accentColor};
      --blue: #3B82F6;
      --purple: #A855F7;
      --green: #22C55E;
      --bg-white: #FFFFFF;
      --bg-light: #F8F9FA;
      --text-main: #1A1A1A;
      --text-muted: #666666;
      --border: #E5E5E5;
      --radius: 16px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-light);
      color: var(--text-main);
      line-height: 1.5;
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* TOOLTIP SYSTEM */
    .tooltip-term {
      border-bottom: 1px dotted var(--primary);
      cursor: help;
      position: relative;
      display: inline;
    }

    .tooltip-term:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--text-main);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      max-width: 280px;
      white-space: normal;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .tooltip-term:hover::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: var(--text-main);
      margin-bottom: -6px;
      z-index: 1001;
    }

    .tooltip-term.tooltip-left:hover::after {
      left: auto;
      right: 0;
      transform: none;
    }

    .tooltip-term.tooltip-left:hover::before {
      left: auto;
      right: 10px;
      transform: none;
    }

    .opp-badge[data-tooltip] {
      cursor: help;
      position: relative;
    }

    .opp-badge[data-tooltip]:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--text-main);
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 100;
      margin-top: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .opp-badge[data-tooltip]:hover::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-bottom-color: var(--text-main);
      margin-top: -4px;
      z-index: 101;
    }

    @media (max-width: 768px) {
      .tooltip-term:hover::after {
        position: fixed;
        bottom: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 90vw;
        margin-bottom: 0;
      }

      .tooltip-term:hover::before {
        display: none;
      }
    }

    .report-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    .content-container {
      width: 100%;
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 40px;
      overflow-x: hidden;
    }

    /* Header - FIXED position */
    .report-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 16px 0;
      width: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .report-main {
      padding-top: 115px;
      padding-bottom: 40px;
    }

    .header-inner {
      max-width: 1600px;
      margin: 0 auto;
      padding: 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-logo-group {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logo { height: 36px; }

    .header-title-info h1 {
      font-size: 18px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .header-title-info .meta {
      font-size: 12px;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 300px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      border: none;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 163, 154, 0.2);
    }

    .btn-primary:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 163, 154, 0.3);
    }

    .btn-secondary {
      background: var(--bg-white);
      color: var(--text-main);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-light);
      border-color: var(--text-muted);
    }

    .secondary-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 32px;
      margin-bottom: 32px;
      max-width: 100%;
    }

    .secondary-grid-full {
      width: 100%;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      .secondary-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Sections */
    .section {
      background: var(--bg-white);
      border-radius: var(--radius);
      padding: 32px;
      margin-bottom: 32px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      height: 100%;
      overflow: hidden;
    }

    .section-title {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      color: var(--text-main);
      letter-spacing: -0.5px;
    }

    .section-subtitle {
      color: var(--text-muted);
      margin-bottom: 24px;
      font-size: 15px;
    }

    /* Company Section */
    .company-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .company-card {
      padding: 20px;
      background: var(--bg-light);
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .company-card .label {
      display: block;
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 800;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    }

    .company-card .value {
      font-size: 16px;
      font-weight: 700;
      color: var(--text-main);
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .company-card .value.link {
      color: var(--primary);
      text-decoration: none;
      word-break: break-all;
    }

    /* Intro Section */
    .intro-section {
      background: linear-gradient(135deg, #F0FDFA 0%, #ECFDF5 100%);
      border-left: 4px solid var(--primary);
    }

    .intro-content p {
      margin-bottom: 20px;
      line-height: 1.7;
      color: var(--text-main);
      font-size: 15px;
    }

    .intro-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 15px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0, 163, 154, 0.2);
    }

    .intro-cta:hover {
      background: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 163, 154, 0.3);
    }

    .section-fullwidth {
      max-width: 100%;
      width: 100%;
    }

    /* Opportunities 2-column grid layout */
    .opportunities-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .opportunities-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    @media (max-width: 1024px) {
      .opportunities-two-col {
        grid-template-columns: 1fr;
      }
    }

    .opportunities-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .opportunity-card {
      background: var(--bg-light);
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border);
      border-left: 6px solid var(--border);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .opportunity-card.selected {
      background: #FFFFFF;
      border-left-color: var(--primary);
      box-shadow: 0 4px 12px rgba(0, 163, 154, 0.1);
      border-color: var(--primary-light);
    }

    .opp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .opp-checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }

    .opp-checkbox {
      width: 24px;
      height: 24px;
      accent-color: var(--primary);
      cursor: pointer;
      flex-shrink: 0;
    }

    .opp-checkbox-text {
      font-size: 12px;
      color: var(--primary);
      font-weight: 800;
      text-transform: uppercase;
    }

    .opp-badge {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .opp-badge.quick-win { background: #DCFCE7; color: #166534; }
    .opp-badge.big-swing { background: #DBEAFE; color: #1E40AF; }
    .opp-badge.nice-to-have { background: #F3E8FF; color: #6B21A8; }
    .opp-badge.deprioritize { background: #F5F5F5; color: #404040; }

    .opportunity-card h3 {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }

    .opp-short-desc {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 12px;
      font-style: italic;
      line-height: 1.4;
    }

    .opportunity-card p.opp-description {
      font-size: 15px;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .opportunity-card p {
      font-size: 15px;
      color: var(--text-muted);
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .opp-meta {
      display: flex;
      gap: 12px;
      font-size: 13px;
      flex-wrap: wrap;
    }

    .meta-tag {
      padding: 6px 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid var(--border);
      font-weight: 600;
    }

    .opportunity-card.selected .hours-tag {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .hours-tag-secondary {
      background: transparent;
      border-color: var(--border);
      color: var(--text-muted);
      font-size: 11px;
    }

    .hours-tag-secondary strong {
      font-weight: normal;
    }

    .benefit-tag.benefit-primary {
      background: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(0, 163, 154, 0.25);
    }

    .benefit-tag.benefit-primary .benefit-icon {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    .benefit-tag.benefit-primary .benefit-value {
      color: white;
      font-weight: 900;
    }

    .benefit-tag.benefit-primary .benefit-unit {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 700;
    }

    .benefit-tag.benefit-primary .benefit-label {
      color: rgba(255, 255, 255, 0.95);
      font-weight: 700;
    }

    /* Executive Summary */
    .executive-summary-section {
      background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
      border: 2px solid var(--primary);
      border-left: 6px solid var(--primary);
      position: relative;
      overflow: hidden;
    }

    .executive-summary-section::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at top right, rgba(0, 163, 154, 0.1), transparent 70%);
      pointer-events: none;
    }

    .exec-intro {
      margin-bottom: 24px;
    }

    .exec-intro p {
      font-size: 16px;
      line-height: 1.8;
      color: var(--text-main);
    }

    .exec-benefits-headline {
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--primary);
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(0, 163, 154, 0.2);
    }

    .exec-benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .exec-benefit-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .exec-benefit-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 163, 154, 0.15);
    }

    .exec-benefit-card.exec-benefit-primary {
      background: linear-gradient(135deg, #f0fdf9 0%, #e6faf8 100%);
      border: 2px solid var(--accent);
      position: relative;
    }

    .exec-benefit-card.exec-benefit-primary::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 20px;
      right: 20px;
      height: 3px;
      background: var(--accent);
      border-radius: 0 0 3px 3px;
    }

    .exec-benefit-card.exec-benefit-primary .exec-benefit-value {
      color: var(--accent);
    }

    .exec-benefit-icon {
      font-size: 32px;
      flex-shrink: 0;
    }

    .exec-benefit-content {
      flex: 1;
      min-width: 0;
    }

    .exec-benefit-value {
      font-size: 28px;
      font-weight: 900;
      color: var(--primary);
      line-height: 1.1;
    }

    .exec-benefit-unit {
      font-size: 14px;
      font-weight: 600;
      margin-left: 4px;
      color: var(--text-muted);
    }

    .exec-benefit-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .exec-disclaimer {
      font-size: 12px;
      color: var(--text-muted);
      font-style: italic;
      margin: 0;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }

    @media (max-width: 768px) {
      .exec-benefits-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .exec-benefit-card {
        padding: 16px;
      }

      .exec-benefit-value {
        font-size: 24px;
      }

      .exec-benefit-icon {
        font-size: 28px;
      }
    }

    @media (max-width: 480px) {
      .exec-benefits-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Opportunity Benefit Tags */
    .opp-benefits {
      margin: 16px 0;
      padding: 16px;
      background: linear-gradient(135deg, rgba(0, 163, 154, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
      border-radius: 12px;
      border: 1px solid rgba(0, 163, 154, 0.15);
    }

    .opp-benefits-label {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--primary);
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 12px;
    }

    .opp-benefits-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .benefit-tag {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: white;
      border-radius: 12px;
      border: 2px solid var(--border);
      font-size: 13px;
      font-weight: 600;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      min-width: 160px;
    }

    .benefit-tag:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      border-color: var(--primary);
    }

    .benefit-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .benefit-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }

    .benefit-numbers {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .benefit-value {
      font-weight: 800;
      color: var(--text-main);
      font-size: 16px;
      line-height: 1;
    }

    .benefit-unit {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .benefit-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }

    /* Benefit type colors */
    .benefit-time_savings { border-color: #007A73; background: #F0FDFC; }
    .benefit-time_savings .benefit-value { color: #006660; }

    .benefit-lead_generation { border-color: #EA580C; background: #FFF7ED; }
    .benefit-lead_generation .benefit-value { color: #C2410C; }

    .benefit-conversion_rate { border-color: #16A34A; background: #F0FDF4; }
    .benefit-conversion_rate .benefit-value { color: #15803D; }

    .benefit-new_customers { border-color: #2563EB; background: #EFF6FF; }
    .benefit-new_customers .benefit-value { color: #1E40AF; }

    .benefit-revenue_increase { border-color: #059669; background: #ECFDF5; }
    .benefit-revenue_increase .benefit-value { color: #047857; }

    .benefit-cost_reduction { border-color: #4F46E5; background: #EEF2FF; }
    .benefit-cost_reduction .benefit-value { color: #4338CA; }

    .benefit-error_reduction { border-color: #7C3AED; background: #F5F3FF; }
    .benefit-error_reduction .benefit-value { color: #6D28D9; }

    .benefit-customer_satisfaction { border-color: #DB2777; background: #FDF2F8; }
    .benefit-customer_satisfaction .benefit-value { color: #BE185D; }

    .benefit-response_time { border-color: #0D9488; background: #F0FDFA; }
    .benefit-response_time .benefit-value { color: #0F766E; }

    .benefit-availability { border-color: #0284C7; background: #F0F9FF; }
    .benefit-availability .benefit-value { color: #075985; }

    .benefit-member_acquisition { border-color: #7C3AED; background: #F5F3FF; }
    .benefit-member_acquisition .benefit-value { color: #6D28D9; }

    .benefit-churn_reduction { border-color: #DC2626; background: #FEF2F2; }
    .benefit-churn_reduction .benefit-value { color: #B91C1C; }

    .benefit-member_engagement { border-color: #2563EB; background: #EFF6FF; }
    .benefit-member_engagement .benefit-value { color: #1E40AF; }

    .benefit-event_attendance { border-color: #16A34A; background: #F0FDF4; }
    .benefit-event_attendance .benefit-value { color: #15803D; }

    .benefit-products_sold { border-color: #059669; background: #ECFDF5; }
    .benefit-products_sold .benefit-value { color: #047857; }

    .benefit-cart_abandonment_reduction { border-color: #EA580C; background: #FFF7ED; }
    .benefit-cart_abandonment_reduction .benefit-value { color: #C2410C; }

    .benefit-student_acquisition { border-color: #4F46E5; background: #EEF2FF; }
    .benefit-student_acquisition .benefit-value { color: #4338CA; }

    .benefit-course_completion { border-color: #16A34A; background: #F0FDF4; }
    .benefit-course_completion .benefit-value { color: #15803D; }

    /* Matrix */
    .matrix-wrapper {
      width: 100%;
      margin: 20px auto 40px;
      overflow: visible;
    }

    .matrix-container {
      position: relative;
      padding: 40px 60px 60px 140px;
      overflow: visible;
    }

    .axis-line-vertical {
      position: absolute;
      left: 130px;
      top: 20px;
      bottom: 60px;
      width: 3px;
      background: var(--text-main);
      z-index: 2;
    }

    .axis-line-vertical::after {
      content: '';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 10px solid var(--text-main);
    }

    .axis-line-horizontal {
      position: absolute;
      left: 130px;
      right: 40px;
      bottom: 60px;
      height: 3px;
      background: var(--text-main);
      z-index: 2;
    }

    .axis-line-horizontal::after {
      content: '';
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 10px solid var(--text-main);
    }

    .matrix-label {
      position: absolute;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--text-main);
      line-height: 1.3;
      z-index: 3;
    }

    .label-y-top { left: 0; top: 25px; width: 120px; text-align: right; }
    .label-y-bottom { left: 0; bottom: 65px; width: 120px; text-align: right; }
    .label-x-left { left: 130px; bottom: 30px; text-align: left; }
    .label-x-right { right: 40px; bottom: 30px; text-align: right; }

    .matrix-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      min-height: 450px;
      border: 1px solid var(--border);
      border-radius: 4px;
      overflow: hidden;
      background: var(--bg-white);
    }

    .matrix-quadrant {
      border: 1px dashed var(--border);
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 36px 16px 16px;
      min-height: 200px;
    }

    .matrix-quadrant:nth-child(4) { background: rgba(34, 197, 94, 0.05); }
    .matrix-quadrant:nth-child(2) { background: rgba(59, 130, 246, 0.03); }

    .quadrant-label {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      color: var(--text-muted);
      position: absolute;
      top: 12px;
      left: 16px;
      letter-spacing: 0.5px;
      opacity: 0.7;
    }

    .matrix-item {
      background: var(--primary);
      color: white;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.4;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      width: fit-content;
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      white-space: normal;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .matrix-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .matrix-item.big-swing { background: var(--blue); }
    .matrix-item.nice-to-have { background: var(--purple); }
    .matrix-item.deprioritize { background: #9CA3AF; }
    .matrix-item.quick-win { background: var(--green); }

    @media (max-width: 768px) {
      .matrix-container { padding: 50px 30px 50px 30px; }
      .axis-line-vertical { left: 20px; top: 30px; bottom: 50px; }
      .axis-line-horizontal { left: 20px; right: 30px; bottom: 50px; }
      .matrix-label { display: none; }
      .matrix-grid { min-height: 400px; }
      .matrix-quadrant { min-height: 180px; padding: 32px 10px 10px; }
    }

    /* Questions */
    .questions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .question-category {
      background: var(--bg-light);
      padding: 24px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .question-category h3 {
      font-size: 16px;
      color: var(--primary);
      margin-bottom: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cat-icon {
      font-size: 20px;
      font-style: normal;
    }

    .question-category ul { list-style: none; }
    .question-category li {
      padding: 12px 0;
      font-size: 14px;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      padding-left: 24px;
      position: relative;
      font-weight: 500;
      color: var(--text-main);
    }

    .question-category li::before {
      content: "→";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: 900;
    }

    /* ROI Section */
    .roi-layout {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .roi-two-col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      align-items: start;
    }

    .roi-col-left,
    .roi-col-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .roi-col-left .roi-result-card {
      margin-bottom: 0;
    }

    @media (max-width: 1024px) {
      .roi-two-col {
        grid-template-columns: 1fr;
      }
    }

    .roi-slider-group {
      margin-bottom: 20px;
    }

    .roi-slider-group label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .roi-slider-group input {
      width: 100%;
      height: 8px;
      background: var(--border);
      border-radius: 4px;
      appearance: none;
      outline: none;
      cursor: pointer;
    }

    .roi-slider-group input::-webkit-slider-thumb {
      appearance: none;
      width: 28px;
      height: 28px;
      background: var(--primary);
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .roi-slider-group input::-moz-range-thumb {
      width: 28px;
      height: 28px;
      background: var(--primary);
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      cursor: pointer;
    }

    .roi-display {
      font-size: 24px;
      font-weight: 900;
      margin-top: 8px;
      color: var(--text-main);
    }

    .roi-result-card {
      padding: 24px;
      border-radius: 16px;
      text-align: center;
      margin-bottom: 12px;
    }

    .roi-result-card.monthly { background: #F0FDFA; border: 2px solid #CCFBF1; }
    .roi-result-card.yearly {
      background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 2px solid #A7F3D0;
    }

    .roi-result-card .lbl {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    .roi-result-card .val {
      font-size: 36px;
      font-weight: 900;
      color: var(--primary);
    }

    .roi-result-card.yearly .val { color: var(--green); }

    .roi-chart-container {
      background: var(--bg-light);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-top: 10px;
      width: 100%;
      overflow-x: auto;
    }

    .roi-chart-container canvas {
      max-width: 100%;
      width: 100%;
      height: 250px;
      display: block;
    }

    /* Tools */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .tool-card {
      padding: 24px;
      background: var(--bg-white);
      border-radius: 16px;
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      transition: transform 0.2s;
    }

    .tool-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    }

    .tool-card .cat {
      font-size: 10px;
      color: var(--primary);
      text-transform: uppercase;
      font-weight: 900;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }

    .tool-card h4 {
      font-size: 20px;
      margin-bottom: 8px;
      font-weight: 800;
    }

    .tool-card p {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .tool-link {
      color: var(--primary);
      font-weight: 800;
      text-decoration: none;
      font-size: 14px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Technologies Section */
    .tech-section {
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .tech-card {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .tech-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.06);
    }

    .tech-icon { font-size: 28px; flex-shrink: 0; }
    .tech-info { flex: 1; min-width: 0; }
    .tech-info h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; color: var(--text-main); }
    .tech-category { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .tech-info p { font-size: 13px; color: var(--text-muted); margin-top: 8px; line-height: 1.5; }

    .tech-confidence {
      font-size: 10px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .confidence-high { background: #DCFCE7; color: #166534; }
    .confidence-medium { background: #FEF3C7; color: #92400E; }
    .confidence-low { background: #F3F4F6; color: #6B7280; }

    /* App Integration */
    .integration-section {
      background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
    }

    .app-details-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      border: 2px solid var(--blue);
      margin-bottom: 24px;
    }

    .app-details-icon { font-size: 48px; }
    .app-details-content h4 { font-size: 18px; font-weight: 700; color: var(--blue); margin-bottom: 8px; }
    .app-details-content p { font-size: 14px; color: var(--text-main); line-height: 1.6; }

    .integrations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .integration-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--border);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .integration-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.08);
    }

    .integration-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .integration-icon { font-size: 32px; }
    .integration-header h4 { flex: 1; font-size: 17px; font-weight: 700; color: var(--text-main); }

    .effort-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
      text-transform: uppercase;
    }

    .effort-low { background: #DCFCE7; color: #166534; }
    .effort-medium { background: #FEF3C7; color: #92400E; }
    .effort-high { background: #FEE2E2; color: #991B1B; }

    .integration-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
    .integration-impact { font-size: 13px; color: var(--text-main); padding: 12px; background: var(--bg-light); border-radius: 8px; line-height: 1.5; }
    .integration-impact strong { color: var(--primary); }

    /* Benchmark */
    .benchmark-section {
      background: linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%);
    }

    .benchmark-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .benchmark-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--border);
    }

    .benchmark-card h4 { font-size: 14px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
    .benchmark-card p { font-size: 14px; color: var(--text-main); line-height: 1.6; }

    .adoption-card { grid-column: span 2; }

    @media (max-width: 768px) {
      .adoption-card { grid-column: span 1; }
    }

    .benchmark-stat { text-align: center; margin-bottom: 20px; }
    .stat-value { font-size: 56px; font-weight: 900; color: var(--purple); display: block; line-height: 1; }
    .stat-label { font-size: 14px; color: var(--text-muted); font-weight: 600; }
    .adoption-bar { height: 12px; background: var(--bg-light); border-radius: 6px; overflow: hidden; }
    .adoption-fill { height: 100%; background: linear-gradient(90deg, var(--purple), #C084FC); border-radius: 6px; transition: width 1s ease-out; }

    .usecases-list { list-style: none; }
    .usecases-list li { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; font-size: 14px; color: var(--text-main); border-bottom: 1px solid var(--border); }
    .usecases-list li:last-child { border-bottom: none; }
    .usecase-bullet { color: var(--purple); font-weight: 700; }

    .trend-card {
      background: linear-gradient(135deg, #FAF5FF 0%, white 100%);
      border-color: var(--purple);
      border-width: 2px;
    }

    /* Timeline */
    .timeline-section {
      background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
    }

    .timeline-container {
      position: relative;
      padding-left: 40px;
    }

    .timeline-container::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 30px;
      bottom: 30px;
      width: 3px;
      background: linear-gradient(to bottom, var(--green), var(--primary), var(--blue), var(--purple));
      border-radius: 2px;
    }

    .timeline-phase { position: relative; margin-bottom: 32px; }
    .timeline-phase:last-child { margin-bottom: 0; }

    .timeline-marker {
      position: absolute;
      left: -40px;
      top: 0;
      width: 36px;
      height: 36px;
      background: var(--phase-color, var(--primary));
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1;
    }

    .phase-number { color: white; font-size: 14px; font-weight: 800; }

    .timeline-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--border);
      border-left: 4px solid var(--phase-color, var(--primary));
    }

    .timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .timeline-header h4 { font-size: 18px; font-weight: 700; color: var(--text-main); }
    .timeline-duration { font-size: 13px; font-weight: 700; color: white; background: var(--phase-color, var(--primary)); padding: 5px 14px; border-radius: 20px; }
    .timeline-phase-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 16px; }
    .timeline-items { list-style: none; }
    .timeline-items li { position: relative; padding-left: 20px; padding-bottom: 10px; font-size: 14px; color: var(--text-main); line-height: 1.5; }
    .timeline-items li::before { content: '✓'; position: absolute; left: 0; color: var(--phase-color, var(--primary)); font-weight: 700; }

    /* Risk Section */
    .risk-section {
      background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
    }

    .risks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .risk-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid var(--border);
      border-left: 4px solid;
    }

    .risk-card.severity-low { border-left-color: var(--green); }
    .risk-card.severity-medium { border-left-color: var(--orange); }
    .risk-card.severity-high { border-left-color: #EF4444; }

    .risk-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
    .risk-icon { font-size: 28px; flex-shrink: 0; }
    .risk-title-group { flex: 1; }
    .risk-title-group h4 { font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
    .risk-category { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }

    .severity-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .risk-card.severity-low .severity-badge { background: #DCFCE7; color: #166534; }
    .risk-card.severity-medium .severity-badge { background: #FEF3C7; color: #92400E; }
    .risk-card.severity-high .severity-badge { background: #FEE2E2; color: #991B1B; }

    .risk-description { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; }
    .risk-mitigation { font-size: 13px; color: var(--text-main); padding: 14px; background: var(--bg-light); border-radius: 10px; line-height: 1.5; }
    .risk-mitigation strong { color: var(--green); }

    /* CTA Section */
    .cta-section {
      text-align: center;
      background: linear-gradient(135deg, #00A39A 0%, #008f87 100%);
      color: white;
      border: none;
      padding: 60px 40px;
      overflow: hidden;
    }

    .cta-section h2 { font-size: 36px; font-weight: 900; margin-bottom: 16px; letter-spacing: -1px; }
    .cta-section p { margin-bottom: 40px; font-size: 18px; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; }

    .btn-white {
      background: white;
      color: var(--primary);
      padding: 18px 48px;
      font-size: 18px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .cta-contact-info {
      margin-top: 50px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      border-top: 1px solid rgba(255,255,255,0.2);
      padding-top: 40px;
      text-align: left;
    }

    .cta-contact-3col {
      grid-template-columns: 1fr 1fr 1fr;
      align-items: center;
    }

    .cta-contact-col { text-align: left; line-height: 1.8; }
    .cta-contact-col a { text-decoration: none; transition: opacity 0.2s; }
    .cta-contact-col a:hover { opacity: 0.8; text-decoration: underline; }
    .cta-contact-center { text-align: center; display: flex; justify-content: center; }
    .cta-contact-right { text-align: right; }

    .cta-reviews-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 12px;
      color: white;
      text-decoration: none;
      font-size: 15px;
      font-weight: 700;
      transition: all 0.2s;
    }

    .cta-reviews-btn:hover {
      background: rgba(255,255,255,0.25);
      border-color: #FBBC04;
      transform: translateY(-2px);
    }

    @media (max-width: 900px) {
      .cta-contact-3col { grid-template-columns: 1fr; gap: 24px; }
      .cta-contact-col, .cta-contact-center, .cta-contact-right { text-align: center; }
    }

    /* Footer */
    .report-footer {
      padding: 40px 40px 20px;
      background: white;
      border-top: 1px solid var(--border);
      overflow: hidden;
    }

    .report-footer-minimal { padding: 20px 40px; }

    .footer-bottom {
      max-width: 1600px;
      margin: 0 auto;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .report-footer-minimal .footer-bottom { padding-top: 0; border-top: none; }

    .footer-meta {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
      .report-footer-minimal { padding: 16px 20px; }
    }

    @media (max-width: 1200px) {
      .secondary-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .content-container, .header-inner { padding: 0 16px; }
      .report-main { padding-top: 140px; }
      .section { padding: 20px; }
      .header-actions { flex-direction: column; gap: 8px; }
      .btn { width: 100%; justify-content: center; }
      .company-grid { grid-template-columns: 1fr; }
      .tools-grid { grid-template-columns: 1fr; }
      .roi-result-card .val { font-size: 28px; }
      .section-title { font-size: 20px; }
      .cta-section { padding: 30px 20px; }
      .cta-section h2 { font-size: 24px; }
      .cta-section p { font-size: 16px; margin-bottom: 24px; }
      .report-footer { padding: 30px 16px 16px; }
      .header-logo-group { gap: 12px; }
      .opportunities-two-col, .roi-two-col { grid-template-columns: 1fr; }
    }

    @media (max-width: 480px) {
      body { font-size: 14px; }
      .header-inner { flex-direction: column; gap: 12px; align-items: flex-start; }
      .header-actions { width: 100%; }
      .report-main { padding-top: 180px; }
      .section { padding: 16px; margin-bottom: 16px; }
      .logo { height: 32px; }
      .roi-result-card .val { font-size: 24px; }
      .roi-display { font-size: 20px; }
      .question-category { padding: 16px; }
      .intro-cta { width: 100%; justify-content: center; }
      .cta-section h2 { font-size: 20px; }
      .cta-section p { font-size: 15px; }
      .btn-white { padding: 14px 32px; font-size: 16px; }
      .header-title-info .meta { max-width: 200px; }
    }

    @media (max-width: 360px) {
      .content-container { padding: 0 12px; }
      .header-inner { padding: 0 12px; }
      .section { padding: 12px; margin-bottom: 12px; }
      .tools-grid { grid-template-columns: 1fr; }
      .company-grid { grid-template-columns: 1fr; }
      .section-title { font-size: 18px; }
      .opportunity-card h3 { font-size: 18px; }
      .opp-checkbox-text { font-size: 10px; }
      .opp-badge { font-size: 9px; padding: 4px 8px; }
      .meta-tag { font-size: 11px; padding: 4px 8px; }
      .cta-section { padding: 24px 16px; }
      .report-footer { padding: 24px 12px 12px; }
    }

    @media print {
      .report-header, .header-actions, .btn-secondary { display: none; }
      body { background: white; }
      .section { break-inside: avoid; border: 1px solid #eee; box-shadow: none; margin-bottom: 20px; padding: 20px; }
      .content-container { padding: 0; max-width: 100%; }
    }
  `;
}
