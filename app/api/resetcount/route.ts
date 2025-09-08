import { User } from "@/models/user";
import connectDb from "@/lib/mongodb";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const today = new Date().toISOString().slice(0, 10);
  const lastAdWatchedAt = user.lastAdWatchedAt || 0;

  // If it's been more than 24 hours, reset the counter
  if (lastAdWatchedAt === today) {
    user.adswatchedToday = 0
  }

  await user.save()

  return NextResponse.json({ success: "Count reset"});
}