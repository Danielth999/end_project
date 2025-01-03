"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react"; // ใช้ useEffect และ useState

const DarkMode = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ฟังก์ชันในการสลับธีม
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  // ใช้ useEffect เพื่อให้มั่นใจว่าเราจะไม่เจอ hydration mismatch
  useEffect(() => {
    setMounted(true); // กำหนดให้ mounted เป็น true หลังจากที่ component ถูกโหลด
  }, []);

  // ถ้ายังไม่ได้ mounted (เช่น ในระหว่าง SSR) จะไม่ render อะไร
  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      className="rounded-full"
      size="icon"
      onClick={toggleTheme}
    >
      {/* ไอคอน Sun สำหรับโหมดสว่าง */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "dark" ? "rotate-0 scale-0" : "rotate-0 scale-100"
        }`}
      />
      {/* ไอคอน Moon สำหรับโหมดมืด */}
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "light" ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default DarkMode;
