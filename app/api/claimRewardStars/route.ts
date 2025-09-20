import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

const REWARD_AMOUNT = 50;
const REQUIRED_STARS = 20;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.starsPaidToday !== REQUIRED_STARS) {
    return NextResponse.json({ error: `You must spend ${REQUIRED_STARS} stars to claim reward` }, { status: 403 });
  }

  const today = new Date().toDateString();
  const lastClaimedAtStars = new Date(user.lastClaimedAtStars).toDateString();

  if (today === lastClaimedAtStars) {
    return NextResponse.json({ error: 'Reward already claimed today' }, { status: 403 });
  }

  // Update user
  user.balance += REWARD_AMOUNT;
  user.lastClaimedAtStars = today;

  await user.save();

  const REFERRAL_PERCENTAGE = 0.1;
  const refReward = REWARD_AMOUNT * REFERRAL_PERCENTAGE;
  if (referrer) {
    referrer.balance += refReward;
    await referrer.save()
  }

  console.log(`✅ Reward claimed: User ${userId} at ${user.lastClaimedAt.toISOString()}`);

  return NextResponse.json({
    success: "Daily Reward claimed"
  });
}
