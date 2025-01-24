"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function LineChartComponent({ data, title }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="month" stroke="#CBD5E0" />
            <YAxis stroke="#CBD5E0" />
            <Tooltip
              contentStyle={{ backgroundColor: "#2D3748", border: "none", borderRadius: "8px" }}
            />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}