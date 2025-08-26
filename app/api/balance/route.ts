import { NextResponse, NextRequest } from 'next/server';
import { User } from '@/models/user';
import connectDb from '@/lib/mongodb'
import { Task } from '@/models/tasks';

export async function GET(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const user = await User.findOne({ userId });

  return NextResponse.json({ balance: user.balance });
}

export async function POST(request: NextRequest) {
  await connectDb();

  const { reward, userId, taskId } = await request.json();

  const user = await User.findOne({ userId });
  const task = await Task.findById(taskId);

  if (!user || !task) {
    return NextResponse.json({ error: 'User or Task not found' }, { status: 404 });
  }

  if (!user.completedTasks.includes(taskId)) {
    user.completedTasks.push(taskId);

    if (task.completed <= task.max) {
      task.completed += 1;
    }
    
    await task.save();

    user.balance += reward;
    user.taskCompleted += 1;
  } 

  user.verifiedTasks = user.verifiedTasks?.filter((id: string) => id !== taskId) || [];
  user.claimedTasks = user.claimedTasks?.filter((id: string) => id !== taskId) || [];
  
  await user.save();

  return NextResponse.json({
    userId: user.userId,
    balance: user.balance,
  });
}
