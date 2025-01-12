import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowUpCircle, ArrowDownCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TransactionList({
  transactions,
  onUploadSlip,
  onCancelTransaction,
}) {


  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
    return type === "DEPOSIT" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const getStatusColor = (status) => {
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

  return (
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
              {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", {
                locale: th,
              })}
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
              {formatAmount(transaction.amount, transaction.transactionType)}
            </TableCell>
            <TableCell className="text-center">
              <Badge className={getStatusColor(transaction.status)}>
                {translateStatus(transaction.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {transaction.status.toUpperCase() === "PENDING" && (
                <div className="space-x-2 flex">
                  {/* แสดงปุ่มอัพโหลดสลิปเฉพาะสำหรับการฝากเงิน */}
                  {transaction.transactionType === "DEPOSIT" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUploadSlip(transaction)}
                    >
                      อัพโหลดสลิป
                    </Button>
                  )}
                  {/* แสดงปุ่มยกเลิกสำหรับทั้งการฝากและถอนเงิน */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancelTransaction(transaction)}
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
  );
}