import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton"; // ใช้คอมโพเนนต์ที่สร้างขึ้น

const ProductsCard = ({ item }) => {
  
  return (
    <div className="transform transition-transform duration-300 hover:-translate-y-1">
      <Card className="relative group overflow-hidden bg-gray-900 text-white border-gray-800">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={item.image_url}
              alt={item.title}
              width={400}
              height={400}
              className="transition-transform transform group-hover:scale-110"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <small className="text-xs text-gray-400 font-semibold">
          {item.categories?.name || "No Category"}
          </small>
          <CardTitle className="text-lg mt-1 mb-2">{item.title}</CardTitle>
          <CardDescription className="text-gray-400 line-clamp-2">
            {item.description}
          </CardDescription>
          <div className="flex justify-start items-center mt-4">
            <p className="text-lg font-bold text-[#2dac5c]">{item.price} BTH</p>
      
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-gray-800 flex justify-between items-center">
          <Link href={`/products/${item.id}`} passHref>
            <Button
              variant="default"
              className="flex-grow mr-2 bg-[#2dac5c] hover:bg-[#238c4b]"
            >
              ดูรายละเอียด
            </Button>
          </Link>
          <AddToCartButton product={item} /> {/* เพิ่มปุ่ม Add to Cart */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductsCard;
