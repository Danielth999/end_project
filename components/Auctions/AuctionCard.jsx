import { useEffect, useState } from "react"
import CountdownTimer from "./CountdownTimer"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { th } from "date-fns/locale"
import BidDialog from "./BidDialog"

export default function AuctionCard({ nft, onTimeUp, userId }) {
  const [currentBid, setCurrentBid] = useState(nft.currentBid)
  const [endTime, setEndTime] = useState(nft.endTime)
  const isOwner = nft.user.id === userId

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?auctionId=${nft.id}`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setCurrentBid(data.currentBid)
      setEndTime(data.endTime)
    }

    return () => {
      eventSource.close()
    }
  }, [nft.id])

  const formattedDate = nft.createdAt
    ? formatDistanceToNow(new Date(nft.createdAt), {
        addSuffix: true,
        locale: th,
      })
    : "ไม่ทราบเวลา"

  return (
    <Card className="h-full flex flex-col bg-gray-900 text-white border-gray-800 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-[#2dac5c]/20">
      <CardHeader className="p-0 relative w-full aspect-square overflow-hidden group">
        <div className="w-full h-full relative">
          <Image
            src={nft.image || "/placeholder.svg"}
            alt={nft.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
            className="transition-transform duration-300 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <Badge variant="secondary" className="bg-[#2dac5c] text-white">
            ประมูล
          </Badge>
          {isOwner && (
            <Badge variant="secondary" className="border-[#2dac5c] text-[#2dac5c]">
              คุณเป็นเจ้าของ
            </Badge>
          )}
        </div>
        <p className="absolute bottom-2 right-2 text-sm text-gray-300">{formattedDate}</p>
      </CardHeader>

      <CardContent className="flex-grow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h3 className="text-xl font-semibold mb-2 sm:mb-0">{nft.name}</h3>
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-400">ราคาเสนอปัจจุบัน</p>
            <p className="text-lg font-bold text-[#2dac5c]">{currentBid} BTH</p>
          </div>
        </div>
        <div className="space-y-2">
          <CountdownTimer endTime={endTime} duration={nft.duration} onTimeUp={onTimeUp} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
          <p>ศิลปิน: {nft.user?.name || "ไม่ระบุ"}</p>
          <p>หมวดหมู่: {nft.category?.name || "ไม่ระบุ"}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
        <Button
          variant="default"
          className="w-full sm:w-auto flex-grow bg-[#2dac5c] hover:bg-[#238c4b] transition-colors duration-300"
        >
          ดูรายละเอียด
        </Button>
        {!isOwner && <BidDialog nft={{ ...nft, currentBid }} userId={userId} className="w-full sm:w-auto" />}
      </CardFooter>
    </Card>
  )
}

