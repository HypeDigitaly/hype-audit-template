// =============================================================================
// TECHNICAL TERMS - General IT/business jargon explanations
// =============================================================================

import type { BilingualGlossaryEntry } from './types';

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
