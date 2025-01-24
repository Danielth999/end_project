"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import useCartStore from "@/stores/useCartStore";

export default function CartIcon() {
  const { cartCount } = useCartStore(); // ดึง state จาก store

  return (
    <Button
      asChild
      variant="outline"
      className="relative h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm font-bold bg-[#2dac5c] hover:bg-[#238c4b] rounded-full transition-colors duration-300 shadow-lg"
    >
      <Link href="/cart" className="flex items-center justify-center">
        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-semibold shadow-md">
            {cartCount}
          </span>
        )}
        <span className="sr-only">View Cart</span>
      </Link>
    </Button>
  );
}