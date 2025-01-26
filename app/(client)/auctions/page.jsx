"use client";
import useSWR from "swr";
import Auction from "./components/Auction";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";

export default function AuctionsPage() {
  const { user, isSignedIn } = useUser();
  const userId = isSignedIn ? user.id : null;

  const {
    data: auctionNFTs,
    error,
    isLoading,
    mutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, fetcher, {
    refreshInterval: 5000,
    revalidateOnMount: true, // ดึงข้อมูลใหม่เมื่อคอมโพเนนต์ถูกโหลด
    revalidateOnFocus: true, // ดึงข้อมูลใหม่เมื่อผู้ใช้ focus ที่หน้าเว็บ
    revalidateIfStale: true, // ดึงข้อมูลใหม่หากข้อมูลใน cache เก่า
    dedupingInterval: 0, // ปิดการ deduplicate การเรียก API
  });

  const handleBidSuccess = async (updatedAuction) => {
    await mutate((data) =>
      data.map((auction) =>
        auction.id === updatedAuction.id
          ? { ...auction, ...updatedAuction }
          : auction
      ),
      false // ไม่ต้อง revalidate ข้อมูลหลังจาก mutate
    );
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading auctions: {error.message}</div>;

  return (
    <Auction
      userId={userId}
      initialAuctionNFTs={auctionNFTs}
      onBidSuccess={handleBidSuccess}
    />
  );
}