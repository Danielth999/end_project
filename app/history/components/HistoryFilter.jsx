import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoryFilter({ filter, setFilter }) {
  return (
    <div className="mb-4">
      <Select value={filter} onValueChange={(value) => setFilter(value)}>
        <SelectTrigger className="w-[200px] bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="กรองประเภท" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600">
          <SelectItem value="ALL" className="hover:bg-gray-600">ทั้งหมด</SelectItem>
          <SelectItem value="PURCHASE" className="hover:bg-gray-600">การซื้อ</SelectItem>
          <SelectItem value="BID" className="hover:bg-gray-600">การประมูล</SelectItem>
          <SelectItem value="SALE" className="hover:bg-gray-600">การขาย</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}