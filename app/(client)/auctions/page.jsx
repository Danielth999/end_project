// app/auctions/page.jsx
import Auction from "./components/Auction";
import { auth } from "@clerk/nextjs/server";

async function fetchAuctions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`);
  if (!res.ok) {
    throw new Error("Failed to fetch auctions");
  }
  return res.json();
}

export default async function AuctionsPage() {
  const auctionNFTs = await fetchAuctions();
  const { userId } = await auth(); // Get user info from Clerk's auth

  return (
    <Auction userId={userId} initialAuctionNFTs={auctionNFTs} />
  );
}
