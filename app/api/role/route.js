import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req); // ดึง userId จาก Clerk
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูลผู้ใช้พร้อม Role จากฐานข้อมูล
    const dbUser = await prisma.users.findUnique({
      where: { clerk_id: userId },
      include: { roles: true }, // ดึง Role ที่สัมพันธ์
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: dbUser.roles?.name ?? "member" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching role:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
