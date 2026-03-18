import { NextRequest, NextResponse } from 'next/server';
import { getPlayerProfile, getPlayerAchievements } from '@/lib/db';

export async function GET(req: NextRequest) {
  const playerId = req.nextUrl.searchParams.get('id');
  if (!playerId) {
    return NextResponse.json({ error: 'Missing player id' }, { status: 400 });
  }

  const player = getPlayerProfile(playerId);
  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  const achievements = getPlayerAchievements(playerId);

  return NextResponse.json({ player, achievements });
}
