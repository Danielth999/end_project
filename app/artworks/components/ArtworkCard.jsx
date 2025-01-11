"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

const ArtworkCard = ({ artWorks, userId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const imageRef = useRef(null);

  const createdAtDate = artWorks.createdAt
    ? new Date(artWorks.createdAt)
    : null;
  const formattedDate =
    createdAtDate && !isNaN(createdAtDate)
      ? formatDistanceToNow(createdAtDate, { addSuffix: true, locale: th })
      : "ไม่ทราบเวลา";

  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault(); // ป้องกันการคลิกขวา
    };

    const handleDragStart = (e) => {
      e.preventDefault(); // ป้องกันการลากรูปภาพ
    };

    const imageElement = imageRef.current;
    if (imageElement) {
      imageElement.addEventListener("contextmenu", handleRightClick);
      imageElement.addEventListener("dragstart", handleDragStart);
    }

    return () => {
      if (imageElement) {
        imageElement.removeEventListener("contextmenu", handleRightClick);
        imageElement.removeEventListener("dragstart", handleDragStart);
      }
    };
  }, []);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      toast.loading("กำลังเพิ่มสินค้าลงในตะกร้า...", {
        position: "top-center",
        duration: 1000,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          userId,
          artworkId: artWorks.id,
          quantity: 1,
        }
      );

      if (response.status === 200) {
        toast.success(`${artWorks.title} ถูกเพิ่มลงในตระกร้าเรียบร้อยแล้ว`, {
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "ไม่สามารถเพิ่มสินค้าได้", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="transform transition-transform duration-300 hover:-translate-y-1">
      <Card className="relative group overflow-hidden bg-gray-900 text-white border-gray-800">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              ref={imageRef}
              src={artWorks.imageUrl}
              alt={artWorks.name}
              fill
              sizes="100vw"
              className="transition-transform transform group-hover:scale-110 prevent-right-click"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <small className="text-xs text-gray-400 font-semibold">
            {artWorks.Category?.name || "Uncategorized"}
          </small>
          <CardTitle className="text-lg mt-1 mb-2">{artWorks.title}</CardTitle>
          <CardDescription className="text-gray-400 line-clamp-2">
            {artWorks.description}
          </CardDescription>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold text-[#2dac5c]">
              {artWorks.price} BTH
            </p>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex justify-between items-center">
          <Link href={`/artworks/${artWorks.id}`} passHref>
            <Button
              variant="default"
              className="flex-grow mr-2 bg-[#2dac5c] hover:bg-[#238c4b]"
            >
              ดูรายละเอียด
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-transparent border-[#2dac5c] text-[#2dac5c] hover:bg-[#2dac5c] hover:text-white"
          >
            {isAdding ? (
              <div className="animate-spin h-5 w-5 border-2 border-[#2dac5c] border-t-transparent rounded-full"></div>
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArtworkCard;