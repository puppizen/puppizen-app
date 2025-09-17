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
  
  const today = new Date().toDateString();
  const lastAdWatchedAt = new Date(user.lastAdWatchedAt).toDateString();
  const lastStarsPaidAt = new Date(user.lastClaimedAtStars).toDateString();

  // If it's been more than 24 hours, reset the counter
  if (lastAdWatchedAt !== today) {
    user.adsWatchedToday = 0;
    user.lastAdWatchedAt = today;
  }

  if (lastStarsPaidAt !== today) {
    user.starsPaidToday = 0;
    user.lastStarsPaidAt = today;
  }

  await user.save()

  return NextResponse.json({ success: "Count reset"});
}