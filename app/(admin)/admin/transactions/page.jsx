"use client";

import { useState, useEffect } from "react";
import Transactions from "./components/Transactions";
import axios from "axios";

export default function TransactionsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/withdrawal`);
      setWithdrawals(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchWithdrawals]); // Added fetchWithdrawals to dependencies

  if (isLoading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

  return <Transactions initialWithdrawals={withdrawals} refetchWithdrawals={fetchWithdrawals} />;
}
