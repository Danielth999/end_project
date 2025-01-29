"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

export default function BarChartComponent({ data, title }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="month" stroke="#CBD5E0" />
            <YAxis stroke="#CBD5E0" />
            <Tooltip
              contentStyle={{ backgroundColor: "#2D3748", border: "none", borderRadius: "8px" }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
