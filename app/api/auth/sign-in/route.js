import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createClerkClient } from '@clerk/backend';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      );
    }

    // Check role from Clerk's publicMetadata
    let userRole = user.publicMetadata?.role;

    // If no role is set, default to 'USER'
    if (!userRole) {
      userRole = 'USER';

      // Update user's publicMetadata in Clerk
      await clerk.users.updateUser(user.id, {
        publicMetadata: {
          ...user.publicMetadata,
          role: userRole,
        },
      });
    }

    // Sync user data with Prisma
    let dbUser = await prisma.User.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      dbUser = await prisma.User.create({
        data: {
          id: user.id,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.emailAddresses[0]?.emailAddress ?? "",
          imageUrl: user.imageUrl ?? "",
          role: userRole,
        },
      });
    } else {
      dbUser = await prisma.User.update({
        where: { id: user.id },
        data: {
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          email: user.emailAddresses[0]?.emailAddress ?? "",
          imageUrl: user.imageUrl ?? "",
          role: userRole,
        },
      });
    }

    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") ?? "http";
    const homeUrl = `${protocol}://${host}/`;

    return NextResponse.redirect(homeUrl, { status: 302 });
  } catch (error) {
    console.error("Error occurred:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}