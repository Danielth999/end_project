import { prisma } from "@/lib/prisma"; // Prisma Client
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req); // ดึง userId จาก Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูล wallet ของผู้ใช้
    const walletUser = await prisma.user.findUnique({
      where: { id: userId }, // ต้องตรงกับ id ของ Prisma Schema
      select: {
        walletBalance: true, // ชื่อฟิลด์ต้องตรงกับ Schema
      },
    });

    if (!walletUser) {
      return NextResponse.json(
        { error: "User not found or no wallet available" },
        { status: 404 }
      );
    }

    // ส่งข้อมูลกลับ
    return NextResponse.json({ walletBalance: walletUser.walletBalance });
  } catch (error) {
    console.error("Error fetching wallet:", error);

    return NextResponse.json(
      { error: "Failed to fetch wallet", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json(); // ใช้ await เพื่อดึงข้อมูล JSON
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }

    const updatedUser = await prisma.users.update({
      where: { clerk_id: userId },
      data: {
        wallet_balance: {
          increment: amount, // เพิ่มยอดเงิน
        },
      },
    });

    return NextResponse.json({
      message: "Wallet updated successfully",
      wallet_balance: updatedUser.wallet_balance,
    });
  } catch (error) {
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }
}
