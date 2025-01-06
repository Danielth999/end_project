"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const artTerms = [
  "ศิลปะดิจิทัล",
  "NFTs",
  "คริปโตอาร์ต",
  "ศิลปะเสมือนจริง",
  "ดิจิทัลคอลเลกชัน",
];

export default function Hero({ artworkStats }) {
  const [displayText, setDisplayText] = useState("");
  const [currentTermIndex, setCurrentTermIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;

    const animateText = () => {
      const currentTerm = artTerms[currentTermIndex];
      
      if (!isDeleting) {
        if (displayText !== currentTerm) {
          setDisplayText(currentTerm.slice(0, displayText.length + 1));
        } else {
          setIsDeleting(true);
          timer = setTimeout(animateText, 1000); // Pause before deleting
          return;
        }
      } else {
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentTermIndex((prevIndex) => (prevIndex + 1) % artTerms.length);
        } else {
          setDisplayText(currentTerm.slice(0, displayText.length - 1));
        }
      }

      const speed = isDeleting ? 50 : 150; // Faster when deleting
      timer = setTimeout(animateText, speed);
    };

    timer = setTimeout(animateText, 100);

    return () => clearTimeout(timer);
  }, [displayText, currentTermIndex, isDeleting]);

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden rounded-t-lg">
      <div className="absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                ค้นพบ, ประมูล และขาย{" "}
                <span className="text-green-500 inline-block min-w-[200px]">
                  {displayText}
                  <span className="animate-blink">|</span>
                </span>{" "}
                ที่ไม่เหมือนใคร
              </h1>
              <p className="text-lg text-gray-400">
                Art Space ตลาดดิจิทัลสำหรับการแสดงออกทางศิลปะที่คุณต้องการ
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild={true}
                className="bg-[#2dac5c] hover:bg-[#2dac5c]/90"
              >
                <Link href={"/products"} className="text-whites">สำรวจเพิ่มเติม</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
              >
                <Link href={"/create-artworks"}>สร้างผลงาน</Link>
              </Button>
            </div>
            <div className="flex gap-12 pt-4">
              {[
                { label: "งานศิลปะ", value: `${artworkStats.totalArtworks}+` },
                { label: "การประมูล", value: `${artworkStats.auctionCount}+` },
                { label: "ศิลปิน", value: `${artworkStats.uniqueUserCount}+` },
                { label: "ราคาต่ำสุด", value: `${artworkStats.minPrice} BTH` }, // เพิ่มส่วนนี้
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right column */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  bg: "bg-purple-600",
                  delay: 0,
                  imageUrl:
                    "https://images.unsplash.com/photo-1728922236580-e242f44ed978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8Mg%3D%3D",
                },
                {
                  bg: "bg-blue-500",
                  delay: 0.2,
                  imageUrl:
                    "https://images.unsplash.com/photo-1728922304651-c13a6c5d5e28?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDI%3D",
                },
                {
                  bg: "bg-orange-500",
                  delay: 0.4,
                  imageUrl:
                    "https://images.unsplash.com/photo-1728922236580-e242f44ed978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZGlnaXRhbCUyMGFydHxlbnwwfHwwfHx8Mg%3D%3D",
                },
                {
                  bg: "bg-green-500",
                  delay: 0.6,
                  imageUrl:
                    "https://images.unsplash.com/photo-1728922372615-97d606f8000a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRpZ2l0YWwlMjBhcnR8ZW58MHx8MHx8fDI%3D",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className={`${card.bg} aspect-square rounded-2xl p-4 shadow-lg`}
                >
                  <div className="h-full w-full rounded-lg bg-black/20 p-1">
                    <div className="mt-4 relative aspect-square">
                      <Image
                        src={card.imageUrl}
                        alt="Digital Artwork"
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}