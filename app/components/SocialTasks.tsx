// app/components/SocialTasks.tsx
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import Link from "next/link";

type Task = {
  id: string;
  name: string;
  max: number;
  completed: number;
  reward: number;
  url: string;
  iconUrl: string;
  status: 'start' | 'claim' | 'max' | 'done'
};

export default function PartnersTasks({ category }: { category: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [cachedTasks, setCachedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    const cacheKey = `cachedTasks-${tgUser.id}-${category}`

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedTasks(parsed);
      } catch (err) {
        console.error('Failed to parse cached tasks:', err);
      }
    }

    if (tgUser) {
      setUserId(tgUser.id)

      fetch(`/api/socialtasks?userId=${tgUser.id}&category=${category}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        localStorage.removeItem(cacheKey);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('failed to fetch task:', err);
      });
      
    };
  }, [category]);

  const updateTaskStatus = async (
    taskId: string, 
    status: 'start' | 'claim' | 'max' | 'done'
  ) => {
    try {
      const res = await fetch(`/api/socialtasks?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status }),
      });
      if (!res.ok) {
        const error = await res.json();
        console.error ('failed to persist action', error.error)
      }
      // update frontend only after success
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: status } : task
        )
      );
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  const handleStart = async (task: Task) => {
    window.open(task.url, '_blank');
    await updateTaskStatus(task.id, 'start');

    setTimeout(() => {
      updateTaskStatus(task.id, 'claim');
    }, 10000);
  };

  const handleClaim = async (taskId: string, reward: number, userId: number | null) => {
    try {
      const res = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reward, userId, taskId }),
      });
      if (res.ok) {
        updateTaskStatus(taskId, 'done');
      } else {
        const error = await res.json();
        alert(error.error)
      }
        
    } catch (error) {
      console.error('Failed', error)
    }
  }

  const displayTasks = loading ? cachedTasks : tasks;

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-md border-2 border-transparent border-t-blue-500 animate-spin"></div>
      {displayTasks.map((task) => (
        <div
          key={task.id}
          className="relative z-10 flex justify-between items-center mb-3.5 my-bg-lightgray px-2 py-5 rounded-md"
        >
          
          <div className="flex justify-center gap-3">
              <Image src={task.iconUrl} width={26} height={26} alt="" />
            <div>
              <p className="text-sm">{task.name}</p>
              <p className="flex items-center gap-3 mt-0.5">  
                <span className="text-xs my-text-white my-bg-gradient px-3 rounded-full">+{task.reward} </span>
                <span className="text-xs my-text-gray my-bg-gray px-3 rounded-full">{task.completed} / {task.max} </span>
              </p>                           
            </div>
          </div>

          <div>
            {task.status === 'done' ? (
              <button className="my-border-gray my-text-gray rounded-full text-sm px-4 py-1" disabled>
                Done
              </button>
            ) : task.status === 'claim' ? (
              <button className="my-bg-blue rounded-full text-sm px-4 py-1 btn-blue4-active btn-translate-active" 
                onClick={() => handleClaim(task.id, task.reward, userId)}
              >Claim
              </button>
            ) : task.status === 'start' ? (
              <button className="relative my-border-white rounded-full text-sm px-4 py-1 btn-blue4-active btn-translate-active"
              onClick={() => 
                  handleStart(task)
                }>Start</button>
            ) : (
              <button className="my-border-gray my-text-gray rounded-full text-sm px-4 py-1"
              >Max
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
