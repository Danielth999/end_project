import ProductsCard from "./ProductsCard";
async function fetchProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artworks`);
  return res.json();
}

const ProductsContainer = async () => {
  const data = await fetchProducts();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-2xl font-bold ">
          ภาพศิลปะทั้งหมด (จำนวน {data.length} ภาพ)
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <ProductsCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default ProductsContainer;
