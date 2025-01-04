import { prisma } from "@/lib/prisma"; // Prisma Client

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ถ้าไม่มีผู้ใช้
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // ค้นหาข้อมูล Transaction จาก Prisma
    const Transactions = await prisma.transaction.findMany({});

    // ถ้าไม่พบข้อมูล Transaction
    if (!Transactions || Transactions.length === 0) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }
    // ส่งข้อมูล Transaction กลับไปให้ Client
    return NextResponse.json(Transactions);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error fetching Transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // destructuring ข้อมูลที่ส่งมาจาก Client
    const { userId, amount, fee, status, transactionType } = await req.json();

    // ถ้าไม่มีข้อมูล userId
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ถ้าไม่มีข้อมูล amount
    if (!amount) {
      return NextResponse.json({ error: "Missing amount" }, { status: 400 });
    }
    // ดึงข้อมูลจาก Prisma และบันทึกข้อมูล Transaction
    const Transactions = await prisma.Transaction.create({
      data: {
        userId: userId,
        fee: fee,
        transactionType,
        amount,
        status: "PENDING",
      },
    });

    // ส่งข้อมูล Transaction กลับไปให้ Client
    return NextResponse.json({
      message: "Transaction saved",
      Transactions,
    });
  } catch (error) {
    console.error("Error save transaction:", error);
    return NextResponse.json(
      { error: "Failed save transaction" },
      { status: 500 }
    );
  }
}
