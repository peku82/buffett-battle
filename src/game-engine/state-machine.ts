import { Company, getCompaniesForRound, getRandomEvent, GameEvent } from './companies';

export type GamePhase = 'lobby' | 'tutorial' | 'playing' | 'results';
export type RoundPhase = 'teach' | 'analyze' | 'decide' | 'reveal' | 'score';

export interface PlayerState {
  id: string;
  name: string;
  avatar: string;
  socketId: string;
  cash: number;
  totalScore: number;
  roundScores: number[];
  portfolio: PortfolioItem[];
  connected: boolean;
  ready: boolean;
  currentDecision: PlayerDecision | null;
}

export interface PortfolioItem {
  company: Company;
  buyPrice: number;
  roundBought: number;
}

export interface PlayerDecision {
  type: 'buy' | 'pass' | 'answer';
  companyId?: string;
  payload?: Record<string, unknown>;
  timestamp: number;
}

export interface RoundState {
  number: number;
  phase: RoundPhase;
  companies: Company[];
  concept: RoundConcept;
  timerEnd: number;
  events?: { companyId: string; event: GameEvent }[];
}

export interface RoundConcept {
  title: string;
  titleEn: string;
  icon: string;
  buckIntro: string;
  description: string;
}

export interface GameState {
  id: string;
  phase: GamePhase;
  players: { [id: string]: PlayerState };
  currentRound: RoundState | null;
  roundNumber: number;
  totalRounds: number;
  usedCompanyIds: string[];
  createdAt: number;
}

export const ROUND_CONCEPTS: RoundConcept[] = [
  {
    title: 'Círculo de Competencia',
    titleEn: 'Circle of Competence',
    icon: '🎯',
    buckIntro: 'Solo invierte en negocios que ENTIENDAS. Si no puedes explicar cómo gana dinero en dos frases, ¡ni lo toques!',
    description: 'Ordena las empresas de más fácil a más difícil de entender. Luego decide si comprar.'
  },
  {
    title: 'El Foso Económico',
    titleEn: 'Economic Moat',
    icon: '🏰',
    buckIntro: 'Un gran negocio es como un castillo. El foso lo protege de los competidores. ¡Encuentra el foso!',
    description: 'Identifica qué tipo de ventaja competitiva tiene cada empresa.'
  },
  {
    title: 'Leyendo los Números',
    titleEn: 'Reading the Numbers',
    icon: '📊',
    buckIntro: 'Los números son el idioma de los negocios. Si no los puedes leer, estás volando a ciegas. ¡Abre bien los ojos!',
    description: 'Analiza los datos financieros de cada empresa y encuentra la más sana.'
  },
  {
    title: 'Valor Intrínseco',
    titleEn: 'Intrinsic Value',
    icon: '💎',
    buckIntro: 'El precio es lo que pagas. El VALOR es lo que recibes. ¿Cuánto vale REALMENTE esta empresa?',
    description: 'Calcula cuánto vale cada empresa y decide si el mercado la tiene cara o barata.'
  },
  {
    title: 'Margen de Seguridad',
    titleEn: 'Margin of Safety',
    icon: '🛡️',
    buckIntro: 'Si crees que vale $100, NO pagues $100. Paga $70. Ese colchón de $30 te salva si te equivocas.',
    description: 'El precio sube y baja. Compra cuando esté bien debajo del valor real.'
  },
  {
    title: 'Revisión del Portafolio',
    titleEn: 'Portfolio Review',
    icon: '📋',
    buckIntro: 'Un año después... ¿cómo le fue a tus inversiones? Hora de enfrentar la realidad.',
    description: 'Ve cómo les fue a tus empresas y decide cuál vender y cuál mantener.'
  }
];

export function createGameState(gameId: string): GameState {
  return {
    id: gameId,
    phase: 'lobby',
    players: {},
    currentRound: null,
    roundNumber: 0,
    totalRounds: 6,
    usedCompanyIds: [],
    createdAt: Date.now()
  };
}

export function addPlayer(game: GameState, player: Omit<PlayerState, 'cash' | 'totalScore' | 'roundScores' | 'portfolio' | 'connected' | 'ready' | 'currentDecision'>): GameState {
  return {
    ...game,
    players: {
      ...game.players,
      [player.id]: {
        ...player,
        cash: 100000,
        totalScore: 0,
        roundScores: [],
        portfolio: [],
        connected: true,
        ready: false,
        currentDecision: null
      }
    }
  };
}

export function startRound(game: GameState): GameState {
  const roundNum = game.roundNumber + 1;
  if (roundNum > game.totalRounds) return { ...game, phase: 'results' };

  const companies = getCompaniesForRound(roundNum, game.usedCompanyIds);
  const newUsedIds = [...game.usedCompanyIds, ...companies.map(c => c.id)];

  // Reset decisions
  const players = { ...game.players };
  Object.keys(players).forEach(id => {
    players[id] = { ...players[id], currentDecision: null };
  });

  return {
    ...game,
    phase: 'playing',
    roundNumber: roundNum,
    usedCompanyIds: newUsedIds,
    players,
    currentRound: {
      number: roundNum,
      phase: 'teach',
      companies,
      concept: ROUND_CONCEPTS[roundNum - 1],
      timerEnd: Date.now() + 30000
    }
  };
}

export function advanceRoundPhase(game: GameState): GameState {
  if (!game.currentRound) return game;

  const phases: RoundPhase[] = ['teach', 'analyze', 'decide', 'reveal', 'score'];
  const currentIdx = phases.indexOf(game.currentRound.phase);
  const nextPhase = phases[currentIdx + 1];

  if (!nextPhase) return game; // Round complete

  const timers: Record<RoundPhase, number> = {
    teach: 30000,
    analyze: 90000,
    decide: 30000,
    reveal: 15000,
    score: 10000
  };

  let events: { companyId: string; event: GameEvent }[] | undefined;
  if (game.currentRound.number === 6 && nextPhase === 'analyze') {
    // Generate events for portfolio review round
    const allPortfolioCompanyIds = new Set<string>();
    Object.values(game.players).forEach(p => {
      p.portfolio.forEach(item => allPortfolioCompanyIds.add(item.company.id));
    });
    events = Array.from(allPortfolioCompanyIds).map(id => ({
      companyId: id,
      event: getRandomEvent()
    }));
  }

  return {
    ...game,
    currentRound: {
      ...game.currentRound,
      phase: nextPhase,
      timerEnd: Date.now() + timers[nextPhase],
      ...(events ? { events } : {})
    }
  };
}

export function submitDecision(game: GameState, playerId: string, decision: PlayerDecision): GameState {
  return {
    ...game,
    players: {
      ...game.players,
      [playerId]: {
        ...game.players[playerId],
        currentDecision: decision
      }
    }
  };
}

export function bothPlayersDecided(game: GameState): boolean {
  const playerIds = Object.keys(game.players);
  return playerIds.length === 2 && playerIds.every(id => game.players[id].currentDecision !== null);
}

export function generateRoomCode(): string {
  const words = ['MOAT', 'BULL', 'BEAR', 'CASH', 'GOLD', 'BOND', 'GAIN', 'FUND',
    'RISK', 'HODL', 'BUCK', 'COIN', 'DEAL', 'EDGE', 'EPIC', 'FAST',
    'GROW', 'HERO', 'KING', 'LUCK', 'MEGA', 'NEXT', 'PEAK', 'RICH',
    'STAR', 'TOPS', 'UBER', 'VAST', 'WINS', 'ZERO'];
  return words[Math.floor(Math.random() * words.length)] +
    Math.floor(Math.random() * 100).toString().padStart(2, '0');
}
