// =============================================================================
// SCRIPTS - JavaScript for interactive HTML report
// =============================================================================

import type { AuditReportData } from './types';

export function getScripts(data: AuditReportData): string {
  const currency = data.language === 'cs' ? 'Kč' : '$';
  const weeksPerMonth = 4.33;
  const monthsPerYear = 12;

  return `
    const oppCheckboxes = document.querySelectorAll('.opp-checkbox');
    const hourlyRateSlider = document.getElementById('hourlyRate');
    const hoursPerWeekSlider = document.getElementById('hoursPerWeek');
    const employeeCountSlider = document.getElementById('employeeCount');
    const hourlyRateValue = document.getElementById('hourlyRateValue');
    const hoursPerWeekValue = document.getElementById('hoursPerWeekValue');
    const employeeCountValue = document.getElementById('employeeCountValue');
    const yearlySavingsEl = document.getElementById('yearlySavings');
    const execBenefitCards = document.querySelectorAll('.exec-benefit-card');

    let animationFrame = null;
    let targetSavings = [];
    let currentSavings = [];
    let currentMaxValue = 5000;
    let targetMaxValue = 5000;

    function formatCurrency(value) {
      return new Intl.NumberFormat('${data.language === 'cs' ? 'cs-CZ' : 'en-US'}').format(Math.round(value)) + ' ${currency}';
    }

    function calculateSelectedHours() {
      let total = 0;
      oppCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          total += parseInt(checkbox.dataset.hours) || 0;
          checkbox.closest('.opportunity-card').classList.add('selected');
        } else {
          checkbox.closest('.opportunity-card').classList.remove('selected');
        }
      });
      return total;
    }

    /**
     * Parse numeric value from benefit value string (handles ranges and special formats)
     */
    function parseBenefitValue(valueStr) {
      if (!valueStr || typeof valueStr !== 'string') return 0;

      // Remove non-numeric characters except +, -, and range separator
      const cleaned = valueStr.replace(/[^0-9+\\-]/g, '');

      // Handle ranges (e.g., "15-30" -> take average)
      if (cleaned.includes('-')) {
        const parts = cleaned.split('-').map(p => parseFloat(p)).filter(n => !isNaN(n));
        if (parts.length === 2) {
          return (parts[0] + parts[1]) / 2;
        }
      }

      // Handle single numbers (including with + prefix)
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }

    /**
     * Aggregate benefits from all checked opportunity cards
     */
    function aggregateCheckedBenefits() {
      const benefitTotals = {};

      oppCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) return;

        const card = checkbox.closest('.opportunity-card');
        if (!card) return;

        const benefitsData = card.dataset.benefits;
        if (!benefitsData) return;

        try {
          const benefits = JSON.parse(benefitsData);

          benefits.forEach(benefit => {
            if (!benefit.type) return;

            if (!benefitTotals[benefit.type]) {
              benefitTotals[benefit.type] = {
                total: 0,
                count: 0,
                unit: benefit.unit || '',
                icon: benefit.icon || '',
                label: benefit.label || benefit.type
              };
            }

            const numericValue = parseBenefitValue(benefit.value);
            benefitTotals[benefit.type].total += numericValue;
            benefitTotals[benefit.type].count += 1;
          });
        } catch (e) {
          console.error('Failed to parse benefits data:', e);
        }
      });

      return benefitTotals;
    }

    /**
     * Update executive summary cards with aggregated benefit data
     */
    function updateExecutiveSummary() {
      const aggregated = aggregateCheckedBenefits();

      execBenefitCards.forEach(card => {
        const benefitType = card.dataset.benefitType;
        if (!benefitType) return;

        const valueEl = card.querySelector('.exec-value-number');
        if (!valueEl) return;

        if (aggregated[benefitType]) {
          const data = aggregated[benefitType];
          const total = data.total;

          // Format the value nicely
          let displayValue = '';
          if (total % 1 === 0) {
            displayValue = total.toString();
          } else {
            displayValue = total.toFixed(1);
          }

          // Handle ranges - if we have multiple items, show as range
          if (data.count > 1) {
            const avg = total / data.count;
            const lower = Math.round(avg * 0.8);
            const upper = Math.round(avg * 1.2);
            displayValue = lower + '-' + upper;
          }

          valueEl.textContent = displayValue;
        } else {
          // No benefits of this type selected
          valueEl.textContent = '0';
        }
      });
    }

    function calculateSavings() {
      const hourlyRate = parseFloat(hourlyRateSlider.value);
      const hoursPerWeek = parseFloat(hoursPerWeekSlider.value);
      const employeeCount = parseFloat(employeeCountSlider.value);

      // Apply employee multiplier: total hours = base hours × (1 + (employees - 1) × 0.5)
      // This means: 1 employee = 1x, 10 employees = 5.5x, 100 employees = 50.5x
      // This provides a reasonable scaling without unrealistic numbers
      const employeeMultiplier = 1 + ((employeeCount - 1) * 0.5);
      const effectiveHoursPerWeek = hoursPerWeek * employeeMultiplier;

      const monthlySavings = hourlyRate * effectiveHoursPerWeek * ${weeksPerMonth};
      const yearlySavings = monthlySavings * ${monthsPerYear};

      if (hourlyRateValue) hourlyRateValue.textContent = formatCurrency(hourlyRate).replace(' ${currency}', '');
      if (hoursPerWeekValue) hoursPerWeekValue.textContent = hoursPerWeek;
      if (employeeCountValue) employeeCountValue.textContent = employeeCount;
      if (yearlySavingsEl) yearlySavingsEl.textContent = formatCurrency(yearlySavings);

      animateChart(effectiveHoursPerWeek, hourlyRate);
    }

    function updateFromCheckboxes() {
      const totalHours = calculateSelectedHours();
      if (hoursPerWeekSlider) {
        hoursPerWeekSlider.value = totalHours;
      }
      updateExecutiveSummary();
      calculateSavings();
    }

    function animateChart(effectiveHoursPerWeek, currentHourlyRate) {
      const rates = [200, 400, 600, 800, 1000, 1200, 1500, 2000, 2500];
      targetSavings = rates.map(r => r * effectiveHoursPerWeek * ${weeksPerMonth});
      targetMaxValue = Math.max(Math.max(...targetSavings) * 1.1, 5000);

      if (currentSavings.length === 0) {
        currentSavings = targetSavings.map(() => 0);
        currentMaxValue = targetMaxValue;
      }

      if (animationFrame) cancelAnimationFrame(animationFrame);

      const startTime = performance.now();
      const duration = 500;
      const startMaxValue = currentMaxValue;

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        const displaySavings = currentSavings.map((start, i) => {
          return start + (targetSavings[i] - start) * eased;
        });

        const displayMaxValue = startMaxValue + (targetMaxValue - startMaxValue) * eased;

        drawChart(displaySavings, displayMaxValue);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          currentSavings = [...targetSavings];
          currentMaxValue = targetMaxValue;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    }

    function drawChart(savings, maxValue = 5000) {
      const canvas = document.getElementById('savingsChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // HiDPI scaling for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      const rates = [200, 400, 600, 800, 1000, 1200, 1500, 2000, 2500];
      const padding = { top: 30, right: 30, bottom: 40, left: 60 };
      const chartWidth = width - padding.left - padding.right;
      const chartHeight = height - padding.top - padding.bottom;

      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();

        ctx.fillStyle = '#999';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        const val = maxValue - (maxValue / 4) * i;
        ctx.fillText(Math.round(val / 1000) + 'k', padding.left - 10, y + 4);
      }

      // Curve
      const points = savings.map((val, i) => ({
        x: padding.left + (chartWidth / (rates.length - 1)) * i,
        y: padding.top + chartHeight - (val / maxValue) * chartHeight
      }));

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, 'rgba(0,163,154,0.2)');
      gradient.addColorStop(1, 'rgba(0,163,154,0)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      // Fill
      const fillPath = new Path2D();
      fillPath.moveTo(points[0].x, padding.top + chartHeight);
      fillPath.lineTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        fillPath.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      fillPath.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      fillPath.lineTo(points[points.length - 1].x, padding.top + chartHeight);
      fillPath.closePath();
      ctx.fillStyle = gradient;
      ctx.fill(fillPath);

      ctx.strokeStyle = '#00A39A';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Points
      points.forEach((p, i) => {
        ctx.fillStyle = '#00A39A';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // X-Axis
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      rates.forEach((rate, i) => {
        if (i % 2 === 0 || i === rates.length - 1) {
          const x = padding.left + (chartWidth / (rates.length - 1)) * i;
          ctx.fillText(rate + ' ${currency}', x, height - 15);
        }
      });
    }

    oppCheckboxes.forEach(cb => cb.addEventListener('change', updateFromCheckboxes));
    if (hourlyRateSlider) hourlyRateSlider.addEventListener('input', calculateSavings);
    if (hoursPerWeekSlider) hoursPerWeekSlider.addEventListener('input', calculateSavings);
    if (employeeCountSlider) employeeCountSlider.addEventListener('input', calculateSavings);

    updateFromCheckboxes();
  `;
}
