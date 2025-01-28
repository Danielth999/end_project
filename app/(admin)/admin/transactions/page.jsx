"use client";

import Transactions from "./components/Transactions";
import useSWR from "swr";
import axios from "axios";

export default function TransactionsPage() {
  const {
    data: withdrawals,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/withdrawal`,
    (url) => axios.get(url).then((res) => res.data), // ใช้ axios เป็น fetcher
    {
      revalidateOnFocus: true, // อัปเดตข้อมูลเมื่อกลับมาที่หน้าเว็บ
      refreshInterval: 5000, // อัปเดตข้อมูลทุก 5 วินาที
    }
  );

  // Handle กรณีที่ยังโหลดไม่เสร็จ
  if (isLoading) return <p>กำลังโหลดข้อมูล...</p>;

  // Handle กรณีเกิดข้อผิดพลาด
  if (error) return <p>เกิดข้อผิดพลาด: {error.message}</p>;

  return (
    <Transactions
      initialWithdrawals={withdrawals} // ส่งข้อมูลไปยัง Transactions
      mutate={mutate} // ส่ง mutate เพื่อใช้รีเฟรชข้อมูล
    />
  );
}
