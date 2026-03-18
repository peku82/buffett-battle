// Progressive difficulty system
// As players level up, rounds become more complex

export interface DifficultyModifiers {
  level: number;
  timerMultiplier: number;       // Lower = less time
  showHints: boolean;            // Show moat hints, financial guidance
  companyComplexity: 'basic' | 'intermediate' | 'advanced';
  extraMetrics: boolean;         // Show ROE, Free Cash Flow, etc.
  curveBalls: boolean;           // Add misleading data, trap companies
  advancedValuation: boolean;    // Use more complex DCF
  marketEvents: boolean;         // Add market-wide events
  hiddenInfo: boolean;           // Some info is hidden until "researched"
  bonusRounds: string[];         // Additional round types unlocked
}

export function getDifficultyForLevel(level: number): DifficultyModifiers {
  if (level <= 2) {
    // Beginner: lots of help, simple companies, generous timers
    return {
      level,
      timerMultiplier: 1.5,      // 50% more time
      showHints: true,
      companyComplexity: 'basic',
      extraMetrics: false,
      curveBalls: false,
      advancedValuation: false,
      marketEvents: false,
      hiddenInfo: false,
      bonusRounds: []
    };
  }

  if (level <= 5) {
    // Intermediate: standard play, some extra metrics
    return {
      level,
      timerMultiplier: 1.0,
      showHints: true,
      companyComplexity: 'intermediate',
      extraMetrics: true,          // Show ROE, FCF
      curveBalls: false,
      advancedValuation: false,
      marketEvents: false,
      hiddenInfo: false,
      bonusRounds: ['deuda']       // New round about debt analysis
    };
  }

  if (level <= 8) {
    // Advanced: tighter timers, curve balls, hidden info
    return {
      level,
      timerMultiplier: 0.8,       // 20% less time
      showHints: false,            // No more hand-holding
      companyComplexity: 'advanced',
      extraMetrics: true,
      curveBalls: true,            // Trap companies that look good but aren't
      advancedValuation: true,     // Multi-year DCF with discount rates
      marketEvents: true,          // Interest rate changes, recessions
      hiddenInfo: true,            // Must spend "research tokens" to see data
      bonusRounds: ['deuda', 'management', 'macro']
    };
  }

  // Expert: everything unlocked, minimal help
  return {
    level,
    timerMultiplier: 0.6,         // 40% less time
    showHints: false,
    companyComplexity: 'advanced',
    extraMetrics: true,
    curveBalls: true,
    advancedValuation: true,
    marketEvents: true,
    hiddenInfo: true,
    bonusRounds: ['deuda', 'management', 'macro', 'sector', 'psychology']
  };
}

// Bonus round descriptions for higher levels
export const BONUS_ROUNDS = {
  deuda: {
    title: 'Análisis de Deuda',
    icon: '💳',
    description: 'Analiza la estructura de deuda de empresas. ¿Cuánta deuda es demasiada?',
    buckIntro: 'La deuda es como jugar con fuego. Usada bien, calienta. Usada mal, quema todo.',
    minLevel: 3
  },
  management: {
    title: 'Calidad de la Gerencia',
    icon: '👔',
    description: 'Evalúa a los CEOs. ¿Son honestos? ¿Gastan sabiamente?',
    buckIntro: 'No importa qué tan bueno sea el negocio si lo maneja un payaso. Evalúa al CEO.',
    minLevel: 5
  },
  macro: {
    title: 'Eventos del Mercado',
    icon: '🌍',
    description: 'Tasas de interés, inflación, recesiones. ¿Cómo afectan a tu portafolio?',
    buckIntro: 'El mundo cambia. Tasas suben, recesiones llegan. Los buenos inversores se preparan.',
    minLevel: 6
  },
  sector: {
    title: 'Análisis por Sector',
    icon: '🏭',
    description: 'Compara empresas dentro del mismo sector. ¿Cuál domina?',
    buckIntro: 'En cada industria hay un rey y varios pretendientes. Encuentra al rey.',
    minLevel: 8
  },
  psychology: {
    title: 'Psicología del Inversor',
    icon: '🧠',
    description: 'Resiste la presión del mercado. No sigas a la manada.',
    buckIntro: 'El mayor enemigo del inversor es él mismo. Miedo y codicia destruyen fortunas.',
    minLevel: 9
  }
};

// XP thresholds for leveling
export function xpForLevel(level: number): number {
  return (level - 1) * 500;
}

export function xpToNextLevel(currentXp: number, currentLevel: number): { current: number; needed: number; percent: number } {
  const thisLevelXp = xpForLevel(currentLevel);
  const nextLevelXp = xpForLevel(currentLevel + 1);
  const needed = nextLevelXp - thisLevelXp;
  const current = currentXp - thisLevelXp;
  return {
    current,
    needed,
    percent: Math.min(100, (current / needed) * 100)
  };
}

// Generate curve ball companies for advanced levels
export function generateCurveBallCompany(): {
  name: string;
  description: string;
  trap: string;
  looksSafe: boolean;
} {
  const traps = [
    {
      name: 'GlowUp Cosmetics',
      description: 'Marca de maquillaje viral en TikTok. Creció 200% este año. Todas las influencers la usan.',
      trap: 'Trend temporal. Sin foso real. Las marcas virales desaparecen tan rápido como aparecen.',
      looksSafe: true // Looks great but is a trap
    },
    {
      name: 'OldGuard Steel',
      description: 'Empresa de acero aburrida con 60 años de historia. Crece solo 2% al año. Nadie habla de ella.',
      trap: 'Es la MEJOR opción. Negocio estable, sin deuda, dividendos constantes. Boring pero rentable.',
      looksSafe: false // Looks boring but is great
    },
    {
      name: 'MoonShot AI',
      description: 'Startup de inteligencia artificial. Todos dicen que es el futuro. Aún no gana dinero.',
      trap: 'Hype sin sustancia. Buffett nunca compraría algo que no genera ganancias reales.',
      looksSafe: true
    },
    {
      name: 'BrickHouse REIT',
      description: 'Dueña de 200 edificios de oficinas. Paga 8% de dividendo. Suena increíble.',
      trap: 'El trabajo remoto está vaciando oficinas. El dividendo no es sostenible si los inquilinos se van.',
      looksSafe: true
    }
  ];

  return traps[Math.floor(Math.random() * traps.length)];
}
