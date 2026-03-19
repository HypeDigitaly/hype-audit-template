// =============================================================================
// QUADRANT LABELS - Priority matrix category labels
// =============================================================================

import type { QuadrantKey, BilingualGlossaryEntry } from './types';

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
