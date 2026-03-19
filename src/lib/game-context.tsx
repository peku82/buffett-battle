'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { getSocket } from './socket';

// Types matching server
interface Player {
  id: string;
  name: string;
  avatar: string;
  cash: number;
  totalScore: number;
  roundScores: number[];
  connected: boolean;
  ready: boolean;
}

interface RoundConcept {
  title: string;
  titleEn: string;
  icon: string;
  buckIntro: string;
  description: string;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  descriptionDifficulty: string;
  financials: {
    revenue: string;
    profitMargin: number;
    growth: number;
    debtLevel: string;
    roe: number;
    freeCashFlow: string;
    trend: string;
    consistency: string;
  };
  moatType: string;
  moatStrength: number;
  moatDescription: string;
  intrinsicValue: number;
  marketPrices: { undervalued: number; overvalued: number };
  hiddenStrength: string;
  hiddenWeakness: string;
  annualProfit: number;
  growthRate: number;
}

interface RoundState {
  number: number;
  phase: string;
  companies: Company[];
  concept: RoundConcept;
  timerEnd: number;
  events?: { companyId: string; event: { text: string; impact: number; type: string } }[];
}

interface GameContextState {
  phase: 'home' | 'lobby' | 'tutorial' | 'playing' | 'results';
  gameId: string | null;
  playerId: string | null;
  players: Player[];
  currentRound: RoundState | null;
  roundNumber: number;
  opponentDecided: boolean;
  buckMessage: string;
  buckMood: string;
  error: string | null;
  decisions: { playerId: string; playerName: string; decision: unknown }[];
  competitiveQuip: string;
}

type GameAction =
  | { type: 'SET_GAME'; gameId: string; playerId: string }
  | { type: 'SET_PHASE'; phase: GameContextState['phase'] }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'PLAYER_JOINED'; players: Player[] }
  | { type: 'GAME_START'; round: RoundState; players: Player[] }
  | { type: 'ROUND_START'; round: RoundState; quip?: string }
  | { type: 'PHASE_CHANGE'; round: RoundState }
  | { type: 'OPPONENT_DECIDED' }
  | { type: 'ROUND_REVEAL'; decisions: unknown[]; round: RoundState; quip: string }
  | { type: 'GAME_OVER'; players: Player[] }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_BUCK'; message: string; mood: string }
  | { type: 'PLAYER_DISCONNECTED'; playerId: string }
  | { type: 'PLAYER_RECONNECTED'; playerId: string }
  | { type: 'RESET_GAME' };

const initialState: GameContextState = {
  phase: 'home',
  gameId: null,
  playerId: null,
  players: [],
  currentRound: null,
  roundNumber: 0,
  opponentDecided: false,
  buckMessage: '',
  buckMood: 'neutral',
  error: null,
  decisions: [],
  competitiveQuip: ''
};

function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_GAME':
      return { ...state, gameId: action.gameId, playerId: action.playerId };
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'SET_PLAYERS':
    case 'PLAYER_JOINED':
      return { ...state, players: action.players };
    case 'GAME_START':
      return {
        ...state,
        phase: 'playing',
        currentRound: action.round,
        players: action.players,
        roundNumber: action.round.number,
        opponentDecided: false
      };
    case 'ROUND_START':
      return {
        ...state,
        currentRound: action.round,
        roundNumber: action.round.number,
        opponentDecided: false,
        buckMessage: action.quip || '',
        buckMood: 'neutral',
        decisions: []
      };
    case 'PHASE_CHANGE':
      return { ...state, currentRound: action.round };
    case 'OPPONENT_DECIDED':
      return { ...state, opponentDecided: true };
    case 'ROUND_REVEAL':
      return {
        ...state,
        currentRound: action.round,
        decisions: action.decisions as GameContextState['decisions'],
        competitiveQuip: action.quip
      };
    case 'GAME_OVER':
      return { ...state, phase: 'results', players: action.players };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_BUCK':
      return { ...state, buckMessage: action.message, buckMood: action.mood };
    case 'PLAYER_DISCONNECTED':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, connected: false } : p
        )
      };
    case 'PLAYER_RECONNECTED':
      return {
        ...state,
        players: state.players.map(p =>
          p.id === action.playerId ? { ...p, connected: true } : p
        )
      };
    case 'RESET_GAME':
      return { ...initialState };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameContextState;
  dispatch: React.Dispatch<GameAction>;
  createGame: (name: string, avatar: string) => void;
  joinGame: (code: string, name: string, avatar: string) => void;
  startGame: () => void;
  setReady: () => void;
  submitDecision: (decision: unknown) => void;
  resetGame: () => void;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const socket = getSocket();

    socket.on('player_joined', (data) => {
      dispatch({ type: 'PLAYER_JOINED', players: data.players });
    });

    socket.on('tutorial_start', (data) => {
      dispatch({ type: 'SET_PLAYERS', players: data.players });
      dispatch({ type: 'SET_PHASE', phase: 'tutorial' });
    });

    socket.on('game_start', (data) => {
      dispatch({ type: 'GAME_START', round: data.round, players: data.players });
    });

    socket.on('round_start', (data) => {
      dispatch({ type: 'ROUND_START', round: data.round, quip: data.quip });
    });

    socket.on('phase_change', (data) => {
      dispatch({ type: 'PHASE_CHANGE', round: data.round });
    });

    socket.on('opponent_decided', () => {
      dispatch({ type: 'OPPONENT_DECIDED' });
    });

    socket.on('round_reveal', (data) => {
      dispatch({
        type: 'ROUND_REVEAL',
        decisions: data.decisions,
        round: data.round,
        quip: data.competitiveQuip
      });
    });

    socket.on('game_over', (data) => {
      dispatch({ type: 'GAME_OVER', players: data.players });
    });

    socket.on('error_msg', (data) => {
      dispatch({ type: 'SET_ERROR', error: data.message });
    });

    socket.on('player_disconnected', (data) => {
      dispatch({ type: 'PLAYER_DISCONNECTED', playerId: data.playerId });
    });

    socket.on('player_reconnected', (data) => {
      dispatch({ type: 'PLAYER_RECONNECTED', playerId: data.playerId });
    });

    // Check for saved session
    const savedGame = typeof window !== 'undefined' ? localStorage.getItem('bb_session') : null;
    if (savedGame) {
      const { gameId, playerId } = JSON.parse(savedGame);
      socket.emit('reconnect_game', { gameId, playerId }, (res: { success: boolean; gameState?: unknown }) => {
        if (res.success && res.gameState) {
          dispatch({ type: 'SET_GAME', gameId, playerId });
          const gs = res.gameState as { phase: string; players: Player[]; round: RoundState; roundNumber: number };
          dispatch({ type: 'SET_PLAYERS', players: gs.players });
          if (gs.round) {
            dispatch({ type: 'ROUND_START', round: gs.round });
          }
          dispatch({ type: 'SET_PHASE', phase: gs.phase as GameContextState['phase'] });
        }
      });
    }

    return () => {
      socket.off('player_joined');
      socket.off('tutorial_start');
      socket.off('game_start');
      socket.off('round_start');
      socket.off('phase_change');
      socket.off('opponent_decided');
      socket.off('round_reveal');
      socket.off('game_over');
      socket.off('error_msg');
      socket.off('player_disconnected');
      socket.off('player_reconnected');
    };
  }, []);

  const createGame = useCallback((name: string, avatar: string) => {
    const socket = getSocket();
    socket.emit('create_game', { playerName: name, avatar }, (res: { success: boolean; gameId?: string; playerId?: string; qrUrl?: string }) => {
      if (res.success && res.gameId && res.playerId) {
        dispatch({ type: 'SET_GAME', gameId: res.gameId, playerId: res.playerId });
        dispatch({ type: 'SET_PHASE', phase: 'lobby' });
        localStorage.setItem('bb_session', JSON.stringify({ gameId: res.gameId, playerId: res.playerId }));
      }
    });
  }, []);

  const joinGame = useCallback((code: string, name: string, avatar: string) => {
    const socket = getSocket();
    socket.emit('join_game', { gameId: code.toUpperCase(), playerName: name, avatar }, (res: { success: boolean; playerId?: string; error?: string }) => {
      if (res.success && res.playerId) {
        dispatch({ type: 'SET_GAME', gameId: code.toUpperCase(), playerId: res.playerId });
        dispatch({ type: 'SET_PHASE', phase: 'lobby' });
        localStorage.setItem('bb_session', JSON.stringify({ gameId: code.toUpperCase(), playerId: res.playerId }));
      } else {
        dispatch({ type: 'SET_ERROR', error: res.error || 'Error al unirse' });
      }
    });
  }, []);

  const startGame = useCallback(() => {
    getSocket().emit('start_game');
  }, []);

  const setReady = useCallback(() => {
    getSocket().emit('player_ready');
  }, []);

  const submitDecisionFn = useCallback((decision: unknown) => {
    getSocket().emit('submit_decision', { decision }, () => { });
  }, []);

  const resetGame = useCallback(() => {
    // Notify server we're leaving
    const socket = getSocket();
    socket.emit('leave_game');
    // Clear saved session
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bb_session');
      localStorage.removeItem('bb_tutorial_seen');
    }
    // Reset client state
    dispatch({ type: 'RESET_GAME' });
    // Disconnect and reconnect socket cleanly
    socket.disconnect();
    setTimeout(() => socket.connect(), 100);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, createGame, joinGame, startGame, setReady, submitDecision: submitDecisionFn, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
