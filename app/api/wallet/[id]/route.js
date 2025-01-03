import { prisma } from "@/lib/prisma"; // Prisma Client

import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { id } = params; // Extract transaction ID from params
    const { amount } = await req.json(); // Parse the request body to get the amount

    // If no user ID is provided, return an error response
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the user's wallet balance in the database
    const updatedWallet = await prisma.User.update({
      where: { id },
      data: {
        walletBalance: {
          increment: amount, // Increment the wallet balance by the given amount
        },
      },
    });

    // Return the updated wallet data as a response
    return NextResponse.json(updatedWallet);
  } catch (error) {
    // Log and return an error response in case of failure
    console.error("Error updating wallet:", error);
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }
}
