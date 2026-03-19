import type { Language } from './types';
import { site } from '../../config/site';

export interface MiscKeys {
  // Error 404 Page
  error_404_title: string;
  error_404_headline: string;
  error_404_subheadline: string;
  error_404_detected_lang_url: string;
  error_404_redirect_message: string;
  error_404_redirect_in: string;
  error_404_seconds: string;
  error_404_click_here: string;
  error_404_or_go_home: string;
  error_404_back_home: string;

  // Recommendations Page
  rec_title: string;
  rec_meta_description: string;
  rec_headline: string;
  rec_intro: string;
  rec_section_1_title: string;
  rec_section_1_text_1: string;
  rec_section_1_text_2: string;
  rec_example_title: string;
  rec_example_purpose: string;
  rec_example_purpose_text: string;
  rec_example_ai: string;
  rec_example_ai_text: string;
  rec_example_scope: string;
  rec_example_scope_text: string;
  rec_example_duration: string;
  rec_example_duration_text: string;
  rec_section_2_title: string;
  rec_section_2_text: string;
  rec_storage_title: string;
  rec_storage_text: string;
  rec_storage_item_1: string;
  rec_storage_item_2: string;
  rec_storage_item_3: string;
  rec_storage_item_4: string;
  rec_ai_act_title: string;
  rec_ai_act_text: string;

  // RAGus.ai Section
  ragus_label: string;
  ragus_badge: string;
  ragus_tagline: string;
  ragus_headline_1: string;
  ragus_headline_2: string;
  ragus_desc: string;
  ragus_cta: string;
  ragus_feature_1: string;
  ragus_feature_2: string;
  ragus_feature_3: string;
  ragus_feature_4: string;
  ragus_target_1: string;
  ragus_target_2: string;
  ragus_target_3: string;
  ragus_target_4: string;

  // Voiceflow Partner Section
  vf_badge: string;
  vf_headline: string;
  vf_desc: string;
  vf_feature_1: string;
  vf_feature_2: string;
  vf_feature_3: string;
  vf_cta: string;
  voiceflow_badge: string;
  voiceflow_title: string;
  voiceflow_desc: string;
  voiceflow_cta: string;
  voiceflow_label: string;
}

export const miscTranslations: Record<Language, MiscKeys> = {
  cs: {
    // Error 404 Page
    error_404_title: `Stránka nenalezena | ${site.name}`,
    error_404_headline: "Stránka nenalezena",
    error_404_subheadline: "Omlouváme se, ale stránka, kterou hledáte, neexistuje nebo byla přesunuta.",
    error_404_detected_lang_url: "Vypadá to, že jste použili neplatnou URL s jazykovou předponou",
    error_404_redirect_message: "Přesměrováváme vás na správnou adresu",
    error_404_redirect_in: "Přesměrování za",
    error_404_seconds: "vteřin",
    error_404_click_here: "klikněte zde pro okamžité přesměrování",
    error_404_or_go_home: "nebo se vraťte na",
    error_404_back_home: "Zpět na úvodní stránku",

    // Recommendations Page
    rec_title: `Doporučení na web | ${site.name}`,
    rec_meta_description: "Doporučení pro implementaci AI chatbotů na webové stránky - GDPR, cookies, AI Act.",
    rec_headline: "Doporučení na web",
    rec_intro: "Pokud se rozhodnete využívat služby našich AI asistentů, měli byste zároveň dodržovat pravidla GDPR a dalších relevantních předpisů. Toto se vás týká zejména pokud chcete využívat AI asistenta pro automatizovaný sběr kontaktů i zpracování osobních údajů obecně.",
    rec_section_1_title: "Zásady zpracování osobních údajů",
    rec_section_1_text_1: "Spolu se získáváním souhlasu by měl být uživatel chatbotu informován o tom, jak se jeho osobní údaje budou zpracovávat. Proto v rámci patičky chatbotu nebo do jeho textu (na začátek konverzace) musíte vložit odkaz na vaše zásady zpracování osobních údajů.",
    rec_section_1_text_2: "Standardně půjde o souhlas nebo oprávněný zájem. Účelem pak bude komunikace s podporou, vyřízení dotazu či stížnosti, případně i zasílání obchodních sdělení, kde musíte získat explicitní souhlas.",
    rec_example_title: "Příklad implementace do zásad",
    rec_example_purpose: "Účel zpracování:",
    rec_example_purpose_text: "Užití AI asistenta. Na našich webových stránkách užíváme AI asistenta pro vyřizování vašich dotazů, stížností či dalším obdobným účelům. Osobní data zpracováváme na základě oprávněného zájmu, případně na základě souhlasu u údajů, které nám sdělíte.",
    rec_example_ai: "Zpracování AI:",
    rec_example_ai_text: "Upozorňujeme, že do zpracování osobních údajů v tomto účelu bude zapojena umělá inteligence.",
    rec_example_scope: "Rozsah zpracování:",
    rec_example_scope_text: "IP adresa, typ zařízení, jazyk prohlížeče, časové pásmo a všechny údaje, které nám sdělíte (jméno, příjmení, e-mail, telefon atd.).",
    rec_example_duration: "Délka zpracování:",
    rec_example_duration_text: "Vaše osobní údaje zpracováváme 3,5 roku od jejich vložení do AI asistenta (položení dotazu).",
    rec_section_2_title: "Nastavení cookies",
    rec_section_2_text: "V rámci vašich webových stránek je vhodné nastavit správně cookies lištu. Tedy informovat, jaké cookies využíváte v rámci dané stránky i chatbotu. Doporučujeme užít vhodné nástroje jako Cookiebot, Cookiefirst nebo Cookie-Script.",
    rec_storage_title: "LocalStorage / SessionStorage",
    rec_storage_text: "V rámci naší činnosti používáme pro ukládání LocalStorage/SessionStorage. Ukládáme následující údaje:",
    rec_storage_item_1: "Historie aktuální konverzace",
    rec_storage_item_2: "Stav / čas konverzace",
    rec_storage_item_3: "Seznam navštívených URL",
    rec_storage_item_4: "ID uživatele (unikátní ID)",
    rec_ai_act_title: "Upozornění na interakci s AI (AI Act)",
    rec_ai_act_text: "Dle legislativy AI Act je povinné zajistit, aby byl uživatel před interakcí s AI o tomto transparentně informován. V rámci užívání chatbotu tedy vždy musí být před konverzací s AI o tomto dopředu upozorněno. Toto v chatbotu musí vždy být jasně a zřetelně uvedeno.",

    // RAGus.ai Section
    ragus_label: "ADMINISTRAČNÍ PANEL",
    ragus_badge: "Administrační panel",
    ragus_tagline: "RAG-as-a-Service platforma pro AI agentury a enterprise týmy",
    ragus_headline_1: "Čistá a strukturovaná data",
    ragus_headline_2: "— základ úspěšné AI",
    ragus_desc: "Kvalitní AI asistent je jen tak dobrý, jak dobrá jsou data, která mu dáte. <a href=\"https://ragus.ai\" target=\"_blank\" class=\"text-orange-400 hover:text-orange-300 transition-colors font-medium\">RAGus.ai</a> je náš vlastní administrační panel, který slouží jako centrální mozek pro všechny vaše AI produkty. Stará se o to, aby vaše znalostní báze byla vždy aktuální, přehledná a bez chyb.",
    ragus_cta: "Zjistit více",
    ragus_feature_1: "99% přesnost díky vyčištěným datům",
    ragus_feature_2: "Centrální správa všech AI produktů na jednom místě",
    ragus_feature_3: "Automatická synchronizace vaší znalostní báze",
    ragus_feature_4: "Efektivní monitoring a dohled nad 'mozkem' AI",
    ragus_target_1: "Administrační panel",
    ragus_target_2: "Správa a trénování AI",
    ragus_target_3: "Monitorování konverzací",
    ragus_target_4: "Zadávání zpětné vazby",

    // Voiceflow Partner Section
    vf_badge: "Certifikovaný partner",
    vf_headline: "Voiceflow Certified Expert",
    vf_desc: "Voiceflow je jedna z našich hlavních oblíbených platforem pro tvorbu AI agentů a konverzačních flows. Jako certifikovaný expert vám pomůžeme vytvořit špičková řešení.",
    vf_feature_1: "Pokročilá konverzační logika",
    vf_feature_2: "Integrace s enterprise systémy",
    vf_feature_3: "Multiplatformní nasazení",
    vf_cta: "Začít s Voiceflow",
    voiceflow_badge: "Certifikovaný partner",
    voiceflow_title: "Voiceflow Certified Expert",
    voiceflow_desc: "Voiceflow je jedna z našich hlavních oblíbených platforem pro tvorbu AI agentů a konverzačních flows. Jako certifikovaný expert vám pomůžeme vytvořit špičková řešení.",
    voiceflow_cta: "Zkusit Voiceflow",
    voiceflow_label: "Certifikovaný partner",
  },
  en: {
    // Error 404 Page
    error_404_title: `Page Not Found | ${site.name}`,
    error_404_headline: "Page Not Found",
    error_404_subheadline: "Sorry, the page you're looking for doesn't exist or has been moved.",
    error_404_detected_lang_url: "It looks like you used an invalid URL with a language prefix",
    error_404_redirect_message: "Redirecting you to the correct address",
    error_404_redirect_in: "Redirecting in",
    error_404_seconds: "seconds",
    error_404_click_here: "click here for immediate redirect",
    error_404_or_go_home: "or go back to",
    error_404_back_home: "Back to Homepage",

    // Recommendations Page
    rec_title: `Website Recommendations | ${site.name}`,
    rec_meta_description: "Recommendations for implementing AI chatbots on websites - GDPR, cookies, AI Act compliance.",
    rec_headline: "Website Recommendations",
    rec_intro: "If you decide to use our AI assistant services, you should also comply with GDPR rules and other relevant regulations. This is particularly relevant if you intend to use the AI assistant for automated contact collection and the processing of personal data in general.",
    rec_section_1_title: "Personal Data Processing Policy",
    rec_section_1_text_1: "Along with obtaining consent, the chatbot user should be informed about how their personal data will be processed. Therefore, you must include a link to your personal data processing policy in the chatbot footer or in its text (at the beginning of the conversation).",
    rec_section_1_text_2: "Typically, this will involve consent or legitimate interest. The purpose will then be communication with support, handling inquiries or complaints, and possibly also sending commercial communications, where you must obtain explicit consent.",
    rec_example_title: "Example Implementation for Your Policy",
    rec_example_purpose: "Purpose of processing:",
    rec_example_purpose_text: "Use of AI Assistant. On our website, we use an AI assistant to handle your inquiries, complaints, or other similar purposes. We process personal data on the basis of legitimate interest, or on the basis of consent for data you provide to us.",
    rec_example_ai: "AI Processing:",
    rec_example_ai_text: "Please note that artificial intelligence will be involved in the processing of personal data for this purpose.",
    rec_example_scope: "Scope of processing:",
    rec_example_scope_text: "IP address, device type, browser language, time zone, and all data you provide to us (name, surname, email, phone, etc.).",
    rec_example_duration: "Duration of processing:",
    rec_example_duration_text: "We process your personal data for 3.5 years from the date of entry into the AI assistant (submitting an inquiry).",
    rec_section_2_title: "Cookie Settings",
    rec_section_2_text: "On your website, it is advisable to properly configure the cookie banner. That is, to inform users which cookies you use on the page and in the chatbot. We recommend using appropriate tools such as Cookiebot, Cookiefirst, or Cookie-Script.",
    rec_storage_title: "LocalStorage / SessionStorage",
    rec_storage_text: "As part of our operations, we use LocalStorage/SessionStorage for data storage. We store the following data:",
    rec_storage_item_1: "Current conversation history",
    rec_storage_item_2: "Conversation state / time",
    rec_storage_item_3: "List of visited URLs",
    rec_storage_item_4: "User ID (unique identifier)",
    rec_ai_act_title: "AI Interaction Disclosure (AI Act)",
    rec_ai_act_text: "Under the AI Act legislation, it is mandatory to ensure that the user is transparently informed before interacting with AI. Therefore, when using the chatbot, there must always be a clear and visible notice before the conversation with AI. This must always be clearly and prominently stated in the chatbot.",

    // RAGus.ai Section
    ragus_label: "ADMIN PANEL",
    ragus_badge: "Admin panel",
    ragus_tagline: "RAG-as-a-Service platform for AI agencies and enterprise teams",
    ragus_headline_1: "Clean and Structured Data",
    ragus_headline_2: "— the Core of Successful AI",
    ragus_desc: "A quality AI assistant is only as good as the data you feed it. <a href=\"https://ragus.ai\" target=\"_blank\" class=\"text-orange-400 hover:text-orange-300 transition-colors font-medium\">RAGus.ai</a> is our proprietary admin panel that serves as the central brain for all your AI products. It ensures your knowledge base is always up-to-date, clear, and accurate.",
    ragus_cta: "Learn more",
    ragus_feature_1: "99% accuracy through cleaned data",
    ragus_feature_2: "Central management of all AI products in one place",
    ragus_feature_3: "Automated knowledge base synchronization",
    ragus_feature_4: "Efficient monitoring and oversight of the AI 'brain'",
    ragus_target_1: "Admin panel",
    ragus_target_2: "AI Management & Training",
    ragus_target_3: "Conversation Monitoring",
    ragus_target_4: "Feedback Entry",

    // Voiceflow Partner Section
    vf_badge: "Certified Partner",
    vf_headline: "Voiceflow Certified Expert",
    vf_desc: "Voiceflow is one of our main favorite platforms for building AI agents and conversational flows. As a certified expert, we will help you create top-tier solutions.",
    vf_feature_1: "Advanced conversational logic",
    vf_feature_2: "Enterprise system integration",
    vf_feature_3: "Multi-platform deployment",
    vf_cta: "Get started with Voiceflow",
    voiceflow_badge: "Certified Partner",
    voiceflow_title: "Voiceflow Certified Expert",
    voiceflow_desc: "Voiceflow is one of our main favorite platforms for building AI agents and conversational flows. As a certified expert, we will help you create top-tier solutions.",
    voiceflow_cta: "Try Voiceflow",
    voiceflow_label: "Certified Partner",
  },
};
