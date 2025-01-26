import { Metadata } from "next";
import ProductDetail from "@/components/Artworks/ArtworkDetail";
import { auth } from "@clerk/nextjs/server";

// Generate dynamic metadata for each artwork
export async function generateMetadata({ params }) {
  const artwork = await fetchProduct(params.id);
  
  return {
    title: `${artwork.title} | ArtSpace`,
    description: artwork.description || 'ผลงานศิลปะดิจิทัลบน ArtSpace',
    openGraph: {
      title: `${artwork.title} | ArtSpace`,
      description: artwork.description,
      url: `https://www.artspaceth.online/artworks/${params.id}`,
      siteName: 'ArtSpace',
      images: [
        {
          url: artwork.imageUrl,
          width: 1200,
          height: 630,
          alt: artwork.title,
        },
      ],
      locale: 'th_TH',
      type: 'article',
      authors: artwork.User?.firstName,
    },
  };
}

async function fetchProduct(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function Page({ params }) {
  const {userId} = await auth();
  const { id } = params;
  const product = await fetchProduct(id);

  return (
    <>
      <ProductDetail artWorks={product} userId={userId} />
    </>
  );
}
