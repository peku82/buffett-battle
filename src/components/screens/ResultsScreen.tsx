'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OldManBuck from '@/components/mascot/OldManBuck';
import { useGame } from '@/lib/game-context';

const gradeColors: Record<string, string> = {
  'A+': 'from-yellow-400 to-amber-500',
  'A': 'from-emerald-400 to-green-500',
  'B': 'from-blue-400 to-blue-500',
  'C': 'from-amber-400 to-orange-500',
  'D': 'from-orange-400 to-red-500',
  'F': 'from-red-500 to-red-700'
};

const gradeMessages: Record<string, string> = {
  'A+': 'Piensas como Buffett. Me preocupas genuinamente.',
  'A': 'Sólido. Puede que sí seas bueno en esto.',
  'B': 'Nada mal. Sigue estudiando.',
  'C': 'Tienes potencial. Pero también problemas.',
  'D': 'Mi perro escogería mejores acciones.',
  'F': 'Por favor, nunca inviertas dinero real. Te lo suplico.'
};

function getGrade(score: number): string {
  if (score >= 4000) return 'A+';
  if (score >= 3200) return 'A';
  if (score >= 2400) return 'B';
  if (score >= 1600) return 'C';
  if (score >= 800) return 'D';
  return 'F';
}

export default function ResultsScreen() {
  const { state } = useGame();
  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; left: number; delay: number; emoji: string }[]>([]);

  const me = state.players.find(p => p.id === state.playerId);
  const opponent = state.players.find(p => p.id !== state.playerId);
  const iWon = (me?.totalScore || 0) > (opponent?.totalScore || 0);
  const isTie = me?.totalScore === opponent?.totalScore;

  const myGrade = getGrade(me?.totalScore || 0);
  const oppGrade = getGrade(opponent?.totalScore || 0);

  useEffect(() => {
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      emoji: ['🎉', '🏆', '💰', '⭐', '🎊', '💵', '📈', '🪙'][i % 8]
    }));
    setConfettiPieces(pieces);
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  const scoreDiff = Math.abs((me?.totalScore || 0) - (opponent?.totalScore || 0));
  const resultType = scoreDiff > 1000 ? 'dominant' : scoreDiff > 300 ? 'normal' : 'close';

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && confettiPieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute text-2xl pointer-events-none z-50"
          style={{ left: `${p.left}%` }}
          initial={{ y: -50, rotate: 0, opacity: 1 }}
          animate={{ y: '110vh', rotate: 720, opacity: 0 }}
          transition={{ duration: 3 + Math.random() * 2, delay: p.delay, ease: 'easeIn' }}
        >
          {p.emoji}
        </motion.div>
      ))}

      <div className="w-full max-w-lg relative z-10">
        {/* Winner announcement */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-2">{isTie ? '🤝' : iWon ? '🏆' : '💪'}</div>
          <h1 className="text-4xl font-black">
            {isTie ? (
              <span className="text-amber-400">¡EMPATE!</span>
            ) : iWon ? (
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">¡GANASTE!</span>
            ) : (
              <span className="text-gray-300">Casi lo logras</span>
            )}
          </h1>
        </motion.div>

        {/* Score comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* My score */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-4 rounded-2xl border-2 ${iWon && !isTie ? 'border-amber-400 bg-amber-400/10' : 'border-gray-600 bg-gray-900/50'}`}
          >
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">TÚ</div>
              <div className="text-lg font-bold text-white mb-2">{me?.name}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                className={`text-5xl font-black bg-gradient-to-r ${gradeColors[myGrade]} bg-clip-text text-transparent`}
              >
                {myGrade}
              </motion.div>
              <div className="text-2xl font-bold text-white mt-1">{me?.totalScore || 0}</div>
              <div className="text-xs text-gray-400">puntos</div>
            </div>
          </motion.div>

          {/* Opponent score */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-4 rounded-2xl border-2 ${!iWon && !isTie ? 'border-emerald-400 bg-emerald-400/10' : 'border-gray-600 bg-gray-900/50'}`}
          >
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">OPONENTE</div>
              <div className="text-lg font-bold text-white mb-2">{opponent?.name}</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className={`text-5xl font-black bg-gradient-to-r ${gradeColors[oppGrade]} bg-clip-text text-transparent`}
              >
                {oppGrade}
              </motion.div>
              <div className="text-2xl font-bold text-white mt-1">{opponent?.totalScore || 0}</div>
              <div className="text-xs text-gray-400">puntos</div>
            </div>
          </motion.div>
        </div>

        {/* Grade message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <OldManBuck
            message={
              isTie
                ? 'Empate técnico. Ambos son igual de... interesantes. Jueguen de nuevo para desempatar.'
                : iWon && resultType === 'dominant'
                ? `¡Victoria APLASTANTE! ${me?.name}, puede que tengas futuro en esto. PUEDE.`
                : iWon
                ? `Buena victoria, ${me?.name}. Pero no te confíes. La próxima vez ${opponent?.name} te va a dar guerra.`
                : resultType === 'close'
                ? `Perdiste por poco, ${me?.name}. Una decisión diferente y hubieras ganado. Piénsalo.`
                : `${opponent?.name} te ganó. Pero cada gran inversor empezó perdiendo. Inténtalo de nuevo.`
            }
            mood={isTie ? 'neutral' : iWon ? 'excited' : 'pleased'}
            size="large"
          />
        </motion.div>

        {/* Key lesson */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl"
        >
          <div className="text-amber-300 text-sm font-semibold mb-1">📚 Lección del día:</div>
          <p className="text-gray-300 text-sm italic">
            &quot;El mercado de valores es un mecanismo para transferir dinero de los impacientes a los pacientes.&quot;
            <span className="text-amber-400 text-xs block mt-1">— Warren Buffett</span>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="flex gap-3 mt-6"
        >
          <button
            onClick={() => {
              localStorage.removeItem('bb_session');
              window.location.reload();
            }}
            className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl font-bold text-xl text-amber-950 shadow-lg"
          >
            🔄 Jugar de Nuevo
          </button>
        </motion.div>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
          className="mt-4 text-center text-gray-500 text-xs"
        >
          Calificación: {gradeMessages[myGrade]}
        </motion.div>
      </div>
    </div>
  );
}
