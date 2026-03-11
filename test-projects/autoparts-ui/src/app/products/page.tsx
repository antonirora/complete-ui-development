"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products";
import { ALL_PRODUCTS, CATEGORIES, BRANDS, type Product } from "@/data/mock-data";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "name";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let products = [...ALL_PRODUCTS];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      products = products.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      products = products.filter((p) => selectedBrands.includes(p.brand));
    }

    // In stock filter
    if (inStockOnly) {
      products = products.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - products with discounts first, then by rating
        products.sort((a, b) => {
          if (a.originalPrice && !b.originalPrice) return -1;
          if (!a.originalPrice && b.originalPrice) return 1;
          return b.rating - a.rating;
        });
    }

    return products;
  }, [search, selectedCategories, selectedBrands, inStockOnly, sortBy]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (name: string) => {
    setSelectedBrands((prev) =>
      prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const hasActiveFilters =
    search || selectedCategories.length > 0 || selectedBrands.length > 0 || inStockOnly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">All Products</h1>
          <p className="text-text-secondary">
            {filteredProducts.length} of {ALL_PRODUCTS.length} products
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
                {selectedCategories.length + selectedBrands.length + (inStockOnly ? 1 : 0)}
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
            showFilters ? "fixed inset-0 z-50 bg-bg-base p-6 overflow-auto lg:relative lg:p-0 lg:bg-transparent" : "hidden lg:block"
          }`}
        >
          {/* Mobile close button */}
          <div className="flex justify-between items-center lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="glass-panel p-4">
            <h3 className="label-technical mb-3">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-hover border border-border-dim rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="glass-panel p-4">
            <h3 className="label-technical mb-3">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="w-4 h-4 rounded border-border-dim bg-bg-hover text-accent focus:ring-accent focus:ring-offset-0"
                  />
                  <span className="text-sm text-text-secondary">{cat.name}</span>
                  <span className="text-xs text-text-tertiary ml-auto">({cat.productCount})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="glass-panel p-4">
            <h3 className="label-technical mb-3">Brands</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {BRANDS.map((brand) => (
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
              Clear All Filters
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
              {search && (
                <Badge variant="outline" className="gap-1">
                  Search: {search}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSearch("")}
                  />
                </Badge>
              )}
              {selectedCategories.map((slug) => {
                const cat = CATEGORIES.find((c) => c.slug === slug);
                return (
                  <Badge key={slug} variant="outline" className="gap-1">
                    {cat?.name}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => toggleCategory(slug)}
                    />
                  </Badge>
                );
              })}
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
            loading={loading}
            emptyMessage="No products match your filters. Try adjusting your search criteria."
          />
        </main>
      </div>
    </div>
  );
}
