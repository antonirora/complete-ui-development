"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl transition-all",
          // Variants
          variant === "default" && "bg-bg-card border border-border-dim",
          variant === "glass" && "glass-card",
          variant === "outlined" && "border border-border-default bg-transparent",
          // Padding
          padding === "none" && "",
          padding === "sm" && "p-4",
          padding === "md" && "p-5",
          padding === "lg" && "p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
