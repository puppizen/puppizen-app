'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-500">
      <div className="flex justify-between items-center p-3">
        <h2 className="text-lg flex flex-col">
          <span>BOOST YOUR</span>
          <span>REWARDS</span>
        </h2>
        
        <Image src={"/rewardBooster.png"} width={100} height={30} alt="boost"/>
      </div>
    </div>
  )
}