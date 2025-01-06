"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SellForm from "./SellForm";
import AuctionForm from "./AuctionForm";
import CategorySelect from "./CategorySelect";
import ImageUpload from "./ImageUpload";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function CreateForm({ userId }) {
  // State สำหรับเก็บข้อมูลฟอร์ม NFT
  const [nftData, setNftData] = useState({
    title: "", // ชื่อ NFT
    description: "", // คำอธิบาย
    price: "", // ราคาขาย (ใช้ในกรณีขาย)
    image: null, // ไฟล์ภาพ
    category: "1", // หมวดหมู่
    tab: "sell", // ประเภท (ขายหรือประมูล)
    auctionStartPrice: "", // ราคาเริ่มต้นการประมูล
    auctionStartAt: null, // วันที่เริ่มการประมูล
    auctionEndAt: null, // วันที่สิ้นสุดการประมูล
  });

  // State สำหรับแสดงสถานะการโหลด
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันจัดการการเปลี่ยนแปลงในฟิลด์อินพุต
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNftData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันจัดการอัปโหลดภาพ
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      setNftData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  // ฟังก์ชันรีเซ็ตฟอร์ม
  const resetForm = () => {
    setNftData({
      title: "",
      description: "",
      price: "",
      image: null,
      category: "1",
      tab: "sell",
      auctionStartPrice: "",
      auctionStartAt: null,
      auctionEndAt: null,
    });
  };

  // ฟังก์ชันส่งข้อมูลฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = null;

      // อัปโหลดภาพถ้ามี
      if (nftData.image) {
        const uploadToast = toast.loading("กำลังอัปโหลดภาพ...");
        const formData = new FormData();
        formData.append("file", nftData.image);

        const uploadResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.url;
        toast.success("อัปโหลดภาพสำเร็จ!", { id: uploadToast });
      }

      // แปลงวันที่ให้อยู่ในรูปแบบ ISO 8601
      const auctionStartAt = nftData.auctionStartAt
        ? new Date(nftData.auctionStartAt).toISOString()
        : null;
      const auctionEndAt = nftData.auctionEndAt
        ? new Date(nftData.auctionEndAt).toISOString()
        : null;

      // ข้อมูลที่จะส่งไปยัง API
      const artworkData = {
        userId,
        title: nftData.title,
        description: nftData.description,
        price: nftData.tab === "sell" ? parseFloat(nftData.price) : null,
        auctionStartPrice:
          nftData.tab === "auction"
            ? parseFloat(nftData.auctionStartPrice)
            : null,
        auctionStartAt, // วันที่เริ่มการประมูล
        auctionEndAt, // วันที่สิ้นสุดการประมูล
        categoryId: parseInt(nftData.category),
        typeId: nftData.tab === "sell" ? 1 : 2, // ประเภท (ขายหรือประมูล)
        imageUrl, // ลิงก์ภาพที่อัปโหลด
      };

      const createArtworkToast = toast.loading("กำลังสร้างผลงาน...");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/artworks`,
        artworkData
      );
      toast.success("สร้าง NFT สำเร็จ!", { id: createArtworkToast });
      console.log("Artwork created:", response.data);

      resetForm(); // รีเซ็ตฟอร์มหลังสร้างเสร็จ
    } catch (error) {
      console.error("Error creating artwork:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้าง NFT");
    } finally {
      setIsLoading(false); // ปิดสถานะโหลด
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-black/30 border-gray-800">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <Tabs
            value={nftData.tab}
            onValueChange={(value) =>
              setNftData((prev) => ({ ...prev, tab: value }))
            }
            className="w-full"
          >
            <div className="border-b border-gray-800">
              <TabsList className="w-full h-auto bg-transparent border-b border-gray-800">
                <TabsTrigger
                  value="sell"
                  className="w-1/2 py-4 data-[state=active]:bg-gray-800/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold">ขาย NFT</span>
                    <span className="text-sm text-gray-400">
                      ขายในราคาคงที่
                    </span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="auction"
                  className="w-1/2 py-4 data-[state=active]:bg-gray-800/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold">ประมูล NFT</span>
                    <span className="text-sm text-gray-400">
                      ตั้งราคาเริ่มต้นและระยะเวลา
                    </span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                <div className="space-y-6 order-2 md:order-1">
                  <TabsContent value="sell" className="m-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SellForm
                        nftData={nftData}
                        handleInputChange={handleInputChange}
                      />
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="auction" className="m-0">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AuctionForm
                        nftData={nftData}
                        handleInputChange={handleInputChange}
                        setNftData={setNftData}
                      />
                    </motion.div>
                  </TabsContent>

                  <CategorySelect nftData={nftData} setNftData={setNftData} />

                  <Button
                    type="submit"
                    className="w-full  bg-emerald-500  hover:bg-teal-600 text-white py-6 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                        กำลังสร้าง NFT...
                      </div>
                    ) : (
                      "สร้าง NFT"
                    )}
                  </Button>
                </div>

                <div className="order-1 md:order-2">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <ImageUpload
                        nftData={nftData}
                        handleImageUpload={handleImageUpload}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
}
