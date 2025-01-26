import { PrismaClient } from "@prisma/client";

import {
  Users,
  Paintbrush as PaintBrush,
  CreditCard,
  TrendingUp,
  DollarSign,
  Gavel,
} from "lucide-react";
import BarChartComponent from "./components/BarChartComponent";
import LineChartComponent from "./components/LineChartComponent";

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  
  // ดึงข้อมูลสถิติ
  const userCount = await prisma.user.count();
  const artworkCount = await prisma.artwork.count();
  const pendingWithdrawals = await prisma.transaction.count({
    where: { transactionType: "WITHDRAWAL", status: "PENDING" },
  });
  const totalSales = await prisma.transaction.aggregate({
    where: { transactionType: "DEPOSIT" },
    _sum: { amount: true },
  });
  const activeAuctions = await prisma.artwork.count({
    where: {
      status: "ACTIVE",
      auctionEndAt: { gt: new Date() },
    },
  });

  // ดึงข้อมูลสำหรับกราฟ
  const artworkData = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'Mon') AS month,
      COUNT(*) AS artworks
    FROM "Artwork"
    GROUP BY TO_CHAR("createdAt", 'Mon')
    ORDER BY MIN("createdAt")
  `;

  const salesData = await prisma.$queryRaw`
    SELECT 
      TO_CHAR("createdAt", 'Mon') AS month,
      SUM("amount") AS sales
    FROM "Transaction"
    WHERE "transactionType" = 'DEPOSIT'
    GROUP BY TO_CHAR("createdAt", 'Mon')
    ORDER BY MIN("createdAt")
  `;

  // แปลงข้อมูลให้อยู่ในรูปแบบที่กราฟใช้ได้
  const monthMap = {
    Jan: "ม.ค.",
    Feb: "ก.พ.",
    Mar: "มี.ค.",
    Apr: "เม.ย.",
    May: "พ.ค.",
    Jun: "มิ.ย.",
    Jul: "ก.ค.",
    Aug: "ส.ค.",
    Sep: "ก.ย.",
    Oct: "ต.ค.",
    Nov: "พ.ย.",
    Dec: "ธ.ค.",
  };

  const formattedArtworkData = artworkData.map((item) => ({
    month: monthMap[item.month],
    artworks: Number(item.artworks),
  }));

  const formattedSalesData = salesData.map((item) => ({
    month: monthMap[item.month],
    sales: Number(item.sales),
  }));

  // ข้อมูลสถิติ
  const stats = [
    {
      title: "จำนวนผู้ใช้ทั้งหมด",
      value: userCount,
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "จำนวนงานศิลปะทั้งหมด",
      value: artworkCount,
      icon: PaintBrush,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "การถอนเงินที่รอดำเนินการ",
      value: pendingWithdrawals,
      icon: CreditCard,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "ยอดขายรวม",
      value: `${totalSales._sum.amount?.toFixed(2) || "0.00"} บาท`,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "การประมูลที่กำลังดำเนินการ",
      value: activeAuctions,
      icon: Gavel,
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">ภาพรวมแดชบอร์ด</h1>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300">
          <TrendingUp size={20} />
          สร้างรายงาน
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-r ${stat.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 mb-1 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent
          data={formattedArtworkData}
          title="จำนวนงานศิลปะที่เพิ่มขึ้น"
        />
        <LineChartComponent
          data={formattedSalesData}
          title="ยอดขายรวมในแต่ละเดือน"
        />
      </div>
    </div>
  );
}