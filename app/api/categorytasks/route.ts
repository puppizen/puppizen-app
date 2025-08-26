import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/mongodb';
import { Task } from '@/models/tasks';

export async function GET(request: NextRequest) {
    
  await connectDb();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const taskQuery = category ? {category} : {};
  const tasks = await Task.find(taskQuery);

  return NextResponse.json(
    tasks
  );
}
