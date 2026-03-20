// =============================================================================
// PRICING CALCULATOR EMAIL TEMPLATES - Netlify Function Utils
// =============================================================================
// Email templates for the pricing calculator lead capture.
// User confirmation (bilingual CS/EN) + Team notification (Czech).
// =============================================================================

import { clientConfig } from './_config/client';

// ---------------------------------------------------------------------------
// Data interface
// ---------------------------------------------------------------------------
export interface PricingLeadData {
  name: string;
  email: string;
  companyName: string;
  language: 'cs' | 'en';
  submittedAt: string;
  calculatorState: {
    dailyCompanies: number;
    emailDomains: number;
    emailAddresses: number;
    campaigns: number;
    supportLevel: string;
  };
  calculatorResults: {
    monthlyCompanies: number;
    setupFee: number;
    monthlyFee: number;
    total3Months: number;
    equivalentSalespeople: number;
    salesTeamCost: number;
    savingsPercent: number;
  };
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatCZK(n: number): string {
  return n.toLocaleString('cs-CZ').replace(/\u00a0/g, '\u00a0') + '\u00a0K\u010d';
}

// Shared row builder for both tables — label left, value right
function infoRow(label: string, value: string): string {
  return `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">${label}</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${value}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>`;
}

function divider(): string {
  return `
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>`;
}

function sectionHeader(title: string): string {
  return `<h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">${title}</h2>`;
}

// =============================================================================
// 1. USER CONFIRMATION EMAIL (bilingual CS/EN)
// =============================================================================
export function generatePricingConfirmationEmailHTML(lead: PricingLeadData, lang: 'cs' | 'en'): string {
  const s = lead.calculatorState;
  const r = lead.calculatorResults;

  const t = lang === 'en' ? {
    docTitle: `Your Price Quote | ${clientConfig.company.name}`,
    headerTitle: 'Your personalized price quote is ready!',
    headerSub: 'Attached to this email as a PDF',
    greeting: `Hello ${escapeHtml(lead.name.split(' ')[0])},`,
    body: `Thank you for your interest in ${clientConfig.company.name}! Your personalized price quote is attached to this email as a PDF.`,
    summaryTitle: 'Quote summary',
    labelPackage: 'Selected package',
    labelMonthly: 'Monthly volume',
    labelSetup: 'Setup fee',
    labelMonthlyFee: 'Monthly fee',
    ctaLine: 'Have questions? Write to us at',
    footerTagline: 'The future is in AI. We are building it.',
  } : {
    docTitle: `Vaše cenová nabídka | ${clientConfig.company.name}`,
    headerTitle: 'Vaše personalizovaná cenová nabídka je připravena!',
    headerSub: 'Přiložena k tomuto e-mailu jako PDF',
    greeting: `Dobrý den, ${escapeHtml(lead.name.split(' ')[0])},`,
    body: `Děkujeme za váš zájem o ${clientConfig.company.name}! V příloze najdete vaši personalizovanou cenovou nabídku.`,
    summaryTitle: 'Shrnutí nabídky',
    labelPackage: 'Vybraný balíček',
    labelMonthly: 'Měsíční objem',
    labelSetup: 'Jednorázové nastavení',
    labelMonthlyFee: 'Měsíční poplatek',
    ctaLine: 'Máte otázky? Napište nám na',
    footerTagline: 'Budoucnost je v AI. My ji tvoříme.',
  };

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.docTitle}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#1a1a1a;color:#ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#1a1a1a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d3d56 0%,#0a2a3d 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(0,163,154,0.3);">
              <p style="margin:0 0 8px 0;font-size:22px;font-weight:700;color:${clientConfig.brand.primaryColor};letter-spacing:1px;">${clientConfig.company.name}</p>
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">${t.headerTitle}</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.6);">${t.headerSub}</p>
            </td>
          </tr>

          <!-- Greeting & body -->
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              <p style="margin:0 0 12px 0;font-size:16px;color:#ffffff;line-height:1.6;">${t.greeting}</p>
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">${t.body}</p>
            </td>
          </tr>

          ${divider()}

          <!-- Quote summary box -->
          <tr>
            <td style="padding:24px 40px;">
              ${sectionHeader(t.summaryTitle)}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${infoRow(t.labelPackage, escapeHtml(s.supportLevel))}
                ${infoRow(t.labelMonthly, String(r.monthlyCompanies.toLocaleString('cs-CZ')) + (lang === 'en' ? ' companies' : ' firem'))}
                ${infoRow(t.labelSetup, formatCZK(r.setupFee))}
                ${infoRow(t.labelMonthlyFee, formatCZK(r.monthlyFee))}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- CTA -->
          <tr>
            <td style="padding:24px 40px 32px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;font-size:14px;color:rgba(255,255,255,0.7);">${t.ctaLine}</p>
              <a href="mailto:${clientConfig.primaryContact.email}" style="font-size:15px;font-weight:600;color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.primaryContact.email}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} &bull; <a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">${t.footerTagline}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function generatePricingConfirmationPlainText(lead: PricingLeadData, lang: 'cs' | 'en'): string {
  const s = lead.calculatorState;
  const r = lead.calculatorResults;

  if (lang === 'en') {
    return `Hello ${lead.name.split(' ')[0]},

Thank you for your interest in ${clientConfig.company.name}! Your personalized price quote is attached to this email as a PDF.

QUOTE SUMMARY
-------------
Selected package:  ${s.supportLevel}
Monthly volume:    ${r.monthlyCompanies.toLocaleString('cs-CZ')} companies
Setup fee:         ${formatCZK(r.setupFee)}
Monthly fee:       ${formatCZK(r.monthlyFee)}

Have questions? Write to us at ${clientConfig.primaryContact.email}

---
${clientConfig.company.legalName} | ${clientConfig.siteUrl.replace('https://', '')}`.trim();
  }

  return `Dobrý den, ${lead.name.split(' ')[0]},

Děkujeme za váš zájem o ${clientConfig.company.name}! V příloze najdete vaši personalizovanou cenovou nabídku.

SHRNUTÍ NABÍDKY
---------------
Vybraný balíček:         ${s.supportLevel}
Měsíční objem:           ${r.monthlyCompanies.toLocaleString('cs-CZ')} firem
Jednorázové nastavení:   ${formatCZK(r.setupFee)}
Měsíční poplatek:        ${formatCZK(r.monthlyFee)}

Máte otázky? Napište nám na ${clientConfig.primaryContact.email}

---
${clientConfig.company.legalName} | ${clientConfig.siteUrl.replace('https://', '')}`.trim();
}

export function getPricingConfirmationSubject(lang: 'cs' | 'en'): string {
  const subject = lang === 'en'
    ? `Your Price Quote | ${clientConfig.company.name}`
    : `Vaše cenová nabídka | ${clientConfig.company.name}`;
  return subject.replace(/[\r\n]/g, '');
}

// =============================================================================
// 2. TEAM NOTIFICATION EMAIL (Czech)
// =============================================================================
export function generatePricingNotificationEmailHTML(lead: PricingLeadData): string {
  const s = lead.calculatorState;
  const r = lead.calculatorResults;
  const submittedDate = new Date(lead.submittedAt).toLocaleString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const utmRows = [
    lead.utmSource ? infoRow('Zdroj', escapeHtml(lead.utmSource)) : '',
    lead.utmMedium ? infoRow('Médium', escapeHtml(lead.utmMedium)) : '',
    lead.utmCampaign ? infoRow('Kampaň', escapeHtml(lead.utmCampaign)) : '',
  ].filter(Boolean).join('');

  const hasUtm = utmRows.length > 0;

  return `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nový zájemce z cenové kalkulačky | ${clientConfig.company.name}</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#0a0a0a;color:#ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d3d56 0%,#0a2a3d 100%);padding:32px 40px;text-align:center;border-bottom:1px solid rgba(0,163,154,0.3);">
              <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" width="180" style="display:block;margin:0 auto 16px auto;height:auto;">
              <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">Nový zájemce z cenové kalkulačky</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.6);">${clientConfig.company.name} &bull; ${submittedDate}</p>
            </td>
          </tr>

          <!-- Lead info -->
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              ${sectionHeader('Kontaktní údaje')}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${infoRow('Jméno', escapeHtml(lead.name))}
                ${infoRow('E-mail', `<a href="mailto:${escapeHtml(lead.email)}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${escapeHtml(lead.email)}</a>`)}
                ${infoRow('Firma', escapeHtml(lead.companyName))}
                ${infoRow('Jazyk', lead.language.toUpperCase())}
                ${infoRow('Datum', submittedDate)}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Calculator config -->
          <tr>
            <td style="padding:24px 40px;">
              ${sectionHeader('Konfigurace kalkulačky')}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${infoRow('Balíček', escapeHtml(s.supportLevel))}
                ${infoRow('Denní objem', String(s.dailyCompanies) + ' firem/den')}
                ${infoRow('Měsíční objem', String(r.monthlyCompanies.toLocaleString('cs-CZ')) + ' firem')}
                ${infoRow('Počet domén', String(s.emailDomains))}
                ${infoRow('Počet adres', String(s.emailAddresses))}
                ${infoRow('Počet kampaní', String(s.campaigns))}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Calculator results -->
          <tr>
            <td style="padding:24px 40px;">
              ${sectionHeader('Výsledky kalkulačky')}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${infoRow('Jednorázové nastavení', formatCZK(r.setupFee))}
                ${infoRow('Měsíční poplatek', formatCZK(r.monthlyFee))}
                ${infoRow('Celkem za 3 měsíce', formatCZK(r.total3Months))}
                ${infoRow('Ekvivalent obchodníků', String(r.equivalentSalespeople) + ' FTE')}
                ${infoRow('Náklad obchodního týmu', formatCZK(r.salesTeamCost))}
                ${infoRow('Úspora', String(r.savingsPercent) + ' %')}
              </table>
            </td>
          </tr>

          ${hasUtm ? `${divider()}
          <tr>
            <td style="padding:24px 40px;">
              ${sectionHeader('UTM tracking')}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${utmRows}
              </table>
            </td>
          </tr>` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding:16px 40px 32px 40px;text-align:center;">
              <a href="mailto:${escapeHtml(lead.email)}?subject=Re%3A%20Va%C5%A1e%20cen%C3%A1%20nab%C3%ADdka"
                 style="display:inline-block;padding:14px 32px;background:${clientConfig.brand.primaryColor};color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                Odpovědět zájemci
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} &bull; <a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">Automaticky odesláno z cenové kalkulačky</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function generatePricingNotificationPlainText(lead: PricingLeadData): string {
  const s = lead.calculatorState;
  const r = lead.calculatorResults;
  const submittedDate = new Date(lead.submittedAt).toLocaleString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const utmSection = (lead.utmSource || lead.utmMedium || lead.utmCampaign)
    ? `\nUTM TRACKING\n------------\n${lead.utmSource ? `Zdroj:   ${lead.utmSource}\n` : ''}${lead.utmMedium ? `Médium:  ${lead.utmMedium}\n` : ''}${lead.utmCampaign ? `Kampaň:  ${lead.utmCampaign}\n` : ''}`
    : '';

  return `NOVÝ ZÁJEMCE Z CENOVÉ KALKULAČKY - ${clientConfig.company.name}
===============================================

KONTAKTNÍ ÚDAJE
---------------
Jméno:   ${lead.name}
E-mail:  ${lead.email}
Firma:   ${lead.companyName}
Jazyk:   ${lead.language.toUpperCase()}
Datum:   ${submittedDate}

KONFIGURACE KALKULAČKY
----------------------
Balíček:          ${s.supportLevel}
Denní objem:      ${s.dailyCompanies} firem/den
Měsíční objem:    ${r.monthlyCompanies.toLocaleString('cs-CZ')} firem
Počet domén:      ${s.emailDomains}
Počet adres:      ${s.emailAddresses}
Počet kampaní:    ${s.campaigns}

VÝSLEDKY KALKULAČKY
-------------------
Jednorázové nastavení:   ${formatCZK(r.setupFee)}
Měsíční poplatek:        ${formatCZK(r.monthlyFee)}
Celkem za 3 měsíce:      ${formatCZK(r.total3Months)}
Ekvivalent obchodníků:   ${r.equivalentSalespeople} FTE
Náklad obchodního týmu:  ${formatCZK(r.salesTeamCost)}
Úspora:                  ${r.savingsPercent} %
${utmSection}
---
${clientConfig.company.legalName} | ${clientConfig.siteUrl.replace('https://', '')}`.trim();
}

