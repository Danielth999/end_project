import { auth } from "@clerk/nextjs/server";
import Transactions from "./components/Transactions";

export default async function TransactionsPage() {
  const { userId } = await auth(); 
  // console.log("userId", userId);
  return <Transactions userId={userId} />;
}
