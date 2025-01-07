// app/admin/transactions/actions.js
"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// เพิ่ม Transaction
export async function addTransaction(formData) {
  try {
    const userId = formData.get("userId");
    const amount = parseFloat(formData.get("amount"));
    const bankAccountId = formData.get("bankAccountId");

    await prisma.transaction.create({
      data: {
        userId,
        amount,
        bankAccountId,
        transactionType: "WITHDRAWAL",
        status: "PENDING",
      },
    });

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, message: "Failed to add transaction" };
  }
}

// อัปเดตสถานะ Transaction
export async function updateTransactionStatus(id, status) {
  try {
    await prisma.transaction.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return { success: false, message: "Failed to update transaction status" };
  }
}

// ลบ Transaction
export async function deleteTransaction(id) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (transaction.transactionType === "WITHDRAWAL") {
      // คืนเงินให้ผู้ใช้
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          walletBalance: {
            increment: transaction.amount,
          },
        },
      });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, message: "Failed to delete transaction" };
  }
}