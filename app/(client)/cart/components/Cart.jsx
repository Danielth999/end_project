"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import CartList from "./CartList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import fetcher from "@/lib/fetcher";
import toast from "react-hot-toast";
import Link from "next/link";
import useCartStore from "@/stores/useCartStore";

export default function Cart({ userId }) {
  const {
    data: cartData,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`, fetcher);

  const { decrementCartCount, setCartCount, fetchCartCount } = useCartStore();

  // ใช้ local state เพื่อเก็บข้อมูลตะกร้า
  const [localCartItems, setLocalCartItems] = useState([]);

  // ดึงจำนวนสินค้าในตะกร้าเมื่อ component โหลด
  useEffect(() => {
    fetchCartCount(userId);
  }, [userId, fetchCartCount]);

  // อัปเดต local state และ store เมื่อ cartData เปลี่ยนแปลง
  useEffect(() => {
    if (cartData?.cartItems) {
      setLocalCartItems(cartData.cartItems);
      setCartCount(cartData.totalItems); // อัปเดตจำนวนสินค้าใน store
    }
  }, [cartData, setCartCount]);

  const updateQuantity = async (id, newQuantity) => {
    const itemIndex = localCartItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    const updatedCartItems = [...localCartItems];
    const oldQuantity = updatedCartItems[itemIndex].quantity;

    // Optimistic update
    updatedCartItems[itemIndex] = {
      ...updatedCartItems[itemIndex],
      quantity: newQuantity,
    };
    setLocalCartItems(updatedCartItems);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      mutate();
      toast.success("อัปเดตจำนวนสินค้าสำเร็จ");
    } catch (err) {
      console.error("Failed to update quantity:", err);

      // Rollback on error
      updatedCartItems[itemIndex] = {
        ...updatedCartItems[itemIndex],
        quantity: oldQuantity,
      };
      setLocalCartItems(updatedCartItems);
      toast.error("ไม่สามารถอัปเดตจำนวนสินค้าได้");
    }
  };

  const removeItem = async (id) => {
    const itemIndex = localCartItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    const updatedCartItems = [...localCartItems];
    const removedItem = updatedCartItems.splice(itemIndex, 1);

    // Optimistic update
    setLocalCartItems(updatedCartItems);
    decrementCartCount();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      mutate();
      toast.success("ลบสินค้าสำเร็จ");
    } catch (err) {
      console.error("Failed to remove item:", err);

      // Rollback on error
      updatedCartItems.splice(itemIndex, 0, removedItem[0]);
      setLocalCartItems(updatedCartItems);
      toast.error("ไม่สามารถลบสินค้าได้");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-gray-500">เกิดข้อผิดพลาดในการโหลดตะกร้า</p>
    );
  }

  if (!localCartItems || localCartItems.length === 0) {
    return <p className="text-center text-gray-500">ตะกร้าของคุณว่างเปล่า</p>;
  }

  const totalPrice = localCartItems.reduce(
    (sum, item) => sum + item.Artwork.price * item.quantity,
    0
  );

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden bg-gray-900 rounded-t-lg p-4">
      {localCartItems.map((item) => (
        <CartList
          key={item.id}
          item={item}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      ))}
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-xl font-semibold text-white">รวม:</p>
        <p className="text-2xl font-bold text-[#2dac5c]">
          ฿{totalPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <Link href="/order" passHref>
          <Button
            size="lg"
            className="bg-[#2dac5c] hover:bg-[#238c4b] text-white"
          >
            ชำระเงิน
          </Button>
        </Link>
      </div>
    </div>
  );
}