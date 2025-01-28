import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        Artworks: {
          some: {}, // ตรวจสอบว่ามี Artwork อย่างน้อย 1 ชิ้น
        },
      },
      orderBy: {
        salesCount: "desc", // เรียงลำดับตามยอดขาย (มาก -> น้อย)
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error",
        msg: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
