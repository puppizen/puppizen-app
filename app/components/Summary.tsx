'use client'

// components/LeaderboardSummary.tsx
import { useEffect, useState } from 'react';

type Summary = {
  totalUsers: number;
  totalBalance: number;
};

export default function Summary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [cachedSummary, setCachedSummary] = useState<Summary | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('cachedSummary');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedSummary(parsed);
      } catch (err) {
        console.error('failed to parse cached summary', err);
      }
    }

    async function fetchSummary() {
      const res = await fetch('/api/summary');
      const data = await res.json();
      setSummary(data);
      localStorage.setItem('cachedSummary', JSON.stringify(data));
      // setLoading(false)
    }

    fetchSummary();
  }, []);

  const displaySummary = summary || cachedSummary;

  const summaryTotalUsers = displaySummary?.totalUsers;
  const summaryTotalBalance = displaySummary?.totalBalance.toLocaleString();

  return (
    <div className="mb-3">
      <h1 className="mb-2 font-semibold text-2xl">Stats</h1>
      <div className="flex justify-between my-bg-gradient gap-3 rounded-md p-3 my-text-black">
        <div className="px-4 py-1 my-bg-white rounded-full w-full font-medium">
          <p>Total Users</p>
          <p>{summaryTotalUsers}</p>
        </div>
        <div className="px-3 py-1 my-bg-white rounded-full w-full font-medium">
          <p>Points Claimed</p> 
          <p>{summaryTotalBalance}</p>
        </div>
      </div>
    </div>
  );
}


