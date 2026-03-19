import type { Language } from './types';

export interface DataprepKeys {
  // Hero
  dataprep_hero_badge: string;
  dataprep_hero_headline_1: string;
  dataprep_hero_headline_2: string;
  dataprep_hero_subheadline: string;
  dataprep_hero_subheadline_2: string;
  dataprep_hero_cta: string;

  // Trust
  dataprep_trust_1: string;
  dataprep_trust_2: string;
  dataprep_trust_3: string;

  // RAGus section
  dataprep_ragus_label: string;
  dataprep_ragus_badge: string;
  dataprep_ragus_section_tag: string;
  dataprep_ragus_headline_1: string;
  dataprep_ragus_headline_2: string;
  dataprep_ragus_desc: string;
  dataprep_ragus_comparison_title: string;
  dataprep_ragus_service_label: string;
  dataprep_ragus_service_point_1: string;
  dataprep_ragus_service_point_2: string;
  dataprep_ragus_service_point_3: string;
  dataprep_ragus_platform_point_1: string;
  dataprep_ragus_platform_point_2: string;
  dataprep_ragus_platform_point_3: string;
  dataprep_ragus_feature_1: string;
  dataprep_ragus_feature_2: string;
  dataprep_ragus_feature_3: string;
  dataprep_ragus_feature_4: string;
  dataprep_ragus_cta: string;
  dataprep_ragus_target_1: string;
  dataprep_ragus_target_2: string;
  dataprep_ragus_target_3: string;
  dataprep_ragus_target_4: string;

  // Problem section
  dataprep_problem_tag: string;
  dataprep_problem_label: string;
  dataprep_problem_headline_1: string;
  dataprep_problem_headline_2: string;
  dataprep_problem_desc: string;

  // Pain points
  dataprep_pain_1_title: string;
  dataprep_pain_1_desc: string;
  dataprep_pain_2_title: string;
  dataprep_pain_2_desc: string;
  dataprep_pain_3_title: string;
  dataprep_pain_3_desc: string;

  // Comparison section
  dataprep_comparison_tag: string;
  dataprep_comparison_label: string;
  dataprep_comparison_headline_1: string;
  dataprep_comparison_headline_2: string;
  dataprep_comparison_desc: string;
  dataprep_bad_title: string;
  dataprep_bad_desc: string;
  dataprep_good_title: string;
  dataprep_good_desc: string;

  // AI-ready section
  dataprep_aiready_title: string;
  dataprep_aiready_item_1_title: string;
  dataprep_aiready_item_1_desc: string;
  dataprep_aiready_item_2_title: string;
  dataprep_aiready_item_2_desc: string;
  dataprep_aiready_item_3_title: string;
  dataprep_aiready_item_3_desc: string;
  dataprep_aiready_item_4_title: string;
  dataprep_aiready_item_4_desc: string;
  dataprep_aiready_item_5_title: string;
  dataprep_aiready_item_5_desc: string;
  dataprep_aiready_item_6_title: string;
  dataprep_aiready_item_6_desc: string;
  dataprep_aiready_item_7_title: string;
  dataprep_aiready_item_7_desc: string;

  // Chunking section
  dataprep_chunking_tag: string;
  dataprep_chunking_label: string;
  dataprep_chunking_headline_1: string;
  dataprep_chunking_headline_2: string;
  dataprep_chunking_desc: string;

  // Chunk methods
  dataprep_chunk_1_title: string;
  dataprep_chunk_1_desc: string;
  dataprep_chunk_1_best: string;
  dataprep_chunk_2_title: string;
  dataprep_chunk_2_desc: string;
  dataprep_chunk_2_best: string;
  dataprep_chunk_3_title: string;
  dataprep_chunk_3_desc: string;
  dataprep_chunk_3_best: string;
  dataprep_chunk_4_title: string;
  dataprep_chunk_4_desc: string;
  dataprep_chunk_4_best: string;

  // Process section
  dataprep_process_tag: string;
  dataprep_process_label: string;
  dataprep_process_headline_1: string;
  dataprep_process_headline_2: string;
  dataprep_process_desc: string;

  // Process steps
  dataprep_step_1_title: string;
  dataprep_step_1_desc: string;
  dataprep_step_2_title: string;
  dataprep_step_2_desc: string;
  dataprep_step_3_title: string;
  dataprep_step_3_desc: string;
  dataprep_step_4_title: string;
  dataprep_step_4_desc: string;

  // Formats section
  dataprep_formats_title: string;
  dataprep_formats_desc: string;

  // Pricing section
  dataprep_pricing_tag: string;
  dataprep_pricing_label: string;
  dataprep_pricing_headline_1: string;
  dataprep_pricing_headline_2: string;
  dataprep_pricing_desc: string;

  // Service pricing
  dataprep_service_recommended: string;
  dataprep_service_title: string;
  dataprep_service_desc: string;
  dataprep_service_price_1: string;
  dataprep_service_price_1_desc: string;
  dataprep_service_price_alt: string;
  dataprep_service_price_2: string;
  dataprep_service_price_2_desc: string;
  dataprep_service_feature_1: string;
  dataprep_service_feature_2: string;
  dataprep_service_feature_3: string;
  dataprep_service_feature_4: string;
  dataprep_service_cta: string;

  // DIY pricing
  dataprep_diy_label: string;
  dataprep_diy_title: string;
  dataprep_diy_desc: string;
  dataprep_diy_price: string;
  dataprep_diy_price_desc: string;
  dataprep_diy_feature_1: string;
  dataprep_diy_feature_2: string;
  dataprep_diy_feature_3: string;
  dataprep_diy_feature_4: string;
  dataprep_diy_feature_5: string;
  dataprep_diy_feature_6: string;
  dataprep_diy_feature_7: string;
  dataprep_diy_feature_8: string;
  dataprep_diy_cta: string;

  // FAQ section
  dataprep_faq_tag: string;
  dataprep_faq_headline: string;
  dataprep_faq_1_q: string;
  dataprep_faq_1_a: string;
  dataprep_faq_2_q: string;
  dataprep_faq_2_a: string;
  dataprep_faq_3_q: string;
  dataprep_faq_3_a: string;
  dataprep_faq_4_q: string;
  dataprep_faq_4_a: string;
  dataprep_faq_5_q: string;
  dataprep_faq_5_a: string;
  dataprep_faq_6_q: string;
  dataprep_faq_6_a: string;

  // Contact section
  dataprep_contact_tag: string;
  dataprep_contact_label: string;
  dataprep_contact_headline: string;
  dataprep_contact_desc: string;

  // Navigation
  dataprep_nav_title: string;
  dataprep_nav_desc: string;
}

export const dataprepTranslations: Record<Language, DataprepKeys> = {
  cs: {
    // Hero
    dataprep_hero_badge: "Krok #0 před každým AI projektem",
    dataprep_hero_headline_1: "Bez čistých dat",
    dataprep_hero_headline_2: "vaše AI nikdy nebude fungovat",
    dataprep_hero_subheadline: "Špatná data = špatná AI. Tak jednoduché to je. Vytvoříme vám jeden ucelený zdroj pravdy - váš 'druhý mozek', ze kterého bude AI čerpat. Žádné halucinace. Jen přesné odpovědi.",
    dataprep_hero_subheadline_2: "99% přesnost * Jeden zdroj pravdy * Váš druhý mozek pro AI",
    dataprep_hero_cta: "Zjistit stav mých dat",

    // Trust
    dataprep_trust_1: "Jeden zdroj pravdy",
    dataprep_trust_2: "Jakýkoli formát dat",
    dataprep_trust_3: "99% přesnost AI",

    // RAGus section
    dataprep_ragus_label: "PRO TECHNICKÉ TÝMY",
    dataprep_ragus_badge: "Self-service platforma",
    dataprep_ragus_section_tag: "// SELF-SERVICE PLATFORMA",
    dataprep_ragus_headline_1: "Máte vlastní tým?",
    dataprep_ragus_headline_2: "Dejte jim RAGus.ai",
    dataprep_ragus_desc: "Platforma pro vývojáře a AI týmy, kteří chtějí mít přípravu dat pod kontrolou. Není to jen nástroj - je to kompletní infrastruktura pro RAG systémy. Vše, co potřebujete, na jednom místě.",
    dataprep_ragus_comparison_title: "Která cesta je pro vás?",
    dataprep_ragus_service_label: "Profesionální služba",
    dataprep_ragus_service_point_1: "Nemáte kapacitu řešit přípravu dat",
    dataprep_ragus_service_point_2: "Chcete garantovaný výsledek bez starostí",
    dataprep_ragus_service_point_3: "Oceníte expertní vedení a podporu",
    dataprep_ragus_platform_point_1: "Máte technický tým a chcete kontrolu",
    dataprep_ragus_platform_point_2: "Potřebujete automatizaci a škálování",
    dataprep_ragus_platform_point_3: "Stavíte vlastní AI produkty",
    dataprep_ragus_feature_1: "Centralizovaný dashboard pro správu všech vašich AI produktů",
    dataprep_ragus_feature_2: "Pokročilá analytika, statistiky konverzací a detailní reporting",
    dataprep_ragus_feature_3: "Integrovaný helpdesk pro efektivní řešení dotazů a eskalací",
    dataprep_ragus_feature_4: "Přímé napojení na OpenAI, Voiceflow, Pinecone a Qdrant",
    dataprep_ragus_cta: "Vyzkoušet RAGus.ai zdarma",
    dataprep_ragus_target_1: "RAG vývojáři",
    dataprep_ragus_target_2: "Enterprise AI týmy",
    dataprep_ragus_target_3: "No-code buildeři",
    dataprep_ragus_target_4: "AI agentury",

    // Problem section
    dataprep_problem_tag: "// PROČ 90 % AI PROJEKTŮ SELŽE",
    dataprep_problem_label: "PRAVDA, KTEROU NIKDO NEŘÍKÁ",
    dataprep_problem_headline_1: "Problém není v AI.",
    dataprep_problem_headline_2: "Problém jsou vaše data.",
    dataprep_problem_desc: "Koupili jste si drahý AI nástroj. Nasadili ho. A teď? Halucinuje. Odpovídá nesmysly. Vrací zastaralé informace. Proč? Protože jste přeskočili ten nejdůležitější krok - přípravu dat.",

    // Pain points
    dataprep_pain_1_title: "Roztroušená data",
    dataprep_pain_1_desc: "Data jsou rozházená v Excelu, PDF, na webu, v databázích... a něco jen v hlavě kolegy. AI nemá šanci najít správnou odpověď, když neví, kde přesně hledat.",
    dataprep_pain_2_title: "Duplicity a nekonzistence",
    dataprep_pain_2_desc: "Stejná informace existuje na 5 místech v 5 různých verzích. AI pak vrací protichůdné nebo zastaralé odpovědi.",
    dataprep_pain_3_title: "Halucinace a nepřesnosti",
    dataprep_pain_3_desc: "AI si vymýšlí fakta, protože pracuje s neúplnými nebo špatně strukturovanými daty. Klienti ztrácí důvěru.",

    // Comparison section
    dataprep_comparison_tag: "// TOHLE DĚLÁ ROZDÍL",
    dataprep_comparison_label: "PŘED A PO",
    dataprep_comparison_headline_1: "Chaos vs. řád.",
    dataprep_comparison_headline_2: "Halucinace vs. přesnost.",
    dataprep_comparison_desc: "Stejná AI, stejný model, stejné prompty. Jediný rozdíl? Kvalita dat. Podívejte se, jak vypadá realita.",
    dataprep_bad_title: "Typická realita",
    dataprep_bad_desc: "Chaos. Duplicity. Chybějící kontext. AI hádá.",
    dataprep_good_title: "Po naší přípravě",
    dataprep_good_desc: "Čistá struktura. Metadata. Kontext. AI ví.",

    // AI-ready section
    dataprep_aiready_title: "Co dělá data \"AI-ready\"?",
    dataprep_aiready_item_1_title: "Celé myšlenky, ne útržky",
    dataprep_aiready_item_1_desc: "Text není useklý v půlce věty. AI dostane kompletní informaci a nemusí hádat, co následuje.",
    dataprep_aiready_item_2_title: "Jasná hierarchie",
    dataprep_aiready_item_2_desc: "AI přesně ví, kde hledat odpovědi a kde jsou jen pomocná data. Žádné plácání v temnotě.",
    dataprep_aiready_item_3_title: "Předpřipravené otázky",
    dataprep_aiready_item_3_desc: "Ke každému kousku textu jsou přiřazené otázky, na které odpovídá. AI najde správnou odpověď, i když se uživatel zeptá jinak.",
    dataprep_aiready_item_4_title: "Shrnutí u každého bloku",
    dataprep_aiready_item_4_desc: "AI okamžitě chápe kontext. Nemusí číst celý dokument, aby pochopila, o čem daný kousek je.",
    dataprep_aiready_item_5_title: "Propojení mezi částmi",
    dataprep_aiready_item_5_desc: "Každý blok ví, co bylo před ním. AI chápe souvislosti, i když je informace rozdělena do více částí.",
    dataprep_aiready_item_6_title: "Metadata pro filtraci",
    dataprep_aiready_item_6_desc: "Datum, kategorie, zdroj. AI může hledat přesně tam, kde má. \"Najdi v dokumentech z roku 2024\" - hotovo.",
    dataprep_aiready_item_7_title: "Původ každé informace",
    dataprep_aiready_item_7_desc: "I malý útržek textu ví, odkud pochází. AI může citovat zdroj a vy víte, že to není vymyšlené.",

    // Chunking section
    dataprep_chunking_tag: "// JAK TO DĚLÁME",
    dataprep_chunking_label: "TECHNICKÉ DETAILY",
    dataprep_chunking_headline_1: "Správné dělení dat",
    dataprep_chunking_headline_2: "= správné odpovědi",
    dataprep_chunking_desc: "AI nečte celé dokumenty. Pracuje s \"chunky\" - kousky textu. Jak je rozdělíte, tak vám bude odpovídat. Špatné dělení = špatné výsledky.",

    // Chunk methods
    dataprep_chunk_1_title: "Tokenová metoda",
    dataprep_chunk_1_desc: "Rychlé, jednoduché. Ale často utrhne myšlenku v půlce. Základní varianta.",
    dataprep_chunk_1_best: "Jednoduché texty",
    dataprep_chunk_2_title: "Podle struktury",
    dataprep_chunk_2_desc: "Respektuje nadpisy a odstavce. Drží témata pohromadě.",
    dataprep_chunk_2_best: "Dokumentace, návody",
    dataprep_chunk_3_title: "Sémantická",
    dataprep_chunk_3_desc: "AI rozpozná, kde končí jedna myšlenka a začíná druhá. Chytřejší volba.",
    dataprep_chunk_3_best: "Články, delší texty",
    dataprep_chunk_4_title: "Agentní (LLM)",
    dataprep_chunk_4_desc: "AI sama rozhoduje, jak text rozdělit. Nejvyšší přesnost. Naše specialita.",
    dataprep_chunk_4_best: "Komplexní projekty",

    // Process section
    dataprep_process_tag: "// 4 KROKY K FUNGUJÍCÍ AI",
    dataprep_process_label: "NÁŠ POSTUP",
    dataprep_process_headline_1: "Z chaosu k jednomu zdroji pravdy.",
    dataprep_process_headline_2: "Váš druhý mozek.",
    dataprep_process_desc: "Nezáleží, kde máte data ani v jakém formátu. Vše propojíme do jednoho uceleného místa - znalostní báze, ze které AI čerpá. Žádné hledání. Žádné hádání.",

    // Process steps
    dataprep_step_1_title: "Zmapujeme zdroje",
    dataprep_step_1_desc: "Projdeme všechno - web, dokumenty, databáze, e-maily, interní systémy. Zjistíme, co máte a v jakém stavu.",
    dataprep_step_2_title: "Vyčistíme a sjednotíme",
    dataprep_step_2_desc: "Pryč s duplicitami. Pryč s nekonzistencemi. Jeden zdroj pravdy. Jedna struktura.",
    dataprep_step_3_title: "Obohatíme a rozdělíme",
    dataprep_step_3_desc: "Přidáme metadata, shrnutí, souvislosti. Rozdělíme optimální strategií. AI pak ví, kde hledat.",
    dataprep_step_4_title: "Vytvoříme váš druhý mozek",
    dataprep_step_4_desc: "Vše nahrajeme do jedné znalostní báze - vašeho centrálního zdroje pravdy. OpenAI, Pinecone, Qdrant, Voiceflow. AI má odkud čerpat.",

    // Formats section
    dataprep_formats_title: "Formát? Jakýkoli.",
    dataprep_formats_desc: "PDF, Word, Excel, PowerPoint, CSV, JSON, XML, HTML, weby, e-maily, databáze, API, RSS, OpenData... Prostě cokoli.",

    // Pricing section
    dataprep_pricing_tag: "// DVĚ CESTY",
    dataprep_pricing_label: "VYBERTE SI",
    dataprep_pricing_headline_1: "Kompletní realizace",
    dataprep_pricing_headline_2: "nebo vlastní správa?",
    dataprep_pricing_desc: "Vyberte si cestu, která sedí vašim potřebám. Buď vám dodáme data na klíč, nebo vašemu týmu poskytneme špičkový nástroj.",

    // Service pricing
    dataprep_service_recommended: "DOPORUČENO",
    dataprep_service_title: "Příprava dat na klíč",
    dataprep_service_desc: "Kompletní příprava dat našimi experty. Stačí nám poskytnout datové zdroje a my vám dodáme vyčištěná data připravená pro AI.",
    dataprep_service_price_1: "od 2 500 Kč/hod",
    dataprep_service_price_1_desc: "Pro menší projekty a jednorázové práce",
    dataprep_service_price_alt: "nebo",
    dataprep_service_price_2: "od 15 000 Kč",
    dataprep_service_price_2_desc: "Paušál za celý datový zdroj",
    dataprep_service_feature_1: "Kompletní audit vašich dat",
    dataprep_service_feature_2: "Extrakce z libovolného formátu",
    dataprep_service_feature_3: "Čištění, strukturování, obohacení",
    dataprep_service_feature_4: "Napojení přímo do vaší AI",
    dataprep_service_cta: "Chci nabídku na míru",

    // DIY pricing
    dataprep_diy_label: "SELF-SERVICE",
    dataprep_diy_title: "Platforma pro váš tým",
    dataprep_diy_desc: "Dejte svým vývojářům nástroj RAGus.ai. Získají plnou kontrolu nad přípravou dat bez závislosti na externím dodavateli.",
    dataprep_diy_price: "od $49.99/měsíc",
    dataprep_diy_price_desc: "Starter plan - začněte hned",
    dataprep_diy_feature_1: "Jeden přehledný dashboard pro všechny vaše AI projekty",
    dataprep_diy_feature_2: "Prohlížení a hodnocení konverzací v reálném čase",
    dataprep_diy_feature_3: "Přehledné statistiky a automatické reporty",
    dataprep_diy_feature_4: "Helpdesk pro eskalované a složité dotazy",
    dataprep_diy_feature_5: "Automatická synchronizace znalostní báze",
    dataprep_diy_feature_6: "Integrace: OpenAI, Voiceflow, Pinecone, Qdrant",
    dataprep_diy_feature_7: "4 chunkovací strategie včetně AI",
    dataprep_diy_feature_8: "Zpětná vazba a trénování AI na míru",
    dataprep_diy_cta: "Vytvořit účet zdarma",

    // FAQ section
    dataprep_faq_tag: "// ČASTÉ OTÁZKY",
    dataprep_faq_headline: "Ptáte se nás",
    dataprep_faq_1_q: "Máme data v různých formátech. Je to problém?",
    dataprep_faq_1_a: "Ne. Zpracujeme cokoli - PDF, Word, Excel, weby, databáze, e-maily, API. Formát nehraje roli. Vše sjednotíme do podoby, které AI rozumí.",
    dataprep_faq_2_q: "Jak rychle to bude hotové?",
    dataprep_faq_2_a: "Střední projekt 1-2 týdny. Spěcháte? Nabízíme expresní zpracování do několika dnů. Záleží na objemu a složitosti dat.",
    dataprep_faq_3_q: "Data máme všude možně. Jde to vůbec dát dohromady?",
    dataprep_faq_3_a: "Přesně tohle řešíme. Propojíme desítky zdrojů do jedné znalostní báze - vašeho 'druhého mozku'. AI pak čerpá z jednoho uceleného místa. Konec chaosu.",
    dataprep_faq_4_q: "Jak zajistíte, že AI nebude halucinovat?",
    dataprep_faq_4_a: "Halucinace = špatná data. Odstraníme duplicity, přidáme kontext a metadata, sjednotíme formáty. Výsledek? 99% přesnost odpovědí místo hádání.",
    dataprep_faq_5_q: "Jaký je rozdíl mezi službou a RAGus.ai?",
    dataprep_faq_5_a: "Služba = uděláme to za vás komplet na klíč. RAGus.ai = self-service platforma, kde si to uděláte sami. Záleží, jestli máte čas a lidi.",
    dataprep_faq_6_q: "Kolik to bude stát?",
    dataprep_faq_6_a: "Služba: od 2 500 Kč/hod nebo od 15 000 Kč za datový zdroj. RAGus.ai: od $49.99/měsíc. Přesnou cenu řekneme po bezplatné konzultaci - záleží na objemu a složitosti.",

    // Contact section
    dataprep_contact_tag: "// DALŠÍ KROK",
    dataprep_contact_label: "30 MINUT, KTERÉ VÁM UŠETŘÍ MĚSÍCE",
    dataprep_contact_headline: "Vytvořte si svůj druhý mozek pro AI",
    dataprep_contact_desc: "Bezplatná konzultace. Ukážeme vám, jak z rozházených dat vytvořit jeden ucelený zdroj, ze kterého bude AI čerpat.",

    // Navigation
    dataprep_nav_title: "Příprava dat pro AI",
    dataprep_nav_desc: "Čistá data = přesná AI",
  },
  en: {
    // Hero
    dataprep_hero_badge: "Foundation of Successful AI",
    dataprep_hero_headline_1: "Your AI is only as good",
    dataprep_hero_headline_2: "as your data",
    dataprep_hero_subheadline: "Poor data = hallucinating AI. We prepare your data for AI so it responds accurately and without errors. Regardless of format or where it's stored.",
    dataprep_hero_subheadline_2: "99% accuracy * Any data format * Centralized in one place",
    dataprep_hero_cta: "I want quality AI data",

    // Trust
    dataprep_trust_1: "Direct data source integration",
    dataprep_trust_2: "Any format",
    dataprep_trust_3: "99% accuracy",

    // RAGus section
    dataprep_ragus_label: "SELF-SERVICE",
    dataprep_ragus_badge: "Self-service platform",
    dataprep_ragus_section_tag: "// SELF-SERVICE PLATFORM",
    dataprep_ragus_headline_1: "Want to prepare data yourself?",
    dataprep_ragus_headline_2: "Try RAGus.ai",
    dataprep_ragus_desc: "RAGus.ai is our SaaS platform designed for developers, AI agencies, and technical teams who want full control over data preparation. It's not just a tool - it's a complete infrastructure for RAG systems.",
    dataprep_ragus_comparison_title: "Who is each option for?",
    dataprep_ragus_service_label: "Professional Service",
    dataprep_ragus_service_point_1: "You don't have time or capacity for data preparation",
    dataprep_ragus_service_point_2: "You need guaranteed turnkey results",
    dataprep_ragus_service_point_3: "You want expert consultation and support",
    dataprep_ragus_platform_point_1: "You have a technical team and want full control",
    dataprep_ragus_platform_point_2: "You prepare data regularly and need automation",
    dataprep_ragus_platform_point_3: "You're building AI products and need to scale",
    dataprep_ragus_feature_1: "Centralized dashboard for managing all your AI products",
    dataprep_ragus_feature_2: "Advanced analytics, conversation stats, and detailed reporting",
    dataprep_ragus_feature_3: "Integrated helpdesk for efficient inquiry handling and escalation",
    dataprep_ragus_feature_4: "Direct integration with OpenAI, Voiceflow, Pinecone, and Qdrant",
    dataprep_ragus_cta: "Try RAGus.ai for free",
    dataprep_ragus_target_1: "RAG developers",
    dataprep_ragus_target_2: "Enterprise AI teams",
    dataprep_ragus_target_3: "No-code builders",
    dataprep_ragus_target_4: "AI agencies",

    // Problem section
    dataprep_problem_tag: "// WHY AI PROJECTS FAIL",
    dataprep_problem_label: "ROOT CAUSE",
    dataprep_problem_headline_1: "90% of AI problems",
    dataprep_problem_headline_2: "start with data",
    dataprep_problem_desc: "Investing in AI but results don't meet expectations? The problem isn't the model or prompts. The problem is the data you're feeding your AI.",

    // Pain points
    dataprep_pain_1_title: "Scattered data",
    dataprep_pain_1_desc: "Data is scattered across Excel, PDFs, websites, databases, emails. AI can't find the right answer when it doesn't know where to look.",
    dataprep_pain_2_title: "Duplicates and inconsistencies",
    dataprep_pain_2_desc: "Same information exists in 5 places in 5 different versions. AI then returns contradictory or outdated answers.",
    dataprep_pain_3_title: "Hallucinations and inaccuracies",
    dataprep_pain_3_desc: "AI makes up facts because it works with incomplete or poorly structured data. Clients lose trust.",

    // Comparison section
    dataprep_comparison_tag: "// DATA QUALITY IN PRACTICE",
    dataprep_comparison_label: "BEFORE AND AFTER",
    dataprep_comparison_headline_1: "The difference between failure",
    dataprep_comparison_headline_2: "and 99% accuracy",
    dataprep_comparison_desc: "See how data looks before and after our preparation. Quality structure = quality AI responses.",
    dataprep_bad_title: "Poor quality data",
    dataprep_bad_desc: "Unstructured, duplicate, no context. AI hallucinates.",
    dataprep_good_title: "Prepared data",
    dataprep_good_desc: "Clean, structured, with metadata. AI responds accurately.",

    // AI-ready section
    dataprep_aiready_title: "What makes data \"AI-ready\"?",
    dataprep_aiready_item_1_title: "Whole thoughts, not fragments",
    dataprep_aiready_item_1_desc: "Text is not cut off mid-sentence. AI receives complete information and doesn't have to guess what follows.",
    dataprep_aiready_item_2_title: "Clear hierarchy",
    dataprep_aiready_item_2_desc: "AI knows exactly where to look for answers and what is just auxiliary data. No more shots in the dark.",
    dataprep_aiready_item_3_title: "Pre-prepared questions",
    dataprep_aiready_item_3_desc: "Each piece of text has associated questions it answers. AI finds the right answer even if the user asks differently.",
    dataprep_aiready_item_4_title: "Summary for each block",
    dataprep_aiready_item_4_desc: "AI immediately understands the context. It doesn't have to read the whole document to understand what a specific piece is about.",
    dataprep_aiready_item_5_title: "Links between parts",
    dataprep_aiready_item_5_desc: "Each block knows what came before it. AI understands context even if information is split across multiple parts.",
    dataprep_aiready_item_6_title: "Metadata for filtering",
    dataprep_aiready_item_6_desc: "Date, category, source. AI can search exactly where it should. \"Find in documents from 2024\" - done.",
    dataprep_aiready_item_7_title: "Origin of every information",
    dataprep_aiready_item_7_desc: "Even a small snippet of text knows where it came from. AI can cite the source and you know it's not made up.",

    // Chunking section
    dataprep_chunking_tag: "// CHUNKING STRATEGIES",
    dataprep_chunking_label: "TECHNICAL DEPTH",
    dataprep_chunking_headline_1: "How to properly split",
    dataprep_chunking_headline_2: "data for AI",
    dataprep_chunking_desc: "Chunking (splitting text into smaller parts) is key for quality RAG. We use 4 strategies based on content type.",

    // Chunk methods
    dataprep_chunk_1_title: "Token-Based",
    dataprep_chunk_1_desc: "Basic splitting by fixed token count with overlap.",
    dataprep_chunk_1_best: "Simple documents",
    dataprep_chunk_2_title: "Header-Based",
    dataprep_chunk_2_desc: "Respects document structure by headers (H1, H2...).",
    dataprep_chunk_2_best: "Documentation, guides",
    dataprep_chunk_3_title: "Semantic",
    dataprep_chunk_3_desc: "AI analyzes meaning and splits by topics.",
    dataprep_chunk_3_best: "Complex texts",
    dataprep_chunk_4_title: "Agentic/LLM",
    dataprep_chunk_4_desc: "LLM intelligently analyzes and creates optimal chunks.",
    dataprep_chunk_4_best: "Enterprise projects",

    // Process section
    dataprep_process_tag: "// OUR PROCESS",
    dataprep_process_label: "HOW WE WORK",
    dataprep_process_headline_1: "From chaos to accuracy",
    dataprep_process_headline_2: "in 4 steps",
    dataprep_process_desc: "It doesn't matter where or in what format your data is. We process anything and prepare it for AI.",

    // Process steps
    dataprep_step_1_title: "Data source audit",
    dataprep_step_1_desc: "We map all your data sources - websites, documents, databases, emails, internal systems, RSS feeds, external applications, open data.",
    dataprep_step_2_title: "Extraction, cleaning, unification",
    dataprep_step_2_desc: "We extract data from any format, remove duplicates, fix errors and unify structure.",
    dataprep_step_3_title: "Splitting and enrichment",
    dataprep_step_3_desc: "We split data with optimal strategy and add metadata, summaries and keywords. This results in significantly better retrieval for any subsequent AI operations.",
    dataprep_step_4_title: "AI knowledge base integration",
    dataprep_step_4_desc: "We can save the resulting data and upload it directly to your required system, knowledge base or vector database (e.g. Microsoft Azure, OpenAI, Qdrant, Pinecone, Voiceflow, etc.)",

    // Formats section
    dataprep_formats_title: "We process any format",
    dataprep_formats_desc: "PDF, Word, Excel, PowerPoint, CSV, JSON, XML, HTML, Markdown, emails, databases, APIs, RSS, OpenData, documents...",

    // Pricing section
    dataprep_pricing_tag: "// PRICING",
    dataprep_pricing_label: "TRANSPARENT PRICES",
    dataprep_pricing_headline_1: "Choose your way",
    dataprep_pricing_headline_2: "of collaboration",
    dataprep_pricing_desc: "Professional service or self-service platform. Depends on your needs and capacity.",

    // Service pricing
    dataprep_service_recommended: "RECOMMENDED",
    dataprep_service_title: "Professional Service",
    dataprep_service_desc: "Complete turnkey data preparation. We do it for you.",
    dataprep_service_price_1: "from $300/hour",
    dataprep_service_price_1_desc: "Hourly rate for smaller projects",
    dataprep_service_price_alt: "or",
    dataprep_service_price_2: "$2,000+",
    dataprep_service_price_2_desc: "Flat rate per data source",
    dataprep_service_feature_1: "Analysis and audit of all sources",
    dataprep_service_feature_2: "Extraction from any format",
    dataprep_service_feature_3: "Cleaning, structuring, enrichment",
    dataprep_service_feature_4: "Integration into your knowledge base",
    dataprep_service_cta: "Request service",

    // DIY pricing
    dataprep_diy_label: "SELF-SERVICE",
    dataprep_diy_title: "Self-service: RAGus.ai",
    dataprep_diy_desc: "Our SaaS platform for those who want to prepare data themselves.",
    dataprep_diy_price: "from $49.99/month",
    dataprep_diy_price_desc: "Starter subscription",
    dataprep_diy_feature_1: "One clear dashboard for all your AI projects",
    dataprep_diy_feature_2: "View and rate conversations in real-time",
    dataprep_diy_feature_3: "Clear statistics and automatic reports",
    dataprep_diy_feature_4: "Helpdesk for escalated and complex queries",
    dataprep_diy_feature_5: "Automatic knowledge base synchronization",
    dataprep_diy_feature_6: "Integration: OpenAI, Voiceflow, Pinecone, Qdrant",
    dataprep_diy_feature_7: "4 chunking strategies including AI",
    dataprep_diy_feature_8: "Feedback and custom AI training",
    dataprep_diy_cta: "Create free account",

    // FAQ section
    dataprep_faq_tag: "// FREQUENTLY ASKED",
    dataprep_faq_headline: "Frequently asked questions",
    dataprep_faq_1_q: "Does it matter what format our data is in?",
    dataprep_faq_1_a: "Not at all. We process anything - PDF, Word, Excel, websites, databases, emails, API exports. Format, structure, or number of sources doesn't matter. We unify everything into a consistent format optimized for AI.",
    dataprep_faq_2_q: "How long until our data is ready?",
    dataprep_faq_2_a: "Depends on volume and complexity of your data. Typically 1-2 weeks for a medium project. We offer express processing within a few days for urgent cases.",
    dataprep_faq_3_q: "Our data is scattered across multiple places. Is that a problem?",
    dataprep_faq_3_a: "On the contrary - that's exactly what we solve. We connect and centralize data from dozens of different sources into one knowledge base. No more searching across systems and applications.",
    dataprep_faq_4_q: "How do you prevent AI from hallucinating?",
    dataprep_faq_4_a: "Hallucinations come from poor or incomplete data. We remove duplicates, unify formats, add context, metadata, and optimized RAG questions. The result is 99% response accuracy.",
    dataprep_faq_5_q: "What's the difference between professional service and RAGus.ai?",
    dataprep_faq_5_a: "Professional service = we do everything for you turnkey, including consultation and integration. RAGus.ai = self-service SaaS platform where you prepare data yourself using our advanced tools.",
    dataprep_faq_6_q: "What determines the final price for data preparation?",
    dataprep_faq_6_a: "Price depends on data volume, number of sources, and their complexity. Professional service from $300/hour or $2,000+ per data source. Self-service RAGus.ai from $49.99/month. You'll get exact pricing after free consultation.",

    // Contact section
    dataprep_contact_tag: "// CONTACT",
    dataprep_contact_label: "FREE CONSULTATION",
    dataprep_contact_headline: "I want quality AI data",
    dataprep_contact_desc: "We'll analyze your data sources and propose the optimal solution. 30-minute consultation free of charge.",

    // Navigation
    dataprep_nav_title: "Data Preparation for AI",
    dataprep_nav_desc: "Clean data, accurate AI",
  },
};
