import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function CartList({ item, updateQuantity, removeItem }) {
  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-700">
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={item.Artwork.imageUrl}
          alt={item.Artwork.title}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-white">
          <Link href={`/artWorks/${item.Artwork.id}`}>
            {item.Artwork.title}
          </Link>
        </h3>
        <p className="text-gray-400">
          ฿{Number(item.Artwork.price).toFixed(2)}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            updateQuantity(item.id, Math.max(1, item.quantity - 1))
          }
        >
          <Minus className="h-4 w-4 text-white" />
        </Button>
        <span className="w-8 text-center text-white">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-4 w-4 text-white" />
        </Button>
      </div>
      <p className="font-semibold w-24 text-right text-[#2dac5c]">
        ฿{(Number(item.Artwork.price) * item.quantity).toFixed(2)}
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.id)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
