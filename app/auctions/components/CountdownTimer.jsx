"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ endTime, duration }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(new Date(endTime)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(new Date(endTime)));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  function getTimeLeft(endTime) {
    const total = endTime.getTime() - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 text-sm">
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.days}</span> วัน
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.hours}</span> ชม.
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.minutes}</span> น.
        </div>
        <div className="bg-gray-800 rounded px-2 py-1">
          <span className="font-bold">{timeLeft.seconds}</span> วิ.
        </div>
      </div>
      <div className="text-sm text-gray-400">ระยะเวลาประมูล: {duration}</div>
    </div>
  );
}