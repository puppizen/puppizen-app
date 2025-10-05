'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-300 rounded-md">
      <div className="relative overflow-hidden flex justify-between items-center p-3">
        <div className="relative z-10">
          <h2 className="text-lg flex flex-col">
            <span>BOOST YOUR</span>
            <span>REWARDS</span>
          </h2>
        </div>
        
        
        <Image className="absolute right-0 top-5 object-contain" src={"/rewardBooster.png"} width={200} height={200} alt="boost"/>
      </div>
    </div>
  )
}