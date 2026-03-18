import { Company } from './companies';

export interface RoundScore {
  round: number;
  points: number;
  breakdown: { label: string; points: number }[];
  buckReaction: 'neutral' | 'pleased' | 'excited' | 'disgusted';
  buckMessage: string;
}

// Round 1: Circle of Competence
export function scoreRound1(
  rankings: { companyId: string; rank: number }[],
  purchaseId: string | null,
  companies: Company[]
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];

  // Check if rankings match difficulty correctly
  const sorted = [...rankings].sort((a, b) => a.rank - b.rank);
  const difficulties = sorted.map(r => companies.find(c => c.id === r.companyId)?.descriptionDifficulty);

  if (difficulties[0] === 'simple' && difficulties[1] === 'moderate' && difficulties[2] === 'confusing') {
    points += 200;
    breakdown.push({ label: 'Ranking perfecto', points: 200 });
  } else if (difficulties[0] === 'simple') {
    points += 100;
    breakdown.push({ label: 'Ranking parcial', points: 100 });
  }

  const purchased = companies.find(c => c.id === purchaseId);
  if (purchased) {
    if (purchased.descriptionDifficulty === 'simple') {
      points += 300;
      breakdown.push({ label: 'Compraste lo que entiendes', points: 300 });
    } else if (purchased.descriptionDifficulty === 'moderate') {
      points += 150;
      breakdown.push({ label: 'Compra moderadamente entendida', points: 150 });
    } else {
      points -= 100;
      breakdown.push({ label: 'Compraste algo que no entiendes', points: -100 });
    }
  } else {
    points += 50;
    breakdown.push({ label: 'Pasaste (prudente)', points: 50 });
  }

  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (purchased?.descriptionDifficulty === 'confusing') {
    buckReaction = 'disgusted';
    buckMessage = '¡Acabas de comprar una empresa que no puedes explicarle a tu abuela! Regla número uno: si no lo entiendes, NO lo compres.';
  } else if (purchased?.descriptionDifficulty === 'simple' && points >= 400) {
    buckReaction = 'excited';
    buckMessage = '¡Muy bien! Inviertes en lo que conoces. Así empecé yo hace 60 años... bueno, tú apenas llevas 2 minutos.';
  } else if (!purchased) {
    buckReaction = 'pleased';
    buckMessage = 'A veces la mejor inversión es la que NO haces. Me impresionas... un poquito.';
  } else {
    buckReaction = 'pleased';
    buckMessage = 'No está mal. Pero podrías hacerlo mejor. Sigue estudiando.';
  }

  return { round: 1, points, breakdown, buckReaction, buckMessage };
}

// Round 2: Economic Moat
export function scoreRound2(
  moatGuesses: { companyId: string; guess: string }[],
  purchaseId: string | null,
  companies: Company[]
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];

  moatGuesses.forEach(g => {
    const company = companies.find(c => c.id === g.companyId);
    if (company && g.guess === company.moatType) {
      points += 150;
      breakdown.push({ label: `Moat correcto: ${company.name}`, points: 150 });
    }
  });

  const purchased = companies.find(c => c.id === purchaseId);
  if (purchased) {
    if (purchased.moatStrength >= 4) {
      points += 300;
      breakdown.push({ label: 'Compraste empresa con foso fuerte', points: 300 });
    } else if (purchased.moatStrength >= 2) {
      points += 150;
      breakdown.push({ label: 'Foso moderado', points: 150 });
    } else {
      points += 0;
      breakdown.push({ label: 'Empresa sin foso', points: 0 });
    }
  }

  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (points >= 600) {
    buckReaction = 'excited';
    buckMessage = '¡Ahora sí estás pensando! Un foso mantiene a la competencia afuera como un castillo. Esta empresa tiene uno ENORME.';
  } else if (purchased?.moatType === 'none') {
    buckReaction = 'disgusted';
    buckMessage = 'Esa empresa no tiene foso. Cualquier competidor puede copiarla mañana. ¿Pagarías por un castillo sin protección?';
  } else {
    buckReaction = 'pleased';
    buckMessage = 'Vas por buen camino. Recuerda: si le diera $10 mil millones a alguien para competir contra esta empresa, ¿podría? Si la respuesta es no, el foso es fuerte.';
  }

  return { round: 2, points, breakdown, buckReaction, buckMessage };
}

// Round 3: Reading the Numbers
export function scoreRound3(
  answers: { question: string; correct: boolean }[],
  purchaseId: string | null,
  companies: Company[]
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];

  answers.forEach(a => {
    if (a.correct) {
      points += 200;
      breakdown.push({ label: `Respuesta correcta`, points: 200 });
    }
  });

  const purchased = companies.find(c => c.id === purchaseId);
  if (purchased) {
    const isHealthy = purchased.financials.profitMargin >= 15 &&
      (purchased.financials.debtLevel === 'none' || purchased.financials.debtLevel === 'low');
    const isDangerous = purchased.financials.profitMargin < 0 || purchased.financials.debtLevel === 'high';

    if (isHealthy) {
      points += 300;
      breakdown.push({ label: 'Empresa financieramente sana', points: 300 });
    } else if (isDangerous) {
      points -= 200;
      breakdown.push({ label: 'Empresa con banderas rojas', points: -200 });
    } else {
      points += 100;
      breakdown.push({ label: 'Empresa aceptable', points: 100 });
    }
  }

  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (purchased && (purchased.financials.profitMargin < 0 || purchased.financials.debtLevel === 'high')) {
    buckReaction = 'disgusted';
    buckMessage = '¡Esa empresa debe más dinero del que gana! Eso no es invertir, es apostar. Mi perro escogería mejor.';
  } else if (points >= 700) {
    buckReaction = 'excited';
    buckMessage = '¡Excelente ojo para los números! Los números no mienten... bueno, a veces sí, pero estos se ven bien.';
  } else {
    buckReaction = 'pleased';
    buckMessage = 'Los números son el lenguaje de los negocios. Sigue practicando y pronto los leerás como yo leo el periódico.';
  }

  return { round: 3, points, breakdown, buckReaction, buckMessage };
}

// Round 4: Intrinsic Value
export function scoreRound4(
  valuations: { companyId: string; playerEstimate: number; isOvervalued: boolean }[],
  purchaseId: string | null,
  companies: Company[]
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];

  valuations.forEach(v => {
    const company = companies.find(c => c.id === v.companyId);
    if (!company) return;

    // Check if player correctly identified over/undervalued
    const actuallyOvervalued = company.marketPrices.overvalued > company.intrinsicValue;
    if (v.isOvervalued === actuallyOvervalued) {
      points += 300;
      breakdown.push({ label: `Valuación correcta: ${company.name}`, points: 300 });
    }
  });

  const purchased = companies.find(c => c.id === purchaseId);
  if (purchased) {
    if (purchased.financials.consistency === 'unpredictable') {
      points -= 100;
      breakdown.push({ label: 'Imposible de valuar - no debiste comprar', points: -100 });
    } else if (purchased.financials.consistency === 'steady') {
      points += 400;
      breakdown.push({ label: 'Compraste empresa valuada correctamente', points: 400 });
    } else {
      points += 100;
      breakdown.push({ label: 'Compra arriesgada', points: 100 });
    }
  } else {
    points += 300;
    breakdown.push({ label: 'Pasaste sabiamente', points: 300 });
  }

  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (!purchased) {
    buckReaction = 'excited';
    buckMessage = 'A veces la mejor inversión es la que NO haces. Si no puedes calcular el valor, ¡no compres! Estoy genuinamente impresionado.';
  } else if (purchased.financials.consistency === 'unpredictable') {
    buckReaction = 'disgusted';
    buckMessage = 'Si el valor no te "grita" que es barato, no es suficientemente barato. Esa empresa es imposible de valuar. ¡SIGUIENTE!';
  } else {
    buckReaction = 'pleased';
    buckMessage = 'Precio es lo que pagas. Valor es lo que recibes. Recuerda eso siempre.';
  }

  return { round: 4, points, breakdown, buckReaction, buckMessage };
}

// Round 5: Margin of Safety
export function scoreRound5(
  buyPrice: number | null,
  intrinsicValue: number
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];
  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (buyPrice === null) {
    points = 50;
    breakdown.push({ label: 'No compraste (demasiado cauteloso)', points: 50 });
    buckReaction = 'neutral';
    buckMessage = 'Ser cauteloso está bien, pero a veces hay que actuar. La oportunidad no espera para siempre.';
  } else {
    const discount = ((intrinsicValue - buyPrice) / intrinsicValue) * 100;

    if (discount >= 20) {
      points = 500;
      breakdown.push({ label: `Margen de seguridad: ${discount.toFixed(0)}%`, points: 500 });
      buckReaction = 'excited';
      buckMessage = '¡ASÍ se compra un negocio! Te dejaste un colchón enorme por si las cosas salen mal. ¡Bravo!';
    } else if (discount > 0) {
      points = 300;
      breakdown.push({ label: `Pequeño margen: ${discount.toFixed(0)}%`, points: 300 });
      buckReaction = 'pleased';
      buckMessage = 'Compraste por debajo del valor, bien. Pero me gustaría más margen. Cuando construyes un puente para camiones de 10 toneladas, lo haces para aguantar 20.';
    } else if (discount === 0) {
      points = 100;
      breakdown.push({ label: 'Compraste al valor justo', points: 100 });
      buckReaction = 'neutral';
      buckMessage = 'Compraste al valor exacto. No está mal, pero tampoco te protegiste de errores.';
    } else {
      points = -100;
      breakdown.push({ label: `Pagaste de más: ${Math.abs(discount).toFixed(0)}% arriba`, points: -100 });
      buckReaction = 'disgusted';
      buckMessage = '¡Pagaste MÁS de lo que vale! Eso es como pagar $10 por un dulce de $3. Regla #1: NUNCA pierdas dinero.';
    }
  }

  return { round: 5, points, breakdown, buckReaction, buckMessage };
}

// Round 6: Portfolio Review
export function scoreRound6(
  portfolio: { company: Company; buyPrice: number; event: { impact: number }; moatReduction: boolean }[],
  soldId: string | null,
  heldId: string | null
): RoundScore {
  let points = 0;
  const breakdown: { label: string; points: number }[] = [];

  // Calculate portfolio performance
  let totalReturn = 0;
  let worstPerformer = { id: '', returnPct: Infinity };
  let bestPerformer = { id: '', returnPct: -Infinity };

  portfolio.forEach(p => {
    let eventImpact = p.event.impact;
    if (p.moatReduction && eventImpact < 0) {
      eventImpact = eventImpact / 2; // Strong moat halves negative events
    }
    const newValue = p.buyPrice * (1 + eventImpact / 100);
    const returnPct = ((newValue - p.buyPrice) / p.buyPrice) * 100;
    totalReturn += returnPct;

    if (returnPct < worstPerformer.returnPct) worstPerformer = { id: p.company.id, returnPct };
    if (returnPct > bestPerformer.returnPct) bestPerformer = { id: p.company.id, returnPct };
  });

  // Selling weakest
  if (soldId === worstPerformer.id) {
    points += 200;
    breakdown.push({ label: 'Vendiste la peor inversión', points: 200 });
  }

  // Holding strongest long-term
  if (heldId === bestPerformer.id) {
    points += 300;
    breakdown.push({ label: 'Mantuviste la mejor inversión', points: 300 });
  }

  // Diversity bonus
  const moatTypes = new Set(portfolio.map(p => p.company.moatType));
  if (moatTypes.size >= 3) {
    points += 200;
    breakdown.push({ label: 'Bonus diversificación', points: 200 });
  }

  // Portfolio return score (scaled 0-500)
  const avgReturn = portfolio.length > 0 ? totalReturn / portfolio.length : 0;
  const returnScore = Math.min(500, Math.max(0, Math.round((avgReturn + 20) * 12.5)));
  points += returnScore;
  breakdown.push({ label: `Rendimiento del portafolio: ${avgReturn.toFixed(1)}%`, points: returnScore });

  let buckReaction: RoundScore['buckReaction'] = 'neutral';
  let buckMessage = '';

  if (points >= 800) {
    buckReaction = 'excited';
    buckMessage = 'Ahora SÍ piensas como inversor. Diversificado, paciente, y vendiste lo que debías. Quizás no estás tan perdido como pensé.';
  } else if (points >= 400) {
    buckReaction = 'pleased';
    buckMessage = 'No está mal tu portafolio. Recuerda: el mercado transfiere dinero de los impacientes a los pacientes.';
  } else {
    buckReaction = 'disgusted';
    buckMessage = 'Ese portafolio necesita ayuda urgente. Pero oye, la buena noticia es que puedes jugar de nuevo.';
  }

  return { round: 6, points, breakdown, buckReaction, buckMessage };
}

// Final grade
export function getGrade(totalScore: number): { grade: string; message: string } {
  if (totalScore >= 4000) return { grade: 'A+', message: 'Piensas como Buffett. Me preocupas genuinamente.' };
  if (totalScore >= 3200) return { grade: 'A', message: 'Sólido. Puede que sí seas bueno en esto.' };
  if (totalScore >= 2400) return { grade: 'B', message: 'Nada mal. Sigue estudiando.' };
  if (totalScore >= 1600) return { grade: 'C', message: 'Tienes potencial. Pero también problemas.' };
  if (totalScore >= 800) return { grade: 'D', message: 'Mi perro escogería mejores acciones.' };
  return { grade: 'F', message: 'Por favor, nunca inviertas dinero real. Te lo suplico.' };
}

// Bonus points
export function calculateBonuses(roundScores: RoundScore[], passedOnBadDeal: boolean): { label: string; points: number }[] {
  const bonuses: { label: string; points: number }[] = [];

  if (passedOnBadDeal) {
    bonuses.push({ label: '🎯 Bonus Paciencia', points: 200 });
  }

  const avgScore = roundScores.reduce((sum, r) => sum + r.points, 0) / roundScores.length;
  const allAboveAvg = roundScores.every(r => r.points >= avgScore * 0.7);
  if (allAboveAvg) {
    bonuses.push({ label: '📊 Bonus Consistencia', points: 200 });
  }

  // Comeback bonus
  const midScore = roundScores.slice(0, 3).reduce((s, r) => s + r.points, 0);
  const endScore = roundScores.reduce((s, r) => s + r.points, 0);
  if (midScore < 800 && endScore > 2400) {
    bonuses.push({ label: '🔥 Bonus Remontada', points: 150 });
  }

  return bonuses;
}
