import ProductDetail from "../components/ProductDetail";

async function fetchProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function Page({ params }) {
  const { id } = params;
  const product = await fetchProduct(id);

  return (
    <>
  
      <ProductDetail artWorks={product} />
      
    </>
  );
}
