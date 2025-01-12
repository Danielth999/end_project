import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const artworks = await prisma.Artwork.findUnique({
      where: { id: id },
      include: { Category: true, User: true, ArtworkType: true },
    });

    if (!artworks) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(artworks, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
export async function PUT(req, { params }) {
  const { id } = params;
  const { title, description, price } = await req.json();

  try {
    // อัปเดต Artwork
    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        title,
        description,
        price,
      },
    });

    return NextResponse.json(updatedArtwork, { status: 200 });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      { error: "Failed to update artwork" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // ลบ Artwork
    await prisma.artwork.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Artwork deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork" },
      { status: 500 }
    );
  }
}
