import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id: userId } = params;
  try {
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const cartItems = await prisma.CartItem.findMany({
      where: {
        Cart: {
          userId,
        },
      },
      include: {
        Artwork: true, // Fetch associated artwork details
      },
    });

    // Calculate the total count of items in the cart (ไม่รวม quantity)
    const totalItems = cartItems.length; // ใช้ length เพื่อนับจำนวนรายการ

    // Return both cart items and the total count
    return NextResponse.json({ cartItems, totalItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}
// put
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const { quantity } = await req.json();
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error("Error updating quantity:", error);
    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}

// delete
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
