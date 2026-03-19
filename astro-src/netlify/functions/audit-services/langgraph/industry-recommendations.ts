// =============================================================================
// INDUSTRY RECOMMENDATIONS - Industry-specific AI recommendations for prompts
// =============================================================================

/**
 * Get industry-specific AI recommendations for the LLM prompt
 * This is a large string template used in the research prompt
 */
export function getIndustrySpecificRecommendations(language: 'cs' | 'en'): string {
  if (language === 'cs') {
    return `
## DYNAMICKÁ STRATEGIE DOPORUČENÍ AI ŘEŠENÍ

### KRITICKÉ: ADAPTIVNÍ PŘÍSTUP K DOPORUČENÍM
Jako profesionální AI konzultant MUSÍŠ analyzovat konkrétní situaci firmy a DYNAMICKY vybrat nejvhodnější AI řešení. Níže jsou VZOROVÉ kategorie a příklady - použij je jako INSPIRACI, ne jako rigidní šablonu. Vždy přizpůsob doporučení specifickým potřebám a kontextu firmy.

### KLÍČOVÝ PRINCIP: HODNOTA PRO ZÁKAZNÍKA
Pro KAŽDÉ doporučení se ptej:
1. Jaký KONKRÉTNÍ problém to řeší pro tuto firmu?
2. Jaká je MĚŘITELNÁ hodnota (čas, peníze, zákazníci)?
3. Jak RYCHLE uvidí výsledky?

### PRAVIDLA PRO AI ASISTENTY (CHATBOTY/VOICEBOTY):
Kdykoliv doporučuješ AI asistenta, VŽDY zmiň:
- Natrénovaný na datech dané společnosti - odpovídá jako expert z jejich týmu
- Automatizuje 80% opakujících se dotazů nepřetržitě 24/7
- Může automaticky domlouvat schůzky, odesílat emaily, upozornění
- Napojený na jejich existující systémy (rezervace, CRM, kalendář)

---

## KATEGORIE ŘEŠENÍ DLE OBCHODNÍHO MODELU

### KATEGORIE A: FIRMY ZÁVISLÉ NA ZÍSKÁVÁNÍ NOVÝCH KLIENTŮ
**Platí pro:** Agentury, konzultanty, koučky, poradce, realitní makléře, freelancery, B2B služby, komunity, membership kluby, vzdělávací platformy, právníky, účetní, architekty, designéry, a JAKOUKOLIV firmu, jejíž růst závisí na pravidelném přísunu nových klientů/členů.

**VŽDY doporuč kombinaci OUTBOUND + INBOUND:**

1. **AI Outreach Automation (Outbound)**
   - AI automaticky vyhledává ideální potenciální zákazníky/členy na LinkedIn, Facebooku, databázích
   - Personalizované oslovení přizpůsobené profilu každého kontaktu
   - Automatické follow-upy a sledování odpovědí
   - Napojení na CRM pro kompletní přehled o prodejním procesu
   - **Typické přínosy:** 10-25 nových obchodních příležitostí/měsíc

2. **AI Inbound Lead Magnet Automation**
   - Automatická tvorba hodnotného obsahu (e-booky, checklisty, webináře, kalkulačky)
   - Inteligentní email sekvence pro nurturing kontaktů
   - AI kvalifikace zájemců - předává pouze ty nejlepší
   - Chatbot na webu sbírá kontakty a odpovídá 24/7
   - **Typické přínosy:** 10-20% nárůst kvalifikovaných zájemců

### KATEGORIE B: FIRMY SE ZÁKAZNICKÝM SERVISEM
**Platí pro:** E-shopy, služby s rezervacemi, SaaS, telekomunikace, utility, pojišťovny, banky, zdravotnictví, a JAKOUKOLIV firmu s vysokým objemem zákaznických dotazů.

**Klíčová řešení:**
1. **AI Zákaznický asistent (Chatbot + Voicebot)** - 24/7 podpora natrénovaná na datech firmy
2. **Automatizace rezervací a objednávek** - AI domlouvá termíny bez lidského zásahu
3. **Sentiment analýza a eskalace** - AI detekuje nespokojené zákazníky
4. **Proaktivní komunikace** - připomínky, notifikace, follow-upy

### KATEGORIE C: FIRMY PRACUJÍCÍ S DOKUMENTY A DATY
**Platí pro:** Právní kanceláře, účetní firmy, finanční služby, HR oddělení, compliance, výzkum, analýzy, a JAKOUKOLIV firmu zpracovávající velké množství dokumentů.

**Klíčová řešení:**
1. **HypeAgent - Firemní AI na vlastních datech** - interní ChatGPT bez úniku dat
2. **Automatická analýza dokumentů** - smlouvy, faktury, reporty
3. **AI extrakce a sumarizace** - klíčové informace z dlouhých textů
4. **Inteligentní vyhledávání** - okamžité odpovědi z firemní dokumentace

### KATEGORIE D: VÝROBNÍ A PROVOZNÍ FIRMY
**Platí pro:** Výroba, logistika, sklady, doprava, stavebnictví, zemědělství, energetika, a JAKÁKOLIV firma s fyzickými procesy a operacemi.

**Klíčová řešení:**
1. **Prediktivní údržba** - AI předvídá poruchy před jejich vznikem
2. **Vizuální kontrola kvality** - AI kamery detekují vady
3. **Optimalizace procesů** - AI plánování výroby, tras, skladů
4. **IoT integrace** - sběr a analýza dat ze senzorů

### KATEGORIE E: KREATIVNÍ A MARKETINGOVÉ FIRMY
**Platí pro:** Marketingové agentury, grafická studia, video produkce, copywriting, sociální média, PR, a JAKÁKOLIV firma tvořící obsah.

**Klíčová řešení:**
1. **AI generování obsahu** - texty, obrázky, videa, prezentace
2. **Automatická správa sociálních sítí** - plánování, publikace, odpovědi
3. **Personalizované video oslovení** - AI avatary pro škálovatelnou komunikaci
4. **A/B testování a optimalizace** - AI vyhodnocuje výkon kampaní

---

## SPECIÁLNÍ METRIKY DLE TYPU PODNIKÁNÍ

### Pro komunity/membership/kluby:
NEPOUŽÍVEJ "úsporu času" jako primární metriku! Použij:
- **member_acquisition** - Noví členové (PRIMÁRNÍ!)
- **churn_reduction** - Snížení odchodu členů
- **member_engagement** - Zapojení členů

### Pro e-commerce:
- **revenue_increase** - Nárůst tržeb
- **conversion_rate** - Více platících zákazníků
- **cart_abandonment_reduction** - Méně opuštěných košíků

### Pro služby:
- **new_customers** - Noví zákazníci
- **customer_satisfaction** - Spokojenost zákazníků
- **response_time** - Rychlost reakce

### Pro B2B:
- **lead_generation** - Nové obchodní příležitosti
- **conversion_rate** - Přeměna zájemců na klienty
- **time_savings** - Úspora času na administrativě

---

## KONZERVATIVNÍ ODHADY (KRITICKÉ!)

**Buď VELMI STŘÍZLIVÝ a KONZERVATIVNÍ ve všech odhadech - raději PODCENIT než PŘECENIT:**

### Pravidla pro číselné odhady:
- **Úspora času:** max 3-8 hodin týdně na jedno řešení (NIKDY ne 15+)
- **Noví zákazníci/členové:** 5-15 měsíčně (NIKDY ne 30+)
- **Procentuální zlepšení:** 10-25% (NIKDY ne 40%+)
- **Vždy uváděj ROZSAH** hodnot (např. "5-12" ne konkrétní číslo)

### ZÁKAZ NULOVÝCH HODNOT:
- NIKDY negeneruj hodnotu 0, 0% nebo prázdnou hodnotu
- Všechny přínosy MUSÍ být nenulové a realistické
- Pokud si nejsi jistý, použij konzervativní minimum (např. "3-5" místo "0")

### Proč konzervativní odhady:
- Klient bude PŘÍJEMNĚ PŘEKVAPEN, když výsledky překonají očekávání
- Nerealistické odhady vedou ke zklamání a ztrátě důvěry
- Lepší dodat více, než slíbit a nedodat

---

## UNIVERZÁLNÍ DOPORUČENÍ

**HypeAgent - Firemní AI asistent**
Doporuč pro KAŽDOU firmu s dokumentací, interními procesy, nebo potřebou bezpečného AI:
- Interní ChatGPT pracující POUZE s firemními daty
- Maximální bezpečnost - data nikdy neopustí firmu
- Prohledává dokumenty, smlouvy, emaily, procesy
- Generuje obsah, prezentace, reporty

---

## PŘÍKLADY SPECIFICKÝCH ODVĚTVÍ (JAKO INSPIRACE)

### Fitness/Wellness/Salony:
- AI rezervační asistent s napojením na kalendář
- Automatické připomínky termínů (SMS, voicebot)
- AI odpovědi na dotazy o službách a cenách 24/7

### IT/Software:
- AI code review a dokumentace
- SQL agent pro dotazování databáze v češtině
- Automatické generování testů

### Restaurace/Hospitality:
- AI příjem objednávek a rezervací
- Automatické odpovědi na recenze
- Analýza zpětné vazby zákazníků

### Vzdělávání:
- AI tutor pro studenty
- Automatická evaluace a zpětná vazba
- Personalizované studijní plány

### Realitní kanceláře:
- AI kvalifikace poptávek
- Automatické párování nemovitostí s klienty
- AI outreach na potenciální prodejce

---

## MICRO-NICHE SPECIFICKÉ PŘÍKLADY (PRO HLUBŠÍ PERSONALIZACI)

### Online komunity a membership kluby:
- **AI Onboarding Buddy:** Personalizovaný průvodce pro nové členy
- **Engagement Booster:** AI, která identifikuje neaktivní členy a zasílá personalizované zprávy
- **Content Recommender:** Doporučuje obsah na základě zájmů člena
- **Community Matchmaker:** Spojuje členy s podobnými zájmy
- **Typické metriky:** 5-15 nových členů/měsíc, 15-25% snížení odchodu

### Kavárny a malé restaurace:
- **AI Objednávkový asistent:** WhatsApp/Messenger bot pro objednávky
- **Věrnostní program s AI:** Personalizované nabídky na základě historie
- **Automatické odpovědi na recenze:** Google, TripAdvisor, Facebook
- **Predikce vytížení:** Optimalizace směn a zásob

### Autoservisy a pneuservisy:
- **AI Diagnostický asistent:** Předběžná diagnostika z popisu problému
- **Automatické připomínky:** STK, výměna pneumatik, servisní intervaly
- **Cenové kalkulačky:** AI odhadne cenu opravy před návštěvou
- **Zákaznická knowledge base:** Časté otázky o údržbě vozidel

### Veterinární ordinace:
- **AI Triáž asistent:** Posouzení urgentnosti případu před návštěvou
- **Připomínky vakcinací:** Automatické notifikace majitelům
- **Post-operační péče:** AI průvodce pro domácí péči
- **Dietní poradce:** Doporučení krmiva na základě zdravotního stavu

### Jazykové školy a tutoring:
- **AI Tutor pro opakování:** Personalizované cvičení mezi lekcemi
- **Automatické hodnocení esejí:** Gramatika, slovní zásoba, styl
- **Progress tracking:** AI reporty pro rodiče/studenty
- **Adaptivní obsah:** Úroveň se přizpůsobuje studentovi

### E-shopy s módou:
- **Virtuální stylista:** AI doporučuje outfity na základě preferencí
- **Size predictor:** Predikce správné velikosti z měření
- **Outfit completion:** "K tomuto ještě skvěle sedí..."
- **Trend spotter:** AI identifikuje trendy z dat o prodeji

### Pojišťovací makléři:
- **AI Pojistný poradce:** Analýza potřeb a doporučení produktů
- **Claim asistent:** Průvodce hlášením škody
- **Renewal reminder:** Automatické připomínky s analýzou
- **Konkurenční analýza:** Porovnání nabídek pro klienta

### Developeři nemovitostí:
- **AI Lead kvalifikace:** Scoring poptávek dle vážnosti záměru
- **Virtual tours chatbot:** Odpovídá na dotazy během prohlídky
- **Investment calculator:** AI kalkulačka návratnosti
- **Market intelligence:** Sledování konkurenčních projektů`;
  }

  return `
## DYNAMIC AI RECOMMENDATION STRATEGY

### CRITICAL: ADAPTIVE APPROACH TO RECOMMENDATIONS
As a professional AI consultant, you MUST analyze the specific company situation and DYNAMICALLY select the most suitable AI solutions. Below are SAMPLE categories and examples - use them as INSPIRATION, not as a rigid template. Always adapt recommendations to the specific needs and context of the company.

### KEY PRINCIPLE: CUSTOMER VALUE
For EVERY recommendation, ask:
1. What SPECIFIC problem does this solve for this company?
2. What is the MEASURABLE value (time, money, customers)?
3. How QUICKLY will they see results?

### RULES FOR AI ASSISTANTS (CHATBOTS/VOICEBOTS):
Whenever recommending an AI assistant, ALWAYS mention:
- Trained on the company's data - responds as an expert from their team
- Automates 80% of repetitive inquiries 24/7
- Can automatically schedule meetings, send emails, notifications
- Connected to their existing systems (booking, CRM, calendar)

---

## SOLUTION CATEGORIES BY BUSINESS MODEL

### CATEGORY A: BUSINESSES DEPENDENT ON ACQUIRING NEW CLIENTS
**Applies to:** Agencies, consultants, coaches, advisors, real estate agents, freelancers, B2B services, communities, membership clubs, educational platforms, lawyers, accountants, architects, designers, and ANY business whose growth depends on a regular influx of new clients/members.

**ALWAYS recommend a combination of OUTBOUND + INBOUND:**

1. **AI Outreach Automation (Outbound)**
   - AI automatically finds ideal potential customers/members on LinkedIn, Facebook, databases
   - Personalized outreach tailored to each contact's profile
   - Automatic follow-ups and response tracking
   - Connected to CRM for complete sales pipeline visibility
   - **Typical benefits:** 10-25 new business opportunities/month

2. **AI Inbound Lead Magnet Automation**
   - Automatic creation of valuable content (e-books, checklists, webinars, calculators)
   - Intelligent email sequences for contact nurturing
   - AI lead qualification - passes only the best ones
   - Website chatbot collects contacts and responds 24/7
   - **Typical benefits:** 10-20% increase in qualified leads

### CATEGORY B: BUSINESSES WITH CUSTOMER SERVICE
**Applies to:** E-commerce, services with bookings, SaaS, telecom, utilities, insurance, banking, healthcare, and ANY business with high volume of customer inquiries.

**Key solutions:**
1. **AI Customer Assistant (Chatbot + Voicebot)** - 24/7 support trained on company data
2. **Booking and Order Automation** - AI schedules appointments without human intervention
3. **Sentiment Analysis and Escalation** - AI detects dissatisfied customers
4. **Proactive Communication** - reminders, notifications, follow-ups

### CATEGORY C: BUSINESSES WORKING WITH DOCUMENTS AND DATA
**Applies to:** Law firms, accounting firms, financial services, HR departments, compliance, research, analysis, and ANY business processing large volumes of documents.

**Key solutions:**
1. **HypeAgent - Internal AI on Own Data** - internal ChatGPT without data leakage
2. **Automatic Document Analysis** - contracts, invoices, reports
3. **AI Extraction and Summarization** - key information from long texts
4. **Intelligent Search** - instant answers from company documentation

### CATEGORY D: MANUFACTURING AND OPERATIONAL BUSINESSES
**Applies to:** Manufacturing, logistics, warehouses, transportation, construction, agriculture, energy, and ANY business with physical processes and operations.

**Key solutions:**
1. **Predictive Maintenance** - AI predicts failures before they occur
2. **Visual Quality Control** - AI cameras detect defects
3. **Process Optimization** - AI planning for production, routes, warehouses
4. **IoT Integration** - collection and analysis of sensor data

### CATEGORY E: CREATIVE AND MARKETING BUSINESSES
**Applies to:** Marketing agencies, graphic studios, video production, copywriting, social media, PR, and ANY business creating content.

**Key solutions:**
1. **AI Content Generation** - text, images, videos, presentations
2. **Automatic Social Media Management** - scheduling, publishing, responses
3. **Personalized Video Outreach** - AI avatars for scalable communication
4. **A/B Testing and Optimization** - AI evaluates campaign performance

---

## SPECIAL METRICS BY BUSINESS TYPE

### For communities/membership/clubs:
DO NOT use "time savings" as primary metric! Use:
- **member_acquisition** - New members (PRIMARY!)
- **churn_reduction** - Reduced member churn
- **member_engagement** - Member engagement

### For e-commerce:
- **revenue_increase** - Revenue growth
- **conversion_rate** - More paying customers
- **cart_abandonment_reduction** - Fewer abandoned carts

### For services:
- **new_customers** - New customers
- **customer_satisfaction** - Customer satisfaction
- **response_time** - Response speed

### For B2B:
- **lead_generation** - New business opportunities
- **conversion_rate** - Converting prospects to clients
- **time_savings** - Time saved on administration

---

## CONSERVATIVE ESTIMATES (CRITICAL!)

**Be VERY CONSERVATIVE in all estimates - better to UNDERESTIMATE than OVERESTIMATE:**

### Rules for numerical estimates:
- **Time savings:** max 3-8 hours per week per solution (NEVER 15+)
- **New customers/members:** 5-15 per month (NEVER 30+)
- **Percentage improvements:** 10-25% (NEVER 40%+)
- **Always provide RANGES** (e.g., "5-12" not a single number)

### NO ZERO VALUES:
- NEVER generate a value of 0, 0%, or empty value
- All benefits MUST be non-zero and realistic
- If uncertain, use a conservative minimum (e.g., "3-5" instead of "0")

### Why conservative estimates:
- Client will be PLEASANTLY SURPRISED when results exceed expectations
- Unrealistic estimates lead to disappointment and loss of trust
- Better to over-deliver than to promise and under-deliver

---

## UNIVERSAL RECOMMENDATION

**HypeAgent - Internal AI Assistant**
Recommend for EVERY business with documentation, internal processes, or need for secure AI:
- Internal ChatGPT working ONLY with company data
- Maximum security - data never leaves the company
- Searches documents, contracts, emails, processes
- Generates content, presentations, reports

---

## INDUSTRY-SPECIFIC EXAMPLES (AS INSPIRATION)

### Fitness/Wellness/Salons:
- AI booking assistant connected to calendar
- Automatic appointment reminders (SMS, voicebot)
- AI responses to service and pricing inquiries 24/7

### IT/Software:
- AI code review and documentation
- SQL agent for querying databases in natural language
- Automatic test generation

### Restaurants/Hospitality:
- AI order and reservation handling
- Automatic review responses
- Customer feedback analysis

### Education:
- AI tutor for students
- Automatic evaluation and feedback
- Personalized study plans

### Real Estate:
- AI lead qualification
- Automatic property-client matching
- AI outreach to potential sellers

---

## MICRO-NICHE SPECIFIC EXAMPLES (FOR DEEPER PERSONALIZATION)

### Online communities and membership clubs:
- **AI Onboarding Buddy:** Personalized guide for new members
- **Engagement Booster:** AI that identifies inactive members and sends personalized messages
- **Content Recommender:** Recommends content based on member interests
- **Community Matchmaker:** Connects members with similar interests
- **Typical metrics:** 5-15 new members/month, 15-25% reduced churn

### Cafes and small restaurants:
- **AI Order Assistant:** WhatsApp/Messenger bot for orders
- **AI-powered Loyalty Program:** Personalized offers based on history
- **Automatic Review Responses:** Google, TripAdvisor, Facebook
- **Demand Prediction:** Shift and inventory optimization

### Auto repair and tire shops:
- **AI Diagnostic Assistant:** Preliminary diagnosis from problem description
- **Automatic Reminders:** Inspections, tire changes, service intervals
- **Price Calculators:** AI estimates repair cost before visit
- **Customer Knowledge Base:** FAQ about vehicle maintenance

### Veterinary clinics:
- **AI Triage Assistant:** Urgency assessment before visit
- **Vaccination Reminders:** Automatic notifications to owners
- **Post-operative Care:** AI guide for home care
- **Diet Advisor:** Food recommendations based on health status

### Language schools and tutoring:
- **AI Tutor for Review:** Personalized exercises between lessons
- **Automatic Essay Grading:** Grammar, vocabulary, style
- **Progress Tracking:** AI reports for parents/students
- **Adaptive Content:** Level adjusts to student

### Fashion e-commerce:
- **Virtual Stylist:** AI recommends outfits based on preferences
- **Size Predictor:** Predicts correct size from measurements
- **Outfit Completion:** "This also goes great with..."
- **Trend Spotter:** AI identifies trends from sales data

### Insurance brokers:
- **AI Insurance Advisor:** Needs analysis and product recommendations
- **Claim Assistant:** Guided claim reporting
- **Renewal Reminder:** Automatic reminders with analysis
- **Competitive Analysis:** Quote comparison for clients

### Real estate developers:
- **AI Lead Qualification:** Scoring inquiries by intent seriousness
- **Virtual Tours Chatbot:** Answers questions during tours
- **Investment Calculator:** AI ROI calculator
- **Market Intelligence:** Monitoring competing projects`;
}
