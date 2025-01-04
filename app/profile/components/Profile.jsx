"use client";

import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileTabs from "./ProfileTabs";

export default function Profile({ user, stats }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <ProfileHeader user={user} />
        <ProfileStats stats={stats} />
        <ProfileTabs userId={user.id} />
      </div>
    </div>
  );
}
