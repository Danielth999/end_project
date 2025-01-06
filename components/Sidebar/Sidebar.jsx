"use client"; // Marks this as a client-side component

// Import necessary dependencies
import { useUser } from "@clerk/nextjs"; // For user authentication state
import { usePathname } from "next/navigation"; // For getting current route path
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  Newspaper,
  Gavel,
  Plus,
} from "lucide-react"; // นำเข้าไอคอนจาก lucide-react
import Link from "next/link"; // ใช้ Link จาก Next.js สำหรับการทำการนำทางภายใน
import Logo from "@/public/image/logo.webp"; // นำเข้าโลโก้ของเว็บไซต์
import DarkMode from "./DarkMode"; // นำเข้า DarkMode component สำหรับการสลับธีม
import Image from "next/image"; // นำเข้า Image จาก Next.js สำหรับการแสดงรูปภาพ
import Logout from "./Logout"; // นำเข้า Logout component สำหรับการออกจากระบบ

// Navigation links configuration
const navlinks = [
  {
    name: "Home",
    link: "/",
    icon: <Home className="w-6 h-6 dark:text-[#20b256]" />,
  },
  {
    name: "ภาพศิลปะ",
    link: "/artworks",
    icon: <LayoutGrid className="w-6 h-6 dark:text-[#20b256]" />, // ใช้ไอคอน Box จาก lucide-react
  },
  {
    name: "ประมูล",
    link: "/auctions",
    icon: <Gavel className="w-6 h-6 dark:text-[#20b256]" />, // ใช้ไอคอน Box จาก lucide-react
  },

  {
    name: "สร้างผลงาน",
    link: "/create-artworks",
    icon: <Plus className="w-6 h-6 dark:text-[#20b256]" />, // ใช้ไอคอน Book จาก lucide-react
  },
];

const Sidebar = () => {
  // Hooks for routing and authentication
  const pathname = usePathname(); // Get current route path
  const { isSignedIn } = useUser(); // Check if user is signed in

  return (
    <div className="flex justify-between items-center  flex-col sticky top-5 h-[93vh]">
      {/* Logo Section - Links to homepage */}
      <Link href="/">
        <div className="border-2 border-green-500 rounded-[50px] flex justify-center items-center">
          <Image
            src={Logo}
            alt="logo"
            width={52} // ตั้งขนาดโลโก้ให้เหมาะสม
            height={52}
            className="object-cover rounded-full" // ให้ภาพไม่ผิดสัดส่วน
          />
        </div>
      </Link>

      {/* Main Sidebar Container */}
      <div className="flex-1 flex flex-col justify-center items-center dark:bg-gray-900 bg-[#dbe4e9] rounded-[50px] w-[76px] py-4 mt-12">
        {/* Navigation Links Section */}
        <div className="flex flex-col justify-center items-center gap-3">
          {/* Map through navigation links */}
          {navlinks.map((link) => (
            <Link key={link.name} href={link.link}>
              {/* Navigation Item with active state styling */}
              <div
                className={`
                w-[52px] h-[52px] 
                flex justify-center items-center 
                rounded-[50px] cursor-pointer 
                ${
                  pathname === link.link
                    ? "dark:bg-[#2c2f32] bg-[#9fa6aa] text-white"
                    : "text-black"
                }
              `}
              >
                {/* Tooltip for each navigation item */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>{link.icon}</TooltipTrigger>
                    <TooltipContent>{link.name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </Link>
          ))}

          {/* Conditional Logout Button */}
          {isSignedIn && <Logout />}
        </div>

        {/* Dark Mode Toggle - Currently commented out */}
        {/* <DarkMode /> */}
      </div>
    </div>
  );
};

export default Sidebar;
