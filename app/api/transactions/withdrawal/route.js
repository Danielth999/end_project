import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // บังคับให้ API ทำงานแบบ dynamic

export async function GET() {
  try {
    const withdrawals = await prisma.transaction.findMany({
      where: { transactionType: "WITHDRAWAL" },
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        BankAccount: true,
      },
    });

    return NextResponse.json(withdrawals, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
