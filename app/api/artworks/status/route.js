import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const statusCounts = await prisma.artwork.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    return NextResponse.json(statusCounts);
  } catch (error) {
    console.error("Error fetching artwork status:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork status" },
      { status: 500 }
    );
  }
}