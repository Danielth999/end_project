// artworks/components/Artworks.jsx
"use client"; // ระบุว่าเป็น Client Component

import ProductsCard from "@/components/Artworks/ArtworkCard";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductsContainer = ({ userId, artworks, categories = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("categoryId") || "all"
  );

  // ดึง query parameter search จาก URL
  const searchTerm = searchParams.get("search") || "";

  // ฟังก์ชันสำหรับเปลี่ยนหมวดหมู่
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // อัปเดต URL ด้วย query parameter ใหม่
    router.push(`/artworks?categoryId=${categoryId}`);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          {searchTerm ? (
            <>
              ผลลัพธ์การค้นหา{" "}
              <span className="text-red-500">&quot;{searchTerm}&quot;</span> (จำนวน{" "}
              {artworks.length} ภาพ)
            </>
          ) : (
            `ภาพศิลปะทั้งหมด (จำนวน ${artworks.length} ภาพ)`
          )}
        </h1>
        <div className="mt-4">
          <label htmlFor="category" className="mr-2">
            จัดเรียงตามหมวดหมู่:
          </label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => handleCategoryChange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {artworks.map((item) => (
          <ProductsCard key={item.id} artWorks={item} userId={userId} />
        ))}
      </div>
    </>
  );
};

export default ProductsContainer;