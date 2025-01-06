"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuctionCard from "./AuctionCard";
import { useState, useEffect } from "react";
export default function Auction({ initialAuctionNFTs, onBidSuccess }) {
  const [auctionNFTs, setAuctionNFTs] = useState(initialAuctionNFTs);
  const [sortOrder, setSortOrder] = useState("endingSoon");
  useEffect(() => {
    setAuctionNFTs(initialAuctionNFTs);
  }, [initialAuctionNFTs]);

  const handleBid = (id, amount) => {
    setAuctionNFTs((prevNFTs) =>
      prevNFTs.map((nft) =>
        nft.id === id ? { ...nft, currentBid: amount } : nft
      )
    );
    onBidSuccess({ id, currentBid: amount }); // ส่งข้อมูลใหม่ไปยัง SWR
  };
  const sortedNFTs = [...auctionNFTs].sort((a, b) => {
    switch (sortOrder) {
      case "endingSoon":
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
      case "highestBid":
        return b.currentBid - a.currentBid;
      case "lowestBid":
        return a.currentBid - b.currentBid;
      default:
        return 0;
    }
  });

  return (
    <section className="relative py-12 md:py-24 overflow-hidden ">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {sortedNFTs.map((nft) => (
            <AuctionCard key={nft.id} nft={nft} onBid={handleBid} />
          ))}
        </div>
      </div>
    </section>
  );
}
