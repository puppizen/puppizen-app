import connectDb from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const user = await User.findOne({ userId });

  return NextResponse.json({
    referrals: user.referrals,
    taskCompleted: user.taskCompleted,
    balance: user.balance,
    starsBalance: user.starsBalance,
    totalStarsPaid: user.totalStarsPaid,
    totalAdsWatched: user.totalAdsWatched,
    airdrop: user.airdrop,
  })
}
