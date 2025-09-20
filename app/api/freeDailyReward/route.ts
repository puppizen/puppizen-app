import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/mongodb";
import { User } from "@/models/user";

const REWARD_AMOUNT = 10;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });
  const referrer = user?.referredBy ? await User.findOne({ userId: user.referredBy }) : null;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = new Date().toDateString();
  const lastDailyRewardAt = new Date(user.lastDailyRewardAt).toDateString();

  if (today === lastDailyRewardAt) {
    return NextResponse.json({ error: 'Reward already claimed today' }, { status: 403 });
  }

  user.balance += REWARD_AMOUNT;
  user.lastDailyRewardAt = today;

  await user.save();

  const REFERRAL_PERCENTAGE = 0.1;
  const refReward = REWARD_AMOUNT * REFERRAL_PERCENTAGE;
  if (referrer) {
    user.balance += refReward;
    await referrer.save();
  }

  return NextResponse.json({
    success: "Daily reward claimed"
  })
}
