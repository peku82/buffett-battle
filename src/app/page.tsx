'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OldManBuck from '@/components/mascot/OldManBuck';
import { useGame } from '@/lib/game-context';
import LobbyScreen from '@/components/screens/LobbyScreen';
import TutorialScreen from '@/components/screens/TutorialScreen';
import GameScreen from '@/components/screens/GameScreen';
import ResultsScreen from '@/components/screens/ResultsScreen';

const AVATARS = [
  { id: 'analyst', emoji: '🧐', name: 'El Analista' },
  { id: 'gut', emoji: '🎲', name: 'El Instintivo' },
  { id: 'nerd', emoji: '🤓', name: 'El Nerd' },
  { id: 'shark', emoji: '🦈', name: 'El Tiburón' },
  { id: 'owl', emoji: '🦉', name: 'El Sabio' },
  { id: 'rocket', emoji: '🚀', name: 'El Arriesgado' },
];

export default function Home() {
  const { state, createGame, joinGame } = useGame();
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('analyst');
  const [code, setCode] = useState('');
  const [moneyEmojis, setMoneyEmojis] = useState<{ id: number; left: number; delay: number }[]>([]);

  // Money rain effect
  useEffect(() => {
    const emojis = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setMoneyEmojis(emojis);
  }, []);

  // Route to correct screen based on game phase
  if (state.phase === 'lobby') return <LobbyScreen />;
  if (state.phase === 'tutorial') return <TutorialScreen />;
  if (state.phase === 'playing') return <GameScreen />;
  if (state.phase === 'results') return <ResultsScreen />;

  return (
    <div className="min-h-dvh relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Money rain background */}
      {moneyEmojis.map(m => (
        <motion.div
          key={m.id}
          className="absolute text-3xl opacity-20 pointer-events-none"
          style={{ left: `${m.left}%`, top: -50 }}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 360] }}
          transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay: m.delay, ease: 'linear' }}
        >
          {['💵', '💰', '📈', '🪙', '💎'][m.id % 5]}
        </motion.div>
      ))}

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(234,179,8,0.1) 35px, rgba(234,179,8,0.1) 70px)`
        }} />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black tracking-tight"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              BUFFETT
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              BATTLE
            </span>
          </motion.h1>
          <p className="text-amber-300/70 mt-2 text-sm font-medium tracking-widest uppercase">
            Aprende a invertir como los grandes
          </p>
        </motion.div>

        {/* Buck mascot */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <OldManBuck
            message={
              mode === 'home'
                ? '¿Dos caras nuevas queriendo hacerse ricos? Veamos si tienen lo que se necesita.'
                : mode === 'create'
                ? 'Pon tu nombre y escoge tu personaje. Y que sea rápido.'
                : 'Escribe el código que te dieron. No me hagas esperar.'
            }
            mood={mode === 'home' ? 'neutral' : 'pleased'}
            size="large"
          />
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <button
                onClick={() => setMode('create')}
                className="w-full py-5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 rounded-2xl font-bold text-xl text-amber-950 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
              >
                🏰 Crear Juego
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full py-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl font-bold text-xl text-white shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                📱 Unirse con Código
              </button>

              {/* Stock ticker */}
              <div className="mt-8 overflow-hidden rounded-xl bg-gray-900/50 border border-gray-700/50 py-2">
                <div className="animate-ticker whitespace-nowrap text-sm font-mono">
                  <span className="text-green-400 mx-4">MUNCHBOX ▲ +2.4%</span>
                  <span className="text-red-400 mx-4">QUICKBYTE ▼ -5.1%</span>
                  <span className="text-green-400 mx-4">SWEETTOOTH ▲ +0.8%</span>
                  <span className="text-green-400 mx-4">FIZZPOP ▲ +1.2%</span>
                  <span className="text-red-400 mx-4">ZAPCHARGE ▼ -8.3%</span>
                  <span className="text-green-400 mx-4">BLOCKBUILDER ▲ +3.1%</span>
                  <span className="text-red-400 mx-4">ROCKETSHIP ▼ -12.7%</span>
                  <span className="text-green-400 mx-4">BRAINWAVE ▲ +4.5%</span>
                </div>
              </div>
            </motion.div>
          )}

          {(mode === 'create' || mode === 'join') && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Name input */}
              <div>
                <label className="block text-amber-300 text-sm font-semibold mb-2">Tu nombre</label>
                <input
                  type="text"
                  maxLength={12}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="w-full px-4 py-3 bg-gray-900/70 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Join code (only for join mode) */}
              {mode === 'join' && (
                <div>
                  <label className="block text-amber-300 text-sm font-semibold mb-2">Código del juego</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Ej: MOAT42"
                    className="w-full px-4 py-3 bg-gray-900/70 border-2 border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none transition-colors text-center text-2xl font-mono tracking-[0.3em]"
                  />
                </div>
              )}

              {/* Avatar selection */}
              <div>
                <label className="block text-amber-300 text-sm font-semibold mb-2">Tu personaje</label>
                <div className="grid grid-cols-3 gap-2">
                  {AVATARS.map(a => (
                    <button
                      key={a.id}
                      onClick={() => setAvatar(a.id)}
                      className={`py-3 px-2 rounded-xl border-2 transition-all ${
                        avatar === a.id
                          ? 'border-amber-400 bg-amber-400/20 scale-105 shadow-lg shadow-amber-400/20'
                          : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-2xl text-center">{a.emoji}</div>
                      <div className="text-xs text-center mt-1 text-gray-300">{a.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error message */}
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm text-center"
                >
                  {state.error}
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('home')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors"
                >
                  ← Atrás
                </button>
                <button
                  onClick={() => {
                    if (!name.trim()) return;
                    if (mode === 'create') createGame(name, avatar);
                    else if (code.trim()) joinGame(code, name, avatar);
                  }}
                  disabled={!name.trim() || (mode === 'join' && !code.trim())}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 rounded-xl font-bold text-amber-950 disabled:text-gray-400 transition-all active:scale-95"
                >
                  {mode === 'create' ? '🚀 Crear Sala' : '🎮 Entrar'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-gray-600 text-xs">
        Buffett Battle v1.0 — Aprende invirtiendo, no perdiendo
      </div>
    </div>
  );
}
