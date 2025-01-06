"use client";

import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import fetcher from "@/lib/fetcher";

export default function CategorySelect({ nftData, setNftData }) {
  const { data: categories, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
    fetcher
  );

  if (error) {
    return <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดหมวดหมู่</p>;
  }

  if (!categories) {
    return <p className="text-gray-500">กำลังโหลดหมวดหมู่...</p>;
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 p-4">
      <div className="space-y-2">
        <Label htmlFor="category" className="text-lg font-medium text-white">
          หมวดหมู่
        </Label>
        <Select
          value={nftData.category}
          onValueChange={(value) =>
            setNftData((prevData) => ({ ...prevData, category: value }))
          }
        >
          <SelectTrigger className="bg-gray-900/50 border-gray-700">
            <SelectValue placeholder="เลือกหมวดหมู่" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}

