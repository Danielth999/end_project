"use client";

import SignIn from "./SignIn";
import { SignOutButton } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Profile = () => {
  const { userRole, user, isLoading } = useUserRole();

  // แสดงหน้า SignIn หากยังไม่มี user หรือกำลังโหลด
  if (isLoading || !user) {
    return <SignIn />;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.imageUrl || "/default-avatar.png"}
              alt={user.fullName || "User"}
            />
            <AvatarFallback>{user.fullName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">โปรไฟล์</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/history">ประวัติการสั่งซื้อ/ประมูล</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/transactions">ประวัติการทำธุรกรรม</Link>
        </DropdownMenuItem>

        {/* แสดงเมนู admin เฉพาะผู้ใช้ที่มี role เป็น ADMIN */}
        {userRole === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" target="_blank">ระบบแอดมิน</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOutButton>ออกจากระบบ</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
