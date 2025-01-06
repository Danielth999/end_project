import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function HistoryTable({ history }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ประเภท</TableHead>
            <TableHead>ชื่อผลงาน</TableHead>
            <TableHead>จำนวนเงิน (BTH)</TableHead>
            <TableHead>วันที่</TableHead>
            <TableHead>ดาวน์โหลด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.actionType === "PURCHASE" ? "ซื้อ" : "ประมูล"}</TableCell>
              <TableCell>{item.artworkName}</TableCell>
              <TableCell>{item.amount ? item.amount.toFixed(2) : 'N/A'}</TableCell>
              <TableCell>{formatDate(item.createdAt)}</TableCell>
              <TableCell>
                {item.downloadUrl && (
                  <Button
                    variant="outline"
                    size="sm"
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

