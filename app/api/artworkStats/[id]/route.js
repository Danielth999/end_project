import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params; // ดึง userId จาก params
    const now = new Date(); // เวลาปัจจุบัน

    // ตรวจสอบว่า userId มีค่าหรือไม่
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // นับจำนวน Artwork ทั้งหมดของผู้ใช้
    const totalArtworks = await prisma.artwork.count({
      where: {
        userId: id, // ใช้ userId เพื่อค้นหา Artwork ของผู้ใช้
      },
    });

    // หาราคาต่ำสุดของ Artwork ของผู้ใช้
    const minPrice = await prisma.artwork.aggregate({
      where: {
        userId: id, // ใช้ userId เพื่อค้นหา Artwork ของผู้ใช้
      },
      _min: {
        price: true,
      },
    });

    // นับจำนวน Artwork ที่มีการประมูลและยังไม่หมดเวลาของผู้ใช้
    const activeAuctionCount = await prisma.artwork.count({
      where: {
        userId: id, // ใช้ userId เพื่อค้นหา Artwork ของผู้ใช้
        typeId: 2, // ประเภทการประมูล
        status: "ACTIVE", // สถานะ Active
        auctionEndAt: {
          gt: now, // เวลาประมูลยังไม่หมด
        },
      },
    });

    // นับจำนวนการขายทั้งหมด (salesCount) ของผู้ใช้
    const userSalesCount = await prisma.user.findUnique({
      where: {
        id: id, // ใช้ userId เพื่อค้นหาข้อมูลผู้ใช้
      },
      select: {
        salesCount: true, // ดึง salesCount ของผู้ใช้
      },
    });

    return NextResponse.json({
      totalArtworks,
      minPrice: minPrice._min.price,
      activeAuctionCount, // จำนวนการประมูลที่ยังไม่หมดเวลาของผู้ใช้
      salesCount: userSalesCount?.salesCount || 0, // จำนวนการขายของผู้ใช้ (หากไม่มี salesCount จะคืนค่า 0)
    });
  } catch (error) {
    console.error("Error fetching artwork stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork stats" },
      { status: 500 }
    );
  }
}
