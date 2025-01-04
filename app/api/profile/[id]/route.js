import { prisma } from "@/lib/prisma"; // Prisma Client
import { NextResponse } from "next/server";

// Get profile by user ID
export async function GET(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch profile data from Prisma
    const profile = await prisma.Profile.findUnique({
      where: {
        userId: id,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// Update profile by user ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json(); // Extract body data
    const updatedProfile = await prisma.Profile.update({
      where: {
        userId: id,
      },
      data: {
        ...body, // Update fields sent in the request body
      },
    });

    if (!updatedProfile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// Delete profile by user ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedProfile = await prisma.Profile.delete({
      where: {
        userId: id,
      },
    });

    if (!deletedProfile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    return NextResponse.json(deletedProfile);
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
