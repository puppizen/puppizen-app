// pages/api/leaderboard-summary.ts
import { NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function GET() {
  await connectDb();

  // Count total users
  const totalUsers = await User.countDocuments();

  // Sum all balances
  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        totalBalance: { $sum: "$balance" }
      }
    }
  ]);

  const totalBalance = result[0]?.totalBalance || 0;

  return NextResponse.json({ totalUsers, totalBalance });
}