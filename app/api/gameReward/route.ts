
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, score} = await req.json();

  if (!userId || !score) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const user = await User.findOne({ userId: userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

  const rewardAmount = score;
  const removeTicket = -1

  user.balance += rewardAmount;
  user.gameTicket += removeTicket;
  await user.save();

  const roundScore = rewardAmount - (rewardAmount % 10)
  const realScore = roundScore / user.gameBooster

  if (referrer) {
    const REFERRAL_PERCENTAGE = 0.1;
    const REF_REWARD = realScore * REFERRAL_PERCENTAGE;
    const refReward = REF_REWARD * referrer.gameBooster

    referrer.balance += refReward; 
    await referrer.save();
  }

  return NextResponse.json({ 
    success: true,
    gameTicket: user.gameTicket,
  });
}
