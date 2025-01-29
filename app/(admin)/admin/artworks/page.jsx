import { PrismaClient } from "@prisma/client";
import { ImagePlus, Search, Filter, DollarSign, Gavel } from "lucide-react";

const prisma = new PrismaClient();

export default async function ArtworksPage({ searchParams }) {
  const { search, category, type } = searchParams;

  const artworks = await prisma.artwork.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    where: {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      categoryId: category ? category : undefined,
      artworkTypeId: type ? type : undefined,
    },
    include: { User: true, Category: true, ArtworkType: true },
  });

  const categories = await prisma.category.findMany();
  const artworkTypes = await prisma.artworkType.findMany();

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">การจัดการผลงานศิลปะ</h1>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <ImagePlus size={20} />
          เพิ่มผลงานใหม่
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-wrap gap-4">
          <form className="flex items-center bg-gray-700 rounded-lg px-3 py-2 w-full max-w-md">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="ค้นหาผลงานศิลปะ..."
              className="bg-transparent border-none focus:outline-none text-gray-100 px-3 w-full"
              defaultValue={search}
            />
          </form>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                name="category"
                className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
                defaultValue={category}
              >
                <option value="">หมวดหมู่ทั้งหมด</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                name="type"
                className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
                defaultValue={type}
              >
                <option value="">ประเภททั้งหมด</option>
                {artworkTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              ค้นหา
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-300">ID</th>
                <th className="py-3 px-4 text-left text-gray-300">ชื่อผลงาน</th>
                <th className="py-3 px-4 text-left text-gray-300">ศิลปิน</th>
                <th className="py-3 px-4 text-left text-gray-300">หมวดหมู่</th>
                <th className="py-3 px-4 text-left text-gray-300">ประเภท</th>
                <th className="py-3 px-4 text-left text-gray-300">
                  ราคา/ราคาเริ่มต้น
                </th>
                <th className="py-3 px-4 text-left text-gray-300">สถานะ</th>
               
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr
                  key={artwork.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="py-3 px-4">{artwork.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4">{artwork.title}</td>
                  <td className="py-3 px-4">
                    {artwork.User?.email || "ไม่ทราบ"}
                  </td>
                  <td className="py-3 px-4">
                    {artwork.Category?.name || "ไม่มีหมวดหมู่"}
                  </td>
                  <td className="py-3 px-4">
                    {artwork.ArtworkType?.name || "ไม่ทราบ"}
                  </td>
                  <td className="py-3 px-4">
                    {artwork.price ? (
                      <span className="flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        {artwork.price.toFixed(2)}
                      </span>
                    ) : artwork.auctionStartPrice ? (
                      <span className="flex items-center">
                        <Gavel size={16} className="mr-1" />
                        {artwork.auctionStartPrice.toFixed(2)}
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        artwork.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-400"
                          : artwork.status === "AUCTION_ENDED"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : artwork.status === "SOLD"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {artwork.status === "ACTIVE"
                        ? "ประกาศขาย"
                        : artwork.status === "AUCTION_ENDED"
                        ? "ประมูลสิ้นสุด"
                        : artwork.status === "SOLD"
                        ? "ขายแล้ว"
                        : "ไม่ทราบสถานะ"}
                    </span>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}