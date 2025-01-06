"use client";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  Heart,
  Share2,
  Facebook,
  Twitter,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-hot-toast";

const ProductDetailPage = ({ artWorks }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formattedDate = format(new Date(artWorks.createdAt), "dd MMMM yyyy", {
    locale: th,
  });

  const handleShare = (platform) => {
    const currentUrl = window.location.href;
    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          currentUrl
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          currentUrl
        )}&text=${encodeURIComponent(artWorks.title)}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(currentUrl)
          .then(() => toast.success("คัดลอกลิงก์แล้ว"))
          .catch(() => toast.error("ไม่สามารถคัดลอกลิงก์ได้"));
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  const preventContextMenu = (e) => {
    e.preventDefault();
    toast.error("ไม่อนุญาตให้ดาวน์โหลดรูปภาพ");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div
            className="relative w-full aspect-square rounded-lg overflow-hidden group"
            onContextMenu={preventContextMenu} // ป้องกันการคลิกขวาเฉพาะที่รูป
          >
            <Image
              src={artWorks.imageUrl}
              alt={artWorks.title}
              fill
              sizes="100vw"
              priority
              className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
            />
            {/* Watermark Grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {Array.from({ length: 9 }).map((_, index) => (
                <p
                  key={index}
                  className="text-white text-4xl font-bold opacity-10 select-none flex items-center justify-center"
                >
                  ArtSpace
                </p>
              ))}
            </div>
          </div>
          {/* Content Section */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-green-500">
              {artWorks.title}
            </h1>
            <p className="text-gray-300 mb-6 text-sm md:text-base">
              {artWorks.description}
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <p className="text-sm text-gray-400">ราคาปัจจุบัน</p>
                <p className="text-2xl font-bold text-green-500">
                  {artWorks.price} BTH
                </p>
              </div>
              <div className="relative flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors duration-300"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors duration-300"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 bg-gray-800 border-gray-700">
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-blue-500 hover:text-blue-400"
                        onClick={() => handleShare("facebook")}
                      >
                        <Facebook className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-sky-500 hover:text-sky-400"
                        onClick={() => handleShare("twitter")}
                      >
                        <Twitter className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleShare("copy")}
                      >
                        <LinkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <Button className="flex-grow bg-green-500 hover:bg-green-600 transition-all duration-300">
                ซื้อเลย
              </Button>
              <Button
                variant="outline"
                className="flex-grow bg-transparent border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                เพิ่มลงตะกร้า
              </Button>
            </div>
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                  <div>
                    <p className="text-sm text-gray-400">ผู้สร้าง</p>
                    <Link
                      href={`/profile/${artWorks.userId}`}
                      className="font-semibold hover:underline hover:text-green-500"
                    >
                      {artWorks.User?.firstName}
                      <span> </span>
                      {artWorks.User?.lastName}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">วันที่สร้าง</p>
                    <p className="font-semibold">{formattedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
