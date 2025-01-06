import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import BidDialog from "./BidDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuctionCard({ nft, onBid }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 flex flex-col">
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={nft.image}
          alt={nft.name}
          fill
          sizes="100vw"
          priority
          className="object-cover rounded-lg"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <h3 className="text-xl font-semibold text-white mb-2">{nft.name}</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">ราคาเสนอปัจจุบัน</span>
          <span className="text-lg font-bold text-green-400">
            {nft.currentBid} BTH
          </span>
        </div>
        <CountdownTimer endTime={nft.endTime} duration={nft.duration} />
        <div className="mt-4 space-y-2">
          <BidDialog nft={nft} onBid={onBid} />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                ดูรายละเอียด
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border border-gray-800">
              <DialogHeader>
                <DialogTitle>{nft.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg"
                />
                <p>{nft.description}</p>
                <div>
                  <h4 className="font-semibold">ราคาเสนอปัจจุบัน</h4>
                  <p className="text-green-400 font-bold">
                    {nft.currentBid} BTH
                  </p>
                </div>
                <CountdownTimer endTime={nft.endTime} duration={nft.duration} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
