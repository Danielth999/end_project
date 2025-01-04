import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server"; // ใช้ตรวจสอบสถานะการล็อกอินของผู้ใช้

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    console.log("Auth Response:", getAuth(req));
    // Debugging userId
    console.log("UserId:", userId);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await currentUser(); // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    if (!user) {
      // หากไม่พบข้อมูลผู้ใช้ใน Clerk ส่งกลับ User does not exist
      return Response.json({ error: "User does not exist" }, { status: 404 });
    }
    // Fetch artworks
    const artworks = await prisma.artworks.findMany({
      where: {
        id: user.id,
      },
      include: {
        Category: true,
        User: true,
      },
    });

    if (!artworks || artworks.length === 0) {
      return Response.json({ error: "No artworks found" }, { status: 404 });
    }

    return Response.json(artworks, { status: 200 });
  } catch (error) {
    console.error("Error fetching artworks:", error.message, error.stack);
    return Response.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}
