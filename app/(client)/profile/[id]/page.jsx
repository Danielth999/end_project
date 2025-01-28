import ViewProfile from "../components/ViewProfile";
import { auth } from "@clerk/nextjs/server";

async function fetchUser(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
    {
      next: { revalidate: 60 }, // Cache data for 60 seconds
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch user data for ID ${id}`);
  }
  return res.json();
}

async function fetchStats(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworkStats/${id}`,
    {
      next: { revalidate: 60 }, // Cache data for 60 seconds
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch stats for user ID ${id}`);
  }
  return res.json();
}

export default async function Page({ params }) {
  const { id } = params;
  const { userId } = await auth(); // ดึง userId จาก auth() ใน Server Component

  // Parallel fetching for better performance
  const [view, stats] = await Promise.all([fetchUser(id), fetchStats(id)]);

  return (
    <>
      <ViewProfile view={view} stats={stats} userId={userId} />
    </>
  );
}
