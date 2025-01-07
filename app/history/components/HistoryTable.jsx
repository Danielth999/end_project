import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function HistoryTable({ history }) {
  return (
    <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
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
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  item.actionType === "PURCHASE" ? "bg-blue-500" :
                  item.actionType === "BID" ? "bg-yellow-500" :
                  item.actionType === "SALE" ? "bg-green-500" : "bg-gray-500"
                }`}>
                  {item.actionType === "PURCHASE" ? "ซื้อ" : 
                   item.actionType === "BID" ? "ประมูล" : 
                   item.actionType === "SALE" ? "ขาย" : "N/A"}
                </span>
              </TableCell>
              <TableCell className="text-white">{item.artworkName || 'N/A'}</TableCell>
              <TableCell className="text-white">{item.amount ? item.amount.toFixed(2) : 'N/A'}</TableCell>
              <TableCell className="text-white">{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                {item.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                    onClick={() => window.open(item.downloadUrl, "_blank")}
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