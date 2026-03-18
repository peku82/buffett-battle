'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function Round6() {
  const { state, submitDecision } = useGame();
  const events = state.currentRound?.events || [];
  const [revealedEvents, setRevealedEvents] = useState<number>(0);
  const [sellChoice, setSellChoice] = useState<string | null>(null);
  const [holdChoice, setHoldChoice] = useState<string | null>(null);
  const [phase, setPhase] = useState<'events' | 'decide'>('events');
  const [submitted, setSubmitted] = useState(false);

  // Progressively reveal events
  useEffect(() => {
    if (phase !== 'events') return;
    const interval = setInterval(() => {
      setRevealedEvents(prev => {
        if (prev >= events.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('decide'), 1500);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [events.length, phase]);

  const handleSubmit = () => {
    setSubmitted(true);
    submitDecision({
      type: 'answer',
      payload: { sellChoice, holdChoice },
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
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3">
        <p className="text-purple-300 text-sm font-semibold">
          📋 Un año después... ¿qué pasó con tus inversiones?
        </p>
      </div>

      {/* Event reveals */}
      <AnimatePresence>
        {events.slice(0, revealedEvents).map((e, i) => (
          <motion.div
            key={e.companyId}
            initial={{ opacity: 0, x: -50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className={`p-3 rounded-xl border ${
              e.event.type === 'positive'
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-red-500/30 bg-red-500/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-400 font-semibold">{e.companyId.toUpperCase()}</div>
                <div className="text-sm font-medium text-white">{e.event.text}</div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-lg font-bold ${e.event.impact > 0 ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {e.event.impact > 0 ? '+' : ''}{e.event.impact}%
              </motion.div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading more events */}
      {phase === 'events' && revealedEvents < events.length && (
        <div className="text-center py-4">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-400 text-sm"
          >
            📰 Leyendo noticias del mercado...
          </motion.div>
        </div>
      )}

      {/* Decision phase */}
      {phase === 'decide' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
            <p className="text-amber-300 text-sm font-semibold">
              🤔 Si pudieras vender UNA empresa, ¿cuál sería?
            </p>
          </div>

          <div className="space-y-2">
            {events.map(e => (
              <button
                key={`sell-${e.companyId}`}
                onClick={() => setSellChoice(e.companyId)}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${
                  sellChoice === e.companyId
                    ? 'bg-red-500/20 border-2 border-red-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-sm font-medium">{e.companyId}</span>
                <span className={`text-sm font-bold ${e.event.impact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {e.event.impact > 0 ? '+' : ''}{e.event.impact}%
                </span>
              </button>
            ))}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
            <p className="text-emerald-300 text-sm font-semibold">
              🏆 ¿Cuál mantendrías por 10 AÑOS más?
            </p>
          </div>

          <div className="space-y-2">
            {events.map(e => (
              <button
                key={`hold-${e.companyId}`}
                onClick={() => setHoldChoice(e.companyId)}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${
                  holdChoice === e.companyId
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-sm font-medium">{e.companyId}</span>
                <span className={`text-sm font-bold ${e.event.impact > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {e.event.impact > 0 ? '+' : ''}{e.event.impact}%
                </span>
              </button>
            ))}
          </div>

          {sellChoice && holdChoice && (
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl font-bold text-white"
            >
              ✓ Confirmar Decisiones
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
