import React from "react";
import Hero from "../Hero/Hero";
import LatestArtwork from "../Artworks/ArtworkCard";
import PopularArtists from "../PopularArtists/PopularArtists";
import { auth } from "@clerk/nextjs/server";
async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
  });

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
    <>
      <Hero artworkStats={artworkStats} /> {/* Pass artworkStats as props */}
      <PopularArtists users={users} /> {/* Pass users as props */}
      {/* loop through latestArtworks and pass each artwork as props  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {latestArtworks.map((artwork) => (
          <LatestArtwork key={artwork.id} artWorks={artwork} userId={userId} />
        ))}
      </div>
      {/* Pass latestArtworks as props */}
    </>
  );
};

export default LayoutHome;
