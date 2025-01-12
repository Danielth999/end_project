"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const AddToCartButton = ({ isAdding, handleAddToCart }) => {
  return (
    <Button
      variant="outline"
      onClick={handleAddToCart}
      disabled={isAdding}
      className="bg-transparent border-[#2dac5c] text-[#2dac5c] hover:bg-[#2dac5c] hover:text-white"
    >
      {isAdding ? (
        <div className="animate-spin h-5 w-5 border-2 border-[#2dac5c] border-t-transparent rounded-full"></div>
      ) : (
        <ShoppingCart className="h-5 w-5" />
      )}
    </Button>
  );
};

export default AddToCartButton;