'use client'
import Image from "next/image"
export default function RewardBooster() {
  return (
    <div className="my-bg-image bg-amber-400 rounded-md">
      <div className="relative overflow-hidden flex justify-between items-center px-3 py-5">
        <div className="relative z-10">
          <h2 className="text-lg font-bold flex flex-col">
            <span>BOOST YOUR</span>
            <span className="my-bg-dark my-text-white pr-4 pl-1 py-1 rounded-r-full rounded-br-full">REWARDS x2</span>
          </h2>
        </div>
        
        
        <Image className="absolute right-3 -top-1 object-contain scale-x-[-1]" src={"/rewardBooster.png"} width={180} height={150} alt="boost"/>

        <Image className="absolute -left-5 top-5 object-contain scale-x-[-1] blur-lg" src={"/rewardBooster.png"} width={250} height={150} alt="boost"/>
      </div>
    </div>
  )
}