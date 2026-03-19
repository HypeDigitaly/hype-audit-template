// =============================================================================
// VALUE PROPOSITION TEMPLATES - Copywriting patterns for compelling language
// =============================================================================

/**
 * Templates and patterns for crafting compelling, sales-focused AI solution descriptions
 */

// =============================================================================
// STORYTELLING SENTENCE PATTERNS
// =============================================================================

export interface StorytellingPattern {
  id: string;
  name: {
    cs: string;
    en: string;
  };
  pattern: {
    cs: string;
    en: string;
  };
  example: {
    cs: string;
    en: string;
  };
}

// =============================================================================
// VARIETY OPENERS - Different ways to start AI solution descriptions
// CRITICAL: Each description MUST use a DIFFERENT opener!
// =============================================================================

export const VARIETY_OPENERS = {
  cs: [
    'Představte si situaci:',
    'Každý den se opakuje stejný scénář:',
    'Váš tým pravděpodobně zná tento problém:',
    'Co kdyby [činnost] probíhala automaticky?',
    'Kolik času týdně strávíte [činností]?',
    'Znáte ten moment, kdy',
    'Váš typický den zahrnuje',
    'Většina firem ve vašem odvětví řeší',
    'Jedna z nejčastějších překážek růstu je',
    'Položte si otázku:'
  ],
  en: [
    'Picture this scenario:',
    'Every day, the same pattern repeats:',
    'Your team probably knows this problem:',
    'What if [activity] happened automatically?',
    'How much time weekly do you spend on [activity]?',
    'You know that moment when',
    'Your typical day involves',
    'Most businesses in your industry deal with',
    'One of the most common growth barriers is',
    'Ask yourself:'
  ]
};

export const STORYTELLING_PATTERNS: StorytellingPattern[] = [
  {
    id: 'scenario_opener',
    name: {
      cs: 'Otevírací scénář (VARIUJ!)',
      en: 'Scenario Opener (VARY!)'
    },
    pattern: {
      cs: '[POUŽIJ RŮZNÉ OTEVÍRAČE - viz VARIETY_OPENERS výše]',
      en: '[USE DIFFERENT OPENERS - see VARIETY_OPENERS above]'
    },
    example: {
      cs: 'Každý den se opakuje stejný scénář: zákazník volá s dotazem, vy ho přepojíte na kolegu, ten hledá informace...',
      en: 'Every day, the same pattern repeats: a customer calls with a question, you transfer them, your colleague searches for info...'
    }
  },
  {
    id: 'current_problem',
    name: {
      cs: 'Současný problém',
      en: 'Current Problem'
    },
    pattern: {
      cs: 'Dnes [jak to funguje bez AI / co se děje]...',
      en: 'Today [how it works without AI / what happens]...'
    },
    example: {
      cs: 'Dnes by musel čekat do pondělí na odpověď - a mezitím možná najde jinou firmu.',
      en: 'Today they would have to wait until Monday for a response - and might find another company in the meantime.'
    }
  },
  {
    id: 'ai_solution',
    name: {
      cs: 'Řešení s AI',
      en: 'AI Solution'
    },
    pattern: {
      cs: 'S [název řešení] [jak to bude fungovat]...',
      en: 'With [solution name] [how it will work]...'
    },
    example: {
      cs: 'S AI asistentem natrénovaným na vašich FAQ a ceníku dostane odpověď okamžitě a může rovnou udělat objednávku.',
      en: 'With an AI assistant trained on your FAQ and pricing, they get an answer instantly and can place an order right away.'
    }
  },
  {
    id: 'quantified_benefit',
    name: {
      cs: 'Kvantifikovaný přínos',
      en: 'Quantified Benefit'
    },
    pattern: {
      cs: '[Konkrétní číslo/metrika] bez [námahy/času/nákladů]...',
      en: '[Specific number/metric] without [effort/time/cost]...'
    },
    example: {
      cs: 'Ušetříte 10+ hodin týdně na odpovídání opakujících se dotazů bez nutnosti najímat dalšího člověka.',
      en: 'Save 10+ hours weekly on answering repetitive questions without hiring additional staff.'
    }
  },
  {
    id: 'personalized_close',
    name: {
      cs: 'Personalizovaný závěr',
      en: 'Personalized Close'
    },
    pattern: {
      cs: 'Pro [název firmy / typ podnikání] to znamená [specifický benefit]...',
      en: 'For [company name / business type] this means [specific benefit]...'
    },
    example: {
      cs: 'Pro vaše fitness studio to znamená, že žádná příležitost na nové členství neunikne jen proto, že jste měli plný rozvrh.',
      en: 'For your fitness studio this means no membership opportunity slips away just because you were fully booked.'
    }
  }
];

// =============================================================================
// POWER WORDS & PHRASES
// =============================================================================

export interface PowerWordCategory {
  category: string;
  words: {
    cs: string[];
    en: string[];
  };
}

export const POWER_WORDS: PowerWordCategory[] = [
  {
    category: 'urgency',
    words: {
      cs: ['okamžitě', 'hned', 'ihned', 'bez čekání', 'v reálném čase', 'za sekundy', 'automaticky'],
      en: ['instantly', 'immediately', 'right away', 'no waiting', 'real-time', 'in seconds', 'automatically']
    }
  },
  {
    category: 'exclusivity',
    words: {
      cs: ['personalizované', 'na míru', 'přizpůsobené', 'unikátní', 'exkluzivní', 'prémiové'],
      en: ['personalized', 'customized', 'tailored', 'unique', 'exclusive', 'premium']
    }
  },
  {
    category: 'ease',
    words: {
      cs: ['jednoduše', 'bez námahy', 'automaticky', 'samo', 'bez zásahu', 'na jedno kliknutí'],
      en: ['easily', 'effortlessly', 'automatically', 'hands-free', 'one-click', 'seamlessly']
    }
  },
  {
    category: 'savings',
    words: {
      cs: ['ušetříte', 'získáte zpět', 'snížíte', 'eliminujete', 'zbavíte se', 'zefektivníte'],
      en: ['save', 'reclaim', 'reduce', 'eliminate', 'get rid of', 'streamline']
    }
  },
  {
    category: 'growth',
    words: {
      cs: ['zvýšíte', 'navýšíte', 'rozšíříte', 'posílíte', 'zdvojnásobíte', 'akcelerujete'],
      en: ['increase', 'boost', 'expand', 'strengthen', 'double', 'accelerate']
    }
  },
  {
    category: 'reliability',
    words: {
      cs: ['spolehlivě', 'konzistentně', '24/7', 'nepřetržitě', 'vždy', 'bez výpadků'],
      en: ['reliably', 'consistently', '24/7', 'around the clock', 'always', 'without downtime']
    }
  }
];

// =============================================================================
// BENEFIT FRAMING TEMPLATES
// =============================================================================

export interface BenefitFrame {
  id: string;
  frame: {
    cs: string;
    en: string;
  };
  useCase: string;
}

export const BENEFIT_FRAMES: BenefitFrame[] = [
  {
    id: 'time_to_value',
    frame: {
      cs: 'Místo [X času] strávených [činností], dostanete [výsledek] za [Y času].',
      en: 'Instead of [X time] spent on [activity], get [result] in [Y time].'
    },
    useCase: 'Time savings'
  },
  {
    id: 'never_miss',
    frame: {
      cs: 'Žádný/á [příležitost/zákazník/lead] už neunikne jen proto, že [důvod].',
      en: 'No [opportunity/customer/lead] will slip through just because [reason].'
    },
    useCase: 'Customer acquisition'
  },
  {
    id: 'always_available',
    frame: {
      cs: '[Činnost/služba] dostupná 24/7, i když [okolnost].',
      en: '[Activity/service] available 24/7, even when [circumstance].'
    },
    useCase: 'Availability/service'
  },
  {
    id: 'expertise_scale',
    frame: {
      cs: 'Každý [osoba] získá přístup k [expertiza/znalosti] bez nutnosti [náklad/čas].',
      en: 'Every [person] gets access to [expertise/knowledge] without [cost/time].'
    },
    useCase: 'Knowledge/training'
  },
  {
    id: 'error_elimination',
    frame: {
      cs: 'Konec [typ chyby] - AI automaticky [prevence/kontrola].',
      en: 'No more [error type] - AI automatically [prevention/check].'
    },
    useCase: 'Quality/errors'
  },
  {
    id: 'scale_without_hiring',
    frame: {
      cs: '[X-krát více činnosti] bez nutnosti přijímat nové lidi.',
      en: '[X times more activity] without hiring new people.'
    },
    useCase: 'Scaling'
  },
  {
    id: 'competitive_edge',
    frame: {
      cs: 'Zatímco konkurence [stará metoda], vy [nový způsob s AI].',
      en: 'While competitors [old method], you [new AI way].'
    },
    useCase: 'Competitive advantage'
  },
  {
    id: 'customer_delight',
    frame: {
      cs: 'Zákazníci ocení [benefit], což vede k [výsledek].',
      en: 'Customers appreciate [benefit], leading to [result].'
    },
    useCase: 'Customer satisfaction'
  }
];

// =============================================================================
// INTRO TEXT TEMPLATES
// =============================================================================

export interface IntroTemplate {
  id: string;
  businessType: string;
  template: {
    cs: string;
    en: string;
  };
}

export const INTRO_TEMPLATES: IntroTemplate[] = [
  {
    id: 'service_business',
    businessType: 'service',
    template: {
      cs: 'Na základě analýzy {companyName} jsme identifikovali {count} klíčových oblastí, kde umělá inteligence může významně zefektivnit vaše služby. Největší příležitost vidíme v {topOpportunity}, což by vám mohlo ušetřit {hours} hodin týdně a zároveň zvýšit spokojenost vašich klientů. Díky automatizaci {painPoint} získáte více času na to, co děláte nejlépe - {coreService}.',
      en: 'Based on our analysis of {companyName}, we identified {count} key areas where AI can significantly improve your services. The biggest opportunity is in {topOpportunity}, which could save you {hours} hours weekly while increasing client satisfaction. By automating {painPoint}, you\'ll have more time for what you do best - {coreService}.'
    }
  },
  {
    id: 'ecommerce',
    businessType: 'ecommerce',
    template: {
      cs: 'Pro {companyName} jsme našli {count} způsobů, jak AI může zvýšit konverze a snížit provozní náklady. Nejatraktivnější možností je {topOpportunity}, která by mohla přinést {benefit}. V kombinaci s automatizací {painPoint} máte potenciál zvýšit tržby bez navýšení nákladů na marketing.',
      en: 'For {companyName}, we found {count} ways AI can increase conversions and reduce operational costs. The most attractive opportunity is {topOpportunity}, which could deliver {benefit}. Combined with {painPoint} automation, you have the potential to grow revenue without increasing marketing spend.'
    }
  },
  {
    id: 'professional_services',
    businessType: 'professional',
    template: {
      cs: 'Analýza {companyName} odhalila {count} příležitostí pro zefektivnění vaší praxe pomocí AI. Prioritou by měla být {topOpportunity} - to vám umožní věnovat více času složitým případům a méně času administrativě. Klienti {companyName} ocení rychlejší reakce a konzistentnější kvalitu služeb.',
      en: 'Our analysis of {companyName} revealed {count} opportunities to streamline your practice with AI. Priority should be {topOpportunity} - this will allow you to spend more time on complex cases and less on administration. {companyName}\'s clients will appreciate faster responses and more consistent service quality.'
    }
  },
  {
    id: 'manufacturing',
    businessType: 'manufacturing',
    template: {
      cs: 'Pro výrobní procesy {companyName} jsme identifikovali {count} oblastí s vysokým potenciálem pro AI optimalizaci. Hlavní příležitost je v {topOpportunity}, která může přinést {benefit}. Díky prediktivní analýze a automatizaci {painPoint} dosáhnete vyšší efektivity bez nutnosti velkých investic do nového vybavení.',
      en: 'For {companyName}\'s manufacturing processes, we identified {count} high-potential areas for AI optimization. The main opportunity is {topOpportunity}, which can deliver {benefit}. Through predictive analysis and {painPoint} automation, you\'ll achieve higher efficiency without major equipment investments.'
    }
  },
  {
    id: 'generic',
    businessType: 'generic',
    template: {
      cs: 'Na základě komplexní analýzy {companyName} jsme identifikovali {count} konkrétních příležitostí, kde umělá inteligence může přinést okamžitou hodnotu. Nejvyšší prioritou je {topOpportunity}, což by mohlo {benefit}. Tyto změny jsou realizovatelné v krátkém čase a bez narušení vašeho současného fungování.',
      en: 'Based on our comprehensive analysis of {companyName}, we identified {count} specific opportunities where AI can deliver immediate value. Top priority is {topOpportunity}, which could {benefit}. These changes are achievable quickly and without disrupting your current operations.'
    }
  }
];

// =============================================================================
// OBJECTION HANDLING PHRASES
// =============================================================================

export interface ObjectionHandler {
  objection: string;
  response: {
    cs: string;
    en: string;
  };
}

export const OBJECTION_HANDLERS: ObjectionHandler[] = [
  {
    objection: 'too_expensive',
    response: {
      cs: 'Náklady na implementaci se vrátí během {timeframe} díky úspoře {savings}.',
      en: 'Implementation costs pay back within {timeframe} through {savings} savings.'
    }
  },
  {
    objection: 'too_complex',
    response: {
      cs: 'Moderní AI nástroje se integrují během {timeframe} bez nutnosti technických znalostí.',
      en: 'Modern AI tools integrate within {timeframe} without requiring technical expertise.'
    }
  },
  {
    objection: 'job_loss',
    response: {
      cs: 'AI převezme rutinní úkoly, aby se váš tým mohl věnovat hodnotnější práci.',
      en: 'AI handles routine tasks so your team can focus on higher-value work.'
    }
  },
  {
    objection: 'not_ready',
    response: {
      cs: 'Začít můžete s jedním pilotním projektem a postupně rozšiřovat podle výsledků.',
      en: 'Start with one pilot project and gradually expand based on results.'
    }
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get storytelling patterns for prompt injection
 */
export function getStorytellingPatternsForPrompt(language: 'cs' | 'en'): string {
  const patterns = STORYTELLING_PATTERNS.map(p =>
    `**${p.name[language]}:** ${p.pattern[language]}\n   Příklad: "${p.example[language]}"`
  ).join('\n\n');

  const openers = VARIETY_OPENERS[language].map((o, i) => `${i + 1}. "${o}"`).join('\n');

  if (language === 'cs') {
    return `
### ⚠️ KRITICKÉ: VARIUJ ZAČÁTKY POPISŮ!

**NIKDY nezačínej všechny popisy stejně!** Každé doporučení MUSÍ mít JINÝ začátek.

**DOSTUPNÉ OTEVÍRAČE (střídej je!):**
${openers}

❌ ZAKÁZÁNO: Všechny popisy začínající "Představte si..."
✅ POŽADOVÁNO: Každý popis začíná JINAK

### VZORY PRO PŘÍBĚHOVÉ POPISY

Každý popis AI příležitosti MUSÍ obsahovat těchto 5 částí:

${patterns}

DŮLEŽITÉ: Popis MUSÍ být minimálně 4-5 vět a MUSÍ používat konkrétní scénáře, ne obecné fráze!
`;
  } else {
    return `
### ⚠️ CRITICAL: VARY YOUR DESCRIPTION OPENERS!

**NEVER start all descriptions the same way!** Each recommendation MUST have a DIFFERENT opening.

**AVAILABLE OPENERS (rotate them!):**
${openers}

❌ FORBIDDEN: All descriptions starting with "Imagine..."
✅ REQUIRED: Each description starts DIFFERENTLY

### STORYTELLING PATTERNS

Each AI opportunity description MUST contain these 5 sentences in this order:

${patterns}

IMPORTANT: Description MUST be at least 4-5 sentences and MUST use specific scenarios, not generic phrases!
`;
  }
}

/**
 * Get benefit framing examples for prompt
 */
export function getBenefitFramesForPrompt(language: 'cs' | 'en'): string {
  const frames = BENEFIT_FRAMES.slice(0, 5).map(f =>
    `- ${f.frame[language]} (pro: ${f.useCase})`
  ).join('\n');

  if (language === 'cs') {
    return `
### VZORY PRO FORMULACI PŘÍNOSŮ

Používej tyto vzory pro popis přínosů:

${frames}
`;
  } else {
    return `
### BENEFIT FRAMING PATTERNS

Use these patterns to describe benefits:

${frames}
`;
  }
}

/**
 * Get intro template by business type
 */
export function getIntroTemplateForBusinessType(
  businessType: string,
  language: 'cs' | 'en'
): string {
  const template = INTRO_TEMPLATES.find(t => t.businessType === businessType)
    || INTRO_TEMPLATES.find(t => t.businessType === 'generic')!;

  return template.template[language];
}

/**
 * Get power words by category
 */
export function getPowerWords(category: string, language: 'cs' | 'en'): string[] {
  const powerCategory = POWER_WORDS.find(p => p.category === category);
  return powerCategory ? powerCategory.words[language] : [];
}

/**
 * Get all copywriting guidelines for prompt
 */
export function getCopywritingGuidelinesForPrompt(language: 'cs' | 'en'): string {
  const storytelling = getStorytellingPatternsForPrompt(language);
  const benefits = getBenefitFramesForPrompt(language);

  const powerWordsList = POWER_WORDS.map(p =>
    `- **${p.category}:** ${p.words[language].slice(0, 4).join(', ')}`
  ).join('\n');

  if (language === 'cs') {
    return `
## COPYWRITING GUIDELINES PRO PRODEJNÍ JAZYK

⚠️ **TYTO VZORY JSOU INSPIRACE, NE ŠABLONY K KOPÍROVÁNÍ!**
Použij je jako vodítko pro STRUKTURU a STYL, ale OBSAH vytvoř 100% originální podle:
1. Názvu firmy a odvětví z formuláře
2. Pain pointu (bolesti), kterou uživatel popsal
3. Skutečných faktů z výsledků vyhledávání

${storytelling}

${benefits}

### POWER WORDS (používej KREATIVNĚ a VARIABILNĚ)

${powerWordsList}

### ZAKÁZANÉ VZORY

❌ "AI může pomoci s..." - příliš vágní
❌ "Zvýšení efektivity" - bez konkrétních čísel
❌ Jednověté popisy
❌ Technický žargon bez vysvětlení hodnoty
❌ Obecné fráze bez zmínky o firmě
❌ Kopírování příkladů z promptu
❌ Opakování stejných frází v různých doporučeních
`;
  } else {
    return `
## COPYWRITING GUIDELINES FOR SALES LANGUAGE

⚠️ **THESE PATTERNS ARE INSPIRATION, NOT TEMPLATES TO COPY!**
Use them as guidance for STRUCTURE and STYLE, but create 100% ORIGINAL content based on:
1. Company name and industry from the form
2. Pain point the user described
3. Real facts from search results

${storytelling}

${benefits}

### POWER WORDS (use CREATIVELY and with VARIETY)

${powerWordsList}

### FORBIDDEN PATTERNS

❌ "AI can help with..." - too vague
❌ "Increased efficiency" - without specific numbers
❌ Single-sentence descriptions
❌ Technical jargon without explaining value
❌ Generic phrases without mentioning the company
❌ Copying examples from the prompt
❌ Repeating the same phrases across different recommendations
`;
  }
}
