"use client";

import { useState } from "react";
import HistoryTable from "./HistoryTable";
import HistoryFilter from "./HistoryFilter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function HistoryContainer({ initialHistory }) {
  const [history, setHistory] = useState(initialHistory);
  const [filter, setFilter] = useState("ALL");

  // กรองข้อมูลประวัติตาม filter
  const filteredHistory = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.actionType === filter;
  });

  // สร้างข้อมูลสำหรับกราฟ
  const chartData = filteredHistory.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, PURCHASE: 0, SALE: 0, BID: 0 };
    }
    acc[date][item.actionType] += item.amount ? parseFloat(item.amount) : 0;
    return acc;
  }, {});

  const chartDataArray = Object.values(chartData);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">ประวัติการซื้อและประมูล</h1>

        {/* กราฟแสดงยอดขายและยอดซื้อ */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">สรุปยอดขายและยอดซื้อ</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartDataArray}>
              <XAxis dataKey="date" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip contentStyle={{ backgroundColor: "#374151", border: "none" }} />
              <Legend />
              <Bar dataKey="PURCHASE" fill="#3b82f6" name="ยอดซื้อ" />
              <Bar dataKey="SALE" fill="#10b981" name="ยอดขาย" />
              <Bar dataKey="BID" fill="#f59e0b" name="ยอดประมูล" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ตัวกรองและตารางประวัติ */}
        <HistoryFilter filter={filter} setFilter={setFilter} />
        <HistoryTable history={filteredHistory} />
      </div>
    </div>
  );
}