import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const totalArtworks = await prisma.artwork.count();
    const minPrice = await prisma.artwork.aggregate({
      _min: {
        price: true,
      },
    });
    const auctionCount = await prisma.artwork.count({
      where: {
        auctionStartAt: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      totalArtworks,
      minPrice: minPrice._min.price,
      auctionCount,
    });
  } catch (error) {
    console.error("Error fetching artwork stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork stats" },
      { status: 500 }
    );
  }
}
