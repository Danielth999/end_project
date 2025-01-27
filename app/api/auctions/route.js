import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    // Process and update expired auctions
    await prisma.artwork.updateMany({
      where: {
        typeId: 2,
        status: "ACTIVE",
        auctionEndAt: { lte: now },
      },
      data: {
        status: "AUCTION_ENDED",
      },
    });

    // Fetch only active auctions
    const activeAuctions = await prisma.artwork.findMany({
      where: {
        typeId: 2,
        status: "ACTIVE",
        auctionEndAt: { gt: now },
      },
      include: {
        User: true,
        Category: true,
        Bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
    });

    const formattedAuctions = activeAuctions.map((auction) => ({
      user: {
        id: auction.User.id,
        name: auction.User.firstName,
      },
      category: {
        id: auction.Category.id,
        name: auction.Category.name,
      },
      id: auction.id,
      name: auction.title,
      createdAt: auction.createdAt,
      currentBid:
        auction.Bids.length > 0
          ? Number.parseFloat(auction.Bids[0].amount)
          : Number.parseFloat(auction.auctionStartPrice),
      endTime: auction.auctionEndAt,
      image: auction.imageUrl,
    }));

    // Set cache control headers to prevent caching
    const headers = new Headers();
    headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return NextResponse.json(formattedAuctions, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching and processing auctions:", error);
    return NextResponse.json(
      { error: "Failed to fetch and process auctions" },
      { status: 500 }
    );
  }
}
