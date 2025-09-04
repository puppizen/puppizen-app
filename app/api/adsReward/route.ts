import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });
  const now = new Date();
  const today = now.toDateString();

  const lastAdDate = new Date(user.lastAdWatchedAt || 0).toDateString();
  const isSameDay = lastAdDate === today;

  // Reset count if it's a new day
  const adsWatchedToday = isSameDay ? user.adsWatchedToday : 0;

  if (adsWatchedToday >= 5) {
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

  return NextResponse.json({ adsWatchedToday: updateCount });
}