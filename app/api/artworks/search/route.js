import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || ""; // คำค้นหา
    const categoryId = searchParams.get("categoryId"); // หมวดหมู่ (optional)
    const typeId = searchParams.get("typeId"); // ประเภท (optional)
    const limit = parseInt(searchParams.get("limit")) || 10; // จำนวนผลลัพธ์ (default: 10)

    const artworks = await prisma.artwork.findMany({
      where: {
        status: "ACTIVE", // ค้นหาเฉพาะ artwork ที่มีสถานะ ACTIVE
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } }, // ค้นหาจากชื่อ
              { description: { contains: query, mode: "insensitive" } }, // ค้นหาจากคำอธิบาย
            ],
          },
          categoryId ? { categoryId: parseInt(categoryId) } : {}, // กรองตามหมวดหมู่ (ถ้ามี)
          typeId ? { typeId: parseInt(typeId) } : {}, // กรองตามประเภท (ถ้ามี)
        ],
      },
      orderBy: {
        createdAt: "desc", // เรียงลำดับตามวันที่สร้าง (ใหม่สุดก่อน)
      },
      take: limit, // จำกัดจำนวนผลลัพธ์
      include: {
        User: true, // รวมข้อมูลผู้สร้าง
        Category: true, // รวมข้อมูลหมวดหมู่
        ArtworkType: true, // รวมข้อมูลประเภท
      },
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Error searching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}