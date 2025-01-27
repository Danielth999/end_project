"use client"

import { useState } from "react"
import useSWR from "swr"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AuctionCard from "@/components/Auctions/AuctionCard"

const fetcher = async (url) => {
  console.log("Fetching auctions from:", url)
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.")
  }
  const data = await res.json()
  console.log("Fetched auctions:", data)
  return data
}

export default function Auction({ userId, initialAuctions }) {
  const [sortOrder, setSortOrder] = useState("endingSoon")

  const { data: auctionNFTs, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, fetcher, {
    refreshInterval: 10000, // Refresh every 10 seconds
    revalidateOnFocus: true,
    dedupingInterval: 5000,
    fallbackData: initialAuctions,
  })

  console.log("Render: Current auctions", auctionNFTs)

  if (error) {
    console.error("Error loading auctions:", error)
    return <div>Failed to load auctions. Please try again later.</div>
  }

  const sortedNFTs = [...(auctionNFTs || [])].sort((a, b) => {
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
        {sortedNFTs.length > 0 ? (
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
                <AuctionCard key={nft.id} nft={nft} userId={userId} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-white">
            <p className="text-xl">ไม่มีการประมูลที่กำลังดำเนินการอยู่ในขณะนี้</p>
          </div>
        )}
      </div>
    </section>
  )
}

