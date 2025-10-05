'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image my-bg-white rounded-md">
      <div className="relative overflow-hidden flex justify-between items-center px-3 py-5">
        <div className="relative z-10">
          <h2 className="text-lg font-bold flex flex-col">
            <span className="my-text-black">BOOST YOUR</span>
            <span className="bg-amber-400 my-text-black pr-4 pl-1 py-1 rounded-r-full">REWARDS x2</span>
          </h2>
        </div>
        
        
        <Image className="absolute right-2 object-center" src={"/rewardBooster.png"} width={200} height={150} alt="boost"/>

        <Image className="absolute -left-5 scale-x-[-1] blur-sm" src={"/rewardBooster.png"} width={150} height={150} alt="boost"/>
      </div>
    </div>
  )
}