import ProductDetail from "@/components/Artworks/ArtworkDetail";
import { auth } from "@clerk/nextjs/server";

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
