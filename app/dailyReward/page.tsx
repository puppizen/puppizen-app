import Link from "next/link";
import Footer from "../components/Footer";
import WatchAdsForReward from "../components/WatchAdsForReward";
import PayStarsForReward from "../components/PayStarsForReward";
import FreeDailyRewards from "../components/FreeDailyReward";

export default function DailyReward() {
  return (
    <div className="pb-15">
      <div className="flex justify-end">
        <Link href="/tasks" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>

      <div className="my-bg-lightgray my-border-gray p-3 mb-5 rounded-md">
        <FreeDailyRewards />
      </div>

      <div className="my-bg-lightgray my-border-gray p-3 mb-5 rounded-md">
        <WatchAdsForReward />
      </div>

      <div className="my-bg-lightgray my-border-gray p-3 mb-5 rounded-md">
        <PayStarsForReward />
      </div>

      <Footer />
    </div>
  )
}