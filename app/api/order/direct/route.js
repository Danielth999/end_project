// pages/api/order/direct.js
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId, artworkId, quantity } = await req.json();

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // ค้นหา artwork ที่ต้องการซื้อ
        const artwork = await tx.artwork.findUnique({
          where: { id: artworkId },
          select: {
            id: true,
            price: true,
            imageUrl: true,
            userId: true, // userId ของผู้ขาย
          },
        });

        if (!artwork) {
          throw new Error("Artwork not found");
        }

        // คำนวณ totalPrice
        const totalPrice = artwork.price.mul(new Prisma.Decimal(quantity));

        // ค้นหาข้อมูลผู้ซื้อ (buyer) เพื่อตรวจสอบยอดเงินใน wallet
        const buyer = await tx.user.findUnique({
          where: { id: userId },
          select: { walletBalance: true },
        });

        // ตรวจสอบว่ายอดเงินใน wallet ของผู้ซื้อเพียงพอหรือไม่
        if (buyer.walletBalance.lessThan(totalPrice)) {
          throw new Error("ยอดเงินใน wallet ไม่เพียงพอ");
        }

        // ลดยอดเงินใน wallet ของผู้ซื้อ
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { decrement: totalPrice } },
        });

        // เพิ่มยอดเงินให้ผู้ขายและเพิ่มจำนวน salesCount
        await tx.user.update({
          where: { id: artwork.userId },
          data: {
            walletBalance: { increment: totalPrice },
            salesCount: { increment: 1 },
          },
        });

        // สร้าง order ใหม่
        const order = await tx.order.create({
          data: {
            userId,
            totalPrice,
            OrderItems: {
              create: {
                artworkId: artwork.id,
                price: artwork.price,
                quantity,
              },
            },
          },
        });

        // บันทึกประวัติการซื้อ (History) สำหรับผู้ซื้อ
        await tx.history.create({
          data: {
            userId,
            actionType: "PURCHASE",
            artworkId: artwork.id,
            amount: totalPrice,
            downloadUrl: artwork.imageUrl,
          },
        });

        // บันทึกประวัติการขาย (History) สำหรับผู้ขาย
        await tx.history.create({
          data: {
            userId: artwork.userId,
            actionType: "SALE",
            artworkId: artwork.id,
            amount: totalPrice,
          },
        });

        return { order, totalPrice };
      },
      {
        timeout: 15000,
        maxWait: 5000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing direct order:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
