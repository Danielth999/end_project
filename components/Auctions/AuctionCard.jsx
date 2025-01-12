"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import CountdownTimer from "./CountdownTimer";
import BidDialog from "./BidDialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuctionCard({ nft, onBid, onTimeUp, userId }) {
  const [isHovered, setIsHovered] = useState(false);
  const imageRef = useRef(null);

  const isOwner = nft.user.id === userId;

  const formattedDate = nft.createdAt
    ? formatDistanceToNow(new Date(nft.createdAt), {
        addSuffix: true,
        locale: th,
      })
    : "ไม่ทราบเวลา";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-gray-900 text-white border-gray-800 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-[#2dac5c]/20">
        <CardHeader className="p-0 relative w-full aspect-square overflow-hidden group">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              ref={imageRef}
              src={nft.image}
              alt={nft.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="transition-transform duration-300 object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
          />
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            <Badge variant="secondary" className="bg-[#2dac5c] text-white">
              ประมูล
            </Badge>
            {isOwner && (
              <Badge
                variant="secondary"
                className="border-[#2dac5c] text-[#2dac5c]"
              >
                คุณเป็นเจ้าของ
              </Badge>
            )}
          </div>
          <p className="absolute bottom-2 right-2 text-sm text-gray-300">
            {formattedDate}
          </p>
        </CardHeader>

        <CardContent className="flex-grow p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="text-xl font-semibold mb-2 sm:mb-0">{nft.name}</h3>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-400">ราคาเสนอปัจจุบัน</p>
              <p className="text-lg font-bold text-[#2dac5c]">
                {nft.currentBid} BTH
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <CountdownTimer
              endTime={nft.endTime}
              duration={nft.duration}
              onTimeUp={onTimeUp}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
            <p>ศิลปิน: {nft.user?.name || "ไม่ระบุ"}</p>
            <p>หมวดหมู่: {nft.category?.name || "ไม่ระบุ"}</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="w-full sm:w-auto flex-grow bg-[#2dac5c] hover:bg-[#238c4b] transition-colors duration-300"
              >
                ดูรายละเอียด
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border border-gray-800 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4">{nft.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-gray-300">{nft.description}</p>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">ราคาเสนอปัจจุบัน</h4>
                  <p className="text-2xl font-bold text-[#2dac5c]">
                    {nft.currentBid} BTH
                  </p>
                </div>
                <CountdownTimer
                  endTime={nft.endTime}
                  duration={nft.duration}
                  onTimeUp={onTimeUp}
                />
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <p>ศิลปิน: {nft.user?.name || "ไม่ระบุ"}</p>
                  <p>หมวดหมู่: {nft.category?.name || "ไม่ระบุ"}</p>
                  <p>สร้างเมื่อ: {formattedDate}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {!isOwner && (
            <BidDialog
              nft={nft}
              onBid={onBid}
              userId={userId}
              className="w-full sm:w-auto"
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

