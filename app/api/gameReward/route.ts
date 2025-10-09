
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function POST(req: NextRequest) {
  await connectDb();
  const { userId, score } = await req.json();

  if (!userId || !score) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const user = await User.findOne(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const rewardAmount = score;

  user.balance += rewardAmount
  await user.save();

  return NextResponse.json({ success: true });
}
