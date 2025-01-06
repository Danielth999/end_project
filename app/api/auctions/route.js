import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auctions = await prisma.artwork.findMany({
      where: {
        typeId: 2, // ประเภทการประมูล
        status: "ACTIVE", // สถานะ Active
      },
      include: {
        Bids: {
          orderBy: {
            amount: "desc", // เรียงตามราคาสูงสุด
          },
          take: 1, // ดึงเฉพาะราคาสูงสุด
        },
      },
    });

    const formattedAuctions = auctions.map((auction) => ({
      id: auction.id,
      name: auction.title,
      currentBid:
        auction.Bids.length > 0
          ? parseFloat(auction.Bids[0].amount)
          : parseFloat(auction.auctionStartPrice),
      endTime: auction.auctionEndAt,
      image: auction.imageUrl,
      duration: calculateDuration(auction.auctionStartAt, auction.auctionEndAt),
    }));

    return NextResponse.json(formattedAuctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    );
  }
}

function calculateDuration(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const durationInHours = Math.floor((end - start) / (1000 * 60 * 60));
  return `${durationInHours} ชั่วโมง`;
}
