// hooks/useUserRole.js
"use client";

import { useUser } from "@clerk/nextjs";

export function useUserRole() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return { isLoading: true };
  }

  if (!user) {
    return { error: "User not found" };
  }

  // ดึง role จาก publicMetadata
  const userRole = user.publicMetadata?.role || "USER";

  return { userId: user.id, userRole, user, isLoading: false };
}
