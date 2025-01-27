import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    // Process expired auctions
    const expiredAuctions = await prisma.artwork.findMany({
      where: {
        typeId: 2,
        status: "ACTIVE",
        auctionEndAt: { lte: now },
      },
      include: {
        Bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
    });

    for (const auction of expiredAuctions) {
      const winningBid = auction.Bids[0];

      if (winningBid) {
        await prisma.history.create({
          data: {
            userId: winningBid.userId,
            artworkId: auction.id,
            amount: winningBid.amount,
            actionType: "BID",
            downloadUrl: auction.imageUrl,
          },
        });
      }

      await prisma.artwork.update({
        where: { id: auction.id },
        data: { status: "AUCTION_ENDED" },
      });
    }

    // Fetch active auctions
    const activeAuctions = await prisma.artwork.findMany({
      where: {
        typeId: 2,
        status: "ACTIVE",
        auctionEndAt: { gte: now },
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
    headers.set("Cache-Control", "no-store, max-age=0");

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
