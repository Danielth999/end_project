// app/admin/transactions/page.js
import { PrismaClient } from "@prisma/client";
import Transactions from "./components/Transactions";

const prisma = new PrismaClient();

export default async function TransactionsPage() {
  // ดึงข้อมูล withdrawals จากฐานข้อมูล
  const withdrawals = await prisma.transaction.findMany({
    where: { transactionType: "WITHDRAWAL" },
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      User: true,
      BankAccount: true,
    },
  });

  return <Transactions initialWithdrawals={withdrawals} />;
}