// Code: Navbar Cart Component
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
export const Cart = () => {
  return (
    <>
      <Button
        asChild
        variant="outline"
        className="text-sm font-bold bg-[#2dac5c] rounded-full"
      >
        <Link href="/cart">
          <ShoppingCart className="h-6 w-6 text-white font-bold" />
        </Link>
      </Button>
    </>
  );
};
