"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Settings,
  HelpCircle,
  Disc,
  Cog,
  Zap,
  Filter,
  Thermometer,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Deals", href: "/deals", icon: Tag },
];

const CATEGORIES = [
  { label: "Brakes", href: "/category/brakes", icon: Disc },
  { label: "Engine Parts", href: "/category/engine", icon: Cog },
  { label: "Electrical", href: "/category/electrical", icon: Zap },
  { label: "Filters", href: "/category/filters", icon: Filter },
  { label: "Cooling", href: "/category/cooling", icon: Thermometer },
];

const FOOTER_ITEMS = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-bg-panel border-r border-border-dim transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="h-full flex flex-col p-4 overflow-y-auto">
          {/* Main nav */}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Categories */}
          <div className="mt-8">
            <h3 className="label-technical px-3 mb-3">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-accent-subtle text-accent"
                        : "text-text-tertiary hover:bg-bg-hover hover:text-text-secondary"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer nav */}
          <div className="border-t border-border-dim pt-4 space-y-1">
            {FOOTER_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-tertiary hover:bg-bg-hover hover:text-text-secondary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
