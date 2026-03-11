"use client";

import { useState, useEffect } from "react";
import { Tag, Percent, Clock, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products";
import { getDealsProducts, type Product } from "@/data/mock-data";

export default function DealsPage() {
  const [loading, setLoading] = useState(true);
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDealsProducts(getDealsProducts());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total savings
  const totalSavings = dealsProducts.reduce((acc, p) => {
    if (p.originalPrice) {
      return acc + (p.originalPrice - p.price);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-card p-6 sm:p-8 bg-gradient-to-r from-accent/20 to-orange-600/20 border-accent/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-accent/20 rounded-xl">
            <Tag className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Deals & Discounts</h1>
            <p className="text-text-secondary">Save big on premium auto parts</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="glass-card p-4 bg-bg-panel/50">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-4 h-4 text-accent" />
              <span className="label-technical">Products on Sale</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{dealsProducts.length}</p>
          </div>

          <div className="glass-card p-4 bg-bg-panel/50">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="label-technical">Total Savings</span>
            </div>
            <p className="text-2xl font-bold text-accent">${totalSavings.toFixed(0)}</p>
          </div>

          <div className="glass-card p-4 bg-bg-panel/50">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-green-500" />
              <span className="label-technical">Best Deal</span>
            </div>
            <p className="text-2xl font-bold text-green-500">-27%</p>
          </div>

          <div className="glass-card p-4 bg-bg-panel/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="label-technical">Ends In</span>
            </div>
            <p className="text-lg font-bold text-yellow-500">3 Days</p>
          </div>
        </div>
      </div>

      {/* Featured Deal */}
      {!loading && dealsProducts.length > 0 && (
        <div className="glass-card p-6 border-accent/30">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-text-primary">Featured Deal</h2>
            <Badge variant="accent">Hot</Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-48 bg-bg-hover rounded-lg flex items-center justify-center shrink-0">
              <span className="text-text-tertiary text-sm">{dealsProducts[0].category}</span>
            </div>

            <div className="flex-1">
              <p className="text-text-tertiary text-sm mb-1">{dealsProducts[0].brand}</p>
              <h3 className="text-xl font-bold text-text-primary mb-2">{dealsProducts[0].name}</h3>
              <p className="text-text-secondary mb-4">{dealsProducts[0].description}</p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-accent">
                  ${dealsProducts[0].price.toFixed(2)}
                </span>
                {dealsProducts[0].originalPrice && (
                  <>
                    <span className="text-lg text-text-tertiary line-through">
                      ${dealsProducts[0].originalPrice.toFixed(2)}
                    </span>
                    <Badge variant="success">
                      Save ${(dealsProducts[0].originalPrice - dealsProducts[0].price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>

              <p className="value-mono text-sm text-text-tertiary">
                Part #: {dealsProducts[0].partNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* All Deals */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">All Deals</h2>
        <ProductGrid
          products={dealsProducts}
          loading={loading}
          emptyMessage="No deals available right now. Check back soon!"
          showDescription
        />
      </div>
    </div>
  );
}
