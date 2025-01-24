import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AuctionForm({ nftData, handleInputChange, setNftData }) {
  // ฟังก์ชันสำหรับอัปเดตระยะเวลา
  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10); // แปลงค่าจาก input เป็นตัวเลข
    if (!isNaN(value)) {
      const durationUnit = nftData.durationUnit || "hours"; // ตั้งค่า default เป็น "hours"
      updateAuctionEndAt(value, durationUnit); // อัปเดต auctionEndAt
      setNftData((prev) => ({
        ...prev,
        durationValue: value,
        durationUnit, // ตั้งค่า durationUnit ถ้ายังไม่มี
      }));
    }
  };

  // ฟังก์ชันสำหรับเปลี่ยนหน่วยเวลา
  const handleDurationUnitChange = (unit) => {
    setNftData((prev) => ({
      ...prev,
      durationUnit: unit,
    }));

    if (nftData.durationValue) {
      updateAuctionEndAt(nftData.durationValue, unit); // อัปเดต auctionEndAt
    }
  };

  // ฟังก์ชันคำนวณ auctionEndAt
  const updateAuctionEndAt = (value, unit) => {
    const startAt = new Date(nftData.auctionStartAt || Date.now());
    const durationInMs = unit === "hours" ? value * 60 * 60 * 1000 : value * 60 * 1000;
    const endAt = new Date(startAt.getTime() + durationInMs);
    setNftData((prev) => ({
      ...prev,
      auctionEndAt: endAt.toISOString(),
    }));
  };

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
        <Input
          type="text"
          id="description"
          name="description"
          className="bg-gray-800/50 border-gray-700"
          placeholder="อธิบายผลงานของคุณ"
          value={nftData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <Card className="bg-gray-800/50 border-gray-700 p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auctionStartPrice" className="text-lg font-medium text-white">
              ราคาเริ่มต้น (BTH)
            </Label>
            <Input
              type="number"
              id="auctionStartPrice"
              name="auctionStartPrice"
              className="bg-gray-900/50 border-gray-700"
              placeholder="กำหนดราคาเริ่มต้นสำหรับประมูล"
              value={nftData.auctionStartPrice}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-lg font-medium text-white">
              ระยะเวลา
            </Label>
            <div className="flex gap-4">
              <Input
                type="number"
                id="duration"
                name="duration"
                className="bg-gray-900/50 border-gray-700 w-2/3"
                placeholder="ระบุระยะเวลา"
                value={nftData.durationValue || ""}
                onChange={handleDurationChange}
                required
              />
              <Select
                value={nftData.durationUnit || "hours"}
                onValueChange={handleDurationUnitChange}
              >
                <SelectTrigger className="w-full bg-gray-900/50 border-gray-700">
                  <SelectValue placeholder="หน่วยเวลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">นาที</SelectItem>
                  <SelectItem value="hours">ชั่วโมง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {nftData.auctionEndAt && (
            <p className="text-sm text-gray-400">
              วันสิ้นสุดการประมูล: {new Date(nftData.auctionEndAt).toLocaleString()}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
 