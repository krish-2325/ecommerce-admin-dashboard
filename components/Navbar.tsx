"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  /* Sync theme */
  useEffect(() => {
    const saved = localStorage.getItem("admin-dark") === "true";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("admin-dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
          E
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            E-commerce Admin
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Product Management Dashboard
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Theme toggle always allowed */}
        <button
          onClick={toggleTheme}
          className="border rounded-md px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* ONLY show user + logout when NOT on login page */}
        {!isLoginPage && (
          <>
            <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
              A
            </div>

            <button
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
