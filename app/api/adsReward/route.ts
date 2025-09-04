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
  const hoursSinceLastAd = (now.getTime() - lastAdWatchedAt.getTime()) / (1000 * 60 * 60);

  // If it's been more than 24 hours, reset the counter
  const adsWatchedToday = hoursSinceLastAd >= 24 ? 0 : user.adsWatchedToday;

  if (adsWatchedToday >= 5 && hoursSinceLastAd < 24) {
    return NextResponse.json({ error: 'Daily ad limit reached' }, { status: 403 });
  }

  const updateCount = adsWatchedToday + 1;

  await User.updateOne(
    { userId },
    {
      $set: {
        adsWatchedToday: updateCount,
        lastAdWatchedAt: now
      }
    }
  );

  return NextResponse.json({ adsWatchedToday });
}