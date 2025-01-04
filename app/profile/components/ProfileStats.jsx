"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ProfileStats({ stats }) {
  const statsData = [
    { label: "จำนวนผลงานทั้งหมด", value: stats?.totalArtworks || 0 },
    {
      label: "ราคาต่ำสุด",
      value: stats?.minPrice ? `${stats.minPrice} บาท` : 0,
    },
    { label: "จำนวนการประมูล", value: stats?.auctionCount || 0 },
    { label: "จำนวนที่ขายสำเร็จ", value: stats?.salesCount || 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statsData.map((stat, index) => (
        <Card key={index} className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
