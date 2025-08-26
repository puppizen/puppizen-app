import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { Task } from '@/models/tasks';
import { User } from '@/models/user';

export async function GET(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const userId = Number(searchParams.get('userId'));
  
  if (!userId) {
    return NextResponse.json({ error: 'User id is required' }, { status: 400 });
  }

  const user = await User.findOne({ userId });
  const taskQuery = category ? {category} : {};
  const tasks = await Task.find(taskQuery);

  const tasksWithStatus = tasks.map((task) => {
    const taskId = task._id.toString();
    const completed = task.completed;
    const maxReached = task.max;

    let status = 'start';
    if (completed === maxReached && !user?.completedTasks?.includes(taskId)) {
      status = 'max'
    } else if (user?.completedTasks?.includes(taskId)) {
      status = 'done';
    } else if (user?.claimedTasks?.includes(taskId)) {
      status = 'claim';
    } else {
      const started = user?.startedTasks?.find((t: { taskId: string; }) => t.taskId === taskId);
      if (started) {
        const elapsed = Date.now() - new Date(started.startedAt).getTime();
        if (elapsed > 18000000) {
          status = 'claim';
        } else {
          status = 'start';
        }
      }
    }

    return {
      id: taskId,
      category: task.category,
      name: task.name,
      max: maxReached,
      completed: completed,
      reward: task.reward,
      url: task.url,
      iconUrl: task.iconUrl,
      status,
    }; 
  });

  type TaskStatus = 'start' | 'claim' | 'max' | 'done'
  const statusPriority: Record<TaskStatus, number> = {
    start: 1,
    claim: 2,
    max: 3,
    done: 4
  }
  
  tasksWithStatus.sort((a, b) => {
    return statusPriority[a.status as TaskStatus] - statusPriority[b.status as TaskStatus];
  });

  return NextResponse.json(tasksWithStatus);
}

export async function POST(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get('userId'));
  const { taskId, status } = await request.json();

  if (!userId || !taskId || !status) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const user = await User.findOne({ userId });

  // Remove taskId from all status arrays first
  user.claimedTasks = user.claimedTasks?.filter((id: string) => id !== taskId) || [];
  user.startedTasks = user.startedTasks?.filter((t: { taskId: string; }) => t.taskId !== taskId) || [];

  // Apply new status
  switch (status) {
    case 'start': 
      if (!user.startedTasks?.some((t: { taskId: string; }) => t.taskId === taskId)) {
      user.startedTasks.push({ taskId, startedAt: new Date() });
      }
      break;
    case 'claim':
      if (!user.claimedTasks?.includes(taskId)) {
        user.claimedTasks.push(taskId);
      }
      break;
    case 'done':
      if (!user.completedTasks?.includes(taskId)) {
        user.completedTasks.push(taskId);
      }
      break;
  }

  await user.save();
  
  return NextResponse.json({ success: true, status });
}
