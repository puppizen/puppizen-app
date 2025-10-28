import Footer from './components/Footer'
import CountDownTimer from './components/Countdown';
import UserTGData from './components/UserTGData';
import UserBalance from './components/Balance';
import Image from 'next/image';
import Games from './components/Games';
import ShortCut from './components/ShortCut';


export default function Home() {
  return (
    <div className="p-4 mb-15 max-w-screen">
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

        <div className='pt-10'>
          <ShortCut />
        </div>

        <div className='pt-6'>
          <Games />
        </div>
      </div>

      <Footer />
    </div>
  );
}
