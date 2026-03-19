import type { Language } from './types';
import { site } from '../../config/site';

export interface AuditKeys {
  // Meta
  audit_meta_title: string;
  audit_meta_desc: string;

  // Hero
  audit_hero_badge: string;
  audit_hero_headline_1: string;
  audit_hero_headline_2: string;
  audit_hero_subheadline: string;
  audit_hero_stat_1: string;
  audit_hero_stat_2: string;
  audit_hero_stat_3: string;

  // Form
  audit_form_title: string;
  audit_form_desc: string;
  audit_form_website: string;
  audit_form_website_placeholder: string;
  audit_form_email: string;
  audit_form_email_placeholder: string;
  audit_form_company: string;
  audit_form_company_placeholder: string;
  audit_form_city: string;
  audit_form_city_placeholder: string;
  audit_form_company_size: string;
  audit_form_company_size_placeholder: string;
  audit_form_size_micro: string;
  audit_form_size_small: string;
  audit_form_size_medium: string;
  audit_form_size_large: string;
  audit_form_painpoint: string;
  audit_form_painpoint_placeholder: string;
  audit_form_painpoint_select_placeholder: string;
  audit_form_painpoint_option_new_customers: string;
  audit_form_painpoint_option_automating_outreach: string;
  audit_form_painpoint_option_inbound_leads: string;
  audit_form_painpoint_option_speed_to_lead: string;
  audit_form_painpoint_option_automating_communication: string;
  audit_form_painpoint_option_boring_admin: string;
  audit_form_painpoint_option_juggling_tools: string;
  audit_form_painpoint_option_integrating_ai: string;
  audit_form_painpoint_option_marketing_materials: string;
  audit_form_painpoint_option_social_media: string;
  audit_form_painpoint_option_other: string;
  audit_form_tools: string;
  audit_form_tools_other: string;
  audit_form_submit: string;
  audit_form_submitting: string;
  audit_form_success_title: string;
  audit_form_success_desc: string;
  audit_form_error: string;

  // Process
  audit_process_title: string;
  audit_process_subtitle: string;
  audit_process_step1_title: string;
  audit_process_step1_desc: string;
  audit_process_step2_title: string;
  audit_process_step2_desc: string;
  audit_process_step3_title: string;
  audit_process_step3_desc: string;
  audit_process_step4_title: string;
  audit_process_step4_desc: string;

  // Value
  audit_value_title: string;
  audit_value_subtitle: string;
  audit_value_1_title: string;
  audit_value_1_desc: string;
  audit_value_2_title: string;
  audit_value_2_desc: string;
  audit_value_3_title: string;
  audit_value_3_desc: string;
  audit_value_4_title: string;
  audit_value_4_desc: string;

  // Pricing
  audit_pricing_title: string;
  audit_pricing_subtitle: string;
  audit_pricing_preaudit_title: string;
  audit_pricing_preaudit_price: string;
  audit_pricing_preaudit_desc: string;
  audit_pricing_preaudit_f1: string;
  audit_pricing_preaudit_f2: string;
  audit_pricing_preaudit_f3: string;
  audit_pricing_preaudit_f4: string;
  audit_pricing_quickstrike_title: string;
  audit_pricing_quickstrike_price: string;
  audit_pricing_quickstrike_desc: string;
  audit_pricing_quickstrike_f1: string;
  audit_pricing_quickstrike_f2: string;
  audit_pricing_quickstrike_f3: string;
  audit_pricing_quickstrike_f4: string;
  audit_pricing_quickstrike_f5: string;
  audit_pricing_full_title: string;
  audit_pricing_full_price: string;
  audit_pricing_full_desc: string;
  audit_pricing_full_f1: string;
  audit_pricing_full_f2: string;
  audit_pricing_full_f3: string;
  audit_pricing_full_f4: string;
  audit_pricing_full_f5: string;
  audit_pricing_full_f6: string;

  // CTA
  audit_cta_title: string;
  audit_cta_desc: string;
  audit_cta_button: string;
}

export const auditTranslations: Record<Language, AuditKeys> = {
  cs: {
    // Meta
    audit_meta_title: `Bezplatný AI Audit pro firmy | ${site.name}`,
    audit_meta_desc: "Získejte bezplatný AI Audit vaší firmy do 5 minut. Ukážeme vám přesně, kde AI ušetří nejvíce času a peněz. Konkrétní doporučení pro automatizaci procesů.",

    // Hero
    audit_hero_badge: "Bezplatný AI Audit – Zjistěte možnosti AI",
    audit_hero_headline_1: "AI Audit zdarma",
    audit_hero_headline_2: "– Výsledky do 5 minut",
    audit_hero_subheadline: "Podíváme se na Vaše procesy a ukážeme Vám přesně, kde AI ušetří nejvíce času a peněz. Získejte konkrétní doporučení, co dává smysl automatizovat jako první.",
    audit_hero_stat_1: "Bez plánu 80 % AI projektů nikam nevede",
    audit_hero_stat_2: "Průměrná úspora přes 150 000 Kč měsíčně",
    audit_hero_stat_3: "Report máte v mailu do pár minut",

    // Form
    audit_form_title: "Předběžný audit zdarma<br /><span class='text-neutral-400 transition-colors hover:text-orange-400 duration-500'>do pár minut</span>",
    audit_form_desc: "Vyplňte krátký formulář a do pár minut Vám pošleme audit na míru pro Vaši firmu - ukážeme Vám, kde konkrétně Vám AI pomůže nejvíce.",
    audit_form_website: "Webová stránka",
    audit_form_website_placeholder: "https://vasefirma.cz",
    audit_form_email: "E-mail",
    audit_form_email_placeholder: "vas@email.cz",
    audit_form_company: "Název společnosti",
    audit_form_company_placeholder: "Vaše firma s.r.o.",
    audit_form_city: "Město",
    audit_form_city_placeholder: "Kde sídlíte?",
    audit_form_company_size: "Velikost firmy",
    audit_form_company_size_placeholder: "Kolik Vás ve firmě je?",
    audit_form_size_micro: "Mikro (1-10 lidí)",
    audit_form_size_small: "Malá (11-50 lidí)",
    audit_form_size_medium: "Střední (51-250 lidí)",
    audit_form_size_large: "Velká (250+ lidí)",
    audit_form_painpoint: "Co Vás nejvíce trápí ve firmě?",
    audit_form_painpoint_placeholder: "Popište nám, co Vás nejvíce brzdí nebo kde trávíte zbytečně moc času manuální prací...",
    audit_form_painpoint_select_placeholder: "Vyberte z možností...",
    audit_form_painpoint_option_new_customers: "Získávání nových zákazníků",
    audit_form_painpoint_option_automating_outreach: "Automatizace oslovování",
    audit_form_painpoint_option_inbound_leads: "Příchozí poptávky a leady",
    audit_form_painpoint_option_speed_to_lead: "Rychlost reakce na poptávky",
    audit_form_painpoint_option_automating_communication: "Automatizace komunikace",
    audit_form_painpoint_option_boring_admin: "Nudná administrativa",
    audit_form_painpoint_option_juggling_tools: "Přepínání mezi mnoha nástroji",
    audit_form_painpoint_option_integrating_ai: "Integrace AI do CRM/ERP/aplikace",
    audit_form_painpoint_option_marketing_materials: "Tvorba marketingových materiálů",
    audit_form_painpoint_option_social_media: "Postování na sociální sítě",
    audit_form_painpoint_option_other: "Jiné...",
    audit_form_tools: "Jaké nástroje denně používáte? (volitelné)",
    audit_form_tools_other: "Něco jiného?",
    audit_form_submit: "Chci zjistit možnosti AI →",
    audit_form_submitting: "Připravujeme Váš předběžný audit...",
    audit_form_success_title: "Hotovo! Podívejte se do mailu.",
    audit_form_success_desc: "Váš audit je hotový. Najdete v něm konkrétní příležitosti a doporučení přímo pro Vaši firmu, jak začít využívat AI efektivně.",
    audit_form_error: "Něco se nepovedlo. Zkuste to prosím znovu.",

    // Process
    audit_process_title: "Jak vypadá cesta k efektivní firmě",
    audit_process_subtitle: "Provedeme Vás celou AI transformací od prvního reportu až po fungující řešení",
    audit_process_step1_title: "Předběžný audit",
    audit_process_step1_desc: "Projdeme Váš web a obor podnikání. Do 5 minut máte v ruce první seznam míst, kde Vám AI přinese největší užitek.",
    audit_process_step2_title: "Osobní konzultace",
    audit_process_step2_desc: "Probereme spolu výsledky auditu. Řekneme Vám na rovinu, co dává smysl řešit hned a kde by to byly vyhozené peníze.",
    audit_process_step3_title: "Hloubkový audit",
    audit_process_step3_desc: "Ponoříme se přímo do Vašich procesů. Zmapujeme, jak pracují Vaši lidé, a spočítáme, kolik Vám AI reálně ušetří času a peněz.",
    audit_process_step4_title: "Realizace a výsledky",
    audit_process_step4_desc: "Vytvoříme Vám detailní plán na 12 měsíců. AI nasadíme tak, aby Váš byznys běžel automaticky jako hodinky a investice se Vám co nejrychleji vrátila.",

    // Value
    audit_value_title: "Co přesně od nás dostanete",
    audit_value_subtitle: "Žádné teoretické poučky. Jen praktické kroky, jak AI zapojit do Vašeho podnikání.",
    audit_value_1_title: "Mapu příležitostí",
    audit_value_1_desc: "Najdeme ve Vaší firmě všechna místa, kde se práce zasekává nebo se zbytečně opakuje to samé dokola.",
    audit_value_2_title: "Jasné priority",
    audit_value_2_desc: "Ukážeme Vám, co vyřešit hned a co může počkat. U každé věci uvidíte přínos i to, jak náročné bude ji zavést.",
    audit_value_3_title: "Výpočet návratnosti",
    audit_value_3_desc: "Dostanete od nás konkrétní čísla. Budete přesně vědět, kolik ušetříte a jak rychle se Vám investice do AI zaplatí.",
    audit_value_4_title: "Plán implementace",
    audit_value_4_desc: "Navrhneme Vám cestu od A do Z. Budete vědět, jaké nástroje vybrat a jak je propojit s tím, co už ve firmě používáte.",

    // Pricing
    audit_pricing_title: "Cena za Vaši AI transformaci",
    audit_pricing_subtitle: "Začněte zdarma a pokračujte tempem, které Vám vyhovuje",
    audit_pricing_preaudit_title: "Předběžný audit",
    audit_pricing_preaudit_price: "ZDARMA",
    audit_pricing_preaudit_desc: "První vhled do možností AI ve Vaší firmě",
    audit_pricing_preaudit_f1: "Analýza webu a oboru",
    audit_pricing_preaudit_f2: "5 tipů na zapojení AI",
    audit_pricing_preaudit_f3: "Orientační kalkulace úspor",
    audit_pricing_preaudit_f4: "Report do 5 minut v mailu",
    audit_pricing_quickstrike_title: "Hloubkový audit",
    audit_pricing_quickstrike_price: "od 25 000 Kč",
    audit_pricing_quickstrike_desc: "Detailní zmapování jednoho klíčového procesu",
    audit_pricing_quickstrike_f1: "Workshop s Vašimi lidmi",
    audit_pricing_quickstrike_f2: "Analýza dat a systémů",
    audit_pricing_quickstrike_f3: "Přesný technický návrh",
    audit_pricing_quickstrike_f4: "Garantovaný výpočet ROI",
    audit_pricing_quickstrike_f5: "Hotovo do 14 dnů",
    audit_pricing_full_title: "Kompletní transformace",
    audit_pricing_full_price: "Individuálně",
    audit_pricing_full_desc: "AI partner pro celou Vaši organizaci",
    audit_pricing_full_f1: "Audit všech oddělení",
    audit_pricing_full_f2: "Strategický plán na 12 měsíců",
    audit_pricing_full_f3: "Vývoj řešení na míru",
    audit_pricing_full_f4: "Školení celého týmu",
    audit_pricing_full_f5: "Průběžná podpora a údržba",
    audit_pricing_full_f6: "Maximální možná efektivita",

    // CTA
    audit_cta_title: "Chcete vědět, kde přesně začít?",
    audit_cta_desc: "Rádi se s Vámi potkáme na osobní schůzce klidně u Vás na firmě. Probereme Váš audit a navrhneme první kroky, které Vám dají největší smysl.",
    audit_cta_button: "Domluvit schůzku zdarma",
  },
  en: {
    // Meta
    audit_meta_title: `Free AI Audit for Businesses | ${site.name}`,
    audit_meta_desc: "Get a free AI Audit of your company in 5 minutes. We'll show you exactly where AI saves the most time and money. Specific recommendations for process automation.",

    // Hero
    audit_hero_badge: "Free AI Audit – Discover AI possibilities",
    audit_hero_headline_1: "Free AI Audit",
    audit_hero_headline_2: "– Results in 5 minutes",
    audit_hero_subheadline: "We'll analyze your processes and show you exactly where AI saves the most time and money. Get specific recommendations on what makes sense to automate first.",
    audit_hero_stat_1: "Without a plan, 80% of AI projects lead nowhere",
    audit_hero_stat_2: "Average savings over $6,000 per month",
    audit_hero_stat_3: "Report in your inbox within minutes",

    // Form
    audit_form_title: "Free Preliminary Audit<br /><span class='text-neutral-400 transition-colors hover:text-orange-400 duration-500'>within minutes</span>",
    audit_form_desc: "Fill out a short form and within minutes we'll send you a tailored audit for your company - we'll show you where AI will help you the most.",
    audit_form_website: "Website",
    audit_form_website_placeholder: "https://yourcompany.com",
    audit_form_email: "Email",
    audit_form_email_placeholder: "your@email.com",
    audit_form_company: "Company Name",
    audit_form_company_placeholder: "Your Company Ltd.",
    audit_form_city: "City",
    audit_form_city_placeholder: "Where are you based?",
    audit_form_company_size: "Company Size",
    audit_form_company_size_placeholder: "How many of you are in the company?",
    audit_form_size_micro: "Micro (1-10 people)",
    audit_form_size_small: "Small (11-50 people)",
    audit_form_size_medium: "Medium (51-250 people)",
    audit_form_size_large: "Large (250+ people)",
    audit_form_painpoint: "What's your biggest business challenge?",
    audit_form_painpoint_placeholder: "Tell us what holds you back the most or where you spend too much time on manual work...",
    audit_form_painpoint_select_placeholder: "Select an option...",
    audit_form_painpoint_option_new_customers: "Gaining new customers",
    audit_form_painpoint_option_automating_outreach: "Automating outreach",
    audit_form_painpoint_option_inbound_leads: "Inbound leads",
    audit_form_painpoint_option_speed_to_lead: "Speed to lead",
    audit_form_painpoint_option_automating_communication: "Automating communication",
    audit_form_painpoint_option_boring_admin: "Boring administrative work",
    audit_form_painpoint_option_juggling_tools: "Juggling between many software tools",
    audit_form_painpoint_option_integrating_ai: "Integrating AI into CRM/ERP/app",
    audit_form_painpoint_option_marketing_materials: "Creating marketing materials",
    audit_form_painpoint_option_social_media: "Posting on social media",
    audit_form_painpoint_option_other: "Other...",
    audit_form_tools: "What tools do you use daily? (optional)",
    audit_form_tools_other: "Anything else?",
    audit_form_submit: "Find out AI possibilities →",
    audit_form_submitting: "Preparing your preliminary audit...",
    audit_form_success_title: "Done! Check your email.",
    audit_form_success_desc: "Your audit is ready. You'll find specific opportunities and recommendations directly for your company on how to start using AI effectively.",
    audit_form_error: "Something went wrong. Please try again.",

    // Process
    audit_process_title: "The path to an efficient company",
    audit_process_subtitle: "We'll guide you through the entire AI transformation from the first report to a working solution",
    audit_process_step1_title: "Preliminary Audit",
    audit_process_step1_desc: "We'll review your website and business sector. Within 5 minutes, you'll have the first list of areas where AI brings the most benefit.",
    audit_process_step2_title: "Personal Consultation",
    audit_process_step2_desc: "We'll discuss the audit results together. We'll tell you straight what makes sense to solve first and where it would be a waste of money.",
    audit_process_step3_title: "Deep Analysis",
    audit_process_step3_desc: "We'll dive directly into your processes. We'll map how your people work and calculate exactly how much time and money AI will save you.",
    audit_process_step4_title: "Implementation & Results",
    audit_process_step4_desc: "We'll create a detailed 12-month plan. We'll deploy AI so your business runs like clockwork and your investment pays off as quickly as possible.",

    // Value
    audit_value_title: "Exactly what you get from us",
    audit_value_subtitle: "No theoretical lessons. Only practical steps on how to integrate AI into your business.",
    audit_value_1_title: "Opportunity Map",
    audit_value_1_desc: "We'll find all the places in your company where work gets stuck or the same thing is unnecessarily repeated over and over.",
    audit_value_2_title: "Clear Priorities",
    audit_value_2_desc: "We'll show you what to solve now and what can wait. For each item, you'll see the benefit and how difficult it will be to implement.",
    audit_value_3_title: "ROI Calculation",
    audit_value_3_desc: "You'll get specific numbers from us. You'll know exactly how much you'll save and how quickly your AI investment will pay off.",
    audit_value_4_title: "Implementation Plan",
    audit_value_4_desc: "We'll design a path from A to Z. You'll know which tools to choose and how to connect them with what you already use in the company.",

    // Pricing
    audit_pricing_title: "Pricing for Your AI Transformation",
    audit_pricing_subtitle: "Start for free and continue at a pace that suits you",
    audit_pricing_preaudit_title: "Preliminary Audit",
    audit_pricing_preaudit_price: "FREE",
    audit_pricing_preaudit_desc: "First insight into AI possibilities in your company",
    audit_pricing_preaudit_f1: "Website and industry analysis",
    audit_pricing_preaudit_f2: "5 tips for AI integration",
    audit_pricing_preaudit_f3: "Estimated savings calculation",
    audit_pricing_preaudit_f4: "Report in your inbox within 5 mins",
    audit_pricing_quickstrike_title: "Deep Audit",
    audit_pricing_quickstrike_price: "from $1,000",
    audit_pricing_quickstrike_desc: "Detailed mapping of one key process",
    audit_pricing_quickstrike_f1: "Workshop with your team",
    audit_pricing_quickstrike_f2: "Data and systems analysis",
    audit_pricing_quickstrike_f3: "Precise technical design",
    audit_pricing_quickstrike_f4: "Guaranteed ROI calculation",
    audit_pricing_quickstrike_f5: "Done within 14 days",
    audit_pricing_full_title: "Full Transformation",
    audit_pricing_full_price: "Custom",
    audit_pricing_full_desc: "AI partner for your entire organization",
    audit_pricing_full_f1: "Audit of all departments",
    audit_pricing_full_f2: "12-month strategic plan",
    audit_pricing_full_f3: "Custom solution development",
    audit_pricing_full_f4: "Team-wide training",
    audit_pricing_full_f5: "Ongoing support & maintenance",
    audit_pricing_full_f6: "Maximum possible efficiency",

    // CTA
    audit_cta_title: "Want to know exactly where to start?",
    audit_cta_desc: "We'd be happy to meet with you in person at your company. We'll discuss your audit and suggest the first steps that make the most sense for you.",
    audit_cta_button: "Book a free meeting",
  },
};
