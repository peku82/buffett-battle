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

const MONEY = ['💵', '💰', '📈', '🪙', '💎'];

export default function Home() {
  const { state, createGame, joinGame } = useGame();
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('analyst');
  const [code, setCode] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (state.phase === 'lobby') return <LobbyScreen />;
  if (state.phase === 'tutorial') return <TutorialScreen />;
  if (state.phase === 'playing') return <GameScreen />;
  if (state.phase === 'results') return <ResultsScreen />;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      {/* Money rain — absolutely positioned in the page flow */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-15"
              style={{ left: `${(i * 8.3) % 100}%` }}
              initial={{ y: -40, rotate: 0 }}
              animate={{ y: '105vh', rotate: 360 }}
              transition={{
                duration: 7 + (i % 4) * 2,
                repeat: Infinity,
                delay: (i * 0.8) % 5,
                ease: 'linear'
              }}
            >
              {MONEY[i % 5]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-4">

          {/* Logo */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                BUFFETT
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                BATTLE
              </span>
            </h1>
            <p className="text-amber-300/60 mt-1 text-sm font-medium tracking-widest uppercase">
              Aprende a invertir como los grandes
            </p>
          </div>

          {/* Buck mascot */}
          {mounted && (
            <OldManBuck
              message={
                mode === 'home'
                  ? '¿Dos caras nuevas queriendo hacerse ricos? Veamos si tienen lo que se necesita.'
                  : mode === 'create'
                  ? 'Pon tu nombre y escoge tu personaje. Y que sea rápido.'
                  : 'Escribe el código que te dieron. No me hagas esperar.'
              }
              mood={mode === 'home' ? 'neutral' : 'pleased'}
            />
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            {mode === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
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
                <div className="overflow-hidden rounded-xl bg-gray-900/50 border border-gray-700/50 py-2">
                  <div className="animate-ticker whitespace-nowrap text-sm font-mono">
                    <span className="text-green-400 mx-4">MUNCHBOX ▲ +2.4%</span>
                    <span className="text-red-400 mx-4">QUICKBYTE ▼ -5.1%</span>
                    <span className="text-green-400 mx-4">SWEETTOOTH ▲ +0.8%</span>
                    <span className="text-green-400 mx-4">FIZZPOP ▲ +1.2%</span>
                    <span className="text-red-400 mx-4">ZAPCHARGE ▼ -8.3%</span>
                    <span className="text-green-400 mx-4">BLOCKBUILDER ▲ +3.1%</span>
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
                className="space-y-3"
              >
                <div>
                  <label className="block text-amber-300 text-sm font-semibold mb-1">Tu nombre</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="¿Cómo te llamas?"
                    className="w-full px-4 py-3 bg-gray-900/70 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {mode === 'join' && (
                  <div>
                    <label className="block text-amber-300 text-sm font-semibold mb-1">Código del juego</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={code}
                      onChange={e => setCode(e.target.value.toUpperCase())}
                      placeholder="Ej: MOAT42"
                      className="w-full px-4 py-3 bg-gray-900/70 border-2 border-emerald-500/30 rounded-xl text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none text-center text-2xl font-mono tracking-[0.3em]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-amber-300 text-sm font-semibold mb-1">Tu personaje</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATARS.map(a => (
                      <button
                        key={a.id}
                        onClick={() => setAvatar(a.id)}
                        className={`py-2 px-2 rounded-xl border-2 transition-all ${
                          avatar === a.id
                            ? 'border-amber-400 bg-amber-400/20 scale-105'
                            : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="text-2xl text-center">{a.emoji}</div>
                        <div className="text-xs text-center mt-0.5 text-gray-300">{a.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {state.error && (
                  <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
                    {state.error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setMode('home')}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold"
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
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-amber-950 disabled:text-gray-400 transition-all active:scale-95"
                  >
                    {mode === 'create' ? '🚀 Crear Sala' : '🎮 Entrar'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 text-center text-gray-600 text-xs">
          Buffett Battle v1.0 — Aprende invirtiendo, no perdiendo
        </div>
      </div>
    </div>
  );
}
