'use client'
import React, { useState } from 'react'

import Footer from '../components/Footer'
import SocialTasks from '../components/SocialTasks'
import ActivityTasks from '../components/ActivityTasks'
import PartnersTasks from '../components/PartnersTasks'
import DailyCheckIn from '../components/DailyCheckin'
import RewardBooster from '../components/RewardBooster'

type TaskCategory = 'social' | 'activity' | 'partners'

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<TaskCategory>('social');
  const taskLabel: Record<TaskCategory, string> = {
      social: 'Social',
      activity: 'Activity',
      partners: 'For You'
  };
  return (
    <div className='p-4 mb-15'>
      <h1 className="mb-3 font-bold text-lg">Earn PUPPIZEN</h1>

      <RewardBooster />

      <DailyCheckIn />

      <div className='pt-5'>
        <div className='basis-1/3 flex justify-between my-border-gray p-1 rounded-full'>
          {(['social', 'activity', 'partners'] as TaskCategory[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`my-text-white text-sm font-light px-7 py-2 ${activeTab === tab ? 'my-bg-gray rounded-full' : 'bg-transparent'} transition-all duration-200 ease-in-out`}
            >
              {taskLabel[tab]}
            </button>
          ))}
        </div>

        <div className='pt-5 px-1'>
          {activeTab === 'social' && <SocialTasks category="social" />}
          {activeTab === 'activity' && <ActivityTasks />}
          {activeTab === 'partners' && <PartnersTasks category="partners" />}
        </div>
      </div>

      <Footer />
    </div>
  )
}