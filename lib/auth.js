import { prisma } from "@/lib/prisma"; 
import { currentUser } from "@clerk/nextjs/server";
export async function getAuth() {
     const clerkUser = await currentUser();
     const user = await prisma.users.findUnique(
           {
           where: { clerk_id: clerkUser?.id },
           }
     )
     return user?.role_id || '2'
}
