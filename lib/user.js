import { prisma } from "./prisma";

export async function getUserWalletBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletBalance: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return parseFloat(user.walletBalance.toString());
}
