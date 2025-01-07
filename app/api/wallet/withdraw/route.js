import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, bankName, accountNumber, accountName } = await req.json();

    // ตรวจสอบว่าข้อมูลครบถ้วน
    if (!amount || !bankName || !accountNumber || !accountName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const withdrawalAmount = new Prisma.Decimal(amount);

    const result = await prisma.$transaction(async (tx) => {
      // ดึงข้อมูลผู้ใช้และตรวจสอบยอดเงิน
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.walletBalance.lessThan(withdrawalAmount)) {
        throw new Error("Insufficient funds");
      }

      // อัปเดตยอดเงินใน wallet
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: withdrawalAmount } },
      });

      // บันทึกข้อมูลบัญชีธนาคาร (ถ้ายังไม่มี)
      let bankAccount = await tx.bankAccount.findFirst({
        where: { userId, accountNumber },
      });

      if (!bankAccount) {
        bankAccount = await tx.bankAccount.create({
          data: {
            userId,
            bankName,
            accountNumber,
            accountName,
          },
        });
      }

      // บันทึกการถอนเงินใน Transaction
      const transaction = await tx.transaction.create({
        data: {
          User: { connect: { id: userId } },  // ใช้ User แทน userId
          transactionType: "WITHDRAWAL",
          amount: withdrawalAmount,
          status: "PENDING",
          BankAccount: { connect: { id: bankAccount.id } },  // ใช้ BankAccount แทน bankAccountId
        },
      });

      return { updatedUser, transaction };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}