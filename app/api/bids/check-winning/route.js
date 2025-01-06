import {prisma} from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artworkId = searchParams.get("artworkId");
  const userId = searchParams.get("userId");

  try {
    // ตรวจสอบว่าผู้ใช้ยังเป็นผู้ชนะอยู่หรือไม่
    const winningBid = await prisma.bid.findFirst({
      where: {
        artworkId,
        userId,
        isWinning: true,
      },
    });

    return Response.json({ isWinning: !!winningBid }, { status: 200 });
  } catch (error) {
    console.error("Error checking winning status:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
