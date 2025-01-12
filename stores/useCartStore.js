import { create } from "zustand";

const useCartStore = create((set) => ({
  // ตั้งค่าเริ่มต้น cartCount เป็น 0 และดึงค่าจาก localStorage ถ้ามี
  cartCount:
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("cartCount")) || 0
      : 0,

  // อัปเดต cartCount และ localStorage
  updateCartCount: (count) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCount", count);
    }
    set({ cartCount: count });
  },

  // ลด cartCount ลง 1 และอัปเดต localStorage
  decrementCartCount: () => {
    set((state) => {
      const newCount = state.cartCount - 1;
      if (typeof window !== "undefined") {
        localStorage.setItem("cartCount", newCount);
      }
      return { cartCount: newCount };
    });
  },

  // ตั้งค่า cartCount ใหม่และอัปเดต localStorage
  setCartCount: (count) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cartCount", count);
    }
    set({ cartCount: count });
  },

  // ดึง cartCount จาก API และอัปเดต localStorage
  fetchCartCount: async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart count");
      }
      const data = await response.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("cartCount", data.totalItems);
      }
      set({ cartCount: data.totalItems });
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  },
}));

export default useCartStore;
