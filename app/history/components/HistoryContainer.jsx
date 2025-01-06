"use client";

import { useState } from "react";
import HistoryTable from "./HistoryTable";
import HistoryFilter from "./HistoryFilter";

export default function HistoryContainer({ initialHistory }) {
  const [history, setHistory] = useState(initialHistory);
  const [filter, setFilter] = useState("ALL");

  const filteredHistory = history.filter((item) => {
    if (filter === "ALL") return true;
    return item.actionType === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">ประวัติการซื้อและประมูล</h1>
        <HistoryFilter filter={filter} setFilter={setFilter} />
        <HistoryTable history={filteredHistory} />
      </div>
    </div>
  );
}

