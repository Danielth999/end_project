import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // รับข้อมูลจาก request body
    const { artworkId, userId, amount } = await request.json();

    // ตรวจสอบว่าผู้ใช้ยังเป็นผู้ชนะอยู่หรือไม่
    const winningBid = await prisma.bid.findFirst({
      where: {
        artworkId,
        userId,
        isWinning: true, // กำหนดว่าต้องเป็นผู้ชนะ
      },
    });

    if (winningBid) {
      // หากผู้ใช้ยังเป็นผู้ชนะอยู่ จะไม่อนุญาตให้เสนอราคาใหม่
      return NextResponse.json(
        { message: "คุณยังเป็นผู้ชนะอยู่ ไม่สามารถเสนอราคาใหม่ได้" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลผู้ใช้และผลงานจากฐานข้อมูล
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!user || !artwork) {
      // หากไม่พบผู้ใช้หรือผลงาน จะส่งข้อความแจ้งข้อผิดพลาด
      return NextResponse.json(
        { message: "User or Artwork not found" },
        { status: 404 }
      );
    }

    // ตรวจสอบว่าผู้ใช้มีเงินเพียงพอสำหรับการประมูลหรือไม่
    if (user.walletBalance < amount) {
      return NextResponse.json(
        { message: "จำนวนเงินที่เสนอมากกว่าเงินใน wallet" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าจำนวนเงินที่เสนอสูงกว่าราคาสูงสุดปัจจุบันหรือไม่
    if (artwork.highestBid && amount <= artwork.highestBid) {
      return NextResponse.json(
        { message: "Bid amount must be higher than current bid" },
        { status: 400 }
      );
    }

    // หากมีผู้ชนะคนก่อนหน้า คืนเงินให้ผู้ชนะคนก่อนหน้า
    if (artwork.highestBid) {
      const previousWinner = await prisma.bid.findFirst({
        where: { artworkId, isWinning: true },
      });

      if (previousWinner) {
        // เพิ่มเงินใน wallet ของผู้ชนะเดิม
        await prisma.user.update({
          where: { id: previousWinner.userId },
          data: { walletBalance: { increment: previousWinner.amount } },
        });

        // เปลี่ยนสถานะของ bid เดิมให้ไม่เป็นผู้ชนะ
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

    // สร้าง Bid ใหม่พร้อมกำหนดว่าเป็นผู้ชนะ
    const newBid = await prisma.bid.create({
      data: {
        artworkId,
        userId,
        amount,
        isWinning: true, // กำหนดสถานะเป็นผู้ชนะ
      },
    });

    // อัปเดตราคาสูงสุดในผลงาน
    await prisma.artwork.update({
      where: { id: artworkId },
      data: { highestBid: amount },
    });

    // บันทึกการเสนอราคาในประวัติ
    await prisma.history.create({
      data: {
        userId,
        artworkId,
        actionType: "BID", // กำหนดประเภทของการกระทำเป็น BID
        amount,
      },
    });

    // ส่งข้อความยืนยันว่าการเสนอราคาสำเร็จ
    return NextResponse.json(
      { message: "Bid placed successfully", bid: newBid },
      { status: 200 }
    );
  } catch (error) {
    // จับข้อผิดพลาดและแสดงข้อความข้อผิดพลาด
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
