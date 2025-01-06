import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const { userId } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          CartItems: {
            include: {
              Artwork: {
                select: {
                  id: true,
                  price: true,
                  imageUrl: true,
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!cart || cart.CartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const totalPrice = cart.CartItems.reduce(
        (sum, item) => sum.add(item.Artwork.price.mul(new Prisma.Decimal(item.quantity))),
        new Prisma.Decimal(0)
      );

      const buyer = await tx.user.findUnique({
        where: { id: userId },
        select: { walletBalance: true },
      });

      if (buyer.walletBalance.lessThan(totalPrice)) {
        throw new Error('Insufficient funds');
      }

      const sellerTransfers = new Map();

      cart.CartItems.forEach((item) => {
        const sellerId = item.Artwork.userId;
        const amount = item.Artwork.price.mul(new Prisma.Decimal(item.quantity));
        
        if (sellerTransfers.has(sellerId)) {
          sellerTransfers.set(sellerId, sellerTransfers.get(sellerId).add(amount));
        } else {
          sellerTransfers.set(sellerId, amount);
        }
      });

      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: totalPrice } },
      });

      for (const [sellerId, amount] of sellerTransfers) {
        await tx.user.update({
          where: { id: sellerId },
          data: { 
            walletBalance: { increment: amount },
            salesCount: { increment: 1 }
          },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          OrderItems: {
            createMany: {
              data: cart.CartItems.map((item) => ({
                artworkId: item.Artwork.id,
                price: item.Artwork.price,
                quantity: item.quantity,
              })),
            },
          },
        },
      });

      await tx.history.createMany({
        data: cart.CartItems.map((item) => ({
          userId,
          actionType: 'PURCHASE',
          artworkId: item.Artwork.id,
          amount: item.Artwork.price.mul(new Prisma.Decimal(item.quantity)),
          downloadUrl: item.Artwork.imageUrl,
        })),
      });

      await tx.history.createMany({
        data: Array.from(sellerTransfers).map(([sellerId, amount]) => ({
          userId: sellerId,
          actionType: 'SALE',
          amount,
        })),
      });

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return { order, totalPrice };
    }, {
      timeout: 15000,
      maxWait: 5000,
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

