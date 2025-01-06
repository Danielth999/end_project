import { auth } from "@clerk/nextjs/server";
import OrderContainer from "./components/OrderContainer";

export default async function OrderPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center text-white">
        Please log in to view your order.
      </div>
    );
  }

  return <OrderContainer userId={userId} />;
}
