"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Twitter, Globe, Share2, MoreHorizontal } from "lucide-react";

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "",
    bannerUrl: "/placeholder.svg?height=400&width=1600",
    twitter: "",
    website: "",
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  // Sample NFT data
  const [nfts] = useState([
    {
      id: 1,
      name: "Digital Art #001",
      image: "/placeholder.svg?height=300&width=300",
      price: "0.5 ETH",
    },
    {
      id: 2,
      name: "Digital Art #002",
      image: "/placeholder.svg?height=300&width=300",
      price: "0.8 ETH",
    },
    {
      id: 3,
      name: "Digital Art #003",
      image: "/placeholder.svg?height=300&width=300",
      price: "1.2 ETH",
    },
    // Add more NFTs as needed
  ]);

  useEffect(() => {
    if (isSignedIn && user) {
      setProfile({
        name: user.fullName || "",
        email: user.emailAddresses[0].emailAddress || "",
        bio: "ศิลปินดิจิทัลที่หลงใหลในการสร้างสรรค์ผลงานศิลปะ NFT",
        avatarUrl: user.imageUrl || "/placeholder.svg?height=128&width=128",
        bannerUrl: "/placeholder.svg?height=400&width=1600",
        twitter: "@artist",
        website: "artist.com",
      });
    }
  }, [user, isSignedIn]);

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) return;

      await user.update({
        firstName: editedProfile.name.split(" ")[0],
        lastName: editedProfile.name.split(" ").slice(1).join(" "),
        // Clerk doesn't directly support bio/twitter/website
        // You'll need a separate database for these custom fields
        unsafeMetadata: {
          bio: editedProfile.bio,
          twitter: editedProfile.twitter,
          website: editedProfile.website,
        },
      });

      setProfile(editedProfile);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        กำลังโหลด...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div className="relative h-80 w-full">
       
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4 relative">
        <div className="relative -mt-24 mb-8">
          <Avatar className="w-48 h-48 border-4 border-black">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            <p className="text-gray-400 mb-4">{profile.bio}</p>
            <div className="flex items-center space-x-4">
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  className="text-gray-400 hover:text-blue-400"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">แก้ไขโปรไฟล์</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
                <DialogDescription className="text-gray-400">
                  ทำการเปลี่ยนแปลงข้อมูลโปรไฟล์ของคุณที่นี่
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">ชื่อ</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bio">ประวัติโดยย่อ</Label>
                  <Textarea
                    id="bio"
                    value={editedProfile.bio}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        bio: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={editedProfile.twitter}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        twitter: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={editedProfile.website}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        website: e.target.value,
                      })
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <Button type="submit" className="w-full">
                  บันทึกการเปลี่ยนแปลง
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gray-900 border-gray-800">
            <div className="text-2xl font-bold">{nfts.length}</div>
            <div className="text-gray-400">Items</div>
          </Card>
          <Card className="p-4 bg-gray-900 border-gray-800">
            <div className="text-2xl font-bold">0.5</div>
            <div className="text-gray-400">Floor Price</div>
          </Card>
          <Card className="p-4 bg-gray-900 border-gray-800">
            <div className="text-2xl font-bold">12.8</div>
            <div className="text-gray-400">Volume</div>
          </Card>
          <Card className="p-4 bg-gray-900 border-gray-800">
            <div className="text-2xl font-bold">3.2K</div>
            <div className="text-gray-400">Owners</div>
          </Card>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800"
            >
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full aspect-square object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{nft.name}</h3>
                <p className="text-gray-400">{nft.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
