import type { Language } from './types';

export interface SurveyKeys {
  // Meta
  survey_meta_title: string;
  survey_meta_desc: string;

  // Hero
  survey_hero_badge: string;
  survey_hero_headline_1: string;
  survey_hero_headline_2: string;
  survey_hero_subheadline: string;
  survey_hero_event_date: string;

  // Form header
  survey_form_title: string;
  survey_form_desc: string;
  survey_form_personalization_note: string;
  survey_form_industry_other_placeholder: string;
  survey_form_industry_other_required: string;
  survey_form_required: string;

  // Industry dropdown
  survey_form_industry: string;
  survey_form_industry_placeholder: string;
  survey_industry_ecommerce: string;
  survey_industry_retail: string;
  survey_industry_manufacturing: string;
  survey_industry_professional_svcs: string;
  survey_industry_real_estate: string;
  survey_industry_hospitality: string;
  survey_industry_healthcare: string;
  survey_industry_education: string;
  survey_industry_construction: string;
  survey_industry_logistics: string;
  survey_industry_finance: string;
  survey_industry_marketing_agency: string;
  survey_industry_it_tech: string;
  survey_industry_other: string;

  // Company size
  survey_form_company_size: string;
  survey_size_solo: string;
  survey_size_micro: string;
  survey_size_small: string;
  survey_size_medium: string;
  survey_size_large: string;

  // Pain points checkbox group
  survey_form_pain_points: string;
  survey_form_pain_points_desc: string;
  survey_pain_new_customers: string;
  survey_pain_speed_to_lead: string;
  survey_pain_automating_communication: string;
  survey_pain_customer_support: string;
  survey_pain_boring_admin: string;
  survey_pain_reporting_data: string;
  survey_pain_juggling_tools: string;
  survey_pain_integrating_ai: string;
  survey_pain_marketing_materials: string;
  survey_pain_content_creation: string;
  survey_pain_invoicing: string;
  survey_pain_scheduling: string;
  survey_pain_other: string;
  survey_form_pain_other_placeholder: string;
  survey_pain_manual_data_entry: string;
  survey_pain_document_processing: string;
  survey_pain_employee_onboarding: string;
  survey_pain_knowledge_silos: string;
  survey_pain_delegation: string;

  // Primary pain point
  survey_form_primary_pain_point: string;
  survey_form_primary_pain_point_desc: string;

  // AI maturity
  survey_form_ai_maturity: string;
  survey_ai_none: string;
  survey_ai_experimenting: string;
  survey_ai_active: string;

  // Hours lost per week
  survey_form_hours_lost: string;
  survey_form_hours_lost_desc: string;
  survey_hours_1_5: string;
  survey_hours_5_10: string;
  survey_hours_10_20: string;
  survey_hours_20_40: string;
  survey_hours_40_plus: string;

  // Context note
  survey_form_context_note: string;
  survey_form_context_note_placeholder: string;

  // Contact fields
  survey_form_email: string;
  survey_form_email_placeholder: string;
  survey_form_email_helper: string;
  survey_form_company_name: string;
  survey_form_company_name_placeholder: string;
  survey_form_city: string;
  survey_form_city_placeholder: string;
  survey_form_city_helper: string;
  survey_form_phone: string;
  survey_form_phone_placeholder: string;
  survey_form_phone_helper: string;
  survey_form_optional_label: string;

  // Website field
  survey_form_website: string;
  survey_form_website_placeholder: string;
  survey_form_website_helper: string;

  // Tools chip keys
  survey_form_tools_used: string;
  survey_form_tools_option_chatgpt: string;
  survey_form_tools_option_automation: string;
  survey_form_tools_option_crm: string;
  survey_form_tools_option_pm: string;
  survey_form_tools_option_office: string;
  survey_form_tools_option_accounting: string;
  survey_form_tools_option_custom: string;
  survey_form_tools_option_none: string;

  // Block D — Role
  survey_form_role: string;
  survey_role_owner_ceo: string;
  survey_role_sales_manager: string;
  survey_role_ops_manager: string;
  survey_role_it_lead: string;
  survey_role_employee: string;
  survey_role_other: string;

  // Block D — CRM
  survey_form_crm_used: string;
  survey_crm_none: string;
  survey_crm_excel: string;
  survey_crm_hubspot_pipedrive: string;
  survey_crm_salesforce: string;
  survey_crm_raynet: string;
  survey_crm_custom_other: string;

  // Block D — ERP
  survey_form_erp_used: string;
  survey_erp_none: string;
  survey_erp_pohoda: string;
  survey_erp_abra_helios: string;
  survey_erp_sap: string;
  survey_erp_money_s3: string;
  survey_erp_custom_other: string;

  // Block D — Tech level
  survey_form_tech_level: string;

  // Block D — Tech openness
  survey_form_tech_openness: string;
  survey_tech_conservative: string;
  survey_tech_open: string;
  survey_tech_innovator: string;

  // Block E — Top examples
  survey_form_top_examples: string;
  survey_form_top_examples_hint: string;

  // Button states
  survey_form_submit: string;
  survey_form_submitting: string;
  survey_form_privacy: string;

  // Success state
  survey_form_success_title: string;
  survey_form_success_desc: string;
  survey_form_success_cta: string;
  survey_form_success_cta_url: string;
  survey_success_speaker_heading: string;
  survey_success_speaker_name: string;
  survey_success_speaker_title: string;
  survey_success_speaker_bio: string;
  survey_success_speaker_booking_cta: string;
  survey_success_event_date: string;

  // Error states
  survey_form_error_generic: string;
  survey_form_validation_required: string;
  survey_form_validation_email: string;
  survey_form_validation_select_one: string;

  // Discovery value strip
  survey_form_value_strip_1: string;
  survey_form_value_strip_2: string;
  survey_form_value_strip_3: string;

  // Micro-descriptions for pain points
  survey_micro_boring_admin: string;
  survey_micro_manual_data_entry: string;
  survey_micro_document_processing: string;
  survey_micro_speed_to_lead: string;
  survey_micro_customer_support: string;
  survey_micro_new_customers: string;
  survey_micro_reporting_data: string;
  survey_micro_invoicing: string;
  survey_micro_scheduling: string;
  survey_micro_marketing_materials: string;
  survey_micro_content_creation: string;
  survey_micro_juggling_tools: string;
  survey_micro_integrating_ai: string;
  survey_micro_automating_communication: string;
  survey_micro_employee_onboarding: string;
  survey_micro_knowledge_silos: string;
  survey_micro_delegation: string;
}

export const surveyTranslations: Record<Language, SurveyKeys> = {
  cs: {
    // Meta
    survey_meta_title: "Growth Club: AI ve firmě | AI Audit",
    survey_meta_desc: "Rezervujte si místo na Growth Club — AI ve firmě: Implementace v praxi & podnikatelský networking. 28. března 2026.",

    // Hero
    survey_hero_badge: "Growth Club · 28.03.",
    survey_hero_headline_1: "AI ve firmě:",
    survey_hero_headline_2: "Implementace v praxi",
    survey_hero_subheadline: "& podnikatelský networking",
    survey_hero_event_date: "28. 3. 2026",

    // Form header
    survey_form_title: "Vyplňte formulář a rezervujte si místo na Growth Club AI event (28.03. 15:00 – 19:00)",
    survey_form_desc: "Uvidíte, jak AI nahradí práci, za kterou dnes platíte zaměstnancům. Ukážeme Vám konkrétní příklady z různých oborů — které procesy jdou automatizovat a kolik času a peněz ušetříte. Na základě Vašich odpovědí připravíme ukázky přesně pro Váš byznys.",
    survey_form_personalization_note: "Podle Vašich odpovědí připravíme program na míru — uvidíte konkrétní příklady pro Váš obor a Vaše výzvy, ne jen obecné řeči.",
    survey_form_industry_other_placeholder: "Upřesněte Váš obor...",
    survey_form_industry_other_required: "Upřesněte prosím Váš obor",
    survey_form_required: "Povinné pole",

    // Industry dropdown
    survey_form_industry: "V jakém oboru podnikáte?",
    survey_form_industry_placeholder: "Vyberte obor",
    survey_industry_ecommerce: "E-commerce a online prodej",
    survey_industry_retail: "Kamenný obchod a maloobchod",
    survey_industry_manufacturing: "Výroba a průmysl",
    survey_industry_professional_svcs: "Poradenství a profesní služby",
    survey_industry_real_estate: "Reality a správa nemovitostí",
    survey_industry_hospitality: "Pohostinství a cestovní ruch",
    survey_industry_healthcare: "Zdravotnictví a wellness",
    survey_industry_education: "Vzdělávání a koučink",
    survey_industry_construction: "Stavebnictví a řemesla",
    survey_industry_logistics: "Doprava a logistika",
    survey_industry_finance: "Finance a účetnictví",
    survey_industry_marketing_agency: "Marketing a reklama",
    survey_industry_it_tech: "IT a technologie",
    survey_industry_other: "Jiné",

    // Company size
    survey_form_company_size: "Kolik má Vaše firma zaměstnanců?",
    survey_size_solo: "Pouze já",
    survey_size_micro: "2–10",
    survey_size_small: "11–50",
    survey_size_medium: "51–250",
    survey_size_large: "250+",

    // Pain points checkbox group
    survey_form_pain_points: "Co Vám ve firmě krade čas nebo peníze?",
    survey_form_pain_points_desc: "Vyberte aspoň jednu věc — AI toho zvládne víc, než byste čekali",
    survey_pain_new_customers: "Shánění nových zákazníků — stojí to čas i lidi",
    survey_pain_speed_to_lead: "Pomalé odpovídání na poptávky — zákazník nečeká",
    survey_pain_automating_communication: "Ruční posílání e-mailů a follow-upů zákazníkům",
    survey_pain_customer_support: "Lidi v týmu pořád dokola řeší stejné dotazy",
    survey_pain_boring_admin: "Administrativa, co by zvládl i stroj — ale dělají ji lidi",
    survey_pain_reporting_data: "Ruční skládání reportů a práce s daty",
    survey_pain_juggling_tools: "Moc nástrojů, co spolu nekomunikují",
    survey_pain_integrating_ai: "Nevíme, jak AI zapojit do toho, co už používáme",
    survey_pain_marketing_materials: "Tvorba marketingových materiálů zabere moc času",
    survey_pain_content_creation: "Na sociální sítě nemáme čas ani lidi",
    survey_pain_invoicing: "Fakturace a účetnictví — pořád ručně",
    survey_pain_scheduling: "Domlouvání schůzek — nekonečné přepisování e-mailů",
    survey_pain_other: "Jiné",
    survey_form_pain_other_placeholder: "Popište, co Vás trápí...",
    survey_pain_manual_data_entry: "Přepisování dat ručně — z mailu do tabulky, z tabulky do systému",
    survey_pain_document_processing: "Ruční zpracování faktur a dokumentů",
    survey_pain_employee_onboarding: 'Zaučování nových lidí zabere týdny a stojí čas celého týmu',
    survey_pain_knowledge_silos: 'Všechno ví jeden člověk — když chybí, firma stojí',
    survey_pain_delegation: 'Nejde delegovat — lidi potřebují neustálé instrukce',

    // Primary pain point
    survey_form_primary_pain_point: "Co Vás trápí nejvíc? Tohle chcete na eventu vyřešit:",
    survey_form_primary_pain_point_desc: "Na to připravíme ukázku přímo pro Vás",

    // AI maturity
    survey_form_ai_maturity: "Jaké máte zkušenosti s AI?",
    survey_ai_none: "Zatím AI vůbec nepoužíváme",
    survey_ai_experimenting: "Něco jsme zkoušeli, ale zatím nic systematicky",
    survey_ai_active: "AI už aktivně používáme v práci",

    // Hours lost per week
    survey_form_hours_lost: "Kolik hodin týdně na to vyhodíte?",
    survey_form_hours_lost_desc: "Tipněte si, kolik času Vás stojí řešení těchto věcí",
    survey_hours_1_5: "1–5 hodin",
    survey_hours_5_10: "5–10 hodin",
    survey_hours_10_20: "10–20 hodin",
    survey_hours_20_40: "20–40 hodin",
    survey_hours_40_plus: "40+ hodin",

    // Context note
    survey_form_context_note: "Chcete nám k tomu ještě něco říct?",
    survey_form_context_note_placeholder: "Např. s čím se teď ve firmě nejvíc perete, nebo co od eventu čekáte...",

    // Contact fields
    survey_form_email: "Váš e-mail",
    survey_form_email_placeholder: "vas@email.cz",
    survey_form_email_helper: "Sem Vám pošleme potvrzení",
    survey_form_company_name: "Název firmy",
    survey_form_company_name_placeholder: "Název Vaší firmy",
    survey_form_city: "Město",
    survey_form_city_placeholder: "Vaše město",
    survey_form_city_helper: "Abychom přizpůsobili obsah Vašemu regionu (nepovinné)",
    survey_form_phone: "Telefonní číslo",
    survey_form_phone_placeholder: "+420 xxx xxx xxx",
    survey_form_phone_helper: "Kdyby bylo potřeba se s Vámi domluvit (nepovinné)",
    survey_form_optional_label: "(nepovinné)",

    // Website field
    survey_form_website: "Webová stránka firmy",
    survey_form_website_placeholder: "https://vase-firma.cz",
    survey_form_website_helper: "",

    // Tools chip keys
    survey_form_tools_used: "Jaké AI nástroje teď používáte?",
    survey_form_tools_option_chatgpt: "ChatGPT / Claude / Gemini",
    survey_form_tools_option_automation: "Make / n8n / Zapier",
    survey_form_tools_option_crm: "HubSpot / Pipedrive",
    survey_form_tools_option_pm: "Monday / Asana / Notion",
    survey_form_tools_option_office: "Google Workspace / M365",
    survey_form_tools_option_accounting: "Pohoda / Money S3",
    survey_form_tools_option_custom: "Vlastní řešení / interní systémy",
    survey_form_tools_option_none: "Žádné",

    // Block D — Role
    survey_form_role: "Jaká je Vaše role ve firmě?",
    survey_role_owner_ceo: "Majitel / jednatel",
    survey_role_sales_manager: "Obchodní / sales manažer",
    survey_role_ops_manager: "Provozní manažer",
    survey_role_it_lead: "IT vedoucí",
    survey_role_employee: "Zaměstnanec",
    survey_role_other: "Jiná role",

    // Block D — CRM
    survey_form_crm_used: "Používáte CRM systém?",
    survey_crm_none: "Žádný",
    survey_crm_excel: "Excel / tabulky",
    survey_crm_hubspot_pipedrive: "HubSpot / Pipedrive",
    survey_crm_salesforce: "Salesforce",
    survey_crm_raynet: "Raynet",
    survey_crm_custom_other: "Vlastní / jiný",

    // Block D — ERP
    survey_form_erp_used: "Používáte ERP / účetní systém?",
    survey_erp_none: "Žádný",
    survey_erp_pohoda: "Pohoda",
    survey_erp_abra_helios: "ABRA / Helios",
    survey_erp_sap: "SAP",
    survey_erp_money_s3: "Money S3",
    survey_erp_custom_other: "Jiný",

    // Block D — Tech level
    survey_form_tech_level: "Jak jste na tom s technikou?",

    // Block D — Tech openness
    survey_form_tech_openness: "Jak se stavíte k novým technologiím?",
    survey_tech_conservative: "Opatrně — jedeme na jistotu, ověřené věci",
    survey_tech_open: "Otevřeně — rádi zkusíme něco nového",
    survey_tech_innovator: "Naplno — chceme být vždycky o krok napřed",

    // Block E — Top examples
    survey_form_top_examples: "Co Vás nejvíc zajímá? Vyberte 3 ukázky, které chcete vidět:",
    survey_form_top_examples_hint: "(max. 3)",

    // Button states
    survey_form_submit: "Odeslat a rezervovat místo →",
    survey_form_submitting: "Odesílám...",
    survey_form_privacy: "Odesláním souhlasíte se zpracováním údajů dle",

    // Success state
    survey_form_success_title: "Vaše místo je rezervováno!",
    survey_form_success_desc: "Těšíme se na Vás 28. března. Potvrzení jsme poslali na Váš e-mail.",
    survey_form_success_cta: "Zpět na hlavní stránku",
    survey_form_success_cta_url: "/",
    survey_success_speaker_heading: "O přednášejícím",
    survey_success_speaker_name: "Přednášející",
    survey_success_speaker_title: "AI konzultant",
    survey_success_speaker_bio: "Odborník na AI automatizaci a implementaci, který pomáhá firmám ušetřit čas a peníze. 30+ AI agentů v produkci s reálnými výsledky.",
    survey_success_speaker_booking_cta: "Zarezervovat konzultaci",
    survey_success_event_date: "28. března 2026",

    // Error states
    survey_form_error_generic: "Něco se pokazilo. Zkuste to prosím ještě jednou.",
    survey_form_validation_required: "Toto pole je povinné",
    survey_form_validation_email: "Zadejte platný e-mail",
    survey_form_validation_select_one: "Vyberte alespoň jednu možnost",

    // Discovery value strip
    survey_form_value_strip_1: 'Uvidíte, jak ušetřit za zaměstnance díky AI automatizaci',
    survey_form_value_strip_2: 'Ukážeme Vám řešení přesně pro Váš obor a Vaše výzvy',
    survey_form_value_strip_3: 'Odejdete s plánem, co nasadit hned zítra',

    // Micro-descriptions for pain points
    survey_micro_boring_admin: 'Na tohle nepotřebujete zaměstnance — AI to zvládne za Vás',
    survey_micro_manual_data_entry: 'Tohle dělá zbytečně člověk — AI to přepíše sama a bez chyb',
    survey_micro_document_processing: 'AI to vytáhne z faktury sama — žádné ruční přepisování',
    survey_micro_speed_to_lead: 'Zákazník čeká hodiny na odpověď — AI odpoví hned a Vy nepřijdete o obchod',
    survey_micro_customer_support: 'Vaši lidi řeší pořád to samé — AI to zvládne místo nich',
    survey_micro_new_customers: 'AI najde ty správné kontakty a osloví je za Vás — ušetříte za obchoďáka',
    survey_micro_reporting_data: 'AI složí report za pár sekund — nemusíte kvůli tomu platit dalšího člověka',
    survey_micro_invoicing: 'Systém to udělá sám — žádné ruční vystavování a zadávání',
    survey_micro_scheduling: 'AI dohodne termín za Vás — konec e-mailových ping-pongů',
    survey_micro_marketing_materials: 'AI to zvládne za hodinu místo celého dne — ušetříte čas i peníze za grafika',
    survey_micro_content_creation: 'AI vytvoří obsah za Vás — nemusíte kvůli tomu najímat správce sítí',
    survey_micro_juggling_tools: 'AI to propojí — konečně budete mít všechno na jednom místě',
    survey_micro_integrating_ai: 'Ukážeme Vám, jak AI napojit na to, co už používáte — žádné složitosti',
    survey_micro_automating_communication: 'AI pošle správný e-mail správnému člověku ve správný čas — bez Vašeho zásahu',
    survey_micro_employee_onboarding: 'AI zaučí nového člověka za Vás — ušetříte týdny práce celého týmu',
    survey_micro_knowledge_silos: 'AI uloží know-how a zpřístupní ho komukoliv — firma nepadne, když jeden člověk chybí',
    survey_micro_delegation: 'AI dá lidem jasné instrukce a ohlídá splnění — nemusíte to kontrolovat sami',
  },
  en: {
    // Meta
    survey_meta_title: "Growth Club: AI in Business | AI Audit",
    survey_meta_desc: "Reserve your spot at the exclusive Growth Club event — AI in Business: Implementation in Practice & Business Networking. March 28, 2026.",

    // Hero
    survey_hero_badge: "Growth Club · Mar 28",
    survey_hero_headline_1: "AI in Business:",
    survey_hero_headline_2: "Implementation in Practice",
    survey_hero_subheadline: "& Business Networking",
    survey_hero_event_date: "March 28, 2026",

    // Form header
    survey_form_title: "Fill out the form and reserve your spot at the Growth Club AI event (28.03. 15:00 – 19:00)",
    survey_form_desc: "Our AI expert will present practical examples of how AI automates business processes — from customer communication to admin work. Based on your answers, we'll tailor the program for your business.",
    survey_form_personalization_note: "Based on your answers, we will tailor the event content and program to deliver maximum value specifically for your business and a personalized experience.",
    survey_form_industry_other_placeholder: "Specify your industry...",
    survey_form_industry_other_required: "Please specify your industry",
    survey_form_required: "Required field",

    // Industry dropdown
    survey_form_industry: "What industry are you in?",
    survey_form_industry_placeholder: "Select industry",
    survey_industry_ecommerce: "E-commerce & online sales",
    survey_industry_retail: "Brick-and-mortar retail",
    survey_industry_manufacturing: "Manufacturing & industry",
    survey_industry_professional_svcs: "Consulting & professional services",
    survey_industry_real_estate: "Real estate & property management",
    survey_industry_hospitality: "Hospitality & tourism",
    survey_industry_healthcare: "Healthcare & wellness",
    survey_industry_education: "Education & coaching",
    survey_industry_construction: "Construction & trades",
    survey_industry_logistics: "Logistics & transport",
    survey_industry_finance: "Finance & accounting",
    survey_industry_marketing_agency: "Marketing & advertising",
    survey_industry_it_tech: "IT & technology",
    survey_industry_other: "Other",

    // Company size
    survey_form_company_size: "How many employees does your company have?",
    survey_size_solo: "Just me",
    survey_size_micro: "2–10",
    survey_size_small: "11–50",
    survey_size_medium: "51–250",
    survey_size_large: "250+",

    // Pain points checkbox group
    survey_form_pain_points: "What steals time or money in your business?",
    survey_form_pain_points_desc: "Select at least one option — AI can automate more than you think",
    survey_pain_new_customers: "Acquiring and qualifying new customers",
    survey_pain_speed_to_lead: "Slow response to inquiries",
    survey_pain_automating_communication: "Automating customer communication",
    survey_pain_customer_support: "Customer support & repetitive questions",
    survey_pain_boring_admin: "Repetitive admin work",
    survey_pain_reporting_data: "Manual reporting & data work",
    survey_pain_juggling_tools: "Too many disconnected tools",
    survey_pain_integrating_ai: "Integrating AI into existing workflows",
    survey_pain_marketing_materials: "Creating marketing materials",
    survey_pain_content_creation: "Social media & content creation",
    survey_pain_invoicing: "Invoicing and accounting tasks",
    survey_pain_scheduling: "Scheduling and meeting coordination",
    survey_pain_other: "Other",
    survey_form_pain_other_placeholder: "Describe your challenge...",
    survey_pain_manual_data_entry: "Manual data entry and re-typing",
    survey_pain_document_processing: "Processing documents and invoices",
    survey_pain_employee_onboarding: 'Onboarding and training new employees',
    survey_pain_knowledge_silos: 'Company depends on one key person — knowledge not documented',
    survey_pain_delegation: 'Difficult delegation — employees need constant instructions',

    // Primary pain point
    survey_form_primary_pain_point: "Which challenge do you want to see solved at the event?",
    survey_form_primary_pain_point_desc: "We will prepare a custom demo just for you",

    // AI maturity
    survey_form_ai_maturity: "What's your experience with AI?",
    survey_ai_none: "We don't use AI at all",
    survey_ai_experimenting: "We've tried some AI tools",
    survey_ai_active: "We actively use AI in our work",

    // Hours lost per week
    survey_form_hours_lost: "How many hours per week do these challenges cost you?",
    survey_form_hours_lost_desc: "Estimate total time spent dealing with selected issues",
    survey_hours_1_5: "1–5 hours",
    survey_hours_5_10: "5–10 hours",
    survey_hours_10_20: "10–20 hours",
    survey_hours_20_40: "20–40 hours",
    survey_hours_40_plus: "40+ hours",

    // Context note
    survey_form_context_note: "Is there anything else you'd like to share?",
    survey_form_context_note_placeholder: "E.g. specific challenges you're facing, or what you expect from the event...",

    // Contact fields
    survey_form_email: "Your email",
    survey_form_email_placeholder: "your@email.com",
    survey_form_email_helper: "Reservation confirmation will be sent to this email",
    survey_form_company_name: "Company name",
    survey_form_company_name_placeholder: "Your company name",
    survey_form_city: "City",
    survey_form_city_placeholder: "Your city",
    survey_form_city_helper: "For regional content customization (optional)",
    survey_form_phone: "Phone number",
    survey_form_phone_placeholder: "+420 xxx xxx xxx",
    survey_form_phone_helper: "For organizational contact purposes (optional)",
    survey_form_optional_label: "(optional)",

    // Website field
    survey_form_website: "Company website",
    survey_form_website_placeholder: "https://your-company.com",
    survey_form_website_helper: "",

    // Tools chip keys
    survey_form_tools_used: "What AI tools are you currently using?",
    survey_form_tools_option_chatgpt: "ChatGPT / Claude / Gemini",
    survey_form_tools_option_automation: "Make / n8n / Zapier",
    survey_form_tools_option_crm: "HubSpot / Pipedrive",
    survey_form_tools_option_pm: "Monday / Asana / Notion",
    survey_form_tools_option_office: "Google Workspace / M365",
    survey_form_tools_option_accounting: "Pohoda / Money S3",
    survey_form_tools_option_custom: "Custom solutions / internal systems",
    survey_form_tools_option_none: "None",

    // Block D — Role
    survey_form_role: "What is your role in the company?",
    survey_role_owner_ceo: "Owner / CEO",
    survey_role_sales_manager: "Sales manager",
    survey_role_ops_manager: "Operations manager",
    survey_role_it_lead: "IT lead",
    survey_role_employee: "Employee",
    survey_role_other: "Other role",

    // Block D — CRM
    survey_form_crm_used: "Do you use a CRM system?",
    survey_crm_none: "None",
    survey_crm_excel: "Excel / spreadsheets",
    survey_crm_hubspot_pipedrive: "HubSpot / Pipedrive",
    survey_crm_salesforce: "Salesforce",
    survey_crm_raynet: "Raynet",
    survey_crm_custom_other: "Custom / other",

    // Block D — ERP
    survey_form_erp_used: "Do you use an ERP / accounting system?",
    survey_erp_none: "None",
    survey_erp_pohoda: "Pohoda",
    survey_erp_abra_helios: "ABRA / Helios",
    survey_erp_sap: "SAP",
    survey_erp_money_s3: "Money S3",
    survey_erp_custom_other: "Other",

    // Block D — Tech level
    survey_form_tech_level: "How technically proficient are you?",

    // Block D — Tech openness
    survey_form_tech_openness: "How do you approach new technology?",
    survey_tech_conservative: "Conservative — we prefer proven technology",
    survey_tech_open: "Open — we like trying new things",
    survey_tech_innovator: "Innovative — we want to be first",

    // Block E — Top examples
    survey_form_top_examples: "Choose top 3 examples you'd most like to see at the event:",
    survey_form_top_examples_hint: "(select up to 3)",

    // Button states
    survey_form_submit: "Fill in and reserve a spot →",
    survey_form_submitting: "Submitting...",
    survey_form_privacy: "By submitting you agree to data processing per",

    // Success state
    survey_form_success_title: "Your spot is reserved!",
    survey_form_success_desc: "We look forward to seeing you on March 28. Confirmation has been sent to your email.",
    survey_form_success_cta: "Back to homepage",
    survey_form_success_cta_url: "/",
    survey_success_speaker_heading: "About the speaker",
    survey_success_speaker_name: "Speaker",
    survey_success_speaker_title: "AI Consultant",
    survey_success_speaker_bio: "AI automation and implementation expert helping businesses save time and money. 30+ AI agents in production with real-world results.",
    survey_success_speaker_booking_cta: "Book a consultation",
    survey_success_event_date: "March 28, 2026",

    // Error states
    survey_form_error_generic: "An error occurred while submitting. Please try again.",
    survey_form_validation_required: "This field is required",
    survey_form_validation_email: "Enter a valid email",
    survey_form_validation_select_one: "Select at least one option",

    // Discovery value strip
    survey_form_value_strip_1: 'Find out which processes in your company can be automated',
    survey_form_value_strip_2: 'See demos tailored to your industry and challenges',
    survey_form_value_strip_3: 'Leave with a concrete plan for what to implement first',

    // Micro-descriptions for pain points
    survey_micro_boring_admin: 'You manually copy data from emails into spreadsheets or systems',
    survey_micro_manual_data_entry: 'You type the same things in multiple places — email, spreadsheet, system',
    survey_micro_document_processing: 'You manually transcribe invoices or orders instead of automatic processing',
    survey_micro_speed_to_lead: 'Customers wait hours for a reply, even for simple questions',
    survey_micro_customer_support: 'Your team answers the same 10 questions every day',
    survey_micro_new_customers: 'You don\'t know which leads are worth reaching out to',
    survey_micro_reporting_data: 'You compile reports from data manually — takes hours every week',
    survey_micro_invoicing: 'You create and enter invoices manually instead of letting the system do it',
    survey_micro_scheduling: 'You ping people back and forth via email before agreeing on a time',
    survey_micro_marketing_materials: 'Every new flyer, website, or proposal takes a full day',
    survey_micro_content_creation: 'You don\'t know what to post, or don\'t have time — profiles sit idle',
    survey_micro_juggling_tools: 'You use 5+ apps but the data doesn\'t sync between them',
    survey_micro_integrating_ai: 'You\'ve tried ChatGPT but don\'t know how to plug it into real work',
    survey_micro_automating_communication: 'You send emails or follow-ups manually, even though they\'re always the same',
    survey_micro_employee_onboarding: 'New hires learn for weeks while others constantly train them',
    survey_micro_knowledge_silos: 'Key procedures exist only in one person\'s head — nowhere documented',
    survey_micro_delegation: 'You have to explain every task in detail instead of people following on their own',
  },
};
