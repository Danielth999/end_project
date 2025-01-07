import { motion } from "framer-motion";
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function WalletActions({ onTopUp, onWithdraw }) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-500 text-white rounded-lg py-3 px-4 flex items-center justify-center"
        onClick={onTopUp}
      >
        <PlusCircle className="mr-2" size={20} />
        เติมเงิน
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-red-500 text-white rounded-lg py-3 px-4 flex items-center justify-center"
        onClick={onWithdraw}
      >
        <MinusCircle className="mr-2" size={20} />
        ถอนเงิน
      </motion.button>
    </div>
  );
}

