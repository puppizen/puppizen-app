'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-400 rounded-md">
      <div className="relative overflow-hidden flex justify-between items-center px-3 py-5">
        <div className="relative z-10">
          <h2 className="text-lg font-bold flex flex-col">
            <span>BOOST YOUR</span>
            <span className="my-bg-dark my-text-white p-3 rounded-full">REWARDS x2</span>
          </h2>
        </div>
        
        
        <Image className="absolute right-5 -top-1 object-contain scale-x-[-1]" src={"/rewardBooster.png"} width={160} height={150} alt="boost"/>
      </div>
    </div>
  )
}