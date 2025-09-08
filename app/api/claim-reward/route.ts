import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

const REWARD_AMOUNT = 50;
const REQUIRED_ADS = 5;

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

  const now = new Date().toISOString().slice(0, 10);
  const lastClaimUTC = new Date(user.lastClaimedAt || 0).toISOString().slice(0, 10);

  if (now === lastClaimUTC) {
    return NextResponse.json({ error: 'Reward already claimed today' }, { status: 403 });
  }

  // Update user
  await User.updateOne(
    {userId},
    {
      $inc: { balance: REWARD_AMOUNT },
      $set: { lastClaimedAt: now }
    }
  );

  console.log(`✅ Reward claimed: User ${userId} at ${user.lastClaimedAt.toISOString()}`);

  return NextResponse.json({
    success: "Daily Reward claimed"
  });
}
