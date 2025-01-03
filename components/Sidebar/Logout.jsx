import { SignOutButton } from '@clerk/nextjs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut } from "lucide-react"; // ไอคอน LogOut


export default function Signout() {


  return (
    <div className="w-[52px] h-[52px] flex justify-center items-center rounded-[50px] cursor-pointer">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {/* เมื่อคลิกจะเรียก handleSignOut */}
            <SignOutButton >
              <LogOut className="w-6 h-6 dark:text-[#20b256]" />
            </SignOutButton>
          </TooltipTrigger>
          <TooltipContent>ออกจากระบบ</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
