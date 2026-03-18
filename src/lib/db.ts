import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'buffett-battle.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure directory exists
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    -- Player profiles (persistent across games)
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      total_xp INTEGER DEFAULT 0,
      games_played INTEGER DEFAULT 0,
      games_won INTEGER DEFAULT 0,
      best_score INTEGER DEFAULT 0,
      best_grade TEXT DEFAULT 'F',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Game history
    CREATE TABLE IF NOT EXISTS game_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_code TEXT NOT NULL,
      player1_id TEXT,
      player2_id TEXT,
      player1_score INTEGER,
      player2_score INTEGER,
      winner_id TEXT,
      difficulty_level INTEGER DEFAULT 1,
      played_at TEXT DEFAULT (datetime('now'))
    );

    -- Round scores per game
    CREATE TABLE IF NOT EXISTS round_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_code TEXT NOT NULL,
      player_id TEXT NOT NULL,
      round_number INTEGER NOT NULL,
      concept TEXT NOT NULL,
      score INTEGER NOT NULL,
      details TEXT -- JSON
    );

    -- Achievements/badges
    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id TEXT NOT NULL,
      achievement_key TEXT NOT NULL,
      achievement_name TEXT NOT NULL,
      description TEXT,
      earned_at TEXT DEFAULT (datetime('now')),
      UNIQUE(player_id, achievement_key)
    );

    -- Leaderboard
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id TEXT NOT NULL,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      grade TEXT NOT NULL,
      level INTEGER DEFAULT 1,
      played_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

// Player operations
export function getOrCreatePlayer(id: string, name: string, avatar: string) {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM players WHERE id = ?').get(id);
  if (existing) {
    db.prepare('UPDATE players SET name = ?, avatar = ?, updated_at = datetime("now") WHERE id = ?')
      .run(name, avatar, id);
    return db.prepare('SELECT * FROM players WHERE id = ?').get(id);
  }
  db.prepare('INSERT INTO players (id, name, avatar) VALUES (?, ?, ?)').run(id, name, avatar);
  return db.prepare('SELECT * FROM players WHERE id = ?').get(id);
}

export function getPlayerProfile(id: string) {
  return getDb().prepare('SELECT * FROM players WHERE id = ?').get(id) as {
    id: string; name: string; level: number; total_xp: number;
    games_played: number; games_won: number; best_score: number; best_grade: string;
  } | undefined;
}

export function updatePlayerAfterGame(
  playerId: string,
  score: number,
  won: boolean,
  grade: string
) {
  const db = getDb();
  const player = getPlayerProfile(playerId);
  if (!player) return;

  const xpGained = Math.floor(score / 10);
  const newXp = player.total_xp + xpGained;
  const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP

  db.prepare(`
    UPDATE players SET
      total_xp = ?,
      level = ?,
      games_played = games_played + 1,
      games_won = games_won + ?,
      best_score = MAX(best_score, ?),
      best_grade = CASE WHEN ? > best_score THEN ? ELSE best_grade END,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(newXp, newLevel, won ? 1 : 0, score, score, grade, playerId);

  return { xpGained, newLevel, leveledUp: newLevel > player.level };
}

export function saveGameHistory(
  gameCode: string,
  player1Id: string,
  player2Id: string,
  player1Score: number,
  player2Score: number,
  winnerId: string | null,
  difficultyLevel: number
) {
  getDb().prepare(`
    INSERT INTO game_history (game_code, player1_id, player2_id, player1_score, player2_score, winner_id, difficulty_level)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(gameCode, player1Id, player2Id, player1Score, player2Score, winnerId, difficultyLevel);
}

export function saveRoundScore(gameCode: string, playerId: string, roundNumber: number, concept: string, score: number, details: string) {
  getDb().prepare(`
    INSERT INTO round_scores (game_code, player_id, round_number, concept, score, details)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(gameCode, playerId, roundNumber, concept, score, details);
}

export function checkAndAwardAchievements(playerId: string): { key: string; name: string; description: string }[] {
  const db = getDb();
  const player = getPlayerProfile(playerId);
  if (!player) return [];

  const earned: { key: string; name: string; description: string }[] = [];

  const achievements = [
    { key: 'first_game', name: '🎮 Primer Juego', description: 'Jugaste tu primera partida', condition: player.games_played >= 1 },
    { key: 'five_games', name: '🔥 Inversor Dedicado', description: 'Jugaste 5 partidas', condition: player.games_played >= 5 },
    { key: 'first_win', name: '🏆 Primera Victoria', description: 'Ganaste tu primera partida', condition: player.games_won >= 1 },
    { key: 'grade_a', name: '⭐ Calificación A', description: 'Obtuviste calificación A o mejor', condition: ['A', 'A+'].includes(player.best_grade) },
    { key: 'grade_a_plus', name: '💎 Perfección', description: 'Obtuviste A+', condition: player.best_grade === 'A+' },
    { key: 'level_5', name: '📈 Nivel 5', description: 'Alcanzaste nivel 5', condition: player.level >= 5 },
    { key: 'level_10', name: '🚀 Nivel 10', description: 'Alcanzaste nivel 10', condition: player.level >= 10 },
    { key: 'score_3000', name: '💰 3000 Puntos', description: 'Superaste los 3000 puntos', condition: player.best_score >= 3000 },
  ];

  for (const a of achievements) {
    if (a.condition) {
      try {
        db.prepare('INSERT OR IGNORE INTO achievements (player_id, achievement_key, achievement_name, description) VALUES (?, ?, ?, ?)')
          .run(playerId, a.key, a.name, a.description);
        // Check if it was actually inserted (new achievement)
        const existing = db.prepare('SELECT * FROM achievements WHERE player_id = ? AND achievement_key = ?').get(playerId, a.key);
        if (existing) earned.push(a);
      } catch {
        // Already exists
      }
    }
  }

  return earned;
}

export function getPlayerAchievements(playerId: string) {
  return getDb().prepare('SELECT * FROM achievements WHERE player_id = ? ORDER BY earned_at DESC').all(playerId);
}

export function getLeaderboard(limit = 10) {
  return getDb().prepare('SELECT * FROM leaderboard ORDER BY score DESC LIMIT ?').all(limit);
}

export function addToLeaderboard(playerId: string, playerName: string, score: number, grade: string, level: number) {
  getDb().prepare('INSERT INTO leaderboard (player_id, player_name, score, grade, level) VALUES (?, ?, ?, ?, ?)')
    .run(playerId, playerName, score, grade, level);
}
