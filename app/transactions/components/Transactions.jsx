"use client";

import useSWR from "swr";
import Swal from "sweetalert2";
import Loading from "@/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionList from "./TransactionList";
import UploadSlipModal from "./UploadSlipModal";
import CancelConfirmationDialog from "./CancelConfirmationDialog";
import axios from "axios"; // นำเข้า axios
import { useState } from "react";

export default function Transactions({ userId }) {
  const {
    data: transactions,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${userId}`,
    (url) => axios.get(url).then((res) => res.data) // ใช้ axios แทน fetcher
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleSubmitSlip = async (slipFile) => {
    if (!selectedTransaction) return;
  
    const formData = new FormData();
  
    // ส่งไฟล์สลิป
    formData.append("files", slipFile);
  
    // ตรวจสอบสลิปซ้ำ
    formData.append("log", "true"); // ส่งเป็น string "true" หรือ "false"
  
    // ระบุยอดเงิน (optional)
    formData.append("amount", selectedTransaction.amount);
  
    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
  
      // เรียกใช้ API Route ใน Next.js
      const response = await axios.post("/api/checkSlip", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // ปิด Modal ก่อนแสดง SweetAlert2
      handleCloseModal();
  
      const result = response.data;
  
      if (response.status === 200) {
        const slipAmount = parseFloat(result.data.amount);
        const selectedAmount = parseFloat(selectedTransaction.amount);
  
        if (selectedAmount !== slipAmount) {
          Swal.fire({
            icon: "error",
            title: "จำนวนเงินไม่ตรงกัน",
            text: `จำนวนเงินที่โอน (${slipAmount} บาท) ไม่ตรงกับจำนวนที่เลือก (${selectedAmount} บาท)`,
          });
          return;
        }
  
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/${userId}`,
          {
            amount: slipAmount,
          }
        );
  
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`
        );
  
        Swal.fire({
          icon: "success",
          title: "อัพโหลดสำเร็จ",
          text: "สลิปของคุณได้รับการตรวจสอบเรียบร้อย",
        });
  
        mutate(); // Refresh transactions data
      } else {
        Swal.fire({
          icon: "error",
          title: "สลิปซ้ำ",
          text: result.message || "เกิดข้อผิดพลาดในการตรวจสอบสลิป",
        });
      }
    } catch (error) {
      // ปิด Modal ก่อนแสดง SweetAlert2
      handleCloseModal();
  
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถตรวจสอบสลิปได้ กรุณาลองอีกครั้ง",
      });
    }
  };
  const handleCancelTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`
      );

      Swal.fire({
        icon: "success",
        title: "ยกเลิกรายการสำเร็จ",
        text: "รายการของคุณถูกยกเลิกแล้ว",
      });
      mutate(); // Refresh transactions data
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถยกเลิกรายการได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsCancelDialogOpen(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-center text-red-500">ไม่สามารถโหลดข้อมูลได้</p>;
  }

  return (
    <div className="min-h-screen w-full flex justify-center p-4">
      <Card className="w-full bg-transparent border border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">รายการธุรกรรม</CardTitle>
          <CardDescription>ประวัติการทำธุรกรรมทั้งหมดของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <TransactionList
              transactions={transactions}
              onUploadSlip={handleOpenModal}
              onCancelTransaction={(transaction) => {
                setSelectedTransaction(transaction);
                setIsCancelDialogOpen(true);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <UploadSlipModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpload={handleSubmitSlip}
        selectedTransaction={selectedTransaction}
      />

      <CancelConfirmationDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelTransaction}
      />
    </div>
  );
}
