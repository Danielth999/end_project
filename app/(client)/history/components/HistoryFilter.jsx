import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoryFilter({ filter, setFilter }) {
  return (
    <div className="mb-4">
      <Select value={filter} onValueChange={(value) => setFilter(value)}>
        <SelectTrigger className="w-full sm:w-[200px] bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all">
          <SelectValue placeholder="กรองประเภท" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600 shadow-lg">
          <SelectItem value="ALL" className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer transition-colors">
            ทั้งหมด
          </SelectItem>
          <SelectItem value="PURCHASE" className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer transition-colors">
            การซื้อ
          </SelectItem>
          <SelectItem value="BID" className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer transition-colors">
            การประมูล
          </SelectItem>
          <SelectItem value="SALE" className="hover:bg-gray-600 focus:bg-gray-600 cursor-pointer transition-colors">
            การขาย
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}