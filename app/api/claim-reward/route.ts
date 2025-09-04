import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { User } from '@/models/user';

const REWARD_AMOUNT = 400;

export async function POST(request: NextRequest) {
  await connectDb();
  const { userId } = await request.json();

  const user = await User.findOne({ userId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.adsWatchedToday < 5) {
    return NextResponse.json({ error: 'Not enough ads watched' }, { status: 403 });
  }

  await User.updateOne(
    { userId },
    {
      $inc: { balance: REWARD_AMOUNT },
      $set: { lastClaimedAt: new Date() }
    }
  );

  const updatedUser = await User.findOne({ userId });

  return NextResponse.json({
    message: 'Reward claimed',
    balance: updatedUser.balance
  });
}

// export async function POST(req: NextRequest) {
//   await connectDb();
//   const { taskId, inputCode } = await req.json();

//   if (!taskId || !inputCode) {
//     return NextResponse.json({ error: 'Missing data' }, { status: 400 });
//   }

//   const task = await Task.findById(taskId);
//   if (!task) {
//     return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//   }

//   if (task.code !== inputCode) {
//     return NextResponse.json({ error: 'Incorrect verify code. Try again.' }, { status: 401 });
//   }

//   return NextResponse.json({ success: 'Task completed! Claim your rewards' });
// }