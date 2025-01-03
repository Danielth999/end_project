import WalletTopUp from "./components/WalletTopUp";
import { auth } from "@clerk/nextjs/server";
const WalletTopUpPage = async () => {
  const { userId, redirectToSignIn } = await auth();
   if (!userId) {
      redirectToSignIn();
   }

  return (
    <>
      <WalletTopUp userId={userId} />
    </>
  );
};

export default WalletTopUpPage;
