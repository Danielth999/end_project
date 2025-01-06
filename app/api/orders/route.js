// app/api/orders/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId, totalPrice, items } = await request.json();

    // สร้าง Order
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        OrderItems: {
          create: items.map((item) => ({
            artworkId: item.artworkId,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}