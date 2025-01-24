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
    <div className="p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words">
          {searchTerm ? (
            <>
              ผลลัพธ์การค้นหา{" "}
              <span className="text-red-500">&quot;{searchTerm}&quot;</span>{" "}
              <span className="text-base sm:text-lg">
                (จำนวน {artworks.length} ภาพ)
              </span>
            </>
          ) : (
            <>
              ภาพศิลปะทั้งหมด{" "}
              <span className="text-base sm:text-lg">
                (จำนวน {artworks.length} ภาพ)
              </span>
            </>
          )}
        </h1>
        
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label htmlFor="category" className="text-sm sm:text-base">
            จัดเรียงตามหมวดหมู่:
          </label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => handleCategoryChange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {artworks.map((item) => (
          <ProductsCard key={item.id} artWorks={item} userId={userId} />
        ))}
      </div>
    </div>
  );
};

export default ProductsContainer;