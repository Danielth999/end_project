import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartItem({ item, updateQuantity, removeItem }) {
  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={item.artwork.image_url}
          alt={item.artwork.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{item.artwork.title}</h3>
        <p className="text-gray-600">฿{item.artwork.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            updateQuantity(item.id, Math.max(1, item.quantity - 1))
          }
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-semibold w-24 text-right">
        ฿{(item.artwork.price * item.quantity).toFixed(2)}
      </p>
      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </div>
  );
}
