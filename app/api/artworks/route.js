import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const artworks = await prisma.artworks.findMany({
      include: {
        users: true,
        categories: true,
      },
    });
    return Response.json(artworks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch artworks" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const artwork = await prisma.artworks.create({
      data: body,
    });
    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
