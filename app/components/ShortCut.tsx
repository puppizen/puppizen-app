import Link from "next/link";
import Image from "next/image";

export default function ShortCut() {
  return (
    <div className="grid grid-cols-4 w-full">
      <Link href='/leaderboard'  className='flex flex-row justify-between btn-translate-active items-center'>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-gray-600/50 rounded-full p-3">
            <Image src='/trophy.svg' width={20} height={20} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Leaderboard</span>
        </div>
      </Link>

      <Link href='/presale'  className='flex flex-row justify-between btn-translate-active items-center'>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-gray-600/50 rounded-full p-3">
            <Image src='/presale.svg' width={20} height={20} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Presale</span>
        </div>
      </Link>

      <Link href='/userProfile'  className='flex flex-row justify-between btn-translate-active items-center'>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-gray-600/50 rounded-full p-3">
            <Image src='/profile.svg' width={20} height={20} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Profile</span>
        </div>
      </Link>

      <Link href='/booster'  className='flex flex-row justify-between btn-translate-active items-center'>
        <div className='flex flex-row items-center gap-2'>
          <div className="bg-gray-600/50 rounded-full p-3">
            <Image src='/boostImage.png' width={20} height={20} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Booster</span>
        </div>
      </Link>
    </div>
  )
}