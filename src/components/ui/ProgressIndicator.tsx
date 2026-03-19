'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

const ROUND_ICONS = ['🎯', '🏰', '📊', '💎', '🛡️', '📋'];
const ROUND_NAMES = [
  'Competencia',
  'Foso',
  'Números',
  'Valor',
  'Seguridad',
  'Revisión'
];

export default function ProgressIndicator() {
  const { state } = useGame();
  const currentRound = state.roundNumber;

  return (
    <div className="w-full">
      {/* Round label */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-amber-300/80 tracking-wider uppercase">
          Ronda {currentRound} de 6
        </span>
        {currentRound > 0 && currentRound <= 6 && (
          <span className="text-xs text-gray-400">
            {ROUND_ICONS[currentRound - 1]} {ROUND_NAMES[currentRound - 1]}
          </span>
        )}
      </div>

      {/* Progress bar with round dots */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 6 }).map((_, i) => {
          const roundNum = i + 1;
          const isCompleted = roundNum < currentRound;
          const isCurrent = roundNum === currentRound;
          const isFuture = roundNum > currentRound;

          return (
            <div key={i} className="flex items-center flex-1">
              <motion.div
                className={`relative flex items-center justify-center rounded-full transition-all ${
                  isCompleted
                    ? 'w-6 h-6 bg-emerald-500/30 border border-emerald-400/50'
                    : isCurrent
                    ? 'w-8 h-8 bg-amber-500/30 border-2 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'w-6 h-6 bg-gray-800 border border-gray-700'
                }`}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
              >
                <span className={`${isCurrent ? 'text-sm' : 'text-xs'}`}>
                  {isCompleted ? '✓' : ROUND_ICONS[i]}
                </span>
              </motion.div>
              {/* Connector line */}
              {i < 5 && (
                <div className={`flex-1 h-0.5 mx-0.5 rounded-full ${
                  isCompleted ? 'bg-emerald-500/50' : 'bg-gray-700/50'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
