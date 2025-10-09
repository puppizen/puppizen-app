
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, score, refReward } = await req.json();

  if (!userId || !score || !refReward) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const user = await User.findOne({userId: userId});
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const rewardAmount = score;

  user.balance += rewardAmount
  await user.save();

  if (referrer) {
    const REFERRAL_PERCENTAGE = 0.1;
    const REF_REWARD = (rewardAmount / user.gameBoster) * REFERRAL_PERCENTAGE;
    const refReward = REF_REWARD * referrer.gameBooster

    referrer.balance += refReward; 
    await referrer.save();
  }

  return NextResponse.json({ success: true });
}
