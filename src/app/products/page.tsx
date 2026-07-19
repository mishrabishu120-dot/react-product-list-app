"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products, CATEGORIES } from "@/lib/data";
import { Product, SortOrder, ViewMode } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCategory = searchParams.get("category") || "All";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    // Simulate loading for smoother skeleton effect
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === "All") {
      router.push("/products");
    } else {
      router.push(`/products?category=${encodeURIComponent(cat)}`);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOrder === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedCategory, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Our Products</h1>
          <p className="text-muted-foreground">Showing {filteredProducts.length} results</p>
        </div>
        
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 px-4 py-2 pl-10 rounded-full bg-muted border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button
                onClick={() => handleCategoryChange("All")}
                className={cn(
                  "px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium text-left transition-colors",
                  selectedCategory === "All" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                All Products
              </button>
              {CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full lg:rounded-lg text-sm font-medium text-left transition-colors",
                    selectedCategory === cat 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-2 bg-muted/30 rounded-lg gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 bg-background border border-border rounded-md p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-1.5 rounded", viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50")}
                aria-label="Grid view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-1.5 rounded", viewMode === "list" ? "bg-muted" : "hover:bg-muted/50")}
                aria-label="List view"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </button>
            </div>
          </div>

          {/* Product Grid/List */}
          {isLoading ? (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            )}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting your search or category.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}>
                Clear All Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={cn(
                       "w-9 h-9 rounded-md text-sm font-medium transition-colors",
                       currentPage === i + 1
                         ? "bg-primary text-primary-foreground"
                         : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
