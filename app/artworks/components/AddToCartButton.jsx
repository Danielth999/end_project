"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";


const AddToCartButton = ({ product }) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST", // ใช้ POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artworkId: product.id,
          quantity: 1,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to add item to cart";
        console.error("Error:", errorMessage);
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      alert("สินค้าเพิ่มลงในตะกร้าแล้ว!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.message || "ไม่สามารถเพิ่มสินค้าในตะกร้าได้");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      className="bg-[#2dac5c] hover:bg-[#238c4b] text-white"
    >
      {loading ? "กำลังเพิ่ม..." : <ShoppingCart className="h-5 w-5" />}
    </Button>
  );
};

export default AddToCartButton;
