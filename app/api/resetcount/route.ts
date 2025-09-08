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
  const lastAdWatchedAt = new Date(user.lastAdWatchedAt || 0).toISOString().slice(0, 10);

  // If it's been more than 24 hours, reset the counter
  if (lastAdWatchedAt === today) {
    user.adswatchedToday = 0
  }

  await user.save()

  // await User.updateOne(
  //   { userId },
  //   {
  //     $set: {
  //       adsWatchedToday: resetAdswatchedToday,
  //       lastAdWatchedAt: now
  //     }
  //   }
  // );

  return NextResponse.json({ success: "Count reseted"});
}