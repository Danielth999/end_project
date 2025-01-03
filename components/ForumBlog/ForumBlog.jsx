"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
      if (interval > 1)
        return setTimeAgo(Math.floor(interval) + " เดือนที่แล้ว");
      interval = seconds / 86400;
      if (interval > 1) return setTimeAgo(Math.floor(interval) + " วันที่แล้ว");
      interval = seconds / 3600;
      if (interval > 1)
        return setTimeAgo(Math.floor(interval) + " ชั่วโมงที่แล้ว");
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

function PostCard({ post }) {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
      <div className="relative h-64">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          sizes="100vw"
          priority
          className="  object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-full px-3 py-1 text-xs text-white">
          {post.type}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{post.content}</p>
        <div className="flex justify-between items-center">
          <TimeAgo date={post.createdAt} />
          <Button
            variant="outline"
            className="text-white border-white hover:bg-gray-800"
          >
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HomepagePosts() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      type: "ฟอรั่ม",
      title: "นักเดินทางจักรวาล #42",
      content: "การเดินทางผ่านจักรวาลดิจิทัล ถ่ายทอดผ่านพิกเซลและจินตนาการ.",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: 2,
      type: "บล็อก",
      title: "อนาคตของ NFTs ในโลกศิลปะ",
      content:
        "สำรวจว่า NFTs กำลังปฏิวัติวิธีการที่เราเข้าใจและแลกเปลี่ยนงานศิลปะดิจิทัลอย่างไร...",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      id: 3,
      type: "ฟอรั่ม",
      title: "ความฝันนีออน #007",
      content: "เมืองที่เต็มไปด้วยพลังงานจากความฝันดิจิทัลนับพัน.",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 259200000),
    },
    {
      id: 4,
      type: "บล็อก",
      title: "เทคโนโลยีบล็อกเชน: นอกเหนือจากคริปโตเคอเรนซี",
      content:
        "เจาะลึกการประยุกต์ใช้งานของเทคโนโลยีบล็อกเชนในอุตสาหกรรมต่าง ๆ...",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 345600000),
    },
    {
      id: 5,
      type: "ฟอรั่ม",
      title: "ขนนกควอนตัม #13",
      content:
        "ที่ที่เทคโนโลยีมาบรรจบกับศิลปะ แต่ละเส้นเป็นเครื่องยืนยันถึงนวัตกรรม.",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 432000000),
    },
    {
      id: 6,
      type: "บล็อก",
      title: "การเพิ่มขึ้นของการเงินแบบกระจายศูนย์ (DeFi)",
      content:
        "ตรวจสอบการเติบโตและผลกระทบที่เป็นไปได้ของ DeFi ต่อระบบการเงินแบบดั้งเดิม...",
      imageUrl: "/forum/2.webp",
      createdAt: new Date(Date.now() - 518400000),
    },
  ]);

  const [sortOrder, setSortOrder] = useState("newest");
  const [filter, setFilter] = useState("all");

  const sortedAndFilteredPosts = posts
    .filter((post) => filter === "all" || post.type.toLowerCase() === filter)
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

  return (
    <section className="relative pt-32 pb-24 overflow-hidden min-h-screen  ">
      <div className="absolute inset-0 " />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          โพสต์ล่าสุด
        </h2>

        <div className="flex justify-between items-center mb-8">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="กรองตาม" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="all">ทุกโพสต์</SelectItem>
              <SelectItem value="forum">โพสต์ฟอรั่ม</SelectItem>
              <SelectItem value="blog">โพสต์บล็อก</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="เรียงตาม" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="newest">ใหม่ล่าสุด</SelectItem>
              <SelectItem value="oldest">เก่าที่สุด</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedAndFilteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
