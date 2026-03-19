// =============================================================================
// AUDIT EMAIL TEMPLATES - Netlify Function Utils v2
// =============================================================================
// Email templates for the AI Audit system. Includes notification to team
// and confirmation with REPORT LINK (not PDF attachment) to user.
// Reports expire after 30 days.
// =============================================================================

import { clientConfig } from './_config/client';

type EmailLanguage = 'cs' | 'en';

// Form data interface
interface AuditFormData {
  email: string;
  website: string;
  companyName: string;
  industry: string;
  city: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

// Industry labels for display
const INDUSTRY_LABELS: Record<string, Record<EmailLanguage, string>> = {
  'it_software': { cs: 'IT a software', en: 'IT & Software' },
  'manufacturing': { cs: 'Výroba a průmysl', en: 'Manufacturing' },
  'retail': { cs: 'Obchod a retail', en: 'Retail & E-commerce' },
  'finance': { cs: 'Finance a pojišťovnictví', en: 'Finance & Insurance' },
  'healthcare': { cs: 'Zdravotnictví', en: 'Healthcare' },
  'construction': { cs: 'Stavebnictví', en: 'Construction' },
  'logistics': { cs: 'Logistika a doprava', en: 'Logistics & Transport' },
  'marketing': { cs: 'Marketing a média', en: 'Marketing & Media' },
  'education': { cs: 'Vzdělávání', en: 'Education' },
  'public': { cs: 'Veřejná správa', en: 'Public Sector' },
  'other': { cs: 'Jiné', en: 'Other' }
};

// Helper to get label
function getLabel(
  value: string | undefined, 
  labels: Record<string, Record<EmailLanguage, string>>, 
  lang: EmailLanguage,
  fallback: string = 'Not specified'
): string {
  if (!value) return lang === 'cs' ? 'Neuvedeno' : fallback;
  return labels[value]?.[lang] || value;
}

// HTML escape
function escapeHtml(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// =============================================================================
// 1. NOTIFICATION EMAIL (To Team) - Always Czech
// =============================================================================

export function generateAuditNotificationEmailHTML(data: AuditFormData, reportId: string, reportUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.5; color: #1a1a1a; background: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { border-bottom: 2px solid #00A39A; padding-bottom: 10px; margin-bottom: 20px; }
    .label { color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold; }
    .value { font-size: 16px; margin-bottom: 15px; }
    .btn { display: inline-block; padding: 12px 24px; background: #00A39A; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" width="150" style="filter: brightness(0);">
      <h2>Nový lead: Předběžný AI audit</h2>
    </div>
    
    <p>Právě byl vygenerován nový audit pro <strong>${escapeHtml(data.companyName)}</strong>.</p>
    
    <div class="label">Společnost</div>
    <div class="value">${escapeHtml(data.companyName)}</div>
    
    <div class="label">Web</div>
    <div class="value">${escapeHtml(data.website)}</div>
    
    <div class="label">E-mail</div>
    <div class="value">${escapeHtml(data.email)}</div>
    
    <div class="label">Město</div>
    <div class="value">${escapeHtml(data.city)}</div>
    
    <div class="label">Co chtějí zefektivnit</div>
    <div class="value">${escapeHtml(data.biggestPainPoint || 'Neuvedeno')}</div>
    
    <div class="label">Používané nástroje</div>
    <div class="value">${escapeHtml(data.currentTools || 'Neuvedeno')}</div>
    
    <div style="margin-top: 30px;">
      <a href="${reportUrl}" class="btn" style="color: #ffffff !important; text-decoration: none;">Otevřít report →</a>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateAuditNotificationEmailText(data: AuditFormData, reportId: string, reportUrl: string): string {
  return `
NOVÝ LEAD: PŘEDBĚŽNÝ AI AUDIT
==============================

Společnost: ${data.companyName}
Web: ${data.website}
E-mail: ${data.email}
Město: ${data.city}

CO CHTĚJÍ ZEFEKTIVNIT:
${data.biggestPainPoint || 'Neuvedeno'}

POUŽÍVANÉ NÁSTROJE:
${data.currentTools || 'Neuvedeno'}

URL REPORTU: ${reportUrl}
  `.trim();
}

// =============================================================================
// 2. CONFIRMATION EMAIL (To User) - Bilingual
// =============================================================================

export function generateAuditConfirmationEmailHTML(data: AuditFormData, reportId: string, reportUrl: string): string {
  const isEn = data.language === 'en';
  
  if (isEn) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #1a1a1a; background: #ffffff; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .btn { display: inline-block; padding: 14px 28px; background: #00A39A; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <p>Hello,</p>

    <p>We have prepared a preliminary AI audit for <strong>${escapeHtml(data.companyName)}</strong> regarding the possibilities of using artificial intelligence, which will significantly increase the efficiency of your company in the shortest possible time.</p>

    <p>You can find the report at this link:</p>
    <a href="${reportUrl}" class="btn" style="color: #ffffff !important; text-decoration: none;">Open Preliminary Audit</a>

    <p>In this preliminary report, based on our experience, there is a list of questions that should ideally be asked first, before you start implementing AI at all. We have also added recommendations for a few softwares and AI integration possibilities that would move ${escapeHtml(data.companyName)} to a new level of efficiency.</p>

    <p>There are many recommendations and if you don't know where to start, or if you would just like to consult, we would be happy to meet with you for a personal meeting even at your company.</p>

    <p>We are attaching a link to the calendar to arrange a meeting here: <a href="${clientConfig.primaryContact.calendarUrl || ''}">Book a Meeting</a></p>

    <p>Best regards,<br><strong>${clientConfig.company.legalName}</strong><br>${clientConfig.contact.street}, ${clientConfig.contact.city}</p>

    <div class="footer">
      <p style="font-size: 12px; color: #999; margin-bottom: 16px;">
        This email is automatically generated by our system. Please do not reply to it.<br><br>
        <strong>To schedule a meeting or respond:</strong><br>
        ${clientConfig.primaryContact.name} | ${clientConfig.primaryContact.title}<br>
        <a href="mailto:${clientConfig.primaryContact.email}" style="color: #00A39A;">${clientConfig.primaryContact.email}</a> | ${clientConfig.primaryContact.phone}<br>
        <a href="${clientConfig.primaryContact.calendarUrl || ''}" style="color: #00A39A;">📅 Book a meeting in my calendar →</a>
      </p>

      <p style="margin-bottom: 12px;">
        <a href="https://share.google/NBARzHErNEaSPxGKF" target="_blank" style="color: #00A39A; text-decoration: none;">⭐ See our Google Reviews</a>
      </p>

      <p style="margin-bottom: 16px;">
        <a href="${clientConfig.social.linkedin || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none; margin-right: 12px;">LinkedIn</a>
        <a href="${clientConfig.social.instagram || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none; margin-right: 12px;">Instagram</a>
        <a href="${clientConfig.social.facebook || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none;">Facebook</a>
      </p>

      ${clientConfig.company.legalName} | <a href="${clientConfig.siteUrl}" style="color: #00A39A;">${clientConfig.siteUrl.replace('https://', '')}</a><br>
      Report ID: ${reportId}
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; line-height: 1.6; color: #1a1a1a; background: #ffffff; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .btn { display: inline-block; padding: 14px 28px; background: #00A39A; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <p>Dobrý den,</p>

    <p>připravili jsme pro <strong>${escapeHtml(data.companyName)}</strong> předběžný AI audit o možnostech využití umělé inteligence, které v co nejkratším čase výrazně zvýší efektivitu Vaší společnosti.</p>

    <p>Report naleznete na tomto odkaze:</p>
    <a href="${reportUrl}" class="btn" style="color: #ffffff !important; text-decoration: none;">Otevřít předběžný audit</a>

    <p>V tomto předběžném reportu je dle našich zkušeností seznam dotazů, které je třeba si nejdříve ideálně položit, než se do implementace AI vůbec pustíte. Zároveň jsme přidali doporučení na pár softwarů a možností zapojení AI, které by ${escapeHtml(data.companyName)} posunuly v efektivitě na novou úroveň.</p>

    <p>Doporučení je mnoho a pokud nevíte, kde začít, či byste chtěli jen prokonzultovat, rádi se s Vámi potkáme na osobní schůzce klidně u Vás na firmě. (jsme z Ústí a jsme i jediná společnost, která se zde AI aktivně zabývá. Mimo jiné jsme zaváděli např. AI chatovacího asistenta na stránkách www.teplice.cz nebo www.kr-ustecky.cz)</p>

    <p>Přikládáme odkaz do kalendáře pro domluvení schůzky zde: <a href="${clientConfig.primaryContact.calendarUrl || ''}">Domluvit schůzku</a></p>

    <p>S pozdravem,<br><strong>${clientConfig.company.legalName}</strong><br>${clientConfig.contact.street}, ${clientConfig.contact.city}</p>

    <div class="footer">
      <p style="font-size: 12px; color: #999; margin-bottom: 16px;">
        Tento email je generován automaticky naším systémem. Neodpovídejte na něj.<br><br>
        <strong>Pro domluvení schůzky / odpověď na email:</strong><br>
        ${clientConfig.primaryContact.name} | ${clientConfig.primaryContact.title}<br>
        <a href="mailto:${clientConfig.primaryContact.email}" style="color: #00A39A;">${clientConfig.primaryContact.email}</a> | ${clientConfig.primaryContact.phone}<br>
        <a href="${clientConfig.primaryContact.calendarUrl || ''}" style="color: #00A39A;">📅 Domluvit schůzku v mém kalendáři →</a>
      </p>

      <p style="margin-bottom: 12px;">
        <a href="https://share.google/NBARzHErNEaSPxGKF" target="_blank" style="color: #00A39A; text-decoration: none;">⭐ Podívejte se na naše Google recenze</a>
      </p>

      <p style="margin-bottom: 16px;">
        <a href="${clientConfig.social.linkedin || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none; margin-right: 12px;">LinkedIn</a>
        <a href="${clientConfig.social.instagram || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none; margin-right: 12px;">Instagram</a>
        <a href="${clientConfig.social.facebook || ''}" target="_blank" style="color: #1a1a1a; text-decoration: none;">Facebook</a>
      </p>

      ${clientConfig.company.legalName} | <a href="${clientConfig.siteUrl}" style="color: #00A39A;">${clientConfig.siteUrl.replace('https://', '')}</a><br>
      ID reportu: ${reportId}
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateAuditConfirmationEmailText(data: AuditFormData, reportId: string, reportUrl: string): string {
  const isEn = data.language === 'en';
  
  if (isEn) {
    return `
Hello,

We have prepared a preliminary AI audit for ${data.companyName} regarding the possibilities of using artificial intelligence.

You can find the report here: ${reportUrl}

Best regards,
${clientConfig.company.legalName}
${clientConfig.contact.street}, ${clientConfig.contact.city}

To schedule a meeting or respond:
${clientConfig.primaryContact.name} | ${clientConfig.primaryContact.title}
${clientConfig.primaryContact.email} | ${clientConfig.primaryContact.phone}
Calendar: ${clientConfig.primaryContact.calendarUrl || ''}
    `.trim();
  }

  return `
Dobrý den,

připravili jsme pro ${data.companyName} předběžný AI audit o možnostech využití umělé inteligence.

Report naleznete na tomto odkaze: ${reportUrl}

S pozdravem,
${clientConfig.company.legalName}
${clientConfig.contact.street}, ${clientConfig.contact.city}

Pro domluvení schůzky / odpověď na email:
${clientConfig.primaryContact.name} | ${clientConfig.primaryContact.title}
${clientConfig.primaryContact.email} | ${clientConfig.primaryContact.phone}
Kalendář: ${clientConfig.primaryContact.calendarUrl || ''}
  `.trim();
}
