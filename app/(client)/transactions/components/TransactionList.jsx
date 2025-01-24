import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowUpCircle, ArrowDownCircle, X, Calendar, FileText, Activity } from "lucide-react";
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

  // Mobile card view component
  const TransactionCard = ({ transaction, index }) => (
    <div className="bg-secondary/10 p-4 rounded-lg space-y-3 border border-secondary/20">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">#{index + 1}</span>
          <Badge className={getStatusColor(transaction.status)}>
            {translateStatus(transaction.status)}
          </Badge>
        </div>
        {transaction.status.toUpperCase() === "PENDING" && (
          <div className="flex gap-2">
            {transaction.transactionType === "DEPOSIT" && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => onUploadSlip(transaction)}
              >
                อัพโหลดสลิป
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="text-xs h-7"
              onClick={() => onCancelTransaction(transaction)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", {
              locale: th,
            })}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4" />
          <span className={transaction.transactionType === "DEPOSIT" ? "text-green-500" : "text-red-500"}>
            {transaction.transactionType === "DEPOSIT" ? "ฝากเงิน" : "ถอนเงิน"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span className="font-medium">
            {formatAmount(transaction.amount, transaction.transactionType)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop view - Table */}
      <div className="hidden md:block w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead className="min-w-[120px]">วันที่และเวลา</TableHead>
              <TableHead className="min-w-[100px]">ประเภท</TableHead>
              <TableHead className="text-center min-w-[120px]">จำนวนเงิน</TableHead>
              <TableHead className="text-center min-w-[100px]">สถานะ</TableHead>
              <TableHead className="min-w-[200px]">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-sm">{index + 1}</TableCell>
                <TableCell className="text-sm">
                  {format(new Date(transaction.createdAt), "dd MMM yyyy HH:mm", {
                    locale: th,
                  })}
                </TableCell>
                <TableCell>
                  {transaction.transactionType === "DEPOSIT" ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <ArrowUpCircle className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">ฝากเงิน</span>
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 text-sm">
                      <ArrowDownCircle className="mr-1 h-4 w-4" />
                      <span className="hidden sm:inline">ถอนเงิน</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {formatAmount(transaction.amount, transaction.transactionType)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={`${getStatusColor(transaction.status)} text-xs`}>
                    {translateStatus(transaction.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.status.toUpperCase() === "PENDING" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {transaction.transactionType === "DEPOSIT" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs whitespace-nowrap"
                          onClick={() => onUploadSlip(transaction)}
                        >
                          อัพโหลดสลิป
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                        onClick={() => onCancelTransaction(transaction)}
                      >
                        <X className="mr-1 h-3 w-3" />
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

      {/* Mobile view - Cards */}
      <div className="grid gap-4 md:hidden">
        {transactions.map((transaction, index) => (
          <TransactionCard 
            key={transaction.id} 
            transaction={transaction} 
            index={index}
          />
        ))}
      </div>
    </>
  );
}
