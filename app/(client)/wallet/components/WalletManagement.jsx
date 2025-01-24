"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WalletCard from "./WalletCard";
import WalletActions from "./WalletActions";
import WithdrawalForm from "./WithdrawalForm";
import { toast } from "react-hot-toast";

export default function WalletManagement({ userId, initialBalance }) {
  const [balance, setBalance] = useState(initialBalance);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const router = useRouter();

  const handleTopUp = () => {
    router.push("/wallet-top-up");
  };

  const handleWithdrawal = async (formData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wallet/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: formData.amount,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const result = await response.json();
      setBalance(result.updatedUser.walletBalance);
      setShowWithdrawal(false);
      toast.success("Withdrawal successful");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <WalletCard balance={balance} />
      <WalletActions
        onTopUp={handleTopUp}
        onWithdraw={() => setShowWithdrawal(true)}
      />
      {showWithdrawal && (
        <WithdrawalForm
          onWithdraw={handleWithdrawal}
          onCancel={() => setShowWithdrawal(false)}
          maxAmount={balance}
        />
      )}
    </motion.div>
  );
}