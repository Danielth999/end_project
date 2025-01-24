"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const artTerms = [
  "ศิลปะดิจิทัล",
  "ศิลปะเสมือนจริง",
  "ดิจิทัลคอลเลกชัน",
  "อนิเมะ",
  "การ์ตูน",
  "ภาพวาด",
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

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] sm:min-h-[80vh] w-full overflow-hidden rounded-t-lg">
      <div className="absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-2">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                ค้นพบ, ประมูล และขาย{" "}
                <span className="text-green-500 inline-block min-w-[160px] sm:min-w-[200px]">
                  {displayText}
                  <span className="animate-blink">|</span>
                </span>{" "}
                ที่ไม่เหมือนใคร
              </h1>
              <p className="text-base sm:text-lg text-gray-400 max-w-xl">
                Art Space ตลาดดิจิทัลสำหรับการแสดงออกทางศิลปะที่คุณต้องการ
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button
                asChild={true}
                className="bg-[#2dac5c] hover:bg-[#2dac5c]/90"
              >
                <Link href={"/artworks"} className="text-whites">
                  สำรวจเพิ่มเติม
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
              >
                <Link href={"/create-artworks"}>สร้างผลงาน</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 md:gap-12 pt-4">
              {[
                { label: "งานศิลปะ", value: `${artworkStats.totalArtworks}+` },
                { label: "การประมูล", value: `${artworkStats.auctionCount}+` },
                { label: "ศิลปิน", value: `${artworkStats.uniqueUserCount}+` },
                { label: "ราคาต่ำสุด", value: `${artworkStats.minPrice} BTH` },
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm sm:text-base text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="relative mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: card.delay,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotate: [0, -2, 2, 0],
                    transition: { 
                      duration: 0.3,
                      ease: "easeInOut"
                    }
                  }}
                  className={`${card.bg} aspect-square rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg`}
                >
                  <motion.div 
                    className="h-full w-full rounded-lg bg-black/20 p-1"
                    variants={floatingAnimation}
                    animate="animate"
                    initial="initial"
                  >
                    <motion.div
                      className="mt-2 sm:mt-4 relative aspect-square"
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Image
                        src={card.imageUrl}
                        alt="Digital Artwork"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        className="object-cover rounded-lg"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
