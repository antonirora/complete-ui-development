"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Tag,
  Star,
  TrendingUp,
  Truck,
  ChevronRight,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Card, Badge, Skeleton, EmptyState } from "@/components/ui";
import { STATS, FEATURED_PRODUCTS, CATEGORIES, RECENT_ORDERS, type Product } from "@/data/mock-data";
import { formatPrice, formatNumber } from "@/lib/utils";

// ─── Simulated Loading ─────────────────────────────────────────────────
function useSimulatedLoading(delay = 800) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return isLoading;
}

// ─── Product Card ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <Card
      variant="glass"
      padding="none"
      className="group hover:border-border-bright transition-all overflow-hidden cursor-pointer"
    >
      {/* Image placeholder */}
      <div className="relative h-40 bg-bg-elevated flex items-center justify-center">
        <Package className="w-12 h-12 text-text-muted" />
        {hasDiscount && (
          <Badge variant="error" className="absolute top-3 left-3">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-medium text-text-secondary">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Brand & Category */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">{product.brand}</Badge>
          <span className="text-xs text-text-muted">{product.category}</span>
        </div>

        {/* Name */}
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span className="text-xs font-medium text-text-secondary">{product.rating}</span>
          <span className="text-xs text-text-muted">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-accent">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* CTA */}
        <Button
          variant={product.inStock ? "primary" : "secondary"}
          size="sm"
          className="w-full"
          disabled={!product.inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Notify Me"}
        </Button>
      </div>
    </Card>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const isLoading = useSimulatedLoading();

  // ─── Loading State ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel p-5 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        {/* Products skeleton */}
        <div>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Loaded State ──────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">
            Welcome back!
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Find quality parts for your vehicle at great prices.
          </p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="md">
            Browse All Parts
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* ─── Stats Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Products in Stock */}
        <div className="glass-panel p-5 group hover:border-border-bright transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="label-technical">In Stock</span>
            <Package className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-colors" />
          </div>
          <span className="value-mono text-2xl font-bold text-text-primary">
            {formatNumber(STATS.productsInStock)}
          </span>
          <p className="text-xs text-text-muted mt-1">products</p>
        </div>

        {/* Brands */}
        <div className="glass-panel p-5 group hover:border-border-bright transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="label-technical">Brands</span>
            <Award className="w-4 h-4 text-text-tertiary group-hover:text-success transition-colors" />
          </div>
          <span className="value-mono text-2xl font-bold text-text-primary">
            {STATS.brandsCarried}
          </span>
          <p className="text-xs text-text-muted mt-1">top brands</p>
        </div>

        {/* Orders Today */}
        <div className="glass-panel p-5 group hover:border-border-bright transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="label-technical">Orders</span>
            <TrendingUp className="w-4 h-4 text-text-tertiary group-hover:text-warning transition-colors" />
          </div>
          <span className="value-mono text-2xl font-bold text-text-primary">
            {STATS.ordersToday}
          </span>
          <p className="text-xs text-text-muted mt-1">today</p>
        </div>

        {/* Average Rating */}
        <div className="glass-panel p-5 group hover:border-border-bright transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="label-technical">Rating</span>
            <Star className="w-4 h-4 text-text-tertiary group-hover:text-warning fill-current transition-colors" />
          </div>
          <span className="value-mono text-2xl font-bold text-text-primary">
            {STATS.averageRating}
          </span>
          <p className="text-xs text-text-muted mt-1">average</p>
        </div>
      </div>

      {/* ─── Two Column Layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.4fr] gap-6">
        {/* ─── Featured Products ────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent" />
              Featured Products
            </h2>
            <Link
              href="/deals"
              className="text-xs text-accent font-semibold uppercase tracking-wider hover:underline flex items-center gap-1"
            >
              View all deals
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_PRODUCTS.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* ─── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Quick Categories */}
          <Card variant="glass" padding="sm">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Quick Categories
            </h3>
            <div className="space-y-2">
              {CATEGORIES.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-hover transition-colors group"
                >
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {category.name}
                  </span>
                  <Badge variant="outline" size="sm">
                    {category.productCount}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card variant="glass" padding="sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                Recent Orders
              </h3>
              <Link href="/orders">
                <Badge variant="outline" size="sm" className="cursor-pointer hover:bg-bg-hover">
                  All
                </Badge>
              </Link>
            </div>

            <div className="space-y-3">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/50"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{order.id}</p>
                    <p className="text-xs text-text-muted">{order.items} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">
                      {formatPrice(order.total)}
                    </p>
                    <Badge
                      variant={
                        order.status === "delivered"
                          ? "success"
                          : order.status === "shipped"
                          ? "accent"
                          : "warning"
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Free Shipping Banner */}
          <Card variant="glass" padding="sm" className="bg-accent-subtle border-accent/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-heading">Free Shipping</h4>
                <p className="text-xs text-text-secondary mt-1">
                  On all orders over $75. Fast delivery nationwide!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
