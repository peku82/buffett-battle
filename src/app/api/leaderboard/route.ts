import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export async function GET() {
  const leaderboard = getLeaderboard(20);
  return NextResponse.json({ leaderboard });
}
