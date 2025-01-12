import { prisma } from "@/lib/prisma"; // นำเข้า Prisma สำหรับการเชื่อมต่อฐานข้อมูล

import { NextResponse } from "next/server"; // นำเข้า NextResponse สำหรับจัดการคำตอบของ API

export async function GET() {
  try {
    const now = new Date(); // เวลาปัจจุบัน

    // ประมวลผลการประมูลที่หมดเวลา
    const expiredAuctions = await prisma.artwork.findMany({
      where: {
        typeId: 2, // ประเภทการประมูล
        status: "ACTIVE", // สถานะ Active
        auctionEndAt: { lte: now }, // สิ้นสุด <= เวลาปัจจุบัน
      },
      include: {
        Bids: {
          orderBy: { amount: "desc" }, // เรียงลำดับราคาสูงสุดก่อน
          take: 1, // ดึงเฉพาะ Bid สูงสุด
        },
      },
    });

    // วนลูปผ่านการประมูลที่หมดเวลา
    for (const auction of expiredAuctions) {
      const winningBid = auction.Bids[0]; // ดึงผู้ชนะการประมูล (ถ้ามี)

      if (winningBid) {
        // สร้างบันทึกใน History เฉพาะผู้ชนะ
        await prisma.history.create({
          data: {
            userId: winningBid.userId, // ผู้ชนะ
            artworkId: auction.id, // งานที่ชนะ
            amount: winningBid.amount, // จำนวนเงิน
            actionType: "BID", // กำหนดเป็นการซื้อ
            downloadUrl: auction.imageUrl, // URL ภาพที่ดาวน์โหลดได้
          },
        });

        // เปลี่ยนสถานะงานเป็น AUCTION_ENDED
        await prisma.artwork.update({
          where: { id: auction.id },
          data: { status: "AUCTION_ENDED" },
        });
      } else {
        // หากไม่มี Bid เปลี่ยนสถานะเป็น AUCTION_ENDED
        await prisma.artwork.update({
          where: { id: auction.id },
          data: { status: "AUCTION_ENDED" },
        });
      }
    }

    // ดึงการประมูลที่ยังเปิดใช้งานอยู่
    const activeAuctions = await prisma.artwork.findMany({
      where: {
        typeId: 2, // ประเภทการประมูล
        status: "ACTIVE", // สถานะ Active
        auctionEndAt: { gte: now }, // สิ้นสุด >= เวลาปัจจุบัน
      },
      include: {
        User: true, // ดึงข้อมูลผู้ใช้งาน
        Category: true, // ดึงข้อมูลประเภท
        Bids: {
          orderBy: { amount: "desc" }, // เรียงราคาจากสูงไปต่ำ
          take: 1, // ดึงเฉพาะ Bid สูงสุด
        },
      },
    });

    // แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ
    const formattedAuctions = activeAuctions.map((auction) => ({
      // user
      user: {
        id: auction.User.id,
        name: auction.User.firstName,
      },
      // category
      category: {
        id: auction.Category.id,
        name: auction.Category.name,
      },
      // ข้อมูลการประมูล
      id: auction.id,
      name: auction.title,
      createdAt: auction.createdAt,
      currentBid:
        auction.Bids.length > 0
          ? parseFloat(auction.Bids[0].amount)
          : parseFloat(auction.auctionStartPrice),
      endTime: auction.auctionEndAt,
      image: auction.imageUrl,
    }));

    // ส่งข้อมูลกลับในรูปแบบ JSON
    return NextResponse.json(formattedAuctions, { status: 200 });
  } catch (error) {
    console.error("Error fetching and processing auctions:", error); // แสดงข้อผิดพลาด
    return NextResponse.json(
      { error: "Failed to fetch and process auctions" },
      { status: 500 }
    );
  }
}
