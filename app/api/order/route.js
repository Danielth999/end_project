import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  // ดึงข้อมูล userId จาก request body
  const { userId } = await req.json();

  try {
    // เริ่ม transaction เพื่อให้การทำงานเป็น atomic (ถ้าส่วนใดส่วนหนึ่งล้มเหลว จะ rollback ทั้งหมด)
    const result = await prisma.$transaction(
      async (tx) => {
        // ค้นหา cart ของผู้ใช้พร้อมกับข้อมูล CartItems และ Artwork ที่เกี่ยวข้อง
        const cart = await tx.cart.findUnique({
          where: { userId },
          include: {
            CartItems: {
              include: {
                Artwork: {
                  select: {
                    id: true, // artworkId
                    price: true, // ราคาของ artwork
                    imageUrl: true, // URL ของภาพ artwork
                    userId: true, // userId ของผู้ขาย
                  },
                },
              },
            },
          },
        });

        // ตรวจสอบว่ามี cart และมี CartItems หรือไม่
        if (!cart || cart.CartItems.length === 0) {
          throw new Error("ไม่พบสินค้าในตะกร้า");
        }

        // คำนวณ totalPrice โดยรวมราคาของทุก Artwork ใน CartItems
        const totalPrice = cart.CartItems.reduce(
          (sum, item) =>
            sum.add(item.Artwork.price.mul(new Prisma.Decimal(item.quantity))),
          new Prisma.Decimal(0)
        );

        // ค้นหาข้อมูลผู้ซื้อ (buyer) เพื่อตรวจสอบยอดเงินใน wallet
        const buyer = await tx.user.findUnique({
          where: { id: userId },
          select: { walletBalance: true },
        });

        // ตรวจสอบว่ายอดเงินใน wallet ของผู้ซื้อเพียงพอหรือไม่
        if (buyer.walletBalance.lessThan(totalPrice)) {
          throw new Error("ยอดเงินใน wallet ไม่เพียงพอ");
        }

        // สร้าง Map เพื่อเก็บยอดเงินที่ต้องโอนให้ผู้ขายแต่ละคน
        const sellerTransfers = new Map();

        // วนลูปผ่าน CartItems เพื่อคำนวณยอดเงินที่ต้องโอนให้ผู้ขายแต่ละคน
        cart.CartItems.forEach((item) => {
          const sellerId = item.Artwork.userId; // userId ของผู้ขาย
          const amount = item.Artwork.price.mul(
            new Prisma.Decimal(item.quantity)
          ); // ยอดเงินที่ต้องโอน

          // เพิ่มยอดเงินให้ผู้ขายใน Map
          if (sellerTransfers.has(sellerId)) {
            sellerTransfers.set(
              sellerId,
              sellerTransfers.get(sellerId).add(amount)
            );
          } else {
            sellerTransfers.set(sellerId, amount);
          }
        });

        // ลดยอดเงินใน wallet ของผู้ซื้อ
        await tx.user.update({
          where: { id: userId },
          data: { walletBalance: { decrement: totalPrice } },
        });

        // โอนเงินให้ผู้ขายแต่ละคนและเพิ่มจำนวน salesCount
        for (const [sellerId, amount] of sellerTransfers) {
          await tx.user.update({
            where: { id: sellerId },
            data: {
              walletBalance: { increment: amount }, // เพิ่มยอดเงินให้ผู้ขาย
              salesCount: { increment: 1 }, // เพิ่มจำนวนการขาย
            },
          });
        }

        // สร้าง order ใหม่
        const order = await tx.order.create({
          data: {
            userId,
            totalPrice,
            OrderItems: {
              createMany: {
                data: cart.CartItems.map((item) => ({
                  artworkId: item.Artwork.id, // ใช้ artworkId จาก Artwork
                  price: item.Artwork.price, // ราคาของ artwork
                  quantity: item.quantity, // จำนวนที่ซื้อ
                })),
              },
            },
          },
        });

        // บันทึกประวัติการซื้อ (History) สำหรับผู้ซื้อ
        await tx.history.createMany({
          data: cart.CartItems.map((item) => ({
            userId,
            actionType: "PURCHASE",
            artworkId: item.Artwork.id, // ใช้ artworkId จาก Artwork
            amount: item.Artwork.price.mul(new Prisma.Decimal(item.quantity)),
            downloadUrl: item.Artwork.imageUrl,
          })),
        });

        // บันทึกประวัติการขาย (History) สำหรับผู้ขาย
        await tx.history.createMany({
          data: Array.from(sellerTransfers).map(([sellerId, amount]) => {
            // หา CartItem ที่เกี่ยวข้องกับผู้ขาย (sellerId)
            const cartItem = cart.CartItems.find(
              (item) => item.Artwork.userId === sellerId
            );

            return {
              userId: sellerId,
              actionType: "SALE",
              artworkId: cartItem?.Artwork.id || null, // ใช้ artworkId จาก CartItem
              amount,
            };
          }),
        });

        // ลบ CartItems หลังจากสร้าง order เสร็จสิ้น
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        // ส่งคืน order และ totalPrice
        return { order, totalPrice };
      },
      {
        timeout: 15000, // ตั้งค่า timeout สำหรับ transaction
        maxWait: 5000, // ตั้งค่า maxWait สำหรับ transaction
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, // ตั้งค่า isolation level
      }
    );

    // ส่งคืนผลลัพธ์เป็น JSON
    return NextResponse.json(result);
  } catch (error) {
    // จัดการข้อผิดพลาดและส่งคืนข้อความ error
    console.error("Error processing order:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
