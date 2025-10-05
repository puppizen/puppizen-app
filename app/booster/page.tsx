'use client'

import DailyCheckInBooster from "../components/DailyCheckInBooster"
import Footer from "../components/Footer"
import TaskBooster from "../components/TaskBooster"

export default function BoosterPage() {
  return (
    <div>
      <h1 className="mb-3 font-bold text-lg ">Boost your rewards</h1>
      {/* task reward booster */}
      <TaskBooster />

      <DailyCheckInBooster />

      {/* game reward booster */}

      {/* airdrop reward booster */}

      <Footer />
    </div>
  )
}