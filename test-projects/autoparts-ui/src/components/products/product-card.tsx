"use client";

import Link from "next/link";
import { Star, Bell, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/stores/cart-store";
import { type Product } from "@/data/mock-data";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

export function ProductCard({ product, showDescription = false }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const inCart = items.some((item) => item.productId === product.id);

  const handleAddToCart = () => {
    addItem(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="glass-card p-4 flex flex-col h-full group">
      {/* Image placeholder with discount badge */}
      <Link href={`/product/${product.id}`} className="relative">
        <div className="aspect-square bg-bg-hover rounded-lg mb-4 flex items-center justify-center overflow-hidden group-hover:bg-bg-active transition-colors">
          <span className="text-text-tertiary text-sm">{product.category}</span>
        </div>
        {discount && (
          <Badge variant="accent" className="absolute top-2 left-2">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <Badge variant="error" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <Link href={`/product/${product.id}`}>
          <p className="text-text-tertiary text-xs mb-1">{product.brand}</p>
          <h3 className="font-medium text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {showDescription && (
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium text-text-primary">{product.rating}</span>
          <span className="text-xs text-text-tertiary">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-text-primary">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-text-tertiary line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Part Number */}
        <p className="value-mono text-xs mb-4">{product.partNumber}</p>

        {/* Action Button */}
        <div className="mt-auto">
          {product.inStock ? (
            <Button
              variant={justAdded ? "secondary" : "primary"}
              className="w-full"
              onClick={handleAddToCart}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {inCart ? "Add More" : "Add to Cart"}
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" className="w-full">
              <Bell className="w-4 h-4 mr-2" />
              Notify Me
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
