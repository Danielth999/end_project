"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axios from "axios"
import toast from "react-hot-toast"

export default function BidDialog({ nft, userId }) {
  const [currentBid, setCurrentBid] = useState(Math.floor(nft.currentBid || 0))
  const [bidAmount, setBidAmount] = useState(currentBid + 1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isWinning, setIsWinning] = useState(false)
  const [isCreator, setIsCreator] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const checkStatus = async () => {
    try {
      setIsCreator(userId === nft.userId)

      if (userId && userId !== nft.userId) {
        const response = await axios.get(`/api/bids/check-winning?artworkId=${nft.id}&userId=${userId}`)
        setIsWinning(response.data.isWinning)
      }
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }

  useEffect(() => {
    setCurrentBid(Math.floor(nft.currentBid || 0))
  }, [nft.currentBid])

  useEffect(() => {
    setBidAmount(currentBid + 1)
  }, [currentBid])

  useEffect(() => {
    checkStatus()
  }, [currentBid, userId, nft]) //Fixed: Added nft to the dependency array

  const handleBid = async () => {
    const parsedBid = Number.parseInt(bidAmount, 10)

    if (isNaN(parsedBid) || parsedBid <= currentBid) {
      toast.error(`ราคาที่เสนอต้องมากกว่า ${currentBid} BTH`)
      return
    }

    if (isCreator) {
      toast.error("ผู้สร้างการประมูลไม่สามารถเสนอราคาได้")
      return
    }

    setIsSubmitting(true)

    const toastId = toast.loading("กำลังเสนอราคา...")

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/bids`, {
        artworkId: nft.id,
        userId,
        amount: parsedBid,
      })

      if (response.status === 200) {
        toast.success("เสนอราคาสำเร็จ!", { id: toastId })
        setIsOpen(false)
        checkStatus()
      }
    } catch (error) {
      console.error("Error placing bid:", error)
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการเสนอราคา", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#2dac5c] text-white hover:bg-[#249652]" disabled={isCreator || isWinning}>
          {isCreator ? "คุณเป็นผู้สร้าง" : isWinning ? "คุณเป็นผู้เสนอราคาสูงสุด" : "วางราคาเสนอ"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>วางราคาเสนอสำหรับ {nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p>ราคาเสนอปัจจุบัน: {currentBid} BTH</p>
          {isCreator ? (
            <p className="text-red-400 text-sm">คุณเป็นผู้สร้างการประมูล ไม่สามารถเสนอราคาได้</p>
          ) : isWinning ? (
            <p className="text-green-400 text-sm">คุณเป็นผู้เสนอราคาสูงสุด</p>
          ) : (
            <>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Math.max(currentBid + 1, Number(e.target.value)))}
                step="1"
                min={currentBid + 1}
                className="bg-gray-800 border-gray-700 text-white px-4 py-2 rounded"
              />
              <Button
                onClick={handleBid}
                className="bg-[#2dac5c] text-white hover:bg-[#249652]"
                disabled={isSubmitting || isCreator || isWinning}
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันราคาเสนอ"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

