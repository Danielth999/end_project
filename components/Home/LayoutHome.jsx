import React from "react";
import Hero from "../Hero/Hero";
import PopularNFTs from "../Popular/Popular";
import PopularArtists from "../PopularArtists/PopularArtists";
import Auction from "@/components/Auction/Auction";
import ForumBlog from "../ForumBlog/ForumBlog";


const LayoutHome = () => {
  return (
    <>
      <Hero />
      <PopularArtists />
      <PopularNFTs />
      <Auction />
      <ForumBlog />
  
    </>
  );
};

export default LayoutHome;
