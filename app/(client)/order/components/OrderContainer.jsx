"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, CreditCard, Check } from 'lucide-react';
import fetcher from "@/lib/fetcher";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#2dac5c]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-red-500 text-xl">เกิดข้อผิดพลาดในการโหลดข้อมูลตะกร้า</p>
      </div>
    );
  }

  if (!cartData || cartData.cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-white text-xl">ตะกร้าของคุณว่างเปล่า</p>
      </div>
    );
  }

  const totalPrice = cartData.cartItems.reduce(
    (sum, item) => sum + Number(item.Artwork.price) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <ol className="flex items-center w-full space-x-2 sm:space-x-4">
              {steps.map((step, index) => (
                <li key={step.id} className={`flex items-center space-x-2.5 ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
                  <span className={`flex items-center justify-center w-8 h-8 border-2 rounded-full shrink-0 ${currentStep === step.id ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}`}>
                    <step.icon className="w-4 h-4" />
                  </span>
                  <span className={`hidden sm:inline-flex text-sm font-medium ${currentStep === step.id ? 'text-green-500' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                  {index !== steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${currentStep === steps[index + 1].id ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  )}
                </li>
              ))}
            </ol>
          </div>
          
          <h1 className="text-3xl font-extrabold mb-8 text-white text-center">สรุปคำสั่งซื้อ</h1>
          
          <AnimatePresence>
            <div className="space-y-6 mb-8">
              {cartData.cartItems.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-700 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Image 
                      src={item.Artwork.imageUrl} 
                      alt={item.Artwork.title} 
                      width={80} 
                      height={80} 
                      className="rounded-md object-cover"
                    />
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-white">{item.Artwork.title}</h3>
                      <p className="text-sm text-gray-400">จำนวน: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#2dac5c] mt-4 sm:mt-0">
                    ฿{(Number(item.Artwork.price) * item.quantity).toFixed(2)}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          
          <div className="border-t border-gray-600 pt-6 mb-8">
            <div className="flex justify-between items-center mb-4 text-white">
              <span className="text-xl font-semibold">ยอดรวมทั้งหมด:</span>
              <span className="text-3xl font-bold text-[#2dac5c]">฿{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={processOrder}
              disabled={isProcessing}
              className="w-full bg-[#2dac5c] hover:bg-[#238c4b] text-white text-lg py-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

