'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";

type UserData = {
  userId: number,
  username: string,
  profile_url: string,
  balance: number,
  starsBalance: number,
  totalStarsPaid: number,
  adsWatched: number,
  taskCompleted: number,
  referrals: number
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [cachedData, setCachedData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    setLoading(true);
    setCachedData([]);

    const cacheKey = `cachedData-${tgUser.id}`

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedData(parsed);
      } catch (err) {
        console.error('Failed to parse cached data', err);
      }
    }

    if(tgUser) {
      fetch(`/api/userData?userId=${tgUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data)
        localStorage.setItem(cacheKey, JSON.stringify(data));
        setLoading(false);
      })
    }
  }, []);

  const displayData = loading ? cachedData : userData
  
  return (
    <div className="flex flex-col justify-around">
      <h3 className="my-text-gray font-bold text-2xl text-center">My Profile</h3>
      <div>
        {displayData.map((userData) => (
          <div key={userData.userId} className="flex flex-col justify-around">
            <div>
              <Image src={userData.profile_url || '/puppizen-image.png'} width={50} height={50} alt="user photo" className="my-border-gray"/>
              <p className="text-center mt-5">{userData.username}</p>
            </div>
            <div className="flex flex-col justify-around">
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$PUPPIZEN</span> <span>{userData.balance}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS</span> <span>{userData.starsBalance}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>$STARS spent</span> <span>{userData.totalStarsPaid}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Referrals</span> <span>{userData.referrals}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Task Completed</span> <span>{userData.taskCompleted}</span></p>
              </div>
              <div className="my-bg-gray my-border-white p-3 rounded-md">
                <p className="flex justify-between items-center"><span>Ads Watched</span> <span>{userData.adsWatched}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}