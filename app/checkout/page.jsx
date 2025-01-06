// app/checkout/page.jsx
import CheckoutSummary from "./components/CheckoutSummary";
import PaymentForm from "./components/PaymentForm";

async function getCartItems(userId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch cart items");
  }
  return res.json();
}

export default async function CheckoutPage({ params }) {
  const { userId } = params; // รับ userId จาก params
  const cartData = await getCartItems(userId); // Fetch ข้อมูลตะกร้า

  // คำนวณราคารวม
  const totalPrice = cartData.cartItems.reduce(
    (sum, item) => sum + item.Artwork.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ส่งข้อมูลตะกร้าและราคารวมไปยัง CheckoutSummary */}
        <CheckoutSummary
          cartItems={cartData.cartItems}
          totalPrice={totalPrice}
        />

        {/* ส่งราคารวมไปยัง PaymentForm */}
        <PaymentForm totalPrice={totalPrice} />
      </div>
    </div>
  );
}
