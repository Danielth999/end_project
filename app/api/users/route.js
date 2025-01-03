import {  NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
    try {
        const users = await prisma.users.findMany();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Error", msg: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
