"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { useCart } from "@/stores/cart-store";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-bg-deep">
      <Header onMenuClick={toggleSidebar} cartItemCount={cartItemCount} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav cartItemCount={cartItemCount} onMenuClick={toggleSidebar} />
    </div>
  );
}
