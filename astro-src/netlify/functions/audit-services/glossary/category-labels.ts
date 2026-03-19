// =============================================================================
// CATEGORY LABELS - Implementation, Tech, and Risk category labels
// =============================================================================

import type {
  ImplementationTypeKey,
  TechCategoryKey,
  RiskCategoryKey,
  BilingualGlossaryEntry
} from './types';

// =============================================================================
// IMPLEMENTATION TYPE LABELS - For app integration opportunities
// =============================================================================

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
