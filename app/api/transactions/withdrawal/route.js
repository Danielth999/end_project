import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const withdrawals = await prisma.transaction.findMany({
      where: { transactionType: "WITHDRAWAL" },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        BankAccount: true,
      },
    });

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawals" },
      { status: 500 }
    );
  }
}
