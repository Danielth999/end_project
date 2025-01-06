import { NextResponse } from "next/server";
import supabase from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // สร้างชื่อไฟล์ใหม่
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `artworks/${fileName}`;

    // อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data, error } = await supabase.storage
      .from("artworks") // เปลี่ยนเป็นชื่อ bucket ของคุณ
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // ส่งกลับ URL ของไฟล์ที่อัปโหลด
    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artworks/${data.path}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
