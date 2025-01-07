"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import fetcher from "@/lib/fetcher";

export default function Cart({ userId }) {
  // console.log("userId", userId);
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
    fetcher
  );

  if (error) {
    console.error("Failed to fetch cart count:", error);
  }

  const totalCount = data?.totalItems || 0;

  return (
    <Button
      asChild
      variant="outline"
      className="relative py-2 px-4 text-sm font-bold bg-[#2dac5c] hover:bg-[#238c4b] rounded-full transition-colors duration-300 shadow-lg"
    >
      <Link href="/cart" className="flex items-center justify-center">
        <ShoppingCart className="h-6 w-6 text-white" />
        {totalCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow-md">
            {totalCount}
          </span>
        )}
        <span className="sr-only">View Cart</span>
      </Link>
    </Button>
  );
}
