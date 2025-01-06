import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        status: "ACTIVE",
        typeId: 1, // ตรวจสอบจาก typeId โดยตรง
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: true,
        Category: true,
        ArtworkType: true,
      },
    });
    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      title,
      description,
      price,
      auctionStartPrice,
      auctionStartAt,
      auctionEndAt,
      categoryId,
      typeId,
      imageUrl,
    } = body;

    // ตรวจสอบประเภทของ Artwork (ขายหรือประมูล)
    const isAuction = typeId === 2; // สมมติว่า typeId 2 คือการประมูล

    const artwork = await prisma.artwork.create({
      data: {
        userId,
        title,
        description,
        price: isAuction ? null : price, // ถ้าเป็นการประมูลไม่ต้องมี price
        auctionStartPrice: isAuction ? auctionStartPrice : null, // ถ้าเป็นการขายไม่ต้องมี auctionStartPrice
        auctionStartAt: isAuction ? auctionStartAt : null,
        auctionEndAt: isAuction ? auctionEndAt : null,
        categoryId,
        typeId,
        imageUrl,
        status: "ACTIVE", // ตั้งค่าเริ่มต้นเป็น ACTIVE
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
