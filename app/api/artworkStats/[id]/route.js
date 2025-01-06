import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id: userId } = params; // Extract user ID from route parameters

  try {
    // Count total artworks by the user
    const totalArtworks = await prisma.artwork.count({
      where: { userId },
    });

    // Get the minimum price of artworks by the user
    const { _min: { price: minPrice } = {} } = await prisma.artwork.aggregate({
      where: { userId }, // Filter by userId
      _min: { price: true },
    });

    // Count artworks with active or past auctions by the user
    const auctionCount = await prisma.artwork.count({
      where: {
        userId, // Filter by userId
        auctionStartAt: { not: null },
      },
    });

    // Sum the total salesCount for all artworks by the user
    const { _sum: { salesCount: totalSalesCount } = {} } =
      await prisma.user.aggregate({
        where: { id: userId }, // Filter by userId
        _sum: { salesCount: true },
      });

    // Return the stats as JSON response
    return NextResponse.json({
      totalArtworks,
      minPrice,
      auctionCount,
      totalSalesCount, // Include total sales count
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching artwork stats:", error);

    // Return an error response with status code 500
    return NextResponse.json(
      { error: "Failed to fetch artwork stats" },
      { status: 500 }
    );
  }
}
