"use client";
import useSWR from "swr";
import Auction from "./Auction";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/Loading";
export default function AuctionsPage() {
  const {
    data: auctionNFTs,
    error,
    isLoading,
    mutate, // For forcing refresh
  } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, fetcher, {
    refreshInterval: 5000, // Automatically refresh every 5 seconds
    revalidateOnMount: true, // บังคับรีเฟรชข้อมูลเมื่อโหลดครั้งแรก
    revalidateOnFocus: true, // บังคับรีเฟรชข้อมูลเมื่อเปลี่ยนโฟกัส
  });

  const handleBidSuccess = async (updatedAuction) => {
    await mutate((data) => {
      return data.map((auction) =>
        auction.id === updatedAuction.id ? updatedAuction : auction
      );
    }, false);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading auctions: {error.message}</div>;

  return (
    <Auction initialAuctionNFTs={auctionNFTs} onBidSuccess={handleBidSuccess} />
  );
}
