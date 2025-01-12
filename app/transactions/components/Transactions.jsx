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
import fetcher from "@/lib/fetcher";
import { useState } from "react";

export default function Transactions({ userId }) {
  const {
    data: transactions,
    error,
    isLoading,
    mutate,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${userId}`,
    fetcher
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
    formData.append("files", slipFile);
    // formData.append("log", true); // ตรวจสอบสลิปซ้ำ

    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(NEXT_PUBLIC_SLIP_OK_API_URL, {
        method: "POST",
        headers: {
          "x-authorization": `SLIPOKC963LWT`,
        },
        body: formData,
      });

      handleCloseModal();

      const result = await response.json();
      console.log("Slip upload result:", result);

      if (response.ok) {
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

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: slipAmount }),
        });

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`,
          { method: "PUT" }
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
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถตรวจสอบสลิปได้ กรุณาลองอีกครั้ง",
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "ยกเลิกรายการสำเร็จ",
          text: "รายการของคุณถูกยกเลิกแล้ว",
        });
        mutate(); // Refresh transactions data
      }
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
