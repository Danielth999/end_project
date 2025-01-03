import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Artwork = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="transform transition-transform duration-300 hover:-translate-y-1">
        <Card className="relative group overflow-hidden bg-gray-900 text-white border-gray-800">
          <CardHeader className="p-0 relative">
            <div className="relative w-full h-64 overflow-hidden">
              <Image
                src={cards.image}
                alt={cards.name}
                width={400}
                height={400}
                className="transition-transform transform group-hover:scale-110"
              />
            </div>
          </CardHeader>

          <CardContent className="p-4">
            <small className="text-xs text-gray-400 font-semibold">
              ภาพศิลปะ
            </small>
            <CardTitle className="text-lg mt-1 mb-2">{cards.title}</CardTitle>
            <CardDescription className="text-gray-400 line-clamp-2">
              {cards.description}
            </CardDescription>
            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-bold text-[#2dac5c]">0.02 ETH</p>
              <p className="text-sm text-gray-400">20 วันก่อน</p>
            </div>
          </CardContent>

          <CardFooter className="p-4 bg-gray-800 flex justify-between items-center">
            <Link href={`/products/${cards.id}`} passHref>
              <Button
                variant="default"
                className="flex-grow mr-2 bg-[#2dac5c] hover:bg-[#238c4b]"
              >
                ดูรายละเอียด
              </Button>
            </Link>
            <Button
              variant="outline"
              className="bg-transparent border-[#2dac5c] text-[#2dac5c] hover:bg-[#2dac5c] hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Artwork;
