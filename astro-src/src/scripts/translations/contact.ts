import type { Language } from './types';
import { site } from '../../config/site';

export interface ContactKeys {
  // Contact Page Meta
  contact_meta_title: string;
  contact_meta_desc: string;

  // Contact Hero
  contact_hero_badge: string;
  contact_hero_headline_1: string;
  contact_hero_headline_2: string;
  contact_hero_subheadline: string;

  // Contact Form
  contact_form_title: string;
  contact_form_desc: string;
  contact_form_name: string;
  contact_form_name_placeholder: string;
  contact_form_email: string;
  contact_form_email_placeholder: string;
  contact_form_phone: string;
  contact_form_phone_placeholder: string;
  contact_form_website: string;
  contact_form_website_placeholder: string;
  contact_form_service: string;
  contact_form_service_placeholder: string;
  contact_form_service_audit: string;
  contact_form_service_chatbot: string;
  contact_form_service_voicebot: string;
  contact_form_service_agent: string;
  contact_form_service_automation: string;
  contact_form_service_dev: string;
  contact_form_service_web: string;
  contact_form_service_consult: string;
  contact_form_service_dataprep: string;
  contact_form_service_other: string;
  contact_form_budget_onetime: string;
  contact_form_budget_onetime_placeholder: string;
  contact_form_budget_onetime_1: string;
  contact_form_budget_onetime_2: string;
  contact_form_budget_onetime_3: string;
  contact_form_budget_onetime_4: string;
  contact_form_budget_onetime_unsure: string;
  contact_form_budget_monthly: string;
  contact_form_budget_monthly_placeholder: string;
  contact_form_budget_monthly_1: string;
  contact_form_budget_monthly_2: string;
  contact_form_budget_monthly_3: string;
  contact_form_budget_monthly_4: string;
  contact_form_budget_monthly_unsure: string;
  contact_form_message: string;
  contact_form_message_placeholder: string;
  contact_form_submit: string;
  contact_form_submitting: string;
  contact_form_success_title: string;
  contact_form_success_desc: string;
  contact_form_send_another: string;
  contact_form_back_home: string;
  contact_form_error: string;
  contact_form_required: string;

  // Contact Info
  contact_info_title: string;
  contact_info_subtitle: string;

  // Contact Calendar
  contact_calendar_title: string;
  contact_calendar_desc: string;

  // Contact Alt
  contact_alt: string;

  // FAQ Section
  faq_label: string;
  faq_headline: string;
  faq_1_q: string;
  faq_1_a: string;
  faq_2_q: string;
  faq_2_a: string;
  faq_3_q: string;
  faq_3_a: string;
  faq_4_q: string;
  faq_4_a: string;
  faq_5_q: string;
  faq_5_a: string;
  faq_6_q: string;
  faq_6_a: string;

  // CTA Section
  cta_tag: string;
  cta_label: string;
  cta_headline_1: string;
  cta_headline_2: string;
  cta_subheadline: string;
  cta_trust_1: string;
  cta_trust_2: string;
  cta_trust_3: string;

  // Calendar Widget
  cal_title: string;
  cal_desc: string;
}

export const contactTranslations: Record<Language, ContactKeys> = {
  cs: {
    // Contact Page Meta
    contact_meta_title: `Kontakt | ${site.name} - AI Partner`,
    contact_meta_desc: "Spojte se s námi a začněte svou AI transformaci. Domluvte si bezplatnou konzultaci nebo nám napište.",

    // Contact Hero
    contact_hero_badge: "Jsme tu pro vás",
    contact_hero_headline_1: "Spojte se s námi",
    contact_hero_headline_2: "a začněte svou AI cestu",
    contact_hero_subheadline: "Vyplňte formulář, napište nám nebo si rovnou domluvte bezplatnou konzultaci. Odpovídáme do 24 hodin.",

    // Contact Form
    contact_form_title: "Napište nám",
    contact_form_desc: "Vyplňte formulář a ozveme se vám co nejdříve.",
    contact_form_name: "Jméno a příjmení",
    contact_form_name_placeholder: "Jan Novák",
    contact_form_email: "E-mail",
    contact_form_email_placeholder: "jan@firma.cz",
    contact_form_phone: "Telefon",
    contact_form_phone_placeholder: "+420 xxx xxx xxx",
    contact_form_website: "Web",
    contact_form_website_placeholder: "https://vasefirma.cz",
    contact_form_service: "O jakou službu máte zájem?",
    contact_form_service_placeholder: "Vyberte službu...",
    contact_form_service_audit: "AI audit zdarma",
    contact_form_service_chatbot: "AI Chatbot",
    contact_form_service_voicebot: "AI Voicebot",
    contact_form_service_agent: "AI Agent",
    contact_form_service_automation: "Automatizace procesů",
    contact_form_service_dev: "Vývoj aplikací",
    contact_form_service_web: "Web Design",
    contact_form_service_consult: "AI Konzultace",
    contact_form_service_dataprep: "Příprava dat (RAGus.ai)",
    contact_form_service_other: "Jiné",
    contact_form_budget_onetime: "Jednorázový rozpočet",
    contact_form_budget_onetime_placeholder: "Vyberte rozsah...",
    contact_form_budget_onetime_1: "Do 50 000 Kč",
    contact_form_budget_onetime_2: "50 000 – 150 000 Kč",
    contact_form_budget_onetime_3: "150 000 – 500 000 Kč",
    contact_form_budget_onetime_4: "500 000+ Kč",
    contact_form_budget_onetime_unsure: "Zatím nevím",
    contact_form_budget_monthly: "Měsíční rozpočet",
    contact_form_budget_monthly_placeholder: "Vyberte rozsah...",
    contact_form_budget_monthly_1: "Do 10 000 Kč",
    contact_form_budget_monthly_2: "10 000 – 30 000 Kč",
    contact_form_budget_monthly_3: "30 000 – 100 000 Kč",
    contact_form_budget_monthly_4: "100 000+ Kč",
    contact_form_budget_monthly_unsure: "Zatím nevím",
    contact_form_message: "Vaše zpráva",
    contact_form_message_placeholder: "Popište váš projekt nebo dotaz...",
    contact_form_submit: "Odeslat zprávu",
    contact_form_submitting: "Odesílám...",
    contact_form_success_title: "Zpráva odeslána!",
    contact_form_success_desc: "Děkujeme za vaši zprávu. Ozveme se vám co nejdříve, obvykle do 24 hodin.",
    contact_form_send_another: "Odeslat další zprávu",
    contact_form_back_home: "Zpět na hlavní stránku",
    contact_form_error: "Něco se pokazilo. Zkuste to prosím znovu nebo nás kontaktujte přímo.",
    contact_form_required: "Povinné pole",

    // Contact Info
    contact_info_title: "Kontaktní informace",
    contact_info_subtitle: "Preferujete přímý kontakt? Napište nám nebo zavolejte.",

    // Contact Calendar
    contact_calendar_title: "Domluvte si konzultaci",
    contact_calendar_desc: "Vyberte si termín, který vám vyhovuje. 30 minut online, bez závazku.",

    // Contact Alt
    contact_alt: "Preferujete přímý kontakt?",

    // FAQ Section
    faq_label: "ČASTÉ OTÁZKY",
    faq_headline: "Ptáte se nás",
    faq_1_q: "Co když ve firmě nemáme IT specialistu?",
    faq_1_a: "Navrhujeme řešení tak, aby fungovala i bez technických expertů. Podstatné je správně nastavit procesy a nástroje – a přesně to za vás vyřešíme.",
    faq_2_q: "Co když náš tým s AI neumí pracovat?",
    faq_2_a: "Školení a průběžná podpora adopce jsou součástí spolupráce. Zaměstnanci se učí přímo při práci – na reálných úkolech, ne z teoretických materiálů.",
    faq_3_q: "Jak brzy uvidíme výsledky?",
    faq_3_a: "Zpravidla během 2–4 týdnů. Začínáme rychlými výhrami s okamžitým efektem. Vyhýbáme se dlouhým analýzám bez hmatatelných výstupů.",
    faq_4_q: "Co když nebudeme s výsledky spokojeni?",
    faq_4_a: "Máme aktivní záruku – pokud do 30 dnů neuvidíte konkrétní časovou úsporu a funkční AI workflow, pokračujeme další měsíc bez příplatku.",
    faq_5_q: "V čem se odlišujete od jiných AI poradců?",
    faq_5_a: "Jsme první česká softwarová firma, která úspěšně spustila AI chatboty na krajských webech. Máme reálná čísla – přes 35 000 AI odpovědí, 5 krajů, prokazatelné ROI. Neděláme jen prezentace, ale praktickou realizaci.",
    faq_6_q: "Co je RAGus.ai?",
    faq_6_a: "RAGus.ai je naše specializovaná RAG-as-a-Service platforma určená AI agenturám, enterprise AI týmům, RAG vývojářům a no-code builderům využívajícím Voiceflow, Botpress či podobné nástroje. Nabízí enterprise-grade infrastrukturu pro vyhledávání znalostí s 99% přesností.",

    // CTA Section
    cta_tag: "// KONTAKT",
    cta_label: "ZAČNĚTE DNES",
    cta_headline_1: "Připraveni Začít Vaši",
    cta_headline_2: "AI Transformaci?",
    cta_subheadline: `Spojte se s ${site.name} a proměňte potenciál AI v konkurenční výhodu vaší organizace.`,
    cta_trust_1: "Bez závazku",
    cta_trust_2: "30min konzultace",
    cta_trust_3: "Sídlo v ČR",

    // Calendar Widget
    cal_title: "Domluvte si bezplatnou konzultaci",
    cal_desc: "30minutový call bez závazku",
  },
  en: {
    // Contact Page Meta
    contact_meta_title: `Contact | ${site.name} - AI Partner`,
    contact_meta_desc: "Get in touch with us and start your AI transformation. Schedule a free consultation or send us a message.",

    // Contact Hero
    contact_hero_badge: "We're here for you",
    contact_hero_headline_1: "Get in touch",
    contact_hero_headline_2: "and start your AI journey",
    contact_hero_subheadline: "Fill out the form, send us a message, or schedule a free consultation right away. We respond within 24 hours.",

    // Contact Form
    contact_form_title: "Send us a message",
    contact_form_desc: "Fill out the form and we'll get back to you as soon as possible.",
    contact_form_name: "Full name",
    contact_form_name_placeholder: "John Smith",
    contact_form_email: "Email",
    contact_form_email_placeholder: "john@company.com",
    contact_form_phone: "Phone",
    contact_form_phone_placeholder: "+1 xxx xxx xxxx",
    contact_form_website: "Website",
    contact_form_website_placeholder: "https://yourcompany.com",
    contact_form_service: "Which service are you interested in?",
    contact_form_service_placeholder: "Select a service...",
    contact_form_service_audit: "AI Audit",
    contact_form_service_chatbot: "AI Chatbot",
    contact_form_service_voicebot: "AI Voicebot",
    contact_form_service_agent: "AI Agent",
    contact_form_service_automation: "Process Automation",
    contact_form_service_dev: "App Development",
    contact_form_service_web: "Web Design",
    contact_form_service_consult: "AI Consultation",
    contact_form_service_dataprep: "Data Preparation (RAGus.ai)",
    contact_form_service_other: "Other",
    contact_form_budget_onetime: "One-time budget",
    contact_form_budget_onetime_placeholder: "Select a range...",
    contact_form_budget_onetime_1: "Under $2,000",
    contact_form_budget_onetime_2: "$2,000 – $6,000",
    contact_form_budget_onetime_3: "$6,000 – $20,000",
    contact_form_budget_onetime_4: "$20,000+",
    contact_form_budget_onetime_unsure: "Not sure yet",
    contact_form_budget_monthly: "Monthly budget",
    contact_form_budget_monthly_placeholder: "Select a range...",
    contact_form_budget_monthly_1: "Under $400",
    contact_form_budget_monthly_2: "$400 – $1,200",
    contact_form_budget_monthly_3: "$1,200 – $4,000",
    contact_form_budget_monthly_4: "$4,000+",
    contact_form_budget_monthly_unsure: "Not sure yet",
    contact_form_message: "Your message",
    contact_form_message_placeholder: "Describe your project or question...",
    contact_form_submit: "Send message",
    contact_form_submitting: "Sending...",
    contact_form_success_title: "Message sent!",
    contact_form_success_desc: "Thank you for your message. We'll get back to you as soon as possible, usually within 24 hours.",
    contact_form_send_another: "Send another message",
    contact_form_back_home: "Back to homepage",
    contact_form_error: "Something went wrong. Please try again or contact us directly.",
    contact_form_required: "Required field",

    // Contact Info
    contact_info_title: "Contact information",
    contact_info_subtitle: "Prefer direct contact? Send us an email or give us a call.",

    // Contact Calendar
    contact_calendar_title: "Schedule a consultation",
    contact_calendar_desc: "Pick a time that works for you. 30 minutes online, no commitment.",

    // Contact Alt
    contact_alt: "Prefer direct contact?",

    // FAQ Section
    faq_label: "COMMON QUESTIONS",
    faq_headline: "You're asking",
    faq_1_q: "What if we don't have an IT specialist?",
    faq_1_a: "We design solutions to work even without technical experts. What matters is properly setting up processes and tools – and that's exactly what we'll handle for you.",
    faq_2_q: "What if our team can't work with AI?",
    faq_2_a: "Training and ongoing adoption support are part of the collaboration. Employees learn directly on the job – on real tasks, not from theoretical materials.",
    faq_3_q: "How soon will we see results?",
    faq_3_a: "Typically within 2–4 weeks. We start with quick wins delivering immediate impact. We avoid lengthy analyses without tangible outputs.",
    faq_4_q: "What if we're not satisfied with results?",
    faq_4_a: "We have an active guarantee – if you don't see specific time savings and functional AI workflow within 30 days, we continue the next month at no extra charge.",
    faq_5_q: "How do you differ from other AI consultants?",
    faq_5_a: "We're the first Czech software company that successfully launched AI chatbots on regional government websites. We have real numbers – over 35,000 AI responses, 5 regions, proven ROI. We don't just do presentations, but practical implementation.",
    faq_6_q: "What is RAGus.ai?",
    faq_6_a: "RAGus.ai is our specialized RAG-as-a-Service platform designed for AI agencies, enterprise AI teams, RAG developers and no-code builders using Voiceflow, Botpress or similar tools. It offers enterprise-grade knowledge retrieval infrastructure with 99% accuracy.",

    // CTA Section
    cta_tag: "// CONTACT",
    cta_label: "START TODAY",
    cta_headline_1: "Ready to Start Your",
    cta_headline_2: "AI Transformation?",
    cta_subheadline: `Connect with ${site.name} and turn AI potential into your organization's competitive advantage.`,
    cta_trust_1: "No obligation",
    cta_trust_2: "30min consultation",
    cta_trust_3: "Based in CZ",

    // Calendar Widget
    cal_title: "Schedule a free consultation",
    cal_desc: "30-minute call with no obligation",
  },
};
