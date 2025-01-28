import React from "react";
import Hero from "../Hero/Hero";
import ArtworkCard from "../Artworks/ArtworkCard";
import PopularArtists from "../PopularArtists/PopularArtists";
import { auth } from "@clerk/nextjs/server";
async function fetchUsers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/artists`,
    {
      next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

async function fetchArtworkStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworkStats`,
    {
      cache: "no-store", // Disable caching
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch artwork stats");
  }

  return res.json();
}

async function fetchLatestArtworks() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworks?limit=4`,
    {
      next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch latest artworks");
  }

  return res.json();
}

const LayoutHome = async () => {
  const { userId } = await auth();
  const users = await fetchUsers(); // Fetch the user data
  const artworkStats = await fetchArtworkStats(); // Fetch the artwork stats
  const latestArtworks = await fetchLatestArtworks(); // Fetch the latest artworks

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Hero artworkStats={artworkStats} />
      <PopularArtists users={users} />
      <main className="container mx-auto px-4 py-12 space-y-24">
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center ">ผลงานล่าสุด</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artWorks={artwork}
                userId={userId}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LayoutHome;
