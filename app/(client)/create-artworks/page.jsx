import CreateForm from "./components/CreateForm";
import { auth } from "@clerk/nextjs/server";

export default async function CreateNftsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return (
    <div >
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 text-white">
            สร้างผลงานของคุณ
          </h1>
          <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
            เลือกวิธีการขายที่เหมาะกับคุณ - ขายในราคาคงที่หรือเปิดให้ประมูลเพื่อหาราคาที่ดีที่สุด
          </p>
          <CreateForm userId={userId} />
        </div>
      </div>
    </div>
  );
}

