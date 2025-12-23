import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Sidebar from "@/components/Sidebar";
import MainLayout from "@/components/MainLayout";
import { UIProvider } from "@/components/ui/UIContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | E-commerce Admin",
  },
  description:
    "Professional server-rendered e-commerce admin dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        <UIProvider>
          <div className="flex min-h-screen">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN AREA */}
            <MainLayout>
              {children}
            </MainLayout>
          </div>
        </UIProvider>
      </body>
    </html>
  );
}
