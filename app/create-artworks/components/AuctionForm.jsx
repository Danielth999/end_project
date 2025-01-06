import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from "date-fns";

export default function AuctionForm({ nftData, handleInputChange, setNftData }) {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-lg font-medium text-white">
                วันที่เริ่มต้น
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-900/50 border-gray-700"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {nftData.auctionStartAt ? (
                      format(new Date(nftData.auctionStartAt), "PPP")
                    ) : (
                      <span>เลือกวันที่เริ่มต้น</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nftData.auctionStartAt ? new Date(nftData.auctionStartAt) : null}
                    onSelect={(date) =>
                      setNftData((prev) => ({
                        ...prev,
                        auctionStartAt: date ? date.toISOString() : null,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-medium text-white">
                วันที่สิ้นสุด
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-900/50 border-gray-700"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {nftData.auctionEndAt ? (
                      format(new Date(nftData.auctionEndAt), "PPP")
                    ) : (
                      <span>เลือกวันที่สิ้นสุด</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={nftData.auctionEndAt ? new Date(nftData.auctionEndAt) : null}
                    onSelect={(date) =>
                      setNftData((prev) => ({
                        ...prev,
                        auctionEndAt: date ? date.toISOString() : null,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

