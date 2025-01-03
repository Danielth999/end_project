"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TimeAgo({ date }) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      const seconds = Math.floor(
        (new Date().getTime() - date.getTime()) / 1000
      );
      let interval = seconds / 31536000;
      if (interval > 1) return setTimeAgo(Math.floor(interval) + " ปีที่แล้ว");
      interval = seconds / 2592000;
      if (interval > 1) return setTimeAgo(Math.floor(interval) + " เดือนที่แล้ว");
      interval = seconds / 86400;
      if (interval > 1) return setTimeAgo(Math.floor(interval) + " วันที่แล้ว");
      interval = seconds / 3600;
      if (interval > 1) return setTimeAgo(Math.floor(interval) + " ชั่วโมงที่แล้ว");
      interval = seconds / 60;
      if (interval > 1)
        return setTimeAgo(Math.floor(interval) + " นาทีที่แล้ว");
      return setTimeAgo(Math.floor(seconds) + " วินาทีที่แล้ว");
    };

    updateTimeAgo();
    const timer = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(timer);
  }, [date]);

  return <span className="text-sm text-gray-400">{timeAgo}</span>;
}

export default function NFTForum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "นักสำรวจจักรวาล #42",
      content: "การเดินทางผ่านจักรวาลดิจิทัลที่เต็มไปด้วยจินตนาการ",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 2,
      title: "ฝันแห่งนีออน #007",
      content: "เมืองที่เต็มไปด้วยสีสันและพลังงานจากฝันในโลกดิจิทัล",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: 3,
      title: "ปากกาแห่งควอนตัม #13",
      content: "จุดบรรจบของเทคโนโลยีและศิลปะที่แสดงถึงนวัตกรรม",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 259200000),
    },
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, imageFile: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content && newPost.imageFile) {
      const newPostWithId = {
        ...newPost,
        id: posts.length + 1,
        createdAt: new Date(),
        imageUrl: imagePreview, // Use the preview URL as the image source
      };
      setPosts([newPostWithId, ...posts]);
      setNewPost({ title: "", content: "", imageFile: null });
      setImagePreview("");
      setIsDialogOpen(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
  });

  return (
    <section className="relative py-24 overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          ฟอรั่ม NFT
        </h1>

        <div className="flex justify-between items-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2dac5c] text-white hover:bg-[#249652]">
                สร้างโพสต์ใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border border-gray-800">
              <DialogHeader>
                <DialogTitle>สร้างโพสต์ใหม่</DialogTitle>
                <DialogDescription>
                  แบ่งปันผลงาน NFT ล่าสุดของคุณกับชุมชน
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="หัวข้อ"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Textarea
                  placeholder="เนื้อหา"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-gray-800 border-gray-700 text-white"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg mt-4"
                  />
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#2dac5c] text-white hover:bg-[#249652]"
                >
                  โพสต์
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="เรียงลำดับ" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="newest">ใหม่ที่สุด</SelectItem>
              <SelectItem value="oldest">เก่าสุด</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800"
            >
              <div className="relative h-64">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
                  <TimeAgo date={post.createdAt} />
                  <button className="bg-[#2dac5c] text-white py-1 px-3 rounded-md font-semibold text-sm uppercase tracking-wide">
                    แสดงความคิดเห็น
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
