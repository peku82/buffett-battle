'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyCard from '@/components/ui/CompanyCard';
import OldManBuck from '@/components/mascot/OldManBuck';
import { useGame } from '@/lib/game-context';

// Round 1: Circle of Competence - rank companies by understanding, then buy
export default function Round1() {
  const { state, submitDecision } = useGame();
  const companies = state.currentRound?.companies || [];
  const [rankings, setRankings] = useState<Record<string, number>>({});
  const [selectedBuy, setSelectedBuy] = useState<string | null>(null);
  const [phase, setPhase] = useState<'rank' | 'buy'>('rank');
  const [submitted, setSubmitted] = useState(false);

  const handleRank = (companyId: string, rank: number) => {
    setRankings(prev => {
      const updated = { ...prev };
      // Remove this rank from any other company
      Object.keys(updated).forEach(k => {
        if (updated[k] === rank) delete updated[k];
      });
      updated[companyId] = rank;
      return updated;
    });
  };

  const allRanked = Object.keys(rankings).length === companies.length;

  const handleSubmit = () => {
    setSubmitted(true);
    submitDecision({
      type: selectedBuy ? 'buy' : 'pass',
      companyId: selectedBuy || undefined,
      payload: { rankings },
      timestamp: Date.now()
    });
  };

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          ⏳
        </motion.div>
        <p className="text-gray-300">Esperando al oponente...</p>
        <OldManBuck
          message={selectedBuy ? 'Veamos si escogiste bien...' : 'Pasaste. A veces eso es lo más inteligente.'}
          mood="neutral"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {phase === 'rank' && (
        <>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-amber-300 text-sm font-semibold">
              🎯 Ordena las empresas: ¿Cuál entiendes MEJOR?
            </p>
            <p className="text-gray-400 text-xs mt-1">
              1 = La que más entiendes, 3 = La que menos
            </p>
          </div>

          {companies.map(company => (
            <div key={company.id} className="relative">
              <CompanyCard
                {...company}
                compact
              />
              <div className="flex gap-2 mt-2">
                {[1, 2, 3].map(rank => (
                  <button
                    key={rank}
                    onClick={() => handleRank(company.id, rank)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                      rankings[company.id] === rank
                        ? 'bg-amber-500 text-amber-950'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {rank === 1 ? '👍 Entiendo' : rank === 2 ? '🤔 Más o menos' : '❓ No entiendo'}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {allRanked && (
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
              💰 ¿Quieres comprar alguna? Recuerda: solo invierte en lo que entiendes.
            </p>
          </div>

          {companies.map(company => (
            <CompanyCard
              key={company.id}
              {...company}
              selected={selectedBuy === company.id}
              onClick={() => setSelectedBuy(selectedBuy === company.id ? null : company.id)}
              compact
            />
          ))}

          <div className="flex gap-3">
            <button
              onClick={() => setPhase('rank')}
              className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
            >
              ← Atrás
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white"
            >
              {selectedBuy ? '🛒 Comprar' : '⏭️ Pasar (no comprar)'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
