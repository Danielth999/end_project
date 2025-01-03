import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const {id} = params;
  try {
    const artworks = await prisma.artworks.findUnique({
      where: { id: id },
      include: { categories: true, users: true, artwork_types: true },
    });

    if (!artworks) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(artworks, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
