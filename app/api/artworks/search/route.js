// app/api/search/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query"); // รับคำค้นหาจาก query parameter

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
        status: "ACTIVE",
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
      { error: "Failed to search artworks" },
      { status: 500 }
    );
  }
}
