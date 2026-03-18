'use client';

import { motion, AnimatePresence } from 'framer-motion';
import OldManBuck from '@/components/mascot/OldManBuck';
import TimerBar from '@/components/ui/TimerBar';
import ScoreBoard from '@/components/ui/ScoreBoard';
import { useGame } from '@/lib/game-context';
import Round1 from '@/components/rounds/Round1';
import Round2 from '@/components/rounds/Round2';
import Round3 from '@/components/rounds/Round3';
import Round4 from '@/components/rounds/Round4';
import Round5 from '@/components/rounds/Round5';
import Round6 from '@/components/rounds/Round6';

const RoundComponents: Record<number, React.ComponentType> = {
  1: Round1,
  2: Round2,
  3: Round3,
  4: Round4,
  5: Round5,
  6: Round6,
};

export default function GameScreen() {
  const { state } = useGame();
  const round = state.currentRound;

  if (!round) return <div className="min-h-dvh flex items-center justify-center text-white">Cargando...</div>;

  const RoundComponent = RoundComponents[round.number] || Round1;
  const isTeachPhase = round.phase === 'teach';
  const isRevealPhase = round.phase === 'reveal';

  return (
    <div className="min-h-dvh flex flex-col p-3 sm:p-4 max-w-xl mx-auto">
      {/* Header: Round info + Score */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{round.concept.icon}</span>
            <div>
              <div className="text-xs text-gray-400 font-mono">RONDA {round.number}/6</div>
              <div className="text-sm font-bold text-amber-300">{round.concept.title}</div>
            </div>
          </div>
          {state.opponentDecided && round.phase === 'decide' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30"
            >
              ✓ Oponente decidió
            </motion.div>
          )}
        </div>
        <ScoreBoard />
        <TimerBar endTime={round.timerEnd} />
      </div>

      {/* Teach phase: Buck explains */}
      <AnimatePresence mode="wait">
        {isTeachPhase && (
          <motion.div
            key="teach"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <OldManBuck
              message={round.concept.buckIntro}
              mood="neutral"
              size="large"
            />
            <div className="mt-4 text-center">
              <div className="text-6xl mb-3">{round.concept.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{round.concept.title}</h2>
              <p className="text-gray-400">{round.concept.description}</p>
            </div>
          </motion.div>
        )}

        {/* Reveal phase */}
        {isRevealPhase && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-bold text-amber-300 mb-4">¡Resultados!</h3>
            <div className="space-y-3 w-full">
              {state.decisions.map((d, i) => (
                <motion.div
                  key={d.playerId}
                  initial={{ x: i === 0 ? -50 : 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.3 }}
                  className={`p-4 rounded-xl border ${
                    d.playerId === state.playerId
                      ? 'border-amber-400/50 bg-amber-400/10'
                      : 'border-emerald-400/50 bg-emerald-400/10'
                  }`}
                >
                  <div className="font-bold">{d.playerName}</div>
                  <div className="text-sm text-gray-300">
                    {(d.decision as { type: string })?.type === 'buy'
                      ? `Compró: ${(d.decision as { companyId?: string })?.companyId || 'una empresa'}`
                      : 'Pasó (no compró)'}
                  </div>
                </motion.div>
              ))}
            </div>
            {state.competitiveQuip && (
              <div className="mt-4">
                <OldManBuck message={state.competitiveQuip} mood="pleased" />
              </div>
            )}
          </motion.div>
        )}

        {/* Analyze/Decide phases: Show round component */}
        {!isTeachPhase && !isRevealPhase && round.phase !== 'score' && (
          <motion.div
            key={`round-${round.number}-${round.phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto"
          >
            <RoundComponent />
          </motion.div>
        )}

        {/* Score phase */}
        {round.phase === 'score' && (
          <motion.div
            key="score"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <OldManBuck
              message={state.buckMessage || 'Veamos cómo les fue...'}
              mood={(state.buckMood as 'neutral' | 'pleased' | 'excited' | 'disgusted') || 'neutral'}
              size="large"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
