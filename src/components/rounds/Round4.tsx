'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyCard from '@/components/ui/CompanyCard';
import { useGame } from '@/lib/game-context';

export default function Round4() {
  const { state, submitDecision } = useGame();
  const companies = state.currentRound?.companies || [];
  const [valuations, setValuations] = useState<Record<string, 'over' | 'under'>>({});
  const [selectedBuy, setSelectedBuy] = useState<string | null>(null);
  const [phase, setPhase] = useState<'value' | 'buy'>('value');
  const [submitted, setSubmitted] = useState(false);

  const allValued = Object.keys(valuations).length === companies.length;

  const handleSubmit = () => {
    setSubmitted(true);
    submitDecision({
      type: selectedBuy ? 'buy' : 'pass',
      companyId: selectedBuy || undefined,
      payload: {
        valuations: Object.entries(valuations).map(([companyId, v]) => ({
          companyId,
          isOvervalued: v === 'over'
        }))
      },
      timestamp: Date.now()
    });
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-5xl mb-4">⏳</motion.div>
        <p className="text-gray-300">Esperando al oponente...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {phase === 'value' && (
        <>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
            <p className="text-purple-300 text-sm font-semibold">
              💎 ¿Está CARA o BARATA cada empresa?
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Calcula: si gana ${'{X}'} al año y crece {'{Y}'}%, ¿cuánto valdrá en 5 años?
            </p>
          </div>

          {companies.map(company => {
            // Simplified DCF visualization
            const profit = company.annualProfit;
            const growth = company.growthRate;
            const futureProfit = profit * Math.pow(1 + growth / 100, 5);
            const estimatedValue = futureProfit * 10; // Simple 10x multiple
            const marketPrice = Math.random() > 0.5 ? company.marketPrices.overvalued : company.marketPrices.undervalued;

            return (
              <div key={company.id} className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/50">
                <CompanyCard {...company} showFinancials compact />

                {/* Value calculator */}
                <div className="mt-3 bg-gray-800/60 rounded-lg p-3 space-y-2">
                  <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Calculadora de Valor</div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ganancia actual:</span>
                    <span className={`font-bold ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${profit > 0 ? profit : `(${Math.abs(profit)})`}M/año
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Crecimiento:</span>
                    <span className="font-bold text-blue-400">{growth}% anual</span>
                  </div>

                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Ganancia en 5 años:</span>
                      <span className={`font-bold ${futureProfit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        ~${futureProfit > 0 ? Math.round(futureProfit) : '???'}M
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Valor estimado (10x):</span>
                      <span className="font-bold text-amber-400">
                        {estimatedValue > 0 ? `~$${Math.round(estimatedValue / 100)}/acción` : '❓ Imposible calcular'}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">El mercado pide:</span>
                      <span className="font-bold text-white text-lg">${marketPrice}/acción</span>
                    </div>
                  </div>
                </div>

                {/* Over/Under buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setValuations(prev => ({ ...prev, [company.id]: 'under' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      valuations[company.id] === 'under'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    📈 BARATA (compra)
                  </button>
                  <button
                    onClick={() => setValuations(prev => ({ ...prev, [company.id]: 'over' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      valuations[company.id] === 'over'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    📉 CARA (evitar)
                  </button>
                </div>
              </div>
            );
          })}

          {allValued && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setPhase('buy')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl font-bold text-amber-950"
            >
              Siguiente: ¿Cuál compras? →
            </motion.button>
          )}
        </>
      )}

      {phase === 'buy' && (
        <>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
            <p className="text-emerald-300 text-sm font-semibold">
              💰 Compra la que esté BARATA, o pasa si ambas están caras. ¡La paciencia también suma puntos!
            </p>
          </div>

          {companies.map(c => (
            <CompanyCard
              key={c.id}
              {...c}
              selected={selectedBuy === c.id}
              onClick={() => setSelectedBuy(selectedBuy === c.id ? null : c.id)}
              compact
            />
          ))}

          <div className="flex gap-3">
            <button onClick={() => setPhase('value')} className="px-4 py-3 bg-gray-800 rounded-xl font-semibold">← Atrás</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white">
              {selectedBuy ? '🛒 Comprar' : '⏭️ Pasar (paciencia)'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
