'use client'
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import CountdownTimer from "./CountdownTimer"
import BidDialog from "./BidDialog"

export default function AuctionDetailsDrawer({ nft, userId, isOpen, onClose }) {
  const [currentBid, setCurrentBid] = useState(nft.currentBid)
  const [endTime, setEndTime] = useState(new Date(nft.endTime))

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?auctionId=${nft.id}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setCurrentBid(data.currentBid)
      setEndTime(new Date(data.endTime))
    }

    return () => {
      eventSource.close()
    }
  }, [nft.id])

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-[540px] bg-gray-900 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-white">{nft.name}</SheetTitle>
          <SheetDescription className="text-gray-400">
            โดย {nft.user?.name || "ไม่ระบุ"} | หมวดหมู่: {nft.category?.name || "ไม่ระบุ"}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              fill
              sizes="(max-width: 768px) 100vw, 540px"
              className="object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">ราคาเสนอปัจจุบัน</p>
            <p className="text-3xl font-bold text-[#2dac5c]">{currentBid} BTH</p>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">เวลาที่เหลือ</p>
            <CountdownTimer endTime={endTime} />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">รายละเอียด</p>
            <p className="text-gray-300">{nft.description || "ไม่มีคำอธิบายเพิ่มเติม"}</p>
          </div>
          {userId !== nft.user.id && <BidDialog nft={{ ...nft, currentBid }} userId={userId} className="w-full" />}
          <Button variant="outline" onClick={onClose} className="w-full">
            ปิด
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

