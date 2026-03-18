import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', game: 'Buffett Battle', version: '1.0' });
}
