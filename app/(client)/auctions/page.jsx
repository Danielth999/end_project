"use client";
import useSWR from "swr";
import Auction from "./components/Auction";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";

export const metadata = {
  title: "การประมูล - Art Space",
  description: "เข้าร่วมการประมูลศิลปะดิจิทัลที่ Art Space และเสนอราคาสำหรับผลงานศิลปะที่คุณชื่นชอบ",
  keywords: ["การประมูล", "ศิลปะดิจิทัล", "NFT", "Art Space"],
  openGraph: {
    title: "การประมูล - Art Space",
    description: "เข้าร่วมการประมูลศิลปะดิจิทัลที่ Art Space และเสนอราคาสำหรับผลงานศิลปะที่คุณชื่นชอบ",
    url: "https://www.artspaceth.online/auctions",
    images: [
      {
        url: "https://www.artspaceth.online/images/auction-banner.jpg",
        width: 1200,
        height: 630,
        alt: "การประมูลที่ Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "การประมูล - Art Space",
    description: "เข้าร่วมการประมูลศิลปะดิจิทัลที่ Art Space และเสนอราคาสำหรับผลงานศิลปะที่คุณชื่นชอบ",
    images: ["https://www.artspaceth.online/images/auction-banner.jpg"],
  },
};

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