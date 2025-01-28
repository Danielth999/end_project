// app/admin/transactions/page.js

import Transactions from "./components/Transactions";
const fetchWithdrawals = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/withdrawal`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};
export default async function TransactionsPage() {
  const withdrawals = await fetchWithdrawals();
  // ดึงข้อมูล withdrawals จากฐานข้อมูล

  return <Transactions initialWithdrawals={withdrawals} />;
}
