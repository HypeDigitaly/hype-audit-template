import type { Language } from './types';

export interface PricingKeys {
  // Section 1 — AI Obchodní Tým
  pricing_s1_headline: string;
  pricing_s1_subheadline: string;
  pricing_s1_problem_title: string;
  pricing_s1_problem_text: string;
  pricing_s1_solution_title: string;
  pricing_s1_solution_text: string;
  pricing_s1_step1_title: string;
  pricing_s1_step1_text: string;
  pricing_s1_step2_title: string;
  pricing_s1_step2_text: string;
  pricing_s1_step3_title: string;
  pricing_s1_step3_text: string;
  pricing_s1_step4_title: string;
  pricing_s1_step4_text: string;
  pricing_s1_step5_title: string;
  pricing_s1_step5_text: string;

  // Section 2 — Calculator
  pricing_s2_headline: string;
  pricing_s2_subheadline: string;
  pricing_s2_preset_start: string;
  pricing_s2_preset_growth: string;
  pricing_s2_preset_scale: string;
  pricing_s2_preset_recommended: string;
  pricing_s2_slider_daily: string;
  pricing_s2_slider_domains: string;
  pricing_s2_slider_addresses: string;
  pricing_s2_slider_campaigns: string;
  pricing_s2_support_label: string;
  pricing_s2_support_basic: string;
  pricing_s2_support_basic_desc: string;
  pricing_s2_support_growth: string;
  pricing_s2_support_growth_desc: string;
  pricing_s2_support_scale: string;
  pricing_s2_support_scale_desc: string;
  pricing_s2_setup_fee: string;
  pricing_s2_monthly_fee: string;
  pricing_s2_total_3months: string;
  pricing_s2_monthly_companies: string;
  pricing_s2_companies_daily: string;
  pricing_s2_min_period: string;

  // Section 2 — What's Included
  pricing_s2_included_title: string;
  pricing_s2_included_setup_1: string;
  pricing_s2_included_setup_2: string;
  pricing_s2_included_setup_3: string;
  pricing_s2_included_setup_4: string;
  pricing_s2_included_setup_5: string;
  pricing_s2_included_setup_6: string;
  pricing_s2_included_setup_7: string;
  pricing_s2_included_monthly_1: string;
  pricing_s2_included_monthly_2: string;
  pricing_s2_included_monthly_3: string;
  pricing_s2_included_monthly_4: string;
  pricing_s2_included_monthly_5: string;
  pricing_s2_included_monthly_6: string;

  // Section 3 — Comparison
  pricing_s3_headline: string;
  pricing_s3_subheadline: string;
  pricing_s3_team_title: string;
  pricing_s3_team_reps: string;
  pricing_s3_team_cost_label: string;
  pricing_s3_hypelead_title: string;
  pricing_s3_savings: string;

  // Section 4 — Expected Results
  pricing_s4_headline: string;
  pricing_s4_subheadline: string;
  pricing_s4_scenario: string;
  pricing_s4_reply_rate: string;
  pricing_s4_replies_month: string;
  pricing_s4_leads_month: string;
  pricing_s4_cost_per_lead: string;
  pricing_s4_conservative: string;
  pricing_s4_standard: string;
  pricing_s4_optimistic: string;
  pricing_s4_na: string;
  pricing_s4_note: string;

  // Section 5 — Fast Response
  pricing_s5_headline: string;
  pricing_s5_text: string;
  pricing_s5_key_person: string;

  // Section 6 — GDPR
  pricing_s6_headline: string;
  pricing_s6_text: string;

  // Lead Capture Form
  pricing_form_headline: string;
  pricing_form_subheadline: string;
  pricing_form_name: string;
  pricing_form_email: string;
  pricing_form_company: string;
  pricing_form_consent: string;
  pricing_form_privacy_link: string;
  pricing_form_submit: string;
  pricing_form_loading: string;
  pricing_form_success: string;
  pricing_form_error: string;
  pricing_form_error_name: string;
  pricing_form_error_email: string;
  pricing_form_error_company: string;
  pricing_form_error_consent: string;
  pricing_cta_button: string;
}

export const pricingTranslations: Record<Language, PricingKeys> = {
  cs: {
    // Section 1 — AI Obchodní Tým
    pricing_s1_headline: "AI Obchodní Tým",
    pricing_s1_subheadline: "Proč najímat obchodní zástupce, když AI má vyšší ROI?",
    pricing_s1_problem_title: "Problém tradičního obchodu",
    pricing_s1_problem_text: "Jeden obchodní zástupce stojí 55 000–70 000 Kč měsíčně a reálně osloví pouze 20–30 firem. Většina B2B firem nemá žádný systematický proces pro aktivní vyhledávání nových zákazníků.",
    pricing_s1_solution_title: "Řešení: HypeLead.ai",
    pricing_s1_solution_text: "Automatizovaný systém, který denně oslovuje stovky relevantních firem personalizovanými nabídkami — bez nutnosti najímat obchodního zástupce.",
    pricing_s1_step1_title: "Najde firmy podle oboru",
    pricing_s1_step1_text: "Z veřejných rejstříků (ARES, Google Mapy, Živéfirmy.cz) i ze specializovaných oborových databází.",
    pricing_s1_step2_title: "Ověří v rejstříku",
    pricing_s1_step2_text: "Zjistí jednatele, sídlo, obor činnosti. Odfiltruje neaktivní firmy.",
    pricing_s1_step3_title: "Dohledá přímý e-mail",
    pricing_s1_step3_text: "Najde e-mail přímo na jednatele nebo nákupčího — neposílá na obecné adresy.",
    pricing_s1_step4_title: "Ověří platnost adresy",
    pricing_s1_step4_text: "Před odesláním zkontroluje, zda adresa existuje a je aktivní.",
    pricing_s1_step5_title: "Odešle personalizovaný e-mail",
    pricing_s1_step5_text: "Pomocí AI sestaví zprávu přizpůsobenou konkrétní firmě. Automaticky odešle 2–3 návazné zprávy.",

    // Section 2 — Calculator
    pricing_s2_headline: "Kalkulačka ceny",
    pricing_s2_subheadline: "Nastavte si parametry a zjistěte přesnou cenu",
    pricing_s2_preset_start: "Start",
    pricing_s2_preset_growth: "Growth",
    pricing_s2_preset_scale: "Scale",
    pricing_s2_preset_recommended: "Doporučujeme",
    pricing_s2_slider_daily: "Počet oslovených firem denně",
    pricing_s2_slider_domains: "Počet e-mailových domén",
    pricing_s2_slider_addresses: "Počet e-mailových adres",
    pricing_s2_slider_campaigns: "Počet e-mailových kampaní",
    pricing_s2_support_label: "Úroveň podpory",
    pricing_s2_support_basic: "Základní",
    pricing_s2_support_basic_desc: "Měsíční vyhodnocení",
    pricing_s2_support_growth: "Growth",
    pricing_s2_support_growth_desc: "Konzultace 1×14 dní + měsíční vyhodnocení",
    pricing_s2_support_scale: "Scale",
    pricing_s2_support_scale_desc: "Týdenní konzultace + rozšířené testování",
    pricing_s2_setup_fee: "Jednorázové nastavení",
    pricing_s2_monthly_fee: "Měsíční poplatek",
    pricing_s2_total_3months: "Celkem za 3 měsíce",
    pricing_s2_monthly_companies: "firem měsíčně",
    pricing_s2_companies_daily: "firem denně",
    pricing_s2_min_period: "Minimální doba spolupráce: 3 měsíce",

    // Section 2 — What's Included
    pricing_s2_included_title: "Co je v ceně",
    pricing_s2_included_setup_1: "Tvorba prodejní stránky",
    pricing_s2_included_setup_2: "Implementace lead magnetu",
    pricing_s2_included_setup_3: "Implementace CRM pro správu leadů",
    pricing_s2_included_setup_4: "Workshop: USP, cílové skupiny, klíčová slova",
    pricing_s2_included_setup_5: "Tvorba e-mailových kampaní",
    pricing_s2_included_setup_6: "Tvorba skriptu pro VSL (Video Sales Letter)",
    pricing_s2_included_setup_7: "Příprava databáze 2 000+ firem",
    pricing_s2_included_monthly_1: "Nastavení platformy HypeLead",
    pricing_s2_included_monthly_2: "Založení a správa kampaní",
    pricing_s2_included_monthly_3: "Zahřívání e-mailů (optimalizace proti spamu)",
    pricing_s2_included_monthly_4: "Zaškolení týmu",
    pricing_s2_included_monthly_5: "Konzultace a pravidelné vyhodnocení",
    pricing_s2_included_monthly_6: "Nastavení DNS, domén a e-mailových adres",

    // Section 3 — Comparison
    pricing_s3_headline: "Porovnání nákladů",
    pricing_s3_subheadline: "Kolik by vás stál obchodní tým se stejným výkonem?",
    pricing_s3_team_title: "Obchodní tým",
    pricing_s3_team_reps: "obchodních zástupců",
    pricing_s3_team_cost_label: "Měsíční náklad",
    pricing_s3_hypelead_title: "HypeLead.ai",
    pricing_s3_savings: "Úspora",

    // Section 4 — Expected Results
    pricing_s4_headline: "Očekávané výsledky",
    pricing_s4_subheadline: "Při různých mírách odpovědí",
    pricing_s4_scenario: "Scénář",
    pricing_s4_reply_rate: "Míra odpovědí",
    pricing_s4_replies_month: "Odpovědí / měsíc",
    pricing_s4_leads_month: "Zájemců / měsíc",
    pricing_s4_cost_per_lead: "Cena za zájemce",
    pricing_s4_conservative: "Konzervativní",
    pricing_s4_standard: "Standardní",
    pricing_s4_optimistic: "Optimistický",
    pricing_s4_na: "N/A",
    pricing_s4_note: "Zájemce = firma, která odpověděla s konkrétním dotazem nebo zájmem (přibližně třetina odpovědí).",

    // Section 5 — Fast Response
    pricing_s5_headline: "Důležitost rychlé reakce",
    pricing_s5_text: "Pokud firma, která projeví zájem, nedostane odpověď do 24 hodin, s vysokou pravděpodobností nakoupí jinde. Naší úlohou je přivádět nové poptávky — vaší úlohou je denně kontrolovat nové leady a proměnit je v zakázky.",
    pricing_s5_key_person: "Určete jednu zodpovědnou osobu, která bude platformu HypeLead.ai spravovat a reagovat na poptávky.",

    // Section 6 — GDPR
    pricing_s6_headline: "Soulad s GDPR",
    pricing_s6_text: "Pracujeme výhradně s veřejně dostupnými údaji z rejstříků a webů firem. Právním základem je oprávněný zájem (čl. 6 odst. 1 písm. f GDPR). Každý e-mail obsahuje možnost odhlášení. Součástí spolupráce je smlouva o zpracování osobních údajů. Data zůstávají v EU.",

    // Lead Capture Form
    pricing_form_headline: "Získejte cenovou nabídku zdarma",
    pricing_form_subheadline: "Vygenerujeme vám PDF nabídku a pošleme na e-mail",
    pricing_form_name: "Jméno a příjmení",
    pricing_form_email: "E-mail",
    pricing_form_company: "Název firmy",
    pricing_form_consent: "Souhlasím se zpracováním osobních údajů za účelem zaslání cenové nabídky a případné následné komunikace. Více v",
    pricing_form_privacy_link: "zásadách ochrany osobních údajů",
    pricing_form_submit: "Získat nabídku zdarma",
    pricing_form_loading: "Generuji nabídku...",
    pricing_form_success: "Nabídka byla odeslána na váš e-mail!",
    pricing_form_error: "Něco se pokazilo. Zkuste to prosím znovu.",
    pricing_form_error_name: "Vyplňte jméno",
    pricing_form_error_email: "Vyplňte platný e-mail",
    pricing_form_error_company: "Vyplňte název firmy",
    pricing_form_error_consent: "Musíte souhlasit se zpracováním údajů",
    pricing_cta_button: "Získat nabídku zdarma",
  },
  en: {
    // Section 1 — AI Sales Team
    pricing_s1_headline: "AI Sales Team",
    pricing_s1_subheadline: "Why hire sales reps when AI delivers higher ROI?",
    pricing_s1_problem_title: "The Problem with Traditional Sales",
    pricing_s1_problem_text: "One sales rep costs 55,000–70,000 CZK/month and realistically contacts only 20–30 companies. Most B2B companies lack any systematic process for actively finding new customers.",
    pricing_s1_solution_title: "Solution: HypeLead.ai",
    pricing_s1_solution_text: "An automated system that contacts hundreds of relevant companies daily with personalized offers — no need to hire a sales rep.",
    pricing_s1_step1_title: "Finds companies by industry",
    pricing_s1_step1_text: "From public registries (ARES, Google Maps, Živéfirmy.cz) and specialized industry databases.",
    pricing_s1_step2_title: "Verifies in registry",
    pricing_s1_step2_text: "Identifies directors, headquarters, business activities. Filters out inactive companies.",
    pricing_s1_step3_title: "Finds direct email",
    pricing_s1_step3_text: "Finds email directly for directors or buyers — never sends to generic addresses.",
    pricing_s1_step4_title: "Verifies email validity",
    pricing_s1_step4_text: "Checks whether the address exists and is active before sending.",
    pricing_s1_step5_title: "Sends personalized email",
    pricing_s1_step5_text: "Uses AI to compose a message tailored to each company. Automatically sends 2–3 follow-up messages.",

    // Section 2 — Calculator
    pricing_s2_headline: "Price Calculator",
    pricing_s2_subheadline: "Set your parameters and get an exact price",
    pricing_s2_preset_start: "Start",
    pricing_s2_preset_growth: "Growth",
    pricing_s2_preset_scale: "Scale",
    pricing_s2_preset_recommended: "Recommended",
    pricing_s2_slider_daily: "Companies contacted daily",
    pricing_s2_slider_domains: "Number of email domains",
    pricing_s2_slider_addresses: "Number of email addresses",
    pricing_s2_slider_campaigns: "Number of email campaigns",
    pricing_s2_support_label: "Support level",
    pricing_s2_support_basic: "Basic",
    pricing_s2_support_basic_desc: "Monthly evaluation",
    pricing_s2_support_growth: "Growth",
    pricing_s2_support_growth_desc: "Consultation every 2 weeks + monthly evaluation",
    pricing_s2_support_scale: "Scale",
    pricing_s2_support_scale_desc: "Weekly consultation + extended testing",
    pricing_s2_setup_fee: "One-time setup",
    pricing_s2_monthly_fee: "Monthly fee",
    pricing_s2_total_3months: "Total for 3 months",
    pricing_s2_monthly_companies: "companies monthly",
    pricing_s2_companies_daily: "companies daily",
    pricing_s2_min_period: "Minimum cooperation period: 3 months",

    // Section 2 — What's Included
    pricing_s2_included_title: "What's included",
    pricing_s2_included_setup_1: "Sales page creation",
    pricing_s2_included_setup_2: "Lead magnet implementation",
    pricing_s2_included_setup_3: "CRM implementation for lead management",
    pricing_s2_included_setup_4: "Workshop: USP, target groups, keywords",
    pricing_s2_included_setup_5: "Email campaign creation",
    pricing_s2_included_setup_6: "VSL (Video Sales Letter) script creation",
    pricing_s2_included_setup_7: "Preparation of 2,000+ company database",
    pricing_s2_included_monthly_1: "HypeLead platform setup",
    pricing_s2_included_monthly_2: "Campaign creation and management",
    pricing_s2_included_monthly_3: "Email warming (anti-spam optimization)",
    pricing_s2_included_monthly_4: "Team training",
    pricing_s2_included_monthly_5: "Consultation and regular evaluation",
    pricing_s2_included_monthly_6: "DNS, domain and email address setup",

    // Section 3 — Comparison
    pricing_s3_headline: "Cost Comparison",
    pricing_s3_subheadline: "How much would a sales team with the same output cost?",
    pricing_s3_team_title: "Sales Team",
    pricing_s3_team_reps: "sales representatives",
    pricing_s3_team_cost_label: "Monthly cost",
    pricing_s3_hypelead_title: "HypeLead.ai",
    pricing_s3_savings: "Savings",

    // Section 4 — Expected Results
    pricing_s4_headline: "Expected Results",
    pricing_s4_subheadline: "At different reply rates",
    pricing_s4_scenario: "Scenario",
    pricing_s4_reply_rate: "Reply rate",
    pricing_s4_replies_month: "Replies / month",
    pricing_s4_leads_month: "Leads / month",
    pricing_s4_cost_per_lead: "Cost per lead",
    pricing_s4_conservative: "Conservative",
    pricing_s4_standard: "Standard",
    pricing_s4_optimistic: "Optimistic",
    pricing_s4_na: "N/A",
    pricing_s4_note: "A lead = company that responded with a specific inquiry or interest (approximately one-third of replies).",

    // Section 5 — Fast Response
    pricing_s5_headline: "Importance of Fast Response",
    pricing_s5_text: "If a company that shows interest doesn't receive a response within 24 hours, they will very likely buy elsewhere. Our job is to bring new inquiries — your job is to check new leads daily and convert them into orders.",
    pricing_s5_key_person: "Designate one responsible person to manage the HypeLead.ai platform and respond to inquiries.",

    // Section 6 — GDPR
    pricing_s6_headline: "GDPR Compliance",
    pricing_s6_text: "We work exclusively with publicly available data from registries and company websites. The legal basis is legitimate interest (Art. 6(1)(f) GDPR). Every email includes an unsubscribe option. A data processing agreement is part of every cooperation. Data remains in the EU.",

    // Lead Capture Form
    pricing_form_headline: "Get a free price quote",
    pricing_form_subheadline: "We'll generate a PDF quote and send it to your email",
    pricing_form_name: "Full name",
    pricing_form_email: "Email",
    pricing_form_company: "Company name",
    pricing_form_consent: "I agree to the processing of personal data for the purpose of sending a price quote and possible follow-up communication. More in",
    pricing_form_privacy_link: "privacy policy",
    pricing_form_submit: "Get free quote",
    pricing_form_loading: "Generating quote...",
    pricing_form_success: "The quote has been sent to your email!",
    pricing_form_error: "Something went wrong. Please try again.",
    pricing_form_error_name: "Please enter your name",
    pricing_form_error_email: "Please enter a valid email",
    pricing_form_error_company: "Please enter company name",
    pricing_form_error_consent: "You must agree to data processing",
    pricing_cta_button: "Get free quote",
  },
};
