"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/components/ui/UIContext";

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Products", href: "/products", icon: "📦" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUI();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white flex flex-col transition-all duration-300
        ${sidebarCollapsed ? "w-20" : "w-64"}`}
    >
      {/* BRAND */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
            E
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold">Admin Panel</span>
          )}
        </div>

        {/* TOGGLE */}
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white text-lg"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          © {new Date().getFullYear()} E-commerce Admin
        </div>
      )}
    </aside>
  );
}
