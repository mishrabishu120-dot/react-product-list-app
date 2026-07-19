"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, items } = useCart();
  const { isLoggedIn, isAdmin } = useAuth();

  const inCart = items.some(item => item.id === product.id);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product.stock === undefined || quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return;
    }
    // Loop to add the selected quantity of the product to the cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  if (isAdmin) {
    return (
      <div className="p-4 bg-amber-500/10 text-amber-600 rounded-lg border border-amber-500/20 text-sm font-medium">
        You are viewing this product as an Administrator. Purchasing is disabled.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center h-14 bg-surface-2 rounded-full border border-border p-1 w-full sm:w-auto">
        <button 
          onClick={decreaseQuantity}
          disabled={quantity <= 1}
          className="w-12 h-full flex items-center justify-center text-xl rounded-full hover:bg-surface disabled:opacity-50 transition-colors font-bold"
        >
          -
        </button>
        <div className="w-12 h-full flex items-center justify-center font-bold text-lg">
          {quantity}
        </div>
        <button 
          onClick={increaseQuantity}
          disabled={product.stock !== undefined && quantity >= product.stock}
          className="w-12 h-full flex items-center justify-center text-xl rounded-full hover:bg-surface disabled:opacity-50 transition-colors font-bold"
        >
          +
        </button>
      </div>
      
      <Button 
        size="lg" 
        className="flex-1 h-14 rounded-full text-lg shadow-lg hover:shadow-primary/25"
        onClick={handleAddToCart}
      >
        {inCart ? "Add More to Cart" : "Add to Cart"}
      </Button>
      
      <Button 
        variant="secondary" 
        size="lg" 
        className="h-14 w-14 rounded-full p-0 flex items-center justify-center border-border shrink-0 text-xl"
        title="Add to Wishlist"
      >
        🤍
      </Button>
    </div>
  );
}
