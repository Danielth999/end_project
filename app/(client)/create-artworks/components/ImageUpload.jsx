"use client";

import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';

export default function ImageUpload({ nftData, handleImageUpload }) {
  return (
    <div className="space-y-4">
      <Label htmlFor="image" className="text-lg font-medium text-white">
        อัปโหลดผลงาน
      </Label>
      
      <div className="relative">
        {nftData.image ? (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={URL.createObjectURL(nftData.image)}
              alt="Artwork Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <Upload className="h-12 w-12 text-gray-500 mb-4" />
              <p className="text-sm text-gray-400 text-center">
                ลากและวางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-xs text-gray-500 mt-2">
                รองรับไฟล์ PNG, JPG หรือ GIF ขนาดไม่เกิน 5MB
              </p>
            </CardContent>
          </Card>
        )}
        
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required
        />
      </div>
    </div>
  );
}

