import { PrismaClient } from '@prisma/client';
import { UserPlus, Search } from 'lucide-react';

const prisma = new PrismaClient();

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">การจัดการผู้ใช้</h1>
        <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={20} />
          เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2 w-full max-w-md">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้..."
              className="bg-transparent border-none focus:outline-none text-gray-100 px-3 w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-300">ID</th>
                <th className="py-3 px-4 text-left text-gray-300">อีเมล</th>
                <th className="py-3 px-4 text-left text-gray-300">ชื่อ</th>
                <th className="py-3 px-4 text-left text-gray-300">บทบาท</th>
                <th className="py-3 px-4 text-left text-gray-300">ยอดเงิน</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{`${user.firstName || ''} ${user.lastName || ''}`}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/20 text-purple-400'
                        : user.role === 'ARTIST'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {user.role === 'ADMIN' 
                        ? 'ผู้ดูแลระบบ' 
                        : user.role === 'ARTIST' 
                        ? 'ศิลปิน' 
                        : 'ผู้ใช้'}
                    </span>
                  </td>
                  <td className="py-3 px-4">{Number(user.walletBalance).toFixed(2)} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}