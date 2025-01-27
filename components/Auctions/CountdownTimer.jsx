"use client"

import { useState, useEffect } from "react"

export default function CountdownTimer({ endTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime))

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = getTimeLeft(endTime)
      setTimeLeft(remainingTime)

      if (
        remainingTime.days === 0 &&
        remainingTime.hours === 0 &&
        remainingTime.minutes === 0 &&
        remainingTime.seconds === 0
      ) {
        clearInterval(timer)
        if (onTimeUp) onTimeUp()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  function getTimeLeft(endTime) {
    const total = endTime.getTime() - Date.now()
    const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)))
    const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24))
    const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60))
    const seconds = Math.max(0, Math.floor((total / 1000) % 60))
    return { days, hours, minutes, seconds }
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
    </div>
  )
}

