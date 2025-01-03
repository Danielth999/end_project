"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const initialAuctionNFTs = [
  {
    id: 1,
    name: "Celestial Harmony #17",
    currentBid: 1.5,
    endTime: new Date(Date.now() + 86400000),
    image: "/artworks/1.jpg",
    duration: "24 ชั่วโมง",
  },
  {
    id: 2,
    name: "Quantum Resonance #42",
    currentBid: 2.7,
    endTime: new Date(Date.now() + 172800000),
    image: "/artworks/1.jpg",
    duration: "48 ชั่วโมง",
  },
  {
    id: 3,
    name: "Nebula Dreams #8",
    currentBid: 1.2,
    endTime: new Date(Date.now() + 259200000),
    image: "/artworks/1.jpg",
    duration: "72 ชั่วโมง",
  },
  {
    id: 4,
    name: "Astral Projection #23",
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

export default function AuctionNFTs() {
  const [auctionNFTs, setAuctionNFTs] = useState(initialAuctionNFTs);

  const handleBid = (id) => {
    const newBidAmount = prompt("ใส่ราคาเสนอใหม่ (BTH):");
    if (newBidAmount) {
      setAuctionNFTs((prevNFTs) =>
        prevNFTs.map((nft) =>
          nft.id === id && parseFloat(newBidAmount) > nft.currentBid
            ? { ...nft, currentBid: parseFloat(newBidAmount) }
            : nft
        )
      );
    }
  };

  return (
    <section className="relative py-24 overflow-hidden ">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          การประมูลสด
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {auctionNFTs.map((nft) => (
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
                  className="object-cover rounded-lg"
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
                <button
                  onClick={() => handleBid(nft.id)}
                  className="w-full bg-[#2dac5c] text-white py-2 px-4 rounded-md font-semibold text-sm uppercase tracking-wide mt-4"
                >
                  วางราคาเสนอ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

