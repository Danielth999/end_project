// components/DashboardClient.js
"use client";

import { useUserRole } from "@/hooks/useUserRole";

export default function DashboardClient() {
  const { user, userRole, error, isLoading } = useUserRole();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }

  // ตรวจสอบว่า user มีค่าหรือไม่ก่อนเข้าถึง property
  if (!user) {
    return <div>User not found.</div>;
  }
//   console.log("userId_DAs", user.id);
  

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Your role is: {userRole}</p>
      {userRole === "ADMIN" && <div>Admin Dashboard Content{user.firstName}</div>}
      {userRole === "ARTIST" && (
        <div>Artist Dashboard Content{user.firstName} </div>
      )}
      {userRole === "USER" && <div>User Dashboard Content{user.firstName}</div>}
    </div>
  );
}