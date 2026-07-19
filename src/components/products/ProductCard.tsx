"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatPrice, cn, badgeClass } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAdded, setShowAdded] = useState(false);
  const { addToCart, items } = useCart();
  const { isLoggedIn, isAdmin } = useAuth();
  
  const inCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return;
    }

    addToCart(product);
    setShowAdded(true);
  };

  useEffect(() => {
    if (showAdded) {
      const timer = setTimeout(() => setShowAdded(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [showAdded]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.id}`} className="group flex flex-col sm:flex-row bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-muted/50 overflow-hidden shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className={badgeClass(product.badge)}>{product.badge}</Badge>
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <span className="text-xs font-bold text-primary uppercase">{product.category}</span>
            <h3 className="font-bold text-lg mt-1 text-text-primary group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
            
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-amber-500">★</span>
              <span className="text-sm font-semibold text-text-primary">{product.rating}</span>
            </div>
            
            <p className="text-sm text-text-secondary mt-3 line-clamp-2">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <span className="text-2xl font-extrabold text-text-primary">{formatPrice(product.price)}</span>
            
            {!isAdmin && (
              <Button 
                variant={showAdded ? "primary" : inCart ? "secondary" : "primary"}
                size="sm"
                onClick={handleAddToCart}
                className={cn("rounded-full px-5", showAdded && "bg-green-600 hover:bg-green-700")}
              >
                {showAdded ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`} className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
      <div className="relative w-full aspect-square bg-muted/30 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className={badgeClass(product.badge)}>{product.badge}</Badge>
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-surface shadow-sm border border-border flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110",
            isWishlisted && "opacity-100 text-red-500"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">{product.category}</span>
          <h3 className="font-bold text-base mt-1 text-text-primary group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">{product.name}</h3>
          
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-amber-500">★</span>
            <span className="text-sm font-semibold text-text-primary">{product.rating}</span>
          </div>

          <p className="text-sm text-text-secondary mt-3 line-clamp-2">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <span className="text-xl font-extrabold text-text-primary">{formatPrice(product.price)}</span>
          
          {!isAdmin && (
            <Button 
              variant={showAdded ? "primary" : inCart ? "secondary" : "primary"}
              size="sm"
              onClick={handleAddToCart}
              className={cn("rounded-full px-4", showAdded && "bg-green-600 hover:bg-green-700")}
            >
              {showAdded ? "Added!" : inCart ? "In Cart" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
