import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";

export default function WalletCard({ balance }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden mb-6"
    >
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white"> Wallet ของคุณ</h2>
          <CreditCard className="text-white" size={24} />
        </div>
        <p className="text-sm text-purple-200">ยอดคงเหลือปัจจุบัน</p>
        <p className="text-4xl font-bold text-white">
          {parseFloat(balance).toFixed(2)} BTH
          
        </p>
      </div>
    </motion.div>
  );
}
