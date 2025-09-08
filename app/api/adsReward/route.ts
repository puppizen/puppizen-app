import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

const REQUIRED_ADS = 5;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const now = new Date().toISOString().slice(0, 10);
  const hoursSinceLastAd = new Date(user.lastAdWatchedAt || 0).toISOString().slice(0, 10);

  if (user.adsWatchedToday === REQUIRED_ADS && hoursSinceLastAd === now) {
    return NextResponse.json({ error: 'Daily ad limit reached' }, { status: 403 });
  }

  const updateCount = user.adsWatchedToday + 1;

  await User.updateOne(
    { userId },
    {
      $set: {
        adsWatchedToday: updateCount,
        lastAdWatchedAt: now
      }
    }
  );

  return NextResponse.json({ adsWatchedToday: updateCount });
}