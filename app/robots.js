export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/artworks/", "/auctions/", "/"],
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://www.artspaceth.online/sitemap.xml",
  };
}
