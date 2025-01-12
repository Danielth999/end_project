import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const userId = params.userId;

  try {
    const history = await prisma.history.findMany({
      where: {
        userId: userId,
      },
      include: {
        Artwork: {
          select: {
            title: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedHistory = history.map((item) => ({
      id: item.id,
      actionType: item.actionType,
      artworkId: item.artworkId,
      artworkName: item.Artwork?.title || "Unknown Artwork",
      imageUrl: item.Artwork?.imageUrl || null,
      amount: item.amount ? parseFloat(item.amount.toString()) : null,
      downloadUrl: item.downloadUrl,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedHistory);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
