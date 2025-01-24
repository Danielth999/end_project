"use client";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Share2,
  Facebook,
  Twitter,
  LinkIcon,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ProductDetailPage = ({ artWorks, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(artWorks.title);
  const [description, setDescription] = useState(artWorks.description);
  const [price, setPrice] = useState(artWorks.price);
  const router = useRouter();

  const isOwner = artWorks.userId === userId;

  const formattedDate = format(new Date(artWorks.createdAt), "dd MMMM yyyy", {
    locale: th,
  });

  const preventContextMenu = (e) => {
    e.preventDefault();
    toast.error("ไม่อนุญาตให้ดาวน์โหลดรูปภาพ");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${artWorks.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            price: parseFloat(price), // Ensure price is a number
          }),
        }
      );

      if (!response.ok) {
        throw new Error("ไม่สามารถอัปเดตผลงานได้");
      }

      const data = await response.json();
      toast.success("อัปเดตผลงานเรียบร้อยแล้ว", {
        position: "top-center",
        duration: 3000,
      });

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating artwork:", error);
      toast.error("ไม่สามารถอัปเดตผลงานได้", {
        position: "top-center",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Image Section */}
          <div
            className="relative w-full aspect-square rounded-lg overflow-hidden group shadow-xl"
            onContextMenu={preventContextMenu}
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
                  className="text-white text-base sm:text-xl md:text-2xl lg:text-4xl font-bold opacity-10 select-none flex items-center justify-center"
                >
                  ArtSpace
                </p>
              ))}
            </div>
          </div>
          {/* Content Section */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-500 break-words">
              {artWorks.title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base break-words">
              {artWorks.description}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            {/* Edit Button */}
            {isOwner && (
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button
                    className="flex-grow bg-yellow-500 w-full hover:bg-yellow-600 transition-all duration-300"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-5 w-5 mr-2" />
                    แก้ไขผลงาน
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>แก้ไขผลงาน</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">ชื่อผลงาน</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">รายละเอียด</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">ราคา (BTH)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleSave}
                    >
                      บันทึก
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            {/* Owner Info */}
            <Card className="bg-gray-800 border-gray-700 mt-4 sm:mt-6">
              <CardContent className="p-3 sm:p-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
                  <div>
                    <p className="text-sm text-gray-400">ผู้สร้าง</p>
                    <Link
                      href={`/profile/${artWorks.userId}`}
                      className="font-semibold hover:underline text-white hover:text-green-500"
                    >
                      {artWorks.User?.firstName} {artWorks.User?.lastName}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">วันที่สร้าง</p>
                    <p className="font-semibold text-white">{formattedDate}</p>
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
