import Link from "next/link"
import Image from "next/image"

export default function PreSaleLink() {
  return (
    <div className="relative flex items-center px-3 my-bg-gradient rounded-md">
      <div className="flex flex-col gap-1 py-3">
        <p className="text-xl font-bold">Join PreSale</p>
        <Link href='/' className="my-bg-white my-text-black rounded-md font-medium p-2">Coming Soon!</Link>
      </div>
      <div className="absolute right-20">
        <Image src='/pupp-stacked.png' width={80} height={45} alt="" className="blur-xs"></Image>
      </div>
      <div className="absolute right-6">
        <Image src='/puppizen-coin.png' width={100} height={120} alt='' className="rotate-45"></Image>
      </div>
    </div>
  )
}
