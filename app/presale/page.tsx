'use client'

import React from "react";

import { TonConnectButton } from "@tonconnect/ui-react";
import Footer from "../components/Footer";
import Image from "next/image";


export default function NftPage() {
    return (
        <div>

            <div className='flex flex-col justify-center items-center h-screen'>
                <Image src='/puppizen-image.png' width={160} height={80} alt='' className='align-center motion-safe:animate-bounce'></Image>
                <p className="mt-5 text-lg">Coming Soon!</p>

                <TonConnectButton className="mt-5" />
            </div>

           <Footer /> 
        </div>
    )
}