import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { id } = params; // Extract the 'id' from the URL parameters

  try {
    // Fetch the user data by ID
    const user = await prisma.user.findUnique({
      where: { id: String(id) }, // Ensure 'id' is a string
    });

    // If no user is found, return a 404 response
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user);
  } catch (error) {
    // Handle errors and return a 500 response
    return NextResponse.json(
      {
        error: "Error fetching user data",
        msg: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
