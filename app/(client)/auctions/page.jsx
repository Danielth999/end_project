import Auction from "./components/Auction"
import { auth } from "@clerk/nextjs/server"

export default async function AuctionsPage() {
  const { userId } = await auth()

  return <Auction userId={userId} />
}

