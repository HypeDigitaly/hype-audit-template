// =============================================================================
// MICRO-NICHES - Detailed niche definitions for hyper-personalized recommendations
// =============================================================================

import type { BusinessType, BenefitTypeKey } from '../glossary';

export interface MicroNiche {
  id: string;
  label: { cs: string; en: string };
  parentBusinessType: BusinessType;
  parentCategory: 'A' | 'B' | 'C' | 'D' | 'E';

  // Detection
  keywords: string[];

  // Specific content
  specificPainPoints: { cs: string; en: string }[];
  primarySolutions: {
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    primaryBenefit: BenefitTypeKey;
  }[];

  // Competitor context
  competitorContext: { cs: string; en: string };
}

// =============================================================================
// MICRO-NICHE DEFINITIONS (40+ niches)
// =============================================================================

export const MICRO_NICHES: MicroNiche[] = [
  // ==========================================================================
  // CATEGORY A: CLIENT ACQUISITION BUSINESSES (14 niches)
  // ==========================================================================
  {
    id: 'community_membership',
    label: { cs: 'Komunita / Membership klub', en: 'Community / Membership Club' },
    parentBusinessType: 'community_membership',
    parentCategory: 'A',
    keywords: ['komunita', 'community', 'klub', 'club', 'membership', 'členství', 'mastermind', 'network', 'growth club'],
    specificPainPoints: [
      { cs: 'Odpovídání na opakující se dotazy o členství', en: 'Answering repetitive membership questions' },
      { cs: 'Získávání nových členů a onboarding', en: 'Acquiring new members and onboarding' },
      { cs: 'Udržení zapojení členů a snížení odchodu', en: 'Maintaining member engagement and reducing churn' },
      { cs: 'Správa akcí a komunikace s členy', en: 'Managing events and member communication' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Asistent pro členy 24/7', en: '24/7 AI Member Assistant' },
        description: { cs: 'Chatbot natrénovaný na FAQ, pravidlech a výhodách členství', en: 'Chatbot trained on FAQ, rules, and membership benefits' },
        primaryBenefit: 'member_acquisition'
      },
      {
        title: { cs: 'Automatizace onboardingu nových členů', en: 'New Member Onboarding Automation' },
        description: { cs: 'Personalizované uvítací sekvence a průvodce komunitou', en: 'Personalized welcome sequences and community guide' },
        primaryBenefit: 'churn_reduction'
      }
    ],
    competitorContext: {
      cs: 'Konkurenční komunity jako YPO, EO a lokální mastermindy již využívají AI pro personalizaci členské zkušenosti a automatizaci administrativy.',
      en: 'Competing communities like YPO, EO, and local masterminds already use AI for personalizing member experience and automating administration.'
    }
  },
  {
    id: 'consulting_strategy',
    label: { cs: 'Strategické poradenství', en: 'Strategy Consulting' },
    parentBusinessType: 'consulting',
    parentCategory: 'A',
    keywords: ['strategie', 'strategy', 'poradenství', 'consulting', 'management consulting', 'business advisory'],
    specificPainPoints: [
      { cs: 'Časově náročná příprava analýz a prezentací', en: 'Time-consuming preparation of analyses and presentations' },
      { cs: 'Získávání nových klientů a budování pipeline', en: 'Acquiring new clients and building pipeline' },
      { cs: 'Zpracování velkého množství dat a dokumentů', en: 'Processing large amounts of data and documents' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Research Asistent', en: 'AI Research Assistant' },
        description: { cs: 'Automatizace rešerší, analýz konkurence a tržních trendů', en: 'Automating research, competitive analysis, and market trends' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Velké poradenské firmy jako McKinsey, BCG a Bain investují miliardy do AI nástrojů pro analýzu dat a generování insights.',
      en: 'Large consulting firms like McKinsey, BCG, and Bain invest billions in AI tools for data analysis and generating insights.'
    }
  },
  {
    id: 'coaching_executive',
    label: { cs: 'Executive koučink', en: 'Executive Coaching' },
    parentBusinessType: 'consulting',
    parentCategory: 'A',
    keywords: ['kouč', 'coach', 'koučink', 'coaching', 'executive', 'leadership', 'mentoring'],
    specificPainPoints: [
      { cs: 'Omezená kapacita - můžete mít jen tolik klientů', en: 'Limited capacity - you can only have so many clients' },
      { cs: 'Administrativa kolem plánování a follow-upů', en: 'Admin around scheduling and follow-ups' },
      { cs: 'Získávání nových VIP klientů', en: 'Acquiring new VIP clients' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Asistent pro klienty mezi sezeními', en: 'AI Assistant for Clients Between Sessions' },
        description: { cs: 'Chatbot poskytující podporu a připomínky mezi koučovacími sezeními', en: 'Chatbot providing support and reminders between coaching sessions' },
        primaryBenefit: 'customer_satisfaction'
      }
    ],
    competitorContext: {
      cs: 'Přední koučové a koučovací platformy jako BetterUp již integrují AI pro personalizaci koučovací cesty a škálování služeb.',
      en: 'Leading coaches and platforms like BetterUp already integrate AI for personalizing coaching journeys and scaling services.'
    }
  },
  {
    id: 'real_estate_residential',
    label: { cs: 'Rezidenční reality', en: 'Residential Real Estate' },
    parentBusinessType: 'real_estate',
    parentCategory: 'A',
    keywords: ['reality', 'real estate', 'realitní', 'makléř', 'agent', 'nemovitost', 'property', 'byt', 'dům'],
    specificPainPoints: [
      { cs: 'Kvalifikace poptávek - mnoho "turistů"', en: 'Lead qualification - many "tourists"' },
      { cs: 'Párování nemovitostí s klienty', en: 'Matching properties with clients' },
      { cs: 'Odpovídání na opakující se dotazy k inzerátům', en: 'Answering repetitive questions about listings' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Kvalifikace poptávek', en: 'AI Lead Qualification' },
        description: { cs: 'Automatické třídění zájemců podle vážnosti a připravenosti k nákupu', en: 'Automatic sorting of prospects by seriousness and purchase readiness' },
        primaryBenefit: 'lead_generation'
      }
    ],
    competitorContext: {
      cs: 'Velké realitní sítě jako RE/MAX a Century 21 implementují AI pro virtuální prohlídky a automatizaci komunikace s klienty.',
      en: 'Large real estate networks like RE/MAX and Century 21 implement AI for virtual tours and automating client communication.'
    }
  },
  {
    id: 'legal_corporate',
    label: { cs: 'Korporátní právo', en: 'Corporate Law' },
    parentBusinessType: 'finance',
    parentCategory: 'A',
    keywords: ['právní', 'legal', 'advokát', 'lawyer', 'kancelář', 'právo', 'law firm', 'korporátní', 'corporate'],
    specificPainPoints: [
      { cs: 'Časově náročná analýza smluv a due diligence', en: 'Time-consuming contract analysis and due diligence' },
      { cs: 'Vyhledávání v judikatuře a právních předpisech', en: 'Searching case law and regulations' },
      { cs: 'Příprava prvních návrhů dokumentů', en: 'Preparing first document drafts' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Právní asistent pro analýzu smluv', en: 'AI Legal Assistant for Contract Analysis' },
        description: { cs: 'Automatická identifikace rizikových klauzulí a chybějících náležitostí', en: 'Automatic identification of risk clauses and missing requirements' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Mezinárodní kanceláře jako DLA Piper a Clifford Chance masivně investují do legal tech a AI nástrojů pro efektivitu.',
      en: 'International firms like DLA Piper and Clifford Chance massively invest in legal tech and AI tools for efficiency.'
    }
  },
  {
    id: 'accounting_sme',
    label: { cs: 'Účetnictví pro SME', en: 'SME Accounting' },
    parentBusinessType: 'finance',
    parentCategory: 'A',
    keywords: ['účetnictví', 'accounting', 'účetní', 'accountant', 'daně', 'tax', 'mzdy', 'payroll'],
    specificPainPoints: [
      { cs: 'Zpracování velkého množství dokladů a faktur', en: 'Processing large volumes of receipts and invoices' },
      { cs: 'Stres v období uzávěrek a daňových přiznání', en: 'Stress during closing periods and tax filing' },
      { cs: 'Komunikace s klienty ohledně chybějících dokladů', en: 'Communicating with clients about missing documents' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Automatizace zpracování dokladů', en: 'AI Document Processing Automation' },
        description: { cs: 'OCR, automatické párování a zaúčtování faktur', en: 'OCR, automatic matching and booking of invoices' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Účetní software jako Pohoda, Money S3 a Flexibee integrují AI pro automatizaci a klienti to očekávají.',
      en: 'Accounting software like QuickBooks, Xero, and Sage integrate AI for automation and clients expect it.'
    }
  },

  // ==========================================================================
  // CATEGORY B: CUSTOMER SERVICE BUSINESSES (16 niches)
  // ==========================================================================
  {
    id: 'fitness_studio_boutique',
    label: { cs: 'Boutique fitness studio', en: 'Boutique Fitness Studio' },
    parentBusinessType: 'service_business',
    parentCategory: 'B',
    keywords: ['jóga', 'yoga', 'pilates', 'crossfit', 'spinning', 'boutique', 'studio', 'lekce'],
    specificPainPoints: [
      { cs: 'Správa čekací listiny na populární lekce', en: 'Managing waitlists for popular classes' },
      { cs: 'Personalizovaná doporučení pro členy', en: 'Personalized recommendations for members' },
      { cs: 'No-shows a zmeškané rezervace', en: 'No-shows and missed reservations' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Rezervační asistent', en: 'AI Booking Assistant' },
        description: { cs: 'Automatické rezervace, čekací listina a chytré připomínky', en: 'Automatic bookings, waitlist, and smart reminders' },
        primaryBenefit: 'new_customers'
      }
    ],
    competitorContext: {
      cs: 'Konkurenční studia jako F45 a Orangetheory používají AI pro personalizaci tréninků a automatické follow-upy.',
      en: 'Competing studios like F45 and Orangetheory use AI for workout personalization and automatic follow-ups.'
    }
  },
  {
    id: 'fitness_studio_large',
    label: { cs: 'Fitness centrum / Posilovna', en: 'Fitness Center / Gym' },
    parentBusinessType: 'service_business',
    parentCategory: 'B',
    keywords: ['fitness', 'posilovna', 'gym', 'centrum', 'wellness', 'zdraví'],
    specificPainPoints: [
      { cs: 'Vysoká fluktuace členů', en: 'High member churn' },
      { cs: 'Vytížení recepce dotazy o otevírací době a službách', en: 'Reception overloaded with questions about hours and services' },
      { cs: 'Prodej doplňkových služeb a produktů', en: 'Selling additional services and products' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Recepční 24/7', en: '24/7 AI Receptionist' },
        description: { cs: 'Odpovědi na dotazy, rezervace, informace o službách', en: 'Answering questions, bookings, service information' },
        primaryBenefit: 'new_customers'
      }
    ],
    competitorContext: {
      cs: 'Velké fitness řetězce jako Holmes Place a Pure Jatomi implementují AI chatboty a personalizované tréninkové plány.',
      en: 'Large fitness chains like LA Fitness and Planet Fitness implement AI chatbots and personalized training plans.'
    }
  },
  {
    id: 'beauty_salon_hair',
    label: { cs: 'Kadeřnictví', en: 'Hair Salon' },
    parentBusinessType: 'service_business',
    parentCategory: 'B',
    keywords: ['kadeřnictví', 'hair', 'salon', 'kadeřnice', 'stylist', 'střih', 'barvení'],
    specificPainPoints: [
      { cs: 'Zmeškané termíny a no-shows', en: 'Missed appointments and no-shows' },
      { cs: 'Rezervace přes telefon ruší práci', en: 'Phone bookings interrupt work' },
      { cs: 'Správa fotografií prací pro sociální sítě', en: 'Managing work photos for social media' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Rezervační systém s připomínkami', en: 'AI Booking System with Reminders' },
        description: { cs: 'Online rezervace, automatické SMS/WhatsApp připomínky', en: 'Online booking, automatic SMS/WhatsApp reminders' },
        primaryBenefit: 'new_customers'
      }
    ],
    competitorContext: {
      cs: 'Moderní salony využívají systémy jako Fresha a Booksy s AI připomínkami, které snižují no-shows o 30%.',
      en: 'Modern salons use systems like Fresha and Booksy with AI reminders that reduce no-shows by 30%.'
    }
  },
  {
    id: 'beauty_salon_nails',
    label: { cs: 'Nehtové studio', en: 'Nail Salon' },
    parentBusinessType: 'service_business',
    parentCategory: 'B',
    keywords: ['nehty', 'nails', 'manikúra', 'manicure', 'pedikúra', 'pedicure', 'nehtové'],
    specificPainPoints: [
      { cs: 'Klientky zapomínají na termíny', en: 'Clients forget appointments' },
      { cs: 'Inspirace a ukázky vzorů pro klientky', en: 'Inspiration and pattern samples for clients' },
      { cs: 'Správa fotografií prací pro Instagram', en: 'Managing work photos for Instagram' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Katalog vzorů s doporučeními', en: 'AI Pattern Catalog with Recommendations' },
        description: { cs: 'Personalizované návrhy vzorů na základě preferencí klientky', en: 'Personalized pattern suggestions based on client preferences' },
        primaryBenefit: 'customer_satisfaction'
      }
    ],
    competitorContext: {
      cs: 'Top nehtová studia používají AI pro generování návrhů vzorů a automatizaci Instagram obsahu.',
      en: 'Top nail studios use AI for generating pattern designs and automating Instagram content.'
    }
  },
  {
    id: 'healthcare_dental',
    label: { cs: 'Zubní ordinace', en: 'Dental Practice' },
    parentBusinessType: 'healthcare',
    parentCategory: 'B',
    keywords: ['zubní', 'dental', 'zubař', 'dentist', 'ordinace', 'stomatolog', 'zuby'],
    specificPainPoints: [
      { cs: 'Pacienti odkládají preventivní prohlídky', en: 'Patients postpone preventive checkups' },
      { cs: 'Administrativa kolem pojišťoven', en: 'Insurance paperwork' },
      { cs: 'Strach pacientů ze zákroků', en: 'Patient fear of procedures' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Připomínky preventivních prohlídek', en: 'AI Preventive Checkup Reminders' },
        description: { cs: 'Chytré připomínky s personalizovanými zprávami', en: 'Smart reminders with personalized messages' },
        primaryBenefit: 'new_customers'
      }
    ],
    competitorContext: {
      cs: 'Moderní zubní praxe používají AI pro analýzu RTG snímků a automatizaci komunikace s pacienty.',
      en: 'Modern dental practices use AI for X-ray analysis and automating patient communication.'
    }
  },
  {
    id: 'ecommerce_fashion',
    label: { cs: 'Módní e-shop', en: 'Fashion E-commerce' },
    parentBusinessType: 'ecommerce',
    parentCategory: 'B',
    keywords: ['móda', 'fashion', 'oblečení', 'clothes', 'e-shop', 'eshop', 'boutique', 'oděvy'],
    specificPainPoints: [
      { cs: 'Vysoký počet vrácených objednávek kvůli velikosti', en: 'High return rate due to sizing' },
      { cs: 'Personalizace doporučení produktů', en: 'Personalizing product recommendations' },
      { cs: 'Opuštěné košíky', en: 'Abandoned carts' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Stylista a poradce velikostí', en: 'AI Stylist and Size Advisor' },
        description: { cs: 'Personalizovaná doporučení outfitů a predikce správné velikosti', en: 'Personalized outfit recommendations and correct size prediction' },
        primaryBenefit: 'conversion_rate'
      }
    ],
    competitorContext: {
      cs: 'Velké módní e-shopy jako ZOOT, About You a Zalando masivně investují do AI personalizace a virtuálních zkušeben.',
      en: 'Large fashion e-shops like ASOS, About You, and Zalando massively invest in AI personalization and virtual fitting rooms.'
    }
  },
  {
    id: 'ecommerce_electronics',
    label: { cs: 'E-shop s elektronikou', en: 'Electronics E-commerce' },
    parentBusinessType: 'ecommerce',
    parentCategory: 'B',
    keywords: ['elektronika', 'electronics', 'technika', 'gadgets', 'počítače', 'computers', 'mobily'],
    specificPainPoints: [
      { cs: 'Zákazníci potřebují poradit s výběrem', en: 'Customers need help choosing' },
      { cs: 'Technické dotazy mimo pracovní dobu', en: 'Technical questions outside business hours' },
      { cs: 'Porovnávání produktů a parametrů', en: 'Comparing products and specifications' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Produktový poradce', en: 'AI Product Advisor' },
        description: { cs: 'Chatbot pomáhající s výběrem na základě potřeb zákazníka', en: 'Chatbot helping with selection based on customer needs' },
        primaryBenefit: 'conversion_rate'
      }
    ],
    competitorContext: {
      cs: 'E-shopy jako Alza a CZC.cz implementují AI chatboty a personalizované doporučení pro zvýšení konverze.',
      en: 'E-shops like Best Buy and Newegg implement AI chatbots and personalized recommendations to increase conversion.'
    }
  },
  {
    id: 'hospitality_restaurant',
    label: { cs: 'Restaurace', en: 'Restaurant' },
    parentBusinessType: 'hospitality',
    parentCategory: 'B',
    keywords: ['restaurace', 'restaurant', 'jídlo', 'food', 'gastronomie', 'gastro', 'kuchyně'],
    specificPainPoints: [
      { cs: 'Rezervace a no-shows', en: 'Reservations and no-shows' },
      { cs: 'Odpovědi na recenze', en: 'Responding to reviews' },
      { cs: 'Správa online objednávek', en: 'Managing online orders' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Rezervační a objednávkový systém', en: 'AI Reservation and Order System' },
        description: { cs: 'Automatické rezervace, objednávky a chytré odpovědi na recenze', en: 'Automatic reservations, orders, and smart review responses' },
        primaryBenefit: 'new_customers'
      }
    ],
    competitorContext: {
      cs: 'Úspěšné restaurace využívají AI pro správu recenzí, personalizované nabídky a optimalizaci menu.',
      en: 'Successful restaurants use AI for review management, personalized offers, and menu optimization.'
    }
  },
  {
    id: 'hospitality_hotel',
    label: { cs: 'Hotel / Penzion', en: 'Hotel / B&B' },
    parentBusinessType: 'hospitality',
    parentCategory: 'B',
    keywords: ['hotel', 'penzion', 'ubytování', 'accommodation', 'hostel', 'apartmán'],
    specificPainPoints: [
      { cs: 'Dotazy hostů před i během pobytu', en: 'Guest questions before and during stay' },
      { cs: 'Personalizace pobytu pro VIP hosty', en: 'Personalizing stay for VIP guests' },
      { cs: 'Upselling doplňkových služeb', en: 'Upselling additional services' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Concierge pro hosty', en: 'AI Guest Concierge' },
        description: { cs: 'Virtuální asistent odpovídající na dotazy a doporučující služby', en: 'Virtual assistant answering questions and recommending services' },
        primaryBenefit: 'customer_satisfaction'
      }
    ],
    competitorContext: {
      cs: 'Hotelové řetězce jako Marriott a Hilton implementují AI concierge a personalizaci pobytu.',
      en: 'Hotel chains like Marriott and Hilton implement AI concierge and stay personalization.'
    }
  },

  // ==========================================================================
  // CATEGORY C: DOCUMENT/DATA BUSINESSES (4 niches)
  // ==========================================================================
  {
    id: 'hr_agency',
    label: { cs: 'Personální agentura', en: 'Recruitment Agency' },
    parentBusinessType: 'consulting',
    parentCategory: 'C',
    keywords: ['personální', 'recruitment', 'hr', 'nábor', 'hiring', 'headhunting', 'talent'],
    specificPainPoints: [
      { cs: 'Screening velkého množství životopisů', en: 'Screening large volumes of CVs' },
      { cs: 'Párování kandidátů s pozicemi', en: 'Matching candidates with positions' },
      { cs: 'Komunikace s kandidáty v procesu', en: 'Communicating with candidates in process' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Screening kandidátů', en: 'AI Candidate Screening' },
        description: { cs: 'Automatické hodnocení a třídění životopisů', en: 'Automatic evaluation and sorting of CVs' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Velké agentury jako Hays a ManpowerGroup masivně investují do AI pro matching kandidátů.',
      en: 'Large agencies like Hays and ManpowerGroup massively invest in AI for candidate matching.'
    }
  },
  {
    id: 'insurance_agency',
    label: { cs: 'Pojišťovací makléř', en: 'Insurance Broker' },
    parentBusinessType: 'finance',
    parentCategory: 'C',
    keywords: ['pojištění', 'insurance', 'makléř', 'broker', 'pojistka', 'policy'],
    specificPainPoints: [
      { cs: 'Porovnávání nabídek od různých pojišťoven', en: 'Comparing offers from different insurers' },
      { cs: 'Administrativa kolem smluv a hlášení škod', en: 'Admin around contracts and claims' },
      { cs: 'Udržování kontaktu s klienty', en: 'Maintaining contact with clients' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Porovnávač pojištění', en: 'AI Insurance Comparator' },
        description: { cs: 'Automatické porovnání nabídek a doporučení nejlepší varianty', en: 'Automatic comparison of offers and best option recommendation' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Online srovnávače jako Ušetřeno.cz a velcí makléři používají AI pro personalizaci nabídek.',
      en: 'Online comparators like Compare the Market and large brokers use AI for offer personalization.'
    }
  },

  // ==========================================================================
  // CATEGORY D: MANUFACTURING/OPERATIONS (4 niches)
  // ==========================================================================
  {
    id: 'manufacturing_precision',
    label: { cs: 'Přesné strojírenství', en: 'Precision Engineering' },
    parentBusinessType: 'manufacturing',
    parentCategory: 'D',
    keywords: ['cnc', 'strojírna', 'obrábění', 'machining', 'výroba', 'manufacturing', 'kovoobrábění'],
    specificPainPoints: [
      { cs: 'Neplánované prostoje strojů', en: 'Unplanned machine downtime' },
      { cs: 'Kontrola kvality a zmetkovitost', en: 'Quality control and defect rate' },
      { cs: 'Optimalizace výrobního plánu', en: 'Production plan optimization' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Prediktivní údržba', en: 'AI Predictive Maintenance' },
        description: { cs: 'Monitoring strojů a predikce poruch před jejich vznikem', en: 'Machine monitoring and failure prediction before they occur' },
        primaryBenefit: 'cost_reduction'
      }
    ],
    competitorContext: {
      cs: 'Špičkové strojírny implementují Industry 4.0 řešení s AI pro optimalizaci výroby.',
      en: 'Top-tier engineering companies implement Industry 4.0 solutions with AI for production optimization.'
    }
  },
  {
    id: 'logistics_local',
    label: { cs: 'Lokální logistika / Doručování', en: 'Local Logistics / Delivery' },
    parentBusinessType: 'logistics',
    parentCategory: 'D',
    keywords: ['logistika', 'logistics', 'doručování', 'delivery', 'doprava', 'transport', 'kurýr'],
    specificPainPoints: [
      { cs: 'Optimalizace tras a časů doručení', en: 'Route and delivery time optimization' },
      { cs: 'Komunikace se zákazníky o doručení', en: 'Customer communication about delivery' },
      { cs: 'Plánování kapacit a řidičů', en: 'Capacity and driver planning' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Optimalizace tras', en: 'AI Route Optimization' },
        description: { cs: 'Chytré plánování tras s ohledem na provoz a časová okna', en: 'Smart route planning considering traffic and time windows' },
        primaryBenefit: 'cost_reduction'
      }
    ],
    competitorContext: {
      cs: 'Doručovací služby jako DPD, PPL a lokální kurýři implementují AI pro optimalizaci tras a predikci doručení.',
      en: 'Delivery services like UPS, FedEx, and local couriers implement AI for route optimization and delivery prediction.'
    }
  },

  // ==========================================================================
  // CATEGORY E: CREATIVE/MARKETING (6 niches)
  // ==========================================================================
  {
    id: 'agency_digital',
    label: { cs: 'Digitální marketingová agentura', en: 'Digital Marketing Agency' },
    parentBusinessType: 'marketing_agency',
    parentCategory: 'E',
    keywords: ['marketing', 'agentura', 'agency', 'digital', 'ppc', 'seo', 'sociální sítě'],
    specificPainPoints: [
      { cs: 'Tvorba obsahu a kreativ ve velkém', en: 'Creating content and creatives at scale' },
      { cs: 'Reportování klientům zabírá hodiny', en: 'Client reporting takes hours' },
      { cs: 'Analýza dat a insights', en: 'Data analysis and insights' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Copywriting a kreativa', en: 'AI Copywriting and Creative' },
        description: { cs: 'Generování textů, reklam a vizuálů pro kampaně', en: 'Generating copy, ads, and visuals for campaigns' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Přední agentury jako WMC Grey a Ogilvy masivně investují do AI nástrojů pro kreativu a analýzu.',
      en: 'Leading agencies like WPP and Ogilvy massively invest in AI tools for creative and analysis.'
    }
  },
  {
    id: 'media_video',
    label: { cs: 'Video produkce', en: 'Video Production' },
    parentBusinessType: 'marketing_agency',
    parentCategory: 'E',
    keywords: ['video', 'produkce', 'production', 'film', 'střih', 'editing', 'youtube'],
    specificPainPoints: [
      { cs: 'Časově náročný střih a postprodukce', en: 'Time-consuming editing and post-production' },
      { cs: 'Přepis a titulkování videí', en: 'Video transcription and subtitling' },
      { cs: 'Tvorba krátkých verzí pro sociální sítě', en: 'Creating short versions for social media' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Video střih a highlights', en: 'AI Video Editing and Highlights' },
        description: { cs: 'Automatické stříhání, titulky a tvorba krátkých klipů', en: 'Automatic editing, subtitles, and short clip creation' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Video producenti využívají AI nástroje jako Descript a Runway pro zrychlení postprodukce.',
      en: 'Video producers use AI tools like Descript and Runway to speed up post-production.'
    }
  },
  {
    id: 'media_photography',
    label: { cs: 'Fotografické studio', en: 'Photography Studio' },
    parentBusinessType: 'marketing_agency',
    parentCategory: 'E',
    keywords: ['fotografie', 'photography', 'fotograf', 'photographer', 'studio', 'svatba', 'wedding'],
    specificPainPoints: [
      { cs: 'Třídění a výběr fotek z focení', en: 'Sorting and selecting photos from shoots' },
      { cs: 'Úpravy a retuše velkého množství fotek', en: 'Editing and retouching large volumes of photos' },
      { cs: 'Správa galérií a doručení klientům', en: 'Managing galleries and client delivery' }
    ],
    primarySolutions: [
      {
        title: { cs: 'AI Třídění a základní úpravy fotek', en: 'AI Photo Sorting and Basic Editing' },
        description: { cs: 'Automatický výběr nejlepších záběrů a konzistentní úpravy', en: 'Automatic selection of best shots and consistent editing' },
        primaryBenefit: 'time_savings'
      }
    ],
    competitorContext: {
      cs: 'Profesionální fotografové používají AI nástroje jako Imagen a Aftershoot pro zrychlení workflow.',
      en: 'Professional photographers use AI tools like Imagen and Aftershoot to speed up workflow.'
    }
  }
];

// =============================================================================
// DETECTION FUNCTIONS
// =============================================================================

/**
 * Detect micro-niche from industry string and search content
 */
export function detectMicroNiche(
  industry: string | undefined,
  searchContent?: string
): MicroNiche | null {
  if (!industry) return null;

  const lowerIndustry = industry.toLowerCase();
  const lowerSearch = (searchContent || '').toLowerCase();
  const combinedText = `${lowerIndustry} ${lowerSearch}`;

  // Score each micro-niche based on keyword matches
  let bestMatch: MicroNiche | null = null;
  let bestScore = 0;

  for (const niche of MICRO_NICHES) {
    let score = 0;

    for (const keyword of niche.keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        score += 1;
        // Bonus for exact industry match
        if (lowerIndustry.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = niche;
    }
  }

  // Only return if we have a meaningful match (at least 2 keyword matches)
  return bestScore >= 2 ? bestMatch : null;
}

/**
 * Get micro-niche by ID
 */
export function getMicroNicheById(id: string): MicroNiche | undefined {
  return MICRO_NICHES.find(niche => niche.id === id);
}

/**
 * Get all micro-niches for a parent business type
 */
export function getMicroNichesByBusinessType(businessType: BusinessType): MicroNiche[] {
  return MICRO_NICHES.filter(niche => niche.parentBusinessType === businessType);
}

/**
 * Get competitor context for prompt
 */
export function getCompetitorContextForPrompt(
  microNiche: MicroNiche | null,
  language: 'cs' | 'en'
): string {
  if (!microNiche) return '';

  const context = microNiche.competitorContext[language];

  if (language === 'cs') {
    return `
### KONKURENČNÍ KONTEXT
${context}

Pomoz ${microNiche.label.cs} držet krok nebo předběhnout konkurenci pomocí AI.
`;
  }

  return `
### COMPETITOR CONTEXT
${context}

Help ${microNiche.label.en} keep up with or outpace competitors using AI.
`;
}
