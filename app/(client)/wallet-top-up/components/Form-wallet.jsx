// Frontend: FormWallet Component
"use client";
import Swal from "sweetalert2";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

const amounts = [100, 500, 1000, 2000, 5000, 10000];

const FormWallet = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [file, setFile] = useState(null);
  const [slipOkData, setSlipOkData] = useState(null);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setSlipOkData(null); // Reset ข้อมูลสลิปเมื่อเลือกจำนวนใหม่
  };

  const updateWallet = async (amount) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: selectedAmount }), // ตรวจสอบว่า `selectedAmount` มีค่า
        }
      );

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: `ยอดเงินใน Wallet ของคุณเพิ่มขึ้น ${amount} บาทแล้ว!`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text:
            result.error || "ไม่สามารถอัปเดต Wallet ได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์",
      });
    }
  };

  const handleSubmitSlip = async (e) => {
    e.preventDefault();

    if (!file) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "กรุณาอัปโหลดสลิป!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch(
        `https://api.slipok.com/api/line/apikey/33341`,
        {
          method: "POST",
          headers: {
            "x-authorization": `SLIPOKC963LWT`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      console.log("Selected Amount:", selectedAmount);
      console.log("Slip Amount:", result.data.amount);

      if (response.ok) {
        setSlipOkData(result.data); // บันทึกข้อมูลสลิป

        // ตรวจสอบจำนวนเงิน
        if (parseFloat(selectedAmount) !== parseFloat(result.data.amount)) {
          Swal.fire({
            icon: "error",
            title: "จำนวนเงินไม่ตรงกัน",
            text: `จำนวนเงินที่โอน (${result.data.amount} บาท) ไม่ตรงกับจำนวนที่เลือก (${selectedAmount} บาท)`,
          });
          return;
        }

        // เรียก API เพื่ออัปเดต Wallet
        await updateWallet(parseFloat(result.data.amount));

        setSelectedAmount(null);
        setFile(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: result.error || "เกิดข้อผิดพลาดในการตรวจสอบสลิป",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถตรวจสอบสลิปได้ กรุณาลองอีกครั้ง",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
            <Wallet className="mr-2" />
            เติม Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium mb-6 text-center text-gray-300">
            เลือกจำนวนที่ต้องการเติม
            <br />
            <small className="text-red-500 ">
              *กรณี้โอนเงินมาไม่เท่ากับจำนวนที่ท่านเลือกทางเราไม่รับผิดทุกรณี
            </small>
          </p>

          <div className="grid grid-cols-2 gap-4">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                className={`w-full ${
                  selectedAmount === amount
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                onClick={() => handleAmountSelect(amount)}
              >
                ฿{amount.toLocaleString()}
              </Button>
            ))}
          </div>
          {selectedAmount && (
            <div className="mt-6 text-center">
              <p className="mb-4 text-sm text-gray-300">
                QR Code สำหรับชำระเงินจำนวน ฿{selectedAmount}:
              </p>
              <Card className="relative aspect-square">
                <Image
                  src="/image/qr.webp"
                  alt="QR Code"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </Card>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {selectedAmount && (
            <>
              <label
                htmlFor="slipUpload"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                อัปโหลดสลิปการโอนเงิน
              </label>
              <input
                type="file"
                id="slipUpload"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
              />
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSubmitSlip}
              >
                ยืนยันสลิป
              </Button>
            </>
          )}
          {slipOkData && (
            <div className="mt-4 text-gray-300">
              <p>ชื่อผู้รับเงิน: {slipOkData.receiver?.displayName || "-"}</p>
              <p>จำนวนเงินที่โอน: ฿{slipOkData.amount || "-"}</p>
              <p>วันที่โอน: {slipOkData.transDate || "-"}</p>
              <p>เวลาโอน: {slipOkData.transTime || "-"}</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FormWallet;

// Backend: API Route for Updating Wallet (/api/wallet/update.js)
