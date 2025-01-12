/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "qtwseyjmrxlktgaecvbh.supabase.co", // Add Supabase hostname
        pathname: "/**", // Allow all paths under Supabase hostname
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // เพิ่ม hostname ของ Cloudinary
        pathname: "/**", // อนุญาตให้ใช้ทุก path ภายใต้ hostname นี้
      },
    ],
  },
};

export default nextConfig;
