import Footer from './components/Footer'
import CountDownTimer from './components/Countdown';
import UserTGData from './components/UserTGData';
import UserBalance from './components/Balance';
import Link from 'next/link';
import Image from 'next/image';
import Games from './components/Games';


export default function Home() {
  return (
    <div className="p-1 mb-15">
      <UserTGData/>

      <div className='pt-5'>
        <CountDownTimer />
      </div>

      <div className='pt-20 -z-10 flex items-center justify-center relative'>
        <Image src='/PuppizenAi.png' width={200} height={80} alt='' className='absolute align-center inline-flex motion-safe:animate-ping opacity-75'></Image>

        <Image src='/PuppizenAi.png' width={160} height={80} alt='' className='align-center relative inline-flex'></Image>
      </div>

      <div className='pt-8'>
        <UserBalance />

        <div className='pt-8 flex gap-5'>
          <Link href='/leaderboard'  className='flex flex-row justify-between p-3 rounded-md my-bg-gradient btn-translate-active w-full items-center'>
            <div className='flex items-center gap-2'>
              <Image src='/trophy.svg' width={20} height={20} alt=''></Image>
              <span className='font-medium'>Leaderboard</span>
            </div>
          </Link>
          
          <Link href='/presale' className='flex flex-row justify-between p-3 rounded-md my-bg-gradient btn-translate-active w-full items-center'>
            <div className='flex items-center gap-2'>
              <Image src='/puppizen-coin.png' width={20} height={20} alt=''></Image>
              <span className='font-medium'>Join Presale</span>
            </div>
          </Link>
        </div>

        <div className='pt-6'>
          <Games />
        </div>
      </div>

      <Footer />
    </div>
  );
}
