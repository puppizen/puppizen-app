// api/verify/route

import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { Task } from '@/models/tasks';

export async function POST(req: NextRequest) {
  await connectDb();
  const { taskId, inputCode } = await req.json();

  if (!taskId || !inputCode) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  const task = await Task.findById(taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  if (task.code !== inputCode) {
    return NextResponse.json({ error: 'Incorrect verify code. Try again.' }, { status: 401 });
  }

  return NextResponse.json({ success: 'Task completed! Claim your rewards' });
}