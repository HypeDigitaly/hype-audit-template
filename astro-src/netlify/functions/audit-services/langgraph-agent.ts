// =============================================================================
// LANGGRAPH DEEP RESEARCH AGENT - AI Auditor Module v3
// =============================================================================
// Uses LangGraph.js with Tavily Web Search to conduct comprehensive
// deep research about companies for the automated AI audit system.
// Now outputs STRUCTURED DATA for HTML report generation.
// 
// v3 Features:
// - Progress callback system for real-time frontend updates
// - Technology stack detection via Tavily
// - Company app/software detection
// - Enhanced data for app integration suggestions
// =============================================================================

import { tavily } from '@tavily/core';
import { clientConfig } from '../_config/client';
import type { 
  AuditReportData, 
  AuditQuestion, 
  AIOpportunity, 
  RecommendedTool, 
  ROIEstimate,
  CompanyProfile,
  DetectedTechnology,
  AppIntegrationOpportunity,
  IndustryBenchmark,
  ImplementationTimeline,
  ImplementationTimelinePhase,
  RiskAssessment,
  RiskAssessmentItem,
  // NEW v4: Expected Benefits
  ExpectedBenefitsSummary,
  OpportunityBenefit,
  BenefitType
} from './html-report-generator';
import {
  extractAndParseJson,
  validateAuditReportStructure,
  fillAuditReportDefaults,
  isJsonTruncated,
  logParseFailure,
  getParseMetrics
} from './json-parser-utils';
import {
  detectBusinessType,
  getBusinessTypeMetrics,
  type BusinessType,
  type BenefitTypeKey,
  BUSINESS_TYPE_METRICS
} from './glossary';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface AuditFormInputs {
  website: string;
  companyName: string;
  city: string;
  industry: string;
  biggestPainPoint: string;
  currentTools: string;
  language: 'cs' | 'en';
}

export interface ResearchResult {
  success: boolean;
  reportData?: AuditReportData;
  error?: string;
}

// Progress callback for real-time status updates
export type ProgressCallback = (step: ResearchStep, progress: number, message: string) => Promise<void>;

// Research steps for progress tracking
export type ResearchStep = 
  | 'fetch_branding'
  | 'search_company_info'
  | 'search_company_news'
  | 'search_website'
  | 'search_technologies'
  | 'search_company_apps'
  | 'search_ai_tools'
  | 'llm_analyzing'
  | 'building_report';

// Step configuration for progress tracking
export const RESEARCH_STEPS: Record<ResearchStep, { progress: number; messageCs: string; messageEn: string }> = {
  'fetch_branding': { progress: 28, messageCs: 'Načítám branding společnosti...', messageEn: 'Fetching company branding...' },
  'search_company_info': { progress: 30, messageCs: 'Hledám informace o společnosti...', messageEn: 'Searching company information...' },
  'search_company_news': { progress: 34, messageCs: 'Hledám novinky a reference...', messageEn: 'Searching news and references...' },
  'search_website': { progress: 38, messageCs: 'Analyzuji webové stránky...', messageEn: 'Analyzing website content...' },
  'search_technologies': { progress: 42, messageCs: 'Zjišťuji používané technologie...', messageEn: 'Detecting technologies used...' },
  'search_company_apps': { progress: 46, messageCs: 'Hledám firemní aplikace a software...', messageEn: 'Searching for company apps...' },
  'search_ai_tools': { progress: 50, messageCs: 'Hledám AI nástroje pro vaše odvětví...', messageEn: 'Searching AI tools for your industry...' },
  'llm_analyzing': { progress: 55, messageCs: 'AI analyzuje výsledky výzkumu...', messageEn: 'AI analyzing research results...' },
  'building_report': { progress: 58, messageCs: 'Sestavuji report...', messageEn: 'Building report...' }
};

interface TavilySearchResult {
  query: string;
  results: Array<{
    title: string;
    url: string;
    content: string;
    rawContent?: string;
    score?: number;
  }>;
  images?: Array<{
    url: string;
    description?: string;
  }>;
  usage?: {
    totalTokens?: number;
    creditUsed?: number;
  };
  success: boolean;
  type: 'generic' | 'domain-specific' | 'ai-tools' | 'technology' | 'apps';
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Extract domain from website URL
 */
function extractDomain(website: string): string | null {
  try {
    if (!website) return null;
    let urlString = website.trim();
    if (!urlString.startsWith('http')) {
      urlString = `https://${urlString}`;
    }
    const url = new URL(urlString);
    return url.hostname.replace(/^www\./, '');
  } catch (error) {
    return null;
  }
}

// =============================================================================
// TAVILY SEARCH IMPLEMENTATION
// =============================================================================

// Type for search result item
interface SearchResultItem {
  title: string;
  url: string;
  content: string;
  rawContent?: string;
  score?: number;
}

/**
 * Execute a single Tavily search with advanced options and detailed logging
 */
async function executeTavilySearch(
  client: ReturnType<typeof tavily>,
  query: string,
  type: TavilySearchResult['type'],
  domain: string | null = null
): Promise<TavilySearchResult> {
  const options: Record<string, unknown> = {
    maxResults: 5,
    searchDepth: 'advanced',
    includeImages: true,
    includeImageDescriptions: true,
    includeUsage: true,
    includeRawContent: 'markdown',
  };

  if (type === 'domain-specific' && domain) {
    options.includeDomains = [domain];
  }

  console.log(`[Tavily] [${type.toUpperCase()}] Request: "${query}"`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout for advanced search
    
    const response = await client.search(query, options);
    clearTimeout(timeoutId);

    // Diagnostic log to verify response keys (can be removed later)
    if (response.results?.[0]) {
      console.log(`[Tavily] Response keys found: ${Object.keys(response.results[0]).join(', ')}`);
    }
    
    // OPTIMIZED: Truncate rawContent to 2000 chars to reduce token usage (was consuming ~1M tokens)
    const results: SearchResultItem[] = (response.results || []).map((r: Record<string, unknown>) => {
      const rawContent = (r.rawContent as string) || (r.raw_content as string) || '';
      const truncatedRaw = rawContent.length > 2000 ? rawContent.substring(0, 2000) + '...' : rawContent;
      
      return {
        title: (r.title as string) || 'No title',
        url: (r.url as string) || '',
        content: (r.content as string) || (r.snippet as string) || '',
        rawContent: truncatedRaw,
        score: r.score as number | undefined
      };
    });
    
    const totalRawLength = results.reduce((sum: number, r: SearchResultItem) => sum + (r.rawContent?.length || 0), 0);
    const totalContentLength = results.reduce((sum: number, r: SearchResultItem) => sum + (r.content?.length || 0), 0);

    console.log(`[Tavily] Response success: ${results.length} results found`);
    console.log(`[Tavily] Content length: ${totalContentLength} chars (snippets)`);
    console.log(`[Tavily] Raw content length: ${totalRawLength} chars (markdown)`);
    
    // Log snippets for each result
    results.forEach((r: SearchResultItem, idx: number) => {
      const snippet = r.content.substring(0, 150).replace(/\n/g, ' ');
      console.log(`[Tavily]   Result #${idx + 1}: ${r.title.substring(0, 50)}... (${r.rawContent?.length || 0} chars)`);
      console.log(`[Tavily]       Snippet: "${snippet}..."`);
    });

    return {
      query,
      results,
      images: response.images,
      usage: (response as any).usage,
      success: true,
      type
    };
  } catch (error) {
    console.error(`[Tavily] [${type.toUpperCase()}] Search failed for "${query}":`, error instanceof Error ? error.message : error);
    return {
      query,
      results: [],
      success: false,
      type
    };
  }
}

/**
 * Query set interface for organized search queries
 */
interface QuerySets {
  generic: string[];
  domainSpecific: string[];
  technology: string[];
  apps: string[];
  aiTools: string[];
}

/**
 * Generate search queries split into categories
 * v3: Added technology stack and app detection queries
 */
function generateQuerySets(formData: AuditFormInputs): QuerySets {
  const { companyName, city, industry, language, website } = formData;
  
  // Extract domain for specific searches
  const domain = extractDomain(website);
  
  // Detect industry for AI tools search
  const industryKeywords = detectIndustryKeywords(industry, language);
  
  if (language === 'cs') {
    return {
      generic: [
        `"${companyName}" ${city} IČO rejstřík firem informace o společnosti`,
        `"${companyName}" novinky reference recenze`
      ],
      domainSpecific: [
        `"${companyName}" služby produkty nabídka v čem podniká předmět podnikání`
      ],
      technology: [
        `"${companyName}" technologie software platforma systém používá ${domain ? `site:${domain}` : ''}`
      ],
      apps: [
        `"${companyName}" mobilní aplikace software produkt iOS Android web app`
      ],
      aiTools: [
        `best AI tools ${industryKeywords} automation 2026 chatbot voicebot links`
      ]
    };
  }
  
  return {
    generic: [
      `"${companyName}" ${city} company registry business information`,
      `"${companyName}" news reviews testimonials`
    ],
    domainSpecific: [
      `"${companyName}" services products business type industry`
    ],
    technology: [
      `"${companyName}" technology stack software platform system uses ${domain ? `site:${domain}` : ''}`
    ],
    apps: [
      `"${companyName}" mobile app software product iOS Android web application`
    ],
    aiTools: [
      `best AI tools ${industryKeywords} automation 2026 chatbot voicebot`
    ]
  };
}

/**
 * Detect industry keywords for AI tools search
 */
function detectIndustryKeywords(industry: string, language: 'cs' | 'en'): string {
  const industryMap: Record<string, string> = {
    'it_software': 'software development coding programming',
    'manufacturing': 'manufacturing production factory',
    'retail': 'retail ecommerce sales',
    'finance': 'finance banking accounting',
    'healthcare': 'healthcare medical',
    'construction': 'construction real estate',
    'logistics': 'logistics shipping supply chain',
    'marketing': 'marketing agency advertising digital marketing',
    'education': 'education training learning',
    'public': 'government public sector',
    'other': 'business SMB'
  };
  
  return industryMap[industry] || industryMap['other'];
}

/**
 * Get industry-specific AI recommendations for the LLM prompt
 */
function getIndustrySpecificRecommendations(language: 'cs' | 'en'): string {
  if (language === 'cs') {
    return `
## DOPORUČENÍ DLE ODVĚTVÍ (VYBER RELEVANTNÍ DLE ZJIŠTĚNÉHO ODVĚTVÍ)

### DŮLEŽITÉ PRAVIDLO PRO VŠECHNA ODVĚTVÍ:
Kdykoliv doporučuješ AI asistenta/agenta (chatbot/voicebot), VŽDY explicitně zmiň:
- **Natrénovaný na datech dané společnosti** - bude moci odpovídat jako expertní člen jejich týmu
- **Automatizuje odpovědi na běžné dotazy nepřetržitě** - uvolní 80% opakujících se dotazů
- **Může automaticky domlouvat schůzky do kalendáře**, odesílat emaily, upozornění
- **Napojený na rezervační systém / systém pro správu zákazníků / kalendář** dle potřeby

### UNIVERZÁLNÍ DOPORUČENÍ PRO VŠECHNA ODVĚTVÍ S DOKUMENTACÍ:
**HypeAgent - Firemní AI asistent (soukromý ChatGPT pracující pouze s Vašimi daty)**

Toto je KLÍČOVÉ řešení pro jakoukoliv firmu, která pracuje s velkou dokumentací, má rozsáhlý web, nebo provádí administrativní úkoly založené na velkém množství dokumentů.

**Popis:**
HypeAgent je náš vlastní firemní AI asistent natrénovaný výhradně na Vašich firemních dokumentech. Funguje jako "interní ChatGPT", ale s kritickým rozdílem - Vaše data zůstávají plně pod Vaší kontrolou a NIKDY se nesdílejí s žádnými externími poskytovateli. Řešení běží na Vašich serverech nebo v soukromém cloudu s nejvyšší bezpečností.

**Hlavní výhody:**
- **Maximální bezpečnost dat** - Na rozdíl od běžných AI nástrojů, kde Vaše firemní data mohou být použita k trénování jejich modelů, HypeAgent pracuje čistě na Vašich datech bez jakéhokoliv úniku. Vhodné pro firmy s citlivými daty (osobní údaje, obchodní tajemství, smlouvy).
- **Vyhledávání v interních souborech** - Agent dokáže prohledávat a analyzovat všechny Vaše firemní dokumenty, smlouvy, manuály, procesy, emaily, prezentace. Odpovídá na základě reálných firemních informací.
- **Hloubkové webové vyhledávání** - Kromě interních dat dokáže prohledávat web a kombinovat firemní znalosti s aktuálními informacemi.
- **AI tvorba obsahu:**
  - Tvorba obrázků a grafiky (pro prezentace, sociální sítě, marketingové materiály)
  - Tvorba videí (produktová videa, školící materiály, prezentace)
  - Vytváření grafů a diagramů (z dat, pro reporty)
  - Automatická tvorba prezentací (PowerPoint/Google Slides)
- **Správa emailů** - Automatické třídění, návrhy odpovědí, odesílání emailů
- **Propojení s firemními systémy:**
  - Google Drive, Google Docs, Google Sheets
  - Microsoft SharePoint, OneDrive
  - Dropbox, Box
  - Vlastní databáze a systémy pro správu zákazníků
- **Jeden přehledný panel** - Všechny AI funkce přístupné z jednoho intuitivního rozhraní bez přepínání mezi nástroji

**Pro koho:**
- Firmy s rozsáhlou dokumentací (právní kanceláře, konzultační firmy, účetnictví)
- Společnosti s velkými weby a znalostními bázemi
- Administrativní oddělení zpracovávající velké množství dokumentů
- IT firmy potřebující rychlý přístup k technické dokumentaci
- Jakákoliv firma, kde zaměstnanci tráví hodiny hledáním informací v dokumentech

**Přínos:**
Ušetří 15-25 hodin týdně na hledání informací v dokumentech, psaní reportů, tvorbu prezentací a automatizaci administrativních úkolů. Nahradí práci 2-3 juniorských pozic specializovanými AI agenty.

### PRO KOMUNITY / MEMBERSHIP / KLUBY / SPOLKY:
POZOR: Pro komunity NEPOUŽÍVEJ "úsporu času" jako primární metriku! Hlavní přínosy jsou:
- Noví členové (member_acquisition) - PRIMÁRNÍ METRIKA!
- Snížení odchodu členů (churn_reduction) - KRITICKÉ!
- Zapojení členů (member_engagement)

Nejvíce přínosné řešení:
1. **AI asistent pro členy** - AI chatbot natrénovaný na informacích o komunitě, odpovídá na dotazy 24/7, pomáhá novým členům s orientací, doporučuje relevantní akce a obsah. PŘÍNOS: +20-40% zapojení členů.
2. **Automatizace onboardingu nových členů** - AI automaticky provede nové členy celým procesem seznámení s komunitou, pošle personalizované uvítací zprávy, doporučí relevantní kontakty a obsah. PŘÍNOS: -30-50% churn v prvních 30 dnech.
3. **AI generátor nápadů na eventy a obsah** - AI analyzuje zájmy členů a navrhuje témata akcí, webinářů, workshopů které budou mít nejvyšší účast. PŘÍNOS: +25-40% účast na akcích.
4. **Predikce odchodu členů (churn prediction)** - AI identifikuje členy s rizikem odchodu na základě jejich aktivity a automaticky spouští retenční kampaně. PŘÍNOS: -20-40% měsíční churn.
5. **Automatická správa sociálních sítí** - AI tvoří obsah pro komunitu, odpovídá na komentáře, zapojuje členy do diskuzí. PŘÍNOS: +30-50% engagement na sociálních sítích.
6. **Personalizované doporučení obsahu** - AI doporučuje každému členovi relevantní články, videa, diskuze na základě jeho zájmů. PŘÍNOS: +40-60% konzumace obsahu.

Otázky k položení:
- Kolik nových členů získáváte měsíčně a jaký je váš churn?
- Jak komunikujete s členy? (email, Discord, Slack, WhatsApp?)
- Jaké akce pořádáte a jaká je průměrná účast?
- Co je hlavní důvod, proč členové odcházejí?

### PRO SLUŽBY (Fitka, salony, autoservisy, kliniky, poradny, coworkingy, atd.):
Nejvíce přínosné řešení:
1. **AI asistent pro rezervace** - AI asistent (hlasový i textový) natrénovaný na Vašich službách, cenách a dostupnosti. Klienti si mohou domlouvat [schůzky/tréninky/meetingy/termíny] přirozeně, jako by mluvili s člověkem. Napojený na kalendář a rezervační systém, automaticky potvrzuje termíny emailem/SMS.
2. **Asistent pro sociální sítě a recenze** - Napojený na Facebook, Instagram, TikTok, WhatsApp a Google recenze, automaticky odpovídá na dotazy a komentáře 24/7. Natrénovaný na Vašich informacích.
3. **Automatické připomínání termínů** - AI asistent volá klientům připomínky před termínem, snižuje počet lidí, co nepřijdou, o 60%.
4. **Automatické odpovědi na běžné dotazy** - AI asistent odpovídá na typické dotazy (otevírací doba, ceny, dostupnost) 24/7 bez lidské obsluhy.
5. **Sledování spokojenosti zákazníků** - AI sleduje náladu klientů v konverzacích, upozorní Vás na nespokojené zákazníky.

### PRO SOFTWAROVÉ FIRMY (IT, vývoj, technologie):
Nejvíce přínosné řešení:
1. **AI agent pro práci s databází** - Nástroj pro dotazování do databáze v češtině bez znalosti programování. Použití: zrychlení vlastního vývoje NEBO jako nový AI modul do produktů pro zákazníky = další zisk.
2. **Vývoj s pomocí AI** - Zapojení AI agenta (např. Cursor, GitHub Copilot) do editoru pro automatizaci psaní kódu. Úspora 30-50% času vývojářů.
3. **Automatické psaní dokumentace** - AI agent pravidelně prochází kód a sám píše srozumitelnou technickou dokumentaci. Konec problému s neaktuální dokumentací.
4. **Automatická kontrola kvality kódu** - Automatická kontrola kódu před odevzdáním, okamžitá detekce chyb a bezpečnostních rizik.
5. **Automatické vytváření testů** - Automatické vytváření kontrolních testů pro software, zajišťuje stabilitu systému bez ruční práce.

Otázky k položení:
- Jaké technologie/platformy používáte denně?
- Jak hledáte v interních dokumentech?
- Jak řešíte účetnictví a fakturaci?

### PRO MARKETINGOVÉ AGENTURY:
Nejvíce přínosné řešení:
1. **Automatické oslovování potenciálních zákazníků** - AI vyhledává potenciální zákazníky na webu i sociálních sítích (LinkedIn, Instagram) a píše jim personalizované zprávy s nabídkou.
2. **Automatický prodejní proces** - AI asistent okamžitě kontaktuje zájemce z reklamy 24/7, prověří jejich zájem (natrénovaný na Vašich datech) a domluví schůzku do kalendáře. Uvolní 80% opakujících se dotazů.
3. **Personalizované video oslovení** - Automatická tvorba osobních video vzkazů pro nové kontakty = výrazně více odpovědí na nabídky.
4. **Automatická tvorba reklam pomocí AI** - Tvorba profesionálních video reklam a produktových videí pomocí AI bez drahé produkce. Ušetří 70% nákladů na tvorbu videí.
5. **Automatická správa sociálních sítí** - AI tvoří texty i obrázky a sama je publikuje na Vaše profily. Automaticky odpovídá na komentáře a zprávy.
6. **Hlasový AI asistent pro oslovování** - Automatické navolávání nových potenciálních zákazníků hlasem s lidským projevem. Natrénovaný na Vaší nabídce.

Otázky k položení:
- Jak hledáte nové klienty mezi firmami?
- Jak tvoříte marketingové materiály (texty, weby)?
- Kolik času týdně strávíte tvorbou obsahu?

### PRO VÝROBNÍ FIRMY:
Nejvíce přínosné řešení:
1. **Předvídání poruch strojů** - AI předvídá závady dříve, než zastaví výrobu.
2. **AI kontrola kvality výrobků** - AI kamery okamžitě detekují vadné kusy na lince.
3. **Chytré plánování výroby** - AI plánuje výrobu pro maximální využití strojů a lidí.
4. **Chytré řízení skladových zásob** - Automatické doplňování skladu dle skutečné spotřeby a předpovědí.
5. **Virtuální model výroby** - Simulace procesů pro testování úspor bez rizika v reálném provozu.

### PRO E-COMMERCE / MALOOBCHOD:
Nejvíce přínosné řešení:
1. **Chytrá zákaznická podpora** - 24/7 odpovědi na dotazy hlasem i textem (natrénovaný na Vašich produktech a častých dotazech), sledování objednávek a reklamace bez lidí. Automaticky domlouvá schůzky, odesílá emaily, napojený na e-shop a systém pro správu zákazníků.
2. **Automatická tvorba produktových videí** - Tvorba poutavých videí produktů pro sociální sítě během sekund pomocí AI. Ušetří náklady na fotografy a produkci.
3. **Personalizované doporučení produktů** - AI nabízí produkty přímo na míru chování konkrétního zákazníka. Z každých 100 návštěvníků nakoupí o 20-40 více.
4. **Rychlé zpracování firemních poptávek** - AI asistent okamžitě kontaktuje velkoobchodní partnery, prověří jejich zájem a domlouvá schůzky.
5. **Asistent pro sociální sítě a recenze** - Automatické odpovídání na komentáře a recenze 24/7, natrénovaný na Vašich informacích.

### PRO CALL CENTRA A SLUŽBY (Autoservisy, kliniky, salony apod.):
Nejvíce přínosné řešení:
1. **Hlasový AI asistent** - AI sama volá zákazníkům (připomenutí servisu, potvrzení termínu), mluví přirozeně česky. Natrénovaný na datech Vaší společnosti, odpovídá jako expertní člen týmu.
2. **Rychlé kontaktování zájemců** - Automatické volání/psaní zájemcům z webových formulářů během několika sekund. Prověří zájem a domlouvá schůzky.
3. **Hlasový asistent pro rezervace** - Hlasový asistent sám domlouvá termíny schůzek/tréninků/meetingů do kalendáře jako by to byl člověk. Napojený na rezervační systém, kalendář, odesílá potvrzení a upozornění emailem/SMS.
4. **Sledování spokojenosti zákazníků** - AI sleduje náladu zákazníků v telefonátech a chatu pro zlepšení služeb. Upozorní Vás na nespokojené klienty.
5. **Asistent pro sociální sítě a recenze** - Napojený na Facebook, Instagram, TikTok, WhatsApp a Google recenze, automaticky odpovídá na dotazy a komentáře 24/7.

### PRO FINANČNÍ SLUŽBY:
Nejvíce přínosné řešení:
1. **Automatická analýza dokumentů** - AI bleskově kontroluje smlouvy a finanční dokumenty.
2. **Hlasový asistent pro zákazníky** - Automatické řešení požadavků po telefonu (zůstatky, blokace, info).
3. **Detekce podezřelých transakcí** - AI hlídá podezřelé transakce v reálném čase.
4. **Automatické finanční reporty** - Tvorba přehledů o hospodaření bez ruční práce s daty.`;
  }
  
  return `
## INDUSTRY-SPECIFIC RECOMMENDATIONS (SELECT RELEVANT BASED ON DETECTED INDUSTRY)

### IMPORTANT RULE FOR ALL INDUSTRIES:
Whenever you recommend an AI assistant/agent (chatbot/voicebot), ALWAYS explicitly mention:
- **Trained on the company's data** - will be able to answer as an expert member of their team
- **Automates customer support answers 24/7** - frees up 80% of routine FAQs
- **Can automatically book appointments into calendar**, send emails, notifications
- **Connected to booking system / CRM / calendar** as needed

### UNIVERSAL RECOMMENDATION FOR ALL INDUSTRIES WITH DOCUMENTATION:
**HypeAgent - Internal AI Agent (Private ChatGPT on Your Own Data)**

This is a KEY solution for any company that works with extensive documentation, has large websites, or performs administrative tasks based on large volumes of documents.

**Description:**
HypeAgent is our proprietary internal AI agent trained exclusively on your company documents. It functions as an "internal ChatGPT," but with a critical difference - your data remains fully under your control and is NEVER shared with OpenAI, Anthropic, Claude, or other external LLM providers. The solution runs on-premise or in a private cloud under your roof with maximum security.

**Key Benefits:**
- **Maximum data security** - Unlike ChatGPT or Claude, where your company data ends up as training data for their AI models, HypeAgent works purely on your data without any leakage. Suitable for companies with sensitive data (GDPR, trade secrets, customer personal data).
- **Deep Research on internal files** - The agent can search and analyze all your company documents, contracts, manuals, processes, emails, presentations. Responds based on real company information.
- **Deep web search** - In addition to internal data, it can search the web and combine company knowledge with current information.
- **AI content generation:**
  - Image and graphics creation (for presentations, social media, marketing materials)
  - Video generation (product videos, training materials, presentations)
  - Chart and diagram creation (from data, for reports)
  - Automatic presentation creation (PowerPoint/Google Slides)
- **Email management** - Automatic sorting, response suggestions, email sending
- **Integration with company systems:**
  - Google Drive, Google Docs, Google Sheets
  - Microsoft SharePoint, OneDrive
  - Dropbox, Box
  - Custom databases and CRM systems
- **One clean panel** - All AI functions accessible from one intuitive interface without switching between tools

**For whom:**
- Companies with extensive documentation (law firms, consulting firms, accounting)
- Companies with large websites/knowledge bases
- Administrative departments processing large volumes of documents
- IT companies needing quick access to technical documentation
- Any company where employees spend hours searching for information in documents

**ROI:**
Saves 15-25 hours per week on searching for information in documents, writing reports, creating presentations, and automating administrative tasks. Replacement of 2-3 junior positions with specialized AI agents.

### FOR SERVICE-BASED BUSINESSES (Gym, salon, auto repair, clinic, consultancy, coworking, etc.):
Highest ROI opportunities:
1. **AI Chatbot & Voicebot for booking appointments** - AI assistant (voice and text) trained on your services, prices, and availability. Clients can book [appointments/trainings/meetings/sessions] conversationally as if talking to a human. Connected to calendar and booking system, automatically confirms appointments via email/SMS.
2. **Social Media & Google Reviews Agent** - Connected to social networks (Facebook, Instagram, TikTok, WhatsApp, GMB) automatically responds to questions and comments on social media and Google reviews 24/7. Trained on your knowledge base.
3. **Automatic appointment reminders** - AI voicebot calls clients with reminders before appointments, reduces no-shows by 60%.
4. **FAQ automation** - AI assistant answers common questions (opening hours, prices, availability) 24/7 without human assistance.
5. **Automatic satisfaction monitoring** - AI monitors client sentiment in conversations, alerts about dissatisfied clients.

### FOR SOFTWARE COMPANIES (IT, development, technology):
Highest ROI opportunities:
1. **SQL Reasoning AI Agent** - AI agent that enables chatting with SQL database (translates natural language to SQL queries). Use: automate own development OR as new AI module for client products = additional revenue.
2. **AI-Assisted Development (Cursor, GitHub Copilot)** - AI agent in IDE for code automation. 30-50% time savings for developers.
3. **Automatic Documentation Writing** - AI agent periodically scans codebase and writes documentation for missing modules.
4. **Code Review AI** - Automatic code review before merge, bug and security detection.
5. **AI Test Generation** - Automatic unit test generation from code.

Questions to ask:
- What technologies/platforms do you use daily?
- How do you search internal documents?
- How do you handle accounting and invoicing?

### FOR MARKETING AGENCIES:
Highest ROI opportunities:
1. **Automated AI Outreach (Outbound)** - AI automatically finds potential customers (by keywords, industry, city) on the web and social networks (LinkedIn, Instagram), finds direct contacts and writes personalized messages + creates custom landing pages/funnels.
2. **Inbound Funnel Automation** - Automatic lead nurturing and qualification from ads via AI assistants. AI immediately contacts prospects, qualifies them, and books meetings into the calendar (all in real-time 24/7).
3. **AI Video Icebreakers** - Automatic creation of personalized video messages for cold outreach = extremely increases reply rate.
4. **Automated Product Video & Ad Creation** - Generating professional videos and ad spots for clients using AI (Sora, HeyGen, Kling) without needing expensive productions, photographers, and models.
5. **Social Media Automation** - AI creates marketing copy, images and automatically posts to social networks.
6. **Voice AI Assistants** - Automating cold calling for new opportunities or voice follow-ups for leads with human-like speech.

Questions to ask:
- How do you find new clients in B2B segment?
- How do you create marketing materials (copy, websites, funnels)?
- How many hours per week do you spend creating content?

### FOR MANUFACTURING COMPANIES:
Highest ROI opportunities:
1. **Predictive Maintenance** - AI predicts machine failures before they occur.
2. **Visual Quality Control** - AI camera detects defective products on the line.
3. **Production Plan Optimization** - AI plans production based on orders and capacity.
4. **AI Inventory Management** - Automatic material ordering based on consumption.
5. **Digital Twin** - Simulation of production processes for optimization.

### FOR E-COMMERCE / RETAIL:
Highest ROI opportunities:
1. **AI Chatbot & Voicebot (smart customer support)** - 24/7 answers via voice and text (trained on your products and FAQ), order tracking and claims without human operators. Automatically books appointments, sends emails, connected to e-shop and CRM.
2. **Auto-Generation of product videos** - Creating engaging product videos for social media (Facebook/Instagram/TikTok ads) in seconds using AI. Saves costs on photographers and production.
3. **Personalized product recommendations** - AI offers products tailored to specific customer behavior. Increases conversion by 20-40%.
4. **Quick B2B inquiry handling** - AI assistant immediately contacts wholesale partners or B2B inquiries, qualifies them and books meetings.
5. **Social Media & Google Reviews Agent** - Automatic response to comments and reviews 24/7 trained on your knowledge base.

### FOR CALL CENTERS AND SERVICES (Auto repairs, clinics, salons, etc.):
Highest ROI opportunities:
1. **Voice AI Assistants (digital phone operators)** - Full replacement/supplement for a call center. AI calls customers (service reminders, appointment confirmations), speaks naturally, and saves data to CRM. Trained on your company data, responds as an expert team member.
2. **AI assistant for quick prospect contact** - Automatic calling/messaging prospects from web forms within seconds. Qualifies inquiries and books meetings.
3. **Conversational voice assistant for bookings** - Voice assistant books appointments/trainings/meetings into calendar as if it were human. Connected to booking system, calendar, sends confirmation and reminder emails/SMS.
4. **Automatic customer satisfaction monitoring** - AI monitors customer sentiment in calls and chats to improve services. Alerts about dissatisfied clients.
5. **Social Media & Google Reviews Agent** - Connected to social networks (Facebook, Instagram, TikTok, WhatsApp, GMB) automatically responds to questions and comments 24/7.

### FOR FINANCIAL SERVICES:
Highest ROI opportunities:
1. **AI Due Diligence** - Automatic analysis of documents and contracts.
2. **Voice Assistants for Client Service** - Automatic handling of common requests over the phone (balances, card blocking, product info).
3. **Fraud Detection** - Real-time AI detection of suspicious transactions.
4. **KYC Automation** - AI identity and document verification.
5. **AI Financial Reporting** - Automatic report and dashboard generation.
6. **Client Chatbot** - Answers to questions about accounts, transactions, products.`;
}

/**
 * Search task definition for sequential execution with progress
 */
interface SearchTask {
  query: string;
  type: TavilySearchResult['type'];
  domain: string | null;
  step: ResearchStep;
}

/**
 * Execute all searches with progress callbacks
 * v3: Added technology and app searches, sequential execution for progress tracking
 */
async function executeSearchesWithProgress(
  apiKey: string,
  formData: AuditFormInputs,
  onProgress?: ProgressCallback
): Promise<TavilySearchResult[]> {
  const client = tavily({ apiKey });
  const querySets = generateQuerySets(formData);
  const domain = extractDomain(formData.website);
  const isCzech = formData.language === 'cs';
  
  // Define search tasks in order for progress tracking
  const searchTasks: SearchTask[] = [
    // Company info search
    { query: querySets.generic[0], type: 'generic', domain: null, step: 'search_company_info' },
    // Company news search
    { query: querySets.generic[1], type: 'generic', domain: null, step: 'search_company_news' },
    // Website/domain-specific search
    { query: querySets.domainSpecific[0], type: domain ? 'domain-specific' : 'generic', domain, step: 'search_website' },
    // Technology stack search
    { query: querySets.technology[0], type: 'technology', domain: null, step: 'search_technologies' },
    // Company apps search
    { query: querySets.apps[0], type: 'apps', domain: null, step: 'search_company_apps' },
    // AI tools search
    { query: querySets.aiTools[0], type: 'ai-tools', domain: null, step: 'search_ai_tools' },
  ];
  
  console.log(`[Agent] Executing ${searchTasks.length} Tavily searches with progress tracking...`);
  if (domain) {
    console.log(`[Agent] Domain-specific search restricted to: ${domain}`);
  }
  
  const results: TavilySearchResult[] = [];
  
  // Execute searches sequentially to provide accurate progress updates
  for (const task of searchTasks) {
    // Report progress before each search
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS[task.step];
      const message = isCzech ? stepConfig.messageCs : stepConfig.messageEn;
      await onProgress(task.step, stepConfig.progress, message);
    }
    
    // Execute the search
    const result = await executeTavilySearch(client, task.query, task.type, task.domain);
    results.push(result);
    
    console.log(`[Agent] Search "${task.step}" completed: ${result.success ? 'success' : 'failed'}`);
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`[Agent] Search phase complete: ${successCount}/${searchTasks.length} successful`);
  
  return results;
}

/**
 * Execute all searches in parallel (legacy function for backward compatibility)
 */
async function executeParallelSearches(
  apiKey: string,
  formData: AuditFormInputs
): Promise<TavilySearchResult[]> {
  return executeSearchesWithProgress(apiKey, formData);
}

// =============================================================================
// RESEARCH SYNTHESIS (LLM CALL)
// =============================================================================

/**
 * Format search results for the LLM prompt - uses FULL rawContent when available
 */
function formatSearchResultsForPrompt(results: TavilySearchResult[]): string {
  let totalChars = 0;
  
  const formatted = results.map((result, index) => {
    const items = result.results.map(r => {
      // Use full raw markdown content when available, fallback to snippet
      const contentToUse = r.rawContent && r.rawContent.length > 100 ? r.rawContent : r.content;
      totalChars += contentToUse.length;
      return `- **${r.title}**\n  ${contentToUse}\n  Source: ${r.url}`;
    }).join('\n\n');
    
    return `### Search ${index + 1} [${result.type}]: "${result.query}"
${result.success ? items || 'No results found' : 'Search failed'}`;
  }).join('\n\n---\n\n');
  
  console.log(`[Agent] Total search content for LLM: ${totalChars} characters`);
  
  return formatted;
}

/**
 * Generate the structured JSON research prompt
 */
function generateResearchPrompt(formData: AuditFormInputs, searchData: string, aiToolsData: string): string {
  const { companyName, city, industry, biggestPainPoint, currentTools, language } = formData;
  
  const isCzech = language === 'cs';
  
  const systemContext = isCzech
    ? `Jsi elitní AI auditor a konzultant společnosti ${clientConfig.company.name}. Tvým úkolem je na základě výzkumu vytvořit STRUKTUROVANÝ JSON output pro audit report.

    ## PRAVIDLA PRO JAZYK A STYL (KRITICKY DŮLEŽITÉ!)
    
    Piš jako PROFESIONÁLNÍ COPYWRITER, který mluví s majitelem české firmy. Tvůj text musí být:
    - Srozumitelný pro člověka BEZ technického vzdělání
    - Přesvědčivý a prodejní (ukazuj HODNOTU, ne technické detaily)
    - V přirozené češtině, ne v překladu z angličtiny
    
    ### ZAKÁZANÁ SLOVA A JEJICH NÁHRADY:
    - NIKDY nepiš "leady" → piš "nové obchodní příležitosti" nebo "potenciální zákazníky"
    - NIKDY nepiš "konverze" bez vysvětlení → piš "přeměna zájemců na platící zákazníky"
    - NIKDY nepiš "ROI" → piš "návratnost investice" nebo "kolik se Vám to vrátí"
    - NIKDY nepiš "NPS" → piš "spokojenost zákazníků měřená průzkumem"
    - NIKDY nepiš "engagement" → piš "zapojení" nebo "interakce"
    - NIKDY nepiš "customer journey" → piš "cesta zákazníka od zájmu k nákupu"
    - NIKDY nepiš "touchpoint" → piš "kontaktní místo" nebo "místo interakce"
    - NIKDY nepiš "pipeline" → piš "obchodní příležitosti" nebo "rozpracované zakázky"
    - NIKDY nepiš "CRM" bez vysvětlení → piš "CRM (systém pro správu zákazníků)"
    - NIKDY nepiš "ERP" bez vysvětlení → piš "ERP (podnikový informační systém)"
    - NIKDY nepiš "API" bez vysvětlení → piš "napojení na jiné systémy"
    
    ### PRAVIDLA PRO POPIS PŘÍNOSŮ:
    - Místo "zvýší konverzi o 20%" piš "z každých 100 zájemců se stane zákazníky o 20 více"
    - Místo "generuje X leadů" piš "přivede X nových potenciálních zákazníků"
    - Místo "automatizuje workflow" piš "automaticky zpracuje opakující se úkoly"
    - VŽDY vysvětli PROČ je to přínosné, ne jen CO to dělá
    
    ### EMOJIS:
    Nepoužívej EMOJIS v žádném textovém poli KROMĚ pole 'icon' v 'auditQuestions', 'detectedTechnologies' a 'expectedBenefits'.
    
    Každý nástroj musí mít, pokud je to možné, přímou URL adresu na jeho web.`
    : `You are an elite AI auditor and consultant at ${clientConfig.company.name}. Your task is to create a STRUCTURED JSON output for an audit report based on research.

    ## LANGUAGE AND STYLE RULES (CRITICAL!)
    
    Write like a PROFESSIONAL COPYWRITER talking to a business owner. Your text must be:
    - Understandable for someone WITHOUT technical education
    - Persuasive and sales-oriented (show VALUE, not technical details)
    - In natural language, not technical jargon
    
    ### FORBIDDEN WORDS AND REPLACEMENTS:
    - NEVER write "leads" without explanation → write "potential customers" or "business opportunities"
    - NEVER write "conversion" without explanation → write "turning prospects into paying customers"
    - NEVER write "ROI" without explanation → write "return on investment" or "how much you'll get back"
    - NEVER write "NPS" → write "customer satisfaction measured by survey"
    - NEVER write "engagement" without context → write "interaction" or "involvement"
    - NEVER write "customer journey" → write "the path from interest to purchase"
    - NEVER write "touchpoint" → write "contact point" or "interaction point"
    - NEVER write "pipeline" without explanation → write "deals in progress" or "sales opportunities"
    - NEVER write "CRM" without explanation → write "CRM (customer management system)"
    - NEVER write "ERP" without explanation → write "ERP (business management system)"
    - NEVER write "API" without explanation → write "connection to other systems"
    
    ### RULES FOR DESCRIBING BENEFITS:
    - Instead of "increases conversion by 20%" write "for every 100 prospects, 20 more become customers"
    - Instead of "generates X leads" write "brings X new potential customers"
    - Instead of "automates workflow" write "automatically handles repetitive tasks"
    - ALWAYS explain WHY it's beneficial, not just WHAT it does
    
    ### EMOJIS:
    Do not use EMOJIS in any text field EXCEPT the 'icon' field in 'auditQuestions', 'detectedTechnologies', and 'expectedBenefits'.
    
    Each tool should have a direct URL to its website if possible.`;

  const jsonSchema = `
{
  "companyProfile": {
    "detectedIndustry": "string - detected industry based on research",
    "description": "string - 1-2 sentence company summary"
  },
  "companyContext": "string - personalized 2-3 sentence intro paragraph about this specific company based on their recent activities, news, or situation from search results. Write conversationally without jargon, mentioning concrete details about what they do. For deeper analysis, recommend in-person audit.",
  "detectedTechnologies": [
    {
      "name": "string - technology/platform name (e.g., Shopify, WordPress, React, custom CRM)",
      "category": "cms | ecommerce | crm | erp | custom_app | framework | database | cloud | other",
      "confidence": "high | medium | low",
      "description": "string - brief description of how they use it"
    }
  ],
  "hasOwnApplication": boolean,
  "ownApplicationDetails": "string | null - if hasOwnApplication is true, describe what the app does",
  "appIntegrationOpportunities": [
    {
      "title": "string - integration opportunity name",
      "description": "string - detailed explanation of how AI would integrate with their app/system",
      "implementationType": "api_integration | widget | standalone_module | voice_interface | chatbot_embed",
      "estimatedEffort": "low | medium | high",
      "potentialImpact": "string - expected business impact in concrete terms"
    }
  ],
  "industryBenchmark": {
    "aiAdoptionRate": number,
    "topUseCases": ["string - common AI use case 1", "string - use case 2", "string - use case 3"],
    "competitorInsights": "string - what competitors or similar companies are doing with AI",
    "marketTrend": "string - brief market trend for AI in this industry"
  },
  "implementationTimeline": [
    {
      "phase": "quick_start | short_term | medium_term | long_term",
      "title": "string - phase title",
      "duration": "string - e.g., '1-2 weeks', '1-3 months'",
      "items": ["string - item 1", "string - item 2"]
    }
  ],
  "riskAssessment": [
    {
      "category": "data_privacy | employee_adoption | technical | regulatory | financial",
      "title": "string - risk title",
      "severity": "low | medium | high",
      "description": "string - what the risk is",
      "mitigation": "string - how to mitigate this risk"
    }
  ],
  "auditQuestions": [
    {
      "category": "string - category name (e.g., 'Team & Responsibilities', 'Processes & Workflows', 'Tools Used', 'Main Challenges', 'Future Goals')",
      "icon": "string - one relevant emoji for this category",
      "questions": ["string - question 1", "string - question 2", "..."]
    }
  ],
  "aiOpportunities": [
    {
      "title": "string - název AI řešení (v češtině, bez žargonu, např. 'Chytrý asistent pro recepci')",
      "description": "string - detailní popis (min. 4-5 vět) o tom, co to je, jak to funguje, jak to pomůže této konkrétní firmě a jaký je očekávaný přínos v číslech",
      "quadrant": "quick_win | big_swing | nice_to_have | deprioritize",
      "estimatedSavingsHoursPerWeek": number,
      "implementationEffort": "low | medium | high",
      "aiType": "automation | ml | genai | hybrid",
      "expectedBenefits": [
        {
          "type": "time_savings | lead_generation | conversion_rate | new_customers | revenue_increase | cost_reduction | error_reduction | customer_satisfaction | response_time | availability",
          "value": "string - konkrétní hodnota (např. '10-15', '30%', '24/7')",
          "unit": "string - jednotka (např. 'h/týden', 'leadů/měsíc', '%')",
          "label": "string - popis přínosu (např. 'Úspora času', 'Nové leady')",
          "icon": "string - jedno emoji"
        }
      ]
    }
  ],
  "recommendedTools": [
    {
      "name": "string - tool name",
      "category": "string - e.g., 'Meetings', 'Content', 'CRM'",
      "useCase": "string - how this company would use it",
      "url": "string - direct URL to tool website"
    }
  ],
  "roiEstimate": {
    "totalHoursSavedPerWeek": number,
    "defaultHourlyRate": number,
    "assumptions": ["string - assumption 1", "string - assumption 2"]
  },
  "expectedBenefitsSummary": {
    "introText": "string - úvodní odstavec pro Executive Summary (2-3 věty vysvětlující, co report obsahuje a co firma může očekávat)",
    "benefits": [
      {
        "type": "time_savings | lead_generation | conversion_rate | new_customers | revenue_increase | cost_reduction | error_reduction | customer_satisfaction | response_time | availability",
        "value": "string - souhrnná hodnota za všechny příležitosti (např. '50-80', '+25%')",
        "unit": "string - jednotka",
        "label": "string - popis přínosu",
        "icon": "string - jedno emoji"
      }
    ],
    "disclaimer": "string - disclaimer o tom, že jde o odhady"
  }
}`;

  // Get industry-specific recommendations
  const industryRecommendations = getIndustrySpecificRecommendations(language);

  const instructions = isCzech
    ? `## INSTRUKCE

Na základě informací o společnosti ${companyName} (${city}) a výsledků vyhledávání vytvoř strukturovaný JSON output.

### DŮLEŽITÉ: NEJPRVE DETEKUJ ODVĚTVÍ A TYP PODNIKÁNÍ
Analyzuj webové stránky a výsledky vyhledávání a PŘESNĚ urči, v jakém odvětví firma působí. BUĎTE SPECIFIČTÍ - nepoužívejte "Jiné" pokud lze odvětví identifikovat:
- **Komunita / Membership / Klub / Spolek / Networking** (např. Growth Club, mastermind skupiny, profesní kluby, zájmové komunity)
- Softwarová firma / IT / Technologie
- Marketingová agentura / Digitální agentura
- Výrobní firma / Průmysl
- E-commerce / Online obchod / Retail
- Finanční služby / Účetnictví / Pojišťovnictví
- Zdravotnictví / Klinika / Ordinace / Lékařství
- **Fitness / Posilovna / Tělocvična / Sport** (např. Alpha Gym, fitness centra)
- **Salon / Kadeřnictví / Beauty / Wellness** (kadeřnictví, kosmetika, masáže)
- **Autoservis / Automobilový průmysl** (opravy, pneuservisy, STK)
- **Horeca / Restaurace / Kavárna / Pohostinství**
- Stavebnictví / Realitní kancelář
- Logistika / Doprava / Skladování
- Vzdělávání / Školství / Kurzy / Akademie
- Veřejná správa / Státní instituce
- Poradenství / Konzultace / B2B služby
- Coworking / Kanceláře / Prostory
- Jiné (POUZE pokud opravdu nepadá do žádné kategorie výše)

PRAVIDLA PRO DETEKCI:
- Pokud vidíte "komunita", "club", "membership", "členství", "networking", "mastermind" → Komunita/Membership
- Pokud vidíte "gym", "fitness", "trénink", "posilovna", "cvičení" → Fitness/Sport
- Pokud vidíte "kurzy", "vzdělávání", "akademie", "školení" → Vzdělávání

### PERSONALIZOVANÝ ÚVOD (companyContext)
Vytvoř 2-3 věty specifické pro tuto konkrétní společnost na základě výsledků vyhledávání:
- Zmíň konkrétní informace o tom, co firma dělá (služby, produkty, zaměření)
- Pokud najdeš aktuální novinky, události, aktivity nebo zajímavosti z Tavily výsledků - zahrň je
- Piš KONVERZAČNĚ, LIDSKY, BEZ ŽARGONU - jako by ses bavil s majitelem
- NIKDY NEPOUŽÍVEJ EMOJIS!
- Na konci navrhni, že pro přesné doporučení doporučujete osobní schůzku a hlubší audit

Příklad (pro Alpha Gym): "Alpha Gym v Ústí nad Labem je posilovna zaměřená na moderní tréninkové metody a osobní přístup ke klientům. Z vašeho webu vidíme, že nabízíte skupinové lekce i individuální tréninky s osobním trenérem. Pro fitcentra jako je to vaše má AI obrovský potenciál - od automatického bookování tréninků, přes AI asistenta pro rychlé odpovědi na dotazy klientů, až po automatické připomínky a správu členství. Pro přesné zmapování vašich procesů a návrh řešení šitého přímo na míru doporučujeme osobní schůzku."

### AUDITNÍ OTÁZKY (auditQuestions) - OTÁZKY K ZAMYŠLENÍ
Vytvoř PŘESNĚ 7 kategorií hloubkových otázek, které donutí majitele/CEO se vážně zamyslet nad transformací své firmy. Každá kategorie musí mít 3-5 konkrétních, někdy i nepříjemných otázek:

1. Role & Tým (Team & Responsibilities) - hloubkové otázky o efektivitě týmu.
2. Klíčové procesy (Processes & Workflow) - kde se pálí nejvíce času?
3. Nástroje & Technologie (Tools) - modernost stávajícího stacku.
4. Největší bariéry (Pain Points) - co firmu skutečně brzdí?
5. Budoucí vize (Future Vision) - kde chce být firma za 3 roky díky AI?
6. Bezpečnost, GDPR & AI Act (Security & Legal) - Zásadní otázky na připravenost:
   - Je firma připravena na regulaci EU AI Act (klasifikace rizik)?
   - Jak řešíte únik firemního know-how do veřejných LLM?
   - Máte nastavenou politiku pro stínové AI (zaměstnanci používající vlastní AI nástroje)?
7. Firemní kultura & Odhodlání lídra (Leadership & Culture) - "Hard truths" otázky:
   - Jste jako CEO připraveni VYŽADOVAT používání AI od všech zaměstnanců i přes jejich odpor?
   - Jak naložíte s lidmi, kteří se odmítnou adaptovat?
   - Jste připraveni na radikální zeštíhlení týmu, kde 1 senior s AI nahradí 10 juniorů?
   - Co uděláte s ušetřeným časem – investujete ho do růstu, nebo do snížení nákladů (propouštění)?

### AI PŘÍLEŽITOSTI (aiOpportunities) - NEJDŮLEŽITĚJŠÍ ČÁST!
Vytvoř PŘESNĚ 10 konkrétních AI řešení s NEJVYŠŠÍM ROI pro tuto firmu. 
Hledej příležitosti, které mají největší dopad na efektivitu a ziskovost.

POVINNĚ POUŽIJ DOPORUČENÍ Z NÁSLEDUJÍCÍ SEKCE DLE DETEKOVANÉHO ODVĚTVÍ:

${industryRecommendations}

PRAVIDLA PRO KVADRANTY (pro 10 položek):
- quick_win: Vysoký dopad, nízká náročnost (implementovat HNED) - MINIMÁLNĚ 4-5 položek musí být quick_win!
- big_swing: Vysoký dopad, vysoká náročnost (strategické projekty) - 2-3 položky
- nice_to_have: Nízký dopad, nízká náročnost (když bude čas) - 1-2 položky
- deprioritize: Nízký dopad, vysoká náročnost (nejspíš vynechat) - max 1 položka

PRAVIDLA PRO POPIS KAŽDÉ PŘÍLEŽITOSTI (KRITICKY DŮLEŽITÉ!):
1. NÁZEV (title) - MUSÍ BÝT CATCHY A PROFESIONÁLNÍ:
   PRAVIDLO: Piš názvy jako profesionální copywriter - krátké, úderné, zapamatovatelné, jako by to byl hotový produkt.
   
   ✅ SPRÁVNĚ (catchy, sleek, profesionální):
   - "ReceptionBot Pro - Chytrá recepce 24/7"
   - "DataSync AutoPilot - Inteligentní reporty"
   - "VoiceGuard - AI hlasový asistent"
   - "LeadHunter AI - Automatický lov zákazníků"
   - "MeetingGenius - Automatické zápisy ze schůzek"
   - "ChatPulse 24/7 - Zákaznická podpora bez přestávky"
   
   ❌ ŠPATNĚ (nudné, generické, zapomenutelné):
   - "AI Chatbot pro zákaznickou podporu"
   - "Automatizované reporty a dashboardy"
   - "Hlasový AI asistent pro telefonní hovory"
   - "Automatické psaní dokumentace"
   
   FORMÁT: "[Catchy název] - [Krátký popis co to dělá]"
   - První část = produktový název (2-3 slova, moderní, zapamatovatelný)
   - Druhá část = stručný benefit (3-6 slov)
   - Celková délka: maximálně 50 znaků
   - Zní jako profesionální SaaS produkt, ne jako technický popis

2. POPIS (description): MUSÍ být mnohem delší, popisný a obsahovat MINIMÁLNĚ 4-5 vět:
   - Věta 1: Co přesně toto řešení dělá a jak technicky funguje (vysvětli to srozumitelně pro majitele firmy).
   - Věta 2: Jak KONKRÉTNĚ pomůže TÉTO FIRMĚ v jejich každodenní práci (zmíň jejich služby/niche).
   - Věta 3: Očekávaný přínos a ROI (např. "ušetří vašemu týmu 15 hodin týdně na manuálním přepisování dat").
   - Věta 4: Jaké další výhody to přináší (např. 24/7 dostupnost, eliminace lidských chyb).
   - Věta 5: Jak náročná je implementace a co je k ní potřeba.

3. ČESKÝ JAZYK BEZ ŽARGONU: Piš jako špičkový profesionální konzultant, který mluví s lidmi. Žádný robotický text.
   ŠPATNĚ: "AI-powered NLP chatbot pro customer support automation"
   SPRÁVNĚ: "Hlasový asistent natrénovaný na vašem ceníku a službách, který sám vyřizuje hovory, domlouvá termíny tréninků do kalendáře a odesílá potvrzovací SMS. Funguje 24/7 i mimo otevírací dobu recepce, takže už nikdy nezmeškáte žádného klienta."

4. ROI MUSÍ BÝT JASNÁ: V KAŽDÉM popisu musí být jasně vidět, proč se to vyplatí. Buďte konkrétní v tom, co firma získá.

5. OČEKÁVANÉ PŘÍNOSY (expectedBenefits) - KRITICKY DŮLEŽITÉ!
   Pro KAŽDOU příležitost vygeneruj 2-4 konkrétní přínosy. PŘÍNOSY MUSÍ BÝT RELEVANTNÍ PRO DETEKOVANÝ TYP PODNIKÁNÍ!
   
   ### TYPY PŘÍNOSŮ DLE TYPU PODNIKÁNÍ:
   
   **PRO KOMUNITY / MEMBERSHIP / KLUBY (priorita!):**
   - member_acquisition: label="Noví členové" (např. "10-25" členů/měsíc) - PRIMÁRNÍ METRIKA!
   - churn_reduction: label="Snížení odchodu členů" (např. "20-40" %) - VELMI DŮLEŽITÉ!
   - member_engagement: label="Zapojení členů" (např. "+30-50" % aktivních) - DŮLEŽITÉ!
   - event_attendance: label="Účast na akcích" (např. "+25-40" %) - PRO KOMUNITY S AKCEMI
   
   **PRO E-COMMERCE / ONLINE OBCHODY (priorita!):**
   - revenue_increase: label="Nárůst tržeb" (např. "+15-30" %) - PRIMÁRNÍ METRIKA!
   - conversion_rate: label="Více platících zákazníků" (např. "+15-25" %) - VELMI DŮLEŽITÉ!
   - products_sold: label="Více prodaných produktů" (např. "+20-40" %) - DŮLEŽITÉ!
   - cart_abandonment_reduction: label="Méně opuštěných košíků" (např. "-30-50" %) - PRO E-SHOPY
   
   **PRO VZDĚLÁVÁNÍ / KURZY / AKADEMIE (priorita!):**
   - student_acquisition: label="Noví studenti" (např. "15-30" studentů/měsíc) - PRIMÁRNÍ!
   - course_completion: label="Dokončení kurzů" (např. "+20-35" %) - VELMI DŮLEŽITÉ!
   - customer_satisfaction: label="Spokojenější studenti" (např. "+15-25" bodů)
   
   **UNIVERZÁLNÍ TYPY (použij kde relevantní):**
   - time_savings: label="Úspora času" (např. "10-15" h/týden) - PRO AUTOMATIZACE
   - lead_generation: label="Nové obchodní příležitosti" (např. "20-40" příležitostí/měsíc)
   - new_customers: label="Noví zákazníci" (např. "8-15" zákazníků/měsíc)
   - cost_reduction: label="Snížení nákladů" (např. "100-200K" Kč/rok)
   - error_reduction: label="Méně chyb" (např. "60-80" %)
   - customer_satisfaction: label="Spokojenější zákazníci" (např. "+10-20" bodů)
   - response_time: label="Rychlejší reakce" (např. "80-90" % rychlejší)
   - availability: label="Nepřetržitá dostupnost" (např. "24/7")
   
   ### KRITICKÁ PRAVIDLA PRO VÝBĚR PŘÍNOSŮ:
   1. PRO KOMUNITY: VŽDY použij member_acquisition nebo churn_reduction jako PRVNÍ přínos!
   2. PRO E-COMMERCE: VŽDY použij revenue_increase nebo conversion_rate jako PRVNÍ přínos!
   3. PRO VZDĚLÁVÁNÍ: VŽDY použij student_acquisition nebo course_completion jako PRVNÍ přínos!
   4. PRO SLUŽBY: VŽDY použij new_customers nebo customer_satisfaction jako PRVNÍ přínos!
   5. PRO IT/SOFTWARE: time_savings a cost_reduction jsou PRIMÁRNÍ!
   
   NEPOUŽÍVEJ time_savings jako primární metriku pro:
   - Komunity (primární = noví členové, snížení churnu)
   - E-commerce (primární = tržby, konverze)
   - Vzdělávání (primární = noví studenti, dokončení kurzů)
   
   DŮLEŽITÉ PRO LABEL POLE:
   - NIKDY nepoužívej "leady" - piš "Nové obchodní příležitosti"
   - NIKDY nepoužívej "konverze" - piš "Více platících zákazníků"
   - NIKDY nepoužívej "NPS body" - piš "bodů spokojenosti"
   - Label musí být srozumitelný pro majitele firmy bez IT vzdělání
   
   PRAVIDLA:
   - Každý přínos MUSÍ mít konkrétní číselnou hodnotu (rozsah je OK)
   - Přínosy musí být REALISTICKÉ pro daný typ řešení a velikost firmy
   - PRVNÍ přínos MUSÍ být NEJDŮLEŽITĚJŠÍ pro daný typ podnikání!

Uživatel uvedl jako pain point: ${biggestPainPoint || 'Neuvedeno'}
Uživatel používá nástroje: ${currentTools || 'Neuvedeno'}

### DETEKOVANÉ TECHNOLOGIE (detectedTechnologies)
Na základě vyhledávání urči, jaké technologie firma používá:
- CMS (WordPress, Wix, Squarespace)
- E-commerce platformy (Shopify, WooCommerce, PrestaShop)
- CRM systémy (Salesforce, HubSpot, Pipedrive)
- ERP systémy (SAP, Pohoda, Money S3)
- Vlastní aplikace nebo software
- Frameworky a programovací jazyky (pokud je to IT firma)
Uveď 3-6 technologií s úrovní jistoty (high/medium/low).

### VLASTNÍ APLIKACE (hasOwnApplication, ownApplicationDetails)
Urči, zda má firma vlastní mobilní aplikaci, webovou aplikaci nebo software produkt.
- Pokud ANO: nastav hasOwnApplication na true a popiš, co aplikace dělá
- Pokud NE: nastav hasOwnApplication na false a ownApplicationDetails na null

### PŘÍLEŽITOSTI PRO INTEGRACI AI (appIntegrationOpportunities)
VELMI DŮLEŽITÉ! Pokud firma má vlastní aplikaci:
- Navrhni 2-4 konkrétní způsoby, jak by mohli do své aplikace integrovat AI
- Např.: AI chatbot widget, hlasové rozhraní, personalizované doporučení, prediktivní funkce
- Každý návrh musí být specifický pro jejich aplikaci/systém

Pokud firma NEMÁ vlastní aplikaci:
- Navrhni, jak by mohli vytvořit AI modul/aplikaci pro své zákazníky
- Např.: zákaznický portál s AI, rezervační systém s AI asistentem, B2B nástroj

### BENCHMARK ODVĚTVÍ (industryBenchmark)
Uveď statistiky a trendy pro dané odvětví:
- aiAdoptionRate: procento firem v odvětví, které už AI používají (odhad 15-60%)
- topUseCases: 3 nejčastější využití AI v tomto odvětví
- competitorInsights: co dělají konkurenti nebo podobné firmy s AI
- marketTrend: krátký popis trendu AI v tomto odvětví

### ČASOVÁ OSA IMPLEMENTACE (implementationTimeline)
Vytvoř 4 fáze implementace:
1. quick_start (1-2 týdny): Okamžité kroky bez velkých investic
2. short_term (1-3 měsíce): Rychlé výhry s nízkým úsilím
3. medium_term (3-6 měsíců): Strategické projekty
4. long_term (6-12 měsíců): Transformační iniciativy

### HODNOCENÍ RIZIK (riskAssessment)
Identifikuj 3-5 hlavních rizik spojených s implementací AI:
- data_privacy: Rizika spojená s ochranou dat a GDPR
- employee_adoption: Rizika spojená s přijetím AI zaměstnanci
- technical: Technická rizika a komplexita
- regulatory: Regulatorní rizika (EU AI Act)
- financial: Finanční rizika a návratnost investice
Ke každému riziku uveď závažnost a způsob mitigace.

### DOPORUČENÉ NÁSTROJE (recommendedTools)
Na základě výsledků vyhledávání AI nástrojů doporuč 5-8 konkrétních nástrojů vhodných pro tuto firmu.
KAŽDÝ NÁSTROJ MUSÍ MÍT URL ODKAZ NA WEB!

### ROI ODHAD (roiEstimate)
Odhadni celkové týdenní úspory času (součet hodin ze všech 10 příležitostí).
Hodinová sazba dle odvětví v Kč:
- IT/Software: 600-800 Kč/h
- Marketing: 500-700 Kč/h
- Výroba: 400-500 Kč/h
- Ostatní: 400-600 Kč/h

Uveď 2-3 předpoklady výpočtu.

### EXECUTIVE SUMMARY - SHRNUTÍ PŘÍNOSŮ (expectedBenefitsSummary)
Vytvoř SOUHRNNÉ přínosy pro CELÝ report, které se zobrazí na úplném ZAČÁTKU jako "Executive Summary".
PŘÍNOSY MUSÍ BÝT PŘIZPŮSOBENY DETEKOVANÉMU TYPU PODNIKÁNÍ!

1. **introText**: Úvodní odstavec (2-3 věty) PŘIZPŮSOBENÝ typu podnikání:
   
   PRO KOMUNITY/MEMBERSHIP:
   "Na této stránce naleznete předběžný AI audit vytvořený na míru pro {companyName}. AI vám pomůže získat více členů, snížit jejich odchod a zvýšit zapojení celé komunity. Níže je shrnutí očekávaných přínosů:"
   
   PRO E-COMMERCE:
   "Na této stránce naleznete předběžný AI audit vytvořený na míru pro {companyName}. AI zvýší vaše tržby díky personalizaci, lepší konverzi a automatizované zákaznické podpoře. Níže je shrnutí očekávaných přínosů:"
   
   PRO VZDĚLÁVÁNÍ:
   "Na této stránce naleznete předběžný AI audit vytvořený na míru pro {companyName}. AI vám pomůže přilákat více studentů, zvýšit dokončení kurzů a personalizovat vzdělávací zážitek. Níže je shrnutí očekávaných přínosů:"
   
   PRO OSTATNÍ:
   "Na této stránce naleznete předběžný AI audit vytvořený na míru pro {companyName}. Tento report obsahuje předběžné návrhy na implementaci umělé inteligence pro co nejvyšší přínos pro Vaši firmu. Níže je shrnutí očekávaných přínosů:"

2. **benefits**: Pole 4-6 SOUHRNNÝCH přínosů SEŘAZENÝCH DLE DŮLEŽITOSTI PRO DANÝ TYP PODNIKÁNÍ:
   
   PRO KOMUNITY/MEMBERSHIP (v tomto pořadí!):
   1. Noví členové (member_acquisition) - PRVNÍ A NEJDŮLEŽITĚJŠÍ!
   2. Snížení odchodu členů (churn_reduction)
   3. Zapojení členů (member_engagement)
   4. Úspora času na správě (time_savings) - až jako POSLEDNÍ
   
   PRO E-COMMERCE (v tomto pořadí!):
   1. Nárůst tržeb (revenue_increase) - PRVNÍ A NEJDŮLEŽITĚJŠÍ!
   2. Více platících zákazníků (conversion_rate)
   3. Noví zákazníci (new_customers)
   4. Úspora času (time_savings) - až jako POSLEDNÍ
   
   PRO VZDĚLÁVÁNÍ (v tomto pořadí!):
   1. Noví studenti (student_acquisition) - PRVNÍ A NEJDŮLEŽITĚJŠÍ!
   2. Dokončení kurzů (course_completion)
   3. Spokojenost studentů (customer_satisfaction)
   4. Úspora času (time_savings) - až jako POSLEDNÍ
   
   PRO IT/SOFTWARE:
   1. Úspora času vývojářů (time_savings) - PRVNÍ!
   2. Snížení nákladů (cost_reduction)
   3. Méně chyb (error_reduction)
   4. Rychlejší reakce (response_time)
   
   Každý benefit má: type, value (konkrétní čísla), unit, label, icon (emoji)

3. **disclaimer**: Text typu:
   "* Uvedené odhady vychází z průměrných hodnot podobných implementací v odvětví. Skutečné výsledky se mohou lišit dle specifických podmínek Vaší firmy a rozsahu implementace."`
    : `## INSTRUCTIONS

Based on information about company ${companyName} (${city}) and search results, create a structured JSON output.

### IMPORTANT: FIRST DETECT THE INDUSTRY
Analyze the website and search results to PRECISELY determine which industry the company operates in. BE SPECIFIC - don't use "Other" if the industry can be identified:
- Software company / IT / Technology
- Marketing agency / Digital agency
- Manufacturing company / Industry
- E-commerce / Online store / Retail
- Financial services / Accounting / Insurance
- Healthcare / Clinic / Medical practice / Medicine
- **Fitness / Gym / Sports center** (e.g., fitness centers, gyms)
- **Salon / Hair salon / Beauty / Wellness** (hairdressing, cosmetics, massage)
- **Auto repair / Automotive industry** (repairs, tire services, MOT)
- **Horeca / Restaurant / Café / Hospitality**
- Construction / Real estate
- Logistics / Transport / Warehousing
- Education / Schools / Courses
- Public sector / Government institutions
- Consultancy / Consulting / B2B services
- Coworking / Offices / Spaces
- Other (ONLY if it really doesn't fit any of the above categories)

RULE: If you see keywords like "gym", "fitness", "training", "workout", "exercise" → Fitness/Sports

### PERSONALIZED INTRODUCTION (companyContext)
Create 2-3 sentences specific to this particular company based on search results:
- Mention concrete information about what the company does (services, products, focus)
- If you find current news, events, activities or interesting facts from Tavily results - include them
- Write CONVERSATIONALLY, HUMANLY, WITHOUT JARGON - as if talking to the owner
- NEVER USE EMOJIS!
- At the end, suggest that for precise recommendations you recommend a personal meeting and deeper audit

Example (for Alpha Gym): "Alpha Gym in Ústí nad Labem is a gym focused on modern training methods and a personal approach to clients. From your website, we can see that you offer both group classes and individual training with a personal trainer. For fitness centers like yours, AI has enormous potential - from automatic training booking, through AI assistant for quick answers to client questions, to automatic reminders and membership management. For precise mapping of your processes and a solution tailored directly to your needs, we recommend a personal meeting."

### AUDIT QUESTIONS (auditQuestions) - QUESTIONS FOR REFLECTION
Create EXACTLY 7 categories of deep questions that will force the owner/CEO to seriously think about the transformation of their company. Each category must have 3-5 specific, sometimes uncomfortable questions:

1. Role & Team Overview - deep questions about team efficiency and responsibilities.
2. Core Processes & Workflow - where is the most time being wasted?
3. Tools & Technology - modernization of the current stack.
4. Pain Points & Challenges - what is actually holding the company back?
5. Future Vision - where does the company want to be in 3 years thanks to AI?
6. Security, GDPR & AI Act (Security & Legal) - Critical readiness questions:
   - Is the company ready for EU AI Act regulation (risk classification)?
   - How do you handle the leakage of corporate know-how into public LLMs?
   - Do you have a policy for "Shadow AI" (employees using their own AI tools)?
7. Corporate Culture & Leader's Decisiveness (Leadership & Culture) - "Hard truths" questions:
   - Are you as CEO ready to MANDATE the use of AI for all employees despite their resistance?
   - How will you handle people who refuse to adapt?
   - Are you ready for a radical downsizing where 1 senior with AI replaces 10 juniors?
   - What will you do with the saved time – invest it in growth or in cost reduction (layoffs)?

Each category should have 3-5 specific questions.

### AI OPPORTUNITIES (aiOpportunities) - MOST IMPORTANT PART!
Create EXACTLY 10 specific AI solutions with HIGHEST ROI for this company.
MUST USE RECOMMENDATIONS FROM THE FOLLOWING SECTION BASED ON DETECTED INDUSTRY:

${industryRecommendations}

QUADRANT RULES (for 10 items):
- quick_win: High impact, low effort (implement NOW) - MINIMUM 4 items must be quick_win!
- big_swing: High impact, high effort (strategic projects) - 2-3 items
- nice_to_have: Low impact, low effort (when there's time) - 2-3 items
- deprioritize: Low impact, high effort (probably skip) - max 1 item

RULES FOR EACH OPPORTUNITY DESCRIPTION (VERY IMPORTANT!):
1. TITLE - MUST BE CATCHY AND PROFESSIONAL:
   RULE: Write titles like a professional copywriter - short, punchy, memorable, like it's a ready-made product.
   
   ✅ CORRECT (catchy, sleek, professional):
   - "ReceptionBot Pro - Smart 24/7 Reception"
   - "DataSync AutoPilot - Intelligent Reports"
   - "VoiceGuard - AI Voice Assistant"
   - "LeadHunter AI - Automatic Customer Acquisition"
   - "MeetingGenius - Auto Meeting Notes"
   - "ChatPulse 24/7 - Non-Stop Customer Support"
   
   ❌ WRONG (boring, generic, forgettable):
   - "AI Chatbot for Customer Support"
   - "Automated Reports and Dashboards"
   - "Voice AI Assistant for Phone Calls"
   - "Automatic Documentation Writing"
   
   FORMAT: "[Catchy name] - [Brief description of what it does]"
   - First part = product name (2-3 words, modern, memorable)
   - Second part = brief benefit (3-6 words)
   - Total length: maximum 50 characters
   - Sounds like a professional SaaS product, not a technical description
   
2. DESCRIPTION: MUST contain MINIMUM 3-4 sentences:
   - Sentence 1: What exactly this solution does and how it works
   - Sentence 2: How specifically it helps THIS COMPANY (mention their industry/services)
   - Sentence 3: What is the expected benefit (time savings, cost reduction, revenue increase)
   - Sentence 4: How quickly the solution can be deployed and what is needed
   
3. LANGUAGE: Write like a human, not a robot. Avoid jargon without explanation.
   BAD: "AI-powered NLP chatbot for customer support automation"
   GOOD: "Smart AI assistant that automatically answers customer questions. It understands natural language and can hold conversations like a live operator."

4. ROI EXPLANATION: In the description ALWAYS mention concrete benefit for this company in their context.

5. EXPECTED BENEFITS (expectedBenefits) - NEW REQUIRED FIELD!
   For EACH opportunity, generate 2-4 specific benefits. Choose RELEVANT benefit types based on the solution type:
   
   BENEFIT TYPES (choose relevant ones):
   - time_savings: Time savings (e.g., "10-15" h/week) - FOR ALL AUTOMATIONS
   - lead_generation: New leads (e.g., "20-40" leads/month) - FOR CHATBOTS, OUTREACH
   - conversion_rate: Conversion increase (e.g., "+15-25" %) - FOR PERSONALIZATION, AI SUPPORT
   - new_customers: New customers (e.g., "8-15" customers/month) - FOR SALES AUTOMATION
   - revenue_increase: Revenue increase (e.g., "15-30" % or "$20-50K" /year) - FOR REVENUE-ORIENTED
   - cost_reduction: Cost reduction (e.g., "$10-20K" /year) - FOR COST-ORIENTED
   - error_reduction: Error reduction (e.g., "60-80" %) - FOR AUTOMATION, QC
   - customer_satisfaction: Customer satisfaction (e.g., "+10-20" NPS points) - FOR SUPPORT, CX
   - response_time: Response time (e.g., "80-90" % faster) - FOR SUPPORT, AUTOMATION
   - availability: Availability (e.g., "24/7") - FOR CHATBOTS, ASSISTANTS
   
   RULES:
   - Each benefit MUST have a concrete numerical value (ranges are OK)
   - Benefits must be REALISTIC for the solution type and company size
   - ALWAYS include time_savings for automation solutions
   - For chatbots/assistants include lead_generation OR customer_satisfaction
   - For sales/marketing solutions include revenue_increase OR conversion_rate

User indicated pain point: ${biggestPainPoint || 'Not specified'}
User uses tools: ${currentTools || 'Not specified'}

### DETECTED TECHNOLOGIES (detectedTechnologies)
Based on search results, determine what technologies the company uses:
- CMS (WordPress, Wix, Squarespace)
- E-commerce platforms (Shopify, WooCommerce, PrestaShop)
- CRM systems (Salesforce, HubSpot, Pipedrive)
- ERP systems (SAP, NetSuite, Odoo)
- Custom applications or software
- Frameworks and programming languages (if IT company)
List 3-6 technologies with confidence level (high/medium/low).

### OWN APPLICATION (hasOwnApplication, ownApplicationDetails)
Determine if the company has their own mobile app, web app, or software product.
- If YES: set hasOwnApplication to true and describe what the app does
- If NO: set hasOwnApplication to false and ownApplicationDetails to null

### AI INTEGRATION OPPORTUNITIES (appIntegrationOpportunities)
VERY IMPORTANT! If the company has their own application:
- Suggest 2-4 specific ways they could integrate AI into their app
- E.g.: AI chatbot widget, voice interface, personalized recommendations, predictive features
- Each suggestion must be specific to their app/system

If the company does NOT have their own application:
- Suggest how they could create an AI module/app for their customers
- E.g.: customer portal with AI, booking system with AI assistant, B2B tool

### INDUSTRY BENCHMARK (industryBenchmark)
Provide statistics and trends for the industry:
- aiAdoptionRate: percentage of companies in the industry already using AI (estimate 15-60%)
- topUseCases: 3 most common AI use cases in this industry
- competitorInsights: what competitors or similar companies are doing with AI
- marketTrend: brief description of AI trend in this industry

### IMPLEMENTATION TIMELINE (implementationTimeline)
Create 4 implementation phases:
1. quick_start (1-2 weeks): Immediate steps without major investment
2. short_term (1-3 months): Quick wins with low effort
3. medium_term (3-6 months): Strategic projects
4. long_term (6-12 months): Transformational initiatives

### RISK ASSESSMENT (riskAssessment)
Identify 3-5 main risks associated with AI implementation:
- data_privacy: Risks related to data protection and GDPR
- employee_adoption: Risks related to employee AI adoption
- technical: Technical risks and complexity
- regulatory: Regulatory risks (EU AI Act)
- financial: Financial risks and ROI
For each risk, provide severity and mitigation strategy.

### RECOMMENDED TOOLS (recommendedTools)
Based on AI tools search results, recommend 5-8 specific tools suitable for this company.
EVERY TOOL MUST HAVE A URL LINK TO ITS WEBSITE!

### ROI ESTIMATE (roiEstimate)
Estimate total weekly time savings (sum of hours from all 10 opportunities).
Hourly rate by industry in ${isCzech ? 'CZK' : 'USD'}:
- IT/Software: ${isCzech ? '600-800 Kč/h' : '$60-80/h'}
- Marketing: ${isCzech ? '500-700 Kč/h' : '$50-70/h'}
- Manufacturing: ${isCzech ? '400-500 Kč/h' : '$40-50/h'}
- Other: ${isCzech ? '400-600 Kč/h' : '$40-60/h'}

Include 2-3 calculation assumptions.

### EXECUTIVE SUMMARY - BENEFITS SUMMARY (expectedBenefitsSummary)
Create AGGREGATE benefits for the ENTIRE report, displayed at the very BEGINNING as "Executive Summary":

1. **introText**: Introduction paragraph (2-3 sentences) in style:
   "On this page you will find a preliminary AI audit tailored for {companyName}. This report contains preliminary proposals for implementing artificial intelligence and automation for maximum efficiency and benefit for your company. Below is a summary of expected benefits from implementing the proposed solutions:"

2. **benefits**: Array of 4-6 AGGREGATE benefits (sum/aggregate values from all opportunities):
   - Total time savings (sum of all time_savings)
   - Expected new leads/customers (sum of relevant ones)
   - Total financial benefit (annual - combination of savings + new revenue)
   - Efficiency improvement/error reduction
   - Other relevant metrics based on industry
   
   Each benefit has: type, value (concrete numbers), unit, label, icon (emoji)

3. **disclaimer**: Text like:
   "* These estimates are based on average values from similar implementations in the industry. Actual results may vary depending on your company's specific conditions and implementation scope."`;

  return `${systemContext}

## COMPANY INFO
- Name: ${companyName}
- City: ${city}
- Industry: ${industry}
- Pain Point: ${biggestPainPoint || 'Not specified'}
- Current Tools: ${currentTools || 'Not specified'}
- Language: ${language}

## SEARCH RESULTS - COMPANY RESEARCH
${searchData}

## SEARCH RESULTS - AI TOOLS
${aiToolsData}

${instructions}

## REQUIRED JSON SCHEMA
${jsonSchema}

## IMPORTANT
- Output ONLY valid JSON, no markdown, no explanations
- All text content must be in ${isCzech ? 'Czech' : 'English'}
- Be specific with numbers and estimates
- Ensure all 10 aiOpportunities have different quadrants as specified (at least 4-5 quick_wins)
- EACH aiOpportunity MUST have expectedBenefits array with 2-4 concrete benefits
- The expectedBenefitsSummary MUST contain 4-6 aggregated benefits for the Executive Summary
- The JSON must be parseable by JSON.parse()

Output the JSON now:`;
}

/**
 * Parse LLM JSON response with robust extraction and validation
 * @deprecated - Now uses extractAndParseJson from json-parser-utils.ts
 * Kept for backwards compatibility but redirects to new implementation
 */
function parseLLMJsonResponse(content: string): any {
  const parsed = extractAndParseJson(content, 'LLM Audit Report');
  if (!parsed) {
    throw new Error('Failed to extract valid JSON from LLM response');
  }
  return parsed;
}

/**
 * Call OpenRouter API for structured JSON synthesis with retry and model fallback
 * v2.0 - Now with 100% failure-proof JSON parsing:
 * - Increased token limit (6000 -> 8000)
 * - Robust JSON extraction (multiple strategies)
 * - Schema validation (progressive strictness)
 * - Retry mechanism (sanitization + model fallback)
 * - Truncation detection
 */
async function synthesizeStructuredReport(
  prompt: string,
  openrouterApiKey: string,
  formData: AuditFormInputs
): Promise<{ success: boolean; data?: any; error?: string; usedFallbackModel?: boolean }> {
  console.log('[Agent] ========================================');
  console.log('[Agent] Synthesizing structured report with LLM');
  console.log(`[Agent] Prompt length: ${prompt.length} characters`);
  
  // Model configurations (primary + fallback)
  const modelConfigs = [
    {
      name: 'Primary',
      models: ['google/gemini-3-flash-preview', 'google/gemini-3-pro-preview', 'anthropic/claude-sonnet-4.5'],
      temperature: 0.3,
      maxRetries: 1
    },
    {
      name: 'Fallback (Claude)',
      models: ['anthropic/claude-sonnet-4.5', 'anthropic/claude-3.5-sonnet', 'google/gemini-3-flash-preview'],
      temperature: 0.2, // Lower temperature for more structured output
      maxRetries: 1
    }
  ];
  
  let lastError: Error | null = null;
  let usedFallbackModel = false;
  
  // Try each model configuration
  for (let configIndex = 0; configIndex < modelConfigs.length; configIndex++) {
    const config = modelConfigs[configIndex];
    console.log(`[Agent] ========================================`);
    console.log(`[Agent] Attempt ${configIndex + 1}/${modelConfigs.length}: ${config.name}`);
    
    for (let retry = 0; retry <= config.maxRetries; retry++) {
      if (retry > 0) {
        console.log(`[Agent] Retry ${retry}/${config.maxRetries} for ${config.name}`);
      }
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout (increased)
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openrouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': clientConfig.siteUrl,
            'X-Title': `${clientConfig.company.name} AI Deep Research Agent v3`
          },
          body: JSON.stringify({
            models: config.models,
            messages: [
              {
                role: 'system',
                content: 'You are an expert AI auditor. You MUST output ONLY valid JSON, no markdown, no explanations, no text before or after the JSON. The JSON must be directly parseable by JSON.parse(). Ensure the JSON is complete and not truncated.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 32000, // Increased to 32K to prevent any truncation
            temperature: config.temperature
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`[Agent] LLM API error (${config.name}):`, response.status, errorData);
          lastError = new Error(`LLM API error: ${response.status}`);
          continue; // Try next retry or config
        }
        
        const responseData = await response.json();
        
        if (!responseData.choices?.[0]?.message?.content) {
          console.error(`[Agent] Invalid LLM response structure (${config.name})`);
          lastError = new Error('Invalid LLM response structure');
          continue;
        }
        
        const content = responseData.choices[0].message.content;
        const actualModel = responseData.model;
        
        console.log(`[Agent] LLM response received from model: ${actualModel}`);
        console.log(`[Agent] Response length: ${content.length} characters`);
        console.log(`[Agent] Response preview: ${content.substring(0, 200)}...`);
        
        // Check for truncation
        if (isJsonTruncated(content)) {
          console.warn('[Agent] ⚠️ Response appears truncated (incomplete JSON structure)');
          console.warn('[Agent] This might cause parsing issues. Consider increasing max_tokens further.');
        }
        
        // STEP 1: Extract and parse JSON using robust extraction
        console.log('[Agent] STEP 1: Extracting and parsing JSON...');
        const parsedData = extractAndParseJson(content, `Agent ${config.name}`);
        
        if (!parsedData) {
          console.error(`[Agent] ✗ Failed to extract valid JSON (${config.name})`);
          logParseFailure(content, new Error('Extraction failed'), config.name);
          lastError = new Error('Failed to extract valid JSON from LLM response');
          continue; // Try next retry or config
        }
        
        console.log('[Agent] ✓ JSON extracted and parsed successfully');
        
        // STEP 2: Validate structure
        console.log('[Agent] STEP 2: Validating JSON structure...');
        const validation = validateAuditReportStructure(parsedData);
        
        if (!validation.isValid) {
          console.error(`[Agent] ✗ JSON validation failed (${config.name}):`, validation.errors);
          lastError = new Error(`Invalid JSON structure: ${validation.errors.join(', ')}`);
          
          // If we have minimal data, we might still be able to use it with defaults
          if (validation.hasMinimalData) {
            console.warn('[Agent] ⚠️ Data has minimal required fields, will fill defaults and continue');
            const filledData = fillAuditReportDefaults(parsedData, formData);
            console.log('[Agent] ✓ Defaults filled, using data despite validation issues');
            
            // Mark that we used fallback
            if (configIndex > 0) {
              usedFallbackModel = true;
            }
            
            console.log('[Agent] Parse metrics:', getParseMetrics());
            console.log('[Agent] ========================================');
            
            return {
              success: true,
              data: filledData,
              usedFallbackModel
            };
          }
          
          continue; // Try next retry or config
        }
        
        console.log('[Agent] ✓ JSON validation passed');
        
        // STEP 3: Fill defaults for optional fields
        console.log('[Agent] STEP 3: Filling defaults for optional fields...');
        const filledData = fillAuditReportDefaults(parsedData, formData);
        console.log('[Agent] ✓ Defaults filled successfully');
        
        // Mark that we used fallback model
        if (configIndex > 0) {
          usedFallbackModel = true;
          console.log('[Agent] ✓ Successfully used fallback model configuration');
        }
        
        console.log('[Agent] Parse metrics:', getParseMetrics());
        console.log('[Agent] ========================================');
        
        return {
          success: true,
          data: filledData,
          usedFallbackModel
        };
        
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.error(`[Agent] LLM request timed out (${config.name})`);
          lastError = new Error('LLM request timed out');
        } else {
          console.error(`[Agent] LLM synthesis error (${config.name}):`, error);
          lastError = error instanceof Error ? error : new Error('Unknown error');
        }
        // Continue to next retry or config
      }
    }
  }
  
  // All attempts failed
  console.error('[Agent] ========================================');
  console.error('[Agent] ✗ ALL SYNTHESIS ATTEMPTS FAILED');
  console.error('[Agent] Final error:', lastError?.message);
  console.error('[Agent] Parse metrics:', getParseMetrics());
  console.error('[Agent] ========================================');
  
  return {
    success: false,
    error: lastError?.message || 'Failed to synthesize report',
    usedFallbackModel: false
  };
}

// =============================================================================
// MAIN AGENT EXECUTION
// =============================================================================

/**
 * Generate fallback benefits summary if LLM doesn't provide one
 * NOW BUSINESS-TYPE AWARE - generates benefits based on detected industry
 */
function generateFallbackBenefitsSummary(
  opportunities: AIOpportunity[],
  roiEstimate: ROIEstimate | undefined,
  formData: AuditFormInputs,
  detectedIndustry?: string
): ExpectedBenefitsSummary {
  const isCzech = formData.language === 'cs';
  const companyName = formData.companyName;
  
  // Detect business type from industry
  const businessType = detectBusinessType(detectedIndustry || formData.industry);
  const metricsConfig = getBusinessTypeMetrics(businessType);
  
  console.log(`[Agent] Generating fallback benefits for business type: ${businessType}`);
  
  // Calculate totals from opportunities
  const totalHours = opportunities.reduce((sum, opp) => sum + (opp.estimatedSavingsHoursPerWeek || 0), 0);
  const hourlyRate = roiEstimate?.defaultHourlyRate || (isCzech ? 500 : 50);
  const yearlyTimeSavings = totalHours * 52 * hourlyRate;

  const benefits: OpportunityBenefit[] = [];
  
  // Generate benefits based on business type
  switch (businessType) {
    case 'community_membership':
      // Primary: Member-focused metrics
      benefits.push({
        type: 'member_acquisition',
        value: '15-35',
        unit: isCzech ? 'členů/měsíc' : 'members/month',
        label: isCzech ? 'Noví členové' : 'New Members',
        icon: '👥'
      });
      benefits.push({
        type: 'churn_reduction',
        value: '25-45',
        unit: '%',
        label: isCzech ? 'Snížení odchodu členů' : 'Reduced Member Churn',
        icon: '🔒'
      });
      benefits.push({
        type: 'member_engagement',
        value: '+35-55',
        unit: '%',
        label: isCzech ? 'Zapojení členů' : 'Member Engagement',
        icon: '🎯'
      });
      benefits.push({
        type: 'event_attendance',
        value: '+25-40',
        unit: '%',
        label: isCzech ? 'Účast na akcích' : 'Event Attendance',
        icon: '📅'
      });
      // Secondary: Time savings for admin
      if (totalHours > 0) {
        benefits.push({
          type: 'time_savings',
          value: `${Math.round(totalHours * 0.8)}-${totalHours}`,
          unit: isCzech ? 'h/týden' : 'h/week',
          label: isCzech ? 'Úspora času na správě' : 'Admin Time Saved',
          icon: '⏱️'
        });
      }
      break;
      
    case 'ecommerce':
      // Primary: Revenue-focused metrics
      const minRevenue = Math.round(yearlyTimeSavings * 1.5 / 1000) * 1000;
      const maxRevenue = Math.round(yearlyTimeSavings * 2.5 / 1000) * 1000;
      benefits.push({
        type: 'revenue_increase',
        value: `${(minRevenue / 1000).toFixed(0)}K-${(maxRevenue / 1000).toFixed(0)}K`,
        unit: isCzech ? 'Kč/rok' : '$/year',
        label: isCzech ? 'Nárůst tržeb' : 'Revenue Increase',
        icon: '💰'
      });
      benefits.push({
        type: 'conversion_rate',
        value: '+18-35',
        unit: '%',
        label: isCzech ? 'Více platících zákazníků' : 'More Paying Customers',
        icon: '📈'
      });
      benefits.push({
        type: 'new_customers',
        value: '25-60',
        unit: isCzech ? 'zákazníků/měsíc' : 'customers/month',
        label: isCzech ? 'Noví zákazníci' : 'New Customers',
        icon: '🎯'
      });
      benefits.push({
        type: 'cart_abandonment_reduction',
        value: '30-50',
        unit: '%',
        label: isCzech ? 'Méně opuštěných košíků' : 'Reduced Cart Abandonment',
        icon: '🛒'
      });
      break;
      
    case 'education':
      // Primary: Student-focused metrics
      benefits.push({
        type: 'student_acquisition',
        value: '20-45',
        unit: isCzech ? 'studentů/měsíc' : 'students/month',
        label: isCzech ? 'Noví studenti' : 'New Students',
        icon: '🎓'
      });
      benefits.push({
        type: 'course_completion',
        value: '+25-40',
        unit: '%',
        label: isCzech ? 'Dokončení kurzů' : 'Course Completion',
        icon: '✅'
      });
      benefits.push({
        type: 'customer_satisfaction',
        value: '+15-25',
        unit: isCzech ? 'bodů' : 'points',
        label: isCzech ? 'Spokojenost studentů' : 'Student Satisfaction',
        icon: '⭐'
      });
      benefits.push({
        type: 'time_savings',
        value: `${Math.round(totalHours * 0.8)}-${totalHours}`,
        unit: isCzech ? 'h/týden' : 'h/week',
        label: isCzech ? 'Úspora času na administrativě' : 'Admin Time Saved',
        icon: '⏱️'
      });
      break;
      
    case 'software_it':
      // Primary: Efficiency-focused metrics
      benefits.push({
        type: 'time_savings',
        value: `${Math.round(totalHours * 0.8)}-${totalHours}`,
        unit: isCzech ? 'h/týden' : 'h/week',
        label: isCzech ? 'Úspora času vývojářů' : 'Developer Time Saved',
        icon: '⏱️'
      });
      const minCost = Math.round(yearlyTimeSavings * 0.8 / 1000) * 1000;
      const maxCost = Math.round(yearlyTimeSavings * 1.3 / 1000) * 1000;
      benefits.push({
        type: 'cost_reduction',
        value: `${(minCost / 1000).toFixed(0)}K-${(maxCost / 1000).toFixed(0)}K`,
        unit: isCzech ? 'Kč/rok' : '$/year',
        label: isCzech ? 'Snížení nákladů' : 'Cost Reduction',
        icon: '💰'
      });
      benefits.push({
        type: 'error_reduction',
        value: '50-75',
        unit: '%',
        label: isCzech ? 'Méně chyb v kódu' : 'Fewer Code Errors',
        icon: '🐛'
      });
      benefits.push({
        type: 'response_time',
        value: '40-60',
        unit: '%',
        label: isCzech ? 'Rychlejší dodání' : 'Faster Delivery',
        icon: '🚀'
      });
      break;
      
    default:
      // Generic business - balanced metrics
      benefits.push({
        type: 'time_savings',
        value: `${Math.round(totalHours * 0.8)}-${totalHours}`,
        unit: isCzech ? 'h/týden' : 'h/week',
        label: isCzech ? 'Úspora času' : 'Time Savings',
        icon: '⏱️'
      });
      const minYearly = Math.round(yearlyTimeSavings * 0.7 / 1000) * 1000;
      const maxYearly = Math.round(yearlyTimeSavings * 1.2 / 1000) * 1000;
      benefits.push({
        type: 'revenue_increase',
        value: `${(minYearly / 1000).toFixed(0)}K-${(maxYearly / 1000).toFixed(0)}K`,
        unit: isCzech ? 'Kč/rok' : '$/year',
        label: isCzech ? 'Roční finanční přínos' : 'Annual Financial Benefit',
        icon: '💰'
      });
      benefits.push({
        type: 'new_customers',
        value: '15-40',
        unit: isCzech ? 'zákazníků/měsíc' : 'customers/month',
        label: isCzech ? 'Noví zákazníci' : 'New Customers',
        icon: '🎯'
      });
      benefits.push({
        type: 'error_reduction',
        value: '60-85',
        unit: '%',
        label: isCzech ? 'Méně chyb' : 'Fewer Errors',
        icon: '✅'
      });
      break;
  }
  
  // Get business-type-specific intro text
  const introText = isCzech 
    ? metricsConfig.valueProposition.cs.replace('{companyName}', companyName)
    : metricsConfig.valueProposition.en.replace('{companyName}', companyName);
  
  const fullIntroText = isCzech
    ? `Na této stránce naleznete předběžný AI audit vytvořený na míru pro ${companyName}. ${introText} Níže je shrnutí očekávaných přínosů po zavedení navrhovaných řešení:`
    : `On this page you will find a preliminary AI audit tailored for ${companyName}. ${introText} Below is a summary of expected benefits from implementing the proposed solutions:`;
  
  return {
    introText: fullIntroText,
    benefits: benefits.slice(0, 6), // Max 6 benefits
    disclaimer: isCzech
      ? '* Uvedené odhady vychází z průměrných hodnot podobných implementací v odvětví. Skutečné výsledky se mohou lišit dle specifických podmínek Vaší firmy a rozsahu implementace.'
      : '* These estimates are based on average values from similar implementations in the industry. Actual results may vary depending on your company\'s specific conditions and implementation scope.'
  };
}

/**
 * Generate unique report ID
 */
function generateReportId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Execute the Deep Research Agent
 * This is the main entry point called by audit.ts
 * Returns structured AuditReportData instead of markdown
 * 
 * v3: Added onProgress callback for real-time status updates
 */
export async function executeDeepResearch(
  formData: AuditFormInputs,
  tavilyApiKey: string,
  openrouterApiKey: string,
  onProgress?: ProgressCallback
): Promise<ResearchResult> {
  console.log(`[Agent] Starting Deep Research Agent v3 for: ${formData.companyName} (${formData.city})`);
  console.log(`[Agent] Language: ${formData.language}, Industry: ${formData.industry}`);
  
  const isCzech = formData.language === 'cs';
  
  try {
    // Step 1: Execute Tavily searches with progress tracking
    console.log('[Agent] STEP 1: Executing web research with progress tracking...');
    const searchResults = await executeSearchesWithProgress(tavilyApiKey, formData, onProgress);
    
    // Separate results by type
    const companyResults = searchResults.filter(r => r.type === 'generic' || r.type === 'domain-specific');
    const technologyResults = searchResults.filter(r => r.type === 'technology');
    const appResults = searchResults.filter(r => r.type === 'apps');
    const aiToolsResults = searchResults.filter(r => r.type === 'ai-tools');
    
    // Check if we have any successful searches
    const hasCompanyResults = companyResults.some(r => r.success && r.results.length > 0);
    const hasTechResults = technologyResults.some(r => r.success && r.results.length > 0);
    const hasAppResults = appResults.some(r => r.success && r.results.length > 0);
    const hasToolsResults = aiToolsResults.some(r => r.success && r.results.length > 0);
    
    if (!hasCompanyResults) {
      console.warn('[Agent] No company search results obtained, proceeding with limited data');
    }
    if (!hasTechResults) {
      console.warn('[Agent] No technology search results obtained');
    }
    if (!hasAppResults) {
      console.warn('[Agent] No app search results obtained');
    }
    if (!hasToolsResults) {
      console.warn('[Agent] No AI tools search results obtained');
    }
    
    // Step 2: Format search results for LLM
    console.log('[Agent] STEP 2: Formatting search data...');
    const companySearchData = formatSearchResultsForPrompt(companyResults);
    const technologySearchData = formatSearchResultsForPrompt(technologyResults);
    const appSearchData = formatSearchResultsForPrompt(appResults);
    const aiToolsSearchData = formatSearchResultsForPrompt(aiToolsResults);
    
    // Combine all search data with labels
    const allSearchData = `
## COMPANY INFORMATION
${companySearchData}

## TECHNOLOGY STACK RESEARCH
${technologySearchData}

## COMPANY APPS/SOFTWARE RESEARCH  
${appSearchData}
`;
    
    // Step 3: Generate structured research prompt
    console.log('[Agent] STEP 3: Generating structured research prompt...');
    const prompt = generateResearchPrompt(formData, allSearchData, aiToolsSearchData);
    
    // Step 4: Report LLM analysis progress
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS['llm_analyzing'];
      await onProgress('llm_analyzing', stepConfig.progress, isCzech ? stepConfig.messageCs : stepConfig.messageEn);
    }
    
    // Step 5: Synthesize structured report with LLM (with retry and model fallback)
    console.log('[Agent] STEP 4: Synthesizing structured report...');
    const synthesisResult = await synthesizeStructuredReport(prompt, openrouterApiKey, formData);
    
    if (!synthesisResult.success || !synthesisResult.data) {
      console.error('[Agent] Structured report synthesis failed:', synthesisResult.error);
      return {
        success: false,
        error: synthesisResult.error
      };
    }
    
    if (synthesisResult.usedFallbackModel) {
      console.log('[Agent] ⚠️ Report generated using fallback model (primary model failed)');
    }
    
    // Step 6: Report building progress
    if (onProgress) {
      const stepConfig = RESEARCH_STEPS['building_report'];
      await onProgress('building_report', stepConfig.progress, isCzech ? stepConfig.messageCs : stepConfig.messageEn);
    }
    
    // Step 7: Build final AuditReportData
    console.log('[Agent] STEP 5: Building final report data...');
    const reportId = generateReportId();
    const generatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    const reportData: AuditReportData = {
      reportId,
      companyProfile: {
        name: formData.companyName,
        website: formData.website,
        city: formData.city,
        industry: formData.industry,
        detectedIndustry: synthesisResult.data.companyProfile?.detectedIndustry || formData.industry,
        employeeEstimate: synthesisResult.data.companyProfile?.employeeEstimate,
        description: synthesisResult.data.companyProfile?.description
      },
      companyContext: synthesisResult.data.companyContext,
      // New v3 fields
      detectedTechnologies: synthesisResult.data.detectedTechnologies || [],
      hasOwnApplication: synthesisResult.data.hasOwnApplication || false,
      ownApplicationDetails: synthesisResult.data.ownApplicationDetails || null,
      appIntegrationOpportunities: synthesisResult.data.appIntegrationOpportunities || [],
      industryBenchmark: synthesisResult.data.industryBenchmark || null,
      implementationTimeline: synthesisResult.data.implementationTimeline || [],
      riskAssessment: synthesisResult.data.riskAssessment || [],
      // NEW v4: Executive Summary s přínosy (business-type aware)
      expectedBenefitsSummary: synthesisResult.data.expectedBenefitsSummary || generateFallbackBenefitsSummary(
        synthesisResult.data.aiOpportunities || [],
        synthesisResult.data.roiEstimate,
        formData,
        synthesisResult.data.companyProfile?.detectedIndustry
      ),
      // Existing fields
      auditQuestions: synthesisResult.data.auditQuestions || [],
      aiOpportunities: synthesisResult.data.aiOpportunities || [],
      recommendedTools: synthesisResult.data.recommendedTools || [],
      roiEstimate: synthesisResult.data.roiEstimate || {
        totalHoursSavedPerWeek: 20,
        defaultHourlyRate: formData.language === 'cs' ? 400 : 50,
        assumptions: []
      },
      generatedAt,
      expiresAt,
      language: formData.language
    };
    
    console.log(`[Agent] Deep Research Agent v3 completed successfully. Report ID: ${reportId}`);
    console.log(`[Agent] Questions: ${reportData.auditQuestions.length} categories`);
    console.log(`[Agent] Opportunities: ${reportData.aiOpportunities.length} items`);
    console.log(`[Agent] Tools: ${reportData.recommendedTools.length} recommendations`);
    console.log(`[Agent] Technologies: ${reportData.detectedTechnologies?.length || 0} detected`);
    console.log(`[Agent] Has own app: ${reportData.hasOwnApplication}`);
    console.log(`[Agent] App integrations: ${reportData.appIntegrationOpportunities?.length || 0} suggestions`);
    
    return {
      success: true,
      reportData
    };
    
  } catch (error) {
    console.error('[Agent] Critical error in Deep Research Agent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown agent error'
    };
  }
}

/**
 * Generate a fallback AuditReportData when agent fails
 */
export function generateAgentFallbackReport(formData: AuditFormInputs): AuditReportData {
  const isCzech = formData.language === 'cs';
  const reportId = `fallback-${Date.now().toString(36)}`;
  const generatedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const defaultQuestions: AuditQuestion[] = isCzech ? [
    {
      category: 'Role a tým',
      icon: '👥',
      questions: [
        'Jaké jsou hlavní odpovědnosti vašeho týmu?',
        'Kolik času týdně strávíte rutinními úkoly?',
        'Které činnosti by mohl někdo jiný dělat za vás?'
      ]
    },
    {
      category: 'Pracovní postupy',
      icon: '⚙️',
      questions: [
        'Které činnosti se ve vaší firmě opakují nejčastěji?',
        'Kde vidíte největší překážky v práci?',
        'Které úkoly spotřebují nejvíce času?'
      ]
    },
    {
      category: 'Nástroje a technologie',
      icon: '💻',
      questions: [
        'Jaké softwarové nástroje denně používáte?',
        'Co vás na stávajících nástrojích nejvíce frustruje?',
        'Probíhají důležité procesy mimo hlavní software (Excel, email)?'
      ]
    },
    {
      category: 'Bezpečnost a AI Act',
      icon: '🛡️',
      questions: [
        'Víte, jaká rizika pro vás plynou z nové regulace EU AI Act?',
        'Jak hlídáte, aby vaše firemní data neunikala do veřejných AI nástrojů?',
        'Máte jasná pravidla pro to, které AI nástroje smí zaměstnanci používat?'
      ]
    },
    {
      category: 'Kultura a vedení',
      icon: '🎯',
      questions: [
        'Jste připraveni vyžadovat používání AI i přes odpor některých lidí?',
        'Jak naložíte s úsporou času – investujete ji do růstu, nebo do zeštíhlení týmu?',
        'Máte plán, jak nahradit juniorské role výkonnějšími AI agenty?'
      ]
    }
  ] : [
    {
      category: 'Role & Team',
      icon: '👥',
      questions: [
        'What are your team\'s primary responsibilities?',
        'How much time per week do you spend on routine tasks?',
        'Which activities could someone else do for you?'
      ]
    },
    {
      category: 'Processes & Workflow',
      icon: '⚙️',
      questions: [
        'Which processes are most frequent in your company?',
        'Where do you see the biggest bottlenecks?',
        'Which tasks consume the most time?'
      ]
    },
    {
      category: 'Tools & Technology',
      icon: '💻',
      questions: [
        'What software tools do you use daily?',
        'What frustrates you most about current tools?',
        'Do important processes happen outside main software (Excel, email)?'
      ]
    },
    {
      category: 'Security & AI Act',
      icon: '🛡️',
      questions: [
        'Are you aware of the risks posed by the new EU AI Act regulation?',
        'How do you prevent corporate data leakage into public AI tools?',
        'Do you have clear rules on which AI tools employees are allowed to use?'
      ]
    },
    {
      category: 'Culture & Leadership',
      icon: '🎯',
      questions: [
        'Are you ready to mandate AI use despite resistance from some staff?',
        'How will you use time savings – invest in growth or downsize the team?',
        'Do you have a plan to replace junior roles with high-performance AI agents?'
      ]
    }
  ];

  const defaultOpportunities: AIOpportunity[] = isCzech ? [
    {
      title: 'AI Chatbot pro zákaznickou podporu (digitální recepční)',
      description: 'Chytrý AI asistent natrénovaný na vašich datech, který automaticky odpovídá na dotazy zákazníků 24/7 přes web i sociální sítě. Rozumí přirozenému českému jazyku a dokáže vést konverzaci jako živý operátor, včetně domlouvání schůzek. Pro vaši firmu to znamená okamžitou obsluhu zákazníků bez čekání a úsporu až 15 hodin týdně na rutinní komunikaci. Implementace je rychlá a nevyžaduje technické znalosti.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 15,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Automatický generátor obsahu a reklam',
      description: 'Pokročilý nástroj využívající generativní AI pro bleskovou tvorbu marketingových textů, příspěvků na sítě a reklamních sloganů ve vašem firemním stylu. Systém dokáže navrhnout kompletní kampaň během několika minut na základě krátkého zadání. Ušetříte minimálně 5-8 hodin týdně na copywritingu a tvorbě obsahu. Ideální pro udržení aktivní přítomnosti na sociálních sítích bez vysokých nákladů.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 7,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'AI asistent pro správu emailů',
      description: 'Inteligentní systém, který automaticky třídí příchozí emaily podle priority a tématu. Dokáže navrhnout nebo přímo odeslat odpovědi na rutinní zprávy. Pro vaši firmu to znamená konec přeplněných schránek a rychlejší reakce na důležité zprávy. Nasazení je možné jako rozšíření stávajícího emailového klienta.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 10,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Automatické přepisy a shrnutí schůzek',
      description: 'AI nahrává a automaticky přepisuje vaše online i osobní schůzky do textu. Následně vytvoří stručné shrnutí s hlavními body a úkoly. Pro váš tým to znamená konec ručního zapisování poznámek a jistotu, že se nic důležitého neztratí. Integrace s běžnými nástroji jako Teams, Zoom nebo Google Meet.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 6,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'AI asistent pro tvorbu obsahu',
      description: 'Generativní AI, která pomáhá s psaním marketingových textů, příspěvků na sociální sítě a emailových kampaní. Zachová váš firemní tón a styl komunikace. Pro vaši firmu to znamená rychlejší tvorbu kvalitního obsahu bez nutnosti najímat copywritera. Okamžitě použitelné přes webové rozhraní.',
      quadrant: 'nice_to_have',
      estimatedSavingsHoursPerWeek: 5,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Automatizace datového zpracování',
      description: 'AI pipeline pro automatické čištění, transformaci a validaci dat z různých zdrojů. Systém detekuje chyby a nekonzistence a navrhne nebo provede opravu. Pro vaši firmu to znamená spolehlivější data pro rozhodování a méně ruční práce s excelovými tabulkami. Vyžaduje počáteční konfiguraci dle vašich datových toků.',
      quadrant: 'nice_to_have',
      estimatedSavingsHoursPerWeek: 5,
      implementationEffort: 'medium',
      aiType: 'automation'
    },
    {
      title: 'Hlasový AI asistent pro telefonní hovory',
      description: 'Pokročilý hlasový AI agent, který přijímá a vyřizuje telefonní hovory. Mluví přirozeně česky a dokáže zodpovědět běžné dotazy, domluvit schůzky nebo přepojit na správnou osobu. Pro vaši firmu to znamená 24/7 dostupnost bez nutnosti rozšiřovat tým. Implementace trvá 4-6 týdnů včetně natrénování na vaše procesy.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 12,
      implementationEffort: 'medium',
      aiType: 'genai'
    },
    {
      title: 'Chytré předpovídání trendů a poptávky',
      description: 'AI nástroj pro předvídání trendů, poptávky zákazníků a obchodních výsledků. Systém analyzuje historická data a identifikuje vzorce pro přesnější plánování. Pro vaši firmu to znamená lepší rozhodování založené na datech místo intuice. Vyžaduje kvalitní historická data a počáteční nastavení.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 0,
      implementationEffort: 'high',
      aiType: 'ml'
    },
    {
      title: 'Automatické oslovování nových zákazníků',
      description: 'AI agent, který automaticky vyhledává potenciální zákazníky na webu a sociálních sítích podle vašich kritérií. Připraví personalizované oslovení pro každý kontakt a sleduje reakce. Pro vaši firmu to znamená systematické budování nových obchodních příležitostí bez manuální práce. Nasazení vyžaduje definici cílové skupiny a komunikační strategie.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 8,
      implementationEffort: 'medium',
      aiType: 'hybrid'
    },
    {
      title: 'Komplexní AI transformace procesů',
      description: 'Kompletní přestavba klíčových firemních procesů s využitím AI automatizace a prediktivních modelů. Zahrnuje audit stávajících procesů, návrh optimalizace a postupnou implementaci. Pro vaši firmu to představuje strategickou investici s vysokým dlouhodobým přínosem. Vyžaduje významné zdroje a management změny.',
      quadrant: 'deprioritize',
      estimatedSavingsHoursPerWeek: 0,
      implementationEffort: 'high',
      aiType: 'hybrid'
    }
  ] : [
    {
      title: 'AI Chatbot for Customer Support',
      description: 'Smart AI assistant that automatically answers customer questions 24/7. It understands natural language and can hold conversations like a live operator. For your company, this means instant answers to common questions without human staff. Deployment is possible within 2-3 weeks with minimal costs.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 15,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Automated Reporting and Dashboards',
      description: 'AI automatically generates regular reports and overviews from your data without manual work. The system analyzes key metrics and alerts you to important trends or anomalies. You will save hours of time each week and get a more up-to-date overview of company performance. Implementation only requires connection to existing data sources.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 8,
      implementationEffort: 'low',
      aiType: 'automation'
    },
    {
      title: 'AI Email Management Assistant',
      description: 'Intelligent system that automatically sorts incoming emails by priority and topic. It can suggest or directly send responses to routine messages. For your company, this means no more overflowing inboxes and faster responses to important messages. Deployment is possible as an extension to your existing email client.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 10,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Automatic Meeting Transcripts and Summaries',
      description: 'AI records and automatically transcribes your online and in-person meetings into text. It then creates a concise summary with key points and tasks. For your team, this means no more manual note-taking and certainty that nothing important is lost. Integration with common tools like Teams, Zoom or Google Meet.',
      quadrant: 'quick_win',
      estimatedSavingsHoursPerWeek: 6,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'AI Content Creation Assistant',
      description: 'Generative AI that helps with writing marketing copy, social media posts and email campaigns. It maintains your company tone and communication style. For your company, this means faster creation of quality content without hiring a copywriter. Immediately usable via web interface.',
      quadrant: 'nice_to_have',
      estimatedSavingsHoursPerWeek: 5,
      implementationEffort: 'low',
      aiType: 'genai'
    },
    {
      title: 'Data Processing Automation',
      description: 'AI pipeline for automatic cleaning, transformation and validation of data from various sources. The system detects errors and inconsistencies and suggests or performs corrections. For your company, this means more reliable data for decision-making and less manual work with spreadsheets. Requires initial configuration according to your data flows.',
      quadrant: 'nice_to_have',
      estimatedSavingsHoursPerWeek: 5,
      implementationEffort: 'medium',
      aiType: 'automation'
    },
    {
      title: 'Voice AI Assistant for Phone Calls',
      description: 'Advanced voice AI agent that receives and handles phone calls. It speaks naturally and can answer common questions, schedule meetings or transfer to the right person. For your company, this means 24/7 availability without expanding the team. Implementation takes 4-6 weeks including training on your processes.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 12,
      implementationEffort: 'medium',
      aiType: 'genai'
    },
    {
      title: 'Predictive Analytics and Forecasting',
      description: 'ML models for predicting trends, customer demand and business results. The system analyzes historical data and identifies patterns for more accurate planning. For your company, this means better data-driven decision-making instead of intuition. Requires quality historical data and initial model calibration.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 0,
      implementationEffort: 'high',
      aiType: 'ml'
    },
    {
      title: 'B2B Outreach Automation',
      description: 'AI agent that automatically searches for potential customers on the web and social networks according to your criteria. It personalizes outreach for each contact and tracks responses. For your company, this means systematic building of business opportunities without manual work. Deployment requires defining target audience and communication strategy.',
      quadrant: 'big_swing',
      estimatedSavingsHoursPerWeek: 8,
      implementationEffort: 'medium',
      aiType: 'hybrid'
    },
    {
      title: 'Comprehensive AI Process Transformation',
      description: 'Complete overhaul of key business processes using AI automation and predictive models. Includes audit of existing processes, optimization design and gradual implementation. For your company, this represents a strategic investment with high long-term benefits. Requires significant resources and change management.',
      quadrant: 'deprioritize',
      estimatedSavingsHoursPerWeek: 0,
      implementationEffort: 'high',
      aiType: 'hybrid'
    }
  ];

  const defaultTools: RecommendedTool[] = [
    { name: 'ChatGPT / Claude', category: 'General AI', useCase: isCzech ? 'Obecný AI asistent pro psaní, analýzu a brainstorming' : 'General AI assistant for writing, analysis and brainstorming', url: 'https://chat.openai.com' },
    { name: 'Zapier / Make', category: 'Automation', useCase: isCzech ? 'Automatizace pracovních postupů mezi aplikacemi' : 'Workflow automation between applications', url: 'https://zapier.com' },
    { name: 'Notion AI', category: 'Productivity', useCase: isCzech ? 'AI dokumentace a znalostní báze' : 'AI-powered documentation and knowledge base', url: 'https://notion.so' },
    { name: 'Fireflies.ai', category: 'Meeting AI', useCase: isCzech ? 'Automatické přepisy a shrnutí schůzek' : 'Automatic meeting transcripts and summaries', url: 'https://fireflies.ai' },
    { name: 'Grammarly', category: 'Writing', useCase: isCzech ? 'AI kontrola gramatiky a stylu' : 'AI grammar and style checking', url: 'https://grammarly.com' }
  ];

  // Generate ROI estimate
  const roiEstimate: ROIEstimate = {
    totalHoursSavedPerWeek: 75,
    defaultHourlyRate: isCzech ? 500 : 50,
    assumptions: isCzech 
      ? ['Odhad na základě typických úspor v podobných firmách', 'Skutečné úspory se mohou lišit dle implementace a počtu zaměstnanců', 'Počítáno pro kombinaci rychlých výher a strategických AI řešení']
      : ['Estimate based on typical savings in similar companies', 'Actual savings may vary based on implementation and employee count', 'Calculated for a combination of quick wins and strategic AI solutions']
  };

  // Generate fallback benefits summary using business-type-aware function
  const expectedBenefitsSummary = generateFallbackBenefitsSummary(
    defaultOpportunities,
    roiEstimate,
    formData,
    formData.industry // Pass industry for business type detection
  );

  // Generate company context
  const companyContext = isCzech
    ? `${formData.companyName} je firma působící v oblasti ${formData.industry || 'podnikání'} se sídlem v ${formData.city || 'České republice'}. Na základě dostupných informací jsme připravili předběžný přehled možností, jak by umělá inteligence mohla pomoci zefektivnit Vaše procesy. Pro přesnější analýzu doporučujeme osobní schůzku, kde probereme konkrétní potřeby Vaší firmy.`
    : `${formData.companyName} is a company operating in the ${formData.industry || 'business'} sector based in ${formData.city || 'the region'}. Based on available information, we have prepared a preliminary overview of how artificial intelligence could help streamline your processes. For a more accurate analysis, we recommend a personal meeting to discuss your company's specific needs.`;

  // Generate default implementation timeline
  const defaultTimeline: ImplementationTimelinePhase[] = isCzech ? [
    {
      phase: 'quick_start',
      title: 'Rychlý start',
      duration: '1-2 týdny',
      items: [
        'Úvodní konzultace a definice priorit',
        'Nasazení prvních AI nástrojů (ChatGPT, automatizace emailů)',
        'Zaškolení klíčových zaměstnanců'
      ]
    },
    {
      phase: 'short_term',
      title: 'Krátkodobě',
      duration: '1-3 měsíce',
      items: [
        'Implementace AI chatbota pro zákaznickou podporu',
        'Automatizace reportingu a přehledů',
        'Integrace s existujícími systémy'
      ]
    },
    {
      phase: 'medium_term',
      title: 'Střednědobě',
      duration: '3-6 měsíců',
      items: [
        'Nasazení hlasového AI asistenta',
        'Automatizace oslovování potenciálních zákazníků',
        'Rozšíření AI do dalších procesů'
      ]
    },
    {
      phase: 'long_term',
      title: 'Dlouhodobě',
      duration: '6-12 měsíců',
      items: [
        'Komplexní AI transformace klíčových procesů',
        'Prediktivní analytika a forecasting',
        'Kontinuální optimalizace a škálování'
      ]
    }
  ] : [
    {
      phase: 'quick_start',
      title: 'Quick Start',
      duration: '1-2 weeks',
      items: [
        'Initial consultation and priority definition',
        'Deployment of first AI tools (ChatGPT, email automation)',
        'Training of key employees'
      ]
    },
    {
      phase: 'short_term',
      title: 'Short Term',
      duration: '1-3 months',
      items: [
        'Implementation of AI chatbot for customer support',
        'Automation of reporting and dashboards',
        'Integration with existing systems'
      ]
    },
    {
      phase: 'medium_term',
      title: 'Medium Term',
      duration: '3-6 months',
      items: [
        'Deployment of voice AI assistant',
        'Automation of outreach to potential customers',
        'Expansion of AI into other processes'
      ]
    },
    {
      phase: 'long_term',
      title: 'Long Term',
      duration: '6-12 months',
      items: [
        'Comprehensive AI transformation of key processes',
        'Predictive analytics and forecasting',
        'Continuous optimization and scaling'
      ]
    }
  ];

  // Generate default risk assessment
  const defaultRisks: RiskAssessmentItem[] = isCzech ? [
    {
      category: 'data_privacy',
      title: 'Ochrana firemních dat',
      severity: 'medium',
      description: 'Při používání AI nástrojů je důležité zajistit, aby citlivá firemní data nebyla sdílena s externími poskytovateli.',
      mitigation: 'Používejte AI nástroje s garancí ochrany dat (např. HypeAgent) nebo on-premise řešení. Zaveďte jasná pravidla pro práci s citlivými daty.'
    },
    {
      category: 'employee_adoption',
      title: 'Přijetí zaměstnanci',
      severity: 'low',
      description: 'Někteří zaměstnanci mohou mít obavy z AI nebo odpor k novým technologiím.',
      mitigation: 'Komunikujte přínosy AI jako pomocníka, ne náhrady. Zajistěte dostatečné školení a podporu při zavádění.'
    },
    {
      category: 'technical',
      title: 'Technická integrace',
      severity: 'low',
      description: 'Integrace AI do stávajících systémů může vyžadovat technické úpravy.',
      mitigation: 'Začněte s hotovými řešeními nevyžadujícími hlubokou integraci. Postupně rozšiřujte dle potřeb.'
    }
  ] : [
    {
      category: 'data_privacy',
      title: 'Company Data Protection',
      severity: 'medium',
      description: 'When using AI tools, it is important to ensure that sensitive company data is not shared with external providers.',
      mitigation: 'Use AI tools with data protection guarantees or on-premise solutions. Establish clear rules for handling sensitive data.'
    },
    {
      category: 'employee_adoption',
      title: 'Employee Adoption',
      severity: 'low',
      description: 'Some employees may have concerns about AI or resistance to new technologies.',
      mitigation: 'Communicate the benefits of AI as an assistant, not a replacement. Ensure adequate training and support during implementation.'
    },
    {
      category: 'technical',
      title: 'Technical Integration',
      severity: 'low',
      description: 'Integrating AI into existing systems may require technical adjustments.',
      mitigation: 'Start with ready-made solutions that do not require deep integration. Gradually expand as needed.'
    }
  ];

  return {
    reportId,
    companyProfile: {
      name: formData.companyName,
      website: formData.website,
      city: formData.city,
      industry: formData.industry,
      detectedIndustry: formData.industry,
      description: isCzech 
        ? `${formData.companyName} - pro detailnější analýzu nás kontaktujte.` 
        : `${formData.companyName} - contact us for a more detailed analysis.`
    },
    // NEW: Company context for personalized intro
    companyContext,
    auditQuestions: defaultQuestions,
    aiOpportunities: defaultOpportunities,
    recommendedTools: defaultTools,
    roiEstimate,
    // NEW: Expected benefits summary for Executive Summary section
    expectedBenefitsSummary,
    // NEW: Implementation timeline
    implementationTimeline: defaultTimeline,
    // NEW: Risk assessment
    riskAssessment: defaultRisks,
    // Empty arrays for sections that need research data
    detectedTechnologies: [],
    appIntegrationOpportunities: [],
    hasOwnApplication: false,
    ownApplicationDetails: null,
    industryBenchmark: null,
    generatedAt,
    expiresAt,
    language: formData.language
  };
}
