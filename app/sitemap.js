export default async function sitemap() {
  // Fetch artworks for dynamic routes
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`);
  const artworks = await res.json();

  const artworkUrls = artworks.map((artwork) => ({
    url: `https://www.artspaceth.online/artworks/${artwork.id}`,
    lastModified: new Date(artwork.updatedAt || artwork.createdAt),
  }));

  return [
    {
      url: "https://www.artspaceth.online",
      lastModified: new Date(),
    },
    {
      url: "https://www.artspaceth.online/artworks",
      lastModified: new Date(),
    },
    {
      url: "https://www.artspaceth.online/auctions",
      lastModified: new Date(),
    },
    ...artworkUrls,
  ];
}
