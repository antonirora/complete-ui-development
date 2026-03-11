"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductsByCategory, CATEGORIES, BRANDS, type Product } from "@/data/mock-data";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  const category = CATEGORIES.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(getProductsByCategory(slug));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [slug]);

  // Get unique brands for this category
  const categoryBrands = useMemo(() => {
    const brandNames = new Set(products.map((p) => p.brand));
    return BRANDS.filter((b) => brandNames.has(b.name));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        filtered.sort((a, b) => {
          if (a.originalPrice && !b.originalPrice) return -1;
          if (!a.originalPrice && b.originalPrice) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [products, selectedBrands, inStockOnly, sortBy]);

  const toggleBrand = (name: string) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters = selectedBrands.length > 0 || inStockOnly;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-6">
          <div className="w-64 hidden lg:block space-y-4">
            <Skeleton className="h-40" />
            <Skeleton className="h-32" />
          </div>
          <div className="flex-1">
            <ProductGrid products={[]} loading={true} />
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Category Not Found</h1>
        <p className="text-text-secondary mb-4">
          The category you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/products">
          <Button variant="primary">Browse All Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/products"
          className="text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          All Products
        </Link>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary">{category.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">{category.name}</h1>
          <p className="text-text-secondary">{category.description}</p>
          <p className="text-sm text-text-tertiary mt-1">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="accent" className="ml-2">
                {selectedBrands.length + (inStockOnly ? 1 : 0)}
              </Badge>
            )}
          </Button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-bg-panel border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Best Rating</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <aside
          className={`w-64 shrink-0 space-y-6 ${
            showFilters
              ? "fixed inset-0 z-50 bg-bg-base p-6 overflow-auto lg:relative lg:p-0 lg:bg-transparent"
              : "hidden lg:block"
          }`}
        >
          {/* Mobile close button */}
          <div className="flex justify-between items-center lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Brands */}
          {categoryBrands.length > 0 && (
            <div className="glass-panel p-4">
              <h3 className="label-technical mb-3">Brands</h3>
              <div className="space-y-2">
                {categoryBrands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => toggleBrand(brand.name)}
                      className="w-4 h-4 rounded border-border-dim bg-bg-hover text-accent focus:ring-accent focus:ring-offset-0"
                    />
                    <span className="text-sm text-text-secondary">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="glass-panel p-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-border-dim bg-bg-hover text-accent focus:ring-accent focus:ring-offset-0"
              />
              <span className="text-sm text-text-secondary">In Stock Only</span>
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}

          {/* Mobile apply button */}
          <Button
            variant="primary"
            className="w-full lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            Show {filteredProducts.length} Results
          </Button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 min-w-0">
          {/* Active filters badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="outline" className="gap-1">
                  {brand}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => toggleBrand(brand)}
                  />
                </Badge>
              ))}
              {inStockOnly && (
                <Badge variant="outline" className="gap-1">
                  In Stock
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setInStockOnly(false)}
                  />
                </Badge>
              )}
            </div>
          )}

          <ProductGrid
            products={filteredProducts}
            loading={false}
            emptyMessage={`No ${category.name.toLowerCase()} products match your filters.`}
          />
        </main>
      </div>
    </div>
  );
}
