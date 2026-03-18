import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketServer } from 'socket.io';
import {
  GameState,
  createGameState,
  addPlayer,
  startRound,
  advanceRoundPhase,
  submitDecision,
  bothPlayersDecided,
  generateRoomCode,
  PlayerDecision
} from './src/game-engine/state-machine';
import { getRandomQuip, getCompetitiveQuip } from './src/game-engine/buck-dialogue';
import { v4 as uuid } from 'uuid';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory game store
const games = new Map<string, GameState>();
const socketToPlayer = new Map<string, { gameId: string; playerId: string }>();

// Cleanup old games every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, game] of games) {
    if (now - game.createdAt > 45 * 60 * 1000) {
      games.delete(id);
    }
  }
}, 30 * 60 * 1000);

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    cors: { origin: '*' },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // Create a new game room
    socket.on('create_game', (data: { playerName: string; avatar: string }, callback) => {
      const gameId = generateRoomCode();
      const playerId = uuid();
      const game = createGameState(gameId);

      const updatedGame = addPlayer(game, {
        id: playerId,
        name: data.playerName,
        avatar: data.avatar,
        socketId: socket.id
      });

      games.set(gameId, updatedGame);
      socketToPlayer.set(socket.id, { gameId, playerId });
      socket.join(gameId);

      console.log(`[Game] Created: ${gameId} by ${data.playerName}`);

      callback({
        success: true,
        gameId,
        playerId,
        qrUrl: `${process.env.NEXT_PUBLIC_URL || `http://localhost:${port}`}/join/${gameId}`
      });
    });

    // Join an existing game
    socket.on('join_game', (data: { gameId: string; playerName: string; avatar: string }, callback) => {
      const game = games.get(data.gameId.toUpperCase());

      if (!game) {
        callback({ success: false, error: 'Juego no encontrado' });
        return;
      }

      const playerCount = Object.keys(game.players).length;
      if (playerCount >= 2) {
        callback({ success: false, error: 'El juego ya está lleno' });
        return;
      }

      if (game.phase !== 'lobby') {
        callback({ success: false, error: 'El juego ya empezó' });
        return;
      }

      const playerId = uuid();
      const updatedGame = addPlayer(game, {
        id: playerId,
        name: data.playerName,
        avatar: data.avatar,
        socketId: socket.id
      });

      games.set(data.gameId.toUpperCase(), updatedGame);
      socketToPlayer.set(socket.id, { gameId: data.gameId.toUpperCase(), playerId });
      socket.join(data.gameId.toUpperCase());

      console.log(`[Game] ${data.playerName} joined ${data.gameId}`);

      callback({ success: true, playerId });

      // Notify room
      io.to(data.gameId.toUpperCase()).emit('player_joined', {
        player: updatedGame.players[playerId],
        players: Object.values(updatedGame.players)
      });
    });

    // Player is ready (finished tutorial)
    socket.on('player_ready', () => {
      const mapping = socketToPlayer.get(socket.id);
      if (!mapping) return;

      const game = games.get(mapping.gameId);
      if (!game) return;

      game.players[mapping.playerId].ready = true;
      games.set(mapping.gameId, game);

      const allReady = Object.values(game.players).every(p => p.ready);
      const enoughPlayers = Object.keys(game.players).length === 2;

      if (allReady && enoughPlayers) {
        // Start the game!
        const updatedGame = startRound({ ...game, phase: 'playing' });
        games.set(mapping.gameId, updatedGame);

        io.to(mapping.gameId).emit('game_start', {
          round: updatedGame.currentRound,
          players: Object.values(updatedGame.players)
        });

        // Auto-advance from teach phase after timer
        schedulePhaseAdvance(mapping.gameId, io);
      } else {
        io.to(mapping.gameId).emit('player_ready_update', {
          playerId: mapping.playerId,
          allReady
        });
      }
    });

    // Submit a decision for current round
    socket.on('submit_decision', (data: { decision: PlayerDecision }, callback) => {
      const mapping = socketToPlayer.get(socket.id);
      if (!mapping) return;

      const game = games.get(mapping.gameId);
      if (!game || !game.currentRound) return;

      const updatedGame = submitDecision(game, mapping.playerId, data.decision);
      games.set(mapping.gameId, updatedGame);

      // Notify opponent that this player decided (no details)
      socket.to(mapping.gameId).emit('opponent_decided');

      callback({ success: true });

      // If both decided, advance to reveal
      if (bothPlayersDecided(updatedGame)) {
        clearTimerForGame(mapping.gameId);
        advanceToReveal(mapping.gameId, io);
      }
    });

    // Start game (host only)
    socket.on('start_game', () => {
      const mapping = socketToPlayer.get(socket.id);
      if (!mapping) return;

      const game = games.get(mapping.gameId);
      if (!game) return;

      if (Object.keys(game.players).length < 2) {
        socket.emit('error_msg', { message: 'Necesitas 2 jugadores para empezar' });
        return;
      }

      // Move to tutorial
      game.phase = 'tutorial';
      games.set(mapping.gameId, game);

      io.to(mapping.gameId).emit('tutorial_start', {
        players: Object.values(game.players)
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const mapping = socketToPlayer.get(socket.id);
      if (!mapping) return;

      const game = games.get(mapping.gameId);
      if (!game) return;

      console.log(`[Socket] Disconnected: ${socket.id} from game ${mapping.gameId}`);

      game.players[mapping.playerId].connected = false;
      games.set(mapping.gameId, game);

      socket.to(mapping.gameId).emit('player_disconnected', {
        playerId: mapping.playerId
      });

      // Grace period: 30 seconds to reconnect
      setTimeout(() => {
        const currentGame = games.get(mapping.gameId);
        if (!currentGame) return;
        if (!currentGame.players[mapping.playerId]?.connected) {
          // Player didn't reconnect, forfeit
          io.to(mapping.gameId).emit('player_forfeited', {
            playerId: mapping.playerId
          });
        }
      }, 30000);

      socketToPlayer.delete(socket.id);
    });

    // Reconnect
    socket.on('reconnect_game', (data: { gameId: string; playerId: string }, callback) => {
      const game = games.get(data.gameId);
      if (!game || !game.players[data.playerId]) {
        callback({ success: false });
        return;
      }

      game.players[data.playerId].connected = true;
      game.players[data.playerId].socketId = socket.id;
      games.set(data.gameId, game);
      socketToPlayer.set(socket.id, { gameId: data.gameId, playerId: data.playerId });
      socket.join(data.gameId);

      callback({
        success: true,
        gameState: {
          phase: game.phase,
          round: game.currentRound,
          players: Object.values(game.players),
          roundNumber: game.roundNumber
        }
      });

      socket.to(data.gameId).emit('player_reconnected', {
        playerId: data.playerId
      });
    });
  });

  // Timer management
  const gameTimers = new Map<string, NodeJS.Timeout>();

  function clearTimerForGame(gameId: string) {
    const timer = gameTimers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      gameTimers.delete(gameId);
    }
  }

  function schedulePhaseAdvance(gameId: string, io: SocketServer) {
    const game = games.get(gameId);
    if (!game || !game.currentRound) return;

    const timeLeft = game.currentRound.timerEnd - Date.now();
    clearTimerForGame(gameId);

    const timer = setTimeout(() => {
      const currentGame = games.get(gameId);
      if (!currentGame || !currentGame.currentRound) return;

      const phase = currentGame.currentRound.phase;

      if (phase === 'decide') {
        // Auto-pass for players who didn't decide
        Object.values(currentGame.players).forEach(p => {
          if (!p.currentDecision) {
            currentGame.players[p.id].currentDecision = {
              type: 'pass',
              timestamp: Date.now()
            };
          }
        });
        games.set(gameId, currentGame);
        advanceToReveal(gameId, io);
      } else if (phase === 'score') {
        // Move to next round or results
        const nextRound = startRound(currentGame);
        games.set(gameId, nextRound);

        if (nextRound.phase === 'results') {
          io.to(gameId).emit('game_over', {
            players: Object.values(nextRound.players)
          });
        } else {
          const quip = getRandomQuip();
          io.to(gameId).emit('round_start', {
            round: nextRound.currentRound,
            quip
          });
          schedulePhaseAdvance(gameId, io);
        }
      } else {
        // Advance to next phase
        const advanced = advanceRoundPhase(currentGame);
        games.set(gameId, advanced);

        io.to(gameId).emit('phase_change', {
          round: advanced.currentRound
        });
        schedulePhaseAdvance(gameId, io);
      }
    }, Math.max(timeLeft, 1000));

    gameTimers.set(gameId, timer);
  }

  function advanceToReveal(gameId: string, io: SocketServer) {
    const game = games.get(gameId);
    if (!game) return;

    // Move to reveal phase
    let advanced = advanceRoundPhase(game);
    // Skip to reveal if not already there
    while (advanced.currentRound && advanced.currentRound.phase !== 'reveal') {
      advanced = advanceRoundPhase(advanced);
    }
    games.set(gameId, advanced);

    const players = Object.values(advanced.players);
    const decisions = players.map(p => ({
      playerId: p.id,
      playerName: p.name,
      decision: p.currentDecision
    }));

    // Determine if one player is leading for competitive quip
    let quip = '';
    if (players.length === 2 && players[0].totalScore !== players[1].totalScore) {
      const [winner, loser] = players[0].totalScore > players[1].totalScore
        ? [players[0], players[1]]
        : [players[1], players[0]];
      if (Math.random() > 0.5) {
        quip = getCompetitiveQuip(winner.name, loser.name);
      }
    }

    io.to(gameId).emit('round_reveal', {
      decisions,
      round: advanced.currentRound,
      competitiveQuip: quip
    });

    // Auto advance to score after reveal timer
    schedulePhaseAdvance(gameId, io);
  }

  httpServer.listen(port, () => {
    console.log(`> Buffett Battle running on http://${hostname}:${port}`);
  });
});
