"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          // Variants
          variant === "primary" && [
            "bg-accent text-white",
            "hover:bg-accent-hover active:scale-[0.98]",
          ],
          variant === "secondary" && [
            "bg-bg-elevated text-text-primary border border-border-default",
            "hover:bg-bg-hover hover:border-border-bright",
          ],
          variant === "ghost" && [
            "text-text-secondary",
            "hover:bg-bg-hover hover:text-text-primary",
          ],
          variant === "outline" && [
            "border border-border-default text-text-primary",
            "hover:border-accent hover:text-accent",
          ],
          variant === "danger" && [
            "bg-error text-white",
            "hover:bg-red-600 active:scale-[0.98]",
          ],
          // Sizes
          size === "sm" && "h-8 px-3 text-sm gap-1.5",
          size === "md" && "h-10 px-4 text-sm gap-2",
          size === "lg" && "h-12 px-6 text-base gap-2.5",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
