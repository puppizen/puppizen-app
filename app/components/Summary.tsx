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
      <h1 className="mb-3 font-bold text-lg">Leaderboard</h1>
      <div className="flex gap-10 mb-3">
        <div className="flex gap-3">
          <p className="text-xs">Total Users:</p>
          <p className='text-xs my-text-gray'>{summaryTotalUsers}</p>
        </div>
        <div className="flex gap-3">
          <p className="text-xs">Points Claimed:</p> 
          <p className='text-xs my-text-gray'>{summaryTotalBalance}</p>
        </div>
      </div>

      <hr className="my-border-gray"/>
    </div>
  );
}


