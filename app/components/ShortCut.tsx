import Link from "next/link";
import Image from "next/image";

export default function ShortCut() {
  return (
    <div className="grid grid-cols-4 gap-y-3 w-full">      
      <Link href='/leaderboard'>
        <div className='flex flex-col items-center gap-2'>
          <div className="bg-gray-600/40 rounded-full p-4">
            <Image src='/trophy.svg' width={24} height={24} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Leaderboard</span>
        </div>
      </Link>

      <Link href='/presale'>
        <div className='flex flex-col items-center gap-2'>
          <div className="bg-gray-600/40 rounded-full p-4">
            <Image src='/presale.svg' width={24} height={24} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Presale</span>
        </div>
      </Link>

      <Link href='/userProfile'>
        <div className='flex flex-col items-center gap-2'>
          <div className="bg-gray-600/40 rounded-full p-4">
            <Image src='/profile.svg' width={24} height={24} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Profile</span>
        </div>
      </Link>

      <Link href='/booster'>
        <div className='flex flex-col items-center gap-2'>
          <div className="bg-gray-600/40 rounded-full p-4">
            <Image src='/boostImage.png' width={24} height={24} alt='' className=""></Image>
          </div>
          
          <span className='text-xs font-thin'>Booster</span>
        </div>
      </Link>

      <Link href='/' className="relative">
        <div className='flex flex-col items-center gap-2'>
          <div className="bg-gray-600/40 rounded-full p-4">
            <Image src='/plus.svg' width={24} height={24} alt=''></Image>
          </div>
          
          <span className='text-xs font-thin'>Publish</span>
        </div>
        <p className="absolute top-1 right-0 text-[10px] bg-amber-500 text-black/60 font-thin px-1 rounded-full">Soon</p>
      </Link>
    </div>
  )
}
