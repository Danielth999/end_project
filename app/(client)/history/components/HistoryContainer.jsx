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
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-8 text-center">
          ประวัติการซื้อและประมูล
        </h1>

        <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6 md:mb-8 shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4">สรุปยอดขายและยอดซื้อ</h2>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataArray}>
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff" 
                  fontSize={12}
                  tick={{ fill: '#ffffff' }}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="#ffffff"
                  fontSize={12}
                  tick={{ fill: '#ffffff' }}
                  tickMargin={8}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#374151", 
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px"
                  }} 
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: "12px",
                    fontSize: "12px"
                  }}
                />
                <Bar dataKey="PURCHASE" fill="#3b82f6" name="ยอดซื้อ" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SALE" fill="#10b981" name="ยอดขาย" radius={[4, 4, 0, 0]} />
                <Bar dataKey="BID" fill="#f59e0b" name="ยอดประมูล" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <HistoryFilter filter={filter} setFilter={setFilter} />
          <HistoryTable history={filteredHistory} />
        </div>
      </div>
    </div>
  );
}