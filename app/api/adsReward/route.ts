import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lastAdDate = new Date(user.lastAdWatchedAt || 0);
  const isSameDay = lastAdDate >= today;

  const newCount = isSameDay ? user.adsWatchedToday + 1 : 1;

  await User.updateOne(
    { userId },
    {
      $set: {
        adsWatchedToday: newCount,
        lastAdWatchedAt: now
      }
    }
  );

  return NextResponse.json({ adsWatchedToday: newCount });
}