// app/checkout/components/PaymentForm.jsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PaymentForm({ totalPrice }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // สร้าง Order และ OrderItems
      const orderResponse = await axios.post("/api/orders", {
        userId: "user-id", // เปลี่ยนเป็น userId จริงจาก session หรือ context
        totalPrice,
        items: [], // ส่งรายการสินค้าในตะกร้า (หากจำเป็น)
      });

      if (orderResponse.status === 200) {
        toast.success("ชำระเงินสำเร็จ!");
        // ล้างตะกร้าสินค้า
        await axios.delete("/api/cart");
        // Redirect ไปหน้าสั่งซื้อสำเร็จ
        router.push("/checkout/success");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("ชำระเงินไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">ชำระเงิน</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">ชื่อบนบัตร</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">หมายเลขบัตร</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">วันหมดอายุ</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="MM/YY"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CVV</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="123"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#2dac5c] hover:bg-[#238c4b] text-white"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "ชำระเงิน"
          )}
        </Button>
      </form>
    </div>
  );
}