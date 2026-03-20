import type { Language } from './types';
import { site } from '../../config/site';

export interface CoreKeys {
  // Navigation
  nav_audit: string;
  nav_audit_badge: string;
  nav_cta: string;

  // Scroll Navigation
  scroll_to_top: string;
  scroll_to_bottom: string;

  // Hero
  hero_badge: string;
  hero_headline_1: string;
  hero_headline_2: string;
  hero_subheadline: string;
  hero_subheadline_2: string;
  hero_cta: string;
  hero_trust_1: string;
  hero_trust_2: string;
  hero_trust_3: string;
  hero_form_website: string;
  hero_form_website_placeholder: string;
  hero_form_email: string;
  hero_form_email_placeholder: string;
  hero_form_company: string;
  hero_form_company_placeholder: string;
  hero_form_city: string;
  hero_form_city_placeholder: string;
  hero_form_submit: string;
  hero_form_submit_disabled: string;
  hero_form_submitting: string;
  hero_form_validating: string;
  hero_form_note: string;
  hero_form_validation_error: string;
  hero_form_field_required: string;

  // Stats
  stat_first: string;
  stat_experience: string;
  stat_regions: string;
  stat_projects: string;

  // Trusted by
  trusted_title: string;

  // Footer
  footer_desc: string;
  footer_services: string;
  footer_references: string;
  footer_contact: string;
  footer_privacy: string;
  footer_recommendation: string;
  footer_company_title: string;
  footer_executives: string;
  footer_pavel_role: string;
  footer_mirka_role: string;
  footer_ico_label: string;
  footer_dic_label: string;
  footer_label_street: string;
  footer_label_number: string;
  footer_label_zip: string;
  footer_label_city: string;
  footer_label_country: string;
  footer_country_name: string;
  footer_location: string;
  footer_rights: string;

  // About
  pavel_position: string;
}

export const coreTranslations: Record<Language, CoreKeys> = {
  cs: {
    // Navigation
    nav_audit: "AI Audit",
    nav_audit_badge: "ZDARMA",
    nav_cta: "Bezplatná konzultace",

    // Scroll Navigation
    scroll_to_top: "Přejít nahoru",
    scroll_to_bottom: "Přejít dolů",

    // Hero
    hero_badge: "Bezplatný AI Audit pro firmy",
    hero_headline_1: "Bezplatný AI Audit",
    hero_headline_2: "pro Vaši firmu",
    hero_subheadline: "Zjistěte, kde ztrácíte čas a peníze. Náš AI Audit odhalí příležitosti pro automatizaci a úspory. Výsledky do 5 minut – přímo ve Vašem e-mailu.",
    hero_subheadline_2: "AI Audit",
    hero_cta: "Sestavit AI strategii",
    hero_trust_1: "Výsledky do 5 minut",
    hero_trust_2: "Výsledky do 5 minut",
    hero_trust_3: "100% zdarma",
    hero_form_website: "Web společnosti",
    hero_form_website_placeholder: "www.vase-spolecnost.cz",
    hero_form_email: "E-mail",
    hero_form_email_placeholder: "vas@email.cz",
    hero_form_company: "Název společnosti",
    hero_form_company_placeholder: "Vaše společnost s.r.o.",
    hero_form_city: "Město",
    hero_form_city_placeholder: "Praha, Brno...",
    hero_form_submit: "Získat bezplatný audit",
    hero_form_submit_disabled: "Vyplňte všechna pole",
    hero_form_submitting: "Zpracovávám...",
    hero_form_validating: "Ověřuji údaje...",
    hero_form_note: "Vaše data jsou v bezpečí. Výsledky Vám přijdou přímo do mailu.",
    hero_form_validation_error: "Některá pole obsahují neplatné údaje.",
    hero_form_field_required: "Toto pole je povinné.",

    // Stats
    stat_first: "AI projekty v praxi",
    stat_experience: "roky zkušeností s AI",
    stat_regions: "odvětví",
    stat_projects: "úspěšných projektů",

    // Trusted by
    trusted_title: "Spolupracujeme s předními institucemi",

    // Footer
    footer_desc: `${site.name} je strategický AI partner pro firmy. Pomáháme firmám zavést AI a automatizaci do každodenních procesů.`,
    footer_services: "Služby",
    footer_references: "Reference",
    footer_contact: "Kontakt",
    footer_privacy: "Ochrana soukromí",
    footer_recommendation: "Doporučení na web",
    footer_company_title: "Informace o firmě",
    footer_executives: "Jednatelé",
    footer_pavel_role: "Jednatel, Technický ředitel",
    footer_mirka_role: "Jednatelka, Obchodní ředitelka",
    footer_ico_label: "IČO",
    footer_dic_label: "DIČ",
    footer_label_street: "Ulice",
    footer_label_number: "Č. popisné",
    footer_label_zip: "PSČ",
    footer_label_city: "Město",
    footer_label_country: "Země",
    footer_country_name: "Česká republika",
    footer_location: "Česká republika",
    footer_rights: "Všechna práva vyhrazena",

    // About
    pavel_position: "Jednatel, Technický ředitel",
  },
  en: {
    // Navigation
    nav_audit: "AI Audit",
    nav_audit_badge: "FREE",
    nav_cta: "Free consultation",

    // Scroll Navigation
    scroll_to_top: "Go to top",
    scroll_to_bottom: "Go to bottom",

    // Hero
    hero_badge: "Free AI Audit for businesses",
    hero_headline_1: "Free AI Audit",
    hero_headline_2: "for your company",
    hero_subheadline: "Discover where you're losing time and money. Our AI Audit reveals opportunities for automation and savings. Results in 5 minutes – delivered directly to your email.",
    hero_subheadline_2: "AI Audit",
    hero_cta: "Build your AI strategy",
    hero_trust_1: "Results in 5 minutes",
    hero_trust_2: "Results in 5 minutes",
    hero_trust_3: "100% free",
    hero_form_website: "Company website",
    hero_form_website_placeholder: "www.your-company.com",
    hero_form_email: "Email",
    hero_form_email_placeholder: "your@email.com",
    hero_form_company: "Company name",
    hero_form_company_placeholder: "Your Company Ltd.",
    hero_form_city: "City",
    hero_form_city_placeholder: "New York, London...",
    hero_form_submit: "Get free audit",
    hero_form_submit_disabled: "Fill in all fields",
    hero_form_submitting: "Processing...",
    hero_form_validating: "Validating...",
    hero_form_note: "Your data is secure. Results will be sent directly to your email.",
    hero_form_validation_error: "Some fields contain invalid data.",
    hero_form_field_required: "This field is required.",

    // Stats
    stat_first: "AI projects in production",
    stat_experience: "years of AI experience",
    stat_regions: "industries",
    stat_projects: "successful projects",

    // Trusted by
    trusted_title: "Partnering with leading institutions",

    // Footer
    footer_desc: `${site.name} is a strategic AI partner for businesses. We help companies implement AI and automation into everyday processes.`,
    footer_services: "Services",
    footer_references: "References",
    footer_contact: "Contact",
    footer_privacy: "Privacy Policy",
    footer_recommendation: "Web Recommendations",
    footer_company_title: "Company Information",
    footer_executives: "Executives",
    footer_pavel_role: "CEO, CTO",
    footer_mirka_role: "CEO, CCO",
    footer_ico_label: "Company ID",
    footer_dic_label: "VAT ID",
    footer_label_street: "Street",
    footer_label_number: "No.",
    footer_label_zip: "Postal Code",
    footer_label_city: "City",
    footer_label_country: "Country",
    footer_country_name: "Czech Republic",
    footer_location: "Czech Republic",
    footer_rights: "All rights reserved",

    // About
    pavel_position: "Managing Director, CTO",
  },
};
