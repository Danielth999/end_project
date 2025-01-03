"use client";

import { useState, useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import axios from "axios";
import Loading from "@/components/Loading";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function TransactionsPage({ userId }) {
  const [transactions, setTransactions] = useState([]); // State for transactions data
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction
  const [slipFile, setSlipFile] = useState(null); // State for uploaded slip file
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false); // State for cancel confirmation dialog

  // Fetch transactions from API
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${userId}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatAmount = (amount, type) => {
    // Format transaction amount with currency symbol
    const formattedAmount = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
    return type === "DEPOSIT" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const getStatusColor = (status) => {
    // Determine badge color based on status
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "COMPLETED":
        return "bg-green-500 hover:bg-green-600";
      case "FAILED":
        return "bg-red-500 hover:bg-red-600";
      case "CANCELLED":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const translateStatus = (status) => {
    // Translate status into Thai
    switch (status.toUpperCase()) {
      case "PENDING":
        return "รอดำเนินการ";
      case "COMPLETED":
        return "สำเร็จ";
      case "FAILED":
        return "ล้มเหลว";
      case "CANCELLED":
        return "ยกเลิก";
      default:
        return "ไม่ทราบสถานะ";
    }
  };

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
    setSlipFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
    }
  };

  // Upload slip function
  const handleSubmitSlip = async (e) => {
    e.preventDefault();

    if (!slipFile) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "กรุณาอัปโหลดสลิป!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("files", slipFile);
    formData.append("log", true); // ระบุว่าให้ตรวจสลิปซ้ำ

    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(process.env.NEXT_PUBLIC_SLIP_OK_API_URL, {
        method: "POST",
        headers: {
          "x-authorization": `SLIPOKC963LWT`,
        },
        body: formData,
      });

      handleCloseModal(); // Close the modal after uploading slip

      const result = await response.json();
      console.log("Slip upload result:", result);

      if (response.ok) {
        const slipAmount = parseFloat(result.data.amount);
        const selectedAmount = parseFloat(selectedTransaction.amount);

        // Validate slip amount
        if (selectedAmount !== slipAmount) {
          Swal.fire({
            icon: "error",
            title: "จำนวนเงินไม่ตรงกัน",
            text: `จำนวนเงินที่โอน (${slipAmount} บาท) ไม่ตรงกับจำนวนที่เลือก (${selectedAmount} บาท)`,
          });
          return;
        }

        // Request to update the wallet balance
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/${userId}`,
          { amount: slipAmount }
        );

        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`
        );

        Swal.fire({
          icon: "success",
          title: "อัพโหลดสำเร็จ",
          text: "สลิปของคุณได้รับการตรวจสอบเรียบร้อย",
        });

        // Refresh transactions after successful upload
        fetchTransactions();
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

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${selectedTransaction.id}`
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "ยกเลิกรายการสำเร็จ",
          text: "รายการของคุณถูกยกเลิกแล้ว",
        });
        fetchTransactions();
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

  return (
    <div className="min-h-screen w-full flex justify-center p-4">
      <Card className="w-full bg-transparent border border-gray-600">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">รายการธุรกรรม</CardTitle>
          <CardDescription>ประวัติการทำธุรกรรมทั้งหมดของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead className="w-[150px]">วันที่และเวลา</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead className="text-center">จำนวนเงิน</TableHead>
                  <TableHead className="text-center">สถานะ</TableHead>
                  <TableHead className="">การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {format(
                        new Date(transaction.createdAt),
                        "dd MMM yyyy HH:mm",
                        { locale: th }
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.transactionType === "DEPOSIT" ? (
                        <span className="flex items-center text-green-600">
                          <ArrowUpCircle className="mr-2 h-4 w-4" />
                          ฝากเงิน
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600">
                          <ArrowDownCircle className="mr-2 h-4 w-4" />
                          ถอนเงิน
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatAmount(
                        transaction.amount,
                        transaction.transactionType
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge className={getStatusColor(transaction.status)}>
                        {translateStatus(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {transaction.status.toUpperCase() === "PENDING" && (
                        <div className="space-x-2 flex">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(transaction)}
                          >
                            อัพโหลดสลิป
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setIsCancelDialogOpen(true);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            ยกเลิก
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal for uploading slip */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>อัพโหลดสลิป</DialogTitle>
            <DialogDescription>
              กรุณาอัพโหลดภาพสลิปเพื่อยืนยันการทำรายการ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>จำนวนเงิน</Label>
            <p>
              {selectedTransaction &&
                formatAmount(
                  selectedTransaction.amount,
                  selectedTransaction.transactionType
                )}
            </p>
            <Label>อัพโหลดสลิป</Label>
            <Input type="file" onChange={handleFileChange} accept="image/*" />
          </div>
          <DialogFooter>
            <Button  onClick={handleSubmitSlip} disabled={!slipFile}>
              <Upload className="mr-2 h-4 w-4" />
              อัพโหลด
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for canceling transaction */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการยกเลิก</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการยกเลิกรายการนี้หรือไม่?
              การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ปิด</AlertDialogCancel>
            <AlertDialogAction  className="bg-red-500 text-white hover:bg-red-600" onClick={handleCancelTransaction}>

              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
