"use client";

import { useState } from "react";
import Image from "next/image";
import { Wallet, CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const amounts = [100, 500, 1000, 2000, 5000, 10000];

export default function WalletTopUp({ userId }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleProceedToPayment = () => {
    if (selectedAmount && paymentMethod) {
      setIsQRCodeModalOpen(true);
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกข้อมูลให้ครบถ้วน",
        text: "โปรดเลือกจำนวนเงินและวิธีการชำระเงิน",
      });
    }
  };

  const handleConfirmPayment = async () => {
    setIsQRCodeModalOpen(false);
    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const transaction = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`,
        {
          userId: userId,
          amount: selectedAmount,
          status: "pending",
          transactionType: "DEPOSIT",
        }
      );

      Swal.fire({
        icon: "success",
        title: "การชำระเงินถูกบันทึก",
        text: "รายการของคุณถูกบันทึกในระบบด้วยสถานะยังไม่ได้ยืนยัน",
      });

      console.log("Transaction saved:", transaction);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกการชำระเงินได้ กรุณาลองใหม่",
      });
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
        <Card className="w-full max-w-md bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white shadow-xl rounded-lg border border-gray-600">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center text-green-400">
              <Wallet className="mr-2" />
              เติม Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-medium mb-4 text-center text-gray-300">
                เลือกจำนวนที่ต้องการเติม
              </p>
              <div className="grid grid-cols-2 gap-4">
                {amounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    className={`w-full py-2 px-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
                      selectedAmount === amount
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium mb-4 text-center text-gray-300">
                เลือกวิธีการชำระเงิน
              </p>
              <Select onValueChange={handlePaymentMethodSelect}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-300">
                  <SelectValue placeholder="เลือกวิธีการชำระเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promptpay">พร้อมเพย์</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleProceedToPayment}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              ดำเนินการชำระเงิน
            </Button>
            <p className="text-sm text-gray-400 text-center">
              หลังจากชำระเงิน กรุณาอัปโหลดสลิปในหน้าประวัติการทำรายการ
            </p>
          </CardFooter>
        </Card>

        <Dialog open={isQRCodeModalOpen} onOpenChange={setIsQRCodeModalOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>QR Code สำหรับชำระเงิน</DialogTitle>
              <DialogDescription>
                สแกน QR Code นี้เพื่อชำระเงินผ่านพร้อมเพย์
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-lg font-semibold">
                จำนวนที่ต้องการเติม: ฿{selectedAmount?.toLocaleString()}
              </p>
              <div className="w-64 h-64 relative">
                <Image
                  src="/image/qr.webp"
                  alt="QR Code"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-400">
                หลังจากชำระเงิน กรุณากดปุ่ม &ldquo;ยืนยันการชำระเงิน&rdquo;
              </p>
              <small className="text-red-400">
                * กรุณาอย่าลืมอัปโหลดสลิปในหน้าประวัติการทำรายการ
              </small>
            </div>
            <DialogFooter>
              <Button
                onClick={handleConfirmPayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                ยืนยันการชำระเงิน
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
