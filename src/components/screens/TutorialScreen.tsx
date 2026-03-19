'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OldManBuck from '@/components/mascot/OldManBuck';
import GameHeader from '@/components/ui/GameHeader';
import { useGame } from '@/lib/game-context';

const tutorialSlides = [
  {
    buckMessage: 'Cada uno empieza con $100,000 en dinero de juego. No lo desperdicien.',
    mood: 'neutral' as const,
    visual: '💰',
    title: 'Tu Capital',
    description: 'Tienes $100,000 para invertir sabiamente. Cada peso cuenta.',
    bg: 'from-amber-900/30 to-amber-950/50'
  },
  {
    buckMessage: 'Cada ronda van a ver empresas. Su trabajo: descubrir cuáles REALMENTE valen la pena.',
    mood: 'pleased' as const,
    visual: '🏢',
    title: 'Analiza Empresas',
    description: 'Verán datos reales de empresas. Estudien bien antes de comprar.',
    bg: 'from-blue-900/30 to-blue-950/50'
  },
  {
    buckMessage: 'Les voy a enseñar un truco nuevo en cada ronda. Pongan atención o pierdan hasta la camisa.',
    mood: 'disgusted' as const,
    visual: '🧠',
    title: '6 Lecciones de Inversión',
    description: 'Cada ronda enseña un principio diferente de Warren Buffett.',
    bg: 'from-purple-900/30 to-purple-950/50',
    concepts: [
      { icon: '🎯', name: 'Círculo de Competencia' },
      { icon: '🏰', name: 'Foso Económico' },
      { icon: '📊', name: 'Los Números' },
      { icon: '💎', name: 'Valor Intrínseco' },
      { icon: '🛡️', name: 'Margen de Seguridad' },
      { icon: '📋', name: 'Revisión Final' },
    ]
  },
  {
    buckMessage: 'El que tenga el mejor portafolio al final gana. Así de simple. ¿Listos?',
    mood: 'excited' as const,
    visual: '🏆',
    title: '¡Compite y Gana!',
    description: 'El jugador con mejores decisiones de inversión gana la batalla.',
    bg: 'from-emerald-900/30 to-emerald-950/50'
  }
];

export default function TutorialScreen() {
  const { setReady } = useGame();
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = tutorialSlides[slideIndex];
  const isLast = slideIndex === tutorialSlides.length - 1;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4">
      {/* Back to home */}
      <div className="fixed top-3 left-3 z-40">
        <GameHeader />
      </div>

      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {tutorialSlides.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === slideIndex ? 'bg-amber-400 w-8' : i < slideIndex ? 'bg-amber-600' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Buck */}
        <OldManBuck message={slide.buckMessage} mood={slide.mood} size="large" />

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className={`mt-6 p-6 rounded-2xl bg-gradient-to-br ${slide.bg} border border-white/10 backdrop-blur-sm`}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {slide.visual}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
              <p className="text-gray-300">{slide.description}</p>

              {/* Concepts list (slide 3) */}
              {slide.concepts && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {slide.concepts.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="text-sm text-gray-300">{c.name}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {slideIndex > 0 && (
            <button
              onClick={() => setSlideIndex(s => s - 1)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors"
            >
              ← Atrás
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                setReady();
              } else {
                setSlideIndex(s => s + 1);
              }
            }}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
              isLast
                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25 animate-pulse-glow'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950'
            }`}
          >
            {isLast ? '⚡ ¡ESTOY LISTO!' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
