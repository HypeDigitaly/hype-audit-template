import type { Language } from './types';
import { site } from '../../config/site';

export interface ConsultKeys {
  consult_hero_badge: string;
  consult_hero_headline_1: string;
  consult_hero_headline_2: string;
  consult_hero_subheadline: string;
  consult_meta_title: string;
  consult_meta_desc: string;
  consult_pricing_title: string;
  consult_quick_audit_badge: string;
  consult_quick_audit_title: string;
  consult_quick_audit_desc: string;
  consult_quick_audit_price: string;
  consult_quick_audit_f1: string;
  consult_quick_audit_f2: string;
  consult_quick_audit_f3: string;
  consult_quick_audit_f4: string;
  consult_quick_audit_cta: string;
  consult_sprint_recommended: string;
  consult_sprint_badge: string;
  consult_sprint_title: string;
  consult_sprint_desc: string;
  consult_sprint_price: string;
  consult_sprint_f1: string;
  consult_sprint_f2: string;
  consult_sprint_f3: string;
  consult_sprint_f4: string;
  consult_sprint_f5: string;
  consult_sprint_cta: string;
  consult_partner_badge: string;
  consult_partner_title: string;
  consult_partner_desc: string;
  consult_partner_price: string;
  consult_partner_unit: string;
  consult_partner_f1: string;
  consult_partner_f2: string;
  consult_partner_f3: string;
  consult_partner_f4: string;
  consult_partner_f5: string;
  consult_partner_cta: string;
  consult_adhoc_tag: string;
  consult_adhoc_label: string;
  consult_online_title: string;
  consult_online_price: string;
  consult_online_unit: string;
  consult_online_desc: string;
  consult_online_f1: string;
  consult_online_f2: string;
  consult_online_f3: string;
  consult_online_f4: string;
  consult_online_cta: string;
  consult_adhoc_title: string;
  consult_adhoc_price: string;
  consult_adhoc_unit: string;
  consult_adhoc_desc: string;
  consult_adhoc_f1: string;
  consult_adhoc_f2: string;
  consult_adhoc_f3: string;
  consult_adhoc_f4: string;
  consult_adhoc_cta: string;
  consult_training_title: string;
  consult_training_price: string;
  consult_training_unit: string;
  consult_training_desc: string;
  consult_training_duration: string;
  consult_training_f1: string;
  consult_training_f2: string;
  consult_training_f3: string;
  consult_training_f4: string;
  consult_training_f5: string;
  consult_training_f6: string;
  consult_training_cta: string;
  consult_adhoc_section_right: string;
  consult_free_badge: string;
  consult_free_title: string;
  consult_free_desc: string;
  consult_free_cta: string;
  consult_audit_title: string;
  consult_audit_desc: string;
  consult_audit_price: string;
  consult_audit_price_desc: string;
  consult_audit_cta: string;
}

export const consultTranslations: Record<Language, ConsultKeys> = {
  cs: {
    consult_hero_badge: "Konzultace & Partnerství",
    consult_hero_headline_1: "AI strategie na míru",
    consult_hero_headline_2: "pro vaši firmu",
    consult_hero_subheadline: "Od jednorázové konzultace po dlouhodobé partnerství. Pomůžeme vám najít optimální cestu k AI transformaci.",
    consult_meta_title: `Konzultace & Podpora | ${site.name} - AI Audity, Školení, Workshopy`,
    consult_meta_desc: `AI konzultace, audity, školení a workshopy od ${site.name}. Vstupní programy, implementace AI do vaší firmy a dlouhodobé partnerství.`,
    consult_pricing_title: "Varianty spolupráce",
    consult_quick_audit_badge: "Vstupní program",
    consult_quick_audit_title: "AI Quick Audit",
    consult_quick_audit_desc: "Jednorázová diagnostika procesu",
    consult_quick_audit_price: "25 994 Kč",
    consult_quick_audit_f1: "Hloubková analýza vybraného procesu",
    consult_quick_audit_f2: "Odhalení problematických míst",
    consult_quick_audit_f3: "Návrh technického řešení",
    consult_quick_audit_f4: "Výpočet návratnosti investice",
    consult_quick_audit_cta: "Objednat audit",
    consult_sprint_recommended: "DOPORUČUJEME",
    consult_sprint_badge: "Implementační program",
    consult_sprint_title: "AI Sprint (30 dní)",
    consult_sprint_desc: "Kompletní zavedení do provozu",
    consult_sprint_price: "119 994 Kč",
    consult_sprint_f1: "Nasazení nástrojů do workflow",
    consult_sprint_f2: "Praktické zaškolení týmu",
    consult_sprint_f3: "AI roadmapa a poradenství",
    consult_sprint_f4: "30denní prioritní podpora",
    consult_sprint_f5: "Záruka výsledků",
    consult_sprint_cta: "Zahájit spolupráci",
    consult_partner_badge: "Partnerský program",
    consult_partner_title: "AI Partner",
    consult_partner_desc: "Minimálně 3–6 měsíců",
    consult_partner_price: "99 994 Kč",
    consult_partner_unit: "/měsíc",
    consult_partner_f1: "Ucelená AI strategie",
    consult_partner_f2: "Správa inovační roadmapy",
    consult_partner_f3: "Vzdělávání a adopce v týmu",
    consult_partner_f4: "Koučink managementu",
    consult_partner_f5: "Pravidelný reporting výsledků",
    consult_partner_cta: "Sjednat partnerství",
    consult_adhoc_tag: "02",
    consult_adhoc_label: "// AD-HOC SLUŽBY",
    consult_online_title: "Online konzultace",
    consult_online_price: "5 000 Kč",
    consult_online_unit: "/hodina",
    consult_online_desc: "Rychlá pomoc na dálku přes Google Meet nebo Zoom",
    consult_online_f1: "Řešení konkrétního problému",
    consult_online_f2: "Konzultace k aktuálním nástrojům",
    consult_online_f3: "Review vašich AI promptů",
    consult_online_f4: "Sdílení obrazovky a praktické ukázky",
    consult_online_cta: "Rezervovat online",
    consult_adhoc_title: "Ad hoc konzultace",
    consult_adhoc_price: "5 000 Kč",
    consult_adhoc_unit: "/hodina",
    consult_adhoc_desc: "Operativní nárazová konzultace",
    consult_adhoc_f1: "Vhodnost využití AI",
    consult_adhoc_f2: "Čím a jak začít",
    consult_adhoc_f3: "Jak s AI nástroji pracovat",
    consult_adhoc_f4: "Orientace v nástrojích, cenách, licencích",
    consult_adhoc_cta: "Sjednat konzultaci",
    consult_training_title: "Ad hoc školení / workshopy",
    consult_training_price: "5 000 Kč",
    consult_training_unit: "/hodina",
    consult_training_desc: "Fyzické nebo online školení",
    consult_training_duration: "půldenní, denní i vícedenní školení",
    consult_training_f1: "Co je a co není AI & jak funguje",
    consult_training_f2: "Prompt engineering (efektivní prompty)",
    consult_training_f3: "Nástroje pro text, video, automatizace",
    consult_training_f4: "Využití v marketingu, sales, financích",
    consult_training_f5: "AI ACT, autorská práva, ochrana dat",
    consult_training_f6: "Workshopy MS Copilot & ChatGPT",
    consult_training_cta: "Poptat školení",
    consult_adhoc_section_right: "KONZULTACE & ŠKOLENÍ",
    consult_free_badge: "ZDARMA",
    consult_free_title: "Konzultace ZDARMA",
    consult_free_desc: "Pojďme probrat vaše potřeby",
    consult_free_cta: "Rezervovat 30 min ZDARMA",
    consult_audit_title: "Komplexní AI Audit organizace",
    consult_audit_desc: "Celková analýza firemních procesů, prověření dat a systémů, mapa příležitostí, prioritizační rámec a odhad návratnosti. Přesně zjistíme, kde AI přinese největší úspory a kde má investice smysl.",
    consult_audit_price: "60–120 tis. Kč",
    consult_audit_price_desc: "Cena závisí na rozsahu firmy a komplexitě procesů",
    consult_audit_cta: "Objednat AI Audit",
  },
  en: {
    consult_hero_badge: "Consulting & Partnership",
    consult_hero_headline_1: "Custom AI strategy",
    consult_hero_headline_2: "for your company",
    consult_hero_subheadline: "From one-time consultation to long-term partnership. We'll help you find the optimal path to AI transformation.",
    consult_meta_title: `Consultation & Support | ${site.name} - AI Audits, Training, Workshops`,
    consult_meta_desc: `AI consultations, audits, training, and workshops by ${site.name}. Entry programs, AI implementation for your business, and long-term partnership.`,
    consult_pricing_title: "Partnership Options",
    consult_quick_audit_badge: "Entry Program",
    consult_quick_audit_title: "AI Quick Audit",
    consult_quick_audit_desc: "One-time process diagnostic",
    consult_quick_audit_price: "$3,500",
    consult_quick_audit_f1: "Deep analysis of selected process",
    consult_quick_audit_f2: "Identification of bottleneck areas",
    consult_quick_audit_f3: "Technical solution design",
    consult_quick_audit_f4: "ROI calculation",
    consult_quick_audit_cta: "Order audit",
    consult_sprint_recommended: "RECOMMENDED",
    consult_sprint_badge: "Implementation Program",
    consult_sprint_title: "AI Sprint (30 days)",
    consult_sprint_desc: "Complete operational implementation",
    consult_sprint_price: "$16,000",
    consult_sprint_f1: "Deployment of tools into workflow",
    consult_sprint_f2: "Practical team training",
    consult_sprint_f3: "AI roadmap and consulting",
    consult_sprint_f4: "30-day priority support",
    consult_sprint_f5: "Guaranteed results",
    consult_sprint_cta: "Start collaboration",
    consult_partner_badge: "Partner Program",
    consult_partner_title: "AI Partner",
    consult_partner_desc: "Minimum 3–6 months",
    consult_partner_price: "$15,000",
    consult_partner_unit: "/month",
    consult_partner_f1: "Comprehensive AI strategy",
    consult_partner_f2: "Innovation roadmap management",
    consult_partner_f3: "Team training and adoption",
    consult_partner_f4: "Management coaching",
    consult_partner_f5: "Regular results reporting",
    consult_partner_cta: "Arrange partnership",
    consult_adhoc_tag: "02",
    consult_adhoc_label: "// AD-HOC SERVICES",
    consult_online_title: "Online Consultation",
    consult_online_price: "$220",
    consult_online_unit: "/hour",
    consult_online_desc: "Fast remote help via Google Meet or Zoom",
    consult_online_f1: "Specific problem solving",
    consult_online_f2: "Consultation on current tools",
    consult_online_f3: "Review of your AI prompts",
    consult_online_f4: "Screen sharing and practical demos",
    consult_online_cta: "Book online",
    consult_adhoc_title: "Ad hoc Consultation",
    consult_adhoc_price: "$220",
    consult_adhoc_unit: "/hour",
    consult_adhoc_desc: "Operational on-demand consultation",
    consult_adhoc_f1: "AI suitability assessment",
    consult_adhoc_f2: "Where and how to start",
    consult_adhoc_f3: "How to work with AI tools",
    consult_adhoc_f4: "Guidance on tools, pricing, licenses",
    consult_adhoc_cta: "Arrange consultation",
    consult_training_title: "Ad hoc Training / Workshops",
    consult_training_price: "$220",
    consult_training_unit: "/hour",
    consult_training_desc: "On-site or online training",
    consult_training_duration: "Half-day, full-day, and multi-day training",
    consult_training_f1: "What AI is (and isn't) & how it works",
    consult_training_f2: "Prompt engineering (effective prompts)",
    consult_training_f3: "Tools for text, video, automation",
    consult_training_f4: "Usage in marketing, sales, finance",
    consult_training_f5: "AI ACT, copyright, data protection",
    consult_training_f6: "MS Copilot & ChatGPT workshops",
    consult_training_cta: "Inquire about training",
    consult_adhoc_section_right: "CONSULTATION & TRAINING",
    consult_free_badge: "FREE",
    consult_free_title: "FREE Consultation",
    consult_free_desc: "Let's discuss your needs",
    consult_free_cta: "Book 30 min FREE",
    consult_audit_title: "Comprehensive Organizational AI Audit",
    consult_audit_desc: "Complete analysis of business processes, data and systems review, opportunity map, prioritization framework, and ROI estimate. We'll identify exactly where AI brings the most savings and where investment makes sense.",
    consult_audit_price: "$8,000–$16,000",
    consult_audit_price_desc: "Price depends on company size and process complexity",
    consult_audit_cta: "Order AI Audit",
  },
};
