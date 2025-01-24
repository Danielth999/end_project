"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// ลบผลงานศิลปะ
export async function deleteArtwork(id) {
  try {
    await prisma.artwork.delete({
      where: { id },
    });
    revalidatePath("/admin/artworks");
    return { success: true, message: "ลบผลงานศิลปะสำเร็จ" };
  } catch (error) {
    console.error("Failed to delete artwork:", error);
    return { success: false, message: "ลบผลงานศิลปะไม่สำเร็จ" };
  }
}

// แก้ไขผลงานศิลปะ
export async function updateArtwork(id, formData) {
  try {
    const title = formData.get("title");
    const price = parseFloat(formData.get("price"));
    const status = formData.get("status");

    await prisma.artwork.update({
      where: { id },
      data: { title, price, status },
    });
    revalidatePath("/admin/artworks");
    return { success: true, message: "แก้ไขผลงานศิลปะสำเร็จ" };
  } catch (error) {
    console.error("Failed to update artwork:", error);
    return { success: false, message: "แก้ไขผลงานศิลปะไม่สำเร็จ" };
  }
}