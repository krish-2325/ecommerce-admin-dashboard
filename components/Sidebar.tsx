import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="p-4 space-y-4">
        <Link href="/" className="block hover:text-gray-300">
          Dashboard
        </Link>

        <Link href="/products" className="block hover:text-gray-300">
          Products
        </Link>
      </nav>
    </aside>
  );
}
