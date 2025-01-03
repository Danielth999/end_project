"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Share2 } from "lucide-react";

const ProductDetailPage = ({ artWorks }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={artWorks.image_url}
              alt={artWorks.title}
              fill
              sizes="100vw"
              priority
              className="  object-cover rounded-lg"
            />
          </div>
          {/* Content Section */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {artWorks.title}
            </h1>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              {artWorks.description}
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div>
                <p className="text-sm text-gray-400">ราคาปัจจุบัน</p>
                <p className="text-2xl font-bold text-[#2dac5c]">
                  {artWorks.price}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-white"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-current text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gray-600 text-gray-400 hover:text-white hover:border-white"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <Button className="flex-grow bg-[#2dac5c] hover:bg-[#238c4b]">
                ซื้อเลย
              </Button>
              <Button
                variant="outline"
                className="flex-grow bg-transparent border-[#2dac5c] text-[#2dac5c] hover:bg-[#2dac5c] hover:text-white"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                เพิ่มลงตะกร้า
              </Button>
            </div>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                  <div>
                    <p className="text-sm text-gray-400">ผู้สร้าง</p>
                    <p className="font-semibold">
                      {artWorks.users?.first_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">วันที่สร้าง</p>
                    <p className="font-semibold">{artWorks.created_at}</p>
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
