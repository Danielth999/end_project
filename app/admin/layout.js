import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { UserCircle, PaintbrushIcon as PaintBrush, CreditCard, LayoutDashboard, History, ShoppingCart, Settings } from 'lucide-react';

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/users", icon: UserCircle, label: "Users" },
  { href: "/admin/artworks", icon: PaintBrush, label: "Artworks" },
  { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
  
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900">
      <aside className="w-64 bg-gray-800">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-green-400">ART SPACE Admin</h1>
        </div>
        <nav className="mt-5">
          {menuItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center py-3 px-4 text-gray-300 hover:bg-gray-700 hover:text-purple-400 transition-colors"
            >
              <Icon className="mr-3" size={20} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-400">Dashboard</h2>
          <UserButton />
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

