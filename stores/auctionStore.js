// import { create } from "zustand";
// import useSWR, { mutate } from "swr";
// import axios from "axios";
// import toast from "react-hot-toast";
// import fetcher from "@/lib/fetcher";

// const useAuctionStore = create((set, get) => ({
//   auctionNFTs: [],
//   sortOrder: "endingSoon",
//   isLoading: false,
//   error: null,

//   // ใช้ SWR เพื่อดึงข้อมูล auction
//   useFetchAuctionNFTs: () => {
//     const { data, error, isLoading } = useSWR(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/auctions`,
//       fetcher,
//       {
//         refreshInterval: 5000, // รีเฟรชข้อมูลทุก 5 วินาที
//         onSuccess: (data) => {
//           set({ auctionNFTs: data, isLoading: false, error: null });
//         },
//         onError: (error) => {
//           set({ error: error.message, isLoading: false });
//           toast.error("Failed to fetch auctions");
//         },
//       }
//     );

//     return { data, error, isLoading };
//   },

//   // อัปเดตการประมูล
//   updateAuction: (updatedAuction) => {
//     set((state) => ({
//       auctionNFTs: state.auctionNFTs.map((auction) =>
//         auction.id === updatedAuction.id
//           ? { ...auction, ...updatedAuction }
//           : auction
//       ),
//     }));
//   },

//   // จัดการการเสนอราคา
//   handleBid: async (artworkId, userId, amount) => {
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/bids`,
//         { artworkId, userId, amount }
//       );

//       if (response.status === 200) {
//         // อัปเดตข้อมูลโดยใช้ mutate ของ SWR
//         mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`);
//         toast.success("เสนอราคาสำเร็จ!");
//       }
//     } catch (error) {
//       console.error("Error placing bid:", error);
//       toast.error(
//         error.response?.data?.message || "เกิดข้อผิดพลาดในการเสนอราคา"
//       );
//     }
//   },

//   // เรียงลำดับ auction
//   setSortOrder: (order) => {
//     set({ sortOrder: order });
//   },

//   // ลบ auction เมื่อหมดเวลา
//   removeAuction: (artworkId) => {
//     set((state) => ({
//       auctionNFTs: state.auctionNFTs.filter(
//         (auction) => auction.id !== artworkId
//       ),
//     }));
//   },
// }));

// export default useAuctionStore;
