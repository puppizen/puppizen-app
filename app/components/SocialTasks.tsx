// app/components/SocialTasks.tsx
'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Task = {
  id: string;
  name: string;
  code: string;
  max: number;
  completed: number;
  reward: number;
  url: string;
  iconUrl: string;
  status: 'start' | 'verify' | 'claim' | 'max' | 'done'
};

export default function SocialTasks({ category }: { category: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [cachedTasks, setCachedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect (() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    setLoading(true);
    setCachedTasks([]); // Clear previous cache

    const cached = localStorage.getItem(`cachedTasks-${category}`);
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
        localStorage.setItem(`cachedTasks-${category}`, JSON.stringify(data));
        setLoading(false);
      })
      .catch((err) => {
        console.error('failed to fetch task:', err);
      });
      
    };
  }, [category]);

  const updateTaskStatus = async (
    taskId: string, 
    status: 'start' | 'verify' | 'claim' | 'max' | 'done'
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

    // Wait 20 seconds then update to verify
    setTimeout(() => {
      updateTaskStatus(task.id, 'verify');
    }, 20000);
  };

  const handleVerify = async () => {
    if (!currentTask) return;
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: currentTask?.id ?? '', inputCode }),
      });
      
      const data = await res.json();

      if (res.ok) {
        updateTaskStatus(currentTask.id, 'claim');
        setTimeout(() => {
          setShowModal(false);
        }, 5000);
        setInputCode('');
        setCurrentTask(null);
        setSuccessMessage(data.success || 'Task completed! Claim your rewards')
      } else {
        setErrorMessage(data.error || 'Incorrect verify code. Try again.');
      }
    } catch (error) {
      console.error(error)
    }    
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
    <div>
      {displayTasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center mb-3.5 my-bg-lightgray px-2 py-5 rounded-md"
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
            ) : task.status === 'max' ? (
              <button className="my-border-gray my-text-gray rounded-full text-sm px-4 py-1" disabled>Max</button>
            ) : task.status === 'claim' ? (
              <button className="relative my-bg-blue rounded-full text-sm px-4 py-1 " 
                onClick={() => handleClaim(task.id, task.reward, userId)}
              >Claim
              </button>
            ) : task.status === 'start' ? (
              <button className="my-border-white rounded-full text-sm px-4 py-1"
              onClick={() => handleStart(task)}>Start</button>
            ) : (
              <button className="my-bg-blue rounded-full text-sm px-4 py-1"
              onClick={() => {
                setCurrentTask(task);
                setShowModal(true);
              }}
              >Verify
              </button>
            )}
          </div>
        </div>
      ))}

      {showModal && currentTask && (
        <div className="modal-backdrop my-bg-dark fixed inset-0 top-0 left-0 right-0 w-full px-3 pt-5"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('modal-backdrop')) {
              setShowModal(false);
              setCurrentTask(null);
              setInputCode('');
            }
          }}
        >
          <div className="flex justify-end">
            <button className="close-backdrop my-bg-gray rounded-full px-4 py-1 mb-3"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('close-backdrop')) {
                setShowModal(false);
                setCurrentTask(null);
                setInputCode('');
              }
            }}>Close</button>
          </div>
          <div className="my-bg-dark p-3 rounded-md my-border-gray">
            {successMessage && (
              <div className="flex items-center gap-1 my-bg-blue my-text-white px-3 py-1 mb-3 w-full rounded-md">
                <Image src='/check-good.svg' width={20} height={20} alt="success"/>
                <p className="text-xs">
                  {successMessage}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="flex items-center gap-1 bg-red-600 my-text-white px-3 py-1 mb-3 w-full rounded-md">
                <Image src='/error.svg' width={20} height={20} alt="error"/>
                <p className="text-xs">
                  {errorMessage}
                </p>
              </div>
            )}

            <h3 className="font-normal mb-8">Enter keyword to claim reward</h3>
            <div className="flex justify-between items-center mb-10">
              <div className="flex justify-center gap-3">
                <Image src={currentTask.iconUrl} width={26} height={26} alt="" />
                <div>
                  <p className="text-sm">{currentTask.name}</p>
                  <p className="flex items-center gap-10 mt-0.5">
                    <span className="text-xs my-text-white my-bg-gradient px-3 rounded-full">+{currentTask.reward}
                    </span>
                    <span className="text-xs my-text-gray my-bg-gray px-3 rounded-full">{currentTask.completed} / {currentTask.max}</span>
                  </p>
                </div>
              </div>
              <div>
                  <button>
                    <Link href={currentTask.url} target="_blank" rel="noopener noreferrer">
                    <Image src="/link.svg" width={26} height={26} alt=""></Image>
                    </Link>
                  </button>
                </div>
            </div>
            <p className="text-sm mb-1 indent-1">Verify</p>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="my-border-gray rounded-md p-3 w-full mb-10 outline-0"
              placeholder="Enter keyword"
            />
            <button
              onClick={() => handleVerify()}
              className="my-bg-gradient p-3 rounded-md w-full"
              disabled={!inputCode.trim()}
            > Submit </button>
          </div>
        </div>
      )}
    </div>
  );
}
