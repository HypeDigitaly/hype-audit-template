// =============================================================================
// PAIN POINT ANALYZER - Categorize and map pain points to AI solutions
// =============================================================================

/**
 * Pain point categories with keywords for detection and mapped AI solutions
 */

export interface PainPointCategory {
  id: string;
  name: {
    cs: string;
    en: string;
  };
  description: {
    cs: string;
    en: string;
  };
  keywords: {
    cs: string[];
    en: string[];
  };
  mappedSolutions: string[];
  promptEmphasis: {
    cs: string;
    en: string;
  };
  emotionalHook: {
    cs: string;
    en: string;
  };
}

// =============================================================================
// PAIN POINT CATEGORIES (10 categories)
// =============================================================================

export const PAIN_POINT_CATEGORIES: PainPointCategory[] = [
  // --------------------------------------------------------------------------
  // 1. CUSTOMER COMMUNICATION
  // --------------------------------------------------------------------------
  {
    id: 'customer_communication',
    name: {
      cs: 'Komunikace se zákazníky',
      en: 'Customer Communication'
    },
    description: {
      cs: 'Problémy s odpovídáním na dotazy, pomalá reakce, zahlcení emaily',
      en: 'Issues with answering inquiries, slow response, email overload'
    },
    keywords: {
      cs: [
        'zákaznický servis', 'dotazy', 'emaily', 'odpovědi', 'komunikace',
        'reakce', 'čekání', 'nestíháme', 'zahlcení', 'inbox', 'reklamace',
        'stížnosti', 'chat', 'telefony', 'volání', 'helpdesk', 'podpora',
        'zákazníci se ptají', 'opakované dotazy', 'stejné otázky',
        'nepřítomnost', 'mimo pracovní dobu', 'víkendy', 'svátky'
      ],
      en: [
        'customer service', 'inquiries', 'emails', 'responses', 'communication',
        'response time', 'waiting', 'overwhelmed', 'inbox', 'complaints',
        'chat', 'calls', 'helpdesk', 'support', 'customers ask',
        'repetitive questions', 'same questions', 'after hours', 'weekends',
        'holidays', 'availability', '24/7'
      ]
    },
    mappedSolutions: [
      'ai_chatbot',
      'email_assistant',
      'faq_automation',
      'ticket_routing',
      'sentiment_analysis'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s KOMUNIKACÍ SE ZÁKAZNÍKY.
Všechny AI příležitosti MUSÍ začínat řešením komunikačních problémů.
První 2 doporučení MUSÍ být zaměřena na:
- AI chatbot pro okamžité odpovědi 24/7
- Automatizace emailových odpovědí na časté dotazy
Použij scénáře jako: "Je pátek večer, zákazník má dotaz..." nebo "Každé pondělí ráno 50 nových emailů..."`,
      en: `PRIORITY PAIN: Customer has CUSTOMER COMMUNICATION issues.
All AI opportunities MUST start with solving communication problems.
First 2 recommendations MUST focus on:
- AI chatbot for instant 24/7 responses
- Email automation for frequent inquiries
Use scenarios like: "It's Friday evening, a customer has a question..." or "Every Monday morning, 50 new emails..."`
    },
    emotionalHook: {
      cs: 'Žádný zákazník by neměl čekat na odpověď jen proto, že je víkend nebo máte moc práce.',
      en: 'No customer should wait for a response just because it\'s the weekend or you\'re too busy.'
    }
  },

  // --------------------------------------------------------------------------
  // 2. TIME MANAGEMENT
  // --------------------------------------------------------------------------
  {
    id: 'time_management',
    name: {
      cs: 'Nedostatek času',
      en: 'Time Management'
    },
    description: {
      cs: 'Nestíhání úkolů, přetížení, administrativa zabírá příliš času',
      en: 'Not enough time for tasks, overload, admin takes too much time'
    },
    keywords: {
      cs: [
        'čas', 'nestíháme', 'přetížení', 'administrativa', 'rutina',
        'opakující se', 'manuální', 'zdlouhavé', 'hodiny', 'celý den',
        'papírování', 'vyplňování', 'kopírování', 'přepisování',
        'schůzky', 'meetingy', 'zápisy', 'reporty', 'tabulky',
        'nezbývá čas', 'práce přesčas', 'víkendy v práci',
        'nudná', 'přepínání', 'nástroji', 'mnoha', 'software'
      ],
      en: [
        'time', 'not enough time', 'overloaded', 'admin', 'routine',
        'repetitive', 'manual', 'tedious', 'hours', 'all day',
        'paperwork', 'filling forms', 'copying', 'transcribing',
        'meetings', 'meeting notes', 'reports', 'spreadsheets',
        'no time left', 'overtime', 'working weekends',
        'boring', 'juggling', 'tools', 'many', 'software'
      ]
    },
    mappedSolutions: [
      'task_automation',
      'meeting_summarizer',
      'document_processing',
      'workflow_automation',
      'scheduling_assistant'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s NEDOSTATKEM ČASU.
Všechny AI příležitosti MUSÍ být zaměřeny na ÚSPORU ČASU.
Každé doporučení MUSÍ obsahovat konkrétní odhad ušetřených hodin.
První doporučení MUSÍ řešit nejčastější časožrout (administrativa, manuální práce).
Použij scénáře jako: "Místo 2 hodin denně strávených..." nebo "Automaticky za 5 minut místo hodiny..."`,
      en: `PRIORITY PAIN: Customer has TIME MANAGEMENT issues.
All AI opportunities MUST focus on TIME SAVINGS.
Each recommendation MUST include specific hours saved estimate.
First recommendation MUST address the biggest time drain (admin, manual work).
Use scenarios like: "Instead of 2 hours daily spent on..." or "Automatically in 5 minutes instead of an hour..."`
    },
    emotionalHook: {
      cs: 'Váš čas je příliš cenný na to, abyste ho trávili kopírováním dat mezi tabulkami.',
      en: 'Your time is too valuable to spend copying data between spreadsheets.'
    }
  },

  // --------------------------------------------------------------------------
  // 3. LEAD GENERATION
  // --------------------------------------------------------------------------
  {
    id: 'lead_generation',
    name: {
      cs: 'Získávání zákazníků',
      en: 'Lead Generation'
    },
    description: {
      cs: 'Málo nových zákazníků, obtížné oslovování, nízká konverze',
      en: 'Few new customers, difficult outreach, low conversion'
    },
    keywords: {
      cs: [
        'zákazníci', 'klienti', 'akvizice', 'získávání', 'oslovování',
        'marketing', 'reklama', 'konverze', 'prodej', 'obchod',
        'leady', 'kontakty', 'poptávky', 'nabídky', 'obchodníci',
        'cold calling', 'emailing', 'sociální sítě', 'linkedin',
        'web', 'formuláře', 'málo poptávek', 'drahá reklama',
        'příchozí', 'rychlost', 'reakce', 'automatizace', 'nových'
      ],
      en: [
        'customers', 'clients', 'acquisition', 'outreach', 'prospecting',
        'marketing', 'advertising', 'conversion', 'sales', 'leads',
        'contacts', 'inquiries', 'proposals', 'salespeople',
        'cold calling', 'emailing', 'social media', 'linkedin',
        'website', 'forms', 'few inquiries', 'expensive ads',
        'inbound', 'speed', 'response', 'automating', 'new', 'gaining'
      ]
    },
    mappedSolutions: [
      'lead_scoring',
      'content_personalization',
      'email_sequences',
      'chatbot_qualification',
      'social_media_automation'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém se ZÍSKÁVÁNÍM NOVÝCH ZÁKAZNÍKŮ.
Všechny AI příležitosti MUSÍ být zaměřeny na RŮST ZÁKAZNICKÉ ZÁKLADNY.
První 2 doporučení MUSÍ řešit:
- Automatickou kvalifikaci a scoring leadů
- Personalizovaný obsah pro různé segmenty
Použij metriky jako: "Místo 100 studených hovorů, 20 předkvalifikovaných leadů..." nebo "Konverzní poměr z 2% na 5%..."`,
      en: `PRIORITY PAIN: Customer has LEAD GENERATION issues.
All AI opportunities MUST focus on GROWING CUSTOMER BASE.
First 2 recommendations MUST address:
- Automatic lead qualification and scoring
- Personalized content for different segments
Use metrics like: "Instead of 100 cold calls, 20 pre-qualified leads..." or "Conversion rate from 2% to 5%..."`
    },
    emotionalHook: {
      cs: 'Co kdyby každý lead, který vám přijde, byl už předem kvalifikovaný a připravený k nákupu?',
      en: 'What if every lead that comes in was already pre-qualified and ready to buy?'
    }
  },

  // --------------------------------------------------------------------------
  // 4. DATA & DOCUMENTS
  // --------------------------------------------------------------------------
  {
    id: 'data_documents',
    name: {
      cs: 'Práce s daty a dokumenty',
      en: 'Data & Documents'
    },
    description: {
      cs: 'Manuální zpracování dokumentů, přepisování, vyhledávání informací',
      en: 'Manual document processing, transcription, searching for information'
    },
    keywords: {
      cs: [
        'dokumenty', 'data', 'smlouvy', 'faktury', 'účtenky',
        'excel', 'tabulky', 'databáze', 'archiv', 'složky',
        'vyhledávání', 'hledání', 'ztracené', 'kde je',
        'přepisování', 'OCR', 'skenování', 'digitalizace',
        'analýza', 'reporting', 'statistiky', 'přehledy'
      ],
      en: [
        'documents', 'data', 'contracts', 'invoices', 'receipts',
        'excel', 'spreadsheets', 'database', 'archive', 'folders',
        'searching', 'finding', 'lost', 'where is',
        'transcription', 'OCR', 'scanning', 'digitization',
        'analysis', 'reporting', 'statistics', 'overviews'
      ]
    },
    mappedSolutions: [
      'document_extraction',
      'intelligent_search',
      'data_entry_automation',
      'contract_analysis',
      'report_generation'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s DOKUMENTY A DATY.
Všechny AI příležitosti MUSÍ být zaměřeny na AUTOMATIZACI PRÁCE S DOKUMENTY.
První doporučení MUSÍ řešit nejbolestivější dokument (smlouvy, faktury, nebo interní dokumenty).
Použij scénáře jako: "Místo hodin strávených hledáním v archívu..." nebo "Automatická extrakce dat z 100 faktur za minutu..."`,
      en: `PRIORITY PAIN: Customer has DATA & DOCUMENTS issues.
All AI opportunities MUST focus on DOCUMENT AUTOMATION.
First recommendation MUST address most painful document type (contracts, invoices, or internal docs).
Use scenarios like: "Instead of hours searching the archive..." or "Automatic extraction from 100 invoices in a minute..."`
    },
    emotionalHook: {
      cs: 'Představte si, že se zeptáte AI a ona vám během sekundy najde informaci z dokumentu starého 3 roky.',
      en: 'Imagine asking AI and having it find information from a 3-year-old document in seconds.'
    }
  },

  // --------------------------------------------------------------------------
  // 5. EMPLOYEE PRODUCTIVITY
  // --------------------------------------------------------------------------
  {
    id: 'employee_productivity',
    name: {
      cs: 'Produktivita zaměstnanců',
      en: 'Employee Productivity'
    },
    description: {
      cs: 'Nízká efektivita, chyby, onboarding, školení',
      en: 'Low efficiency, errors, onboarding, training'
    },
    keywords: {
      cs: [
        'zaměstnanci', 'tým', 'produktivita', 'efektivita', 'výkon',
        'chyby', 'omyly', 'kontrola', 'kvalita', 'onboarding',
        'školení', 'zaškolení', 'nováčci', 'fluktuace', 'know-how',
        'znalosti', 'dokumentace', 'postupy', 'procesy',
        'integrace', 'crm', 'erp', 'aplikace', 'systém'
      ],
      en: [
        'employees', 'team', 'productivity', 'efficiency', 'performance',
        'errors', 'mistakes', 'quality control', 'onboarding',
        'training', 'new hires', 'turnover', 'know-how',
        'knowledge', 'documentation', 'procedures', 'processes',
        'integrating', 'integration', 'crm', 'erp', 'app', 'system'
      ]
    },
    mappedSolutions: [
      'knowledge_base_ai',
      'process_assistant',
      'quality_checker',
      'training_bot',
      'sop_automation'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s PRODUKTIVITOU ZAMĚSTNANCŮ.
Všechny AI příležitosti MUSÍ být zaměřeny na ZVÝŠENÍ VÝKONU TÝMU.
První doporučení MUSÍ řešit onboarding nebo snížení chybovosti.
Použij scénáře jako: "Nový zaměstnanec se zeptá AI místo kolegy..." nebo "Automatická kontrola před odesláním..."`,
      en: `PRIORITY PAIN: Customer has EMPLOYEE PRODUCTIVITY issues.
All AI opportunities MUST focus on INCREASING TEAM PERFORMANCE.
First recommendation MUST address onboarding or error reduction.
Use scenarios like: "New employee asks AI instead of colleague..." or "Automatic check before sending..."`
    },
    emotionalHook: {
      cs: 'Co kdyby každý zaměstnanec měl svého osobního asistenta, který zná všechny firemní procesy?',
      en: 'What if every employee had their own personal assistant who knows all company processes?'
    }
  },

  // --------------------------------------------------------------------------
  // 6. CONTENT CREATION
  // --------------------------------------------------------------------------
  {
    id: 'content_creation',
    name: {
      cs: 'Tvorba obsahu',
      en: 'Content Creation'
    },
    description: {
      cs: 'Psaní textů, marketing, sociální sítě, prezentace',
      en: 'Writing texts, marketing, social media, presentations'
    },
    keywords: {
      cs: [
        'obsah', 'texty', 'články', 'blog', 'sociální sítě',
        'facebook', 'instagram', 'linkedin', 'newsletter', 'emaily',
        'copywriting', 'marketing', 'reklama', 'prezentace',
        'videa', 'fotky', 'grafika', 'design', 'kreativa',
        'tvorba', 'marketingových', 'materiálů', 'postování'
      ],
      en: [
        'content', 'texts', 'articles', 'blog', 'social media',
        'facebook', 'instagram', 'linkedin', 'newsletter', 'emails',
        'copywriting', 'marketing', 'advertising', 'presentations',
        'videos', 'photos', 'graphics', 'design', 'creative',
        'creating', 'materials', 'posting'
      ]
    },
    mappedSolutions: [
      'content_generator',
      'social_media_assistant',
      'email_writer',
      'presentation_builder',
      'image_generation'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s TVORBOU OBSAHU.
Všechny AI příležitosti MUSÍ být zaměřeny na EFEKTIVNĚJŠÍ TVORBU MARKETINGOVÉHO OBSAHU.
První doporučení MUSÍ řešit nejčastější typ obsahu (sociální sítě, emaily, nebo články).
Použij scénáře jako: "Místo hodiny psaní příspěvku, 5 variant za minutu..." nebo "Konzistentní brand voice napříč všemi kanály..."`,
      en: `PRIORITY PAIN: Customer has CONTENT CREATION issues.
All AI opportunities MUST focus on MORE EFFICIENT MARKETING CONTENT CREATION.
First recommendation MUST address most common content type (social media, emails, or articles).
Use scenarios like: "Instead of an hour writing a post, 5 variants in a minute..." or "Consistent brand voice across all channels..."`
    },
    emotionalHook: {
      cs: 'Co kdybyste měli copywritera, který nikdy nemá writers block a zná váš brand dokonale?',
      en: 'What if you had a copywriter who never has writer\'s block and knows your brand perfectly?'
    }
  },

  // --------------------------------------------------------------------------
  // 7. SCHEDULING & BOOKING
  // --------------------------------------------------------------------------
  {
    id: 'scheduling_booking',
    name: {
      cs: 'Plánování a rezervace',
      en: 'Scheduling & Booking'
    },
    description: {
      cs: 'Rezervace termínů, plánování schůzek, kalendář',
      en: 'Booking appointments, scheduling meetings, calendar'
    },
    keywords: {
      cs: [
        'rezervace', 'termíny', 'schůzky', 'kalendář', 'plánování',
        'booking', 'objednávky', 'časové sloty', 'dostupnost',
        'potvrzení', 'připomínky', 'notifikace', 'zrušení',
        'přeobjednání', 'no-show', 'neukázal se', 'telefonování'
      ],
      en: [
        'reservations', 'appointments', 'meetings', 'calendar', 'scheduling',
        'booking', 'orders', 'time slots', 'availability',
        'confirmations', 'reminders', 'notifications', 'cancellations',
        'rescheduling', 'no-show', 'calling', 'phone calls'
      ]
    },
    mappedSolutions: [
      'booking_assistant',
      'calendar_automation',
      'reminder_system',
      'voice_booking',
      'availability_optimizer'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s PLÁNOVÁNÍM A REZERVACEMI.
Všechny AI příležitosti MUSÍ být zaměřeny na AUTOMATIZACI REZERVAČNÍHO PROCESU.
První doporučení MUSÍ řešit nejbolestivější část (telefonní rezervace, no-shows, nebo koordinace).
Použij scénáře jako: "Zákazník si rezervuje termín ve 23:00 bez nutnosti volat..." nebo "Automatická připomínka sníží no-shows o 40%..."`,
      en: `PRIORITY PAIN: Customer has SCHEDULING & BOOKING issues.
All AI opportunities MUST focus on BOOKING PROCESS AUTOMATION.
First recommendation MUST address most painful part (phone bookings, no-shows, or coordination).
Use scenarios like: "Customer books at 11 PM without calling..." or "Automatic reminder reduces no-shows by 40%..."`
    },
    emotionalHook: {
      cs: 'Představte si, že zákazníci rezervují sami, dostávají připomínky automaticky, a vy už nemusíte zvedat telefon.',
      en: 'Imagine customers booking themselves, receiving automatic reminders, and you never having to pick up the phone.'
    }
  },

  // --------------------------------------------------------------------------
  // 8. INVENTORY & OPERATIONS
  // --------------------------------------------------------------------------
  {
    id: 'inventory_operations',
    name: {
      cs: 'Zásoby a provoz',
      en: 'Inventory & Operations'
    },
    description: {
      cs: 'Správa zásob, objednávání, logistika, dodavatelé',
      en: 'Inventory management, ordering, logistics, suppliers'
    },
    keywords: {
      cs: [
        'zásoby', 'sklad', 'inventura', 'objednávky', 'dodavatelé',
        'logistika', 'expedice', 'doručení', 'sledování', 'tracking',
        'výpadky', 'chybí', 'přebytky', 'optimalizace', 'náklady',
        'výroba', 'plánování výroby', 'kapacity', 'stroje'
      ],
      en: [
        'inventory', 'warehouse', 'stocktaking', 'orders', 'suppliers',
        'logistics', 'shipping', 'delivery', 'tracking',
        'stockouts', 'missing', 'excess', 'optimization', 'costs',
        'production', 'production planning', 'capacity', 'machines'
      ]
    },
    mappedSolutions: [
      'demand_forecasting',
      'inventory_optimization',
      'supplier_automation',
      'logistics_planning',
      'predictive_maintenance'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém se ZÁSOBAMI A PROVOZEM.
Všechny AI příležitosti MUSÍ být zaměřeny na OPTIMALIZACI PROVOZNÍCH PROCESŮ.
První doporučení MUSÍ řešit predikci poptávky nebo optimalizaci zásob.
Použij scénáře jako: "AI předpovídá potřebu materiálu 2 týdny dopředu..." nebo "Automatické objednávky u dodavatelů při dosažení minimální zásoby..."`,
      en: `PRIORITY PAIN: Customer has INVENTORY & OPERATIONS issues.
All AI opportunities MUST focus on OPERATIONAL PROCESS OPTIMIZATION.
First recommendation MUST address demand forecasting or inventory optimization.
Use scenarios like: "AI predicts material needs 2 weeks ahead..." or "Automatic supplier orders when minimum stock is reached..."`
    },
    emotionalHook: {
      cs: 'Co kdybyste nikdy neměli výpadek zásob, ani přebytky, které jen zabírají místo a vážou kapitál?',
      en: 'What if you never had stockouts, nor excess inventory taking up space and tying up capital?'
    }
  },

  // --------------------------------------------------------------------------
  // 9. FINANCIAL MANAGEMENT
  // --------------------------------------------------------------------------
  {
    id: 'financial_management',
    name: {
      cs: 'Finance a účetnictví',
      en: 'Financial Management'
    },
    description: {
      cs: 'Fakturace, účetnictví, cash flow, pohledávky',
      en: 'Invoicing, accounting, cash flow, receivables'
    },
    keywords: {
      cs: [
        'finance', 'účetnictví', 'faktury', 'fakturace', 'platby',
        'pohledávky', 'dlužníci', 'cash flow', 'rozpočet', 'náklady',
        'výnosy', 'marže', 'zisk', 'ztráta', 'daně', 'DPH',
        'bankovní výpisy', 'párování', 'reporting', 'controlling'
      ],
      en: [
        'finance', 'accounting', 'invoices', 'invoicing', 'payments',
        'receivables', 'debtors', 'cash flow', 'budget', 'costs',
        'revenue', 'margin', 'profit', 'loss', 'taxes', 'VAT',
        'bank statements', 'matching', 'reporting', 'controlling'
      ]
    },
    mappedSolutions: [
      'invoice_automation',
      'expense_categorization',
      'cash_flow_prediction',
      'receivables_automation',
      'financial_reporting'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém s FINANCEMI A ÚČETNICTVÍM.
Všechny AI příležitosti MUSÍ být zaměřeny na FINANČNÍ AUTOMATIZACI A PŘEHLED.
První doporučení MUSÍ řešit nejbolestivější proces (fakturace, párování plateb, nebo reporting).
Použij scénáře jako: "Automatická fakturace po dokončení zakázky..." nebo "AI páruje 95% plateb bez zásahu člověka..."`,
      en: `PRIORITY PAIN: Customer has FINANCIAL MANAGEMENT issues.
All AI opportunities MUST focus on FINANCIAL AUTOMATION AND VISIBILITY.
First recommendation MUST address most painful process (invoicing, payment matching, or reporting).
Use scenarios like: "Automatic invoicing upon job completion..." or "AI matches 95% of payments without human intervention..."`
    },
    emotionalHook: {
      cs: 'Představte si, že víte přesně, kolik peněz přijde příští měsíc, a faktury se posílají samy.',
      en: 'Imagine knowing exactly how much money is coming next month, and invoices sending themselves.'
    }
  },

  // --------------------------------------------------------------------------
  // 10. COMPETITIVE INTELLIGENCE
  // --------------------------------------------------------------------------
  {
    id: 'competitive_intelligence',
    name: {
      cs: 'Konkurenční zpravodajství',
      en: 'Competitive Intelligence'
    },
    description: {
      cs: 'Sledování konkurence, trendy, analýza trhu',
      en: 'Competitor monitoring, trends, market analysis'
    },
    keywords: {
      cs: [
        'konkurence', 'konkurenti', 'trh', 'trendy', 'analýza',
        'ceny', 'ceníky', 'nabídky', 'novinky', 'produkty',
        'inovace', 'změny', 'sledování', 'monitoring', 'benchmarking',
        'pozice na trhu', 'podíl na trhu', 'strategie'
      ],
      en: [
        'competition', 'competitors', 'market', 'trends', 'analysis',
        'prices', 'pricing', 'offers', 'news', 'products',
        'innovation', 'changes', 'tracking', 'monitoring', 'benchmarking',
        'market position', 'market share', 'strategy'
      ]
    },
    mappedSolutions: [
      'competitor_monitoring',
      'price_tracking',
      'trend_analysis',
      'market_intelligence',
      'sentiment_monitoring'
    ],
    promptEmphasis: {
      cs: `PRIORITNÍ BOLEST: Zákazník má problém se SLEDOVÁNÍM KONKURENCE A TRHU.
Všechny AI příležitosti MUSÍ být zaměřeny na ZÍSKÁNÍ KONKURENČNÍ VÝHODY.
První doporučení MUSÍ řešit automatické sledování konkurence nebo trendů.
Použij scénáře jako: "AI vás upozorní, když konkurent změní ceny..." nebo "Týdenní report trendů ve vašem odvětví automaticky..."`,
      en: `PRIORITY PAIN: Customer has COMPETITIVE INTELLIGENCE issues.
All AI opportunities MUST focus on GAINING COMPETITIVE ADVANTAGE.
First recommendation MUST address automatic competitor or trend monitoring.
Use scenarios like: "AI alerts you when a competitor changes prices..." or "Weekly industry trend report automatically..."`
    },
    emotionalHook: {
      cs: 'Co kdybyste vždy věděli, co dělá konkurence, dříve než vaši zákazníci?',
      en: 'What if you always knew what competitors are doing before your customers do?'
    }
  }
];

// =============================================================================
// PAIN POINT DETECTION
// =============================================================================

export interface DetectedPainPoint {
  category: PainPointCategory;
  confidence: 'high' | 'medium' | 'low';
  matchedKeywords: string[];
}

/**
 * Detect pain points from user input text
 */
export function detectPainPoints(
  painPointText: string,
  language: 'cs' | 'en'
): DetectedPainPoint[] {
  if (!painPointText || painPointText.trim().length < 3) {
    return [];
  }

  const normalizedText = painPointText.toLowerCase().trim();
  const detected: DetectedPainPoint[] = [];

  for (const category of PAIN_POINT_CATEGORIES) {
    const keywords = category.keywords[language];
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    }

    if (matchedKeywords.length > 0) {
      // Determine confidence based on number of keyword matches
      let confidence: 'high' | 'medium' | 'low';
      if (matchedKeywords.length >= 3) {
        confidence = 'high';
      } else if (matchedKeywords.length >= 2) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }

      detected.push({
        category,
        confidence,
        matchedKeywords
      });
    }
  }

  // Sort by confidence (high first) and number of matches
  detected.sort((a, b) => {
    const confidenceOrder = { high: 3, medium: 2, low: 1 };
    const confDiff = confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
    if (confDiff !== 0) return confDiff;
    return b.matchedKeywords.length - a.matchedKeywords.length;
  });

  return detected;
}

/**
 * Get the primary (most relevant) pain point
 */
export function getPrimaryPainPoint(
  painPointText: string,
  language: 'cs' | 'en'
): DetectedPainPoint | null {
  const detected = detectPainPoints(painPointText, language);
  return detected.length > 0 ? detected[0] : null;
}

// =============================================================================
// PROMPT GENERATION HELPERS
// =============================================================================

/**
 * Generate pain point emphasis instructions for the LLM prompt
 */
export function getPainPointPromptInstructions(
  painPointText: string,
  language: 'cs' | 'en'
): string {
  const primary = getPrimaryPainPoint(painPointText, language);

  if (!primary) {
    return '';
  }

  const category = primary.category;
  const emphasis = category.promptEmphasis[language];
  const emotionalHook = category.emotionalHook[language];
  const categoryName = category.name[language];

  if (language === 'cs') {
    return `
### 🎯 PRIORITNÍ BOLEST ZÁKAZNÍKA: ${categoryName.toUpperCase()}

Zákazník explicitně zmínil problém: "${painPointText}"

${emphasis}

EMOCIONÁLNÍ HÁČEK PRO TENTO TYP BOLESTI:
"${emotionalHook}"

VŠECHNA DOPORUČENÍ MUSÍ BÝT PRIORITNĚ ZAMĚŘENA NA ŘEŠENÍ TOHOTO PROBLÉMU!
Použij emocionální háček v úvodním textu nebo v popisu prvního doporučení.
`;
  } else {
    return `
### 🎯 CUSTOMER'S PRIORITY PAIN POINT: ${categoryName.toUpperCase()}

Customer explicitly mentioned problem: "${painPointText}"

${emphasis}

EMOTIONAL HOOK FOR THIS TYPE OF PAIN:
"${emotionalHook}"

ALL RECOMMENDATIONS MUST PRIMARILY ADDRESS THIS PROBLEM!
Use the emotional hook in the intro text or in the first recommendation description.
`;
  }
}

/**
 * Get mapped AI solutions for a pain point
 */
export function getMappedSolutionsForPainPoint(
  painPointText: string,
  language: 'cs' | 'en'
): string[] {
  const primary = getPrimaryPainPoint(painPointText, language);

  if (!primary) {
    return [];
  }

  return primary.category.mappedSolutions;
}

/**
 * Get all pain point categories (for reference/documentation)
 */
export function getAllPainPointCategories(): PainPointCategory[] {
  return PAIN_POINT_CATEGORIES;
}
