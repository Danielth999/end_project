import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function HistoryTable({ history }) {
  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์
  const handleDownload = async (url, filename) => {
    try {
      // ดึงข้อมูลไฟล์จาก URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      // แปลงข้อมูลเป็น Blob
      const blob = await response.blob();

      // สร้างลิงก์ชั่วคราวสำหรับดาวน์โหลด
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "download"; // กำหนดชื่อไฟล์ (ถ้ามี)
      document.body.appendChild(link); // เพิ่ม <a> เข้าไปใน DOM
      link.click(); // คลิกที่ลิงก์เพื่อดาวน์โหลด
      document.body.removeChild(link); // ลบ <a> ออกจาก DOM
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">รูปภาพ</TableHead>
            <TableHead className="text-white">ประเภท</TableHead>
            <TableHead className="text-white">ชื่อผลงาน</TableHead>
            <TableHead className="text-white">จำนวนเงิน (BTH)</TableHead>
            <TableHead className="text-white">วันที่</TableHead>
            <TableHead className="text-white">ดาวน์โหลด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-700">
              {/* คอลัมน์รูปภาพ */}
              <TableCell>
                {item.imageUrl && (
                  <Card className="relative aspect-square w-16 h-16">
                    <Image
                      src={item.imageUrl}
                      alt={item.artworkName || "Artwork"}
                      fill
                      sizes="100vw"
                      className="object-cover rounded"
                    />
                  </Card>
                )}
              </TableCell>

              {/* คอลัมน์ประเภท */}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    item.actionType === "PURCHASE"
                      ? "bg-blue-500"
                      : item.actionType === "BID"
                      ? "bg-yellow-500"
                      : item.actionType === "SALE"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {item.actionType === "PURCHASE"
                    ? "ซื้อ"
                    : item.actionType === "BID"
                    ? "ประมูล"
                    : item.actionType === "SALE"
                    ? "ขาย"
                    : "N/A"}
                </span>
              </TableCell>

              {/* คอลัมน์ชื่อผลงาน */}
              <TableCell className="text-white">
                {item.artworkName || "N/A"}
              </TableCell>

              {/* คอลัมน์จำนวนเงิน */}
              <TableCell className="text-white">
                {item.amount ? item.amount.toFixed(2) : "N/A"}
              </TableCell>

              {/* คอลัมน์วันที่ */}
              <TableCell className="text-white">
                {formatDate(item.createdAt)}
              </TableCell>

              {/* คอลัมน์ดาวน์โหลด */}
              <TableCell>
                {item.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                    onClick={() =>
                      handleDownload(item.downloadUrl, item.artworkName)
                    }
                  >
                    ดาวน์โหลด
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </div>
  );
}
