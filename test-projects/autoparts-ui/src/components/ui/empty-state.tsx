"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("glass-panel p-8 text-center", className)}>
      <div className="w-12 h-12 rounded-full bg-accent-subtle mx-auto mb-4 flex items-center justify-center">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-text-heading mb-2">{title}</h3>
      <p className="text-sm text-text-secondary mb-4 max-w-sm mx-auto">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
