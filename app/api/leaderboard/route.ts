// pages/api/leaderboard.ts
import { NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function GET() {
  await connectDb();

  const topUsers = await User.find({})
    .sort({ balance: -1 })
    .limit(100)
    .select('userId username balance profile_url');

  return NextResponse.json(topUsers);
}
