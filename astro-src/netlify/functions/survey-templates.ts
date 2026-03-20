// =============================================================================
// SURVEY EMAIL TEMPLATES - Netlify Function Utils
// =============================================================================
// Email templates for the Pain-Point Discovery Survey.
// Notification to team (always Czech) + Confirmation to user (bilingual CS/EN).
// =============================================================================

import { clientConfig } from './_config/client';

// Survey lead interface (mirrors survey.ts SurveyLead)
export interface SurveyLead {
  id: string;
  source: 'survey';
  email: string;
  companyName: string;
  industry: string;
  companySize: 'solo' | '2-10' | '11-50' | '51-250' | '250+';
  painPoints: string[];
  primaryPainPoint: string;
  aiMaturity: 'none' | 'experimenting' | 'active' | '';
  hoursLostPerWeek: string;
  contextNote: string;
  language: 'cs' | 'en';
  submittedAt: string;
  leadSource: 'gc-pruzkum-page' | 'gc-event-page';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  city?: string;
  phoneNumber?: string;
  toolsUsed?: string[];
  websiteUrl?: string;
  respondentRole?: string;
  crmUsed?: string;
  erpUsed?: string;
  techOpenness?: string;
  techLevel?: string;
  topExamples?: string[];
}

// HTML escape to prevent XSS in email templates
function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Human-readable labels for enum values (Czech)
const AI_MATURITY_LABELS_CS: Record<string, string> = {
  none: 'Zatím AI vůbec nepoužíváme',
  experimenting: 'Něco jsme zkoušeli, ale zatím nic systematicky',
  active: 'AI už aktivně používáme v práci',
};

const COMPANY_SIZE_LABELS: Record<string, string> = {
  solo: 'Samostatný podnikatel',
  '2-10': '2 – 10 zaměstnanců',
  '11-50': '11 – 50 zaměstnanců',
  '51-250': '51 – 250 zaměstnanců',
  '250+': 'Více než 250 zaměstnanců',
};

// Pain point labels — used to render human-readable values in email templates.
// CS labels are used in the team notification email; EN labels in the user
// confirmation email when language === 'en'.
const PAIN_POINT_LABELS_CS: Record<string, string> = {
  new_customers: 'Shánění nových zákazníků — stojí to čas i lidi',
  speed_to_lead: 'Pomalé odpovídání na poptávky — zákazník nečeká',
  automating_communication: 'Ruční posílání e-mailů a follow-upů zákazníkům',
  customer_support: 'Lidi v týmu pořád dokola řeší stejné dotazy',
  boring_admin: 'Administrativa, co by zvládl i stroj — ale dělají ji lidi',
  reporting_data: 'Ruční skládání reportů a práce s daty',
  juggling_tools: 'Moc nástrojů, co spolu nekomunikují',
  integrating_ai: 'Nevíme, jak AI zapojit do toho, co už používáme',
  marketing_materials: 'Tvorba marketingových materiálů zabere moc času',
  content_creation: 'Na sociální sítě nemáme čas ani lidi',
  manual_data_entry: 'Přepisování dat ručně — z mailu do tabulky, z tabulky do systému',
  document_processing: 'Ruční zpracování faktur a dokumentů',
  invoicing: 'Fakturace a účetnictví — pořád ručně',
  scheduling: 'Domlouvání schůzek — nekonečné přepisování e-mailů',
  employee_onboarding: 'Zaučování nových lidí zabere týdny a stojí čas celého týmu',
  knowledge_silos: 'Všechno ví jeden člověk — když chybí, firma stojí',
  delegation: 'Nejde delegovat — lidi potřebují neustálé instrukce',
};

const PAIN_POINT_LABELS_EN: Record<string, string> = {
  new_customers: 'Finding and qualifying new customers',
  speed_to_lead: 'Slow response to inquiries',
  automating_communication: 'Automating customer communication',
  customer_support: 'Customer support and repetitive inquiries',
  boring_admin: 'Repetitive administrative tasks',
  reporting_data: 'Manual reporting and data work',
  juggling_tools: 'Too many disconnected tools',
  integrating_ai: 'Integrating AI into existing processes',
  marketing_materials: 'Creating marketing materials',
  content_creation: 'Social media and content creation',
  manual_data_entry: 'Manual data entry and transcription',
  document_processing: 'Document and invoice processing',
  invoicing: 'Invoicing and accounting tasks',
  scheduling: 'Scheduling and meeting coordination',
  employee_onboarding: 'Onboarding and training new employees',
  knowledge_silos: 'Company depends on one key person — knowledge not documented',
  delegation: 'Difficult delegation — employees need constant instructions',
};

const TECH_LEVEL_LABELS: Record<string, string> = {
  none: 'Vůbec ne',
  beginner: 'Základy',
  intermediate: 'Celkem zvládám',
  advanced: 'Pohoda, rozumím tomu',
};

const TECH_LEVEL_LABELS_EN: Record<string, string> = {
  none: 'Not at all',
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const TOP_EXAMPLES_LABELS: Record<string, string> = {
  auto_leads: 'AI najde a osloví zákazníky za Vás — bez obchoďáků',
  ai_web: 'Web za pár minut díky AI — bez programátora',
  ai_assistant: 'AI asistent na web — odpovídá zákazníkům za Vás, nonstop',
  ai_phone_management: 'Řízení firmy z telefonu — jen přes WhatsApp a hlasovky',
  voice_blog: 'Blogové příspěvky na autopilota — namluvíte a AI napíše',
  ai_avatar_reels: 'Reelska a příspěvky na sítě — AI avatar to udělá za Vás',
  ai_lead_magnet: 'Lead magnet na autopilota — AI vytvoří a napojí na Váš CRM',
};

const TOP_EXAMPLES_LABELS_EN: Record<string, string> = {
  auto_leads: 'Automated lead generation & outreach',
  ai_web: 'AI website creation',
  ai_assistant: 'AI assistant for website',
  ai_phone_management: 'Managing business via AI from phone',
  voice_blog: 'Voice-powered blog posts',
  ai_avatar_reels: 'AI avatar ads & reels',
  ai_lead_magnet: 'AI lead magnet + CRM integration',
};

/**
 * Render a single topExamples item as a human-readable label.
 * Accepts the label map and the localised "other" prefix to support both CS and EN.
 * Items matching the "other:text" pattern are shown as "{otherPrefix}: {text}".
 */
function renderTopExampleLabel(
  item: string,
  labelMap: Record<string, string>,
  otherPrefix: string,
): string {
  if (item.startsWith('other:')) {
    const text = item.slice('other:'.length).trim();
    return `${otherPrefix}: ${escapeHtml(text)}`;
  }
  return escapeHtml(labelMap[item] ?? item);
}

// =============================================================================
// 1. TEAM NOTIFICATION EMAIL (always Czech)
// =============================================================================

export function generateSurveyNotificationEmailHTML(lead: SurveyLead): string {
  const aiMaturityLabel = AI_MATURITY_LABELS_CS[lead.aiMaturity] || escapeHtml(lead.aiMaturity);
  const companySizeLabel = COMPANY_SIZE_LABELS[lead.companySize] || escapeHtml(lead.companySize);
  const submittedDate = new Date(lead.submittedAt).toLocaleString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const painPointsHTML = lead.painPoints
    .map(p => `<li style="margin-bottom: 6px; font-size: 15px; color: #ffffff; font-weight: 600;">${escapeHtml(PAIN_POINT_LABELS_CS[p] ?? p)}</li>`)
    .join('');

  const utmRows = [
    lead.utmSource ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;width:130px;">UTM Source</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.utmSource)}</td></tr>` : '',
    lead.utmMedium ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">UTM Medium</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.utmMedium)}</td></tr>` : '',
    lead.utmCampaign ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">UTM Campaign</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.utmCampaign)}</td></tr>` : '',
    lead.utmContent ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">UTM Content</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.utmContent)}</td></tr>` : '',
    lead.utmTerm ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">UTM Term</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.utmTerm)}</td></tr>` : '',
    lead.gclid ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">GCLID</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.gclid)}</td></tr>` : '',
    lead.fbclid ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">FBCLID</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.fbclid)}</td></tr>` : '',
    lead.msclkid ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">MSCLKID</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.msclkid)}</td></tr>` : '',
    lead.referrer ? `<tr><td style="font-size:12px;color:rgba(255,255,255,0.5);padding:3px 0;">Referrer</td><td style="font-size:12px;color:rgba(255,255,255,0.8);">${escapeHtml(lead.referrer)}</td></tr>` : '',
  ].filter(Boolean).join('');

  const hasUtmData = utmRows.length > 0;

  // New fields — Procesy a technologie section
  const hasProcessFields = !!(
    lead.websiteUrl ||
    lead.respondentRole ||
    lead.crmUsed ||
    lead.erpUsed ||
    lead.techOpenness ||
    lead.techLevel ||
    (lead.topExamples && lead.topExamples.length > 0)
  );

  const processFieldsHTML = hasProcessFields ? `
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Procesy a technologie
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${lead.respondentRole ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Role respondenta</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.respondentRole)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.websiteUrl ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Web</td>
                        <td style="font-size:14px;color:${clientConfig.brand.primaryColor};font-weight:600;">
                          ${/^https?:\/\//i.test(lead.websiteUrl)
                            ? `<a href="${escapeHtml(lead.websiteUrl)}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${escapeHtml(lead.websiteUrl)}</a>`
                            : escapeHtml(lead.websiteUrl)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.crmUsed ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">CRM</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.crmUsed)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.erpUsed ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">ERP</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.erpUsed)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.techOpenness ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Otevřenost k technologiím</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.techOpenness)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.techLevel ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Technická úroveň</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(TECH_LEVEL_LABELS[lead.techLevel] ?? lead.techLevel)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                ` : ''}
                ${lead.topExamples && lead.topExamples.length > 0 ? `
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="200" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;padding-top:2px;">Příklady automatizace</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">
                          <ul style="margin:0;padding:0 0 0 16px;list-style:disc;">
                            ${lead.topExamples.map(item => `<li style="margin-bottom:4px;">${renderTopExampleLabel(item, TOP_EXAMPLES_LABELS, 'Jiné')}</li>`).join('')}
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>` : '';

  return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nový průzkum: ${escapeHtml(lead.companyName)} | ${clientConfig.company.name}</title>
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
              <h1 style="margin:0;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">
                Nový průzkum bolestivých míst
              </h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.6);">
                Pain-Point Discovery Survey &bull; ${escapeHtml(lead.language.toUpperCase())} &bull; ${submittedDate}
              </p>
            </td>
          </tr>

          <!-- Company Info -->
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Informace o společnosti
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Společnost</td>
                        <td style="font-size:15px;color:#ffffff;font-weight:600;">${escapeHtml(lead.companyName)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Odvětví</td>
                        <td style="font-size:15px;color:#ffffff;font-weight:600;">${escapeHtml(lead.industry)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Velikost</td>
                        <td style="font-size:15px;color:#ffffff;font-weight:600;">${companySizeLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">E-mail</td>
                        <td style="font-size:15px;color:${clientConfig.brand.primaryColor};font-weight:600;">
                          <a href="mailto:${escapeHtml(lead.email)}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${escapeHtml(lead.email)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${lead.phoneNumber ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Telefon</td>
                        <td style="font-size:15px;color:${clientConfig.brand.primaryColor};font-weight:600;">
                          <a href="tel:${escapeHtml(lead.phoneNumber)}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${escapeHtml(lead.phoneNumber)}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${lead.city ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="140" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;">Město</td>
                        <td style="font-size:15px;color:#ffffff;font-weight:600;">${escapeHtml(lead.city)}</td>
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
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>

          <!-- Pain Points -->
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Bolestivá místa (vybral/a ${lead.painPoints.length})
              </h2>
              <ul style="margin:0;padding:0 0 0 18px;list-style:disc;">
                ${painPointsHTML}
              </ul>
            </td>
          </tr>

          <!-- Primary Pain Point Highlight -->
          ${lead.primaryPainPoint ? `
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <div style="padding:16px 20px;background:linear-gradient(135deg,rgba(249,115,22,0.18) 0%,rgba(249,115,22,0.08) 100%);border:1px solid rgba(249,115,22,0.4);border-radius:10px;">
                <div style="font-size:11px;color:rgba(249,115,22,0.9);text-transform:uppercase;letter-spacing:1px;font-weight:700;margin-bottom:6px;">Hlavní bolestivé místo</div>
                <div style="font-size:16px;font-weight:700;color:#ffffff;">${escapeHtml(lead.primaryPainPoint)}</div>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>

          <!-- Key Sales Data -->
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Klíčová obchodní data
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" style="padding-right:8px;">
                    <div style="padding:16px;background:linear-gradient(135deg,rgba(249,115,22,0.15) 0%,rgba(249,115,22,0.05) 100%);border:1px solid rgba(249,115,22,0.35);border-radius:10px;text-align:center;">
                      <div style="font-size:11px;color:rgba(249,115,22,0.85);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Ztráty hodin / týden</div>
                      <div style="font-size:22px;font-weight:700;color:#f97316;">${escapeHtml(lead.hoursLostPerWeek) || 'N/A'}</div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left:8px;">
                    <div style="padding:16px;background-color:rgba(255,255,255,0.03);border-radius:10px;text-align:center;">
                      <div style="font-size:11px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Zralost AI</div>
                      <div style="font-size:15px;font-weight:600;color:#ffffff;">${aiMaturityLabel}</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Context Note -->
          ${lead.contextNote ? `
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Doplňující kontext
              </h2>
              <blockquote style="margin:0;padding:16px 20px;background-color:rgba(255,255,255,0.03);border-left:3px solid ${clientConfig.brand.primaryColor};border-radius:0 8px 8px 0;">
                <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;font-style:italic;">${escapeHtml(lead.contextNote)}</p>
              </blockquote>
            </td>
          </tr>
          ` : ''}

          <!-- Tools Used -->
          ${lead.toolsUsed && lead.toolsUsed.length > 0 ? `
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Používané nástroje
              </h2>
              <blockquote style="margin:0;padding:16px 20px;background-color:rgba(255,255,255,0.03);border-left:3px solid ${clientConfig.brand.primaryColor};border-radius:0 8px 8px 0;">
                <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">${escapeHtml(lead.toolsUsed.join(', '))}</p>
              </blockquote>
            </td>
          </tr>
          ` : ''}

          <!-- Procesy a technologie (new fields) -->
          ${processFieldsHTML}

          <!-- Attribution -->
          ${hasUtmData ? `
          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 50%,transparent 100%);"></div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;">
              <h2 style="margin:0 0 12px 0;font-size:12px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">
                Zdroj návštěvnosti
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0">
                ${utmRows}
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- CTA -->
          <tr>
            <td style="padding:8px 40px 32px 40px;text-align:center;">
              <a href="mailto:${escapeHtml(lead.email)}?subject=Re: Váš průzkum AI automatizace"
                 style="display:inline-block;padding:14px 32px;background:${clientConfig.brand.primaryColor};color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;margin-right:12px;">
                Odpovědět leadovi
              </a>
              <a href="${clientConfig.siteUrl}/.netlify/functions/admin-leads"
                 style="display:inline-block;padding:14px 32px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                Admin Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;color:rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} &bull; <a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                Lead ID: ${escapeHtml(lead.id)} &bull; Zdroj: ${escapeHtml(lead.leadSource)}
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

// =============================================================================
// 2. USER CONFIRMATION EMAIL (bilingual CS/EN)
// =============================================================================

export function generateSurveyConfirmationEmailHTML(lead: SurveyLead): string {
  const lang = lead.language;

  const painPointLabelMap = lang === 'en' ? PAIN_POINT_LABELS_EN : PAIN_POINT_LABELS_CS;
  const painPointsList = lead.painPoints
    .map(p => `<li style="margin-bottom:5px;font-size:14px;color:rgba(255,255,255,0.8);">${escapeHtml(painPointLabelMap[p] ?? p)}</li>`)
    .join('');

  if (lang === 'cs') {
    return `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Děkujeme za registraci | ${clientConfig.company.name}</title>
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
              <h1 style="margin:0;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">
                Jste zaregistrovaní!
              </h1>
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#ffffff;line-height:1.4;">
                Máme to! Vaše registrace je potvrzená.
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:rgba(255,255,255,0.85);line-height:1.7;">
                Podle Vašich odpovědí připravíme program přímo pro Vás — konkrétní ukázky, jak AI ušetří za zaměstnance a zjednoduší Vám práci. Žádné obecné řeči, jen věci, které můžete hned použít.
              </p>
              <p style="margin:0;font-size:17px;font-weight:600;color:${clientConfig.brand.primaryColor};">
                Těšíme se na Vás 28. března!
              </p>
            </td>
          </tr>

          <!-- Speaker Section -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <div style="padding:20px 24px;background:linear-gradient(135deg,rgba(249,115,22,0.12) 0%,rgba(249,115,22,0.04) 100%);border:1px solid rgba(249,115,22,0.25);border-radius:12px;">
                <p style="margin:0 0 10px 0;font-size:14px;font-weight:600;color:#f97316;text-transform:uppercase;letter-spacing:0.5px;">
                  Řečník
                </p>
                <p style="margin:0 0 6px 0;font-size:17px;font-weight:700;color:#ffffff;">
                  ${clientConfig.primaryContact.name}
                </p>
                <p style="margin:0 0 14px 0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;">
                  ${clientConfig.primaryContact.title}, ${clientConfig.company.name} (<a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>)
                </p>
                <p style="margin:0 0 16px 0;font-size:13px;color:rgba(255,255,255,0.5);">
                  <a href="${clientConfig.siteUrl}" target="_blank" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
                </p>
                <a href="${clientConfig.primaryContact.calendarUrl || ''}" target="_blank"
                   style="display:inline-block;padding:11px 22px;background:linear-gradient(135deg,#f97316 0%,#ea6c0a 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;box-shadow:0 4px 14px rgba(249,115,22,0.4);">
                  Domluvte si konzultaci
                </a>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>

          <!-- Answers Summary -->
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Vaše odpovědi v kostce
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Společnost</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.companyName)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Odvětví</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.industry)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Bolestivá místa</p>
                    <ul style="margin:0;padding-left:16px;list-style:disc;">
                      ${painPointsList}
                    </ul>
                  </td>
                </tr>
                ${lead.techLevel ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Technická úroveň</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(TECH_LEVEL_LABELS[lead.techLevel] ?? lead.techLevel)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${lead.topExamples && lead.topExamples.length > 0 ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Příklady automatizace</p>
                    <ul style="margin:0;padding-left:16px;list-style:disc;">
                      ${lead.topExamples.map(item => `<li style="margin-bottom:5px;font-size:14px;color:rgba(255,255,255,0.8);">${renderTopExampleLabel(item, TOP_EXAMPLES_LABELS, 'Jiné')}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} &bull; <a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                AI, která šetří čas i peníze.
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

  // English version
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for registering | ${clientConfig.company.name}</title>
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
              <h1 style="margin:0;font-size:24px;font-weight:600;color:#ffffff;letter-spacing:-0.5px;">
                Thank you for registering | ${clientConfig.company.name}
              </h1>
            </td>
          </tr>

          <!-- Confirmation -->
          <tr>
            <td style="padding:32px 40px 24px 40px;">
              <p style="margin:0 0 16px 0;font-size:18px;font-weight:700;color:#ffffff;line-height:1.4;">
                We've received your registration.
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;color:rgba(255,255,255,0.85);line-height:1.7;">
                Based on your answers, we'll tailor the event content and presentation to deliver maximum value — practical tips and tricks you can implement in your business right away.
              </p>
              <p style="margin:0;font-size:17px;font-weight:600;color:${clientConfig.brand.primaryColor};">
                See you on March 28!
              </p>
            </td>
          </tr>

          <!-- Speaker Section -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <div style="padding:20px 24px;background:linear-gradient(135deg,rgba(249,115,22,0.12) 0%,rgba(249,115,22,0.04) 100%);border:1px solid rgba(249,115,22,0.25);border-radius:12px;">
                <p style="margin:0 0 10px 0;font-size:14px;font-weight:600;color:#f97316;text-transform:uppercase;letter-spacing:0.5px;">
                  Speaker
                </p>
                <p style="margin:0 0 6px 0;font-size:17px;font-weight:700;color:#ffffff;">
                  ${clientConfig.primaryContact.name}
                </p>
                <p style="margin:0 0 14px 0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;">
                  ${clientConfig.primaryContact.title}, ${clientConfig.company.name} (<a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>)
                </p>
                <p style="margin:0 0 16px 0;font-size:13px;color:rgba(255,255,255,0.5);">
                  <a href="${clientConfig.siteUrl}" target="_blank" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
                </p>
                <a href="${clientConfig.primaryContact.calendarUrl || ''}" target="_blank"
                   style="display:inline-block;padding:11px 22px;background:linear-gradient(135deg,#f97316 0%,#ea6c0a 100%);color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;box-shadow:0 4px 14px rgba(249,115,22,0.4);">
                  Book a consultation
                </a>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(0,163,154,0.3) 50%,transparent 100%);"></div>
            </td>
          </tr>

          <!-- Answers Summary -->
          <tr>
            <td style="padding:24px 40px;">
              <h2 style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:${clientConfig.brand.primaryColor};text-transform:uppercase;letter-spacing:1px;">
                Your answers at a glance
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Company</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.companyName)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Industry</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(lead.industry)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Pain points</p>
                    <ul style="margin:0;padding-left:16px;list-style:disc;">
                      ${painPointsList}
                    </ul>
                  </td>
                </tr>
                ${lead.techLevel ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="130" style="font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">Technical level</td>
                        <td style="font-size:14px;color:#ffffff;font-weight:600;">${escapeHtml(TECH_LEVEL_LABELS_EN[lead.techLevel] ?? lead.techLevel)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                ${lead.topExamples && lead.topExamples.length > 0 ? `
                <tr><td style="height:6px;"></td></tr>
                <tr>
                  <td style="padding:10px 14px;background-color:rgba(255,255,255,0.03);border-radius:8px;">
                    <p style="margin:0 0 8px 0;font-size:12px;color:rgba(255,255,255,0.5);font-weight:500;">AI automation examples</p>
                    <ul style="margin:0;padding-left:16px;list-style:disc;">
                      ${lead.topExamples.map(item => `<li style="margin-bottom:5px;font-size:14px;color:rgba(255,255,255,0.8);">${renderTopExampleLabel(item, TOP_EXAMPLES_LABELS_EN, 'Other')}</li>`).join('')}
                    </ul>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background-color:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:rgba(255,255,255,0.4);">
                ${clientConfig.company.legalName} &bull; <a href="${clientConfig.siteUrl}" style="color:${clientConfig.brand.primaryColor};text-decoration:none;">${clientConfig.siteUrl.replace('https://', '')}</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                The future is in AI. We are building it.
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

// =============================================================================
// 3. EMAIL SUBJECT HELPERS
// =============================================================================

export function getSurveyConfirmationSubject(language: 'cs' | 'en'): string {
  return language === 'cs'
    ? `Děkujeme za registraci | ${clientConfig.company.name}`
    : `Thank you for registering | ${clientConfig.company.name}`;
}
