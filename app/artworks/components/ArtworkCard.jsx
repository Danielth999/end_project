import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale"; // ใช้ภาษาไทย

const ProductsCard = ({ artWorks }) => {
  // แปลงเวลาให้เป็น "x นาทีผ่านมา"
  const createdAtDate = artWorks.createdAt ? new Date(artWorks.createdAt) : null;
  const formattedDate =
    createdAtDate && !isNaN(createdAtDate)
      ? formatDistanceToNow(createdAtDate, { addSuffix: true, locale: th })
      : "ไม่ทราบเวลา";

  return (
    <div className="transform transition-transform duration-300 hover:-translate-y-1">
      <Card className="relative group overflow-hidden bg-gray-900 text-white border-gray-800">
        <CardHeader className="p-0 relative">
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={artWorks.imageUrl}
              alt={artWorks.name}
              width={400}
              height={400}
              className="transition-transform transform group-hover:scale-110"
            />
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <small className="text-xs text-gray-400 font-semibold">
            {artWorks.Category?.name || "Uncategorized"}
          </small>
          <CardTitle className="text-lg mt-1 mb-2">{artWorks.title}</CardTitle>
          <CardDescription className="text-gray-400 line-clamp-2">
            {artWorks.description}
          </CardDescription>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold text-[#2dac5c]">
              {artWorks.price} BTH
            </p>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
        </CardContent>

        <CardFooter className="p-4 flex justify-between items-center ">
          <Link href={`/artworks/${artWorks.id}`} passHref>
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
  );
};

export default ProductsCard;
