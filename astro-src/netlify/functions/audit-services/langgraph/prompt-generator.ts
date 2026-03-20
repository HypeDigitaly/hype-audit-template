// =============================================================================
// PROMPT GENERATOR - LLM prompt construction for research synthesis
// =============================================================================

import type { AuditFormInputs } from './types';
import { clientConfig } from '../../_config/client';
import { getIndustrySpecificRecommendations } from './industry-recommendations';
import { getShowAndTellExamplesForPrompt } from './niche-examples';
import { detectMicroNiche, getCompetitorContextForPrompt } from './micro-niches';
import { getPainPointPromptInstructions } from './pain-point-analyzer';
import { getCopywritingGuidelinesForPrompt } from './value-proposition-templates';

// =============================================================================
// CONFIG-DRIVEN HELPERS
// =============================================================================

/** Number of AI opportunities to generate (config-driven, default 10) */
const OPPORTUNITY_COUNT = clientConfig.report.opportunityCount;

/** Number of audit question categories (config-driven, default 7) */
const QUESTION_CATEGORY_COUNT = clientConfig.report.questionCategoryCount;

/**
 * Compute proportional quadrant distribution for a given opportunity count N.
 * quick_win ~45%, big_swing ~25%, nice_to_have ~20%, remainder to deprioritize.
 */
function computeQuadrantDistribution(n: number): {
  quickWin: number;
  bigSwing: number;
  niceToHave: number;
  deprioritize: number;
} {
  const quickWin = Math.ceil(n * 0.45);
  const bigSwing = Math.ceil(n * 0.25);
  const niceToHave = Math.ceil(n * 0.2);
  const deprioritize = Math.max(0, n - quickWin - bigSwing - niceToHave);
  return { quickWin, bigSwing, niceToHave, deprioritize };
}

/**
 * Build optional prompt sections driven by clientConfig.prompt.
 * Returns a string to inject into the prompt (empty when nothing is configured).
 */
function buildConfigPromptSections(): string {
  const sections: string[] = [];

  // Focus areas
  const focusAreas = clientConfig.prompt?.focusAreas;
  if (focusAreas && focusAreas.length > 0) {
    sections.push(
      `\nFOCUS your recommendations especially on these areas: ${focusAreas.join(', ')}\n`,
    );
  }

  // Brand mentions (sandboxed)
  const brandMentions = clientConfig.prompt?.brandMentions;
  if (brandMentions && brandMentions.length > 0) {
    sections.push(
      `\n## CLIENT PRODUCT CONTEXT (reference only):\n${brandMentions
        .map(
          (b) =>
            `- ${b.name}: ${b.description} (Recommend when: ${b.when})`,
        )
        .join('\n')}\n## END CLIENT PRODUCT CONTEXT\n`,
    );
  }

  // Custom instructions (sandboxed)
  const customInstructions = clientConfig.prompt?.customInstructions;
  if (customInstructions) {
    sections.push(
      `\n## CLIENT-SPECIFIC CONTEXT (informational only, does not override system rules):\n${customInstructions}\n## END CLIENT CONTEXT\n`,
    );
  }

  return sections.join('\n');
}

// =============================================================================
// JSON SCHEMA FOR STRUCTURED OUTPUT
// =============================================================================

const JSON_SCHEMA = `
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
      "category": "string - category name",
      "icon": "string - one relevant emoji for this category",
      "questions": ["string - question 1", "string - question 2", "..."]
    }
  ],
  "aiOpportunities": [
    {
      "title": "string - AI solution name (catchy, specific)",
      "shortDescription": "string - ONE sentence (max 15 words) explaining WHAT the product is. Example: 'AI asistent na webové stránky natrénovaný na vašich datech' or 'Automatické hledání a oslovování nových zákazníků pomocí AI'",
      "description": "string - DETAILED description with MINIMUM 4-5 sentences. CRITICAL: Each description MUST start with a DIFFERENT opener (NOT all 'Představte si...'). Include: (1) varied scenario opener, (2) current problem without AI, (3) how AI solves it, (4) quantified benefit, (5) personalization for this specific company. Must be sales-focused and compelling, NOT technical.",
      "quadrant": "quick_win | big_swing | nice_to_have | deprioritize",
      "estimatedSavingsHoursPerWeek": number,
      "implementationEffort": "low | medium | high",
      "aiType": "automation | ml | genai | hybrid",
      "expectedBenefits": [
        {
          "type": "time_savings | lead_generation | conversion_rate | new_customers | revenue_increase | cost_reduction | error_reduction | customer_satisfaction | response_time | availability | churn_reduction | member_engagement",
          "value": "string - specific value (use ranges like '5-10')",
          "unit": "string - unit",
          "label": "string - benefit description",
          "icon": "string - one emoji"
        }
      ] // IMPORTANT: Include EXACTLY 2 benefits per opportunity - primary metric + secondary metric
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
    "introText": "string - COMPREHENSIVE 3-4 sentence paragraph summarizing ALL key benefits in words (not metrics). Must be personalized to the specific company, mention their industry, and summarize the main value propositions from the AI recommendations below. This is the ONLY benefits text shown - make it compelling and specific.",
    "benefits": [
      {
        "type": "...",
        "value": "string - summary value",
        "unit": "string - unit",
        "label": "string - benefit description",
        "icon": "string - one emoji"
      }
    ],
    "disclaimer": "string - disclaimer about estimates"
  }
}`;

// =============================================================================
// PROMPT GENERATION
// =============================================================================

/**
 * Generate the structured JSON research prompt
 */
export function generateResearchPrompt(
  formData: AuditFormInputs,
  searchData: string,
  aiToolsData: string
): string {
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
    - NIKDY nepiš "CRM" bez vysvětlení → piš "CRM (systém pro správu zákazníků)"
    - NIKDY nepiš "ERP" bez vysvětlení → piš "ERP (podnikový informační systém)"
    - NIKDY nepiš "API" bez vysvětlení → piš "napojení na jiné systémy"

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
    - NEVER write "CRM" without explanation → write "CRM (customer management system)"
    - NEVER write "ERP" without explanation → write "ERP (business management system)"
    - NEVER write "API" without explanation → write "connection to other systems"

    ### EMOJIS:
    Do not use EMOJIS in any text field EXCEPT the 'icon' field in 'auditQuestions', 'detectedTechnologies', and 'expectedBenefits'.

    Each tool should have a direct URL to its website if possible.`;

  // Get industry-specific recommendations
  const industryRecommendations = getIndustrySpecificRecommendations(language);

  // Detect micro-niche from industry for hyper-personalization (need to do this first)
  const detectedMicroNiche = detectMicroNiche(industry, searchData);

  // Get show-and-tell examples for better LLM understanding
  const showAndTellExamples = getShowAndTellExamplesForPrompt(
    detectedMicroNiche?.id || null,
    language
  );

  // Get competitor context based on detected micro-niche
  const competitorContext = getCompetitorContextForPrompt(detectedMicroNiche, language);

  // Get pain point specific instructions if provided
  const painPointInstructions = biggestPainPoint
    ? getPainPointPromptInstructions(biggestPainPoint, language)
    : '';

  // Get copywriting guidelines for sales-focused language
  const copywritingGuidelines = getCopywritingGuidelinesForPrompt(language);

  const instructions = isCzech
    ? generateCzechInstructions(companyName, city, biggestPainPoint, currentTools, industryRecommendations)
    : generateEnglishInstructions(companyName, city, biggestPainPoint, currentTools, industryRecommendations);

  // Build config-driven prompt sections (focusAreas, brandMentions, customInstructions)
  const configSections = buildConfigPromptSections();

  return `${systemContext}

## EXPECTED JSON OUTPUT STRUCTURE:
\`\`\`json
${JSON_SCHEMA}
\`\`\`

${copywritingGuidelines}

${showAndTellExamples}

${painPointInstructions}

${competitorContext}

${instructions}
${configSections}

## SEARCH RESULTS:
${searchData}

## AI TOOLS RESEARCH:
${aiToolsData}

RESPOND WITH ONLY VALID JSON. NO MARKDOWN, NO EXPLANATIONS, NO TEXT BEFORE OR AFTER THE JSON.`;
}

/**
 * Generate Czech instructions for the prompt
 */
function generateCzechInstructions(
  companyName: string,
  city: string,
  biggestPainPoint: string | undefined,
  currentTools: string | undefined,
  industryRecommendations: string
): string {
  return `## INSTRUKCE

Na základě informací o společnosti ${companyName} (${city}) a výsledků vyhledávání vytvoř strukturovaný JSON output.

### 🎯 PRIORITA #1: DATA Z FORMULÁŘE UŽIVATELE
Tyto informace jsou NEJDŮLEŽITĚJŠÍ a MUSÍ být centrálním bodem celého reportu:
- **Název firmy:** ${companyName}
- **Město:** ${city}
- **Pain point (bolest):** ${biggestPainPoint || 'Neuvedeno - odhadni z odvětví'}
- **Současné nástroje:** ${currentTools || 'Neuvedeno'}

Pokud uživatel uvedl PAIN POINT, MUSÍ být hlavním tématem minimálně 3-4 doporučení!

### DŮLEŽITÉ: DETEKUJ ODVĚTVÍ A TYP PODNIKÁNÍ
Analyzuj webové stránky a výsledky vyhledávání a PŘESNĚ urči, v jakém odvětví firma působí.

### PERSONALIZOVANÝ ÚVOD (companyContext)
Vytvoř 2-3 věty specifické pro ${companyName} na základě REÁLNÝCH faktů z vyhledávání.

### AUDITNÍ OTÁZKY (auditQuestions)
Vytvoř PŘESNĚ ${QUESTION_CATEGORY_COUNT} kategorií hloubkových otázek. Každá kategorie musí mít 3-5 konkrétních otázek.

### AI PŘÍLEŽITOSTI (aiOpportunities)
Vytvoř PŘESNĚ ${OPPORTUNITY_COUNT} konkrétních AI řešení s NEJVYŠŠÍM ROI pro tuto firmu.

### 📌 KRÁTKÝ POPIS PRODUKTU (shortDescription) - POVINNÉ!

Každé AI doporučení MUSÍ mít pole "shortDescription" - jednovětý popis (max 15 slov), který okamžitě vysvětlí, CO to za produkt je.

**FORMÁT:** "[Co to je] + [hlavní funkce/účel]"

**PŘÍKLADY:**
- "AI asistent na webové stránky natrénovaný na vašich datech"
- "Automatické hledání a oslovování nových zákazníků pomocí AI"
- "Chytrá kalkulačka úspor energie s personalizovanými doporučeními"
- "Systém pro automatické zpracování faktur a dokumentů"
- "AI nástroj pro vytváření obsahu na sociální sítě"
- "Automatizovaná péče o členy s personalizovanými e-maily"

**PRAVIDLA:**
- Max 15 slov, ideálně 8-12
- Začni tím, CO produkt JE (ne přínosem)
- Bez marketingových superlativů ("nejlepší", "revoluční")
- Srozumitelné pro laika - žádné technické termíny

### ⚠️ KRITICKÉ: VARIUJ ZAČÁTKY POPISŮ!

**NIKDY nezačínej VŠECHNY popisy slovem "Představte si..."!**

Střídej tyto otevírače (KAŽDÝ popis JINÝ začátek):
- "Každý den se opakuje stejný scénář:"
- "Váš tým pravděpodobně zná tento problém:"
- "Kolik času týdně strávíte [činností]?"
- "Co kdyby [činnost] probíhala automaticky?"
- "Jedna z nejčastějších překážek růstu je"
- "Znáte ten moment, kdy"
- "Většina firem ve vašem odvětví řeší"

### AI PŘÍLEŽITOSTI - DETAILNÍ POPISY

Každý popis AI řešení (aiOpportunities.description) MUSÍ obsahovat MINIMÁLNĚ 4-5 vět:

1. **Věta 1: VARIOVANÝ scénář** - [POUŽIJ RŮZNÉ OTEVÍRAČE - viz výše!]
2. **Věta 2: Současný problém** - "Dnes [jak to funguje bez AI]..."
3. **Věta 3: Řešení s AI** - "S [název řešení] [jak to bude fungovat]..."
4. **Věta 4: Konkrétní přínos** - "[Kvantifikovaný výsledek] bez [námahy/času/nákladů]..."
5. **Věta 5: Personalizace pro firmu** - "Pro ${companyName} to znamená [specifický benefit]..."

### 📊 POŽADAVEK: 2 METRIKY NA KAŽDÉ DOPORUČENÍ!

Každé AI doporučení MUSÍ mít v poli "expectedBenefits" PŘESNĚ 2 položky:
1. **Primární metrika** - hlavní přínos (např. "8-12 nových členů/měsíc")
2. **Sekundární metrika** - doplňkový přínos (např. "15-20% úspora času" nebo "5-10% vyšší spokojenost")

**PŘÍKLAD SPRÁVNÉHO POPISU:**

ŠPATNĚ (monotónní začátek + pouze 1 metrika):
"Představte si, že AI chatbot odpovídá na dotazy zákazníků 24/7 a šetří čas vašeho týmu."

SPRÁVNĚ (detailní, personalizované, prodejní):
"Představte si, že je pátek večer a potenciální člen vaší komunity má dotaz ohledně členství. Dnes by musel čekat do pondělí na odpověď - a mezitím možná najde jinou komunitu. S AI asistentem natrénovaným na vašich FAQ, pravidlech a výhodách členství dostane odpověď okamžitě, může se rovnou registrovat a vy v pondělí ráno najdete nového platícího člena. Pro ${companyName} to znamená, že žádná příležitost neunikne jen proto, že byl víkend nebo svátek."

**ZAKÁZANÉ VZORY:**
- Jednověté popisy
- Generické fráze bez konkrétních čísel nebo scénářů
- Popisy bez zmínky o specifické firmě nebo odvětví
- Technický žargon bez vysvětlení hodnoty pro zákazníka

POVINNĚ POUŽIJ DOPORUČENÍ Z NÁSLEDUJÍCÍ SEKCE DLE DETEKOVANÉHO ODVĚTVÍ:

${industryRecommendations}

PRAVIDLA PRO KVADRANTY (pro ${OPPORTUNITY_COUNT} položek):
- quick_win: Vysoký dopad, nízká náročnost - MINIMÁLNĚ ${computeQuadrantDistribution(OPPORTUNITY_COUNT).quickWin} položek musí být quick_win!
- big_swing: Vysoký dopad, vysoká náročnost - ${computeQuadrantDistribution(OPPORTUNITY_COUNT).bigSwing} položky
- nice_to_have: Nízký dopad, nízká náročnost - ${computeQuadrantDistribution(OPPORTUNITY_COUNT).niceToHave} položky
- deprioritize: Nízký dopad, vysoká náročnost - max ${computeQuadrantDistribution(OPPORTUNITY_COUNT).deprioritize} položka

Uživatel uvedl jako pain point: ${biggestPainPoint || 'Neuvedeno'}
Uživatel používá nástroje: ${currentTools || 'Neuvedeno'}

### DETEKOVANÉ TECHNOLOGIE (detectedTechnologies)
Na základě vyhledávání urči, jaké technologie firma používá. Uveď 3-6 technologií.

### DOPORUČENÉ NÁSTROJE (recommendedTools)
Na základě výsledků vyhledávání AI nástrojů doporuč 5-8 konkrétních nástrojů.
KAŽDÝ NÁSTROJ MUSÍ MÍT URL ODKAZ NA WEB!

### ROI ODHAD (roiEstimate)
Odhadni celkové týdenní úspory času.

### EXECUTIVE SUMMARY - SHRNUTÍ PŘÍNOSŮ (expectedBenefitsSummary)
Vytvoř SOUHRNNÉ přínosy pro CELÝ report.

**DŮLEŽITÉ: introText je JEDINÝ text, který zákazník vidí v úvodu reportu!**
Musí být:
- 3-4 věty shrnující VŠECHNY klíčové přínosy SLOVNĚ (ne čísla v kartách)
- Personalizovaný pro ${companyName} a jejich odvětví
- Zmínit konkrétní typy AI řešení, které doporučujeme
- Prodejní a přesvědčivý tón

**PŘÍKLAD:**
"Implementace AI v ${companyName} není o nahrazení lidského kontaktu, ale o jeho posílení. Odstraněním administrativní zátěže získáte více prostoru pro budování vztahů, zatímco chytré nástroje zajistí, že se členové budou cítit opečovávaní 24/7. Na základě naší analýzy vidíme příležitosti v automatizaci komunikace, získávání nových členů a zvýšení jejich zapojení."

### KRITICKÁ PRAVIDLA PRO METRIKY A ODHADY:

**ZÁKAZ NULOVÝCH HODNOT:**
- NIKDY negeneruj hodnotu 0, 0% nebo prázdnou hodnotu pro žádnou metriku
- Všechny přínosy a odhady MUSÍ být nenulové a realistické
- Pokud si nejsi jistý, použij konzervativní rozsah (např. "5-10" místo "0")

**KONZERVATIVNÍ ODHADY (KRITICKÉ!):**
Buď VELMI STŘÍZLIVÝ a KONZERVATIVNÍ ve všech odhadech - raději PODCENIT než PŘECENIT:
- Úspora času: max 3-8 hodin týdně na jedno řešení (NIKDY ne 15+)
- Noví zákazníci/členové: 5-15 měsíčně (NIKDY ne 30+)
- Procentuální zlepšení: 10-25% (NIKDY ne 40%+)
- Vždy uváděj ROZSAH hodnot (např. "5-12" ne konkrétní číslo)
- Klient bude příjemně překvapen, když výsledky překonají očekávání

**METRIKY DLE TYPU PODNIKÁNÍ:**
- Pro komunity/membership: použij "noví členové", "snížení odchodu členů", "zapojení členů" (NEPOUŽÍVEJ "více platících zákazníků"!)
- Pro e-commerce: nárůst tržeb, konverze, snížení opuštěných košíků
- Pro služby: noví zákazníci, spokojenost, rychlost reakce
- Pro B2B: nové obchodní příležitosti, konverze, úspora času

### MINIMÁLNÍ POČTY POLOŽEK:
- expectedBenefitsSummary.benefits: PŘESNĚ 4 klíčové přínosy (ne méně, ne více)
- riskAssessment: MINIMÁLNĚ 3-5 rizik s konkrétními mitigacemi
- implementationTimeline: PŘESNĚ 4 fáze, každá s 3-4 konkrétními kroky
- appIntegrationOpportunities: 2-4 příležitosti (pokud firma má vlastní aplikaci/systém)`;
}

/**
 * Generate English instructions for the prompt
 */
function generateEnglishInstructions(
  companyName: string,
  city: string,
  biggestPainPoint: string | undefined,
  currentTools: string | undefined,
  industryRecommendations: string
): string {
  return `## INSTRUCTIONS

Based on information about company ${companyName} (${city}) and search results, create a structured JSON output.

### 🎯 PRIORITY #1: USER FORM DATA
This information is MOST IMPORTANT and MUST be the central focus of the entire report:
- **Company name:** ${companyName}
- **City:** ${city}
- **Pain point:** ${biggestPainPoint || 'Not specified - infer from industry'}
- **Current tools:** ${currentTools || 'Not specified'}

If user provided a PAIN POINT, it MUST be the main theme of at least 3-4 recommendations!

### IMPORTANT: DETECT THE INDUSTRY
Analyze the website and search results to PRECISELY determine which industry the company operates in.

### PERSONALIZED INTRO (companyContext)
Create 2-3 sentences specific to ${companyName} based on REAL facts from search results.

### AUDIT QUESTIONS (auditQuestions)
Create EXACTLY ${QUESTION_CATEGORY_COUNT} categories of in-depth questions. Each category must have 3-5 specific questions.

### AI OPPORTUNITIES (aiOpportunities)
Create EXACTLY ${OPPORTUNITY_COUNT} specific AI solutions with the HIGHEST ROI for this company.

### 📌 SHORT PRODUCT DESCRIPTION (shortDescription) - REQUIRED!

Each AI recommendation MUST have a "shortDescription" field - a one-sentence description (max 15 words) that immediately explains WHAT the product is.

**FORMAT:** "[What it is] + [main function/purpose]"

**EXAMPLES:**
- "AI assistant for your website trained on your data"
- "Automated customer prospecting and outreach using AI"
- "Smart energy savings calculator with personalized recommendations"
- "System for automatic invoice and document processing"
- "AI tool for creating social media content"
- "Automated member care with personalized emails"

**RULES:**
- Max 15 words, ideally 8-12
- Start with WHAT the product IS (not the benefit)
- No marketing superlatives ("best", "revolutionary")
- Understandable for laypeople - no technical terms

### ⚠️ CRITICAL: VARY YOUR DESCRIPTION OPENERS!

**NEVER start ALL descriptions with "Imagine..."!**

Rotate these openers (EACH description DIFFERENT start):
- "Every day, the same pattern repeats:"
- "Your team probably knows this problem:"
- "How much time weekly do you spend on [activity]?"
- "What if [activity] happened automatically?"
- "One of the most common growth barriers is"
- "You know that moment when"
- "Most businesses in your industry deal with"

### AI OPPORTUNITIES - DETAILED DESCRIPTIONS

Each AI solution description (aiOpportunities.description) MUST contain MINIMUM 4-5 sentences:

1. **Sentence 1: VARIED scenario** - [USE DIFFERENT OPENERS - see above!]
2. **Sentence 2: Current problem** - "Today [how it works without AI]..."
3. **Sentence 3: AI solution** - "With [solution name] [how it will work]..."
4. **Sentence 4: Concrete benefit** - "[Quantified result] without [effort/time/cost]..."
5. **Sentence 5: Company personalization** - "For ${companyName} this means [specific benefit]..."

### 📊 REQUIREMENT: 2 METRICS PER RECOMMENDATION!

Each AI recommendation MUST have EXACTLY 2 items in "expectedBenefits":
1. **Primary metric** - main benefit (e.g., "8-12 new members/month")
2. **Secondary metric** - complementary benefit (e.g., "15-20% time saved" or "5-10% higher satisfaction")

**EXAMPLE OF CORRECT DESCRIPTION:**

WRONG (monotonous opener + only 1 metric):
"AI chatbot answers customer questions 24/7 and saves your team's time."

CORRECT (detailed, personalized, sales-focused):
"Imagine it's Friday evening and a potential community member has a question about membership. Today, they would have to wait until Monday for an answer - and in the meantime, they might find another community. With an AI assistant trained on your FAQs, rules, and membership benefits, they get an answer immediately, can register right away, and you find a new paying member on Monday morning. For ${companyName}, this means no opportunity slips away just because it was a weekend or holiday."

**FORBIDDEN PATTERNS:**
- Single-sentence descriptions
- Generic phrases without specific numbers or scenarios
- Descriptions without mention of the specific company or industry
- Technical jargon without explaining value to customer

USE RECOMMENDATIONS FROM THE FOLLOWING SECTION BASED ON DETECTED INDUSTRY:

${industryRecommendations}

RULES FOR QUADRANTS (for ${OPPORTUNITY_COUNT} items):
- quick_win: High impact, low effort - AT LEAST ${computeQuadrantDistribution(OPPORTUNITY_COUNT).quickWin} items must be quick_win!
- big_swing: High impact, high effort - ${computeQuadrantDistribution(OPPORTUNITY_COUNT).bigSwing} items
- nice_to_have: Low impact, low effort - ${computeQuadrantDistribution(OPPORTUNITY_COUNT).niceToHave} items
- deprioritize: Low impact, high effort - max ${computeQuadrantDistribution(OPPORTUNITY_COUNT).deprioritize} item

User mentioned as pain point: ${biggestPainPoint || 'Not specified'}
User uses tools: ${currentTools || 'Not specified'}

### DETECTED TECHNOLOGIES (detectedTechnologies)
Based on search results, determine what technologies the company uses. List 3-6 technologies.

### RECOMMENDED TOOLS (recommendedTools)
Based on AI tools search results, recommend 5-8 specific tools.
EACH TOOL MUST HAVE A URL LINK TO THE WEBSITE!

### ROI ESTIMATE (roiEstimate)
Estimate total weekly time savings.

### EXECUTIVE SUMMARY - BENEFITS SUMMARY (expectedBenefitsSummary)
Create SUMMARY benefits for the ENTIRE report.

**IMPORTANT: introText is the ONLY text the customer sees in the report introduction!**
It must be:
- 3-4 sentences summarizing ALL key benefits in WORDS (not numbers in cards)
- Personalized for ${companyName} and their industry
- Mention specific types of AI solutions we recommend
- Sales-focused and persuasive tone

**EXAMPLE:**
"Implementing AI at ${companyName} isn't about replacing human contact, but enhancing it. By removing administrative burden, you'll gain more space for building relationships, while smart tools ensure members feel cared for 24/7. Based on our analysis, we see opportunities in communication automation, acquiring new members, and increasing their engagement."

### CRITICAL RULES FOR METRICS AND ESTIMATES:

**NO ZERO VALUES:**
- NEVER generate a value of 0, 0%, or empty value for any metric
- All benefits and estimates MUST be non-zero and realistic
- If uncertain, use a conservative range (e.g., "5-10" instead of "0")

**CONSERVATIVE ESTIMATES (CRITICAL!):**
Be VERY CONSERVATIVE in all estimates - better to UNDERESTIMATE than OVERESTIMATE:
- Time savings: max 3-8 hours per week per solution (NEVER 15+)
- New customers/members: 5-15 per month (NEVER 30+)
- Percentage improvements: 10-25% (NEVER 40%+)
- Always provide RANGES (e.g., "5-12" not a single number)
- Client will be pleasantly surprised when results exceed expectations

**METRICS BY BUSINESS TYPE:**
- For communities/membership: use "new members", "reduced churn", "member engagement" (DO NOT use "more paying customers"!)
- For e-commerce: revenue growth, conversion, reduced cart abandonment
- For services: new customers, satisfaction, response time
- For B2B: new business opportunities, conversion, time savings

### MINIMUM ITEM COUNTS:
- expectedBenefitsSummary.benefits: EXACTLY 4 key benefits (no less, no more)
- riskAssessment: MINIMUM 3-5 risks with specific mitigations
- implementationTimeline: EXACTLY 4 phases, each with 3-4 specific steps
- appIntegrationOpportunities: 2-4 opportunities (if company has own app/system)`;
}
