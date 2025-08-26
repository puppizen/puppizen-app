'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Task = {
  id: string;
  name: string;
  max: number;
  completed: number;
  goal: number,
  reward: number;
  url: string;
  iconUrl: string;
  status: 'claim' | 'max' | 'done'
}

export default function ActivityTasksCompleted({ activity, userId }: {activity: string, userId: number}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskProgress, setTaskProgress] = useState(0);
  const [cachedTasks, setCachedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    setLoading(true);
    setCachedTasks([]); // Clear previous cache

    const cached = localStorage.getItem(`cachedTasks-${activity}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedTasks(parsed);
      } catch (err) {
        console.error('Failed to parse cached tasks:', err);
      }
    }

    if (userId) {
      fetch(`/api/activitytasks?userId=${userId}&activity=${activity}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        localStorage.setItem(`cachedTasks-${activity}`, JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('failed to', err)
      })
    }
  }, [activity, userId])

  useEffect (() => {
    if (userId) {
      fetch(`api/userdata?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setTaskProgress(data.referrals)
      })
      .catch((err) => {
        console.error('failed to', err)
      })
    }
  }, [userId])

  const updateTaskStatus = async (
    taskId: string,
    status: 'claim' | 'max' | 'done'
  ) => {
    try {
      const res = await fetch(`/api/activitytasks?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error ('failed to persist action', error.error);
      }

      // update frontend only after success
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: status } : task
        )
      );
    } catch (err) {
      console.error('Network error: ', err)
    }
  }

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
    <div className="pb-5">
      <p className="my-text-gray text-sm mb-2">Referrals</p>
      {displayTasks.map((task) => (
        <div key={task.id} className="flex justify-between items-center mb-3.5 my-bg-lightgray px-2 py-5 rounded-md">
          <div className="flex justify-center gap-3">
            <Image src={task.iconUrl} width={26} height={26} alt="" />
            <div>
              <p className="flex items-center text-sm font-lighter ">{task.name} 
                <span className="my-text-xs my-text-gray ml-5">{taskProgress} / {task.goal}</span></p>
              <p className="flex items-center gap-3 mt-0.5">  
                <span className="text-xs my-text-white my-bg-gradient px-3 rounded-full">+{task.reward} </span>
                <span className="text-xs my-text-gray my-bg-gray px-3 rounded-full">{task.completed} / {task.max} </span>
              </p>                           
            </div>
          </div>

          <div>
            {task.status === 'done' ? (
              <button className="my-border-gray my-text-gray rounded-md text-sm px-4 py-1" disabled>Done</button>
            ) : task.status === 'claim' ? (
              <button className="my-bg-blue rounded-md text-sm px-4 py-1"
                onClick={() => handleClaim(task.id, task.reward, userId)}
              >Claim</button>
            ) : task.status === 'max' ? (
              <button className="my-border-gray my-text-gray rounded-md text-sm px-4 py-1" disabled>Max</button>
            ) : (
              <button className="my-border-gray my-text-gray rounded-md text-sm px-4 py-1">----</button>
            )
            }
          </div>
        </div>
      ))}
    </div>
  )
}