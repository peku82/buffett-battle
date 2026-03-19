'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/game-context';

interface GameHeaderProps {
  showProgress?: boolean;
}

export default function GameHeader({ showProgress = false }: GameHeaderProps) {
  const { resetGame } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Back to home button - always visible */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-gray-800/50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Volver al Inicio
      </button>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🚪</div>
                <h3 className="text-xl font-bold text-white">Salir del juego</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Si sales, perderás tu progreso en esta partida. Tu oponente será notificado.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    resetGame();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl font-bold text-white transition-all"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
