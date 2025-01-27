import { auth } from "@clerk/nextjs/server"
import Auction from "./components/Auction"

async function fetchAuctions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch auctions")
  }

  return res.json()
}

export default async function AuctionsPage() {
  const { userId } = await auth()
  const auctions = await fetchAuctions()

  return <Auction userId={userId} initialAuctions={auctions} />
}

