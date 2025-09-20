import Link from "next/link";
import Footer from "../components/Footer";
import WatchAdsForReward from "../components/WatchAdsForReward";
import PayStarsForReward from "../components/PayStarsForReward";
import FreeDailyRewards from "../components/FreeDailyReward";

export default function DailyReward() {
  return (
    <div>
      <div className="flex justify-end">
        <Link href="/tasks" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>

      <div className="my-bg-lightgray my-border-gray p-3 mb-5">
        <FreeDailyRewards />
      </div>      

      <div className="my-bg-lightgray my-border-gray p-3 mb-5">
        <WatchAdsForReward />
      </div>

      <div className="my-bg-lightgray my-border-gray p-3 mb-5">
        <PayStarsForReward />
      </div>

      <Footer />
    </div>
  )
}