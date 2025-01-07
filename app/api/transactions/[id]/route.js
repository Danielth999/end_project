import { prisma } from "@/lib/prisma"; // Prisma Client

import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    // ถ้าไม่มีผู้ใช้
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหาข้อมูล Transaction จาก Prisma
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ถ้าไม่พบข้อมูล Transaction
    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }
    // ส่งข้อมูล Transaction กลับไปให้ Client
    return NextResponse.json(transactions);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error fetching Transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
// delete transaction
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    // ถ้าไม่มีผู้ใช้
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหาข้อมูล Transaction จาก Prisma
    const transactions = await prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    // ถ้าไม่พบข้อมูล Transaction
    if (!transactions) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }
    // ส่งข้อมูล Transaction กลับไปให้ Client
    return NextResponse.json(transactions);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error deleting Transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    // ถ้าไม่มี ID
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหาข้อมูล Transaction จาก Prisma
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id,
      },
    });

    // ถ้าไม่พบข้อมูล Transaction
    if (!transaction) {
      return NextResponse.json(
        { error: "No transactions found" },
        { status: 404 }
      );
    }

    // ถ้าเป็นรายการถอนเงิน (WITHDRAWAL) และสถานะเป็น PENDING
    if (
      transaction.transactionType === "WITHDRAWAL" &&
      transaction.status === "PENDING"
    ) {
      // คืนเงินให้ผู้ใช้
      await prisma.user.update({
        where: {
          id: transaction.userId,
        },
        data: {
          walletBalance: {
            increment: transaction.amount, // เพิ่มเงินกลับเข้า wallet
          },
        },
      });
    }

    // ลบ Transaction
    await prisma.transaction.delete({
      where: {
        id: id,
      },
    });

    // ส่งข้อมูล Transaction กลับไปให้ Client
    return NextResponse.json({ message: "Transaction cancelled successfully" });
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error deleting Transaction:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
