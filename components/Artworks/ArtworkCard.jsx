"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import axios from "axios";
import toast from "react-hot-toast";
import useCartStore from "@/stores/useCartStore";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddToCartButton from "./AddToCartButton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

const ArtworkCard = ({ artWorks, userId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const imageRef = useRef(null);
  const { updateCartCount } = useCartStore();
  const router = useRouter();

  const isOwner = artWorks.userId === userId;

  const createdAtDate = artWorks.createdAt
    ? new Date(artWorks.createdAt)
    : null;
  const formattedDate =
    createdAtDate && !isNaN(createdAtDate)
      ? formatDistanceToNow(createdAtDate, { addSuffix: true, locale: th })
      : "ไม่ทราบเวลา";

  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
    };

    const handleDragStart = (e) => {
      e.preventDefault();
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
    const toastId = toast.loading("กำลังเพิ่มสินค้าลงในตะกร้า...", {
      position: "top-center",
    });

    try {
      // Optimistic update
      updateCartCount(1);

      const postResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
        {
          userId,
          artworkId: artWorks.id,
          quantity: 1,
        }
      );

      if (postResponse.status !== 200) {
        throw new Error(
          postResponse.data.message || "Failed to add item to cart"
        );
      }

      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`
      );

      if (getResponse.status !== 200) {
        throw new Error("Failed to fetch updated cart data");
      }

      updateCartCount(getResponse.data.totalItems);

      toast.success(`${artWorks.title} ถูกเพิ่มลงในตระกร้าเรียบร้อยแล้ว`, {
        id: toastId,
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.error || "ไม่สามารถเพิ่มสินค้าได้", {
        id: toastId,
        position: "top-center",
        duration: 3000,
      });

      // Rollback on error
      updateCartCount(-1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("กำลังลบผลงาน...", {
      position: "top-center",
    });

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${artWorks.id}`
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to delete artwork");
      }

      toast.success(`${artWorks.title} ถูกลบเรียบร้อยแล้ว`, {
        id: toastId,
        position: "top-center",
        duration: 3000,
      });

      // Refresh the page or update the UI
      router.refresh();
    } catch (error) {
      console.error("Error deleting artwork:", error);
      toast.error(error.response?.data?.error || "ไม่สามารถลบผลงานได้", {
        id: toastId,
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-gray-900 text-white border-gray-800 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-[#2dac5c]/20">
        <CardHeader className="p-0 relative w-full h-64 overflow-hidden group">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              ref={imageRef}
              src={artWorks.imageUrl}
              alt={artWorks.title}
              fill
              sizes="100vw"
              loading="lazy"
              className="transition-transform duration-300"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
          />
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
            <Badge variant="secondary" className="bg-[#2dac5c] text-white">
              {artWorks.Category?.name || "Uncategorized"}
            </Badge>
            {isOwner && (
              <Badge variant="secondary"  className="border-[#2dac5c] text-[#2dac5c]">
                คุณเป็นเจ้าของ
              </Badge>
            )}
          </div>
          <p className="absolute bottom-2 right-2 text-sm text-gray-300">
            {formattedDate}
          </p>
        </CardHeader>

        <CardContent className="flex-grow p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">{artWorks.title}</CardTitle>
            <p className="text-lg font-bold text-[#2dac5c]">
              {artWorks.price} BTH
            </p>
          </div>
          <p className="text-sm text-gray-400">
            ศิลปิน: {artWorks.User?.firstName || "ไม่ระบุ"}
          </p>
        </CardContent>

        <CardFooter className="p-4 flex justify-between items-center">
          <Link
            href={`/artworks/${artWorks.id}`}
            passHref
            className="flex-grow mr-2"
          >
            <Button
              variant="default"
              className="w-full text-white bg-[#2dac5c] hover:bg-[#238c4b] transition-colors duration-300"
            >
              {isOwner ? "แก้ไขรายละเอียด" : "ดูรายละเอียด"}
            </Button>
          </Link>
          {isOwner ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="shrink-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    การกระทำนี้ไม่สามารถยกเลิกได้ ผลงานนี้จะถูกลบอย่างถาวร
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "กำลังลบ..." : "ลบ"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <AddToCartButton
              isAdding={isAdding}
              handleAddToCart={handleAddToCart}
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArtworkCard;

