import Accordion from "../components/Accordion";
import CountDownTimer from "../components/Countdown";
import Footer from "../components/Footer";
import Image from "next/image";

export default function AirdropPage() {
  return (
    <div className="mb-15">
      <div>
        <div className="my-10">
          <CountDownTimer />
        </div>

        <div>
          <div className="flex justify-between p-3 my-bg-blue rounded-md">
            <p>What you need to know</p>
            <Image src='/info.svg' width={24} height={24} alt={''} ></Image>
          </div>

          <Accordion />                    
        </div>
      </div>
      
      <Footer />
    </div>
  )
}