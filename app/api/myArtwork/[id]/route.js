import { prisma } from "@/lib/prisma"; // Prisma Client

import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    // console.log("id", id);
    // ถ้าไม่มีผู้ใช้
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artWorks = await prisma.Artwork.findMany({
      where: {
        userId: id,
        typeId: 1, // ประเภทการขาย
      },
      include: {
        Category: true,
        User: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // ถ้าไม่พบข้อมูล artWorks
    if (!artWorks || artWorks.length === 0) {
      return NextResponse.json({ error: "No artWorks found" }, { status: 404 });
    }
    // ส่งข้อมูล artWorks กลับไปให้ Client
    return NextResponse.json(artWorks);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error fetching artWorks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artWorks" },
      { status: 500 }
    );
  }
}
// delete artWorks
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    // ถ้าไม่มีผู้ใช้
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหาข้อมูล artWorks จาก Prisma
    const artWorkss = await prisma.artWorks.update({
      where: {
        id: id,
      },
      data: {
        status: "COMPLETED",
      },
    });

    // ถ้าไม่พบข้อมูล artWorks
    if (!artWorkss) {
      return NextResponse.json(
        { error: "No artWorkss found" },
        { status: 404 }
      );
    }
    // ส่งข้อมูล artWorks กลับไปให้ Client
    return NextResponse.json(artWorkss);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error deleting artWorks:", error);
    return NextResponse.json(
      { error: "Failed to delete artWorks" },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    // ถ้าไม่มีผู้ใช้
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ค้นหาข้อมูล artWorks จาก Prisma
    const artWorkss = await prisma.artWorks.delete({
      where: {
        id: id,
      },
    });

    // ถ้าไม่พบข้อมูล artWorks
    if (!artWorkss) {
      return NextResponse.json(
        { error: "No artWorkss found" },
        { status: 404 }
      );
    }
    // ส่งข้อมูล artWorks กลับไปให้ Client
    return NextResponse.json(artWorkss);
  } catch (error) {
    // แสดงข้อผิดพลาด
    console.error("Error deleting artWorks:", error);
    return NextResponse.json(
      { error: "Failed to delete artWorks" },
      { status: 500 }
    );
  }
}
