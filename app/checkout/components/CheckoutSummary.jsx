// app/checkout/components/CheckoutSummary.jsx
"use client";

export default function CheckoutSummary({ cartItems, totalPrice }) {
  return (
    <div className=" p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">สรุปสินค้า</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.Artwork.title}</p>
              <p className="text-sm text-gray-500">
                จำนวน: {item.quantity} ชิ้น
              </p>
            </div>
            <p className="font-semibold">
              ฿{(item.Artwork.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between">
          <p className="font-semibold">รวมทั้งหมด</p>
          <p className="font-bold text-lg">฿{totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
