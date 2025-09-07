import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const now = new Date();
  const lastAdWatchedAt = new Date(user.lastAdWatchedAt || 0);

  const today = now.toISOString().split('T')[0];
  const lastWatchedDate = lastAdWatchedAt.toISOString().split('T')[0];

  // If it's been more than 24 hours, reset the counter
  let resetAdswatchedToday = user.adsWatchedToday
  if (lastWatchedDate !== today) {
    resetAdswatchedToday = 0
  }

  await User.updateOne(
    { userId },
    {
      $set: {
        adsWatchedToday: resetAdswatchedToday,
        lastAdWatchedAt: now
      }
    }
  );

  return NextResponse.json({ 
    adsWatchedToday: resetAdswatchedToday
  });
}