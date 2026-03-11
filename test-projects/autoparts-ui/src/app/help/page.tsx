"use client";

import { useState } from "react";
import {
  HelpCircle,
  Search,
  Truck,
  RotateCcw,
  CreditCard,
  Package,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ_CATEGORIES = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery. Free shipping on orders over $99.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within the United States. We're working on expanding to Canada and Mexico soon.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can also view tracking info in the Orders section of your account.",
      },
    ],
  },
  {
    id: "returns",
    icon: RotateCcw,
    title: "Returns & Refunds",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for most items. Products must be unused and in original packaging. Some items like electrical components may have restrictions.",
      },
      {
        q: "How do I start a return?",
        a: "Go to your Orders page, find the order, and click 'Return Item'. Print the prepaid shipping label and drop off at any UPS location.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 3-5 business days after we receive your return. The credit may take an additional 5-10 days to appear on your statement.",
      },
    ],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Payment & Pricing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Discover, PayPal, and Apple Pay. All transactions are secured with 256-bit encryption.",
      },
      {
        q: "Do you price match?",
        a: "Yes! We'll match any competitor's advertised price for identical in-stock items. Contact support with the competitor's link.",
      },
      {
        q: "Are there any hidden fees?",
        a: "No hidden fees. The price you see includes all applicable taxes. Shipping costs are calculated at checkout based on your location.",
      },
    ],
  },
  {
    id: "parts",
    icon: Package,
    title: "Parts & Compatibility",
    questions: [
      {
        q: "How do I know if a part fits my vehicle?",
        a: "Each product page lists compatible vehicles. You can also use our vehicle search at the top of the page to filter parts specific to your car.",
      },
      {
        q: "Are these OEM or aftermarket parts?",
        a: "We sell both OEM (Original Equipment Manufacturer) and quality aftermarket parts. Each listing clearly indicates the part type.",
      },
      {
        q: "Do you offer installation guides?",
        a: "Many products include installation instructions. For complex installations, we recommend consulting a certified mechanic.",
      },
    ],
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">How can we help?</h1>
        <p className="text-text-secondary">
          Search our FAQ or contact our support team
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-hover border border-border-dim rounded-xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {(searchQuery ? filteredCategories : FAQ_CATEGORIES).map((category) => (
          <div key={category.id} className="glass-card overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-border-dim">
              <category.icon className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">{category.title}</h2>
            </div>

            <div className="divide-y divide-border-dim">
              {category.questions.map((q, idx) => {
                const questionId = `${category.id}-${idx}`;
                const isExpanded = expandedQuestions.includes(questionId);

                return (
                  <div key={idx}>
                    <button
                      onClick={() => toggleQuestion(questionId)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-hover transition-colors"
                    >
                      <span className="font-medium text-text-primary pr-4">{q.q}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-text-tertiary shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-tertiary shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <p className="text-text-secondary leading-relaxed">{q.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-6 text-center">
          Still need help? Contact us
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-hover rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-medium text-text-primary mb-1">Live Chat</h3>
            <p className="text-sm text-text-tertiary mb-3">Chat with our team</p>
            <Button variant="outline" size="sm" className="w-full">
              Start Chat
            </Button>
          </div>

          <div className="p-4 bg-bg-hover rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
              <Phone className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-medium text-text-primary mb-1">Phone</h3>
            <p className="text-sm text-text-tertiary mb-3">1-800-PARTS</p>
            <Button variant="outline" size="sm" className="w-full">
              Call Now
            </Button>
          </div>

          <div className="p-4 bg-bg-hover rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-medium text-text-primary mb-1">Email</h3>
            <p className="text-sm text-text-tertiary mb-3">support@autoparts.pro</p>
            <Button variant="outline" size="sm" className="w-full">
              Send Email
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-tertiary">
          <Clock className="w-4 h-4" />
          <span>Support hours: Mon-Fri 8am-8pm EST, Sat-Sun 9am-5pm EST</span>
        </div>
      </div>
    </div>
  );
}
