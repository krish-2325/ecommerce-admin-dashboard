"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  function toggleSidebar() {
    setSidebarCollapsed((prev) => !prev);
  }

  return (
    <UIContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside UIProvider");
  return ctx;
}
