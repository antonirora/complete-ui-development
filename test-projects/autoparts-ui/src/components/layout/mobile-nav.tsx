"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Search, ShoppingCart, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  cartItemCount: number;
  onMenuClick: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Search", href: "/search", icon: Search },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Menu", href: "#", icon: Menu, isMenu: true },
];

export function MobileNav({ cartItemCount, onMenuClick }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-panel/95 backdrop-blur-xl border-t border-border-dim safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href && !item.isMenu;
          const isCart = item.href === "/cart";

          if (item.isMenu) {
            return (
              <button
                key="menu"
                onClick={onMenuClick}
                className="flex flex-col items-center justify-center gap-1 py-2 px-3 text-text-tertiary hover:text-text-secondary transition-colors"
                aria-label="Open menu"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors",
                isActive ? "text-accent" : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {isCart && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
