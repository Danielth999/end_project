import React from "react";
import Hero from "../Hero/Hero";
import PopularNFTs from "../Popular/Popular";
import PopularArtists from "../PopularArtists/PopularArtists";
import Auction from "@/components/Auction/Auction";
import ForumBlog from "../ForumBlog/ForumBlog";

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
      next: { revalidate: 60 }, // Revalidate the cache every 60 seconds
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch artwork stats");
  }

  return res.json();
}

const LayoutHome = async () => {
  const users = await fetchUsers(); // Fetch the user data
  const artworkStats = await fetchArtworkStats(); // Fetch the artwork stats

  return (
    <>
      <Hero artworkStats={artworkStats} /> {/* Pass artworkStats as props */}
      <PopularArtists users={users} /> {/* Pass users as props */}
      <PopularNFTs />
      <Auction />
      <ForumBlog />
    </>
  );
};

export default LayoutHome;
