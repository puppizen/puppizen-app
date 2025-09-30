'use client'

import React from "react";

import { TonConnectButton } from "@tonconnect/ui-react";
import Footer from "../components/Footer";
import Image from "next/image";


export default function NftPage() {
    return (
        <div>

            <div className='flex flex-col justify-center items-center h-screen'>
              <div className='flex -z-10 items-center justify-center relative'>
                <Image src='/PuppizenAi.png' width={200} height={80} alt='' className='absolute align-center inline-flex motion-safe:animate-ping opacity-75'></Image>
        
                <Image src='/PuppizenAi.png' width={160} height={80} alt='' className='align-center relative inline-flex'></Image>
              </div>
              <p className="mt-5 text-lg">Coming Soon!</p>

              <TonConnectButton className="mt-5" />
            </div>

           <Footer /> 
        </div>
    )
}