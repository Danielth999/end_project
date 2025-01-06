import CartContent from "./components/Cart";
import { auth } from "@clerk/nextjs/server";

const CartPage = async () => {
  const { userId } = await auth();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">ตะกร้าสินค้า</h1>
      <CartContent userId={userId} />
    </div>
  );
};

export default CartPage;
