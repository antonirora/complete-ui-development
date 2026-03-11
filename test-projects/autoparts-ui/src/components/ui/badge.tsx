"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "error" | "outline";
  size?: "sm" | "md";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          // Variants
          variant === "default" && "bg-bg-elevated text-text-secondary",
          variant === "accent" && "bg-accent-subtle text-accent",
          variant === "success" && "bg-success-subtle text-success",
          variant === "warning" && "bg-warning-subtle text-warning",
          variant === "error" && "bg-error-subtle text-error",
          variant === "outline" && "border border-border-default text-text-secondary",
          // Sizes
          size === "sm" && "px-2 py-0.5 text-xs",
          size === "md" && "px-2.5 py-1 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
