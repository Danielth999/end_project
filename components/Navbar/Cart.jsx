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
      className="relative py-2 px-4 text-sm font-bold bg-[#2dac5c] hover:bg-[#238c4b] rounded-full transition-colors duration-300 shadow-lg"
    >
      <Link href="/cart" className="flex items-center justify-center">
        <ShoppingCart className="h-6 w-6 text-white" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow-md">
            {cartCount}
          </span>
        )}
        <span className="sr-only">View Cart</span>
      </Link>
    </Button>
  );
}