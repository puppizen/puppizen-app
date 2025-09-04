import Link from "next/link";
import Footer from "../components/Footer";
import WatchAdsForReward from "../components/WatchAdsForReward";

export default function DailyReward() {
  return (
    <div>
      <div className="flex justify-end">
        <Link href="/tasks" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>

      <WatchAdsForReward />

      <Footer />
    </div>
  )
}