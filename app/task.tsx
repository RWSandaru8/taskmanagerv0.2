'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTasks(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) throw new Error('Failed to add task');

      const addedTask = await response.json();
      setTasks([...tasks, addedTask]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task.id,
          status: task.status === 'pending' ? 'completed' : 'pending'
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading tasks...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Task Input Form */}
      <form onSubmit={handleAddTask} className="mb-6 space-y-4">
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required
        />
        <Textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          required
        />
        <Button type="submit" className="w-full">Add Task</Button>
      </form>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <Card 
              key={task.id} 
              className={
                task.status === 'completed' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200'
              }
            >
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{task.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span 
                  className={
                    task.status === 'completed' 
                      ? 'text-green-600' 
                      : 'text-yellow-600'
                  }
                >
                  Status: {task.status}
                </span>
                <Button 
                  variant={task.status === 'completed' ? 'secondary' : 'default'}
                  onClick={() => toggleTaskStatus(task)}
                >
                  {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}