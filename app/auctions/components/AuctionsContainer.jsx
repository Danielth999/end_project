"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialAuctionNFTs = [
  {
    id: 1,
    name: "ความกลมกลืนแห่งจักรวาล #17",
    currentBid: 1.5,
    endTime: new Date(Date.now() + 86400000),
    image: "/artworks/1.jpg",
    duration: "24 ชั่วโมง",
  },
  {
    id: 2,
    name: "การสั่นสะเทือนแห่งควอนตัม #42",
    currentBid: 2.7,
    endTime: new Date(Date.now() + 172800000),
    image: "/artworks/1.jpg",
    duration: "48 ชั่วโมง",
  },
  {
    id: 3,
    name: "ความฝันแห่งหมอก #8",
    currentBid: 1.2,
    endTime: new Date(Date.now() + 259200000),
    image: "/artworks/1.jpg",
    duration: "72 ชั่วโมง",
  },
  {
    id: 4,
    name: "การฉายภาพแห่งดวงดาว #23",
    currentBid: 3.1,
    endTime: new Date(Date.now() + 345600000),
    image: "/artworks/1.jpg",
    duration: "96 ชั่วโมง",
  },
];

function CountdownTimer({ endTime, duration }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  function getTimeLeft(endTime) {
    const total = endTime.getTime() - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 text-sm">
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.days}</span> วัน
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.hours}</span> ชม.
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.minutes}</span> น.
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.seconds}</span> วิ.
        </div>
      </div>
      <div className="text-sm text-gray-400">ระยะเวลาประมูล: {duration}</div>
    </div>
  );
}

function BidDialog({ nft, onBid }) {
  const [bidAmount, setBidAmount] = useState(nft.currentBid + 0.1);

  const handleBid = () => {
    if (bidAmount > nft.currentBid) {
      onBid(nft.id, bidAmount);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#2dac5c] text-white hover:bg-[#249652]">
          วางราคาเสนอ
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>วางราคาเสนอสำหรับ {nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p>ราคาเสนอปัจจุบัน: {nft.currentBid} BTH</p>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value))}
            step="0.1"
            min={nft.currentBid + 0.1}
            className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded"
          />
          <Button
            onClick={handleBid}
            className="bg-[#2dac5c] text-white hover:bg-[#249652]"
          >
            ยืนยันราคาเสนอ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AuctionNFTs() {
  const [auctionNFTs, setAuctionNFTs] = useState(initialAuctionNFTs);
  const [sortOrder, setSortOrder] = useState("endingSoon");

  const handleBid = (id, amount) => {
    setAuctionNFTs((prevNFTs) =>
      prevNFTs.map((nft) =>
        nft.id === id ? { ...nft, currentBid: amount } : nft
      )
    );
  };

  const sortedNFTs = [...auctionNFTs].sort((a, b) => {
    switch (sortOrder) {
      case "endingSoon":
        return a.endTime - b.endTime;
      case "highestBid":
        return b.currentBid - a.currentBid;
      case "lowestBid":
        return a.currentBid - b.currentBid;
      default:
        return 0;
    }
  });

  return (
    <section className="relative py-24 overflow-hidden min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          การประมูลสด
        </h2>
        <div className="mb-8 flex justify-end">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="endingSoon">ใกล้สิ้นสุด</SelectItem>
              <SelectItem value="highestBid">ราคาสูงสุด</SelectItem>
              <SelectItem value="lowestBid">ราคาต่ำสุด</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 flex flex-col"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  sizes="100vw"
                  priority
                  className="  object-cover rounded-lg"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {nft.name}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-400">
                    ราคาเสนอปัจจุบัน
                  </span>
                  <span className="text-lg font-bold text-green-400">
                    {nft.currentBid} BTH
                  </span>
                </div>
                <CountdownTimer endTime={nft.endTime} duration={nft.duration} />
                <BidDialog nft={nft} onBid={handleBid} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

