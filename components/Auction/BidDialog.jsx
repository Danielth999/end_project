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
  const [bidAmount, setBidAmount] = useState(
    (nft.currentBid + 0.1).toFixed(2)
  ); // กำหนดค่าเริ่มต้นเป็นทศนิยม 2 ตำแหน่ง
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  // ตรวจสอบว่าผู้ใช้เป็นผู้สร้างหรือไม่
  useEffect(() => {
    const checkCreatorStatus = async () => {
      if (user?.id === nft.userId) {
        setIsCreator(true);
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
      checkWinningStatus();
    }
  }, [user?.id, nft.id, isCreator]);

  const handleBid = async () => {
    if (isCreator) {
      toast.error("ผู้สร้างการประมูลไม่สามารถเสนอราคาได้");
      return;
    }

    if (isWinning) {
      toast.error("คุณยังเป็นผู้เสนอราคาสูงสุดอยู่แล้ว");
      return;
    }

    if (parseFloat(bidAmount) > nft.currentBid) {
      setIsSubmitting(true);

      const toastId = toast.loading("กำลังเสนอราคา...");

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/bids`,
          {
            artworkId: nft.id,
            userId: user.id,
            amount: parseFloat(bidAmount).toFixed(2), // ส่งค่าเป็นทศนิยม 2 ตำแหน่ง
          }
        );

        if (response.status === 200) {
          onBid(nft.id, parseFloat(bidAmount).toFixed(2)); // อัปเดตสถานะใน UI
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
          disabled={isCreator}
        >
          วางราคาเสนอ
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border border-gray-800">
        <DialogHeader>
          <DialogTitle>วางราคาเสนอสำหรับ {nft.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <p>ราคาเสนอปัจจุบัน: {nft.currentBid.toFixed(2)} BTH</p>
          {isCreator ? (
            <p className="text-red-400 text-sm">
              คุณเป็นผู้สร้างการประมูล ไม่สามารถเสนอราคาได้
            </p>
          ) : (
            <>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) =>
                  setBidAmount(parseFloat(e.target.value).toFixed(2))
                }
                step="0.1"
                min={(nft.currentBid + 0.1).toFixed(2)}
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
              คุณยังเป็นผู้เสนอราคาสูงสุดอยู่แล้ว
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
