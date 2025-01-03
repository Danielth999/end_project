"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

function BlogPost({ post }) {
  return (
    <article className="bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 mb-8">
      <div className="relative h-64">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          sizes="100vw"
          priority
          className="  object-cover rounded-lg"
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-2">{post.title}</h2>
        <p className="text-gray-300 mb-4">{post.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{post.date}</span>
          <Button
            variant="outline"
            className="text-white border-white hover:bg-gray-800"
          >
            อ่านเพิ่มเติม
          </Button>
        </div>
      </div>
    </article>
  );
}

export default function AdminBlog() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "อนาคตของ NFT ในโลกศิลปะ",
      content:
        "สำรวจวิธีที่ NFT กำลังเปลี่ยนแปลงการรับรู้และการซื้อขายศิลปะดิจิทัล...",
      imageUrl: "/forum/2.webp",
      date: "15 มิถุนายน 2023",
    },
    {
      id: 2,
      title: "เทคโนโลยีบล็อกเชน: มากกว่าแค่สกุลเงินดิจิทัล",
      content: "การประยุกต์ใช้เทคโนโลยีบล็อกเชนในหลากหลายอุตสาหกรรม...",
      imageUrl: "/forum/2.webp",
      date: "10 มิถุนายน 2023",
    },
    {
      id: 3,
      title: "การเติบโตของการเงินแบบกระจายศูนย์ (DeFi)",
      content:
        "วิเคราะห์การเติบโตและผลกระทบที่อาจเกิดขึ้นของ DeFi ต่อระบบการเงินแบบดั้งเดิม...",
      imageUrl: "/forum/2.webp",
      date: "5 มิถุนายน 2023",
    },
  ]);

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
      setPosts([
        {
          ...newPost,
          id: posts.length + 1,
          imageUrl: imagePreview,
          date: new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        ...posts,
      ]);
      setNewPost({ title: "", content: "", imageFile: null });
      setImagePreview("");
      setIsDialogOpen(false);
    }
  };

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "a-z":
        return a.title.localeCompare(b.title);
      case "z-a":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <section className="relative py-24 overflow-hidden min-h-screen">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-white mb-12 text-center">
          ข่าวสาร Blockchain & NFT
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Switch
              id="admin-mode"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
            <label htmlFor="admin-mode" className="text-white">
              โหมดผู้ดูแล
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[180px] bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="เรียงลำดับ" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="newest">ใหม่ที่สุด</SelectItem>
                <SelectItem value="oldest">เก่าสุด</SelectItem>
                <SelectItem value="a-z">เรียงตามชื่อ A-Z</SelectItem>
                <SelectItem value="z-a">เรียงตามชื่อ Z-A</SelectItem>
              </SelectContent>
            </Select>

            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#2dac5c] text-white hover:bg-[#249652]">
                    สร้างโพสต์ใหม่
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border border-gray-800">
                  <DialogHeader>
                    <DialogTitle>สร้างโพสต์บล็อกใหม่</DialogTitle>
                    <DialogDescription>
                      แบ่งปันข่าวสารและข้อมูลเชิงลึกล่าสุดเกี่ยวกับ Blockchain
                      และ NFT
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
                      เผยแพร่โพสต์
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {sortedPosts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
