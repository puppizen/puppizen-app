'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-400 rounded-md">
      <div className="relative overflow-hidden flex justify-between items-center px-3 py-8">
        <div className="relative z-10">
          <h2 className="text-lg flex flex-col">
            <span>BOOST YOUR</span>
            <span>REWARDS</span>
          </h2>
        </div>
        
        
        <Image className="absolute right-10 top-1 object-contain" src={"/rewardBooster.png"} width={150} height={150} alt="boost"/>
      </div>
    </div>
  )
}