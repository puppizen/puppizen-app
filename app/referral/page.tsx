'use client';

import { useEffect, useState } from 'react';
import Footer from "../components/Footer";
import Image from 'next/image';

interface ReferredUser {
  username: string;
  profile_url?: string;
  balance: number;
}

export default function ReferralLink() {
  const [refCode, setRefCode] = useState('');
  const [referrals, setReferrals] = useState(0);
  const [referredList, setReferredList] = useState<ReferredUser[]>([]);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputRefCode, setInputRefCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingReferrals, setLoadingReferrals] = useState(true)
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cachedReferredList, setCachedReferredList] = useState<ReferredUser[]>([]);

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    setLoadingReferrals(true);
    setCachedReferredList([]); // Clear previous cache

    const cached = localStorage.getItem('cachedReferredList');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCachedReferredList(parsed.referredUsers || []);
      } catch (err) {
        console.error('Failed to parse cached referral list:', err);
      }
    }

    if (tgUser.id) {
      fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: tgUser.id })
      })

      fetch(`/api/referral?userId=${tgUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          setRefCode(data.refCode);
          setReferrals(data.referrals);
          setReferredList(data.referredUsers || []);
          localStorage.setItem('cachedReferredList', JSON.stringify(data));
          setLoadingReferrals(false);

          // Show modal only if user hasn't submitted a referral
          if (!data.referredBy) {
            setShowModal(true);
          }
          setLoading(false);
        });
    }
  }, []);

  const displayReferredList = loadingReferrals ? cachedReferredList : referredList;
  
  const handleSubmitRefCode = async () => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    const trimmedCode = inputRefCode.trim();

    if (!tgUser?.id || !trimmedCode) return;

    const res = await fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: tgUser.id, refCode: trimmedCode })
    });

    const data = await res.json();

    if (res.ok) {
      setSuccessMessage(data.success || 'Congratulations! Welcome bonus earned.')

      setTimeout(() => {
        setShowModal(false)
      }, 5000)
    } else {
      setErrorMessage(data.error || 'Oops! Invalid referral code.');
    }
  };

  const handleShare = () => {
    navigator.share ({
      title: 'Join Puppizen',
      text: 'Hey, earn rewards with me on Puppizen',
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000)
  };

  return (
    <div className='pb-15'>
      <div className='w-full mb-1 p-1'>
        <p className='text-xs'>Your referral code is: {refCode}</p>
      </div>
      <div className='flex flex-row gap-2 justify-between mb-8'>
        <button className='flex-1 p-3 my-bg-gradient rounded-md font-medium' onClick={handleShare}>Send an Invitation</button>
        <button className='p-3 my-border-white rounded-md' onClick={handleCopy}>
          <Image src={copied ? '/check.svg' : '/copy.svg'} width={24} height={24} alt='copy'></Image>
        </button>
      </div>

      <div>
        <div className='flex justify-center gap-5 mb-2'>
          <Image src='/friends.svg' width={36} height={36} alt=''></Image>
          <Image src='/arrow.svg' width={24} height={24} alt=''></Image>
          <Image src='/puppizen-coin.png' width={36} height={36} alt='puppizen' className='rotate-45'></Image>
        </div>
        <p className='text-center'>Earn 50 $Puppizen for each invited friend and 10% of your friends reward. 
          <br /> Your friends earn 10 $Puppizen for using your referral code</p>
      </div>

      <ul className='mt-8'>
        <p className='flex justify-between items-center my-bg-gray p-3 mb-2 rounded-md'>
          <span>Referrals</span>
          <span className='text-xs my-text-gray font-light'>My referrals ({referrals})</span>
        </p>
        
        {displayReferredList.length > 0 ? (
          displayReferredList.map((user, index) => (
            <li className="flex justify-between items-center p-3" key={index}>
              <div className="flex items-center gap-2">
                <p className="text-sm font-light">#{index + 1}</p>
                <Image 
                  className="my-border-blue rounded-md"
                  src={user.profile_url || '/puppizen-image.png'}
                  width={24} height={24} alt='' loading='lazy'
                />
                <p className="text-sm">{user.username}</p>
              </div>
              <p className="text-sm">{user.balance.toLocaleString()}</p>
            </li>
          ))
        ) : (
          <li className='pt-10 text-center'>No referrals yet</li>
        )}
      </ul>

      {!loading && showModal && (
        <div className="modal-backdrop my-bg-dark backdrop-blur-md fixed inset-0 left-0 right-0 w-full px-3 pt-5"

        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('modal-backdrop')) {
            setShowModal(false);
            setInputRefCode('');
          }
        }}
        >
          <div className="flex justify-end">
            <button className="close-backdrop my-bg-gray rounded-full px-4 py-1 mb-3"
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('close-backdrop')) {
                setShowModal(false);
                setInputRefCode('');
              }
            }}>Close</button>
          </div>
          <div className="my-bg-dark p-3 rounded-md my-border-gray">
            {successMessage && (
              <div className="flex items-center gap-1 my-bg-blue my-text-white px-3 py-1 mb-3 w-full rounded-md">
                <Image src='/check-good.svg' width={20} height={20} alt='success'/>
                <p className='text-xs'>
                  {successMessage}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className='flex items-center gap-1 bg-red-600 my-text-white px-3 py-1 mb-3 w-full rounded-md'>
                <Image src='/error.svg' width={20} height={20} alt='error'/>
                <p className='text-xs'>
                  {errorMessage}
                </p>
              </div>
            )}

            <h3 className="font-normal mb-8">Enter referral code to claim + 10 Puppizen</h3>

            <input
              type="text"
              value={inputRefCode}
              onChange={(e) => setInputRefCode(e.target.value)}
              className="my-border-gray rounded-md p-3 w-full mb-10 outline-0"
              placeholder="Referral code"
            />

            <button
              onClick={() => handleSubmitRefCode()}
              className="my-bg-gradient p-3 rounded-md w-full"
              disabled={!inputRefCode.trim()}
            > Submit </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
