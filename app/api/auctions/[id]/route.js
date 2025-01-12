import { prisma } from "@/lib/prisma"; // Prisma Client
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; // ดึง id จาก params

    // ตรวจสอบว่า id มีค่าหรือไม่
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const now = new Date(); // เวลาปัจจุบัน

    // ดึงข้อมูลการประมูลทั้งหมดที่มี userId และ typeId ตรงกับเงื่อนไข
    const auctions = await prisma.artwork.findMany({
      where: {
        userId: id, // ใช้ userId เพื่อค้นหาการประมูล
        typeId: 2, // ประเภทการประมูล
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

    // ถ้าไม่พบข้อมูลการประมูล
    if (!auctions || auctions.length === 0) {
      return NextResponse.json({ error: "No auctions found" }, { status: 404 });
    }

    // วนลูปผ่านการประมูลที่หมดเวลา
    for (const auction of auctions) {
      if (auction.auctionEndAt <= now && auction.status === "ACTIVE") {
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
    }

    // แปลงข้อมูลให้เป็นรูปแบบที่ต้องการ
    const formattedAuctions = auctions.map((auction) => ({
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
