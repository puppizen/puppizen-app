import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

const MAX_DAILY_COUNT = 3;
const ADS_REWARD = 200;

export async function POST(request: NextRequest) {
  await connectDb();

  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Find user
  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const lastRewardDate = new Date(user.lastRewardAt || 0);
  const isSameDay = lastRewardDate >= today;

  // Check daily limit
  if (isSameDay && user.dailyCount >= MAX_DAILY_COUNT) {
    return NextResponse.json({ error: "Daily reward limit reached" }, { status: 403 });
  }

  // Calculate new daily count
  const newDailyCount = isSameDay ? user.dailyCount + 1 : 1;

  // Update user balance and reward info
  user.balance = (user.balance || 0) + ADS_REWARD;
  user.dailyCount = newDailyCount;
  user.lastRewardAt = now;

  await user.save();

  return NextResponse.json({
    message: "Reward granted",
    balance: user.balance,
    dailyCount: user.dailyCount
  });
}
