"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuctionCard from "@/components/Auctions/AuctionCard"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Auction({ initialAuctionNFTs, userId }) {
  const [auctionNFTs, setAuctionNFTs] = useState(initialAuctionNFTs)
  const [sortOrder, setSortOrder] = useState("endingSoon")
  const router = useRouter()

  useEffect(() => {
    setAuctionNFTs(initialAuctionNFTs)
  }, [initialAuctionNFTs])

  const handleTimeUp = (id) => {
    setAuctionNFTs((prevNFTs) => prevNFTs.filter((nft) => nft.id !== id))
  }

  const sortedNFTs = [...auctionNFTs].sort((a, b) => {
    switch (sortOrder) {
      case "endingSoon":
        return new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
      case "highestBid":
        return b.currentBid - a.currentBid
      case "lowestBid":
        return a.currentBid - b.currentBid
      default:
        return 0
    }
  })

  return (
    <section className="relative py-12 md:py-24 overflow-hidden min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center">การประมูลสด</h2>
        {auctionNFTs.length > 0 ? (
          <>
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
                <AuctionCard key={nft.id} nft={nft} userId={userId} onTimeUp={() => handleTimeUp(nft.id)} />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-white mt-12"
          >
            <svg className="w-24 h-24 mb-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">ยังไม่มีการประมูล</h3>
            <p className="text-gray-400 text-center max-w-md">
              ขณะนี้ยังไม่มีการประมูลที่กำลังดำเนินการ โปรดกลับมาตรวจสอบในภายหลัง หรือเป็นคนแรกที่เริ่มการประมูล!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

