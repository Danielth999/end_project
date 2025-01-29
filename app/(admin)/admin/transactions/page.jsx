"use client";

import useSWR from "swr";
import Transactions from "./components/Transactions";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function TransactionsPage() {
  const {
    data: withdrawals,
    error,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/withdrawal`,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (!withdrawals) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error.message}</p>;

  return (
    <Transactions
      initialWithdrawals={withdrawals}
      refetchWithdrawals={mutate}
    />
  );
}
