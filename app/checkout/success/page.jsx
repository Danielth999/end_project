// app/checkout/success/page.jsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">ชำระเงินสำเร็จ!</h1>
      <p className="text-gray-600 mb-6">
        ขอบคุณที่ชำระเงิน คุณสามารถตรวจสอบรายละเอียดการสั่งซื้อในอีเมลของคุณ
      </p>
      <Link href="/">
        <Button className="bg-[#2dac5c] hover:bg-[#238c4b] text-white">
          กลับสู่หน้าหลัก
        </Button>
      </Link>
    </div>
  );
}