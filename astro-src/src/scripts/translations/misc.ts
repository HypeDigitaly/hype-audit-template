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
  },
};
