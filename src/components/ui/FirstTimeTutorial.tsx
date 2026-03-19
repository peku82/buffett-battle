'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_TIPS = [
  {
    icon: '🎯',
    title: 'Analiza',
    description: 'Lee los datos de cada empresa antes de decidir.',
    visual: '📊'
  },
  {
    icon: '⏱️',
    title: 'Decide a tiempo',
    description: 'Cada ronda tiene un reloj. Si no decides, se pasa automáticamente.',
    visual: '🕐'
  },
  {
    icon: '🧠',
    title: 'Aprende de Buck',
    description: 'El viejo Buck te enseña un concepto de inversión en cada ronda.',
    visual: '🤓'
  },
  {
    icon: '🏆',
    title: 'Compite',
    description: 'El que tome mejores decisiones de inversión gana al final.',
    visual: '💰'
  }
];

export default function FirstTimeTutorial() {
  const [show, setShow] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('bb_tutorial_seen');
      if (!seen) {
        setShow(true);
      }
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bb_tutorial_seen', 'true');
    }
  };

  const nextTip = () => {
    if (tipIndex < QUICK_TIPS.length - 1) {
      setTipIndex(tipIndex + 1);
    } else {
      dismiss();
    }
  };

  if (!show) return null;

  const tip = QUICK_TIPS[tipIndex];
  const isLast = tipIndex === QUICK_TIPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-1">
            <span className="text-xs text-amber-400/60 font-semibold uppercase tracking-widest">Guia rapida</span>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-4">
            {QUICK_TIPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === tipIndex ? 'bg-amber-400 w-6' : i < tipIndex ? 'bg-amber-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Tip content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tipIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {tip.visual}
              </motion.div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg">{tip.icon}</span>
                <h3 className="text-xl font-bold text-white">{tip.title}</h3>
              </div>
              <p className="text-gray-300 text-sm">{tip.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={dismiss}
              className="px-4 py-2.5 text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Saltar
            </button>
            <button
              onClick={nextTip}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                isLast
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950'
              }`}
            >
              {isLast ? '¡Entendido!' : 'Siguiente →'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
