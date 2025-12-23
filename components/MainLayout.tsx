"use client";

import { useUI } from "@/components/ui/UIContext";
import Navbar from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useUI();

  return (
    <div
      className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "ml-20" : "ml-64"
      }`}
    >
      {/* NAVBAR */}
      <header className="sticky top-0 z-30">
        <Navbar />
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
