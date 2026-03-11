"use client";

import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Package } from "lucide-react";
import { type Product } from "@/data/mock-data";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  showDescription?: boolean;
}

export function ProductGrid({
  products,
  loading = false,
  emptyMessage = "No products found",
  showDescription = false,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card p-4">
            <Skeleton className="aspect-square mb-4" />
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-5 w-3/4 mb-3" />
            <Skeleton className="h-4 w-1/4 mb-3" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No Products Found"
        description={emptyMessage}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showDescription={showDescription}
        />
      ))}
    </div>
  );
}
