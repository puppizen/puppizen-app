import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

const REWARD = 20;
const REQUIRED_ADS = 3;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

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
  const BOOSTER = user.checkInBooster;
  const REWARD_AMOUNT = REWARD * BOOSTER;
  user.balance += REWARD_AMOUNT;
  user.lastClaimedAt = today;

  await user.save();

  const REFERRAL_PERCENTAGE = 0.1;
  const refReward = REWARD_AMOUNT * REFERRAL_PERCENTAGE;
  if (referrer) {
    const REF_BOOSTER = referrer.checkInBooster;
    const REF_REWARD = refReward * REF_BOOSTER;
    referrer.balance += REF_REWARD;
    await referrer.save()
  }

  console.log(`✅ Reward claimed: User ${userId} at ${user.lastClaimedAt.toDateString()}`);

  return NextResponse.json({
    success: "Daily Reward claimed"
  });
}
