import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // ตรวจสอบว่ามีไฟล์หรือข้อมูล QR code ส่งมาหรือไม่
    const slipFile = formData.get("files");
    const slipData = formData.get("data");

    if (!slipFile && !slipData) {
      throw new Error("ต้องส่งไฟล์สลิปหรือข้อมูล QR code");
    }

    const slipOkApiUrl = process.env.NEXT_PUBLIC_SLIP_OK_API_URL;
    const slipOkApiKey = process.env.SLIP_OK_API_KEY;

    const response = await fetch(slipOkApiUrl, {
      method: "POST",
      headers: {
        "x-authorization": slipOkApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorResponse = await response.json(); // แปลง error response เป็น JSON

      // ส่งข้อความ error ที่ชัดเจนกลับไปยัง Frontend
      throw new Error(
        errorResponse.message || "เกิดข้อผิดพลาดในการตรวจสอบสลิป"
      );
    }

    const result = await response.json();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "เกิดข้อผิดพลาดในการตรวจสอบสลิป" },
      { status: 500 }
    );
  }
}
