// pages/api/leaderboard.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function GET(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const allUsers = await User.find({})
    .sort({ balance: -1 })
    .select('userId username balance profile_url');

  const topUsers = allUsers.slice(0, 100);

  let userPosition = null;
  let userProfile = null;
  if (userId) {
    const index = allUsers.findIndex(user => user.userId === userId);
    if (index !== -1) {
      userPosition = index + 1; // 1-based ranking
      userProfile = allUsers[index];
    }

  }

  return NextResponse.json({topUsers, userPosition, userProfile});
}
