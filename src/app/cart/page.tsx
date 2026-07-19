"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PROMO_CODES } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { 
    items, 
    updateQty, 
    removeFromCart, 
    promo, 
    applyPromoCode, 
    removePromoCode,
    subtotal,
    discount,
    totalPrice
  } = useCart();
  
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const router = useRouter();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    
    if (!promoInput.trim()) return;

    const matchedPromo = PROMO_CODES.find(
      (p) => p.code === promoInput.trim().toUpperCase()
    );

    if (matchedPromo) {
      if (totalPrice >= matchedPromo.minOrder) {
        applyPromoCode(matchedPromo);
        setPromoInput("");
      } else {
        setPromoError(`Minimum order of ${formatPrice(matchedPromo.minOrder)} required`);
      }
    } else {
      setPromoError("Invalid or expired promo code");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="text-8xl mb-8">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium collection and find something you love.
        </p>
        <Link href="/products">
          <Button size="lg" className="rounded-full px-8">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  // Calculate Shipping & Tax on price after discount
  const shipping = totalPrice >= 99 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart{" "}
        <span className="text-muted-foreground text-xl font-normal">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-12 bg-muted/50 p-4 text-sm font-medium text-muted-foreground bg-gray-50 dark:bg-gray-800/40">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div className="relative w-24 h-24 bg-muted rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-primary uppercase mb-1">{item.category}</span>
                      <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <span className="text-sm text-muted-foreground mt-1">{formatPrice(item.price)}</span>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-3 flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center h-10 bg-surface-2 rounded-full p-1 w-full max-w-[120px] border border-border">
                      <button 
                        onClick={() => {
                          if (item.qty === 1) {
                            removeFromCart(item.id);
                          } else {
                            updateQty(item.id, item.qty - 1);
                          }
                        }}
                        className="w-8 h-full flex items-center justify-center hover:bg-surface rounded-full transition-colors font-bold text-lg"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center justify-center font-medium text-sm">
                        {item.qty}
                      </div>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.stock !== undefined && item.qty >= item.stock}
                        className="w-8 h-full flex items-center justify-center hover:bg-surface rounded-full transition-colors disabled:opacity-50 font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:block mt-2 sm:mt-0">
                    <span className="sm:hidden text-sm text-muted-foreground">Total:</span>
                    <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 flex justify-end w-full sm:w-auto">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-2"
                      aria-label="Remove item"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Promo Code */}
            <div className="mb-6 pb-6 border-b border-border">
              {promo ? (
                <div className="flex items-center justify-between bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{promo.code}</span>
                    <span className="text-sm">(-{promo.discount}%)</span>
                  </div>
                  <button onClick={removePromoCode} className="text-sm hover:underline font-medium text-red-500">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. SAVE20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-surface-2 border border-border focus:bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm uppercase text-text-primary"
                    />
                    <Button type="submit" variant="secondary" size="sm">Apply</Button>
                  </div>
                  {promoError && <p className="text-red-500 text-xs">{promoError}</p>}
                </form>
              )}
            </div>

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

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button 
              className="w-full rounded-full h-12 text-lg shadow-md hover:shadow-primary/25"
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </Button>
            
            <div className="mt-4 text-center">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
