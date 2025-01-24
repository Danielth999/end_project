import localFont from "next/font/local";
import "../globals.css";
import Provider from "@/components/Provider";
import NavMain from "@/components/Navbar/NavMain";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import Loading from "./loading";
import Footer from "@/components/Footer/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Art Space - ศิลปะและภาพวาดออนไลน์",
  description:
    "Art Space เว็บไซต์ขายภาพวาดออนไลน์ แหล่งรวมศิลปะจากศิลปินชื่อดังและศิลปินมือใหม่ ภาพวาดสวยๆ อนิเมะ การ์ตูน ภาพวาดดิจิทัล",
  keywords: [
    "ภาพวาด",
    "ศิลปะ",
    "ขายภาพวาดออนไลน์",
    "ตกแต่งบ้าน",
    "ศิลปิน , ภาพวาดสวยๆ",
    "ภาพวาดดิจิทัล , ภาพวาดอนิเมะ",
    "ภาพวาดการ์ตูน",
  ],
  openGraph: {
    title: "Art Space - ศิลปะและภาพวาดออนไลน์",
    description:
      "Art Space เว็บไซต์ขายภาพวาดออนไลน์ แหล่งรวมศิลปะจากศิลปินชื่อดังและศิลปินมือใหม่",
    images: [
      {
        url: "image/banner.webp", // เปลี่ยนเป็น URL ของรูปภาพที่คุณต้องการแสดงบนโซเชียลมีเดีย
        width: 1200,
        height: 630,
        alt: "Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Space - ศิลปะและภาพวาดออนไลน์",
    description:
      "Art Space เว็บไซต์ขายภาพวาดออนไลน์ แหล่งรวมศิลปะจากศิลปินชื่อดังและศิลปินมือใหม่",
    images: ["image/banner.webp"], // เปลี่ยนเป็น URL ของรูปภาพที่คุณต้องการแสดงบน Twitter
  },
  metadataBase: new URL("https://artspaceth.vercel.app"), // เปลี่ยนเป็นโดเมนของคุณ
  alternates: {
    canonical: "https://artspaceth.vercel.app", // เปลี่ยนเป็น path ของหน้าเว็บ
  },
  other: {
    "schema:WebSite": {
      "@context": "https://artspaceth.vercel.app",
      "@type": "WebSite",
      name: "Art Space",
      url: "https://artspaceth.vercel.app",
      description:
        "Art Space เว็บไซต์ขายภาพวาดออนไลน์ แหล่งรวมศิลปะจากศิลปินชื่อดังและศิลปินมือใหม่",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        className="scroll-smooth focus:scroll-auto"
        lang="en"
        suppressHydrationWarning
      >
        <head>
          <meta
            name="google-site-verification"
            content="lgf74pzOKh0EhgWQ6MQl0cgd8mfs4uN66G0mizGbO6A"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-gray-900 via-gray-800`}
        >
          <Provider>
            <div className="flex flex-col sm:flex-row min-h-screen">
              {/* Sidebar (สำหรับขนาดหน้าจอใหญ่) */}
              <div className="sm:flex hidden mr-10 sm:mx-4">
                <Sidebar />
              </div>
              {/* เนื้อหาหลัก */}
              <div className="flex-1 mx-auto w-full max-w-[1400px]">
                {/* Navbar */}
                <NavMain />
                {/* ส่วนของเนื้อหาหลัก */}
                <main className="mt-4 sm:mt-6">
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </main>
              </div>
            </div>
            <div className="mt-10">
              <Footer />
            </div>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
