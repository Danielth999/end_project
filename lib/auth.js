// lib/auth.js
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserRole() {
  // ดึง userId จาก auth()
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  const user = await currentUser();

  if (!user) {
    return { error: "User not found" };
  }

  // ดึง role จาก publicMetadata
  const userRole = user.publicMetadata?.role || "USER";

  return { userId, userRole, user };
}
