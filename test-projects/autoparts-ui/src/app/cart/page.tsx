"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/stores/cart-store";

export default function CartPage() {
  const { getCartProducts, updateQuantity, removeItem, getSubtotal, clearCart, getItemCount } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const cartProducts = getCartProducts();
  const subtotal = getSubtotal();
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 99 ? 0 : 12.99;
  const tax = (subtotal - discount) * 0.0825;
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={ShoppingCart}
          title="Your Cart is Empty"
          description="Looks like you haven't added any parts yet. Start shopping to fill your cart!"
          action={
            <Link href="/products">
              <Button variant="primary">
                <Package className="w-4 h-4 mr-2" />
                Browse Products
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Shopping Cart</h1>
          <p className="text-text-secondary">{getItemCount()} items in your cart</p>
        </div>
        <Button variant="ghost" onClick={clearCart}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cartProducts.map(({ product, quantity }) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : null;

            return (
              <div key={product.id} className="glass-card p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-bg-hover rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-text-tertiary text-xs">{product.category}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="text-text-tertiary text-xs mb-1">{product.brand}</p>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium text-text-primary hover:text-accent transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="value-mono text-xs mt-1">{product.partNumber}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(product.id)}
                        className="text-text-tertiary hover:text-error shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-text-primary">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stockCount}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {discount && <Badge variant="accent">-{discount}%</Badge>}
                          <span className="text-lg font-bold text-text-primary">
                            ${(product.price * quantity).toFixed(2)}
                          </span>
                        </div>
                        {quantity > 1 && (
                          <p className="text-xs text-text-tertiary">
                            ${product.price.toFixed(2)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="glass-card p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="label-technical mb-2 block">Promo Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="flex-1 bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                >
                  {promoApplied ? "Applied" : "Apply"}
                </Button>
              </div>
              {promoApplied && (
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  10% discount applied!
                </p>
              )}
              <p className="text-xs text-text-tertiary mt-2">Try: SAVE10</p>
            </div>

            {/* Summary */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary">${subtotal.toFixed(2)}</span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-green-500">
                  <span>Discount (10%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-text-primary">
                  {shipping === 0 ? (
                    <span className="text-green-500">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {subtotal < 99 && shipping > 0 && (
                <p className="text-xs text-text-tertiary">
                  Add ${(99 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}

              <div className="flex justify-between">
                <span className="text-text-secondary">Estimated Tax</span>
                <span className="text-text-primary">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-border-dim pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-text-primary">Total</span>
                  <span className="text-text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button variant="primary" className="w-full mt-6">
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Continue Shopping */}
            <Link href="/products" className="block text-center mt-4">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
