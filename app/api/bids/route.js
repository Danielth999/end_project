import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// app/api/bids/route.js
export async function POST(request) {
  try {
    const { artworkId, userId, amount } = await request.json();

    // เริ่ม transaction เพื่อให้การทำงานเป็น atomic
    const result = await prisma.$transaction(async (prisma) => {
      // ตรวจสอบว่าผู้ใช้ยังเป็นผู้ชนะอยู่หรือไม่
      const winningBid = await prisma.bid.findFirst({
        where: { artworkId, userId, isWinning: true },
      });

      if (winningBid) {
        throw new Error("คุณยังเป็นผู้ชนะอยู่ ไม่สามารถเสนอราคาใหม่ได้");
      }

      // ดึงข้อมูลผู้ใช้และผลงาน
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const artwork = await prisma.artwork.findUnique({
        where: { id: artworkId },
      });

      if (!user || !artwork) {
        throw new Error("User or Artwork not found");
      }

      // ตรวจสอบเงินใน wallet
      if (user.walletBalance < amount) {
        throw new Error("จำนวนเงินที่เสนอมากกว่าเงินใน wallet");
      }

      // ตรวจสอบราคาที่เสนอ
      if (artwork.highestBid && amount <= artwork.highestBid) {
        throw new Error("Bid amount must be higher than current bid");
      }

      // คืนเงินให้ผู้ชนะเดิม (ถ้ามี)
      if (artwork.highestBid) {
        const previousWinner = await prisma.bid.findFirst({
          where: { artworkId, isWinning: true },
        });

        if (previousWinner) {
          await prisma.user.update({
            where: { id: previousWinner.userId },
            data: { walletBalance: { increment: previousWinner.amount } },
          });

          await prisma.bid.update({
            where: { id: previousWinner.id },
            data: { isWinning: false },
          });
        }
      }

      // หักเงินจากผู้ใช้ที่เสนอราคาใหม่
      await prisma.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: amount } },
      });

      // สร้าง Bid ใหม่
      const newBid = await prisma.bid.create({
        data: { artworkId, userId, amount, isWinning: true },
      });

      // อัปเดตราคาสูงสุดในผลงาน
      await prisma.artwork.update({
        where: { id: artworkId },
        data: { highestBid: amount },
      });

      return newBid;
    });

    return NextResponse.json(
      { message: "Bid placed successfully", bid: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
