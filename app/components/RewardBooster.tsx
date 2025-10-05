'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-300">
      <div className="flex justify-between items-center p-3">
        <h2 className="text-lg flex flex-col">
          <span>BOOST YOUR</span>
          <span>REWARDS</span>
        </h2>
        
        <Image className="absolute right-0 bottom-[-40px] w-[200px] object-contain" src={"/rewardBooster.png"} width={300} height={300} alt="boost"/>
      </div>
    </div>
  )
}