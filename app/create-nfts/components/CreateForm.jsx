"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateForm() {
  const [nftData, setNftData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
    category: "art",
    tab: "sell",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNftData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    if (file) {
      setNftData((prevData) => ({
        ...prevData,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(nftData);
    alert("สร้าง NFT สำเร็จ!");
  };

  return (
    <div className="min-h-screen overflow-hidden relative text-white bg-gray-900">
      <div className="container mx-auto p-8 z-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          สร้าง NFT ของคุณ
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-lg"
        >
          <Tabs
            value={nftData.tab}
            onValueChange={(value) =>
              setNftData((prev) => ({ ...prev, tab: value }))
            }
          >
            <TabsList className="mb-4">
              <TabsTrigger value="sell" className="text-lg">
                ขาย NFT
              </TabsTrigger>
              <TabsTrigger value="auction" className="text-lg">
                ประมูล NFT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sell">
              <div className="mb-4">
                <Label htmlFor="title" className="text-lg">
                  ชื่อ NFT
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full mt-2"
                  placeholder="กรอกชื่อ NFT ของคุณ"
                  value={nftData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="description" className="text-lg">
                  คำอธิบาย
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="w-full mt-2"
                  placeholder="อธิบาย NFT ของคุณ"
                  value={nftData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="price" className="text-lg">
                  ราคา (ETH)
                </Label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  className="w-full mt-2"
                  placeholder="กำหนดราคาขายใน ETH"
                  value={nftData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="category" className="text-lg">
                  หมวดหมู่
                </Label>
                <Select
                  value={nftData.category}
                  onValueChange={(value) =>
                    setNftData((prevData) => ({ ...prevData, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">ศิลปะ</SelectItem>
                    <SelectItem value="music">เพลง</SelectItem>
                    <SelectItem value="collectible">ของสะสม</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label htmlFor="image" className="text-lg">
                  อัปโหลดผลงาน
                </Label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full mt-2 text-sm"
                  onChange={handleImageUpload}
                  required
                />
                {nftData.image && (
                  <div className="mt-4">
                    <Image
                      src={nftData.image}
                      alt="NFT Artwork Preview"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="auction">
              <div className="mb-4">
                <Label htmlFor="auctionPrice" className="text-lg">
                  ราคาเริ่มต้น (ETH)
                </Label>
                <Input
                  type="number"
                  id="auctionPrice"
                  name="price"
                  className="w-full mt-2"
                  placeholder="กำหนดราคาเริ่มต้นสำหรับประมูล"
                  value={nftData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="auctionDuration" className="text-lg">
                  ระยะเวลาการประมูล (วัน)
                </Label>
                <Input
                  type="number"
                  id="auctionDuration"
                  name="auctionDuration"
                  className="w-full mt-2"
                  placeholder="ระบุระยะเวลาการประมูล (วัน)"
                  value={nftData.auctionDuration || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="category" className="text-lg">
                  หมวดหมู่
                </Label>
                <Select
                  value={nftData.category}
                  onValueChange={(value) =>
                    setNftData((prevData) => ({ ...prevData, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">ศิลปะ</SelectItem>
                    <SelectItem value="music">เพลง</SelectItem>
                    <SelectItem value="collectible">ของสะสม</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <Label htmlFor="image" className="text-lg">
                  อัปโหลดผลงาน
                </Label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  className="w-full mt-2 text-sm"
                  onChange={handleImageUpload}
                  required
                />
                {nftData.image && (
                  <div className="mt-4">
                    <Image
                      src={nftData.image}
                      alt="NFT Artwork Preview"
                      width={300}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-center mt-6">
            <Button className="bg-[#2dac5c] hover:bg-[#249652] w-full py-3 text-xl">
              สร้าง NFT
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
