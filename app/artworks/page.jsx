// artworks/page.jsx
import { auth } from "@clerk/nextjs/server";
import ProductsContainer from "./components/Artworks.jsx";

// ฟังก์ชันสำหรับ fetch ข้อมูล artwork จาก API
async function fetchArtworks(categoryId = null, search = null) {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`);

  if (categoryId && categoryId !== "all") {
    url.searchParams.append("categoryId", categoryId);
  }

  if (search) {
    url.searchParams.append("search", search);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store", // ปิดการ caching เพื่อให้ได้ข้อมูลล่าสุดเสมอ
  });

  if (!res.ok) {
    throw new Error("Failed to fetch artworks");
  }

  return res.json();
}

// ฟังก์ชันสำหรับ fetch ข้อมูลหมวดหมู่จาก API
async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

const artworksPage = async ({ searchParams }) => {
  const { userId } = await auth(); // ดึง userId จาก auth() ใน Server Component
  const categoryId = searchParams.categoryId || null; // ดึง categoryId จาก query parameter
  const search = searchParams.search || null; // ดึง search จาก query parameter
  const artworks = await fetchArtworks(categoryId, search); // Fetch ข้อมูล artwork ตาม categoryId และ search
  const categories = await fetchCategories(); // Fetch ข้อมูลหมวดหมู่

  return (
    <ProductsContainer
      userId={userId}
      artworks={artworks}
      categories={categories} // ส่ง categories ไปยัง Client Component
    />
  );
};

export default artworksPage;