"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Car, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface HeaderProps {
  onMenuClick: () => void;
  cartItemCount: number;
}

export function Header({ onMenuClick, cartItemCount }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 bg-bg-panel/80 backdrop-blur-xl border-b border-border-dim">
      <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-heading hidden sm:block">
            AutoParts<span className="text-accent">Pro</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div
            className={cn(
              "relative flex items-center rounded-lg border transition-all",
              searchFocused
                ? "border-accent bg-bg-elevated shadow-glow"
                : "border-border-default bg-bg-card hover:border-border-bright"
            )}
          >
            <Search className="w-4 h-4 text-text-tertiary absolute left-3" />
            <input
              type="text"
              placeholder="Search parts, brands, or part numbers..."
              className="w-full h-10 pl-10 pr-4 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors hidden sm:flex"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* User */}
          <button
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors hidden sm:flex"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="secondary" size="sm" className="relative">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
