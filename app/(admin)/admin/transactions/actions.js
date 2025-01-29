"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateTransactionStatus(id, status) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    // คืนเงินให้ผู้ใช้ถ้าสถานะเป็น FAILED หรือ CANCELLED
    if (
      transaction.transactionType === "WITHDRAWAL" &&
      (status === "FAILED" || status === "CANCELLED")
    ) {
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          walletBalance: {
            increment: transaction.amount,
          },
        },
      });
    }

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

export async function deleteTransaction(id) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return { success: false, message: "Transaction not found" };
    }

    // คืนเงินให้ผู้ใช้เมื่อมีการลบคำขอถอนเงิน
    if (transaction.transactionType === "WITHDRAWAL") {
      await prisma.user.update({
        where: { id: transaction.userId },
        data: {
          walletBalance: {
            increment: transaction.amount,
          },
        },
      });
    }

    await prisma.transaction.delete({ where: { id } });

    revalidatePath("/admin/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, message: "Failed to delete transaction" };
  }
}
