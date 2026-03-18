// Old Man Buck's personality system
export type BuckMood = 'neutral' | 'pleased' | 'excited' | 'disgusted';

export interface BuckDialogue {
  text: string;
  mood: BuckMood;
  animation: 'idle' | 'nod' | 'clap' | 'facepalm' | 'sip' | 'wave-cane' | 'point';
}

// Tutorial dialogues
export const tutorialDialogues: BuckDialogue[] = [
  {
    text: 'Cada uno empieza con $100,000 en dinero de juego. No lo desperdicien.',
    mood: 'neutral',
    animation: 'point'
  },
  {
    text: 'Cada ronda van a ver empresas. Su trabajo: descubrir cuáles REALMENTE valen la pena.',
    mood: 'neutral',
    animation: 'idle'
  },
  {
    text: 'Les voy a enseñar un truco nuevo en cada ronda. Pongan atención o pierdan hasta la camisa.',
    mood: 'disgusted',
    animation: 'wave-cane'
  },
  {
    text: 'El que tenga el mejor portafolio al final gana. Así de simple. ¿Listos?',
    mood: 'pleased',
    animation: 'sip'
  }
];

// Between-round quips
export const betweenRoundQuips: string[] = [
  'Cuando yo tenía tu edad, ya leía reportes anuales. Tú lees TikTok. Trabajaremos con lo que hay.',
  'Recuerda: el mercado de valores transfiere dinero de los impacientes a los pacientes.',
  'Precio es lo que pagas. Valor es lo que recibes. Anótalo.',
  'No me importa si todos los demás lo están comprando. Si está caro, está caro.',
  'Alguien está sentado en la sombra hoy porque alguien plantó un árbol hace mucho tiempo.',
  'Yo llevo 60 años invirtiendo. Tú llevas 4 minutos. Adivina quién va ganando.',
  'No busco saltar barreras de 2 metros. Busco barreras de 30 centímetros que pueda pisar.',
  'El riesgo viene de no saber lo que estás haciendo. ¿Ya sabes lo que haces?',
  'Sé temeroso cuando otros son codiciosos, y codicioso cuando otros son temerosos.',
  'Solo cuando baja la marea descubres quién ha estado nadando sin ropa.',
];

// Competitive quips (directed at losing player)
export const competitiveQuips: string[] = [
  'Jugador {loser}, el otro te está haciendo ver mal ahora mismo.',
  '{winner} va al frente. {loser}, ¿vas a dejar que te gane así?',
  'Uno de ustedes piensa como inversor. El otro... bueno, sigue intentando.',
  '{loser}, ni mi abuela de 95 años haría esas decisiones. Y ella no invierte.',
];

// Waiting quips (when timer is running)
export const waitingQuips: string[] = [
  'El reloj corre. A veces la indecisión es la peor decisión.',
  'Tick tock... no tengo todo el día.',
  '¿Necesitas más tiempo? Yo decidí comprar Coca-Cola en menos de 5 minutos.',
  'Analiza rápido pero no te apresures. Hay diferencia.',
];

// Victory/defeat messages
export const victoryMessages: Record<string, BuckDialogue> = {
  'dominant': {
    text: '¡Victoria aplastante! Puede que tengas futuro en esto. PUEDE.',
    mood: 'excited',
    animation: 'clap'
  },
  'close': {
    text: 'Victoria cerrada. Ambos lo hicieron bien. La competencia los hace mejores.',
    mood: 'pleased',
    animation: 'nod'
  },
  'upset': {
    text: '¡REMONTADA! Eso es paciencia pagando dividendos. ¡Literalmente!',
    mood: 'excited',
    animation: 'wave-cane'
  }
};

export const defeatMessages: Record<string, BuckDialogue> = {
  'crushed': {
    text: 'Perdiste feo. Pero cada gran inversor empezó perdiendo. Inténtalo de nuevo.',
    mood: 'neutral',
    animation: 'sip'
  },
  'close': {
    text: 'Perdiste por poco. Una decisión diferente y hubieras ganado. Piénsalo.',
    mood: 'pleased',
    animation: 'nod'
  },
  'choked': {
    text: 'Ibas ganando y la regaste al final. La disciplina es TODO en la inversión.',
    mood: 'disgusted',
    animation: 'facepalm'
  }
};

export function getRandomQuip(): string {
  return betweenRoundQuips[Math.floor(Math.random() * betweenRoundQuips.length)];
}

export function getCompetitiveQuip(winnerName: string, loserName: string): string {
  const quip = competitiveQuips[Math.floor(Math.random() * competitiveQuips.length)];
  return quip.replace('{winner}', winnerName).replace('{loser}', loserName);
}

export function getWaitingQuip(): string {
  return waitingQuips[Math.floor(Math.random() * waitingQuips.length)];
}
