"use client";

import useSWR from "swr";
import AuctionCard from "@/components/Auctions/AuctionCard";
import fetcher from "@/lib/fetcher";

const ArtworkContainer = ({ profileId }) => {
  // ใช้ SWR ดึงข้อมูล
  const {
    data: Auction,
    error,
    isLoading,
  } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${profileId}`,
    fetcher,
    {
      revalidateOnFocus: true, // รีเฟรชข้อมูลเมื่อกลับมาที่หน้าจอ
      dedupingInterval: 300000, // ป้องกันการดึงข้อมูลซ้ำใน 300 วินาที
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#2dac5c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">ยังไม่มีผลงาน</div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold ">
          ภาพศิลปะทั้งหมด (จำนวน {Auction.length} ภาพ)
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Auction.map((auctions) => (
          <AuctionCard key={auctions.id} nft={auctions} profileId={profileId} />
        ))}
      </div>
    </div>
  );
};

export default ArtworkContainer;
