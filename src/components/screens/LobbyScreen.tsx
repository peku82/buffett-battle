'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'qrcode';
import OldManBuck from '@/components/mascot/OldManBuck';
import GameHeader from '@/components/ui/GameHeader';
import { useGame } from '@/lib/game-context';

export default function LobbyScreen() {
  const { state, startGame } = useGame();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${state.gameId}`
    : '';

  useEffect(() => {
    if (joinUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, joinUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#1e293b', light: '#fef3c7' }
      });
    }
    if (joinUrl) {
      QRCode.toDataURL(joinUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#1e293b', light: '#fef3c7' }
      }).then(setQrDataUrl);
    }
  }, [joinUrl]);

  const isHost = state.players.length > 0 && state.players[0]?.id === state.playerId;
  const hasOpponent = state.players.length === 2;

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4">
      {/* Back to home */}
      <div className="fixed top-3 left-3 z-40">
        <GameHeader />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-amber-400">Sala de Espera</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-gray-400 text-sm">Codigo:</span>
            <span className="text-2xl font-mono font-bold text-white tracking-[0.3em] bg-gray-800 px-4 py-1 rounded-lg">
              {state.gameId}
            </span>
          </div>
        </div>

        {/* Step-by-step instructions */}
        {!hasOpponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl"
          >
            <p className="text-blue-300 text-sm font-semibold mb-2">📋 Pasos para comenzar:</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 text-amber-950 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-gray-300 text-xs">Comparte el <strong className="text-amber-300">codigo QR</strong> o el <strong className="text-amber-300">codigo de sala</strong> con tu oponente</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-gray-500 text-xs">Espera a que se conecte</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-700 text-gray-400 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-gray-500 text-xs">Presiona &quot;Comenzar Batalla&quot;</span>
              </div>
            </div>
          </motion.div>
        )}

        {hasOpponent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
          >
            <p className="text-emerald-300 text-sm font-semibold">
              ✅ ¡Oponente conectado! {isHost ? 'Presiona el boton para comenzar.' : 'Esperando que el host inicie.'}
            </p>
          </motion.div>
        )}

        {/* QR Code */}
        {!hasOpponent && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-amber-100 rounded-2xl p-4 mx-auto w-fit mb-6 shadow-lg shadow-amber-500/20"
          >
            <canvas ref={canvasRef} className="rounded-lg" />
            <p className="text-amber-900 text-center text-xs font-semibold mt-2">
              Escanea para unirte
            </p>
          </motion.div>
        )}

        {/* Players */}
        <div className="space-y-3 mb-6">
          {state.players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ x: i === 0 ? -50 : 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                player.id === state.playerId
                  ? 'border-amber-400/50 bg-amber-400/10'
                  : 'border-emerald-400/50 bg-emerald-400/10'
              }`}
            >
              <span className="text-3xl">
                {['🧐', '🎲', '🤓', '🦈', '🦉', '🚀'][i]}
              </span>
              <div className="flex-1">
                <div className="font-bold text-lg">{player.name}</div>
                <div className="text-xs text-gray-400">
                  {player.id === state.playerId ? 'Tu' : 'Oponente'}
                  {!player.connected && ' (desconectado)'}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${player.connected ? 'bg-green-400' : 'bg-red-400'}`} />
            </motion.div>
          ))}

          {!hasOpponent && (
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-600"
            >
              <span className="text-3xl">👤</span>
              <div className="flex-1">
                <div className="font-bold text-gray-500">Esperando oponente...</div>
                <div className="text-xs text-gray-600">Que escanee el QR o use el codigo</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-gray-600 animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* Buck */}
        <OldManBuck
          message={
            hasOpponent
              ? '¡Ya están los dos! Hora de ver quién tiene madera de inversor. ¡Empiecen!'
              : 'Dile a tu oponente que escanee el código QR. No tengo todo el día.'
          }
          mood={hasOpponent ? 'excited' : 'neutral'}
        />

        {/* Start button (host only) */}
        {isHost && hasOpponent && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 rounded-2xl font-bold text-xl text-white shadow-lg shadow-emerald-500/25 animate-pulse-glow"
          >
            ⚡ ¡COMENZAR BATALLA!
          </motion.button>
        )}

        {!isHost && hasOpponent && (
          <div className="text-center mt-4 text-amber-300/70 text-sm">
            Esperando que el host inicie el juego...
          </div>
        )}
      </motion.div>
    </div>
  );
}
