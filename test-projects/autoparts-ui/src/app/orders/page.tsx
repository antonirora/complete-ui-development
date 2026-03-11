"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDERS, ORDER_STATS, getProductById } from "@/data/mock-data";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "warning" as const },
  processing: { label: "Processing", icon: Package, color: "accent" as const },
  shipped: { label: "Shipped", icon: Truck, color: "accent" as const },
  delivered: { label: "Delivered", icon: CheckCircle, color: "success" as const },
  cancelled: { label: "Cancelled", icon: XCircle, color: "error" as const },
};

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const filteredOrders =
    statusFilter === "all"
      ? ORDERS
      : ORDERS.filter((order) => order.status === statusFilter);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Order History</h1>
          <p className="text-text-secondary">{ORDERS.length} total orders</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-bg-panel border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent w-full sm:w-auto"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {Object.entries(ORDER_STATS).map(([status, count]) => {
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`glass-card p-4 text-left transition-all ${
                statusFilter === status ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <config.icon className="w-4 h-4 text-text-tertiary" />
                <span className="label-technical">{config.label}</span>
              </div>
              <p className="text-2xl font-bold text-text-primary">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrders.includes(order.id);
          const statusConfig = STATUS_CONFIG[order.status];

          return (
            <div key={order.id} className="glass-card overflow-hidden">
              {/* Order Header */}
              <button
                onClick={() => toggleExpand(order.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-bg-hover transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-text-primary">{order.id}</p>
                    <p className="text-sm text-text-tertiary">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-text-primary">
                      ${order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-text-tertiary">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>

                  <Badge variant={statusConfig.color}>{statusConfig.label}</Badge>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-text-tertiary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-tertiary" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border-dim p-4 space-y-4">
                  {/* Shipping Info */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <h4 className="label-technical mb-2">Shipping Address</h4>
                      <p className="text-sm text-text-secondary">
                        {order.shippingAddress.street}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zip}
                      </p>
                    </div>

                    {order.trackingNumber && (
                      <div className="flex-1">
                        <h4 className="label-technical mb-2">Tracking</h4>
                        <div className="flex items-center gap-2">
                          <span className="value-mono text-sm">{order.trackingNumber}</span>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                        {order.estimatedDelivery && (
                          <p className="text-sm text-text-tertiary mt-1">
                            Est. delivery: {order.estimatedDelivery}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h4 className="label-technical mb-3">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => {
                        const product = getProductById(item.productId);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-bg-hover rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-bg-active rounded flex items-center justify-center">
                                <Package className="w-5 h-5 text-text-tertiary" />
                              </div>
                              <div>
                                <p className="font-medium text-text-primary">
                                  {product?.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-text-tertiary">
                                  {product?.partNumber || "N/A"} &middot; Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-text-primary">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-border-dim pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Subtotal</span>
                        <span className="text-text-primary">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Shipping</span>
                        <span className="text-text-primary">
                          {order.shipping === 0 ? "FREE" : `$${order.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Tax</span>
                        <span className="text-text-primary">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-base pt-2 border-t border-border-dim">
                        <span className="text-text-primary">Total</span>
                        <span className="text-text-primary">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
