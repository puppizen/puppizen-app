import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { Task } from '@/models/tasks';
import { User } from '@/models/user';

export async function GET(request: NextRequest) {
    
  await connectDb();

  const { searchParams } = new URL(request.url);
  const activity = searchParams.get('activity');
  const userId = Number(searchParams.get('userId'));
  
  if (!userId) {
    return NextResponse.json({ error: 'User id is required' }, { status: 400 });
  }

  const user = await User.findOne({ userId });
  const taskQuery = activity ? {activity} : {};
  const tasks = await Task.find(taskQuery);

  const tasksWithStatus = tasks.map((task) => {
    const taskId = task._id.toString();
    const taskGoal = task.goal;
    const completed = task.completed;
    const maxReached = task.max;

    let status = 'start';

    const eligible =
    (task.activity === 'referrals' && user.referrals >= taskGoal) ||
    (task.activity === 'taskCompleted' && user.taskCompleted >= taskGoal) ||
    (task.activity === 'earnings' && Math.floor(user.balance) >= taskGoal);

    if (user?.completedTasks?.includes(taskId)) {
      status = 'done';
    } else if (user?.claimedTasks?.includes(taskId)) {
      status = 'claim';
    } else if (eligible) {
      status = 'claim';
    } else if (completed >= maxReached) {
      status = 'max';
    }

    return {
      id: taskId,
      category: task.category,
      activity: task.activity,
      name: task.name,
      goal: taskGoal,
      max: maxReached,
      completed: completed,
      reward: task.reward,
      url: task.url,
      iconUrl: task.iconUrl,
      status,
    }; 
  });

  type TaskStatus = 'start' | 'claim' | 'max' | 'done';
  const statusPriority: Record<TaskStatus, number> = {
    start: 1,
    claim: 2,
    max: 3,
    done: 4,
  }
  
  tasksWithStatus.sort((a, b) => {
    return statusPriority[a.status as TaskStatus] - statusPriority[b.status as TaskStatus];
  });

  return NextResponse.json(
    tasksWithStatus
  );
}

export async function POST(request: NextRequest) {
  await connectDb();

  const { searchParams } = new URL(request.url);
  const userId = Number(searchParams.get('userId'));
  const { taskId, status } = await request.json();

  if (!userId || !taskId || !status) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const user = await User.findOne({ userId });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const task = await Task.findById(taskId); // Assuming you have a Task model
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const taskGoal = task.goal;
  let eligible = false;

  switch (task.activity) {
    case 'referrals':
      eligible = user.referrals >= taskGoal;
      break;
    case 'taskCompleted':
      eligible = user.taskCompleted >= taskGoal;
      break;
    case 'earnings':
      eligible = Math.floor(user.balance) >= taskGoal;
      break;
    default:
      return NextResponse.json({ error: 'Unknown task activity' }, { status: 400 });
  }

  // Remove taskId from all status arrays first
  user.claimedTasks = user.claimedTasks?.filter((id: string) => id !== taskId) || [];
  user.completedTasks = user.completedTasks?.filter((id: string) => id !== taskId) || [];

  switch (status) {
    case 'claim':
      if (!eligible) {
        return NextResponse.json({ error: 'Task requirement not met' }, { status: 403 });
      }
      user.claimedTasks.push(taskId);
      break;

    case 'done':
      if (!user.claimedTasks.includes(taskId)) {
        return NextResponse.json({ error: 'Task not yet claimed' }, { status: 403 });
      }
      user.completedTasks.push(taskId);
      break;

    default:
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await user.save();
  return NextResponse.json({ success: true, status });
}