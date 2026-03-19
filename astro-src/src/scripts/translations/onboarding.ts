import type { Language } from './types';
import { site } from '../../config/site';

export interface OnboardingKeys {
  // Meta
  onboarding_title: string;
  onboarding_description: string;

  // Progress
  onboarding_step_1_title: string;
  onboarding_step_2_title: string;
  onboarding_step_3_title: string;
  onboarding_step_4_title: string;
  onboarding_step_5_title: string;
  onboarding_step_6_title: string;
  onboarding_progress_text: string;

  // Navigation
  onboarding_next_button: string;
  onboarding_back_button: string;
  onboarding_submit_button: string;
  onboarding_save_draft_button: string;
  onboarding_draft_saved_indicator: string;

  // Step 1 — Info o firmě
  onboarding_company_name_label: string;
  onboarding_company_name_placeholder: string;
  onboarding_city_label: string;
  onboarding_city_placeholder: string;
  onboarding_website_label: string;
  onboarding_website_placeholder: string;

  // Step 2 — Obchodní metriky
  onboarding_numSalespeople_label: string;
  onboarding_numSalespeople_placeholder: string;
  onboarding_monthlySalary_label: string;
  onboarding_monthlySalary_placeholder: string;
  onboarding_currentClientCount_label: string;
  onboarding_currentClientCount_placeholder: string;
  onboarding_newClientsPerMonth_label: string;
  onboarding_newClientsPerMonth_placeholder: string;
  onboarding_avgServicePrice_label: string;
  onboarding_avgServicePrice_placeholder: string;
  onboarding_avgLTVPerYear_label: string;
  onboarding_avgLTVPerYear_placeholder: string;
  onboarding_bestsellingProduct_label: string;
  onboarding_bestsellingProduct_placeholder: string;
  onboarding_bestsellingProduct_hint: string;
  onboarding_targetCustomerICP_label: string;
  onboarding_targetCustomerICP_placeholder: string;
  onboarding_targetCustomerICP_hint: string;
  onboarding_sectorKeywords_label: string;
  onboarding_sectorKeywords_placeholder: string;

  // Step 3 — Příchozí komunikace
  onboarding_want_website_label: string;
  onboarding_page_count_label: string;
  onboarding_page_count_placeholder: string;
  onboarding_inspiration_sources_label: string;
  onboarding_inspiration_sources_placeholder: string;
  onboarding_want_lead_magnet_label: string;
  onboarding_lead_magnet_type_label: string;
  onboarding_lead_magnet_type_create: string;
  onboarding_lead_magnet_type_link: string;
  onboarding_lead_magnet_type_auto_send: string;
  onboarding_lead_magnet_type_crm: string;
  onboarding_marketing_materials_label: string;
  onboarding_material_type_label: string;
  onboarding_material_type_placeholder: string;
  onboarding_lead_magnet_content_label: string;
  onboarding_lead_magnet_content_placeholder: string;
  onboarding_want_crm_label: string;

  // Step 4 — Assety
  onboarding_vsl_link_label: string;
  onboarding_vsl_link_placeholder: string;
  onboarding_hosting_access_label: string;
  onboarding_hosting_access_placeholder: string;
  onboarding_logo_upload_label: string;
  onboarding_images_upload_label: string;
  onboarding_pdf_upload_label: string;
  onboarding_notes_label: string;
  onboarding_notes_placeholder: string;
  onboarding_branding_guidelines_label: string;
  onboarding_branding_guidelines_placeholder: string;
  onboarding_pricelist_label: string;
  onboarding_pricelist_placeholder: string;
  onboarding_services_description_label: string;
  onboarding_services_description_placeholder: string;
  onboarding_contact_name_label: string;
  onboarding_contact_name_placeholder: string;
  onboarding_contact_email_label: string;
  onboarding_contact_email_placeholder: string;
  onboarding_additional_emails_label: string;
  onboarding_additional_emails_placeholder: string;
  onboarding_want_blog_label: string;
  onboarding_blog_count_label: string;
  onboarding_blog_count_placeholder: string;
  onboarding_blog_auto_ai_label: string;

  // Step 5 — Odchozí
  onboarding_daily_volume_label: string;
  onboarding_daily_volume_low: string;
  onboarding_daily_volume_medium: string;
  onboarding_daily_volume_high: string;
  onboarding_daily_volume_very_high: string;
  onboarding_channel_label: string;
  onboarding_channel_email: string;
  onboarding_channel_linkedin: string;
  onboarding_channel_sms: string;
  onboarding_channel_whatsapp: string;
  onboarding_channel_cold_call: string;

  // Step 6 — Balíček + ARES
  onboarding_ico_search_label: string;
  onboarding_ico_placeholder: string;
  onboarding_niche_selection_label: string;
  onboarding_niche_selection_placeholder: string;
  onboarding_package_selection_label: string;
  onboarding_package_selection_placeholder: string;
  onboarding_pricing_summary_label: string;
  onboarding_review_section_label: string;

  // Validation errors
  onboarding_required_field: string;
  onboarding_invalid_email: string;
  onboarding_invalid_url: string;
  onboarding_invalid_ico: string;
  onboarding_min_words: string;
  onboarding_max_tags: string;
  onboarding_min_channels: string;
  onboarding_file_too_large: string;
  onboarding_invalid_file_type: string;

  // Success / Error states
  onboarding_submit_success: string;
  onboarding_submit_error: string;
  onboarding_draft_save_success: string;
  onboarding_draft_restore_success: string;
}

export const onboardingTranslations: Record<Language, OnboardingKeys> = {
  cs: {
    // Meta
    onboarding_title: `Onboarding wizard | ${site.name}`,
    onboarding_description: "Vyplňte průvodce nastavením a připravíme Vám řešení přesně na míru.",

    // Progress
    onboarding_step_1_title: "Info o firmě",
    onboarding_step_2_title: "Obchodní metriky",
    onboarding_step_3_title: "Příchozí komunikace",
    onboarding_step_4_title: "Assety",
    onboarding_step_5_title: "Odchozí komunikace",
    onboarding_step_6_title: "Balíček a platba",
    onboarding_progress_text: "Krok {n} z 6",

    // Navigation
    onboarding_next_button: "Pokračovat",
    onboarding_back_button: "Zpět",
    onboarding_submit_button: "Odeslat a dokončit",
    onboarding_save_draft_button: "Uložit rozpracované",
    onboarding_draft_saved_indicator: "Uloženo",

    // Step 1 — Info o firmě
    onboarding_company_name_label: "Název firmy",
    onboarding_company_name_placeholder: "Vaše firma s.r.o.",
    onboarding_city_label: "Město / sídlo",
    onboarding_city_placeholder: "Praha",
    onboarding_website_label: "Webová stránka",
    onboarding_website_placeholder: "https://vasefirma.cz",

    // Step 2 — Obchodní metriky
    onboarding_numSalespeople_label: "Počet obchodníků",
    onboarding_numSalespeople_placeholder: "Zadejte počet obchodníků",
    onboarding_monthlySalary_label: "Průměrná měsíční mzda obchodníka (Kč)",
    onboarding_monthlySalary_placeholder: "Zadejte částku v Kč",
    onboarding_currentClientCount_label: "Aktuální počet klientů",
    onboarding_currentClientCount_placeholder: "Zadejte počet aktivních klientů",
    onboarding_newClientsPerMonth_label: "Noví klienti za měsíc",
    onboarding_newClientsPerMonth_placeholder: "Průměrný počet nových klientů",
    onboarding_avgServicePrice_label: "Průměrná cena služby / produktu (Kč)",
    onboarding_avgServicePrice_placeholder: "Zadejte průměrnou cenu",
    onboarding_avgLTVPerYear_label: "Průměrná roční hodnota klienta – LTV (Kč)",
    onboarding_avgLTVPerYear_placeholder: "Zadejte průměrné roční LTV",
    onboarding_bestsellingProduct_label: "Nejprodávanější produkt nebo služba",
    onboarding_bestsellingProduct_placeholder: "Popište stručně Váš hlavní produkt nebo službu...",
    onboarding_bestsellingProduct_hint: "Doporučujeme alespoň 20 slov",
    onboarding_targetCustomerICP_label: "Ideální zákaznický profil (ICP)",
    onboarding_targetCustomerICP_placeholder: "Popište, kdo je Váš typický zákazník – obor, velikost firmy, role rozhodujícího...",
    onboarding_targetCustomerICP_hint: "Doporučujeme alespoň 30 slov",
    onboarding_sectorKeywords_label: "Klíčová slova oboru",
    onboarding_sectorKeywords_placeholder: "Zadejte klíčová slova nebo fráze (oddělte čárkou)",

    // Step 3 — Příchozí komunikace
    onboarding_want_website_label: "Chcete vytvořit nebo renovovat webové stránky?",
    onboarding_page_count_label: "Počet stránek / podstránek",
    onboarding_page_count_placeholder: "Odhadovaný počet stránek",
    onboarding_inspiration_sources_label: "Inspirační weby",
    onboarding_inspiration_sources_placeholder: "Vložte URL webů, které se Vám líbí (každý na nový řádek)",
    onboarding_want_lead_magnet_label: "Chcete lead magnet pro sběr kontaktů?",
    onboarding_lead_magnet_type_label: "Typ lead magnetu",
    onboarding_lead_magnet_type_create: "Vytvořit nový (PDF, checklist, …)",
    onboarding_lead_magnet_type_link: "Odkazovat na existující materiál",
    onboarding_lead_magnet_type_auto_send: "Automaticky odeslat po vyplnění formuláře",
    onboarding_lead_magnet_type_crm: "Propojit s CRM",
    onboarding_marketing_materials_label: "Potřebujete marketingové materiály?",
    onboarding_material_type_label: "Typ materiálů",
    onboarding_material_type_placeholder: "Vyberte požadované typy materiálů...",
    onboarding_lead_magnet_content_label: "Obsah lead magnetu",
    onboarding_lead_magnet_content_placeholder: "Popište, co má lead magnet obsahovat...",
    onboarding_want_crm_label: "Chcete napojení na CRM systém?",

    // Step 4 — Assety
    onboarding_vsl_link_label: "Odkaz na VSL video",
    onboarding_vsl_link_placeholder: "https://youtube.com/...",
    onboarding_hosting_access_label: "Přístupové údaje k hostingu",
    onboarding_hosting_access_placeholder: "Popište nebo vložte přihlašovací údaje k hostingu...",
    onboarding_logo_upload_label: "Logo firmy (SVG, PNG)",
    onboarding_images_upload_label: "Firemní fotografie a obrázky",
    onboarding_pdf_upload_label: "PDF dokumenty (ceník, prospekty, …)",
    onboarding_notes_label: "Poznámky a doplňující informace",
    onboarding_notes_placeholder: "Cokoliv dalšího, co bychom měli vědět...",
    onboarding_branding_guidelines_label: "Brand manuál / grafický manuál",
    onboarding_branding_guidelines_placeholder: "Odkaz nebo popis Vašeho brand manuálu",
    onboarding_pricelist_label: "Ceník",
    onboarding_pricelist_placeholder: "Odkaz nebo popis ceníku",
    onboarding_services_description_label: "Popis služeb",
    onboarding_services_description_placeholder: "Popište Vaše hlavní služby a jejich přidanou hodnotu...",
    onboarding_contact_name_label: "Kontaktní osoba",
    onboarding_contact_name_placeholder: "Jméno a příjmení",
    onboarding_contact_email_label: "Kontaktní e-mail",
    onboarding_contact_email_placeholder: "kontakt@vasefirma.cz",
    onboarding_additional_emails_label: "Další e-mailové adresy",
    onboarding_additional_emails_placeholder: "Zadejte další e-maily (oddělte čárkou)",
    onboarding_want_blog_label: "Chcete firemní blog?",
    onboarding_blog_count_label: "Počet článků za měsíc",
    onboarding_blog_count_placeholder: "Odhadovaný měsíční počet článků",
    onboarding_blog_auto_ai_label: "Generovat články automaticky pomocí AI?",

    // Step 5 — Odchozí komunikace
    onboarding_daily_volume_label: "Denní objem odchozích zpráv",
    onboarding_daily_volume_low: "Do 50 zpráv denně",
    onboarding_daily_volume_medium: "50 – 200 zpráv denně",
    onboarding_daily_volume_high: "200 – 1 000 zpráv denně",
    onboarding_daily_volume_very_high: "Více než 1 000 zpráv denně",
    onboarding_channel_label: "Komunikační kanály",
    onboarding_channel_email: "E-mail",
    onboarding_channel_linkedin: "LinkedIn",
    onboarding_channel_sms: "SMS",
    onboarding_channel_whatsapp: "WhatsApp",
    onboarding_channel_cold_call: "Telefonování (cold call)",

    // Step 6 — Balíček + ARES
    onboarding_ico_search_label: "Vyhledat firmu podle IČO",
    onboarding_ico_placeholder: "Zadejte IČO (8 číslic)",
    onboarding_niche_selection_label: "Výběr oboru",
    onboarding_niche_selection_placeholder: "Vyberte Váš obor...",
    onboarding_package_selection_label: "Výběr balíčku",
    onboarding_package_selection_placeholder: "Vyberte balíček služeb...",
    onboarding_pricing_summary_label: "Shrnutí ceny",
    onboarding_review_section_label: "Kontrola před odesláním",

    // Validation errors
    onboarding_required_field: "Toto pole je povinné.",
    onboarding_invalid_email: "Zadejte platnou e-mailovou adresu (např. jan@firma.cz).",
    onboarding_invalid_url: "Zadejte platnou URL adresu včetně https:// (např. https://vasefirma.cz).",
    onboarding_invalid_ico: "IČO musí obsahovat přesně 8 číslic.",
    onboarding_min_words: "Popis je příliš krátký. Zadejte prosím alespoň {min} slov.",
    onboarding_max_tags: "Lze zadat nejvýše {max} položek.",
    onboarding_min_channels: "Vyberte alespoň {min} komunikační kanál.",
    onboarding_file_too_large: "Soubor je příliš velký. Maximální povolená velikost je {max} MB.",
    onboarding_invalid_file_type: "Nepodporovaný formát souboru. Povolené typy: {types}.",

    // Success / Error states
    onboarding_submit_success: "Vše odesláno. Brzy se Vám ozveme s dalšími kroky.",
    onboarding_submit_error: "Odeslání se nezdařilo. Zkontrolujte připojení a zkuste to prosím znovu.",
    onboarding_draft_save_success: "Rozpracovaný formulář byl uložen.",
    onboarding_draft_restore_success: "Uložená data byla obnovena. Můžete pokračovat tam, kde jste skončili.",
  },
  en: {
    // Meta
    onboarding_title: `Onboarding Wizard | ${site.name}`,
    onboarding_description: "Complete the setup wizard and we will prepare a solution tailored precisely to your needs.",

    // Progress
    onboarding_step_1_title: "Company Info",
    onboarding_step_2_title: "Business Metrics",
    onboarding_step_3_title: "Inbound Communication",
    onboarding_step_4_title: "Assets",
    onboarding_step_5_title: "Outbound Communication",
    onboarding_step_6_title: "Package & Payment",
    onboarding_progress_text: "Step {n} of 6",

    // Navigation
    onboarding_next_button: "Continue",
    onboarding_back_button: "Back",
    onboarding_submit_button: "Submit and Finish",
    onboarding_save_draft_button: "Save Draft",
    onboarding_draft_saved_indicator: "Saved",

    // Step 1 — Company Info
    onboarding_company_name_label: "Company Name",
    onboarding_company_name_placeholder: "Your Company Ltd.",
    onboarding_city_label: "City / Location",
    onboarding_city_placeholder: "Prague",
    onboarding_website_label: "Website",
    onboarding_website_placeholder: "https://yourcompany.com",

    // Step 2 — Business Metrics
    onboarding_numSalespeople_label: "Number of Salespeople",
    onboarding_numSalespeople_placeholder: "Enter number of salespeople",
    onboarding_monthlySalary_label: "Average Monthly Salary per Salesperson",
    onboarding_monthlySalary_placeholder: "Enter amount",
    onboarding_currentClientCount_label: "Current Client Count",
    onboarding_currentClientCount_placeholder: "Enter number of active clients",
    onboarding_newClientsPerMonth_label: "New Clients per Month",
    onboarding_newClientsPerMonth_placeholder: "Average number of new clients",
    onboarding_avgServicePrice_label: "Average Service / Product Price",
    onboarding_avgServicePrice_placeholder: "Enter average price",
    onboarding_avgLTVPerYear_label: "Average Annual Client Lifetime Value (LTV)",
    onboarding_avgLTVPerYear_placeholder: "Enter average annual LTV",
    onboarding_bestsellingProduct_label: "Best-selling Product or Service",
    onboarding_bestsellingProduct_placeholder: "Briefly describe your main product or service...",
    onboarding_bestsellingProduct_hint: "We recommend at least 20 words",
    onboarding_targetCustomerICP_label: "Ideal Customer Profile (ICP)",
    onboarding_targetCustomerICP_placeholder: "Describe your typical customer — industry, company size, decision-maker role...",
    onboarding_targetCustomerICP_hint: "We recommend at least 30 words",
    onboarding_sectorKeywords_label: "Industry Keywords",
    onboarding_sectorKeywords_placeholder: "Enter keywords or phrases (separate with a comma)",

    // Step 3 — Inbound Communication
    onboarding_want_website_label: "Do you want to create or redesign a website?",
    onboarding_page_count_label: "Number of Pages / Subpages",
    onboarding_page_count_placeholder: "Estimated number of pages",
    onboarding_inspiration_sources_label: "Inspiration Websites",
    onboarding_inspiration_sources_placeholder: "Paste URLs of websites you like (one per line)",
    onboarding_want_lead_magnet_label: "Do you want a lead magnet for collecting contacts?",
    onboarding_lead_magnet_type_label: "Lead Magnet Type",
    onboarding_lead_magnet_type_create: "Create a new one (PDF, checklist, …)",
    onboarding_lead_magnet_type_link: "Link to an existing resource",
    onboarding_lead_magnet_type_auto_send: "Auto-send after form submission",
    onboarding_lead_magnet_type_crm: "Connect with CRM",
    onboarding_marketing_materials_label: "Do you need marketing materials?",
    onboarding_material_type_label: "Material Types",
    onboarding_material_type_placeholder: "Select the types of materials you need...",
    onboarding_lead_magnet_content_label: "Lead Magnet Content",
    onboarding_lead_magnet_content_placeholder: "Describe what the lead magnet should contain...",
    onboarding_want_crm_label: "Do you want CRM integration?",

    // Step 4 — Assets
    onboarding_vsl_link_label: "VSL Video Link",
    onboarding_vsl_link_placeholder: "https://youtube.com/...",
    onboarding_hosting_access_label: "Hosting Access Credentials",
    onboarding_hosting_access_placeholder: "Describe or paste your hosting login details...",
    onboarding_logo_upload_label: "Company Logo (SVG, PNG)",
    onboarding_images_upload_label: "Company Photos and Images",
    onboarding_pdf_upload_label: "PDF Documents (price list, brochures, …)",
    onboarding_notes_label: "Notes and Additional Information",
    onboarding_notes_placeholder: "Anything else we should know...",
    onboarding_branding_guidelines_label: "Brand / Style Guide",
    onboarding_branding_guidelines_placeholder: "Link or description of your brand guidelines",
    onboarding_pricelist_label: "Price List",
    onboarding_pricelist_placeholder: "Link or description of your price list",
    onboarding_services_description_label: "Services Description",
    onboarding_services_description_placeholder: "Describe your main services and their value proposition...",
    onboarding_contact_name_label: "Contact Person",
    onboarding_contact_name_placeholder: "Full name",
    onboarding_contact_email_label: "Contact Email",
    onboarding_contact_email_placeholder: "contact@yourcompany.com",
    onboarding_additional_emails_label: "Additional Email Addresses",
    onboarding_additional_emails_placeholder: "Enter additional emails (separate with a comma)",
    onboarding_want_blog_label: "Do you want a company blog?",
    onboarding_blog_count_label: "Articles per Month",
    onboarding_blog_count_placeholder: "Estimated monthly article count",
    onboarding_blog_auto_ai_label: "Generate articles automatically using AI?",

    // Step 5 — Outbound Communication
    onboarding_daily_volume_label: "Daily Outbound Message Volume",
    onboarding_daily_volume_low: "Up to 50 messages per day",
    onboarding_daily_volume_medium: "50 – 200 messages per day",
    onboarding_daily_volume_high: "200 – 1,000 messages per day",
    onboarding_daily_volume_very_high: "More than 1,000 messages per day",
    onboarding_channel_label: "Communication Channels",
    onboarding_channel_email: "Email",
    onboarding_channel_linkedin: "LinkedIn",
    onboarding_channel_sms: "SMS",
    onboarding_channel_whatsapp: "WhatsApp",
    onboarding_channel_cold_call: "Cold Calling",

    // Step 6 — Package + Company Lookup
    onboarding_ico_search_label: "Look Up Company by Registration Number",
    onboarding_ico_placeholder: "Enter company registration number",
    onboarding_niche_selection_label: "Industry Selection",
    onboarding_niche_selection_placeholder: "Select your industry...",
    onboarding_package_selection_label: "Package Selection",
    onboarding_package_selection_placeholder: "Select a service package...",
    onboarding_pricing_summary_label: "Pricing Summary",
    onboarding_review_section_label: "Review Before Submitting",

    // Validation errors
    onboarding_required_field: "This field is required.",
    onboarding_invalid_email: "Please enter a valid email address (e.g. john@company.com).",
    onboarding_invalid_url: "Please enter a valid URL including https:// (e.g. https://yourcompany.com).",
    onboarding_invalid_ico: "The registration number must contain exactly 8 digits.",
    onboarding_min_words: "Description is too short. Please enter at least {min} words.",
    onboarding_max_tags: "You can add a maximum of {max} items.",
    onboarding_min_channels: "Please select at least {min} communication channel.",
    onboarding_file_too_large: "File is too large. Maximum allowed size is {max} MB.",
    onboarding_invalid_file_type: "Unsupported file format. Allowed types: {types}.",

    // Success / Error states
    onboarding_submit_success: "All done. We will be in touch shortly with the next steps.",
    onboarding_submit_error: "Submission failed. Please check your connection and try again.",
    onboarding_draft_save_success: "Your draft has been saved.",
    onboarding_draft_restore_success: "Saved data has been restored. You can continue where you left off.",
  },
};
