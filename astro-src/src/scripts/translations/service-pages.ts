import type { Language } from './types';
import { site } from '../../config/site';

export interface ServicePagesKeys {
  // Services Hub
  services_hub_badge: string;
  services_hub_title: string;
  services_hub_title_2: string;
  services_hub_subtitle: string;
  services_hub_meta_title: string;
  services_hub_meta_desc: string;
  services_hub_cta: string;
  services_hub_explore: string;

  // How We Work
  how_we_work_tag: string;
  how_we_work_label: string;
  how_we_work_headline_1: string;
  how_we_work_headline_2: string;
  how_we_work_subheadline: string;

  // Voicebot Page
  voicebot_meta_title: string;
  voicebot_meta_desc: string;
  voicebot_badge: string;
  voicebot_title: string;
  voicebot_subtitle: string;
  voicebot_feature_1_title: string;
  voicebot_feature_1_desc: string;
  voicebot_feature_2_title: string;
  voicebot_feature_2_desc: string;
  voicebot_feature_3_title: string;
  voicebot_feature_3_desc: string;
  voicebot_feature_4_title: string;
  voicebot_feature_4_desc: string;
  voicebot_usecase_title: string;
  voicebot_usecase_1: string;
  voicebot_usecase_2: string;
  voicebot_usecase_3: string;
  voicebot_usecase_4: string;
  voicebot_cta: string;

  // AI Agent Page
  aiagent_meta_title: string;
  aiagent_meta_desc: string;
  aiagent_badge: string;
  aiagent_title: string;
  aiagent_subtitle: string;
  aiagent_feature_1_title: string;
  aiagent_feature_1_desc: string;
  aiagent_feature_2_title: string;
  aiagent_feature_2_desc: string;
  aiagent_feature_3_title: string;
  aiagent_feature_3_desc: string;
  aiagent_feature_4_title: string;
  aiagent_feature_4_desc: string;
  aiagent_usecase_title: string;
  aiagent_usecase_1: string;
  aiagent_usecase_2: string;
  aiagent_usecase_3: string;
  aiagent_usecase_4: string;
  aiagent_cta: string;

  // Automation Page
  automation_meta_title: string;
  automation_meta_desc: string;
  automation_badge: string;
  automation_title: string;
  automation_subtitle: string;
  automation_feature_1_title: string;
  automation_feature_1_desc: string;
  automation_feature_2_title: string;
  automation_feature_2_desc: string;
  automation_feature_3_title: string;
  automation_feature_3_desc: string;
  automation_feature_4_title: string;
  automation_feature_4_desc: string;
  automation_usecase_title: string;
  automation_usecase_1: string;
  automation_usecase_2: string;
  automation_usecase_3: string;
  automation_usecase_4: string;
  automation_cta: string;

  // Dev Apps Page
  devapps_meta_title: string;
  devapps_meta_desc: string;
  devapps_badge: string;
  devapps_title: string;
  devapps_subtitle: string;
  devapps_feature_1_title: string;
  devapps_feature_1_desc: string;
  devapps_feature_2_title: string;
  devapps_feature_2_desc: string;
  devapps_feature_3_title: string;
  devapps_feature_3_desc: string;
  devapps_feature_4_title: string;
  devapps_feature_4_desc: string;
  devapps_usecase_title: string;
  devapps_usecase_1: string;
  devapps_usecase_2: string;
  devapps_usecase_3: string;
  devapps_usecase_4: string;
  devapps_cta: string;

  // Web Design Page
  webdesign_meta_title: string;
  webdesign_meta_desc: string;
  webdesign_badge: string;
  webdesign_title: string;
  webdesign_subtitle: string;
  webdesign_feature_1_title: string;
  webdesign_feature_1_desc: string;
  webdesign_feature_2_title: string;
  webdesign_feature_2_desc: string;
  webdesign_feature_3_title: string;
  webdesign_feature_3_desc: string;
  webdesign_feature_4_title: string;
  webdesign_feature_4_desc: string;
  webdesign_usecase_title: string;
  webdesign_usecase_1: string;
  webdesign_usecase_2: string;
  webdesign_usecase_3: string;
  webdesign_usecase_4: string;
  webdesign_cta: string;

  // Common Service Page Elements
  service_related_title: string;
  service_related_subtitle: string;
  service_cta_title: string;
  service_cta_subtitle: string;
  service_cta_button: string;
}

export const servicePagesTranslations: Record<Language, ServicePagesKeys> = {
  cs: {
    // Services Hub
    services_hub_badge: "// VÁŠ AI PARTNER",
    services_hub_title: "Vše pro AI transformaci",
    services_hub_title_2: "na jednom místě",
    services_hub_subtitle: "Od strategie přes implementaci až po podporu. Komplexní AI řešení od jednoho partnera – žádné koordinování více dodavatelů.",
    services_hub_meta_title: "Služby | HypeDigitaly - AI Chatboty, Automatizace, Vývoj",
    services_hub_meta_desc: "Kompletní nabídka AI služeb: chatboty, voiceboty, AI agenti, automatizace, vývoj aplikací, web design a konzultace. Řešení na míru pro firmy i veřejnou správu.",
    services_hub_cta: "Nezávazná konzultace",
    services_hub_explore: "Zjistit více",

    // How We Work
    how_we_work_tag: "// METODOLOGIE",
    how_we_work_label: "JAK PRACUJEME",
    how_we_work_headline_1: "Osvědčený přístup",
    how_we_work_headline_2: "k AI transformaci",
    how_we_work_subheadline: "Žádné zdlouhavé prezentace. Začínáme rovnou na skutečných případech a implementaci.",

    // Voicebot Page
    voicebot_meta_title: "AI Voicebot | HypeDigitaly - Hlasová automatizace",
    voicebot_meta_desc: "Automatizace hlasové komunikace a telefonních hovorů s přirozenou konverzací. Snižte náklady na call centrum až o 40%.",
    voicebot_badge: "// AI VOICEBOT",
    voicebot_title: "Automatizace hlasové komunikace",
    voicebot_subtitle: "Inteligentní voicebot s přirozenou konverzací, který odbavuje telefonní hovory 24/7. Snižte náklady na call centrum a zlepšete dostupnost.",
    voicebot_feature_1_title: "Přirozená konverzace",
    voicebot_feature_1_desc: "Pokročilé rozpoznávání řeči a syntéza hlasu pro plynulou komunikaci.",
    voicebot_feature_2_title: "24/7 dostupnost",
    voicebot_feature_2_desc: "Nepřetržité odbavování hovorů bez čekání a front.",
    voicebot_feature_3_title: "Integrace s CRM",
    voicebot_feature_3_desc: "Napojení na vaše systémy pro personalizovanou obsluhu.",
    voicebot_feature_4_title: "Analýza hovorů",
    voicebot_feature_4_desc: "Detailní reporty a přepisy pro optimalizaci procesů.",
    voicebot_usecase_title: "Pro koho je voicebot ideální?",
    voicebot_usecase_1: "Call centra s vysokým objemem hovorů",
    voicebot_usecase_2: "Zákaznická podpora a helpdesk",
    voicebot_usecase_3: "Rezervační systémy a objednávky",
    voicebot_usecase_4: "Informační linky a FAQ",
    voicebot_cta: "Chci konzultaci zdarma",

    // AI Agent Page
    aiagent_meta_title: "AI Agent | HypeDigitaly - Autonomní AI asistenti",
    aiagent_meta_desc: "Autonomní AI agenti pro komplexní vícekrokové úkoly bez lidského zásahu. Zrychlete procesy až o 80%.",
    aiagent_badge: "// AI AGENT",
    aiagent_title: "Autonomní AI pro komplexní úkoly",
    aiagent_subtitle: "AI agent, který samostatně plní vícekrokové úkoly, analyzuje data a dělá rozhodnutí. Uvolněte svůj tým od repetitivní práce.",
    aiagent_feature_1_title: "Autonomní rozhodování",
    aiagent_feature_1_desc: "Agent sám vyhodnocuje situaci a volí optimální postup.",
    aiagent_feature_2_title: "Vícekrokové úkoly",
    aiagent_feature_2_desc: "Zpracování komplexních procesů od začátku do konce.",
    aiagent_feature_3_title: "Učení z dat",
    aiagent_feature_3_desc: "Kontinuální zlepšování na základě zpětné vazby.",
    aiagent_feature_4_title: "API integrace",
    aiagent_feature_4_desc: "Propojení s externími systémy a databázemi.",
    aiagent_usecase_title: "Kde AI agent vyniká?",
    aiagent_usecase_1: "Automatizace back-office procesů",
    aiagent_usecase_2: "Analýza dokumentů a dat",
    aiagent_usecase_3: "Personalizované doporučování",
    aiagent_usecase_4: "Monitoring a alerting",
    aiagent_cta: "Chci konzultaci zdarma",

    // Automation Page
    automation_meta_title: "AI Automatizace | HypeDigitaly - Workflow automatizace",
    automation_meta_desc: "Enterprise-grade automatizace pro aplikační logiku a workflow. Zvyšte efektivitu až 10×.",
    automation_badge: "// AI AUTOMATIZACE",
    automation_title: "Automatizace workflow a procesů",
    automation_subtitle: "Propojte vaše aplikace a automatizujte opakující se úkoly. Od jednoduchých workflow až po komplexní enterprise řešení.",
    automation_feature_1_title: "No-code řešení",
    automation_feature_1_desc: "Vizuální tvorba automatizací bez programování.",
    automation_feature_2_title: "500+ integrací",
    automation_feature_2_desc: "Napojení na populární aplikace a služby.",
    automation_feature_3_title: "Podmíněná logika",
    automation_feature_3_desc: "Komplexní větvení a rozhodovací pravidla.",
    automation_feature_4_title: "Monitoring",
    automation_feature_4_desc: "Přehled o běžících automatizacích v reálném čase.",
    automation_usecase_title: "Co lze automatizovat?",
    automation_usecase_1: "Synchronizace dat mezi systémy",
    automation_usecase_2: "Notifikace a upozornění",
    automation_usecase_3: "Generování reportů",
    automation_usecase_4: "Onboarding zaměstnanců",
    automation_cta: "Chci konzultaci zdarma",

    // Dev Apps Page
    devapps_meta_title: "Vývoj Aplikací | HypeDigitaly - Webové a mobilní aplikace",
    devapps_meta_desc: "Full-scale vývoj aplikací od designu a architektury po spuštění. Frontend, backend, API, databáze.",
    devapps_badge: "// VÝVOJ APLIKACÍ",
    devapps_title: "Vývoj aplikací na míru",
    devapps_subtitle: "Od návrhu architektury přes implementaci až po nasazení. Moderní technologie a osvědčené postupy pro spolehlivé aplikace.",
    devapps_feature_1_title: "Full-stack vývoj",
    devapps_feature_1_desc: "Frontend, backend, API a databázová vrstva.",
    devapps_feature_2_title: "Moderní technologie",
    devapps_feature_2_desc: "React, TypeScript, Python, Node.js a další.",
    devapps_feature_3_title: "AI integrace",
    devapps_feature_3_desc: "Napojení na LLM modely a AI služby.",
    devapps_feature_4_title: "DevOps & CI/CD",
    devapps_feature_4_desc: "Automatizované nasazování a monitoring.",
    devapps_usecase_title: "Co vyvíjíme?",
    devapps_usecase_1: "Webové aplikace a dashboardy",
    devapps_usecase_2: "API a backendové služby",
    devapps_usecase_3: "Integrace s AI modely",
    devapps_usecase_4: "Interní nástroje a portály",
    devapps_cta: "Chci konzultaci zdarma",

    // Web Design Page
    webdesign_meta_title: "Web Design | HypeDigitaly - Moderní weby a landing pages",
    webdesign_meta_desc: "High-performance weby, které reprezentují vaši značku a zvyšují konverze. Responzivní design, SEO optimalizace.",
    webdesign_badge: "// WEB DESIGN",
    webdesign_title: "Weby, které konvertují",
    webdesign_subtitle: "Moderní design spojený s vysokým výkonem. Vaše webová prezentace bude reprezentativní a efektivní.",
    webdesign_feature_1_title: "Responzivní design",
    webdesign_feature_1_desc: "Perfektní zobrazení na všech zařízeních.",
    webdesign_feature_2_title: "SEO optimalizace",
    webdesign_feature_2_desc: "Technické SEO pro lepší viditelnost ve vyhledávačích.",
    webdesign_feature_3_title: "Rychlost načítání",
    webdesign_feature_3_desc: "Optimalizované Core Web Vitals pro nejlepší UX.",
    webdesign_feature_4_title: "CRO & Analytics",
    webdesign_feature_4_desc: "Konverzní optimalizace a měření výsledků.",
    webdesign_usecase_title: "Co tvoříme?",
    webdesign_usecase_1: "Firemní prezentace",
    webdesign_usecase_2: "Landing pages pro kampaně",
    webdesign_usecase_3: "Produktové weby",
    webdesign_usecase_4: "Portfolia a osobní stránky",
    webdesign_cta: "Chci konzultaci zdarma",

    // Common Service Page Elements
    service_related_title: "Související služby",
    service_related_subtitle: "Prozkoumejte další naše služby",
    service_cta_title: "Zaujala vás tato služba?",
    service_cta_subtitle: "Domluvte si nezávaznou konzultaci a zjistěte, jak vám můžeme pomoci.",
    service_cta_button: "Sjednat konzultaci",
  },
  en: {
    // Services Hub
    services_hub_badge: "// YOUR AI PARTNER",
    services_hub_title: "Your One-Stop AI",
    services_hub_title_2: "Transformation Partner",
    services_hub_subtitle: "From strategy through implementation to ongoing support. Comprehensive AI solutions from a single partner – no coordinating multiple vendors.",
    services_hub_meta_title: "Services | HypeDigitaly - AI Chatbots, Automation, Development",
    services_hub_meta_desc: "Complete AI services portfolio: chatbots, voicebots, AI agents, automation, app development, web design and consulting. Custom solutions for businesses and public sector.",
    services_hub_cta: "Free consultation",
    services_hub_explore: "Learn more",

    // How We Work
    how_we_work_tag: "// METHODOLOGY",
    how_we_work_label: "HOW WE WORK",
    how_we_work_headline_1: "Proven approach",
    how_we_work_headline_2: "to AI transformation",
    how_we_work_subheadline: "No lengthy presentations. We start directly on real cases and implementation.",

    // Voicebot Page
    voicebot_meta_title: "AI Voicebot | HypeDigitaly - Voice Automation",
    voicebot_meta_desc: "Voice communication and phone call automation with natural conversation. Reduce call center costs by up to 40%.",
    voicebot_badge: "// AI VOICEBOT",
    voicebot_title: "Voice Communication Automation",
    voicebot_subtitle: "Intelligent voicebot with natural conversation that handles phone calls 24/7. Reduce call center costs and improve availability.",
    voicebot_feature_1_title: "Natural Conversation",
    voicebot_feature_1_desc: "Advanced speech recognition and voice synthesis for smooth communication.",
    voicebot_feature_2_title: "24/7 Availability",
    voicebot_feature_2_desc: "Continuous call handling without waiting and queues.",
    voicebot_feature_3_title: "CRM Integration",
    voicebot_feature_3_desc: "Connection to your systems for personalized service.",
    voicebot_feature_4_title: "Call Analytics",
    voicebot_feature_4_desc: "Detailed reports and transcripts for process optimization.",
    voicebot_usecase_title: "Who is voicebot ideal for?",
    voicebot_usecase_1: "Call centers with high call volume",
    voicebot_usecase_2: "Customer support and helpdesk",
    voicebot_usecase_3: "Reservation systems and orders",
    voicebot_usecase_4: "Information lines and FAQ",
    voicebot_cta: "Get free consultation",

    // AI Agent Page
    aiagent_meta_title: "AI Agent | HypeDigitaly - Autonomous AI Assistants",
    aiagent_meta_desc: "Autonomous AI agents for complex multi-step tasks without human intervention. Speed up processes by up to 80%.",
    aiagent_badge: "// AI AGENT",
    aiagent_title: "Autonomous AI for Complex Tasks",
    aiagent_subtitle: "AI agent that independently completes multi-step tasks, analyzes data and makes decisions. Free your team from repetitive work.",
    aiagent_feature_1_title: "Autonomous Decision Making",
    aiagent_feature_1_desc: "Agent evaluates situations and chooses optimal approach.",
    aiagent_feature_2_title: "Multi-step Tasks",
    aiagent_feature_2_desc: "Processing complex processes from start to finish.",
    aiagent_feature_3_title: "Learning from Data",
    aiagent_feature_3_desc: "Continuous improvement based on feedback.",
    aiagent_feature_4_title: "API Integration",
    aiagent_feature_4_desc: "Connection with external systems and databases.",
    aiagent_usecase_title: "Where does AI agent excel?",
    aiagent_usecase_1: "Back-office process automation",
    aiagent_usecase_2: "Document and data analysis",
    aiagent_usecase_3: "Personalized recommendations",
    aiagent_usecase_4: "Monitoring and alerting",
    aiagent_cta: "Get free consultation",

    // Automation Page
    automation_meta_title: "AI Automation | HypeDigitaly - Workflow Automation",
    automation_meta_desc: "Enterprise-grade automation for application logic and workflows. Increase efficiency up to 10x.",
    automation_badge: "// AI AUTOMATION",
    automation_title: "Workflow and Process Automation",
    automation_subtitle: "Connect your applications and automate repetitive tasks. From simple workflows to complex enterprise solutions.",
    automation_feature_1_title: "No-code Solution",
    automation_feature_1_desc: "Visual automation creation without programming.",
    automation_feature_2_title: "500+ Integrations",
    automation_feature_2_desc: "Connection to popular applications and services.",
    automation_feature_3_title: "Conditional Logic",
    automation_feature_3_desc: "Complex branching and decision rules.",
    automation_feature_4_title: "Monitoring",
    automation_feature_4_desc: "Overview of running automations in real-time.",
    automation_usecase_title: "What can be automated?",
    automation_usecase_1: "Data synchronization between systems",
    automation_usecase_2: "Notifications and alerts",
    automation_usecase_3: "Report generation",
    automation_usecase_4: "Employee onboarding",
    automation_cta: "Get free consultation",

    // Dev Apps Page
    devapps_meta_title: "App Development | HypeDigitaly - Web and Mobile Apps",
    devapps_meta_desc: "Full-scale application development from design and architecture to deployment. Frontend, backend, API, databases.",
    devapps_badge: "// APP DEVELOPMENT",
    devapps_title: "Custom Application Development",
    devapps_subtitle: "From architecture design through implementation to deployment. Modern technologies and proven practices for reliable applications.",
    devapps_feature_1_title: "Full-stack Development",
    devapps_feature_1_desc: "Frontend, backend, API and database layer.",
    devapps_feature_2_title: "Modern Technologies",
    devapps_feature_2_desc: "React, TypeScript, Python, Node.js and more.",
    devapps_feature_3_title: "AI Integration",
    devapps_feature_3_desc: "Connection to LLM models and AI services.",
    devapps_feature_4_title: "DevOps & CI/CD",
    devapps_feature_4_desc: "Automated deployment and monitoring.",
    devapps_usecase_title: "What do we develop?",
    devapps_usecase_1: "Web applications and dashboards",
    devapps_usecase_2: "APIs and backend services",
    devapps_usecase_3: "AI model integrations",
    devapps_usecase_4: "Internal tools and portals",
    devapps_cta: "Get free consultation",

    // Web Design Page
    webdesign_meta_title: "Web Design | HypeDigitaly - Modern Websites and Landing Pages",
    webdesign_meta_desc: "High-performance websites that represent your brand and increase conversions. Responsive design, SEO optimization.",
    webdesign_badge: "// WEB DESIGN",
    webdesign_title: "Websites That Convert",
    webdesign_subtitle: "Modern design combined with high performance. Your web presence will be representative and effective.",
    webdesign_feature_1_title: "Responsive Design",
    webdesign_feature_1_desc: "Perfect display on all devices.",
    webdesign_feature_2_title: "SEO Optimization",
    webdesign_feature_2_desc: "Technical SEO for better search engine visibility.",
    webdesign_feature_3_title: "Loading Speed",
    webdesign_feature_3_desc: "Optimized Core Web Vitals for best UX.",
    webdesign_feature_4_title: "CRO & Analytics",
    webdesign_feature_4_desc: "Conversion optimization and result measurement.",
    webdesign_usecase_title: "What do we create?",
    webdesign_usecase_1: "Corporate presentations",
    webdesign_usecase_2: "Campaign landing pages",
    webdesign_usecase_3: "Product websites",
    webdesign_usecase_4: "Portfolios and personal pages",
    webdesign_cta: "Get free consultation",

    // Common Service Page Elements
    service_related_title: "Related Services",
    service_related_subtitle: "Explore our other services",
    service_cta_title: "Interested in this service?",
    service_cta_subtitle: "Schedule a free consultation and find out how we can help you.",
    service_cta_button: "Schedule consultation",
  },
};
