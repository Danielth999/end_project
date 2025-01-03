import { auth } from "@clerk/nextjs/server";
import Transactions from "./components/Transactions";

export default async function TransactionsPage() {
  const { userId } = await auth(); // ดึง userId จาก auth()
  return <Transactions userId={userId} />;
}
