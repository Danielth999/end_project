"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Check, X, Edit, Trash } from "lucide-react"
import { updateTransactionStatus, deleteTransaction } from "../actions"

export default function Transactions({ initialWithdrawals, refetchWithdrawals }) {
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals || [])
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    if (initialWithdrawals) {
      setWithdrawals(initialWithdrawals)
    }
  }, [initialWithdrawals])

  const handleUpdateStatus = async (id, status) => {
    const result = await updateTransactionStatus(id, status);
    if (result.success) {
      refetchWithdrawals(); // ดึงข้อมูลใหม่ทันที
    } else {
      alert(result.message);
    }
  };
  
  const handleDeleteTransaction = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
      const result = await deleteTransaction(id);
      if (result.success) {
        refetchWithdrawals(); // ดึงข้อมูลใหม่หลังจากลบ
      } else {
        alert(result.message);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const result = await updateTransactionStatus(editingTransaction.id, editingTransaction.status)
    if (result.success) {
      setEditingTransaction(null)
      refetchWithdrawals()
    } else {
      alert(result.message)
    }
  }

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearchQuery = withdrawal.User?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               withdrawal.BankAccount?.bankName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               withdrawal.BankAccount?.accountNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               withdrawal.BankAccount?.accountName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || withdrawal.status === filterStatus

    return matchesSearchQuery && matchesStatus
  })

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">คำขอถอนเงิน</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2 w-full max-w-md">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาคำขอถอนเงิน..."
              className="bg-transparent border-none focus:outline-none text-gray-100 px-3 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select 
              className="bg-gray-700 text-gray-100 rounded-lg px-3 py-2 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="PENDING">รอดำเนินการ</option>
              <option value="COMPLETED">สำเร็จ</option>
              <option value="FAILED">ล้มเหลว</option>
              <option value="CANCELLED">ยกเลิก</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-300">ID</th>
                <th className="py-3 px-4 text-left text-gray-300">ผู้ใช้</th>
                <th className="py-3 px-4 text-left text-gray-300">จำนวนเงิน</th>
                <th className="py-3 px-4 text-left text-gray-300">ชื่อธนาคาร</th>
                <th className="py-3 px-4 text-left text-gray-300">เลขบัญชี</th>
                <th className="py-3 px-4 text-left text-gray-300">ชื่อบัญชี</th>
                <th className="py-3 px-4 text-left text-gray-300">สถานะ</th>
                <th className="py-3 px-4 text-left text-gray-300">วันที่</th>
                <th className="py-3 px-4 text-left text-gray-300">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-3 px-4">{withdrawal.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4">{withdrawal.User?.email || "ไม่ทราบ"}</td>
                  <td className="py-3 px-4">{Number(withdrawal.amount).toFixed(2)} บาท</td>
                  <td className="py-3 px-4">{withdrawal.BankAccount?.bankName || "N/A"}</td>
                  <td className="py-3 px-4">{withdrawal.BankAccount?.accountNumber || "N/A"}</td>
                  <td className="py-3 px-4">{withdrawal.BankAccount?.accountName || "N/A"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : withdrawal.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : withdrawal.status === "FAILED"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {withdrawal.status === "COMPLETED"
                        ? "สำเร็จ"
                        : withdrawal.status === "PENDING"
                          ? "รอดำเนินการ"
                          : withdrawal.status === "FAILED"
                            ? "ล้มเหลว"
                            : "ยกเลิก"}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(withdrawal.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    {withdrawal.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(withdrawal.id, "COMPLETED")}
                          className="text-green-400 hover:text-green-300 mr-2"
                          title="ทำเครื่องหมายว่าสำเร็จ"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(withdrawal.id, "FAILED")}
                          className="text-red-400 hover:text-red-300 mr-2"
                          title="ทำเครื่องหมายว่าล้มเหลว"
                        >
                          <X size={20} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setEditingTransaction(withdrawal)}
                      className="text-blue-400 hover:text-blue-300 mr-2"
                      title="แก้ไข"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(withdrawal.id)}
                      className="text-red-400 hover:text-red-300"
                      title="ลบ"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">แก้ไขรายการ</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">จำนวนเงิน</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      amount: Number.parseFloat(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">สถานะ</label>
                <select
                  value={editingTransaction.status}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      status: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                >
                  <option value="PENDING">รอดำเนินการ</option>
                  <option value="COMPLETED">สำเร็จ</option>
                  <option value="FAILED">ล้มเหลว</option>
                  <option value="CANCELLED">ยกเลิก</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTransaction(null)}
                  className="bg-gray-600 px-4 py-2 rounded"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="bg-purple-600 px-4 py-2 rounded">
                  บันทึกการเปลี่ยนแปลง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}