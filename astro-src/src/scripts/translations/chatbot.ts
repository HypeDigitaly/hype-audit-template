import type { Language } from './types';
import { site } from '../../config/site';

export interface ChatbotKeys {
  // Hero
  chatbot_hero_badge: string;
  chatbot_hero_headline_1: string;
  chatbot_hero_headline_2: string;
  chatbot_hero_subheadline: string;
  chatbot_hero_subheadline_2: string;
  chatbot_hero_cta: string;

  // Trust
  chatbot_trust_1: string;
  chatbot_trust_2: string;
  chatbot_trust_3: string;

  // Features section
  chatbot_features_tag: string;
  chatbot_features_label: string;
  chatbot_features_headline_1: string;
  chatbot_features_headline_2: string;
  chatbot_features_desc: string;

  // Features (f1-f8)
  chatbot_f1_title: string;
  chatbot_f1_desc: string;
  chatbot_f2_title: string;
  chatbot_f2_desc: string;
  chatbot_f3_title: string;
  chatbot_f3_desc: string;
  chatbot_f4_title: string;
  chatbot_f4_desc: string;
  chatbot_f5_title: string;
  chatbot_f5_desc: string;
  chatbot_f6_title: string;
  chatbot_f6_desc: string;
  chatbot_f7_title: string;
  chatbot_f7_desc: string;
  chatbot_f8_title: string;
  chatbot_f8_desc: string;

  // Benefits section
  chatbot_benefits_tag: string;
  chatbot_benefits_label: string;
  chatbot_benefits_headline_1: string;
  chatbot_benefits_headline_2: string;
  chatbot_benefits_desc: string;

  // Benefits (1-6)
  benefit_1_title: string;
  benefit_1_desc: string;
  benefit_2_title: string;
  benefit_2_desc: string;
  benefit_3_title: string;
  benefit_3_desc: string;
  benefit_4_title: string;
  benefit_4_desc: string;
  benefit_5_title: string;
  benefit_5_desc: string;
  benefit_6_title: string;
  benefit_6_desc: string;

  // FAQ section
  chatbot_faq_tag: string;
  chatbot_faq_headline: string;
  chatbot_faq_1_q: string;
  chatbot_faq_1_a: string;
  chatbot_faq_2_q: string;
  chatbot_faq_2_a: string;
  chatbot_faq_3_q: string;
  chatbot_faq_3_a: string;
  chatbot_faq_4_q: string;
  chatbot_faq_4_a: string;
  chatbot_faq_5_q: string;
  chatbot_faq_5_a: string;
  chatbot_faq_6_q: string;
  chatbot_faq_6_a: string;
  chatbot_faq_7_q: string;
  chatbot_faq_7_a: string;
  chatbot_faq_8_q: string;
  chatbot_faq_8_a: string;
  chatbot_faq_9_q: string;
  chatbot_faq_9_a: string;
  chatbot_faq_10_q: string;
  chatbot_faq_10_a: string;
  chatbot_faq_11_q: string;
  chatbot_faq_11_a: string;
  chatbot_faq_12_q: string;
  chatbot_faq_12_a: string;
  chatbot_faq_13_q: string;
  chatbot_faq_13_a: string;
  chatbot_faq_14_q: string;
  chatbot_faq_14_a: string;
  chatbot_faq_15_q: string;
  chatbot_faq_15_a: string;

  // Results section
  chatbot_results_tag: string;
  chatbot_results_label: string;
  chatbot_results_headline_1: string;
  chatbot_results_headline_2: string;
  chatbot_results_desc: string;
  chatbot_results_stat_1: string;
  chatbot_results_stat_1_label: string;
  chatbot_results_stat_2: string;
  chatbot_results_stat_2_label: string;
  chatbot_results_stat_3: string;
  chatbot_results_stat_3_label: string;
  chatbot_results_stat_4: string;
  chatbot_results_stat_4_label: string;
  chatbot_results_note: string;

  // Contact section
  chatbot_contact_tag: string;
  chatbot_contact_label: string;
  chatbot_contact_headline: string;
  chatbot_contact_desc: string;
  chatbot_contact_cta: string;

  // Security section
  chatbot_sec_tag: string;
  chatbot_sec_headline: string;
  chatbot_sec_pii_title: string;
  chatbot_sec_pii_desc: string;
  chatbot_sec_dpa_title: string;
  chatbot_sec_dpa_desc: string;
  chatbot_sec_storage_title: string;
  chatbot_sec_storage_ip: string;
  chatbot_sec_storage_browser: string;
  chatbot_sec_storage_transcripts: string;
  chatbot_sec_cert_iso: string;
  chatbot_sec_cert_soc: string;
  chatbot_sec_cert_gdpr: string;
  chatbot_sec_cert_aiact: string;

  // Technology section
  chatbot_tech_tag: string;
  chatbot_tech_headline: string;
  chatbot_tech_rag_title: string;
  chatbot_tech_rag_desc: string;
  chatbot_tech_llm_title: string;
  chatbot_tech_llm_desc: string;
  chatbot_tech_stream_title: string;
  chatbot_tech_stream_desc: string;

  // Admin panel section
  chatbot_admin_tag: string;
  chatbot_admin_headline: string;
  chatbot_admin_f1_title: string;
  chatbot_admin_f1_desc: string;
  chatbot_admin_f2_title: string;
  chatbot_admin_f2_desc: string;
  chatbot_admin_f3_title: string;
  chatbot_admin_f3_desc: string;

  // Pricing section
  chatbot_price_tag: string;
  chatbot_price_headline: string;
  chatbot_price_setup: string;
  chatbot_price_monthly: string;
  chatbot_price_tier1: string;
  chatbot_price_tier2: string;
  chatbot_price_tier3: string;
  chatbot_price_tier4: string;
  chatbot_price_tier5: string;
  chatbot_price_include_1: string;
  chatbot_price_include_2: string;
  chatbot_price_include_3: string;
  chatbot_price_public_admin_badge: string;
  chatbot_price_description: string;
  chatbot_price_credits_header: string;
  chatbot_price_footnote: string;
  chatbot_price_custom_cta: string;
  chatbot_price_column_population: string;
  chatbot_price_extra_credit: string;
  chatbot_price_hourly_rate: string;
  chatbot_price_credit_rollover: string;

  // Pricing table values
  chatbot_price_tier1_setup: string;
  chatbot_price_tier1_monthly: string;
  chatbot_price_tier1_credits: string;
  chatbot_price_tier2_setup: string;
  chatbot_price_tier2_monthly: string;
  chatbot_price_tier2_credits: string;
  chatbot_price_tier3_setup: string;
  chatbot_price_tier3_monthly: string;
  chatbot_price_tier3_credits: string;
  chatbot_price_tier4_setup: string;
  chatbot_price_tier4_monthly: string;
  chatbot_price_tier4_credits: string;
  chatbot_price_tier5_setup: string;
  chatbot_price_tier5_monthly: string;
  chatbot_price_tier5_credits: string;
}

export const chatbotTranslations: Record<Language, ChatbotKeys> = {
  cs: {
    // Hero
    chatbot_hero_badge: "Nejlepší AI chatbot v ČR",
    chatbot_hero_headline_1: "AI Chatbot",
    chatbot_hero_headline_2: "pro váš web",
    chatbot_hero_subheadline: "Probuďte svoji společnost či instituci k životu s AI chatbotem přesně na míru. Zautomatizujte rutinní, opakující se komunikaci a zákaznickou podporu.",
    chatbot_hero_subheadline_2: "90%+ přesnost odpovědí * 24/7/365 dostupnost * 150+ jazyků",
    chatbot_hero_cta: "Chci AI chatbota",

    // Trust
    chatbot_trust_1: "5 krajů v ČR",
    chatbot_trust_2: "35 000+ odpovědí",
    chatbot_trust_3: "Bez závazku",

    // Features section
    chatbot_features_tag: "// UNIKÁTNÍ VLASTNOSTI",
    chatbot_features_label: "PROČ NÁŠ CHATBOT",
    chatbot_features_headline_1: "V čem je náš",
    chatbot_features_headline_2: "AI chatbot unikátní?",
    chatbot_features_desc: `V dnešní době největší problém s AI chatboty je neaktuálnost informací a přesnost odpovědí. V ${site.name} jsme oba tyto problémy vyřešili.`,

    // Features (f1-f8)
    chatbot_f1_title: "90%+ přesnost odpovědí",
    chatbot_f1_desc: "Dosahujeme nejvyšší přesnosti na trhu díky vlastní RAG technologii a kontinuálnímu vylepšování.",
    chatbot_f2_title: "Automatické aktualizace",
    chatbot_f2_desc: "Jediné řešení v ČR s automatickou synchronizací znalostí z vašeho webu bez manuálních zásahů.",
    chatbot_f3_title: "24/7/365 dostupnost",
    chatbot_f3_desc: "Chatbot je k dispozici nepřetržitě, zákazníci dostanou odpovědi i mimo běžnou pracovní dobu.",
    chatbot_f4_title: "150+ jazyků",
    chatbot_f4_desc: "Automatická detekce jazyka a odpověď v jazyce zákazníka. Komunikujte s celým světem.",
    chatbot_f5_title: "Pokročilá analytika",
    chatbot_f5_desc: "Dashboard s trendy, tématy, spokojeností a časovými vzorci pro data-driven rozhodování.",
    chatbot_f6_title: "Nadstandardní zabezpečení",
    chatbot_f6_desc: "Ochrana proti DDOS, spamu, jailbreakingu a prompt injection. Kontrola IP adres.",
    chatbot_f7_title: "Hlasový vstup",
    chatbot_f7_desc: "Převod řeči na text umožňuje uživatelům mluvit místo psaní. Ideální pro mobilní zařízení.",
    chatbot_f8_title: "Plný soulad s GDPR",
    chatbot_f8_desc: "Kompletní dokumentace zpracovaná advokátní kanceláří LEGITAS. Bezpečné a právně ošetřené řešení.",

    // Benefits section
    chatbot_benefits_tag: "// CO ZÍSKÁTE",
    chatbot_benefits_label: "HLAVNÍ VÝHODY",
    chatbot_benefits_headline_1: "Odemkněte potenciál",
    chatbot_benefits_headline_2: "své firmy s AI Chatbotem",
    chatbot_benefits_desc: "Hlavní výhody, které získáte implementací AI chatbota na vaše webové stránky.",

    // Benefits (1-6)
    benefit_1_title: "Úspora nákladů",
    benefit_1_desc: "AI Chatbot dokáže nahradit nebo doplnit lidskou zákaznickou podporu. Není potřeba platit za školení, platy a benefity dalších zaměstnanců.",
    benefit_2_title: "Nepřetržitá dostupnost",
    benefit_2_desc: "AI Chatbot je k dispozici 24/7/365. Zákazníci dostanou odpovědi kdykoli je potřebují, i mimo běžnou pracovní dobu.",
    benefit_3_title: "Zvýšení spokojenosti",
    benefit_3_desc: "AI Chatbot dokáže rychle a efektivně řešit běžné dotazy. Zákazníci ocení, když dostanou pomoc okamžitě.",
    benefit_4_title: "Automatizace rutiny",
    benefit_4_desc: "AI Chatbot převezme rutinní úkoly jako odpovídání na FAQ. Zaměstnanci se mohou věnovat kreativnějším činnostem.",
    benefit_5_title: "Zvýšení prodejů",
    benefit_5_desc: "AI Chatbot může navádět zákazníky k nákupu, odpovídat na dotazy a automaticky nabízet související produkty.",
    benefit_6_title: "Konkurenční výhoda",
    benefit_6_desc: "Nasazení chatbota vás odliší od konkurence. Zákazníci ocení moderní způsob komunikace.",

    // FAQ section
    chatbot_faq_tag: "// ČASTÉ DOTAZY",
    chatbot_faq_headline: "Často kladené dotazy",
    chatbot_faq_1_q: "Kolik to stojí?",
    chatbot_faq_1_a: "Cena závisí na velikosti organizace: Do 10 000 obyvatel od 10 000 Kč za vývoj + 3 500 Kč/měsíc. Pro 10-30 tisíc obyvatel od 35 000 Kč + 4 000 Kč/měsíc. Pro 30-60 tisíc od 65 000 Kč + 4 500 Kč/měsíc. Pro větší města, krajská města a kraje od 150 000 Kč + 5 000 Kč/měsíc. Měsíční poplatek zahrnuje technickou podporu, údržbu a AI kredity.",
    chatbot_faq_2_q: "Co mi implementace chatbota přinese?",
    chatbot_faq_2_a: "Nepřetržitou komunikaci 24/7, neomezenou kapacitu pro tisíce dotazů současně, inteligentního průvodce webem, analytické přehledy nejčastějších dotazů a vícejazyčnost (čeština, angličtina, němčina, ukrajinština a další). Naši klienti průměrně ušetří 150-425 hodin práce měsíčně.",
    chatbot_faq_3_q: "Čím se váš chatbot liší od ostatních?",
    chatbot_faq_3_a: "Jsme jediná společnost v ČR s nasazeným AI chatbotem na webech tří krajských úřadů. Dosahujeme přesnosti 90%+ ihned po nasazení a až 99% do 3 měsíců. Nabízíme plně na míru vyvíjené řešení - žádné šablonovité produkty. Součástí je vlastní administrační panel pro trénování AI a sběr zpětné vazby.",
    chatbot_faq_4_q: "Jak dlouho trvá implementace?",
    chatbot_faq_4_a: "Celková doba implementace je 4-5 týdnů. Fáze vývoje a integrace trvá 3-4 týdny (vizuální identita, vývoj, příprava kódu). Testování a nasazení pak 1-2 týdny. Testujeme důkladně interně, takže od vás nepotřebujeme žádné kapacity na testování.",
    chatbot_faq_5_q: "Co od nás budete potřebovat?",
    chatbot_faq_5_a: "Pouze tři věci: 1) Mapu stránek v XML formátu s hodnotou lastmod. 2) Odsouhlasení vizuálního vzhledu chatbota. 3) Nasazení dodaného kódu na web. Vše ostatní zajistíme my - včetně kompletního testování.",
    chatbot_faq_6_q: "Jaké technologie používáte?",
    chatbot_faq_6_a: "Využíváme RAG technologii s živým napojením na váš web a automatickými aktualizacemi. Chatbot umí vyhledávat i ve webových vyhledávačích (Google atd.). Vše je v plném souladu s GDPR - dokumentaci zpracovala advokátní kancelář LEGITAS. Součástí je ochrana proti zneužívání s automatickou detekcí nevhodného chování.",
    chatbot_faq_7_q: "Nabízíte nějaké rozšiřující moduly?",
    chatbot_faq_7_a: "Ano, nabízíme volitelné moduly: Usnesení rad a zastupitelstev (40 000 Kč), Úřední deska (40 000 Kč), Dotační tituly (od 35 000 Kč), Dopravní data a informace (od 35 000 Kč), Sociální služby a zdravotnická zařízení (od 40 000 Kč). Implementace modulů trvá 5-10 dnů navíc.",
    chatbot_faq_8_q: "Jaká je návratnost investice?",
    chatbot_faq_8_a: "Na základě analýzy 35 095 AI odpovědí z 5 krajů (leden-červenec 2025): Návratnost investice je 2-5 měsíců. Roční úspory dosahují 370 000-1 020 000 Kč. Měsíční úspora času činí 150-425 hodin. Hodnocení spokojenosti uživatelů je 4,6/5.",
    chatbot_faq_9_q: "Co když máme roztroušená a nekvalitní data?",
    chatbot_faq_9_a: "Přesně toto řešíme. Součástí implementace je datová příprava - propojíme vaše systémy, vyčistíme duplicity, sjednotíme formáty a strukturujeme data tak, aby chatbot pracoval přesně. Naše RAG technologie s automatickou synchronizací zajistí, že data budou vždy aktuální. Kvalitní vstup = kvalitní výstup.",
    chatbot_faq_10_q: "Jak zajistíte, že chatbot nebude halucinovat?",
    chatbot_faq_10_a: "Halucinace vznikají z nekvalitních nebo neúplných dat. Používáme vlastní administrační panel RAGus.ai, který zajišťuje: čistá data bez duplicit, automatickou synchronizaci znalostní báze, monitoring odpovědí a kontinuální vylepšování, zpětnou vazbu od uživatelů pro trénování AI. Proto dosahujeme 90%+ přesnosti ihned a až 99% do 3 měsíců.",
    chatbot_faq_11_q: "Dokážeme AI trénovat a učit sami?",
    chatbot_faq_11_a: "Ano, součástí dodávky je přístup do administračního panelu, kde můžete samostatně: přidávat a upravovat znalosti v databázi, prohlížet historii konverzací, označovat správné a špatné odpovědi AI, zadávat opravy a zpětnou vazbu. Není potřeba žádných technických znalostí - rozhraní je intuitivní a uživatelsky přívětivé.",
    chatbot_faq_12_q: "Jakým způsobem můžeme zadávat zpětnou vazbu?",
    chatbot_faq_12_a: "Zpětnou vazbu lze zadávat několika způsoby: 1) Přímo v administračním panelu - u každé konverzace můžete označit kvalitu odpovědi a přidat korekci. 2) Uživatelé chatbota mohou hodnotit odpovědi palcem nahoru/dolů. 3) Pravidelné reporty nám umožňují identifikovat oblasti pro vylepšení. Veškerá zpětná vazba se automaticky promítá do trénování AI.",
    chatbot_faq_13_q: "Je chatbot v souladu s nařízením AI Act?",
    chatbot_faq_13_a: "Ano, náš AI asistent spadá do kategorie minimálního rizika. Neprovádí automatizované rozhodování ani profilování. Před zahájením konverzace vyžadujeme explicitní souhlas uživatele.",
    chatbot_faq_14_q: "Může chatbot vyhledávat informace na celém internetu?",
    chatbot_faq_14_a: "Ano, v případě potřeby může vyhledávat aktuální data přes Google. Tato funkce je volitelná a uživatel ji může vypnout přímo ve widgetu.",
    chatbot_faq_15_q: "Jak probíhá aktualizace dat, když změníme web?",
    chatbot_faq_15_a: "Náš systém automaticky skenuje váš web přes XML sitemapu a RSS kanály. Jakmile přidáte novou aktualitu nebo změníte text na webu, chatbot se to do pár hodin dozví.",

    // Results section
    chatbot_results_tag: "// PROKAZATELNÉ VÝSLEDKY",
    chatbot_results_label: "REÁLNÁ DATA",
    chatbot_results_headline_1: "Ověřené výsledky",
    chatbot_results_headline_2: "z praxe",
    chatbot_results_desc: "Analýza 35 095 AI odpovědí z 5 regionů za leden-červenec 2025 ukazuje konkrétní přínosy nasazení AI chatbota.",
    chatbot_results_stat_1: "8 800",
    chatbot_results_stat_1_label: "hodin ušetřené práce",
    chatbot_results_stat_2: "1,76M Kč",
    chatbot_results_stat_2_label: "celková úspora",
    chatbot_results_stat_3: "2-5",
    chatbot_results_stat_3_label: "měsíců návratnost",
    chatbot_results_stat_4: "4,6/5",
    chatbot_results_stat_4_label: "hodnocení spokojenosti",
    chatbot_results_note: "15-25 % dotazů přichází mimo pracovní dobu - chatbot je zodpoví i v noci a o víkendech.",

    // Contact section
    chatbot_contact_tag: "// KONTAKT",
    chatbot_contact_label: "NEZÁVAZNÁ KONZULTACE",
    chatbot_contact_headline: "Chci AI chatbota pro svůj byznys",
    chatbot_contact_desc: "Domluvte si krátkou nezávaznou konzultaci na 30 minut online přes Google Meet, nebo nás kontaktujte emailem či telefonicky.",
    chatbot_contact_cta: "Domluvit schůzku",

    // Security section
    chatbot_sec_tag: "// BEZPEČNOST & DATA",
    chatbot_sec_headline: "Bezpečnost a zpracování dat",
    chatbot_sec_pii_title: "AI asistent nezpracovává osobní údaje (PII)",
    chatbot_sec_pii_desc: "Náš systém je navržen s důrazem na maximální ochranu soukromí. Nezpracováváme jména, rodná čísla ani jiné citlivé údaje. Pracujeme pouze s veřejně dostupnými informacemi z vašich zdrojů.",
    chatbot_sec_dpa_title: "Zpracovatelská smlouva (DPA)",
    chatbot_sec_dpa_desc: "V souladu s článkem 28 GDPR uzavíráme se zákazníky smlouvu jasně definující role: Vy jste Správce, my Zpracovatel. Vše je právně ošetřeno advokátní kanceláří LEGITAS.",
    chatbot_sec_storage_title: "Co a kde systém ukládá?",
    chatbot_sec_storage_ip: "IP adresa (72h) - ochrana proti spamu a DDoS útokům",
    chatbot_sec_storage_browser: "LocalStorage - historie posledních ~10 zpráv pro kontext",
    chatbot_sec_storage_transcripts: "Transkripty - Voiceflow AWS (EU/USA) - text bez PII",
    chatbot_sec_cert_iso: "ISO/IEC 27001:2022",
    chatbot_sec_cert_soc: "SOC 2 Type II",
    chatbot_sec_cert_gdpr: "GDPR Compliant",
    chatbot_sec_cert_aiact: "AI Act Ready",

    // Technology section
    chatbot_tech_tag: "// TECHNOLOGIE",
    chatbot_tech_headline: "Použitá technologie a modely",
    chatbot_tech_rag_title: "Retrieval Augmented Generation (RAG)",
    chatbot_tech_rag_desc: "Moderní architektura, která odděluje data od modelu. AI se 'netrénuje' na vašich datech, ale pouze v nich vyhledává odpovědi v reálném čase.",
    chatbot_tech_llm_title: "Multi-LLM Architecture",
    chatbot_tech_llm_desc: "Využíváme špičkové modely GPT-5, Claude 4.5 a Gemini 2.5. Při výpadku jednoho modelu systém automaticky přepne na záložní bez přerušení služby.",
    chatbot_tech_stream_title: "Streaming technologie",
    chatbot_tech_stream_desc: "Uživatel vidí odpověď okamžitě jak se generuje ('pršení písmen'). To dramaticky zkracuje pocitovou dobu čekání na odpověď.",

    // Admin panel section
    chatbot_admin_tag: "// ADMIN PANEL",
    chatbot_admin_headline: "Dashboard pro správu a monitoring",
    chatbot_admin_f1_title: "Samostatná úprava znalostí",
    chatbot_admin_f1_desc: "Klient si může chatbota vylepšovat a opravovat sám přes admin panel bez nutnosti programování.",
    chatbot_admin_f2_title: "Transkripce a hodnocení",
    chatbot_admin_f2_desc: "Možnost procházet historii konverzací a označovat úspěšné či neúspěšné interakce pro další učení.",
    chatbot_admin_f3_title: "Analýza sentimentu a trendů",
    chatbot_admin_f3_desc: "Kategorizace nejčastějších dotazů a sledování spokojenosti uživatelů v reálném čase.",

    // Pricing section
    chatbot_price_tag: "// CENÍK",
    chatbot_price_headline: "Ceník pro veřejnou správu",
    chatbot_price_setup: "Cena implementace",
    chatbot_price_monthly: "Cena měsíčně",
    chatbot_price_tier1: "do 10 000 obyvatel",
    chatbot_price_tier2: "10 000 - 30 000",
    chatbot_price_tier3: "30 000 - 60 000",
    chatbot_price_tier4: "Větší / krajská města",
    chatbot_price_tier5: "Kraje",
    chatbot_price_include_1: "1 000 AI odpovědí měsíčně",
    chatbot_price_include_2: "Technická podpora a údržba",
    chatbot_price_include_3: "Administrační panel RAGus.ai",
    chatbot_price_public_admin_badge: "Pro veřejnou správu",
    chatbot_price_description: "Cena se odvíjí od počtu obyvatel, který odráží komplexitu webových stránek, rozsah služeb a očekávanou zátěž chatbota. Čím větší obec nebo kraj, tím komplexnější implementace a větší nárok na AI kredity.",
    chatbot_price_column_population: "Počet obyvatel",
    chatbot_price_credits_header: "AI kredity / měs.",
    chatbot_price_footnote: "Ceny jsou uvedeny bez DPH. Každý projekt zahrnuje kompletní přípravu dat, školení, technickou podporu, pravidelné aktualizace a přístup do platformy RAGus.ai.",
    chatbot_price_extra_credit: "Dodatečný AI kredit nad rámec balíčku: 4 Kč bez DPH (4,84 Kč s DPH) za odpověď",
    chatbot_price_hourly_rate: "Hodinová sazba pro rozvoj a opravy: 2 000 Kč bez DPH (2 420 Kč s DPH)",
    chatbot_price_credit_rollover: "Nevyužité AI kredity se převádějí do dalšího měsíce",
    chatbot_price_custom_cta: "Máte specifické požadavky nebo nestandardní projekt? Kontaktujte nás pro individuální nabídku.",

    // Pricing table values (CZK)
    chatbot_price_tier1_setup: "10 000,-",
    chatbot_price_tier1_monthly: "3 500,-",
    chatbot_price_tier1_credits: "500",
    chatbot_price_tier2_setup: "35 000,-",
    chatbot_price_tier2_monthly: "4 000,-",
    chatbot_price_tier2_credits: "700",
    chatbot_price_tier3_setup: "65 000,-",
    chatbot_price_tier3_monthly: "4 500,-",
    chatbot_price_tier3_credits: "750",
    chatbot_price_tier4_setup: "100 000 - 150 000,-",
    chatbot_price_tier4_monthly: "5 000,-",
    chatbot_price_tier4_credits: "1 000",
    chatbot_price_tier5_setup: "150 000,-",
    chatbot_price_tier5_monthly: "5 000,-",
    chatbot_price_tier5_credits: "1 000",
  },
  en: {
    // Hero
    chatbot_hero_badge: "Best AI chatbot in Czech Republic",
    chatbot_hero_headline_1: "AI Chatbot",
    chatbot_hero_headline_2: "for your website",
    chatbot_hero_subheadline: "Bring your company or institution to life with a custom AI chatbot. Automate routine, repetitive communication and customer support.",
    chatbot_hero_subheadline_2: "90%+ answer accuracy * 24/7/365 availability * 150+ languages",
    chatbot_hero_cta: "I want AI chatbot",

    // Trust
    chatbot_trust_1: "5 Czech regions",
    chatbot_trust_2: "35,000+ responses",
    chatbot_trust_3: "No obligation",

    // Features section
    chatbot_features_tag: "// UNIQUE FEATURES",
    chatbot_features_label: "WHY OUR CHATBOT",
    chatbot_features_headline_1: "What makes our",
    chatbot_features_headline_2: "AI chatbot unique?",
    chatbot_features_desc: `Today's biggest problem with AI chatbots is outdated information and answer accuracy. At ${site.name}, we've solved both of these issues.`,

    // Features (f1-f8)
    chatbot_f1_title: "90%+ answer accuracy",
    chatbot_f1_desc: "We achieve the highest accuracy on the market thanks to our proprietary RAG technology and continuous improvement.",
    chatbot_f2_title: "Automatic updates",
    chatbot_f2_desc: "The only solution in CZ with automatic knowledge synchronization from your website without manual intervention.",
    chatbot_f3_title: "24/7/365 availability",
    chatbot_f3_desc: "The chatbot is available around the clock, customers get answers even outside business hours.",
    chatbot_f4_title: "150+ languages",
    chatbot_f4_desc: "Automatic language detection and response in the customer's language. Communicate with the whole world.",
    chatbot_f5_title: "Advanced analytics",
    chatbot_f5_desc: "Dashboard with trends, topics, satisfaction and time patterns for data-driven decision making.",
    chatbot_f6_title: "Enhanced security",
    chatbot_f6_desc: "Protection against DDOS, spam, jailbreaking and prompt injection. IP address control.",
    chatbot_f7_title: "Voice Input",
    chatbot_f7_desc: "Speech-to-text conversion allows users to speak instead of typing. Ideal for mobile devices.",
    chatbot_f8_title: "Full GDPR Compliance",
    chatbot_f8_desc: "Complete documentation prepared by law firm LEGITAS. Secure and legally sound solution.",

    // Benefits section
    chatbot_benefits_tag: "// WHAT YOU GET",
    chatbot_benefits_label: "KEY BENEFITS",
    chatbot_benefits_headline_1: "Unlock the potential",
    chatbot_benefits_headline_2: "of your business with AI Chatbot",
    chatbot_benefits_desc: "Key benefits you'll gain by implementing an AI chatbot on your website.",

    // Benefits (1-6)
    benefit_1_title: "Cost savings",
    benefit_1_desc: "AI Chatbot can replace or supplement human customer support. No need to pay for training, salaries and benefits of additional employees.",
    benefit_2_title: "24/7 availability",
    benefit_2_desc: "AI Chatbot is available 24/7/365. Customers get answers whenever they need them, even outside business hours.",
    benefit_3_title: "Increased satisfaction",
    benefit_3_desc: "AI Chatbot can quickly and efficiently handle common queries. Customers appreciate getting help immediately.",
    benefit_4_title: "Routine automation",
    benefit_4_desc: "AI Chatbot takes over routine tasks like answering FAQs. Employees can focus on more creative activities.",
    benefit_5_title: "Increased sales",
    benefit_5_desc: "AI Chatbot can guide customers to purchase, answer questions and automatically offer related products.",
    benefit_6_title: "Competitive advantage",
    benefit_6_desc: "Deploying a chatbot will differentiate you from competitors. Customers appreciate modern communication.",

    // FAQ section
    chatbot_faq_tag: "// FREQUENTLY ASKED",
    chatbot_faq_headline: "Frequently asked questions",
    chatbot_faq_1_q: "How much does it cost?",
    chatbot_faq_1_a: "Pricing depends on organization size: Up to 10,000 residents from $1,500 development + $500/month. For 10-30k residents from $5,000 + $500/month. For 30-60k from $9,000 + $600/month. For larger cities, regional capitals and regions from $20,000 + $700/month. Monthly fee includes technical support, maintenance and AI credits.",
    chatbot_faq_2_q: "What will chatbot implementation bring me?",
    chatbot_faq_2_a: "24/7 communication, unlimited capacity for thousands of queries simultaneously, intelligent website guide, analytical insights of most common questions, and multilingual support (Czech, English, German, Ukrainian and more). Our clients save an average of 150-425 work hours monthly.",
    chatbot_faq_3_q: "What makes your chatbot different?",
    chatbot_faq_3_a: "We're the only company in CZ with AI chatbots deployed on three regional government websites. We achieve 90%+ accuracy immediately after deployment and up to 99% within 3 months. We offer fully custom-developed solutions - no template products. Includes proprietary admin panel for AI training and feedback collection.",
    chatbot_faq_4_q: "How long does implementation take?",
    chatbot_faq_4_a: "Total implementation time is 4-5 weeks. Development and integration phase takes 3-4 weeks (visual identity, development, code preparation). Testing and deployment then 1-2 weeks. We test thoroughly internally, so you don't need any testing capacity.",
    chatbot_faq_5_q: "What do you need from us?",
    chatbot_faq_5_a: "Only three things: 1) Sitemap in XML format with lastmod value. 2) Approval of chatbot visual design. 3) Deployment of provided code on website. We handle everything else - including complete testing.",
    chatbot_faq_6_q: "What technologies do you use?",
    chatbot_faq_6_a: "We use RAG technology with live connection to your website and automatic updates. The chatbot can also search web search engines (Google etc.). Everything is fully GDPR compliant - documentation prepared by law firm LEGITAS. Includes abuse protection with automatic detection of inappropriate behavior.",
    chatbot_faq_7_q: "Do you offer extension modules?",
    chatbot_faq_7_a: "Yes, we offer optional modules: Council and assembly resolutions ($5,000), Official bulletin board ($5,000), Grant titles (from $5,000), Traffic data and information (from $5,000), Social and healthcare services (from $5,000). Module implementation takes 5-10 additional days.",
    chatbot_faq_8_q: "What is the return on investment?",
    chatbot_faq_8_a: "Based on analysis of 35,095 AI responses from 5 regions (January-July 2025): ROI is 2-5 months. Annual savings reach $50,000-$150,000. Monthly time savings are 150-425 hours. User satisfaction rating is 4.6/5.",
    chatbot_faq_9_q: "What if we have scattered and poor-quality data?",
    chatbot_faq_9_a: "This is exactly what we solve. Data preparation is part of implementation - we connect your systems, clean duplicates, unify formats and structure data so the chatbot works accurately. Our RAG technology with automatic synchronization ensures data is always up-to-date. Quality input = quality output.",
    chatbot_faq_10_q: "How do you ensure the chatbot won't hallucinate?",
    chatbot_faq_10_a: "Hallucinations arise from poor-quality or incomplete data. We use our proprietary admin panel RAGus.ai, which ensures: clean data without duplicates, automatic knowledge base synchronization, response monitoring and continuous improvement, user feedback for AI training. This is why we achieve 90%+ accuracy immediately and up to 99% within 3 months.",
    chatbot_faq_11_q: "Can we train and teach the AI ourselves?",
    chatbot_faq_11_a: "Yes, delivery includes access to an admin panel where you can independently: add and edit knowledge in the database, view conversation history, mark correct and incorrect AI responses, submit corrections and feedback. No technical knowledge required - the interface is intuitive and user-friendly.",
    chatbot_faq_12_q: "How can we provide feedback?",
    chatbot_faq_12_a: "Feedback can be provided in several ways: 1) Directly in the admin panel - you can rate response quality and add corrections for each conversation. 2) Chatbot users can rate responses with thumbs up/down. 3) Regular reports help us identify areas for improvement. All feedback is automatically incorporated into AI training.",
    chatbot_faq_13_q: "Is the chatbot compliant with the AI Act?",
    chatbot_faq_13_a: "Yes, our AI assistant falls into the minimal risk category. It does not perform automated decision-making or profiling. We require explicit user consent before starting a conversation.",
    chatbot_faq_14_q: "Can the chatbot search the entire internet?",
    chatbot_faq_14_a: "Yes, if needed, it can search for current data via Google. This feature is optional and users can disable it directly in the widget.",
    chatbot_faq_15_q: "How are data updated when we change the website?",
    chatbot_faq_15_a: "Our system automatically scans your website via XML sitemap and RSS feeds. As soon as you add new news or change text on the web, the chatbot will know within a few hours.",

    // Results section
    chatbot_results_tag: "// PROVEN RESULTS",
    chatbot_results_label: "REAL DATA",
    chatbot_results_headline_1: "Verified results",
    chatbot_results_headline_2: "from practice",
    chatbot_results_desc: "Analysis of 35,095 AI responses from 5 regions (January-July 2025) shows concrete benefits of AI chatbot deployment.",
    chatbot_results_stat_1: "8,800",
    chatbot_results_stat_1_label: "hours of work saved",
    chatbot_results_stat_2: "$250,000",
    chatbot_results_stat_2_label: "total savings",
    chatbot_results_stat_3: "2-5",
    chatbot_results_stat_3_label: "months ROI",
    chatbot_results_stat_4: "4.6/5",
    chatbot_results_stat_4_label: "satisfaction rating",
    chatbot_results_note: "15-25% of queries come outside working hours - the chatbot answers them even at night and on weekends.",

    // Contact section
    chatbot_contact_tag: "// CONTACT",
    chatbot_contact_label: "FREE CONSULTATION",
    chatbot_contact_headline: "I want AI chatbot for my business",
    chatbot_contact_desc: "Schedule a short 30-minute consultation via Google Meet, or contact us by email or phone.",
    chatbot_contact_cta: "Schedule meeting",

    // Security section
    chatbot_sec_tag: "// SECURITY & DATA",
    chatbot_sec_headline: "Security and Data Processing",
    chatbot_sec_pii_title: "AI Assistant does not process PII",
    chatbot_sec_pii_desc: "Our system is designed with maximum privacy focus. We don't process names, ID numbers, or other sensitive data. We only work with publicly available information from your sources.",
    chatbot_sec_dpa_title: "Data Processing Agreement (DPA)",
    chatbot_sec_dpa_desc: "In accordance with Article 28 GDPR, we conclude an agreement defining roles: You are the Controller, we are the Processor. Legally handled by LEGITAS law firm.",
    chatbot_sec_storage_title: "What and where is data stored?",
    chatbot_sec_storage_ip: "IP address (72h) - spam and DDoS protection",
    chatbot_sec_storage_browser: "LocalStorage - history of last ~10 messages for context",
    chatbot_sec_storage_transcripts: "Transcripts - Voiceflow AWS (EU/USA) - text without PII",
    chatbot_sec_cert_iso: "ISO/IEC 27001:2022",
    chatbot_sec_cert_soc: "SOC 2 Type II",
    chatbot_sec_cert_gdpr: "GDPR Compliant",
    chatbot_sec_cert_aiact: "AI Act Ready",

    // Technology section
    chatbot_tech_tag: "// TECHNOLOGY",
    chatbot_tech_headline: "Used Technology and Models",
    chatbot_tech_rag_title: "Retrieval Augmented Generation (RAG)",
    chatbot_tech_rag_desc: "Modern architecture separating data from the model. AI is not 'trained' on your data, but only searches it for answers in real-time.",
    chatbot_tech_llm_title: "Multi-LLM Architecture",
    chatbot_tech_llm_desc: "We use top-tier models like GPT-5, Claude 4.5, and Gemini 2.5. If one model fails, the system automatically switches to a backup without service interruption.",
    chatbot_tech_stream_title: "Streaming Technology",
    chatbot_tech_stream_desc: "The user sees the answer immediately as it's generated (letter by letter). This dramatically shortens the perceived waiting time.",

    // Admin panel section
    chatbot_admin_tag: "// ADMIN PANEL",
    chatbot_admin_headline: "Dashboard for Management and Monitoring",
    chatbot_admin_f1_title: "Independent Knowledge Editing",
    chatbot_admin_f1_desc: "Clients can improve and correct the chatbot themselves via the admin panel without any programming required.",
    chatbot_admin_f2_title: "Transcripts and Rating",
    chatbot_admin_f2_desc: "Ability to browse conversation history and mark successful or unsuccessful interactions for further learning.",
    chatbot_admin_f3_title: "Sentiment and Trend Analysis",
    chatbot_admin_f3_desc: "Categorization of most common queries and monitoring user satisfaction in real-time.",

    // Pricing section
    chatbot_price_tag: "// PRICING",
    chatbot_price_headline: "Public Administration Pricing",
    chatbot_price_setup: "Implementation cost",
    chatbot_price_monthly: "Monthly operation",
    chatbot_price_tier1: "up to 10,000 residents",
    chatbot_price_tier2: "10,000 - 30,000",
    chatbot_price_tier3: "30,000 - 60,000",
    chatbot_price_tier4: "Larger / regional cities",
    chatbot_price_tier5: "Regions",
    chatbot_price_include_1: "1,000 AI answers monthly",
    chatbot_price_include_2: "Technical support and maintenance",
    chatbot_price_include_3: "RAGus.ai Admin Panel",
    chatbot_price_public_admin_badge: "For Public Administration",
    chatbot_price_description: "Pricing is based on population count, which reflects website complexity, service scope, and expected chatbot load. Larger municipalities and regions require more complex implementation and higher AI credit allocation.",
    chatbot_price_column_population: "Population",
    chatbot_price_credits_header: "AI credits / month",
    chatbot_price_footnote: "Prices exclude VAT. Each project includes complete data preparation, training, technical support, regular updates, and access to the RAGus.ai platform.",
    chatbot_price_extra_credit: "Additional AI credit beyond package: $0.20 excl. VAT ($0.25 incl. VAT) per response",
    chatbot_price_hourly_rate: "Hourly rate for development and fixes: $300 excl. VAT ($360 incl. VAT)",
    chatbot_price_credit_rollover: "Unused AI credits roll over to the next month",
    chatbot_price_custom_cta: "Have specific requirements or a non-standard project? Contact us for a custom quote.",

    // Pricing table values (USD)
    chatbot_price_tier1_setup: "$1,500",
    chatbot_price_tier1_monthly: "$500",
    chatbot_price_tier1_credits: "500",
    chatbot_price_tier2_setup: "$5,000",
    chatbot_price_tier2_monthly: "$500",
    chatbot_price_tier2_credits: "700",
    chatbot_price_tier3_setup: "$9,000",
    chatbot_price_tier3_monthly: "$600",
    chatbot_price_tier3_credits: "750",
    chatbot_price_tier4_setup: "$15,000 - $20,000",
    chatbot_price_tier4_monthly: "$700",
    chatbot_price_tier4_credits: "1,000",
    chatbot_price_tier5_setup: "$20,000",
    chatbot_price_tier5_monthly: "$700",
    chatbot_price_tier5_credits: "1,000",
  },
};
