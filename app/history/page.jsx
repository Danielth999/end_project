import { auth } from "@clerk/nextjs/server";
import HistoryContainer from "./components/HistoryContainer";

async function getHistory(userId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/history/${userId}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }

  return res.json();
}

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <p className="text-2xl">Please log in to view your history.</p>
      </div>
    );
  }

  const historyData = await getHistory(userId);

  return <HistoryContainer initialHistory={historyData} />;
}
