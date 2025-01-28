"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtworkContainer from "./Artwork/ArtworkContainer";
import AuctionContainer from "./Auction/AuctionContainer";
import { useState } from "react";

export default function ProfileTabs({ profileId, userId }) {
  const [activeTab, setActiveTab] = useState("created");

  return (
    <Tabs defaultValue="created" className="mb-12">
      <TabsList className="bg-gray-800 p-1 rounded-lg">
        <TabsTrigger
          value="created"
          onClick={() => setActiveTab("created")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "created"
              ? "bg-green-600 text-white"
              : "text-gray-400"
          }`}
        >
          ผลงานที่สร้าง
        </TabsTrigger>
        <TabsTrigger
          value="collected"
          onClick={() => setActiveTab("collected")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "collected"
              ? "bg-green-600 text-white"
              : "text-gray-400"
          }`}
        >
          ผลงานประมูล
        </TabsTrigger>
      </TabsList>
      <TabsContent value="created">
        <ArtworkContainer profileId={profileId} userId={userId} />
      </TabsContent>
      <TabsContent value="collected">
        <AuctionContainer profileId={profileId} />
      </TabsContent>
    </Tabs>
  );
}
