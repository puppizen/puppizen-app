import Footer from './components/Footer'
import CountDownTimer from './components/Countdown';
import UserTGData from './components/UserTGData';
import PreSaleLink from './components/PreSale';
import UserBalance from './components/Balance';
import Link from 'next/link';
import Image from 'next/image';


export default function Home() {
  return (
    <div className="pb-15">
      <UserTGData />

      <div className='py-5'>
        <Link href='/leaderboard'  className='flex flex-row justify-between p-3 rounded-md my-bg-gradient'>
          <div className='flex flex-row gap-3'>
            <Image src='/trophy.svg' width={20} height={20} alt=''></Image>
            <span className='font-medium'>Leaderboard</span>
          </div>
          <div>
            <Image src='/arrow-right.svg' width={20} height={20} alt=''></Image>
          </div>
        </Link>
      </div>

      <div className='pt-20 flex items-center justify-center'>
        <Image src='/puppizen-image.png' width={160} height={80} alt='' className='align-center motion-safe:animate-bounce'></Image>
      </div>

      <div className='pt-5'>
        <UserBalance />

        <div className='pt-10'>
          <CountDownTimer />
        </div>

        <div className='pt-13'>
          <PreSaleLink />
        </div>
      </div>

      <Footer />
    </div>
  );
}
