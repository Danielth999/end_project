import { auth } from "@clerk/nextjs/server";
import WalletManagement from "./components/WalletManagement";
import { getUserWalletBalance } from "@/lib/user";

export default async function WalletPage() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const walletBalance = await getUserWalletBalance(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-800 to-teal-700 flex items-center justify-center p-4">
      <WalletManagement userId={userId} initialBalance={walletBalance} />
    </div>
  );
}

