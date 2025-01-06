"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, CreditCard, Check } from 'lucide-react';
import fetcher from "@/lib/fetcher";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  { id: 'cart', label: 'ตะกร้าสินค้า', icon: ShoppingCart },
  { id: 'review', label: 'ตรวจสอบคำสั่งซื้อ', icon: CreditCard },
  { id: 'complete', label: 'เสร็จสิ้น', icon: Check },
];

export default function OrderContainer({ userId }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('review');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: cartData, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
    fetcher
  );

  const processOrder = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process order");
      }

      const result = await response.json();
      toast.success("สั่งซื้อสำเร็จ!");
      setCurrentStep('complete');
      setTimeout(() => router.push("/history"), 3000);
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลตะกร้า</p>;
  }

  if (!cartData || cartData.cartItems.length === 0) {
    return <p className="text-center text-white">ตะกร้าของคุณว่างเปล่า</p>;
  }

  const totalPrice = cartData.cartItems.reduce(
    (sum, item) => sum + Number(item.Artwork.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
          {steps.map((step, index) => (
            <li key={step.id} className={`flex md:w-full items-center ${currentStep === step.id ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                {step.icon && <step.icon className="w-4 h-4 mr-2" />}
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-white text-center">สรุปคำสั่งซื้อ</h1>
      
      <div className="space-y-4 mb-6">
        {cartData.cartItems.map((item) => (
          <motion.div 
            key={item.id} 
            className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <Image 
                src={item.Artwork.imageUrl} 
                alt={item.Artwork.title} 
                width={60} 
                height={60} 
                className="rounded-md"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{item.Artwork.title}</h3>
                <p className="text-sm text-gray-400">จำนวน: {item.quantity}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#2dac5c]">
              ฿{(Number(item.Artwork.price) * item.quantity).toFixed(2)}
            </span>
          </motion.div>
        ))}
      </div>
      
      <div className="border-t border-gray-600 pt-4 mb-6">
        <div className="flex justify-between items-center mb-4 text-white">
          <span className="text-xl font-semibold">ยอดรวมทั้งหมด:</span>
          <span className="text-2xl font-bold text-[#2dac5c]">฿{totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <Button
        onClick={processOrder}
        disabled={isProcessing}
        className="w-full bg-[#2dac5c] hover:bg-[#238c4b] text-white text-lg py-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            กำลังดำเนินการ...
          </>
        ) : (
          "ยืนยันการสั่งซื้อ"
        )}
      </Button>
    </div>
  );
}

