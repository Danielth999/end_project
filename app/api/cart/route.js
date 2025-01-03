import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ดึงข้อมูลจาก body ของคำขอ

    const { artworkId, quantity } = req.json();

    if (!artworkId || !quantity || quantity <= 0) {
      return Response.json(
        { message: "Invalid input. Provide artworkId and quantity > 0." },
        { status: 400 }
      );
    }

    // ค้นหาตะกร้าของผู้ใช้
    let cart = await prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: userId,
        },
      });
    }

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        artwork_id: artworkId,
      },
    });

    if (existingItem) {
      await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          artwork_id: artworkId,
          quantity,
        },
      });
    }

    return Response.json(
      { message: "Item added to cart successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json(
      { message: "Failed to add item to cart", error: error.message },
      { status: 500 }
    );
  }
}
