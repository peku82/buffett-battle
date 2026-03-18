'use client';

import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';

export default function ScoreBoard() {
  const { state } = useGame();
  const me = state.players.find(p => p.id === state.playerId);
  const opponent = state.players.find(p => p.id !== state.playerId);

  return (
    <div className="flex items-center justify-between gap-2 bg-gray-900/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-700/50">
      {/* Me */}
      <div className="flex items-center gap-2 flex-1">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm">
          {me ? '🧐' : '?'}
        </div>
        <div className="min-w-0">
          <div className="text-xs text-amber-300 font-semibold truncate">{me?.name || 'Tú'}</div>
          <div className="text-sm font-bold text-white">{me?.totalScore || 0} pts</div>
        </div>
      </div>

      {/* VS */}
      <div className="px-2">
        <span className="text-xs text-gray-500 font-bold">VS</span>
      </div>

      {/* Opponent */}
      <div className="flex items-center gap-2 flex-1 justify-end text-right">
        <div className="min-w-0">
          <div className="text-xs text-emerald-300 font-semibold truncate">{opponent?.name || '...'}</div>
          <div className="text-sm font-bold text-white">{opponent?.totalScore || 0} pts</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">
          {opponent ? '🦈' : '?'}
        </div>
      </div>
    </div>
  );
}
