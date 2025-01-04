"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const WalletComponent = () => {
  // ใช้ SWR ดึงข้อมูลยอดเงิน
  const { data, error, isLoading, isValidating } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wallet`,
    fetcher,
    { refreshInterval: 10000 } // อัปเดตข้อมูลทุก 10 วินาที
  );

  // กรณีโหลดครั้งแรก (Initial Loading)
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-sm font-bold bg-[#2dac5c] text-white rounded-full animate-pulse"
        >
          <Wallet size={20} />
          <span>กำลังโหลด...</span>
        </Button>
      </div>
    );
  }

  // กรณีเกิดข้อผิดพลาด
  if (error) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="text-sm font-bold bg-red-600 text-white rounded-full"
        >
          <Wallet size={20} />
          <span>ไม่สามารถโหลดยอดเงินได้</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/wallet-top-up">
        <Button
          variant="outline"
          className={`text-sm font-bold rounded-full ${
            isValidating
              ? "bg-[#2dac5c] text-white animate-pulse"
              : "bg-[#2dac5c] text-white"
          }`}
        >
          <Wallet size={20} />
          {data?.walletBalance ? `${data.walletBalance} BTH` : "ไม่พบข้อมูล"}
        </Button>
      </Link>
    </div>
  );
};

export default WalletComponent;
