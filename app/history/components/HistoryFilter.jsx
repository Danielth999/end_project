import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoryFilter({ filter, setFilter }) {
  return (
    <div className="mb-4">
      <Select value={filter} onValueChange={(value) => setFilter(value)}>
        <SelectTrigger className="w-[200px] bg-gray-800 text-white border-gray-700">
          <SelectValue placeholder="กรองประเภท" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border-gray-700">
          <SelectItem value="ALL">ทั้งหมด</SelectItem>
          <SelectItem value="PURCHASE">การซื้อ</SelectItem>
          <SelectItem value="BID">การประมูล</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

