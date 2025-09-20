import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

const REQUIRED_ADS = 10;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const today = new Date().toDateString();
  const lastAdWatchedAt = new Date(user.lastAdWatchedAt).toDateString();

  if (user.adsWatchedToday === REQUIRED_ADS && lastAdWatchedAt === today) {
    return NextResponse.json({ error: 'Daily ad limit reached!' }, { status: 403 });
  }

  const updateCount = user.adsWatchedToday + 1;

  user.adsWatchedToday = updateCount;
  user.lastAdWatchedAt = today;

  await user.save();

  return NextResponse.json({ adsWatchedToday: updateCount });
}