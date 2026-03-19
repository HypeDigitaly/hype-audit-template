// =============================================================================
// BENEFIT TYPE LABELS - Human-readable names for benefit types
// =============================================================================

import type { BenefitTypeKey, BilingualGlossaryEntry } from './types';

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
  // Community/Membership specific benefit types
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
  // E-commerce specific benefit types
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
  // Education specific benefit types
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
