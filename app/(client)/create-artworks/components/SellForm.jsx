import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function SellForm({ nftData, handleInputChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lg font-medium text-white">
          ชื่อผลงาน
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          className="bg-gray-800/50 border-gray-700"
          placeholder="กรอกชื่อผลงานของคุณ"
          value={nftData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-lg font-medium text-white">
          คำอธิบาย
        </Label>
        <Textarea
          id="description"
          name="description"
          className="bg-gray-800/50 border-gray-700 min-h-[120px]"
          placeholder="อธิบายผลงานของคุณ"
          value={nftData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-lg font-medium text-white">
            ราคา (BTH)
          </Label>
          <Input
            type="number"
            id="price"
            name="price"
            className="bg-gray-900/50 border-gray-700"
            placeholder="กำหนดราคาขายใน BTH"
            value={nftData.price}
            onChange={handleInputChange}
            required
          />
          <p className="text-sm text-gray-400">
            ราคาขายสุทธิหลังหักค่าธรรมเนียม 2.5%
          </p>
        </div>
      </Card>
    </div>
  );
}

