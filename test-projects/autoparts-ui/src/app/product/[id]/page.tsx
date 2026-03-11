"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Bell,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/stores/cart-store";
import { getProductById, getProductsByCategory, type Product } from "@/data/mock-data";
import { ProductCard } from "@/components/products";

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem, items } = useCart();

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    const timer = setTimeout(() => {
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
      if (foundProduct) {
        const related = getProductsByCategory(foundProduct.categorySlug)
          .filter((p) => p.id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  const inCart = items.some((item) => item.productId === id);
  const cartQuantity = items.find((item) => item.productId === id)?.quantity || 0;

  const handleAddToCart = () => {
    addItem(id, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="aspect-square w-full lg:w-1/2" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Product Not Found</h1>
        <p className="text-text-secondary mb-4">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/products"
          className="text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Products
        </Link>
        <span className="text-text-tertiary">/</span>
        <Link
          href={`/category/${product.categorySlug}`}
          className="text-text-tertiary hover:text-text-primary transition-colors"
        >
          {product.category}
        </Link>
        <span className="text-text-tertiary">/</span>
        <span className="text-text-primary truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-square bg-bg-hover rounded-xl flex items-center justify-center relative">
            <span className="text-text-tertiary">{product.category}</span>
            {discount && (
              <Badge variant="accent" className="absolute top-4 left-4 text-base px-3 py-1">
                -{discount}%
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="error" className="absolute top-4 right-4">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div>
            <p className="text-text-tertiary text-sm mb-1">{product.brand}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-text-tertiary"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-text-primary">{product.rating}</span>
              <span className="text-text-tertiary">({product.reviewCount} reviews)</span>
            </div>

            {/* Part Number */}
            <p className="value-mono text-sm">Part #: {product.partNumber}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-text-primary">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-text-tertiary line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <Badge variant="success">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-text-secondary leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {product.inStock ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-green-500 font-medium">In Stock</span>
                <span className="text-text-tertiary">({product.stockCount} available)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-red-500 font-medium">Out of Stock</span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.inStock ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3">
                <span className="text-text-secondary">Qty:</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-text-primary">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant={justAdded ? "secondary" : "primary"}
                className="flex-1 sm:flex-none sm:px-12"
                onClick={handleAddToCart}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inCart ? `Add More (${cartQuantity} in cart)` : "Add to Cart"}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full sm:w-auto sm:px-12">
              <Bell className="w-5 h-5 mr-2" />
              Notify When Available
            </Button>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border-dim">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Free Shipping</p>
                <p className="text-xs text-text-tertiary">Orders over $99</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Warranty</p>
                <p className="text-xs text-text-tertiary">12 month guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-text-primary">Easy Returns</p>
                <p className="text-xs text-text-tertiary">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-border-dim">
              <span className="text-text-tertiary">{key}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compatibility */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Compatibility</h2>
        <div className="flex flex-wrap gap-2">
          {product.compatibility.map((vehicle, idx) => (
            <Badge key={idx} variant="outline">
              {vehicle}
            </Badge>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
