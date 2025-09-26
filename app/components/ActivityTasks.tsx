'use client'

import { useEffect, useState } from "react";
import ActivityBalance from "./ActivityBalance"
import ActivityReferrals from "./ActivityReferrals"
import ActivityTasksCompleted from "./ActivityTasksCompleted"
import ActivityStars from "./ActivityStars";
import UserAdsWatched from "./UserAdsWatched";

export default function ActivityTasks() {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect (() => {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;

    if (tgUser.id) {
      setUserId(tgUser.id)
    }
  }, [])

  if (!userId) return null

  return (
    <div>
      <div>
        <ActivityStars activity="stars" userId={userId}/>
      </div>

      <div>
        <UserAdsWatched activity="ads" userId={userId}/>
      </div>

      <div>
        <ActivityTasksCompleted activity="taskCompleted" userId={userId} />
      </div>

      <div>
        <ActivityReferrals activity="referrals" userId={userId}/>
      </div>

      <div>
        <ActivityBalance activity="earnings" userId={userId}/>
      </div>
    </div>
  )
}
