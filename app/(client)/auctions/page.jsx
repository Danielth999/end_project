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
  });

  const handleBidSuccess = async (updatedAuction) => {
    await mutate((data) =>
      data.map((auction) =>
        auction.id === updatedAuction.id
          ? { ...auction, ...updatedAuction }
          : auction
      )
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