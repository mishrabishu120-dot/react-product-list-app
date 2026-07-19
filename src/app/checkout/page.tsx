"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  const { items, promo, clearCart, subtotal, discount, totalPrice } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && step === 1) {
      router.push("/cart");
    }
  }, [items.length, router, step]);

  if (items.length === 0 && step === 1) return null;

  // Calculate Shipping & Tax
  const shipping = totalPrice >= 99 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    alert("🎉 Order placed successfully!");
    clearCart();
    router.push("/orders");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative max-w-2xl">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[
            { num: 1, label: "Shipping" },
            { num: 2, label: "Payment" },
            { num: 3, label: "Review" }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.num ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Forms area */}
        <div className="flex-1">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8 bg-card border border-border p-6 rounded-2xl">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-3 border-border">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input required type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input required type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input required type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input required type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input required type="text" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input required type="tel" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="button" size="lg" className="rounded-full px-8" onClick={() => setStep(2)}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-3 border-border">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-surface-2 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "credit_card"} 
                      onChange={() => setPaymentMethod("credit_card")}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-semibold block">Credit Card</span>
                      <span className="text-xs text-muted-foreground">Visa, Mastercard, Amex</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:bg-surface-2 transition-colors">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === "paypal"} 
                      onChange={() => setPaymentMethod("paypal")}
                      className="text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="font-semibold block">PayPal</span>
                      <span className="text-xs text-muted-foreground">Pay with your PayPal account</span>
                    </div>
                  </label>
                </div>

                {paymentMethod === "credit_card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border animate-fade-in-up">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <input required type="text" placeholder="•••• •••• •••• ••••" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input required type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <input required type="password" placeholder="•••" maxLength={4} className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-border">
                  <Button type="button" variant="secondary" size="lg" className="rounded-full px-8" onClick={() => setStep(1)}>
                    Back to Shipping
                  </Button>
                  <Button type="button" size="lg" className="rounded-full px-8" onClick={() => setStep(3)}>
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b pb-3 border-border">Review Your Order</h2>
                <p className="text-sm text-muted-foreground">
                  Please review your details and click Place Order to finish your purchase.
                </p>
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-2">
                  <h3 className="font-semibold">Shipping Address Details</h3>
                  <p className="text-sm text-muted-foreground">Standard Ground Delivery — arrives in 3-5 business days.</p>
                </div>
                <div className="flex justify-between pt-4 border-t border-border">
                  <Button type="button" variant="secondary" size="lg" className="rounded-full px-8" onClick={() => setStep(2)}>
                    Back to Payment
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">In Your Cart</h2>
            
            <div className="max-h-[300px] overflow-y-auto mb-6 pr-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0 border border-border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Qty: {item.qty}</span>
                      <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-border mb-4" />

            {/* Totals */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400 font-medium">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            
            {step === 3 && (
              <Button type="submit" form="checkout-form" className="w-full rounded-full mt-6 h-12 text-lg">
                Place Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
