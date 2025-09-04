import Link from "next/link";
import AdsgramReward from "../components/AdsReward";
import Footer from "../components/Footer";

export default function DailyReward() {
  return (
    <div>
      <div className="flex justify-end">
        <Link href="/tasks" className="my-bg-gray rounded-full px-4 py-1 mb-3">
            Back
        </Link>
      </div>

      <AdsgramReward />

      <Footer />
    </div>
  )
}