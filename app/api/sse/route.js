import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const auctionId = searchParams.get("auctionId");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const auction = await prisma.artwork.findUnique({
          where: { id: auctionId },
          include: {
            Bids: {
              orderBy: { amount: "desc" },
              take: 1,
            },
          },
        });

        if (auction) {
          const data = {
            currentBid: auction.Bids[0]?.amount || auction.auctionStartPrice,
            endTime: auction.auctionEndAt,
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 5000)); // รอ 5 วินาทีก่อนอัปเดตถัดไป
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
