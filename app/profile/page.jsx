import Profile from "./components/Profile";
import { auth } from "@clerk/nextjs/server";

const profilePage = async () => {
  const { userId } = await auth();

  try {
    const [userRes, statsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
        next: { revalidate: 60 }, // Cache user data for 60 seconds
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworkStats/${userId}`, {
        next: { revalidate: 300 }, // Cache stats data for 300 seconds
      }),
    ]);

    if (!userRes.ok || !statsRes.ok) {
      throw new Error("Failed to fetch user or stats data");
    }

    const user = await userRes.json();
    const stats = await statsRes.json();

    return <Profile user={user} stats={stats} />;
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-center text-xl font-bold">
          ไม่สามารถโหลดข้อมูลผู้ใช้งานได้ในขณะนี้
        </p>
      </div>
    );
  }
};

export default profilePage;
