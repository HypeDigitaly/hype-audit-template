import type { Language } from './types';
import { site } from '../../config/site';

export interface LandingKeys {
  // Problem section
  problem_tag: string;
  problem_label: string;
  problem_headline: string;
  problem_headline_2: string;
  problem_subheadline: string;

  // Pain points
  pain_1_title: string;
  pain_1_desc: string;
  pain_2_title: string;
  pain_2_desc: string;
  pain_3_title: string;
  pain_3_desc: string;

  // What we deliver section
  deliver_tag: string;
  deliver_label: string;
  deliver_headline_1: string;
  deliver_headline_2: string;
  deliver_subheadline: string;
  deliver_1_title: string;
  deliver_1_desc: string;
  deliver_2_title: string;
  deliver_2_desc: string;
  deliver_3_title: string;
  deliver_3_desc: string;
  deliver_4_title: string;
  deliver_4_desc: string;
  deliver_5_title: string;
  deliver_5_desc: string;
  deliver_6_title: string;
  deliver_6_desc: string;

  // Process section
  process_tag: string;
  process_label: string;
  process_headline_1: string;
  process_headline_2: string;
  process_subheadline: string;
  process_note: string;

  // Phase items
  phase_1_title: string;
  phase_1_desc: string;
  phase_1_output: string;
  phase_2_title: string;
  phase_2_desc: string;
  phase_2_output: string;
  phase_3_title: string;
  phase_3_desc: string;
  phase_3_output: string;
  phase_4_title: string;
  phase_4_desc: string;
  phase_4_output: string;

  // Services section (headers only)
  services_tag: string;
  services_label: string;
  services_headline_1: string;
  services_headline_2: string;
  services_subheadline: string;

  // Work methods
  work_method_1_title: string;
  work_method_1_desc: string;
  work_method_2_title: string;
  work_method_2_desc: string;
  work_method_3_title: string;
  work_method_3_desc: string;
  work_method_4_title: string;
  work_method_4_desc: string;

  // Service cards
  service_featured: string;
  service_recommended: string;
  service_free_preaudit: string;
  service_audit_title: string;
  service_audit_desc: string;
  service_audit_result: string;
  service_chatbot_title: string;
  service_chatbot_desc: string;
  service_chatbot_f1: string;
  service_chatbot_f2: string;
  service_chatbot_f3: string;
  service_chatbot_f4: string;
  service_chatbot_more: string;
  first_title: string;
  first_desc: string;
  service_voicebot_title: string;
  service_voicebot_desc: string;
  service_voicebot_result: string;
  service_agent_title: string;
  service_agent_desc: string;
  service_agent_result: string;
  service_automation_title: string;
  service_automation_desc: string;
  service_automation_result: string;
  service_dev_title: string;
  service_dev_desc: string;
  service_web_title: string;
  service_web_desc: string;
  service_consult_title: string;
  service_consult_desc: string;
  service_consult_more: string;
  service_sales_title: string;
  service_sales_desc: string;
  service_new_badge: string;
  service_dataprep_cta: string;
  service_web_responsive: string;
  service_marketing_title: string;
  service_marketing_desc: string;
  marketing_page_title: string;
  marketing_page_desc: string;
  marketing_download_pdf: string;
  marketing_cta_text: string;
  marketing_iframe_title: string;
}

export const landingTranslations: Record<Language, LandingKeys> = {
  cs: {
    // Problem section
    problem_tag: "// PROČ AI PROJEKTY ČASTO SELHÁVAJÍ?",
    problem_label: "TYPICKÉ PŘEKÁŽKY",
    problem_headline: "Z jakého důvodu organizace",
    problem_headline_2: "s AI neuspějí?",
    problem_subheadline: "Umělá inteligence představuje novou konkurenční výhodu. Její nasazení bez jasné strategie však vede ke ztrátám času a financí.",

    // Pain points
    pain_1_title: "Roztroušená a nekvalitní data",
    pain_1_desc: "Data jsou roztroušená na více místech bez jasné struktury. AI pak pracuje s neúplnými informacemi, duplicitami a nekonzistentními formáty – výsledkem jsou nepřesné odpovědi a halucinace.",
    pain_2_title: "Zbytečně mnoho aplikací",
    pain_2_desc: "Firmy platí za desítky různých nástrojů, které se překrývají a nikdo je pořádně nevyužívá. Chybí jednotný přehled, co kdo používá, a místo efektivity vzniká chaos a zbytečné výdaje.",
    pain_3_title: "Žádný reálný dopad",
    pain_3_desc: "Investuje se čas i rozpočet, ale nikdo nesleduje skutečný dopad na byznys. AI strategie končí založená v dokumentech a o reálné implementaci se pouze mluví v plánech na další období.",

    // What we deliver section
    deliver_tag: "// CO VÁM PŘINESEME",
    deliver_label: "KONKRÉTNÍ VÝSTUPY",
    deliver_headline_1: "Co od nás",
    deliver_headline_2: "získáte",
    deliver_subheadline: "Reálné nasazení AI s viditelnými výsledky během několika týdnů.",
    deliver_1_title: "Data na jednom místě",
    deliver_1_desc: "Propojíme vaše systémy a sjednotíme data z různých zdrojů do jednoho přehledného úložiště. Konec hledání informací napříč desítkami aplikací.",
    deliver_2_title: "Připravená data pro AI",
    deliver_2_desc: "Vyčistíme, strukturujeme a obohatíme vaše data tak, aby AI pracovala přesně a bez halucinací. Kvalitní vstup = kvalitní výstup.",
    deliver_3_title: "Strategie založená na faktech",
    deliver_3_desc: "Určíme oblasti s nejvyšším potenciálem pro úspory i růst tržeb. Každý návrh vychází z důkladné analýzy vašich procesů a ukazatelů.",
    deliver_4_title: "Zautomatizované procesy",
    deliver_4_desc: "Zbavíme váš tým rutinních úkolů pomocí AI pracovních postupů. Uvolní se kapacita pro strategické činnosti a obchodní rozvoj.",
    deliver_5_title: "Tým ovládající AI",
    deliver_5_desc: "Praxe a kontinuální podpora. Vaši lidé se naučí AI skutečně využívat, ne ji pouze teoreticky chápat.",
    deliver_6_title: "Prokazatelné výsledky",
    deliver_6_desc: "Připravíme měření a reporty, abyste přesně viděli, kolik času a prostředků AI reálně ušetří. Získáte transparentní přehled návratnosti.",

    // Process section
    process_tag: "// PRŮBĚH SPOLUPRÁCE",
    process_label: "CESTA K CÍLI",
    process_headline_1: "Jak probíhá",
    process_headline_2: "spolupráce",
    process_subheadline: "Provázíme vás kompletním procesem – od analýzy vašeho podnikání, přes AI audit a tvorbu strategie, až k realizaci a trvalé spolupráci.",
    process_note: "Stačí vám krátká konzultace? Rádi pomůžeme. Nejvíce však vytěžíte z dlouhodobého partnerství, kde společně řídíme AI strategii, realizaci i adopci v souladu s vašimi záměry.",

    // Phase items
    phase_1_title: "Pochopení vašeho byznysu",
    phase_1_desc: "Zmapujeme obchodní model, pracovní procesy, zákaznickou cestu a klíčové metriky. Porozumíme překážkám i příležitostem pro rychlá vítězství.",
    phase_1_output: "Výstup: mapa prioritních oblastí",
    phase_2_title: "Detailní diagnostika",
    phase_2_desc: "Posoudíme data, systémy, regulatorní požadavky i technologická omezení. Vyčíslíme přínosy a rizika, abyste věděli, kde má AI největší smysl.",
    phase_2_output: "Výstup: AI audit s business case",
    phase_3_title: "Plán a stanovení priorit",
    phase_3_desc: "Vytvoříme přehlednou roadmapu aktivit, rozpočtů a KPI. Budete vědět, co automatizovat, kdy zapojit tým a jaké výsledky očekávat.",
    phase_3_output: "Výstup: AI roadmapa a KPI systém",
    phase_4_title: "Realizace a partnerství",
    phase_4_desc: "Koordinujeme dodávku, spolupráci s dodavateli, zaškolení a adopci. Průběžně vyhodnocujeme a optimalizujeme, aby AI zůstala konkurenční výhodou.",
    phase_4_output: "Výstup: nasazení a pravidelný reporting",

    // Services section (headers only)
    services_tag: "// NAŠE METODY",
    services_label: "JAK PRACUJEME",
    services_headline_1: "Náš způsob",
    services_headline_2: "práce",
    services_subheadline: "Žádné zdlouhavé prezentace. Začínáme rovnou na skutečných případech a implementaci.",

    // Work methods
    work_method_1_title: "Vyzkoušené postupy a šablony",
    work_method_1_desc: "Metodiky ověřené napříč obory.",
    work_method_2_title: "Praktický přístup",
    work_method_2_desc: "Pracujeme přímo v procesu společně s lidmi, kteří budou AI denně využívat.",
    work_method_3_title: "Postupné vylepšování",
    work_method_3_desc: "Klademe důraz na iterace. Pokrok vidíte každý týden.",
    work_method_4_title: "Ověřitelný přínos",
    work_method_4_desc: "Každá úprava je podložena daty a měřitelnými ukazateli.",

    // Service cards
    service_featured: "HLAVNÍ SLUŽBA",
    service_recommended: "DOPORUČUJEME",
    service_free_preaudit: "Předběžný audit zdarma",
    service_audit_title: "Předběžný audit o využití AI",
    service_audit_desc: "Zjistěte, kde ve firmě ztrácíte čas a peníze. Předběžný audit zdarma – výsledky máte do 5 minut.",
    service_audit_result: "Zjistěte možnosti AI →",
    service_chatbot_title: "AI Chatbot",
    service_chatbot_desc: "Inteligentní AI chat řešení, která zpracovávají dotazy a kvalifikují leady za vás 24/7. Web, Instagram, WhatsApp, Messenger.",
    service_chatbot_f1: "24/7/365 automatizovaná komunikace",
    service_chatbot_f2: "90%+ přesnost s RAG technologií",
    service_chatbot_f3: "Automatické aktualizace znalostí",
    service_chatbot_f4: "150+ jazyků",
    service_chatbot_more: "Více informací",
    first_title: "První v České republice",
    first_desc: "Jsme první společnost v ČR, která úspěšně nasadila AI asistenta na webové stránky krajských úřadů. Naše řešení dnes pomáhá občanům 5 českých krajů s více než 35 000 zodpovězenými dotazy.",
    service_voicebot_title: "AI Voicebot",
    service_voicebot_desc: "Automatizace hlasové komunikace a telefonních hovorů s přirozenou konverzací.",
    service_voicebot_result: "40% snížení nákladů",
    service_agent_title: "AI Agent",
    service_agent_desc: "Autonomní AI pro komplexní vícekrokové úkoly bez lidského zásahu.",
    service_agent_result: "80% rychlejší úkoly",
    service_automation_title: "AI Automatizace",
    service_automation_desc: "Enterprise-grade automatizace pro aplikační logiku a workflow.",
    service_automation_result: "10× efektivita",
    service_dev_title: "Vývoj Aplikací",
    service_dev_desc: "Full-scale vývoj aplikací od designu a architektury po spuštění.",
    service_web_title: "Web Design",
    service_web_desc: "High-performance weby, které reprezentují vaši značku a zvyšují konverze.",
    service_consult_title: "Konzultace & Podpora",
    service_consult_desc: "Strategické vedení v každé fázi. Náš tým je připraven vás provést celým procesem.",
    service_consult_more: "Zobrazit varianty spolupráce",
    service_sales_title: "AI Obchodní tým",
    service_sales_desc: "Oslovte 30–150 firem denně na autopilota. AI najde zákazníky, připraví nabídku a prodává za vás.",
    service_new_badge: "🔥 Novinka",
    service_dataprep_cta: "Připravit data pro AI",
    service_web_responsive: "Responzivní",
    service_marketing_title: "Marketingové služby",
    service_marketing_desc: "Kompletní správa sociálních sítí, online prezentace a placených reklam. Jeden tým, který řeší všechno.",
    marketing_page_title: `Marketingové služby — ${site.name}`,
    marketing_page_desc: "Kompletní balíček marketingových služeb pro přítomnost v online prostoru",
    marketing_download_pdf: "Stáhnout jako PDF",
    marketing_cta_text: "Domluvit schůzku",
    marketing_iframe_title: "Marketingové služby — cenová nabídka",
  },
  en: {
    // Problem section
    problem_tag: "// WHY DO AI PROJECTS OFTEN FAIL?",
    problem_label: "TYPICAL OBSTACLES",
    problem_headline: "Why do companies",
    problem_headline_2: "struggle with AI?",
    problem_subheadline: "Artificial intelligence is a new competitive advantage. However, deploying it without a clear strategy leads to wasted time and resources.",

    // Pain points
    pain_1_title: "Scattered and poor-quality data",
    pain_1_desc: "Data is scattered across multiple locations without a clear structure. AI then works with incomplete information, duplicates, and inconsistent formats - resulting in inaccurate answers and hallucinations.",
    pain_2_title: "Too many applications",
    pain_2_desc: "Companies pay for dozens of overlapping tools that no one fully utilizes. There's no clear overview of who uses what, and instead of efficiency, chaos and unnecessary license costs arise.",
    pain_3_title: "No real impact",
    pain_3_desc: "Time and budget are invested, but no one tracks the real business impact. AI strategy ends up filed away in documents and actual implementation only gets mentioned in next quarter's plans.",

    // What we deliver section
    deliver_tag: "// WHAT WE BRING YOU",
    deliver_label: "CONCRETE OUTPUTS",
    deliver_headline_1: "What you'll",
    deliver_headline_2: "receive",
    deliver_subheadline: "Real AI deployment with visible results within weeks.",
    deliver_1_title: "Data in one place",
    deliver_1_desc: "We connect your systems and unify data from various sources into one clear repository. No more searching for information across dozens of applications.",
    deliver_2_title: "AI-ready data",
    deliver_2_desc: "We clean, structure, and enrich your data so AI works accurately without hallucinations. Quality input = quality output.",
    deliver_3_title: "Fact-based strategy",
    deliver_3_desc: "We identify areas with the highest potential for savings and revenue growth. Every recommendation stems from thorough analysis of your processes and metrics.",
    deliver_4_title: "Automated processes",
    deliver_4_desc: "We free your team from routine tasks through AI workflows. Capacity opens up for strategic activities and business development.",
    deliver_5_title: "AI-proficient team",
    deliver_5_desc: "Hands-on practice and continuous support. Your people learn to actually use AI, not just understand it theoretically.",
    deliver_6_title: "Demonstrable results",
    deliver_6_desc: "We set up measurements and reports so you see exactly how much time and resources AI actually saves. You get a transparent ROI overview.",

    // Process section
    process_tag: "// COLLABORATION PROCESS",
    process_label: "PATH TO SUCCESS",
    process_headline_1: "How collaboration",
    process_headline_2: "unfolds",
    process_subheadline: "We guide you through the complete process - from analyzing your business, through AI audit and strategy creation, to implementation and ongoing partnership.",
    process_note: "Just need a brief consultation? Happy to help. However, you'll gain the most from long-term partnership where we jointly manage AI strategy, execution and adoption aligned with your objectives.",

    // Phase items
    phase_1_title: "Understanding your business",
    phase_1_desc: "We map your business model, workflows, customer journey and key metrics. We grasp obstacles and opportunities for quick wins.",
    phase_1_output: "Output: priority areas map",
    phase_2_title: "Detailed diagnostics",
    phase_2_desc: "We assess data, systems, regulatory requirements and technology constraints. We quantify benefits and risks so you know where AI makes most sense.",
    phase_2_output: "Output: AI audit with business case",
    phase_3_title: "Planning and prioritization",
    phase_3_desc: "We create a clear roadmap of activities, budgets and KPIs. You'll know what to automate, when to involve the team and what results to expect.",
    phase_3_output: "Output: AI roadmap and KPI system",
    phase_4_title: "Execution and partnership",
    phase_4_desc: "We coordinate delivery, vendor collaboration, training and adoption. We continuously evaluate and optimize to keep AI as your competitive edge.",
    phase_4_output: "Output: deployment and regular reporting",

    // Services section (headers only)
    services_tag: "// OUR METHODS",
    services_label: "HOW WE OPERATE",
    services_headline_1: "Our way of",
    services_headline_2: "working",
    services_subheadline: "No lengthy presentations. We start directly on real cases and implementation.",

    // Work methods
    work_method_1_title: "Battle-tested procedures and templates",
    work_method_1_desc: "Methodologies proven across industries.",
    work_method_2_title: "Practical approach",
    work_method_2_desc: "We work directly in the process alongside people who will use AI daily.",
    work_method_3_title: "Gradual improvement",
    work_method_3_desc: "We emphasize iterations. You see progress every week.",
    work_method_4_title: "Verifiable impact",
    work_method_4_desc: "Every adjustment is backed by data and measurable indicators.",

    // Service cards
    service_featured: "MAIN SERVICE",
    service_recommended: "RECOMMENDED",
    service_free_preaudit: "Free Pre-Audit",
    service_audit_title: "Preliminary AI Audit",
    service_audit_desc: "Find out where you're losing time and money in your company. Free pre-audit - results within 5 minutes.",
    service_audit_result: "Discover AI possibilities ->",
    service_chatbot_title: "AI Chatbot",
    service_chatbot_desc: "Intelligent AI chat solutions that process inquiries and qualify leads for you 24/7. Web, Instagram, WhatsApp, Messenger.",
    service_chatbot_f1: "24/7/365 automated communication",
    service_chatbot_f2: "90%+ accuracy with RAG technology",
    service_chatbot_f3: "Automatic knowledge updates",
    service_chatbot_f4: "150+ languages",
    service_chatbot_more: "Learn more",
    first_title: "First in the Czech Republic",
    first_desc: "We are the first company in the Czech Republic to successfully deploy an AI assistant on regional government websites. Our solution now helps citizens of 5 Czech regions with over 35,000 answered questions.",
    service_voicebot_title: "AI Voicebot",
    service_voicebot_desc: "Voice communication and phone call automation with natural conversation.",
    service_voicebot_result: "40% cost reduction",
    service_agent_title: "AI Agent",
    service_agent_desc: "Autonomous AI for complex multi-step tasks without human intervention.",
    service_agent_result: "80% faster tasks",
    service_automation_title: "AI Automation",
    service_automation_desc: "Enterprise-grade automation for application logic and workflow.",
    service_automation_result: "10x efficiency",
    service_dev_title: "App Development",
    service_dev_desc: "Full-scale application development from design and architecture to launch.",
    service_web_title: "Web Design",
    service_web_desc: "High-performance websites that represent your brand and increase conversions.",
    service_consult_title: "Consulting & Support",
    service_consult_desc: "Strategic guidance at every stage. Our team is ready to guide you through the entire process.",
    service_consult_more: "View collaboration options",
    service_sales_title: "AI Sales Team",
    service_sales_desc: "Reach 30–150 companies per day on autopilot. AI finds customers, prepares offers and sells for you.",
    service_new_badge: "🔥 New",
    service_dataprep_cta: "Prepare data for AI",
    service_web_responsive: "Responsive",
    service_marketing_title: "Marketing Services",
    service_marketing_desc: "Complete social media management, online presence and paid ads. One team handling everything.",
    marketing_page_title: `Marketing Services — ${site.name}`,
    marketing_page_desc: "Complete marketing services package for online presence",
    marketing_download_pdf: "Download as PDF",
    marketing_cta_text: "Book a meeting",
    marketing_iframe_title: "Marketing Services — Price Quote",
  },
};
