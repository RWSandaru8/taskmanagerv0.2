import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

const TASKS_FILE = path.join(process.cwd(), 'data', 'tasks.json');

async function readTasks(): Promise<Task[]> {
  try {
    await fs.mkdir(path.dirname(TASKS_FILE), { recursive: true });
    
    try {
      const fileContents = await fs.readFile(TASKS_FILE, 'utf8');
      return JSON.parse(fileContents);
    } catch (error) {
      return [];
    }
  } catch (error) {
    console.error('Error reading tasks:', error);
    return [];
  }
}

async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.mkdir(path.dirname(TASKS_FILE), { recursive: true });
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

export async function GET() {
  try {
    const tasks = await readTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching tasks', error: String(error) }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const newTask: Task = await request.json();
    
    if (!newTask.title || !newTask.description) {
      return NextResponse.json(
        { message: 'Title and description are required' }, 
        { status: 400 }
      );
    }

    const tasks = await readTasks();
    
    newTask.id = Date.now().toString();
    newTask.status = newTask.status || 'pending';

    tasks.push(newTask);
    await writeTasks(tasks);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating task', error: String(error) }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { message: 'Task ID is required' }, 
        { status: 400 }
      );
    }

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      return NextResponse.json(
        { message: 'Task not found' }, 
        { status: 404 }
      );
    }

    tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };

    await writeTasks(tasks);

    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating task', error: String(error) }, 
      { status: 500 }
    );
  }
}