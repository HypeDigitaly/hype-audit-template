// =============================================================================
// GLOSSARY - Czech Explanations for Technical Terms
// =============================================================================
// Centralized glossary for technical/English terms used in pre-audit reports.
// Provides human-readable Czech labels and tooltip explanations for CEOs.
// =============================================================================

export interface GlossaryEntry {
  /** Czech label to display (can include the original term in parentheses if needed) */
  label: string;
  /** Tooltip explanation for hover/help */
  tooltip: string;
}

export interface BilingualGlossaryEntry {
  cs: GlossaryEntry;
  en: GlossaryEntry;
}

// =============================================================================
// BENEFIT TYPE LABELS - Human-readable names for benefit types
// =============================================================================

export type BenefitTypeKey = 
  | 'time_savings'
  | 'lead_generation'
  | 'conversion_rate'
  | 'new_customers'
  | 'revenue_increase'
  | 'cost_reduction'
  | 'error_reduction'
  | 'customer_satisfaction'
  | 'response_time'
  | 'availability'
  // NEW: Community/Membership specific
  | 'member_acquisition'
  | 'churn_reduction'
  | 'member_engagement'
  | 'event_attendance'
  // NEW: E-commerce specific
  | 'products_sold'
  | 'cart_abandonment_reduction'
  // NEW: Education specific
  | 'student_acquisition'
  | 'course_completion';

export const BENEFIT_TYPE_LABELS: Record<BenefitTypeKey, BilingualGlossaryEntry> = {
  'time_savings': {
    cs: {
      label: 'Úspora času',
      tooltip: 'Hodiny práce, které AI ušetří Vašemu týmu každý týden'
    },
    en: {
      label: 'Time Savings',
      tooltip: 'Hours of work AI will save your team every week'
    }
  },
  'lead_generation': {
    cs: {
      label: 'Nové obchodní příležitosti',
      tooltip: 'Potenciální zákazníci, které AI pomůže získat a oslovit'
    },
    en: {
      label: 'New Business Opportunities',
      tooltip: 'Potential customers AI will help acquire and reach'
    }
  },
  'conversion_rate': {
    cs: {
      label: 'Více platících zákazníků',
      tooltip: 'Procento zájemců, kteří se stanou platícími zákazníky'
    },
    en: {
      label: 'More Paying Customers',
      tooltip: 'Percentage of prospects who become paying customers'
    }
  },
  'new_customers': {
    cs: {
      label: 'Noví zákazníci',
      tooltip: 'Počet nových zákazníků získaných díky AI automatizaci'
    },
    en: {
      label: 'New Customers',
      tooltip: 'Number of new customers acquired through AI automation'
    }
  },
  'revenue_increase': {
    cs: {
      label: 'Nárůst tržeb',
      tooltip: 'Očekávané zvýšení příjmů díky efektivnějším procesům'
    },
    en: {
      label: 'Revenue Increase',
      tooltip: 'Expected revenue increase from more efficient processes'
    }
  },
  'cost_reduction': {
    cs: {
      label: 'Snížení nákladů',
      tooltip: 'Úspora na provozních nákladech díky automatizaci'
    },
    en: {
      label: 'Cost Reduction',
      tooltip: 'Operational cost savings through automation'
    }
  },
  'error_reduction': {
    cs: {
      label: 'Méně chyb',
      tooltip: 'Snížení lidských chyb díky automatizaci rutinních úkolů'
    },
    en: {
      label: 'Fewer Errors',
      tooltip: 'Reduction in human errors through automation of routine tasks'
    }
  },
  'customer_satisfaction': {
    cs: {
      label: 'Spokojenější zákazníci',
      tooltip: 'Měřeno rychlostí reakce a kvalitou zákaznické podpory'
    },
    en: {
      label: 'Happier Customers',
      tooltip: 'Measured by response time and customer support quality'
    }
  },
  'response_time': {
    cs: {
      label: 'Rychlejší reakce',
      tooltip: 'Zkrácení doby odezvy na dotazy zákazníků'
    },
    en: {
      label: 'Faster Response',
      tooltip: 'Reduced response time to customer inquiries'
    }
  },
  'availability': {
    cs: {
      label: 'Nepřetržitá dostupnost',
      tooltip: 'Služby dostupné 24 hodin denně, 7 dní v týdnu'
    },
    en: {
      label: 'Always Available',
      tooltip: 'Services available 24 hours a day, 7 days a week'
    }
  },
  // NEW: Community/Membership specific benefit types
  'member_acquisition': {
    cs: {
      label: 'Noví členové',
      tooltip: 'Počet nových členů získaných díky AI automatizaci a marketingu'
    },
    en: {
      label: 'New Members',
      tooltip: 'Number of new members acquired through AI automation and marketing'
    }
  },
  'churn_reduction': {
    cs: {
      label: 'Snížení odchodu členů',
      tooltip: 'Procentuální snížení členů, kteří ukončí členství'
    },
    en: {
      label: 'Reduced Member Churn',
      tooltip: 'Percentage reduction in members who cancel their membership'
    }
  },
  'member_engagement': {
    cs: {
      label: 'Zapojení členů',
      tooltip: 'Zvýšení aktivity a interakce členů s komunitou'
    },
    en: {
      label: 'Member Engagement',
      tooltip: 'Increased member activity and interaction with the community'
    }
  },
  'event_attendance': {
    cs: {
      label: 'Účast na akcích',
      tooltip: 'Zvýšení účasti členů na akcích a setkáních'
    },
    en: {
      label: 'Event Attendance',
      tooltip: 'Increased member attendance at events and meetings'
    }
  },
  // NEW: E-commerce specific benefit types
  'products_sold': {
    cs: {
      label: 'Prodané produkty',
      tooltip: 'Nárůst počtu prodaných produktů díky AI personalizaci'
    },
    en: {
      label: 'Products Sold',
      tooltip: 'Increase in products sold through AI personalization'
    }
  },
  'cart_abandonment_reduction': {
    cs: {
      label: 'Méně opuštěných košíků',
      tooltip: 'Snížení počtu zákazníků, kteří opustí nákupní košík'
    },
    en: {
      label: 'Reduced Cart Abandonment',
      tooltip: 'Reduction in customers who abandon their shopping cart'
    }
  },
  // NEW: Education specific benefit types
  'student_acquisition': {
    cs: {
      label: 'Noví studenti',
      tooltip: 'Počet nových studentů získaných díky AI marketingu'
    },
    en: {
      label: 'New Students',
      tooltip: 'Number of new students acquired through AI marketing'
    }
  },
  'course_completion': {
    cs: {
      label: 'Dokončení kurzů',
      tooltip: 'Zvýšení procenta studentů, kteří dokončí kurz'
    },
    en: {
      label: 'Course Completion',
      tooltip: 'Increased percentage of students completing courses'
    }
  }
};

// =============================================================================
// QUADRANT LABELS - Priority matrix categories
// =============================================================================

export type QuadrantKey = 'quick_win' | 'big_swing' | 'nice_to_have' | 'deprioritize';

export const QUADRANT_LABELS: Record<QuadrantKey, BilingualGlossaryEntry> = {
  'quick_win': {
    cs: {
      label: 'Řešit hned',
      tooltip: 'Vysoký přínos, snadná implementace - ideální start'
    },
    en: {
      label: 'Quick Win',
      tooltip: 'High impact, easy implementation - ideal starting point'
    }
  },
  'big_swing': {
    cs: {
      label: 'Strategické projekty',
      tooltip: 'Vysoký přínos, vyžaduje více času a zdrojů'
    },
    en: {
      label: 'Strategic Projects',
      tooltip: 'High impact, requires more time and resources'
    }
  },
  'nice_to_have': {
    cs: {
      label: 'Doplňkové možnosti',
      tooltip: 'Nižší přínos, ale snadné na implementaci - když bude čas'
    },
    en: {
      label: 'Nice to Have',
      tooltip: 'Lower impact but easy to implement - when time allows'
    }
  },
  'deprioritize': {
    cs: {
      label: 'Odložit',
      tooltip: 'Nižší přínos a vysoká náročnost - prozatím vynechat'
    },
    en: {
      label: 'Deprioritize',
      tooltip: 'Lower impact and high effort - skip for now'
    }
  }
};

// =============================================================================
// TECHNICAL TERMS GLOSSARY - General IT/business jargon
// =============================================================================

export const TECHNICAL_TERMS: Record<string, BilingualGlossaryEntry> = {
  'NPS': {
    cs: {
      label: 'spokojenost zákazníků',
      tooltip: 'Net Promoter Score - měřítko loajality zákazníků na škále 0-10'
    },
    en: {
      label: 'customer satisfaction',
      tooltip: 'Net Promoter Score - customer loyalty metric on a scale of 0-10'
    }
  },
  'ROI': {
    cs: {
      label: 'návratnost investice',
      tooltip: 'Poměr mezi přínosem a náklady - kolik vyděláte oproti tomu, co investujete'
    },
    en: {
      label: 'return on investment',
      tooltip: 'Ratio between benefit and cost - how much you earn vs. what you invest'
    }
  },
  'CRM': {
    cs: {
      label: 'systém pro správu zákazníků',
      tooltip: 'Software pro evidenci kontaktů, obchodních případů a komunikace se zákazníky'
    },
    en: {
      label: 'customer management system',
      tooltip: 'Software for managing contacts, deals, and customer communications'
    }
  },
  'ERP': {
    cs: {
      label: 'podnikový informační systém',
      tooltip: 'Centrální systém pro řízení firmy - účetnictví, sklad, objednávky, výroba'
    },
    en: {
      label: 'enterprise resource planning',
      tooltip: 'Central system for managing business - accounting, inventory, orders, production'
    }
  },
  'API': {
    cs: {
      label: 'propojení systémů',
      tooltip: 'Technické rozhraní, které umožňuje různým programům spolupracovat'
    },
    en: {
      label: 'system integration',
      tooltip: 'Technical interface that allows different programs to work together'
    }
  },
  'chatbot': {
    cs: {
      label: 'AI asistent',
      tooltip: 'Automatický textový pomocník, který odpovídá na dotazy zákazníků'
    },
    en: {
      label: 'AI assistant',
      tooltip: 'Automated text helper that answers customer questions'
    }
  },
  'voicebot': {
    cs: {
      label: 'hlasový AI asistent',
      tooltip: 'Automatický telefonní pomocník, který mluví jako člověk'
    },
    en: {
      label: 'voice AI assistant',
      tooltip: 'Automated phone helper that speaks like a human'
    }
  },
  'automation': {
    cs: {
      label: 'automatizace',
      tooltip: 'Nahrazení opakujících se manuálních činností počítačem'
    },
    en: {
      label: 'automation',
      tooltip: 'Replacing repetitive manual tasks with computer processes'
    }
  },
  'workflow': {
    cs: {
      label: 'pracovní postup',
      tooltip: 'Sled kroků, které vedou k dokončení úkolu'
    },
    en: {
      label: 'workflow',
      tooltip: 'Sequence of steps that lead to task completion'
    }
  },
  'dashboard': {
    cs: {
      label: 'přehled',
      tooltip: 'Vizuální zobrazení důležitých čísel a grafů na jednom místě'
    },
    en: {
      label: 'dashboard',
      tooltip: 'Visual display of important numbers and charts in one place'
    }
  },
  'AI': {
    cs: {
      label: 'umělá inteligence',
      tooltip: 'Počítačový systém, který se učí a rozhoduje podobně jako člověk'
    },
    en: {
      label: 'artificial intelligence',
      tooltip: 'Computer system that learns and makes decisions similar to humans'
    }
  },
  'ML': {
    cs: {
      label: 'strojové učení',
      tooltip: 'Způsob, jakým se počítač učí z dat a zlepšuje své výsledky'
    },
    en: {
      label: 'machine learning',
      tooltip: 'Method by which computers learn from data and improve their results'
    }
  },
  'GenAI': {
    cs: {
      label: 'generativní AI',
      tooltip: 'AI, která umí tvořit texty, obrázky nebo kód - jako ChatGPT'
    },
    en: {
      label: 'generative AI',
      tooltip: 'AI that can create text, images, or code - like ChatGPT'
    }
  }
};

// =============================================================================
// IMPLEMENTATION TYPE LABELS - For app integration opportunities
// =============================================================================

export type ImplementationTypeKey = 
  | 'api_integration'
  | 'widget'
  | 'standalone_module'
  | 'voice_interface'
  | 'chatbot_embed';

export const IMPLEMENTATION_TYPE_LABELS: Record<ImplementationTypeKey, BilingualGlossaryEntry> = {
  'api_integration': {
    cs: {
      label: 'Napojení na stávající systém',
      tooltip: 'AI se propojí s Vaším současným softwarem'
    },
    en: {
      label: 'System Integration',
      tooltip: 'AI connects with your existing software'
    }
  },
  'widget': {
    cs: {
      label: 'Widgět na web',
      tooltip: 'Malý prvek, který se přidá na Vaše webové stránky'
    },
    en: {
      label: 'Website Widget',
      tooltip: 'Small element added to your website'
    }
  },
  'standalone_module': {
    cs: {
      label: 'Samostatný modul',
      tooltip: 'Nová aplikace, která funguje nezávisle'
    },
    en: {
      label: 'Standalone Module',
      tooltip: 'New application that works independently'
    }
  },
  'voice_interface': {
    cs: {
      label: 'Hlasové ovládání',
      tooltip: 'Možnost ovládat systém pomocí hlasu'
    },
    en: {
      label: 'Voice Interface',
      tooltip: 'Ability to control the system using voice'
    }
  },
  'chatbot_embed': {
    cs: {
      label: 'AI chat na webu',
      tooltip: 'Chatovací okénko s AI asistentem na Vašich stránkách'
    },
    en: {
      label: 'Embedded AI Chat',
      tooltip: 'Chat window with AI assistant on your website'
    }
  }
};

// =============================================================================
// TECHNOLOGY CATEGORY LABELS
// =============================================================================

export type TechCategoryKey = 
  | 'cms'
  | 'ecommerce'
  | 'crm'
  | 'erp'
  | 'custom_app'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'other';

export const TECH_CATEGORY_LABELS: Record<TechCategoryKey, BilingualGlossaryEntry> = {
  'cms': {
    cs: {
      label: 'Správa webu',
      tooltip: 'Systém pro správu obsahu webových stránek'
    },
    en: {
      label: 'Content Management',
      tooltip: 'System for managing website content'
    }
  },
  'ecommerce': {
    cs: {
      label: 'E-shop',
      tooltip: 'Platforma pro online prodej'
    },
    en: {
      label: 'E-commerce',
      tooltip: 'Online selling platform'
    }
  },
  'crm': {
    cs: {
      label: 'Správa zákazníků',
      tooltip: 'Systém pro evidenci a komunikaci se zákazníky'
    },
    en: {
      label: 'Customer Management',
      tooltip: 'System for tracking and communicating with customers'
    }
  },
  'erp': {
    cs: {
      label: 'Podnikový systém',
      tooltip: 'Centrální systém pro řízení firmy'
    },
    en: {
      label: 'Enterprise System',
      tooltip: 'Central system for managing the company'
    }
  },
  'custom_app': {
    cs: {
      label: 'Vlastní aplikace',
      tooltip: 'Software vytvořený na míru pro Vaši firmu'
    },
    en: {
      label: 'Custom Application',
      tooltip: 'Software built specifically for your company'
    }
  },
  'framework': {
    cs: {
      label: 'Vývojový nástroj',
      tooltip: 'Technologie pro tvorbu softwaru'
    },
    en: {
      label: 'Development Framework',
      tooltip: 'Technology for building software'
    }
  },
  'database': {
    cs: {
      label: 'Databáze',
      tooltip: 'Systém pro ukládání a správu dat'
    },
    en: {
      label: 'Database',
      tooltip: 'System for storing and managing data'
    }
  },
  'cloud': {
    cs: {
      label: 'Cloudové služby',
      tooltip: 'Služby běžící na vzdálených serverech přes internet'
    },
    en: {
      label: 'Cloud Services',
      tooltip: 'Services running on remote servers via internet'
    }
  },
  'other': {
    cs: {
      label: 'Ostatní',
      tooltip: 'Další používané technologie'
    },
    en: {
      label: 'Other',
      tooltip: 'Other technologies used'
    }
  }
};

// =============================================================================
// RISK CATEGORY LABELS
// =============================================================================

export type RiskCategoryKey = 
  | 'data_privacy'
  | 'employee_adoption'
  | 'technical'
  | 'regulatory'
  | 'financial';

export const RISK_CATEGORY_LABELS: Record<RiskCategoryKey, BilingualGlossaryEntry> = {
  'data_privacy': {
    cs: {
      label: 'Ochrana dat',
      tooltip: 'Rizika spojená s bezpečností firemních a zákaznických dat'
    },
    en: {
      label: 'Data Privacy',
      tooltip: 'Risks related to company and customer data security'
    }
  },
  'employee_adoption': {
    cs: {
      label: 'Přijetí zaměstnanci',
      tooltip: 'Riziko, že zaměstnanci nebudou chtít nové nástroje používat'
    },
    en: {
      label: 'Employee Adoption',
      tooltip: 'Risk that employees won\'t want to use new tools'
    }
  },
  'technical': {
    cs: {
      label: 'Technická rizika',
      tooltip: 'Problémy s implementací, kompatibilitou nebo spolehlivostí'
    },
    en: {
      label: 'Technical Risks',
      tooltip: 'Issues with implementation, compatibility, or reliability'
    }
  },
  'regulatory': {
    cs: {
      label: 'Regulatorní požadavky',
      tooltip: 'Nutnost dodržovat zákony a předpisy (GDPR, AI Act)'
    },
    en: {
      label: 'Regulatory Requirements',
      tooltip: 'Need to comply with laws and regulations (GDPR, AI Act)'
    }
  },
  'financial': {
    cs: {
      label: 'Finanční rizika',
      tooltip: 'Riziko, že se investice nevrátí v očekávané míře'
    },
    en: {
      label: 'Financial Risks',
      tooltip: 'Risk that investment won\'t return as expected'
    }
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get enhanced label for a benefit type
 */
export function getBenefitLabel(type: BenefitTypeKey, lang: 'cs' | 'en'): GlossaryEntry {
  return BENEFIT_TYPE_LABELS[type]?.[lang] || { label: type, tooltip: '' };
}

/**
 * Get enhanced label for a quadrant
 */
export function getQuadrantLabel(quadrant: QuadrantKey, lang: 'cs' | 'en'): GlossaryEntry {
  return QUADRANT_LABELS[quadrant]?.[lang] || { label: quadrant, tooltip: '' };
}

/**
 * Get enhanced label for an implementation type
 */
export function getImplementationTypeLabel(type: ImplementationTypeKey, lang: 'cs' | 'en'): GlossaryEntry {
  return IMPLEMENTATION_TYPE_LABELS[type]?.[lang] || { label: type, tooltip: '' };
}

/**
 * Get enhanced label for a technology category
 */
export function getTechCategoryLabel(category: TechCategoryKey, lang: 'cs' | 'en'): GlossaryEntry {
  return TECH_CATEGORY_LABELS[category]?.[lang] || { label: category, tooltip: '' };
}

/**
 * Get enhanced label for a risk category
 */
export function getRiskCategoryLabel(category: RiskCategoryKey, lang: 'cs' | 'en'): GlossaryEntry {
  return RISK_CATEGORY_LABELS[category]?.[lang] || { label: category, tooltip: '' };
}

/**
 * Get explanation for a technical term
 */
export function getTechnicalTermExplanation(term: string, lang: 'cs' | 'en'): GlossaryEntry | null {
  const upperTerm = term.toUpperCase();
  const lowerTerm = term.toLowerCase();
  
  // Try exact match first
  if (TECHNICAL_TERMS[term]) {
    return TECHNICAL_TERMS[term][lang];
  }
  
  // Try uppercase
  if (TECHNICAL_TERMS[upperTerm]) {
    return TECHNICAL_TERMS[upperTerm][lang];
  }
  
  // Try lowercase
  if (TECHNICAL_TERMS[lowerTerm]) {
    return TECHNICAL_TERMS[lowerTerm][lang];
  }
  
  return null;
}

/**
 * Wrap a technical term with tooltip HTML
 */
export function wrapWithTooltip(text: string, tooltip: string): string {
  return `<span class="tooltip-term" data-tooltip="${escapeHtml(tooltip)}">${text}</span>`;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =============================================================================
// BUSINESS TYPE DETECTION & PRIMARY METRICS MAPPING
// =============================================================================

/**
 * Business types that the system can detect
 */
export type BusinessType = 
  | 'community_membership'    // Komunita, klub, spolek, membership
  | 'ecommerce'               // E-shop, online obchod
  | 'software_it'             // IT firma, software development
  | 'marketing_agency'        // Marketingová agentura
  | 'service_business'        // Služby (fitko, salon, autoservis, klinika)
  | 'manufacturing'           // Výroba, průmysl
  | 'education'               // Vzdělávání, kurzy, školy
  | 'healthcare'              // Zdravotnictví
  | 'finance'                 // Finance, účetnictví, pojišťovnictví
  | 'consulting'              // Poradenství, konzultace
  | 'real_estate'             // Reality, stavebnictví
  | 'logistics'               // Logistika, doprava
  | 'hospitality'             // Restaurace, hotely, kavárny
  | 'generic';                // Obecný/nezařazený

/**
 * Keywords that help detect business type from industry string
 */
export const BUSINESS_TYPE_KEYWORDS: Record<BusinessType, string[]> = {
  'community_membership': [
    'komunita', 'community', 'klub', 'club', 'spolek', 'association', 
    'membership', 'členství', 'network', 'síť', 'growth club', 'mastermind',
    'networking', 'members', 'členové'
  ],
  'ecommerce': [
    'e-commerce', 'ecommerce', 'e-shop', 'eshop', 'online obchod', 'online store',
    'retail', 'maloobchod', 'velkoobchod', 'wholesale', 'prodej', 'sales'
  ],
  'software_it': [
    'software', 'it ', 'development', 'vývoj', 'technologie', 'technology',
    'saas', 'aplikace', 'app', 'programování', 'coding', 'digital'
  ],
  'marketing_agency': [
    'marketing', 'agentura', 'agency', 'reklama', 'advertising', 'media',
    'digitální agentura', 'digital agency', 'pr ', 'kreativní', 'creative'
  ],
  'service_business': [
    'fitness', 'gym', 'posilovna', 'salon', 'kadeřnictví', 'beauty', 'wellness',
    'autoservis', 'auto repair', 'servis', 'služby', 'services', 'coworking'
  ],
  'manufacturing': [
    'výroba', 'manufacturing', 'průmysl', 'industry', 'factory', 'továrna',
    'produkce', 'production'
  ],
  'education': [
    'vzdělávání', 'education', 'škola', 'school', 'kurzy', 'courses',
    'training', 'školení', 'akademie', 'academy', 'učení', 'learning'
  ],
  'healthcare': [
    'zdravotnictví', 'healthcare', 'klinika', 'clinic', 'ordinace', 'medical',
    'lékař', 'doctor', 'nemocnice', 'hospital', 'zubní', 'dental'
  ],
  'finance': [
    'finance', 'účetnictví', 'accounting', 'pojišťovna', 'insurance',
    'banka', 'bank', 'investice', 'investment', 'finanční', 'financial'
  ],
  'consulting': [
    'poradenství', 'consulting', 'konzultace', 'advisory', 'b2b',
    'business services', 'profesionální služby'
  ],
  'real_estate': [
    'reality', 'real estate', 'stavebnictví', 'construction', 'nemovitosti',
    'property', 'development', 'developer'
  ],
  'logistics': [
    'logistika', 'logistics', 'doprava', 'transport', 'skladování', 'warehouse',
    'spedice', 'shipping', 'delivery', 'doručování'
  ],
  'hospitality': [
    'restaurace', 'restaurant', 'hotel', 'kavárna', 'café', 'coffee',
    'horeca', 'catering', 'pohostinství', 'hospitality', 'bar'
  ],
  'generic': []
};

/**
 * Primary metrics configuration for each business type
 * Ordered by importance - first metric is THE most important for that business
 */
export interface BusinessTypeMetricsConfig {
  primaryMetrics: BenefitTypeKey[];
  secondaryMetrics: BenefitTypeKey[];
  headline: { cs: string; en: string };
  valueProposition: { cs: string; en: string };
}

export const BUSINESS_TYPE_METRICS: Record<BusinessType, BusinessTypeMetricsConfig> = {
  'community_membership': {
    primaryMetrics: ['member_acquisition', 'churn_reduction', 'member_engagement', 'event_attendance'],
    secondaryMetrics: ['time_savings', 'customer_satisfaction', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši komunitu',
      en: 'Expected benefits for your community'
    },
    valueProposition: {
      cs: 'AI vám pomůže získat více členů, snížit jejich odchod a zvýšit zapojení celé komunity.',
      en: 'AI will help you acquire more members, reduce churn, and increase engagement across your community.'
    }
  },
  'ecommerce': {
    primaryMetrics: ['revenue_increase', 'conversion_rate', 'products_sold', 'new_customers'],
    secondaryMetrics: ['cart_abandonment_reduction', 'customer_satisfaction', 'time_savings'],
    headline: {
      cs: 'Očekávané přínosy pro váš e-shop',
      en: 'Expected benefits for your e-commerce'
    },
    valueProposition: {
      cs: 'AI zvýší vaše tržby díky personalizaci, lepší konverzi a automatizované zákaznické podpoře.',
      en: 'AI will increase your revenue through personalization, better conversion, and automated customer support.'
    }
  },
  'software_it': {
    primaryMetrics: ['time_savings', 'cost_reduction', 'error_reduction', 'response_time'],
    secondaryMetrics: ['revenue_increase', 'customer_satisfaction', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši IT firmu',
      en: 'Expected benefits for your IT company'
    },
    valueProposition: {
      cs: 'AI zrychlí vývoj, sníží náklady a automatizuje opakující se úkoly vašeho týmu.',
      en: 'AI will accelerate development, reduce costs, and automate repetitive tasks for your team.'
    }
  },
  'marketing_agency': {
    primaryMetrics: ['lead_generation', 'new_customers', 'conversion_rate', 'time_savings'],
    secondaryMetrics: ['revenue_increase', 'customer_satisfaction', 'response_time'],
    headline: {
      cs: 'Očekávané přínosy pro vaši agenturu',
      en: 'Expected benefits for your agency'
    },
    valueProposition: {
      cs: 'AI vám přinese více klientů, automatizuje tvorbu obsahu a zefektivní vaše kampaně.',
      en: 'AI will bring you more clients, automate content creation, and optimize your campaigns.'
    }
  },
  'service_business': {
    primaryMetrics: ['new_customers', 'customer_satisfaction', 'time_savings', 'availability'],
    secondaryMetrics: ['revenue_increase', 'response_time', 'error_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaše služby',
      en: 'Expected benefits for your services'
    },
    valueProposition: {
      cs: 'AI automatizuje rezervace, zlepší zákaznickou zkušenost a přinese vám více klientů.',
      en: 'AI will automate bookings, improve customer experience, and bring you more clients.'
    }
  },
  'manufacturing': {
    primaryMetrics: ['cost_reduction', 'error_reduction', 'time_savings', 'revenue_increase'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši výrobu',
      en: 'Expected benefits for your manufacturing'
    },
    valueProposition: {
      cs: 'AI sníží náklady, minimalizuje chyby a optimalizuje výrobní procesy.',
      en: 'AI will reduce costs, minimize errors, and optimize production processes.'
    }
  },
  'education': {
    primaryMetrics: ['student_acquisition', 'course_completion', 'customer_satisfaction', 'time_savings'],
    secondaryMetrics: ['revenue_increase', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaše vzdělávání',
      en: 'Expected benefits for your education business'
    },
    valueProposition: {
      cs: 'AI přiláká více studentů, zvýší dokončení kurzů a personalizuje vzdělávací zážitek.',
      en: 'AI will attract more students, increase course completion, and personalize the learning experience.'
    }
  },
  'healthcare': {
    primaryMetrics: ['time_savings', 'customer_satisfaction', 'response_time', 'error_reduction'],
    secondaryMetrics: ['new_customers', 'availability', 'cost_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaše zdravotnické zařízení',
      en: 'Expected benefits for your healthcare facility'
    },
    valueProposition: {
      cs: 'AI zrychlí administrativu, zlepší péči o pacienty a sníží čekací doby.',
      en: 'AI will speed up administration, improve patient care, and reduce wait times.'
    }
  },
  'finance': {
    primaryMetrics: ['time_savings', 'error_reduction', 'cost_reduction', 'customer_satisfaction'],
    secondaryMetrics: ['response_time', 'availability', 'new_customers'],
    headline: {
      cs: 'Očekávané přínosy pro vaše finanční služby',
      en: 'Expected benefits for your financial services'
    },
    valueProposition: {
      cs: 'AI automatizuje zpracování dokumentů, sníží chybovost a zrychlí vyřizování požadavků.',
      en: 'AI will automate document processing, reduce errors, and speed up request handling.'
    }
  },
  'consulting': {
    primaryMetrics: ['lead_generation', 'time_savings', 'new_customers', 'revenue_increase'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaše poradenství',
      en: 'Expected benefits for your consulting'
    },
    valueProposition: {
      cs: 'AI vám pomůže získat více klientů, automatizovat analýzy a ušetřit čas na administrativě.',
      en: 'AI will help you acquire more clients, automate analyses, and save time on administration.'
    }
  },
  'real_estate': {
    primaryMetrics: ['lead_generation', 'new_customers', 'time_savings', 'conversion_rate'],
    secondaryMetrics: ['customer_satisfaction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši realitní činnost',
      en: 'Expected benefits for your real estate business'
    },
    valueProposition: {
      cs: 'AI automatizuje oslovování klientů, zrychlí párování nemovitostí a zlepší komunikaci.',
      en: 'AI will automate client outreach, speed up property matching, and improve communication.'
    }
  },
  'logistics': {
    primaryMetrics: ['cost_reduction', 'time_savings', 'error_reduction', 'customer_satisfaction'],
    secondaryMetrics: ['response_time', 'availability', 'revenue_increase'],
    headline: {
      cs: 'Očekávané přínosy pro vaši logistiku',
      en: 'Expected benefits for your logistics'
    },
    valueProposition: {
      cs: 'AI optimalizuje trasy, sníží náklady a automatizuje sledování zásilek.',
      en: 'AI will optimize routes, reduce costs, and automate shipment tracking.'
    }
  },
  'hospitality': {
    primaryMetrics: ['new_customers', 'customer_satisfaction', 'revenue_increase', 'time_savings'],
    secondaryMetrics: ['response_time', 'availability', 'error_reduction'],
    headline: {
      cs: 'Očekávané přínosy pro vaši provozovnu',
      en: 'Expected benefits for your establishment'
    },
    valueProposition: {
      cs: 'AI přiláká více hostů, zlepší jejich zážitek a automatizuje rezervace.',
      en: 'AI will attract more guests, improve their experience, and automate reservations.'
    }
  },
  'generic': {
    primaryMetrics: ['time_savings', 'revenue_increase', 'cost_reduction', 'new_customers'],
    secondaryMetrics: ['customer_satisfaction', 'error_reduction', 'response_time', 'availability'],
    headline: {
      cs: 'Očekávané přínosy pro vaši firmu',
      en: 'Expected benefits for your company'
    },
    valueProposition: {
      cs: 'AI ušetří čas, zvýší efektivitu a pomůže vám růst rychleji.',
      en: 'AI will save time, increase efficiency, and help you grow faster.'
    }
  }
};

/**
 * Detect business type from industry string
 */
export function detectBusinessType(industry: string | undefined): BusinessType {
  if (!industry) return 'generic';
  
  const lowerIndustry = industry.toLowerCase();
  
  // Check each business type's keywords
  for (const [businessType, keywords] of Object.entries(BUSINESS_TYPE_KEYWORDS)) {
    if (businessType === 'generic') continue;
    
    for (const keyword of keywords) {
      if (lowerIndustry.includes(keyword.toLowerCase())) {
        return businessType as BusinessType;
      }
    }
  }
  
  return 'generic';
}

/**
 * Get metrics configuration for a business type
 */
export function getBusinessTypeMetrics(businessType: BusinessType): BusinessTypeMetricsConfig {
  return BUSINESS_TYPE_METRICS[businessType] || BUSINESS_TYPE_METRICS['generic'];
}

/**
 * Get primary metrics for a detected industry
 */
export function getPrimaryMetricsForIndustry(industry: string | undefined): BenefitTypeKey[] {
  const businessType = detectBusinessType(industry);
  return BUSINESS_TYPE_METRICS[businessType]?.primaryMetrics || BUSINESS_TYPE_METRICS['generic'].primaryMetrics;
}
