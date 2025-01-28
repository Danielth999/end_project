import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // นับจำนวน Artwork ที่มีการประมูล (Auction Artworks)
    const auctionCount = await prisma.artwork.count({
      where: {
        typeId: 2, // ประเภทการประมูล
      },
    });

    // นับจำนวน Artwork ที่ไม่มีการประมูล (Non-Auction Artworks)
    const nonAuctionCount = await prisma.artwork.count({
      where: {
        typeId: {
          not: 2, // ไม่ใช่ประเภทการประมูล (typeId != 2)
        },
      },
    });

    // นับจำนวนผู้ใช้ที่ไม่ซ้ำกันที่มี Artwork
    const uniqueUserCount = await prisma.artwork.groupBy({
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
    // หาราคาต่ำสุดของ Artwork ที่ไม่ใช่การประมูล

    const minPrice = await prisma.artwork.aggregate({
      _min: {
        price: true,
      },
    });

    return NextResponse.json({
      auctionCount, // จำนวน Artwork ที่มีการประมูล
      nonAuctionCount, // จำนวน Artwork ที่ไม่มีการประมูล
      uniqueUserCount: uniqueUserCount.length, // จำนวนผู้ใช้ที่ไม่ซ้ำกันที่มี Artwork
      minPrice: minPrice._min.price, // ราคาต่ำสุดของ Artwork ที่ไม่ใช่การประมูล
    });
  } catch (error) {
    console.error("Error fetching artwork stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork stats" },
      { status: 500 }
    );
  }
}
