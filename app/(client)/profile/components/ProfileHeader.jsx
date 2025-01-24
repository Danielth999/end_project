"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, Share2, MoreHorizontal } from "lucide-react";

export default function ProfileHeader({ user }) {
  const defaultAvatar = "/default-avatar.png"; // รูปโปรไฟล์เริ่มต้น

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start mb-12">
      <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-green-500 shadow-lg">
        <AvatarImage
          src={user.imageUrl || defaultAvatar} // ใช้รูป default หาก imageUrl ไม่มีข้อมูล
          alt={user.firstName || "User Avatar"}
        />
        <AvatarFallback>{user.firstName?.charAt(0) || "?"}</AvatarFallback>
      </Avatar>
      <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
        <h1 className="text-4xl font-bold mb-2">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-xl text-gray-400 mb-4">
          @{user.firstName || "username"}
        </p>
        <div className="flex justify-center md:justify-start space-x-4 mb-4">
          <Button variant="" size="icon">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="" size="icon">
            <Globe className="h-5 w-5 " />
          </Button>
          <Button variant="" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button variant="" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
