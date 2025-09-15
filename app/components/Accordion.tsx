'use client'
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type AccordionItem = {
    title: string;
    content: ReactNode;
};

const items: AccordionItem[] = [
  { title: 'Airdrop Criteria', 
    content: (
      <ul className="text-sm">
        <li className="my-2">To participate in the airdrop, a TON wallet is required. If you do not have on yet, please create a wallet to secure your eligibility and receive your allocated share.</li>
        <li className="my-2">To qualify for eligibility, participants must actively engage by completing a minimum of 100 tasks or invite at least 20 friends before the countdown expires.</li>
        <li className="my-2">There will be no delays or deadline extensions. Once the countdown expires, rewards will be distributed to eligible participants.</li>
      </ul>
    ) 
  },
  { title: 'Airdrop Distribution', 
    content: (
      <div>
        <p className="text-sm">50% of the total token supply will be allocated to the community and distributed in three waves. <br /> <br />To learn more about $Puppizen distribution read <Link href='/' className="my-text-blue">| Puppizen Token Distribution</Link>
        </p>
      </div>
    )
  },
  { title: 'Tokenomics', 
    content: (
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="w-full">
            <p className="mb-3 text-sm">Total Supply - ???</p>
            <div className="w-full flex items-center gap-1">
              <div className="small-square my-bg-blue-4"></div>
              <p className="text-xs">50% - Community</p>
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="small-square my-bg-blue-2"></div>
              <p className="text-xs">25% - Presale</p>
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="small-square my-bg-blue-1"></div>
              <p className="text-xs">20% - Liquidity</p>
            </div>
            <div className="w-full flex items-center gap-1">
              <div className="small-square my-bg-blue"></div>
              <p className="text-xs">5% - Future Dev.</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-full">
            <Image src='/tokenomics.png' width={150} height={150} alt=""/>
          </div>
        </div> 
        <p className="text-xs">More information on our TG Community Channel</p>
      </div>
    )
  }
]

export default function Accordion() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className="px-3">
            {items.map((item, index) => (
                <div key={index} className="my-5">
                    <div className="flex justify-between items-center" onClick={() => toggle(index)}>
                        <p>{item.title}</p>
                        <span className="text-2xl">{activeIndex === index ? '-' : '+'}</span>
                    </div>

                    {activeIndex === index && (
                        <div className="my-bg-lightgray my-text-gray p-3 rounded-md">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}   