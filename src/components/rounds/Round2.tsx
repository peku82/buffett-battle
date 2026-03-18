'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CompanyCard from '@/components/ui/CompanyCard';
import OldManBuck from '@/components/mascot/OldManBuck';
import { useGame } from '@/lib/game-context';

const MOAT_OPTIONS = [
  { id: 'brand', label: '👑 Marca', desc: 'La gente paga más solo por el nombre' },
  { id: 'network', label: '🌐 Red', desc: 'Más usuarios = más valor' },
  { id: 'cost', label: '💪 Costo', desc: 'Hace las cosas más barato que todos' },
  { id: 'switching', label: '🔒 Cambio', desc: 'Muy difícil de dejar' },
  { id: 'scale', label: '🏗️ Escala', desc: 'Solo caben 1-2 jugadores' },
  { id: 'none', label: '❌ Ninguno', desc: 'Cualquiera puede copiarla' },
];

export default function Round2() {
  const { state, submitDecision } = useGame();
  const companies = state.currentRound?.companies || [];
  const [moatGuesses, setMoatGuesses] = useState<Record<string, string>>({});
  const [selectedBuy, setSelectedBuy] = useState<string | null>(null);
  const [phase, setPhase] = useState<'identify' | 'buy'>('identify');
  const [submitted, setSubmitted] = useState(false);

  const allIdentified = Object.keys(moatGuesses).length === companies.length;

  const handleSubmit = () => {
    setSubmitted(true);
    submitDecision({
      type: selectedBuy ? 'buy' : 'pass',
      companyId: selectedBuy || undefined,
      payload: {
        moatGuesses: Object.entries(moatGuesses).map(([companyId, guess]) => ({ companyId, guess }))
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
      {phase === 'identify' && (
        <>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-amber-300 text-sm font-semibold">
              🏰 ¿Qué tipo de FOSO tiene cada empresa?
            </p>
            <p className="text-gray-400 text-xs mt-1">El foso protege a la empresa de competidores</p>
          </div>

          {companies.map(company => (
            <div key={company.id} className="space-y-2">
              <CompanyCard {...company} compact showMoat={false} />

              <div className="grid grid-cols-3 gap-1.5">
                {MOAT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setMoatGuesses(prev => ({ ...prev, [company.id]: opt.id }))}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all text-center ${
                      moatGuesses[company.id] === opt.id
                        ? 'bg-amber-500 text-amber-950 scale-105'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    <div>{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {allIdentified && (
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
              💰 Ahora que identificaste los fosos, ¿cuál empresa comprarías?
            </p>
            <p className="text-gray-400 text-xs mt-1">Las empresas con fosos fuertes sobreviven más tiempo</p>
          </div>

          {companies.map(company => (
            <CompanyCard
              key={company.id}
              {...company}
              selected={selectedBuy === company.id}
              onClick={() => setSelectedBuy(selectedBuy === company.id ? null : company.id)}
              showMoat
              moatStrength={company.moatStrength}
              compact
            />
          ))}

          <div className="flex gap-3">
            <button onClick={() => setPhase('identify')} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold">← Atrás</button>
            <button onClick={handleSubmit} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white">
              {selectedBuy ? '🛒 Comprar' : '⏭️ Pasar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
