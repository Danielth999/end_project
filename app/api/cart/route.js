import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, artworkId, quantity } = await request.json();

    // Ensure required fields are provided
    if (!userId || !artworkId || quantity == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create the user's cart
    let userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) {
      userCart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Upsert the cart item
    await prisma.cartItem.upsert({
      where: {
        cartId_artworkId: {
          cartId: userCart.id,
          artworkId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: userCart.id,
        artworkId,
        quantity,
      },
    });

    return NextResponse.json({ message: "Item added to cart successfully." });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart." },
      { status: 500 }
    );
  }
}
