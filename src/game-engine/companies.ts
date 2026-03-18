export type MoatType = 'brand' | 'switching' | 'network' | 'cost' | 'scale' | 'none';

export interface Company {
  id: string;
  name: string;
  logo: string; // emoji
  industry: string;
  description: string;
  descriptionDifficulty: 'simple' | 'moderate' | 'confusing';
  financials: {
    revenue: string;
    profitMargin: number;
    growth: number;
    debtLevel: 'none' | 'low' | 'medium' | 'high';
    roe: number;
    freeCashFlow: string;
    trend: 'up' | 'flat' | 'down';
    consistency: 'steady' | 'volatile' | 'unpredictable';
  };
  moatType: MoatType;
  moatStrength: number; // 1-5
  moatDescription: string;
  intrinsicValue: number;
  marketPrices: { undervalued: number; overvalued: number };
  hiddenStrength: string;
  hiddenWeakness: string;
  annualProfit: number;
  growthRate: number;
}

export const companies: Company[] = [
  {
    id: 'munchbox',
    name: 'MunchBox',
    logo: '🌯',
    industry: 'Restaurantes',
    description: 'Cadena de restaurantes de burritos y bowls personalizados. Ingredientes frescos y locales. 350 locales y creciendo rápido.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$1.2B', profitMargin: 12, growth: 18, debtLevel: 'low',
      roe: 22, freeCashFlow: '$144M', trend: 'up', consistency: 'steady'
    },
    moatType: 'brand', moatStrength: 3,
    moatDescription: 'Marca fuerte con 4M de miembros en programa de lealtad',
    intrinsicValue: 48,
    marketPrices: { undervalued: 38, overvalued: 62 },
    hiddenStrength: 'Cada nuevo local es rentable en 6 meses',
    hiddenWeakness: 'Depende del precio del aguacate',
    annualProfit: 144, growthRate: 18
  },
  {
    id: 'pixelforge',
    name: 'PixelForge Studios',
    logo: '🎮',
    industry: 'Videojuegos',
    description: 'Plataforma donde los niños crean y comparten sus propios juegos. 80M de jugadores mensuales. Gana dinero vendiendo moneda virtual.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$2.1B', profitMargin: -3, growth: 35, debtLevel: 'medium',
      roe: -4, freeCashFlow: '-$63M', trend: 'up', consistency: 'volatile'
    },
    moatType: 'network', moatStrength: 4,
    moatDescription: 'Más jugadores = más juegos = más jugadores. 2M de creadores haciendo contenido gratis.',
    intrinsicValue: 72,
    marketPrices: { undervalued: 55, overvalued: 95 },
    hiddenStrength: 'Comunidad de creadores muy leal',
    hiddenWeakness: 'Todavía quema dinero. Si el crecimiento se frena, están en problemas.',
    annualProfit: -63, growthRate: 35
  },
  {
    id: 'freshstep',
    name: 'FreshStep Sneakers',
    logo: '👟',
    industry: 'Moda/Deportes',
    description: 'Empresa de tenis deportivos populares con adolescentes. Vende directo al consumidor por su app.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$800M', profitMargin: 15, growth: 12, debtLevel: 'low',
      roe: 20, freeCashFlow: '$120M', trend: 'up', consistency: 'steady'
    },
    moatType: 'brand', moatStrength: 4,
    moatDescription: 'Los niños acampan afuera de las tiendas para comprar los nuevos modelos',
    intrinsicValue: 55,
    marketPrices: { undervalued: 42, overvalued: 70 },
    hiddenStrength: 'Ventas directas por app = mejores márgenes',
    hiddenWeakness: 'Toda la marca depende de un solo atleta',
    annualProfit: 120, growthRate: 12
  },
  {
    id: 'quickbyte',
    name: 'QuickByte Delivery',
    logo: '🛵',
    industry: 'Delivery',
    description: 'App de entrega de comida y súper. Opera en 200 ciudades. Promete entrega en 30 minutos.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$3.5B', profitMargin: -8, growth: 22, debtLevel: 'high',
      roe: -15, freeCashFlow: '-$280M', trend: 'up', consistency: 'volatile'
    },
    moatType: 'none', moatStrength: 1,
    moatDescription: 'Los clientes cambian de app por un cupón de $2',
    intrinsicValue: 15,
    marketPrices: { undervalued: 12, overvalued: 40 },
    hiddenStrength: 'Base masiva de usuarios',
    hiddenWeakness: 'Sin lealtad de clientes, competencia brutal, pierde dinero en cada pedido',
    annualProfit: -280, growthRate: 22
  },
  {
    id: 'sweettooth',
    name: 'SweetTooth Candy Co.',
    logo: '🍫',
    industry: 'Alimentos',
    description: 'Empresa de chocolates premium con 80 años de historia. Cajas de chocolates que todo el mundo conoce.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$450M', profitMargin: 22, growth: 3, debtLevel: 'none',
      roe: 30, freeCashFlow: '$99M', trend: 'up', consistency: 'steady'
    },
    moatType: 'brand', moatStrength: 5,
    moatDescription: 'Generaciones de lealtad. Sube precios 5% cada año y nadie se queja.',
    intrinsicValue: 35,
    marketPrices: { undervalued: 28, overvalued: 38 },
    hiddenStrength: 'Poder de precios increíble - la ventaja definitiva',
    hiddenWeakness: 'Cero innovación. Si el chocolate pasa de moda, no tienen nada más.',
    annualProfit: 99, growthRate: 3
  },
  {
    id: 'cloudnine',
    name: 'CloudNine Airways',
    logo: '✈️',
    industry: 'Aerolíneas',
    description: 'Aerolínea de bajo costo. Vuelos baratos, sin cobro de equipaje, snacks gratis.',
    descriptionDifficulty: 'moderate',
    financials: {
      revenue: '$6B', profitMargin: 4, growth: 7, debtLevel: 'high',
      roe: 8, freeCashFlow: '$240M', trend: 'flat', consistency: 'volatile'
    },
    moatType: 'cost', moatStrength: 2,
    moatDescription: 'Un solo tipo de avión = mantenimiento más barato',
    intrinsicValue: 22,
    marketPrices: { undervalued: 18, overvalued: 30 },
    hiddenStrength: 'Mayor satisfacción del cliente en la industria',
    hiddenWeakness: 'El precio del combustible puede eliminar toda la ganancia de un día para otro',
    annualProfit: 240, growthRate: 7
  },
  {
    id: 'brainwave',
    name: 'BrainWave Learning',
    logo: '🧠',
    industry: 'Educación',
    description: 'App educativa con 50M de usuarios. Enseña matemáticas y ciencias a través de juegos. Versión gratis + suscripción premium.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$600M', profitMargin: 18, growth: 28, debtLevel: 'low',
      roe: 25, freeCashFlow: '$108M', trend: 'up', consistency: 'steady'
    },
    moatType: 'network', moatStrength: 4,
    moatDescription: 'Efecto de red + costos de cambio (años de progreso guardado)',
    intrinsicValue: 65,
    marketPrices: { undervalued: 50, overvalued: 82 },
    hiddenStrength: 'Escuelas lo están adoptando como herramienta oficial',
    hiddenWeakness: 'Gobiernos podrían imponer alternativas gratuitas',
    annualProfit: 108, growthRate: 28
  },
  {
    id: 'ironclad',
    name: 'IronClad Insurance',
    logo: '🛡️',
    industry: 'Seguros',
    description: 'Compañía de seguros de auto online. Usa inteligencia artificial para procesar reclamos en minutos. Popular con conductores jóvenes.',
    descriptionDifficulty: 'moderate',
    financials: {
      revenue: '$2.8B', profitMargin: 9, growth: 15, debtLevel: 'low',
      roe: 18, freeCashFlow: '$252M', trend: 'up', consistency: 'steady'
    },
    moatType: 'cost', moatStrength: 4,
    moatDescription: 'IA = menos empleados que aseguradoras tradicionales',
    intrinsicValue: 44,
    marketPrices: { undervalued: 36, overvalued: 52 },
    hiddenStrength: 'Float: tienen billones en primas de clientes que invierten',
    hiddenWeakness: 'Una temporada de huracanes catastrófica podría crear pérdidas masivas',
    annualProfit: 252, growthRate: 15
  },
  {
    id: 'trendspark',
    name: 'TrendSpark Social',
    logo: '📱',
    industry: 'Redes Sociales',
    description: 'App de fotos súper popular con adolescentes. 120M de usuarios diarios. Gana dinero con publicidad y filtros de realidad aumentada.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$4.2B', profitMargin: 2, growth: 40, debtLevel: 'medium',
      roe: 5, freeCashFlow: '$84M', trend: 'up', consistency: 'volatile'
    },
    moatType: 'network', moatStrength: 3,
    moatDescription: 'Tus amigos están ahí, así que tú también te quedas',
    intrinsicValue: 58,
    marketPrices: { undervalued: 48, overvalued: 90 },
    hiddenStrength: 'Gen Z la considera su plataforma principal',
    hiddenWeakness: 'Los adolescentes son volubles. La próxima app cool podría robarse a todos.',
    annualProfit: 84, growthRate: 40
  },
  {
    id: 'greenvolt',
    name: 'GreenVolt Energy',
    logo: '☀️',
    industry: 'Energía',
    description: 'Fabrica paneles solares y baterías para casas. Crece rápido porque más gente quiere energía limpia.',
    descriptionDifficulty: 'moderate',
    financials: {
      revenue: '$1.8B', profitMargin: 6, growth: 30, debtLevel: 'high',
      roe: 8, freeCashFlow: '$108M', trend: 'up', consistency: 'volatile'
    },
    moatType: 'switching', moatStrength: 3,
    moatDescription: 'Una vez que los paneles están en tu techo, estás atado por 20 años',
    intrinsicValue: 40,
    marketPrices: { undervalued: 35, overvalued: 75 },
    hiddenStrength: 'Subsidios del gobierno hacen su producto 30% más barato',
    hiddenWeakness: 'Esos subsidios podrían desaparecer con un nuevo gobierno',
    annualProfit: 108, growthRate: 30
  },
  {
    id: 'petpals',
    name: 'PetPals',
    logo: '🐕',
    industry: 'Mascotas',
    description: 'Tienda online de productos para mascotas con suscripción. "Nunca te quedes sin comida para perro." 12M de hogares suscritos.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$1.5B', profitMargin: 5, growth: 20, debtLevel: 'low',
      roe: 12, freeCashFlow: '$75M', trend: 'up', consistency: 'steady'
    },
    moatType: 'switching', moatStrength: 3,
    moatDescription: 'Suscripciones automáticas son pegajosas; las mascotas comen la misma comida',
    intrinsicValue: 38,
    marketPrices: { undervalued: 30, overvalued: 50 },
    hiddenStrength: '85% de retención - casi nadie cancela',
    hiddenWeakness: 'Amazon podría copiarlos cualquier día',
    annualProfit: 75, growthRate: 20
  },
  {
    id: 'blockbuilder',
    name: 'BlockBuilder Toys',
    logo: '🧱',
    industry: 'Juguetes',
    description: 'Empresa de juguetes de construcción con 50 años. Licencias de películas, videojuegos y deportes.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$3B', profitMargin: 25, growth: 8, debtLevel: 'none',
      roe: 35, freeCashFlow: '$750M', trend: 'up', consistency: 'steady'
    },
    moatType: 'brand', moatStrength: 5,
    moatDescription: 'Patentes + marca icónica + fábricas masivas',
    intrinsicValue: 60,
    marketPrices: { undervalued: 52, overvalued: 78 },
    hiddenStrength: 'Los adultos ahora compran más sets que los niños',
    hiddenWeakness: 'Costos del plástico subiendo; presión ambiental',
    annualProfit: 750, growthRate: 8
  },
  {
    id: 'zapcharge',
    name: 'ZapCharge',
    logo: '⚡',
    industry: 'Energía/Transporte',
    description: 'Construye estaciones de carga para autos eléctricos. 25,000 estaciones en todo el país.',
    descriptionDifficulty: 'moderate',
    financials: {
      revenue: '$400M', profitMargin: -15, growth: 50, debtLevel: 'high',
      roe: -20, freeCashFlow: '-$60M', trend: 'up', consistency: 'volatile'
    },
    moatType: 'none', moatStrength: 1,
    moatDescription: 'Cualquier empresa puede construir una estación de carga',
    intrinsicValue: 12,
    marketPrices: { undervalued: 10, overvalued: 45 },
    hiddenStrength: 'Ventaja de primer movedor en autopistas clave',
    hiddenWeakness: 'Quema dinero, sin ventaja competitiva, empresas más grandes entrando al mercado',
    annualProfit: -60, growthRate: 50
  },
  {
    id: 'datavault',
    name: 'DataVault Security',
    logo: '🔒',
    industry: 'Ciberseguridad',
    description: 'Empresa de soluciones integrales de ciberseguridad empresarial que utiliza análisis heurístico de vectores de amenaza con machine learning para proteger infraestructura multi-nube contra ataques de día cero y vulnerabilidades de superficie expandida.',
    descriptionDifficulty: 'confusing',
    financials: {
      revenue: '$900M', profitMargin: 14, growth: 25, debtLevel: 'low',
      roe: 22, freeCashFlow: '$126M', trend: 'up', consistency: 'steady'
    },
    moatType: 'switching', moatStrength: 5,
    moatDescription: 'Arrancar un sistema de seguridad da terror; nadie lo hace',
    intrinsicValue: 70,
    marketPrices: { undervalued: 55, overvalued: 88 },
    hiddenStrength: 'Cliente promedio se queda 7+ años. Ingresos predecibles.',
    hiddenWeakness: 'Un hackeo de sus propios sistemas destruiría su reputación',
    annualProfit: 126, growthRate: 25
  },
  {
    id: 'fizzpop',
    name: 'FizzPop Beverages',
    logo: '🥤',
    industry: 'Bebidas',
    description: 'LA empresa de refrescos. 100 años de historia. Se vende en todos los países del planeta. 500 marcas diferentes.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$12B', profitMargin: 28, growth: 4, debtLevel: 'low',
      roe: 35, freeCashFlow: '$3.36B', trend: 'up', consistency: 'steady'
    },
    moatType: 'brand', moatStrength: 5,
    moatDescription: 'La marca más reconocida del mundo + red de distribución que nadie puede igualar',
    intrinsicValue: 52,
    marketPrices: { undervalued: 45, overvalued: 55 },
    hiddenStrength: 'Sube precios con la inflación cada año. Los consumidores ni lo notan.',
    hiddenWeakness: 'Tendencias de salud alejándose de bebidas azucaradas. Crecimiento lento.',
    annualProfit: 3360, growthRate: 4
  },
  {
    id: 'rocketship',
    name: 'RocketShip Crypto',
    logo: '🚀',
    industry: 'Criptomonedas',
    description: 'Plataforma para comprar y vender criptomonedas utilizando algoritmos de arbitraje descentralizado con staking delegado y yield farming automatizado en múltiples cadenas de bloques layer-2 con contratos inteligentes auto-ejecutables.',
    descriptionDifficulty: 'confusing',
    financials: {
      revenue: '$3B (el año pasado fue $1B)', profitMargin: 20, growth: 0, debtLevel: 'medium',
      roe: 15, freeCashFlow: '$600M', trend: 'down', consistency: 'unpredictable'
    },
    moatType: 'none', moatStrength: 1,
    moatDescription: 'Docenas de competidores, cero costos de cambio',
    intrinsicValue: 18,
    marketPrices: { undervalued: 15, overvalued: 85 },
    hiddenStrength: 'Podría beneficiarse masivamente si cripto se vuelve mainstream',
    hiddenWeakness: 'Ingresos varían 200% año con año. Imposible de valuar. Riesgo regulatorio enorme.',
    annualProfit: 600, growthRate: 0
  },
  {
    id: 'stadiumking',
    name: 'StadiumKing Sports',
    logo: '🏟️',
    industry: 'Entretenimiento',
    description: 'Dueña de 12 arenas deportivas profesionales. Vende boletos, comida, y derechos de nombre. También organiza conciertos.',
    descriptionDifficulty: 'moderate',
    financials: {
      revenue: '$2.5B', profitMargin: 11, growth: 6, debtLevel: 'medium',
      roe: 14, freeCashFlow: '$275M', trend: 'up', consistency: 'steady'
    },
    moatType: 'scale', moatStrength: 4,
    moatDescription: 'No puedes construir otra arena en el centro. Equipos firman contratos de 20 años.',
    intrinsicValue: 42,
    marketPrices: { undervalued: 35, overvalued: 55 },
    hiddenStrength: 'El valor de los bienes raíces de las arenas puede superar el precio de la acción',
    hiddenWeakness: 'Una pandemia demostró que los eventos en vivo pueden llegar a cero de la noche a la mañana',
    annualProfit: 275, growthRate: 6
  },
  {
    id: 'cozynest',
    name: 'CozyNest Furniture',
    logo: '🛋️',
    industry: 'Muebles',
    description: 'Tienda de muebles online para millennials. Diseños trendy, famosos en Instagram. Envío gratis.',
    descriptionDifficulty: 'simple',
    financials: {
      revenue: '$2B', profitMargin: 1, growth: 10, debtLevel: 'high',
      roe: 2, freeCashFlow: '$20M', trend: 'flat', consistency: 'volatile'
    },
    moatType: 'none', moatStrength: 1,
    moatDescription: 'Los muebles son un commodity; los clientes compran por precio',
    intrinsicValue: 14,
    marketPrices: { undervalued: 11, overvalued: 35 },
    hiddenStrength: 'Marca fuerte con millennials',
    hiddenWeakness: 'Envío gratis destruye márgenes. Las devoluciones cuestan una fortuna.',
    annualProfit: 20, growthRate: 10
  }
];

// Round-specific company selections
export function getCompaniesForRound(round: number, usedIds: string[]): Company[] {
  const available = companies.filter(c => !usedIds.includes(c.id));

  switch (round) {
    case 1: // Circle of Competence - one simple, one moderate, one confusing
      return [
        pickRandom(available.filter(c => c.descriptionDifficulty === 'simple')),
        pickRandom(available.filter(c => c.descriptionDifficulty === 'moderate')),
        pickRandom(available.filter(c => c.descriptionDifficulty === 'confusing')),
      ];
    case 2: // Moats - mix of types including one 'none'
      return [
        pickRandom(available.filter(c => c.moatStrength >= 4)),
        pickRandom(available.filter(c => c.moatStrength >= 2 && c.moatStrength <= 3)),
        pickRandom(available.filter(c => c.moatType === 'none')),
      ];
    case 3: // Numbers - one healthy, one okay, one red flags
      return [
        pickRandom(available.filter(c => c.financials.profitMargin >= 20 && c.financials.debtLevel === 'none')),
        pickRandom(available.filter(c => c.financials.profitMargin > 0 && c.financials.profitMargin < 15)),
        pickRandom(available.filter(c => c.financials.profitMargin < 0 || c.financials.debtLevel === 'high')),
      ];
    case 4: // Intrinsic Value - one undervalued, one overvalued
      return [
        pickRandom(available.filter(c => c.financials.profitMargin > 10 && c.financials.consistency === 'steady')),
        pickRandom(available.filter(c => c.financials.consistency === 'volatile' || c.financials.consistency === 'unpredictable')),
      ];
    case 5: // Margin of Safety - one good company
      return [
        pickRandom(available.filter(c => c.moatStrength >= 3 && c.financials.profitMargin > 10)),
      ];
    default:
      return [];
  }
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Events for Round 6
export interface GameEvent {
  text: string;
  impact: number; // percentage change
  type: 'positive' | 'negative';
}

export const positiveEvents: GameEvent[] = [
  { text: '🚀 Nuevo producto es un éxito masivo', impact: 15, type: 'positive' },
  { text: '💀 Su competidor principal quebró', impact: 20, type: 'positive' },
  { text: '🌎 Se expandió a 3 nuevos países', impact: 10, type: 'positive' },
  { text: '🌟 Celebridad los promociona gratis', impact: 12, type: 'positive' },
  { text: '📈 Ingresos superaron expectativas por 30%', impact: 18, type: 'positive' },
  { text: '🤝 Alianza estratégica con empresa grande', impact: 8, type: 'positive' },
];

export const negativeEvents: GameEvent[] = [
  { text: '🚢 Crisis en la cadena de suministro', impact: -15, type: 'negative' },
  { text: '😤 CEO atrapado en escándalo', impact: -20, type: 'negative' },
  { text: '⚔️ Nuevo competidor fuerte entra al mercado', impact: -10, type: 'negative' },
  { text: '📉 Recesión reduce el gasto del consumidor', impact: -12, type: 'negative' },
  { text: '⚖️ Nueva regulación les afecta', impact: -14, type: 'negative' },
  { text: '🔓 Hackeo expone datos de clientes', impact: -18, type: 'negative' },
];

export function getRandomEvent(): GameEvent {
  const all = [...positiveEvents, ...negativeEvents];
  return all[Math.floor(Math.random() * all.length)];
}
