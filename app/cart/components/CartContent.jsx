"use client";

import { useState, useEffect } from "react";
import { CartItem } from "./CartItem";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CartContent() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call to fetch cart items
    const fetchCartItems = async () => {
      // In a real application, you would fetch this data from your API
      const mockCartItems = [
        {
          id: "1",
          artwork: {
            id: "a1",
            title: "Abstract Painting",
            price: 199.99,
            image_url: "/placeholder.svg?height=200&width=200",
          },
          quantity: 1,
        },
        {
          id: "2",
          artwork: {
            id: "a2",
            title: "Digital Artwork",
            price: 149.99,
            image_url: "/placeholder.svg?height=200&width=200",
          },
          quantity: 2,
        },
      ];

      setCartItems(mockCartItems);
      setIsLoading(false);
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.artwork.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <p className="text-center text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="relative min-h-[80vh] w-full overflow-hidden bg-gray-900 rounded-t-lg p-4">
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      ))}
      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-xl font-semibold">รวม:</p>
        <p className="text-2xl font-bold">฿{totalPrice.toFixed(2)}</p>
      </div>
      <div className="flex justify-end">
        <Button size="lg" className="bg-[#2dac5c]">
          ชำระเงิน
        </Button>
      </div>
    </div>
  );
}
