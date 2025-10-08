'use client'

import Link from "next/link"
import DailyCheckInBooster from "../components/DailyCheckInBooster"
import GameRewardBooster from "../components/GameRewardBooster"
import TaskBooster from "../components/TaskBooster"

export default function BoosterPage() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="mb-3 font-bold text-lg ">Boost your rewards x2</h1>
        <Link href="/tasks" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>
      

      <div className="flex flex-row gap-1">
        {/* task reward booster */}
        <TaskBooster />

        <DailyCheckInBooster />

        {/* game reward booster */}
        <GameRewardBooster />

        {/* airdrop reward booster */}
      </div>
    </div>
  )
}