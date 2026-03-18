'use client';

import { useState, use } from 'react';
import { motion } from 'framer-motion';
import OldManBuck from '@/components/mascot/OldManBuck';
import { useGame } from '@/lib/game-context';

const AVATARS = [
  { id: 'analyst', emoji: '🧐', name: 'El Analista' },
  { id: 'gut', emoji: '🎲', name: 'El Instintivo' },
  { id: 'nerd', emoji: '🤓', name: 'El Nerd' },
  { id: 'shark', emoji: '🦈', name: 'El Tiburón' },
  { id: 'owl', emoji: '🦉', name: 'El Sabio' },
  { id: 'rocket', emoji: '🚀', name: 'El Arriesgado' },
];

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { state, joinGame } = useGame();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('shark');

  // If already in a game, redirect to home
  if (state.phase !== 'home') {
    if (typeof window !== 'undefined') window.location.href = '/';
    return null;
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">BUFFETT</span>
            {' '}
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">BATTLE</span>
          </h1>
          <div className="mt-2 text-gray-400 text-sm">
            Te invitaron a la sala: <span className="text-white font-mono font-bold text-lg">{code.toUpperCase()}</span>
          </div>
        </motion.div>

        <OldManBuck
          message="¡Otro retador! Pon tu nombre y escoge tu personaje. Rápido, que no me gusta esperar."
          mood="pleased"
          size="large"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mt-6"
        >
          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">Tu nombre</label>
            <input
              type="text"
              maxLength={12}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="¿Cómo te llamas?"
              className="w-full px-4 py-3 bg-gray-900/70 border-2 border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-amber-300 text-sm font-semibold mb-2">Tu personaje</label>
            <div className="grid grid-cols-3 gap-2">
              {AVATARS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAvatar(a.id)}
                  className={`py-3 px-2 rounded-xl border-2 transition-all ${
                    avatar === a.id
                      ? 'border-amber-400 bg-amber-400/20 scale-105'
                      : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl text-center">{a.emoji}</div>
                  <div className="text-xs text-center mt-1 text-gray-300">{a.name}</div>
                </button>
              ))}
            </div>
          </div>

          {state.error && (
            <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm text-center">
              {state.error}
            </div>
          )}

          <button
            onClick={() => {
              if (name.trim()) joinGame(code, name, avatar);
            }}
            disabled={!name.trim()}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-700 rounded-2xl font-bold text-xl text-white disabled:text-gray-400 transition-all active:scale-95"
          >
            🎮 ¡Unirme a la Batalla!
          </button>
        </motion.div>
      </div>
    </div>
  );
}
