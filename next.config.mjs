/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allow loading images from img.clerk.com
        pathname: "/**", // Allow all paths of img.clerk.com
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // Allow loading images from plus.unsplash.com
        pathname: "/**", // Allow all paths of plus.unsplash.com
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Allow loading images from images.unsplash.com
        pathname: "/**", // Allow all paths of images.unsplash.com
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com", // Add source.unsplash.com here
        pathname: "/**", // Allow all paths of source.unsplash.com
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // Allow loading images from via.placeholder.com
        pathname: "/**", // Allow all paths of via.placeholder.com
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com", // Allow loading images from Facebook
        pathname: "/**", // Allow all paths of platform-lookaside.fbsbx.com
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Allow loading images from Google Photos
        pathname: "/**", // Allow all paths
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // Allow loading images from Pexels
        pathname: "/**", // Allow all paths of images.pexels.com
      },
    ],
  },
};

export default nextConfig;
