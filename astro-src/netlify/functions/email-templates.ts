// =============================================================================
// EMAIL TEMPLATES - Netlify Function Utils
// =============================================================================

import { clientConfig } from './_config/client';

export type EmailLanguage = 'cs' | 'en';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  service?: string;
  budget_onetime?: string;
  budget_monthly?: string;
  message?: string;
  language?: EmailLanguage;
  leadSource?: string;
  // Traffic source tracking (UTM parameters & click IDs)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
}

// =============================================================================
// BILINGUAL LABEL MAPPINGS
// =============================================================================

// Service labels mapping (Czech)
export const SERVICE_LABELS_CS: Record<string, string> = {
  audit: "AI Audit",
  chatbot: "AI Chatbot",
  voicebot: "AI Voicebot",
  agent: "AI Agent",
  automation: "Automatizace procesů",
  dev: "Vývoj aplikací",
  web: "Web Design",
  consult: "AI Konzultace",
  dataprep: "Příprava dat (RAGus.ai)",
  other: "Jiné",
};

// Service labels mapping (English)
export const SERVICE_LABELS_EN: Record<string, string> = {
  audit: "AI Audit",
  chatbot: "AI Chatbot",
  voicebot: "AI Voicebot",
  agent: "AI Agent",
  automation: "Process Automation",
  dev: "App Development",
  web: "Web Design",
  consult: "AI Consultation",
  dataprep: "Data Preparation (RAGus.ai)",
  other: "Other",
};

// Legacy export for backward compatibility (defaults to Czech)
export const SERVICE_LABELS = SERVICE_LABELS_CS;

// Budget labels mapping (Czech)
export const BUDGET_ONETIME_LABELS_CS: Record<string, string> = {
  tier1: "Do 50 000 Kč",
  tier2: "50 000 – 150 000 Kč",
  tier3: "150 000 – 500 000 Kč",
  tier4: "500 000+ Kč",
  unsure: "Zatím nevím",
};

// Budget labels mapping (English)
export const BUDGET_ONETIME_LABELS_EN: Record<string, string> = {
  tier1: "Up to $2,000",
  tier2: "$2,000 – $6,000",
  tier3: "$6,000 – $20,000",
  tier4: "$20,000+",
  unsure: "Not sure yet",
};

export const BUDGET_MONTHLY_LABELS_CS: Record<string, string> = {
  tier1: "Do 10 000 Kč",
  tier2: "10 000 – 30 000 Kč",
  tier3: "30 000 – 100 000 Kč",
  tier4: "100 000+ Kč",
  unsure: "Zatím nevím",
};

export const BUDGET_MONTHLY_LABELS_EN: Record<string, string> = {
  tier1: "Up to $400",
  tier2: "$400 – $1,200",
  tier3: "$1,200 – $4,000",
  tier4: "$4,000+",
  unsure: "Not sure yet",
};

// Legacy exports for backward compatibility (defaults to Czech)
export const BUDGET_ONETIME_LABELS = BUDGET_ONETIME_LABELS_CS;
export const BUDGET_MONTHLY_LABELS = BUDGET_MONTHLY_LABELS_CS;

// Helper to get labels by language
function getServiceLabel(service: string | undefined, lang: EmailLanguage): string {
  const labels = lang === 'en' ? SERVICE_LABELS_EN : SERVICE_LABELS_CS;
  const fallback = lang === 'en' ? "General inquiry" : "Obecný dotaz";
  return service ? labels[service] || service : fallback;
}

function getBudgetOnetimeLabel(budget: string | undefined, lang: EmailLanguage): string {
  const labels = lang === 'en' ? BUDGET_ONETIME_LABELS_EN : BUDGET_ONETIME_LABELS_CS;
  const fallback = lang === 'en' ? "Not specified" : "Neuvedeno";
  return budget ? labels[budget] || budget : fallback;
}

function getBudgetMonthlyLabel(budget: string | undefined, lang: EmailLanguage): string {
  const labels = lang === 'en' ? BUDGET_MONTHLY_LABELS_EN : BUDGET_MONTHLY_LABELS_CS;
  const fallback = lang === 'en' ? "Not specified" : "Neuvedeno";
  return budget ? labels[budget] || budget : fallback;
}

// HTML escape function to prevent XSS
export function escapeHtml(text: string): string {
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
// 1. NOTIFICATION EMAIL (To Team) - Always in Czech
// =============================================================================

export function generateNotificationEmailHTML(data: ContactFormData): string {
  const serviceLabel = data.service ? SERVICE_LABELS_CS[data.service] || data.service : "Neuvedeno";
  const budgetOnetimeLabel = data.budget_onetime ? BUDGET_ONETIME_LABELS_CS[data.budget_onetime] || data.budget_onetime : "Neuvedeno";
  const budgetMonthlyLabel = data.budget_monthly ? BUDGET_MONTHLY_LABELS_CS[data.budget_monthly] || data.budget_monthly : "Neuvedeno";
  const userLang = data.language || 'cs';

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nový zájemce z webu | ${clientConfig.company.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; max-width: 600px;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d3d56 0%, #0a2a3d 100%); padding: 32px 40px; text-align: center; border-bottom: 1px solid rgba(0,163,154,0.3);">
              <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" width="180" style="display: block; margin: 0 auto 16px auto; height: auto;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">
                📬 Nový zájemce z webu
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.6);">
                Kontaktní formulář na ${clientConfig.siteUrl.replace('https://', '')} • Jazyk: ${userLang.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Contact Info Section -->
          <tr>
            <td style="padding: 32px 40px 24px 40px;">
              <h2 style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1px;">
                👤 Kontaktní údaje
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100" style="font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500;">Jméno</td>
                        <td style="font-size: 15px; color: #ffffff; font-weight: 600;">${escapeHtml(data.name)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100" style="font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500;">E-mail</td>
                        <td style="font-size: 15px; color: #00A39A; font-weight: 600;">
                          <a href="mailto:${escapeHtml(data.email)}" style="color: #00A39A; text-decoration: none;">${escapeHtml(data.email)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${data.phone ? `
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100" style="font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500;">Telefon</td>
                        <td style="font-size: 15px; color: #ffffff; font-weight: 600;">
                          <a href="tel:${escapeHtml(data.phone)}" style="color: #ffffff; text-decoration: none;">${escapeHtml(data.phone)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${data.website ? `
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="100" style="font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 500;">Web</td>
                        <td style="font-size: 15px; color: #00A39A; font-weight: 600;">
                          <a href="${escapeHtml(data.website)}" style="color: #00A39A; text-decoration: none;" target="_blank">${escapeHtml(data.website)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(0,163,154,0.3) 50%, transparent 100%);"></div>
            </td>
          </tr>

          <!-- Service Interest Section -->
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1px;">
                🎯 Zájem o službu
              </h2>
              <div style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, rgba(0,163,154,0.2) 0%, rgba(0,163,154,0.1) 100%); border: 1px solid rgba(0,163,154,0.4); border-radius: 8px; font-size: 16px; font-weight: 600; color: #00A39A;">
                ${serviceLabel}
              </div>
            </td>
          </tr>

          <!-- Budget Section -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1px;">
                💰 Rozpočet
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="padding-right: 8px;">
                    <div style="padding: 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px; text-align: center;">
                      <div style="font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Jednorázový</div>
                      <div style="font-size: 14px; color: #ffffff; font-weight: 600;">${budgetOnetimeLabel}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 8px;">
                    <div style="padding: 16px; background-color: rgba(255,255,255,0.03); border-radius: 8px; text-align: center;">
                      <div style="font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Měsíční</div>
                      <div style="font-size: 14px; color: #ffffff; font-weight: 600;">${budgetMonthlyLabel}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Section (if provided) -->
          ${data.message ? `
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(0,163,154,0.3) 50%, transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1px;">
                💬 Zpráva
              </h2>
              <div style="padding: 20px; background-color: rgba(255,255,255,0.03); border-radius: 8px; border-left: 3px solid #00A39A;">
                <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Button -->
          <tr>
            <td style="padding: 24px 40px 32px 40px; text-align: center;">
              <a href="mailto:${escapeHtml(data.email)}?subject=Re: Váš dotaz na ${clientConfig.company.name}"
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #00A39A 0%, #008f87 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(0,163,154,0.4);">
                📧 Odpovědět zájemci
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} • <a href="${clientConfig.siteUrl}" style="color: #00A39A; text-decoration: none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.3);">
                Automaticky odesláno z kontaktního formuláře • ${new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateNotificationEmailText(data: ContactFormData): string {
  const serviceLabel = data.service ? SERVICE_LABELS_CS[data.service] || data.service : "Neuvedeno";
  const budgetOnetimeLabel = data.budget_onetime ? BUDGET_ONETIME_LABELS_CS[data.budget_onetime] || data.budget_onetime : "Neuvedeno";
  const budgetMonthlyLabel = data.budget_monthly ? BUDGET_MONTHLY_LABELS_CS[data.budget_monthly] || data.budget_monthly : "Neuvedeno";
  const userLang = data.language || 'cs';

  return `
NOVÝ ZÁJEMCE Z WEBU - ${clientConfig.company.name}
==================================
Jazyk uživatele: ${userLang.toUpperCase()}

KONTAKTNÍ ÚDAJE
---------------
Jméno: ${data.name}
E-mail: ${data.email}
${data.phone ? `Telefon: ${data.phone}` : ''}
${data.website ? `Web: ${data.website}` : ''}

ZÁJEM O SLUŽBU
--------------
${serviceLabel}

ROZPOČET
--------
Jednorázový: ${budgetOnetimeLabel}
Měsíční: ${budgetMonthlyLabel}

${data.message ? `ZPRÁVA
------
${data.message}` : ''}

---
${clientConfig.company.legalName} | ${clientConfig.siteUrl.replace('https://', '')}
Automaticky odesláno z kontaktního formuláře
  `.trim();
}

// =============================================================================
// 2. CONFIRMATION EMAIL (To User) - Bilingual (CS/EN)
// =============================================================================

export function generateConfirmationEmailHTML(data: ContactFormData): string {
  const lang: EmailLanguage = data.language || 'cs';
  const serviceLabel = getServiceLabel(data.service, lang);
  
  // Bilingual content
  const content = {
    cs: {
      title: "Děkujeme za Váš dotaz!",
      subtitle: "Ozveme se Vám do 24 hodin",
      greeting: `Dobrý den, ${escapeHtml(data.name.split(' ')[0])},`,
      body: `Děkujeme za Váš zájem o spolupráci. Právě jsme v pořádku obdrželi Vaši poptávku ohledně <strong>${serviceLabel}</strong>. Náš tým ji právě zpracovává a budeme Vás kontaktovat zpět co nejdříve, nejpozději však <strong>do 24 hodin</strong>.`,
      bookingTitle: "Rezervujte si bezplatnou konzultaci",
      bookingDesc: "30 min bezplatná konzultace skrze Google Meet s Pavlem Čermákem (Jednatel a technický ředitel)",
      bookingBtn: "📅 Rezervovat konzultaci",
      caseStudiesLabel: "Case Studies",
      caseStudiesSubtitle: "PODÍVEJTE SE, JAK TVOŘÍME AI BUDOUCNOST",
      caseStudyTitle: "Případová studie: 5 regionů ČR",
      caseStudyStats: "35,095 AI odpovědí • 102% ROI • 4.57/5 spokojenost",
      videoTitle: `Pavel Čermák - AI v praxi (${clientConfig.company.name})`,
      followUs: "Sledujte nás",
      tagline: "Budoucnost je v AI. My ji tvoříme.",
    },
    en: {
      title: "Thank you for your inquiry!",
      subtitle: "We'll get back to you within 24 hours",
      greeting: `Hello ${escapeHtml(data.name.split(' ')[0])},`,
      body: `Thank you for your interest in working with us. We have successfully received your inquiry regarding <strong>${serviceLabel}</strong>. Our team is currently reviewing it and will contact you as soon as possible, but no later than <strong>within 24 hours</strong>.`,
      bookingTitle: "Book a free consultation",
      bookingDesc: "30 min free consultation via Google Meet with Pavel Čermák (CEO and CTO)",
      bookingBtn: "📅 Book a consultation",
      caseStudiesLabel: "Case Studies",
      caseStudiesSubtitle: "SEE HOW WE'RE SHAPING THE AI FUTURE",
      caseStudyTitle: "Case Study: 5 Czech Regions",
      caseStudyStats: "35,095 AI responses • 102% ROI • 4.57/5 satisfaction",
      videoTitle: `Pavel Čermák - AI in Practice (${clientConfig.company.name})`,
      followUs: "Follow us",
      tagline: "The future is in AI. We're building it.",
    }
  };
  
  const t = content[lang];

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} | ${clientConfig.company.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #111111; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; max-width: 600px;">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d3d56 0%, #0a2a3d 100%); padding: 32px 40px; text-align: center; border-bottom: 1px solid rgba(0,163,154,0.3);">
              <img src="${clientConfig.brand.logoUrl}" alt="${clientConfig.company.name}" width="180" style="display: block; margin: 0 auto 16px auto; height: auto;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">
                🎉 ${t.title}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.6);">
                ${t.subtitle}
              </p>
            </td>
          </tr>

          <!-- Message Section -->
          <tr>
            <td style="padding: 32px 40px 24px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #ffffff; line-height: 1.6;">
                ${t.greeting}
              </p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.6;">
                ${t.body}
              </p>
            </td>
          </tr>

          <!-- Booking CTA Section -->
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(0,163,154,0.15) 0%, rgba(0,163,154,0.05) 100%); border: 1px solid rgba(0,163,154,0.3); border-radius: 12px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #ffffff;">
                      📅 ${t.bookingTitle}
                    </p>
                    <p style="margin: 0 0 20px 0; font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.5;">
                      ${t.bookingDesc}
                    </p>
                    <a href="${clientConfig.primaryContact.calendarUrl || ''}" target="_blank"
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #00A39A 0%, #008f87 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 14px rgba(0,163,154,0.4);">
                      ${t.bookingBtn}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(0,163,154,0.3) 50%, transparent 100%);"></div>
            </td>
          </tr>

          <!-- Case Studies Section -->
          <tr>
            <td style="padding: 32px 40px 24px 40px;">
              <p style="margin: 0 0 4px 0; font-size: 22px; font-weight: 600; color: #00A39A; font-style: italic; font-family: Georgia, 'Times New Roman', serif;">
                ${t.caseStudiesLabel}
              </p>
              <p style="margin: 0 0 16px 0; font-size: 11px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1.5px;">
                📊 ${t.caseStudiesSubtitle}
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background-color: #000000;">
                    <a href="${clientConfig.siteUrl}/blog/pripadova-studie-5-kraju-cr" target="_blank" style="display: block; text-decoration: none;">
                      <img src="${clientConfig.siteUrl}/assets/images/blog/pripadova-studie-5-kraju-cr/hero.png" alt="${t.caseStudyTitle}" style="width: 100%; display: block;">
                      <div style="padding: 16px; background-color: #111111;">
                        <p style="margin: 0 0 4px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${t.caseStudyTitle}</p>
                        <p style="margin: 0; color: #00A39A; font-size: 12px;">${t.caseStudyStats}</p>
                      </div>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- YouTube Video Section -->
          <tr>
            <td style="padding: 16px 40px 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background-color: #000000;">
                    <a href="https://www.youtube.com/watch?v=bHMZn4ga9DE" target="_blank" style="display: block; text-decoration: none;">
                      <img src="https://i.ytimg.com/vi/bHMZn4ga9DE/maxresdefault.jpg" alt="${t.videoTitle}" style="width: 100%; display: block;">
                      <div style="padding: 16px; background-color: #111111;">
                        <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 500;">📺 ${t.videoTitle}</p>
                      </div>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Social Media Section -->
          <tr>
            <td style="padding: 0 40px 32px 40px; text-align: center;">
              <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #00A39A; text-transform: uppercase; letter-spacing: 1px;">
                📱 ${t.followUs}
              </h2>
              <table role="presentation" align="center" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 0 8px;">
                    <a href="${clientConfig.social.linkedin || ''}" target="_blank" style="display: inline-block; width: 44px; height: 44px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; line-height: 44px; color: #1a1a1a; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" height="20" style="vertical-align: middle;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="${clientConfig.social.instagram || ''}" target="_blank" style="display: inline-block; width: 44px; height: 44px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; line-height: 44px; color: #1a1a1a; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="20" height="20" style="vertical-align: middle;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="${clientConfig.social.facebook || ''}" target="_blank" style="display: inline-block; width: 44px; height: 44px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; line-height: 44px; color: #1a1a1a; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="20" height="20" style="vertical-align: middle;">
                    </a>
                  </td>
                  <td style="padding: 0 8px;">
                    <a href="https://www.youtube.com/@PavelCermakAI" target="_blank" style="display: inline-block; width: 44px; height: 44px; background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; text-align: center; line-height: 44px; color: #1a1a1a; text-decoration: none;">
                      <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="20" height="20" style="vertical-align: middle;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} • <a href="${clientConfig.siteUrl}" style="color: #00A39A; text-decoration: none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.3);">
                ${t.tagline}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function generateConfirmationEmailText(data: ContactFormData): string {
  const lang: EmailLanguage = data.language || 'cs';
  const serviceLabel = getServiceLabel(data.service, lang);
  const firstName = data.name.split(' ')[0];

  if (lang === 'en') {
    return `
Hello ${firstName},

Thank you for your inquiry regarding: ${serviceLabel}.

We have successfully received your message and our team is currently reviewing it. We will contact you as soon as possible, but no later than within 24 hours.

---

📅 BOOK A FREE CONSULTATION
30 min free consultation via Google Meet with ${clientConfig.primaryContact.name} (${clientConfig.primaryContact.title})
${clientConfig.primaryContact.calendarUrl || ''}

---

CASE STUDIES - See how we're shaping the AI future:
- Case Study: 5 Czech Regions (35,095 AI responses, 102% ROI)
  ${clientConfig.siteUrl}/blog/pripadova-studie-5-kraju-cr

VIDEO:
- Pavel Čermák - AI in Practice (${clientConfig.company.name})
  https://www.youtube.com/watch?v=bHMZn4ga9DE

Follow us:
- LinkedIn: ${clientConfig.social.linkedin || ''}
- Instagram: ${clientConfig.social.instagram || ''}

Thank you and we look forward to potential collaboration!

${clientConfig.company.name} Team
${clientConfig.siteUrl.replace('https://', '')}
    `.trim();
  }

  // Default: Czech
  return `
Dobrý den, ${firstName},

děkujeme za Váš dotaz ohledně: ${serviceLabel}.

Vaši zprávu jsme v pořádku obdrželi a náš tým ji právě zpracovává. Budeme Vás kontaktovat co nejdříve, nejpozději však do 24 hodin.

---

📅 REZERVUJTE SI BEZPLATNOU KONZULTACI
30 min bezplatná konzultace skrze Google Meet s ${clientConfig.primaryContact.name} (${clientConfig.primaryContact.title})
${clientConfig.primaryContact.calendarUrl || ''}

---

CASE STUDIES - Podívejte se, jak tvoříme AI budoucnost:
- Případová studie: 5 regionů ČR (35,095 AI odpovědí, 102% ROI)
  ${clientConfig.siteUrl}/blog/pripadova-studie-5-kraju-cr

VIDEO:
- Pavel Čermák - AI v praxi (${clientConfig.company.name})
  https://www.youtube.com/watch?v=bHMZn4ga9DE

Sledujte nás:
- LinkedIn: ${clientConfig.social.linkedin || ''}
- Instagram: ${clientConfig.social.instagram || ''}

Děkujeme a těšíme se na případnou spolupráci!

Tým ${clientConfig.company.name}
${clientConfig.siteUrl.replace('https://', '')}
  `.trim();
}
