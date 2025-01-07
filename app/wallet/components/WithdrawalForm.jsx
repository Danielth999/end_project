import { useState } from "react";
import { motion } from "framer-motion";

export default function WithdrawalForm({ onWithdraw, onCancel, maxAmount }) {
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",  // เพิ่มฟิลด์ accountName
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const withdrawalAmount = parseFloat(formData.amount);
    if (withdrawalAmount > 0 && withdrawalAmount <= maxAmount) {
      onWithdraw(formData);  // ส่งข้อมูลทั้งหมด
    } else {
      alert("Invalid withdrawal amount");
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">ถอนเงิน</h3>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          จำนวนเงินที่ต้องการถอน
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          min="0.01"
          max={maxAmount}
          step="0.01"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label
          htmlFor="bankName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ชื่อธนาคาร
        </label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          value={formData.bankName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label
          htmlFor="accountNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          เลขบัญชี
        </label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={formData.accountNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label
          htmlFor="accountName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          ชื่อเจ้าของบัญชี
        </label>
        <input
          id="accountName"
          name="accountName"
          type="text"
          value={formData.accountName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          ยืนยันการถอนเงิน
        </button>
      </div>
    </motion.form>
  );
}