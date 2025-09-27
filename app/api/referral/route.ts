// app/api/referral/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

export async function GET(request: NextRequest) {
  await connectDb();
  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get('userId'));

  if (!userId) {
    return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const referredUsers = await User.find({ userId: { $in: user.referredUsers } })

  return NextResponse.json({
    referralLink: user.referralLink,
    referrals: user?.referrals ?? 0,
    referredUsers: referredUsers.map(u => ({
      username: u.username,
      profile_url: u.profile_url,
      balance: u.balance,
    })),
    referredBy: user?.referredBy ?? null
  });
}

// export async function POST(req: NextRequest) {
//   await connectDb();

//   const { userId, refCode } = await req.json();

//   if (!userId || !refCode) {
//     return NextResponse.json({ error: 'userId and refCode are required' }, { status: 400 });
//   }

//   const user = await User.findOne({ userId });
//   const referrer = await User.findOne({ refCode });

//   if (!user || !referrer || referrer.userId === userId) {
//     return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
//   }

//   // Check if already referred
//   if (user.referredBy) {
//     return NextResponse.json({ error: 'User already referred by someone' }, { status: 400 });
//   }

//   if (referrer.referredUsers.includes(userId)) {
//     return NextResponse.json({ error: 'Referral already processed' }, { status: 409 });
//   }

//   if (user.referredUsers.includes(referrer.userId)) {
//     return NextResponse.json({ error: 'Cannot use referral code of someone you referred' }, { status: 400 })
//   }

//   // Apply referral
//   user.referredBy = referrer.userId;
//   user.balance += 10;
//   await user.save();

//   referrer.referredUsers.push(userId);
//   referrer.referrals += 1;
//   referrer.balance += 50; // Reward amount
//   await referrer.save();

//   return NextResponse.json({ success: 'Congratulations! Welcome bonus earned' });
// }
