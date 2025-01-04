// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const cartItems = await prisma.cart_items.findMany({
//       where: {
//         cart_id: params.id,
//       },
//       include: {
//         artworks: true,
//       },
//     });
//     return NextResponse.json(cartItems);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch cart items" },
//       { status: 500 }
//     );
//   }
// }
