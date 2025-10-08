'use client'

import DailyCheckInBooster from "../components/DailyCheckInBooster"
import Footer from "../components/Footer"
import GameRewardBooster from "../components/GameRewardBooster"
import TaskBooster from "../components/TaskBooster"

export default function BoosterPage() {
  return (
    <div className="p-1">
      <h1 className="mb-3 font-bold text-lg ">Boost your rewards x2</h1>
      {/* task reward booster */}
      <TaskBooster />

      <DailyCheckInBooster />

      {/* game reward booster */}
      <GameRewardBooster />

      {/* airdrop reward booster */}

      <Footer />
    </div>
  )
}