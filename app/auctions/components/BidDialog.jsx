"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export default function BidDialog({ nft, onBid }) {
  const { user } = useUser();
  const [bidAmount, setBidAmount] = useState(nft.currentBid + 0.1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const [isCreator, setIsCreator] = useState(false); // เพิ่มสถานะเพื่อตรวจสอบว่าเป็นผู้สร้างหรือไม่

  // ตรวจสอบว่าผู้ใช้เป็นผู้สร้างหรือไม่
  useEffect(() => {
    const checkCreatorStatus = async () => {
      try {
        if (user?.id === nft.userId) {
          // เปรียบเทียบ user ID กับ creator ID ของ NFT
          setIsCreator(true);
        }
      } catch (error) {
        console.error("Error checking creator status:", error);
      }
    };

    if (user?.id) {
      checkCreatorStatus();
    }
  }, [user?.id, nft.userId]);

  // ตรวจสอบว่าผู้ใช้ยังเป็นผู้ชนะอยู่หรือไม่
  useEffect(() => {
    const checkWinningStatus = async () => {
      try {
        const response = await axios.get(
          `/api/bids/check-winning?artworkId=${nft.id}&userId=${user.id}`
        );
        setIsWinning(response.data.isWinning);
      } catch (error) {
        console.error("Error checking winning status:", error);
      }
    };

    if (user?.id && !isCreator) {
      // ตรวจสอบสถานะการชนะเฉพาะเมื่อไม่ใช่ผู้สร้าง
      checkWinningStatus();
    }
  }, [user?.id, nft.id, isCreator]);

  const handleBid = async () => {
    if (isCreator) {
      // ไม่อนุญาตให้ผู้สร้างการประมูลเสนอราคา
      toast.error("ผู้สร้างการประมูลไม่สามารถเสนอราคาได้");
      return;
    }

    if (isWinning) {
      toast.error(
        "คุณยังเป็นผู้เสนอราคาสูงสุดอยู่แล้ว ไม่สามารถเสนอราคาใหม่ได้"
      );
      return;
    }

    if (bidAmount > nft.currentBid) {
      setIsSubmitting(true);

      const toastId = toast.loading("กำลังเสนอราคา...");

      try {
        const response = await axios.post("/api/bids", {
          artworkId: nft.id,
          userId: user.id,
          amount: bidAmount,
        });

        if (response.status === 200) {
          onBid(nft.id, bidAmount); // อัปเดตสถานะใน UI
          toast.success("เสนอราคาสำเร็จ!", { id: toastId });
        }
      } catch (error) {
        console.error("Error placing bid:", error);
        toast.error(
          error.response?.data?.message || "เกิดข้อผิดพลาดในการเสนอราคา",
          { id: toastId }
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("ราคาที่เสนอต้องสูงกว่าปัจจุบัน");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-[#2dac5c] text-white hover:bg-[#249652]"
          disabled={isCreator} // ปิดปุ่มหากเป็นผู้สร้าง
        >
          วางราคาเสนอ
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>วางราคาเสนอสำหรับ {nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p>ราคาเสนอปัจจุบัน: {nft.currentBid} BTH</p>
          {isCreator ? (
            <p className="text-red-400 text-sm">
              คุณเป็นผู้สร้างการประมูล ไม่สามารถเสนอราคาได้
            </p>
          ) : (
            <>
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
                disabled={isSubmitting || isWinning || isCreator}
              >
                {isSubmitting ? "กำลังดำเนินการ..." : "ยืนยันราคาเสนอ"}
              </Button>
            </>
          )}
          {isWinning && (
            <p className="text-red-400 text-sm">
              คุณยังเป็นผู้เสนอราคาสูงสุดอยู่แล้ว ไม่สามารถเสนอราคาใหม่ได้
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
