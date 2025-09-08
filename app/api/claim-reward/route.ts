import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

const REWARD_AMOUNT = 50;
const REQUIRED_ADS = 10;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.adsWatchedToday !== REQUIRED_ADS) {
    return NextResponse.json({ error: `You must watch ${REQUIRED_ADS} ads to claim reward` }, { status: 403 });
  }

  const today = new Date().toDateString();
  const lastClaimedAt = new Date(user.lastClaimedAt).toDateString();

  if (today === lastClaimedAt) {
    return NextResponse.json({ error: 'Reward already claimed today' }, { status: 403 });
  }

  // Update user
  await User.updateOne(
    {userId},
    {
      $inc: { balance: REWARD_AMOUNT },
      $set: { lastClaimedAt: today }
    }
  );

  console.log(`✅ Reward claimed: User ${userId} at ${user.lastClaimedAt.toISOString()}`);

  return NextResponse.json({
    success: "Daily Reward claimed"
  });
}
