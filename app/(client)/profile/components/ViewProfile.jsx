"use client";

import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";

export default function Profile({ view, stats,userId }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader user={view} />
        <ProfileStats stats={stats} />
        <ProfileTabs profileId={view.id} userId={userId} />
      </div>
    </div>
  );
}
