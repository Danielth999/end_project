'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const popularNFTs = [
  {
    id: 1,
    name: 'ความโอ่อ่าทองคำ #1',
    price: '200 BTH',
    image:
      'https://plus.unsplash.com/premium_vector-1709299690215-e3cdddb3060e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0JTIwZGlnaXRhbHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 2,
    name: 'ฝันเพชร #42',
    price: '300 BTH',
    image:
      'https://plus.unsplash.com/premium_vector-1710413094458-6a08395fed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0JTIwZGlnaXRhbHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 3,
    name: 'สวรรค์แพลตตินัม #7',
    price: '250 BTH',
    image:
      'https://plus.unsplash.com/premium_vector-1703437623861-4c302203f69e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXJ0JTIwZGlnaXRhbHxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 4,
    name: 'ความสงบแห่งไพลิน #13',
    price: '220 BTH',
    image:
      'https://plus.unsplash.com/premium_vector-1708810688586-fdd917f9814b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXJ0JTIwZGlnaXRhbHxlbnwwfHwwfHx8MA%3D%3D',
  },
];

export default function PopularNFTsLuxury() {
  return (
    <section className="relative py-24 overflow-hidden ">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          คอลเลกชัน NFT สุดพิเศษ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularNFTs.map((nft) => (
            <div
              key={nft.id}
              className="transform transition-transform duration-300 hover:-translate-y-1"
            >
              <Card className="relative group overflow-hidden bg-gray-800 text-white border-gray-700">
                <CardHeader className="p-0 relative">
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={400}
                      height={400}
                      className="transition-transform transform group-hover:scale-110"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <small className="text-xs text-gray-400 font-semibold">
                    คืออะไร
                  </small>
                  <CardTitle className="text-lg mt-1 mb-2">{nft.name}</CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-2">
                    รายละเอียดเพิ่มเติมเกี่ยวกับ {nft.name}
                  </CardDescription>
                  <div className="flex justify-start items-center mt-4">
                    <p className="text-lg font-bold text-[#2dac5c]">{nft.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 bg-gray-900 flex justify-between items-center">
                  <Button
                    variant="default"
                    className="flex-grow mr-2 bg-[#2dac5c] hover:bg-[#238c4b]"
                  >
                    ดูรายละเอียด
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-2 text-[#2dac5c] border-[#2dac5c] hover:bg-[#2dac5c] hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h18l-1 12.01a2 2 0 01-2 1.99H6a2 2 0 01-2-2L3 3zm3 6h12m-6 6v2m2-2a2 2 0 11-4 0"
                      />
                    </svg>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
