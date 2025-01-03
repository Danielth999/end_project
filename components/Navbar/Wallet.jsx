"use client";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const WalletComponent = () => {
  const [walletBalance, setWalletBalance] = useState(null); // สถานะสำหรับเก็บยอดเงินใน Wallet
  const [loading, setLoading] = useState(true); // สถานะสำหรับแสดงการโหลด
  const [error, setError] = useState(null); // สถานะสำหรับแสดงข้อผิดพลาด

  const fetchWallet = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet`
      );
      const result = await response.json();

      if (response.ok) {
        setWalletBalance(result.walletBalance); // บันทึกยอดเงินใน Wallet
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      setError("ไม่สามารถดึงข้อมูล Wallet ได้"); // แสดงข้อผิดพลาด
    } finally {
      setLoading(false); // สิ้นสุดการโหลด
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Link href="#">
          <Button
            variant="outline"
            className="text-sm font-bold bg-[#2dac5c] text-white rounded-full"
          >
            <Wallet size={20} />
            <span>กำลังโหลด...</span>
          </Button>
        </Link>
      </div>
    ); // ข้อความโหลด
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // ข้อความแสดงข้อผิดพลาด
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/wallet-top-up">
        <Button
          variant="outline"
          className="text-sm font-bold bg-[#2dac5c] text-white rounded-full"
        >
          <Wallet size={20} />
          {walletBalance ? `${walletBalance} BTH` : "ไม่พบข้อมูล"}
        </Button>
      </Link>
    </div>
  );
};

export default WalletComponent;
