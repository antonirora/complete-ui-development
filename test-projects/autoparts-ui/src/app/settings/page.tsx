"use client";

import { useState } from "react";
import { User, Bell, Shield, CreditCard, Truck, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    priceAlerts: false,
    newsletter: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Settings</h1>
        <p className="text-text-secondary">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-technical mb-2 block">First Name</label>
            <input
              type="text"
              defaultValue="John"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="label-technical mb-2 block">Last Name</label>
            <input
              type="text"
              defaultValue="Doe"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-technical mb-2 block">Email</label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label-technical mb-2 block">Phone</label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
        </div>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => {
            const labels: Record<string, { title: string; desc: string }> = {
              orderUpdates: { title: "Order Updates", desc: "Get notified about your order status" },
              promotions: { title: "Promotions", desc: "Receive deals and special offers" },
              priceAlerts: { title: "Price Alerts", desc: "Get alerted when items in your wishlist go on sale" },
              newsletter: { title: "Newsletter", desc: "Weekly automotive tips and news" },
            };

            return (
              <label key={key} className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-medium text-text-primary">{labels[key].title}</p>
                  <p className="text-xs text-text-tertiary">{labels[key].desc}</p>
                </div>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    value ? "bg-accent" : "bg-bg-hover border border-border-dim"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      value ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </label>
            );
          })}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Default Shipping Address</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label-technical mb-2 block">Street Address</label>
            <input
              type="text"
              defaultValue="123 Main Street"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="label-technical mb-2 block">City</label>
            <input
              type="text"
              defaultValue="Los Angeles"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="label-technical mb-2 block">State</label>
            <input
              type="text"
              defaultValue="CA"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="label-technical mb-2 block">ZIP Code</label>
            <input
              type="text"
              defaultValue="90001"
              className="w-full bg-bg-hover border border-border-dim rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Payment Methods</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-bg-hover rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">**** **** **** 4242</p>
                <p className="text-xs text-text-tertiary">Expires 12/25</p>
              </div>
            </div>
            <Badge variant="success">Default</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-bg-hover rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">
                MC
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">**** **** **** 8888</p>
                <p className="text-xs text-text-tertiary">Expires 06/26</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Set Default</Button>
          </div>
        </div>

        <Button variant="outline" className="mt-4">
          + Add Payment Method
        </Button>
      </div>

      {/* Security */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-text-primary">Security</h2>
        </div>

        <div className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
              <p className="text-xs text-text-tertiary">Add an extra layer of security</p>
            </div>
            <Badge variant="outline">Not Enabled</Badge>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant={saved ? "secondary" : "primary"} onClick={handleSave}>
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
