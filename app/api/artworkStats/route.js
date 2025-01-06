import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // นับจำนวน Artwork ทั้งหมด
    const totalArtworks = await prisma.artwork.count();

    // หาราคาต่ำสุดของ Artwork
    const minPrice = await prisma.artwork.aggregate({
      _min: {
        price: true,
      },
    });

    // นับจำนวน Artwork ที่มีการประมูล
    const auctionCount = await prisma.artwork.count({
      where: {
        auctionStartAt: {
          not: null,
        },
      },
    });

    // นับจำนวนผู้ใช้ที่ไม่ซ้ำกันที่มี Artwork
    const usersWithArtworks = await prisma.artwork.groupBy({
      by: ["userId"], // กลุ่มตาม userId
      where: {
        userId: {
          not: null, // ตรวจสอบว่า userId ไม่เป็น null
        },
      },
      _count: {
        userId: true, // นับจำนวน userId ที่ไม่ซ้ำกัน
      },
    });

    const uniqueUserCount = usersWithArtworks.length;

    return NextResponse.json({
      totalArtworks,
      minPrice: minPrice._min.price,
      auctionCount,
      uniqueUserCount,
    });
  } catch (error) {
    console.error("Error fetching artwork stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork stats" },
      { status: 500 }
    );
  }
}