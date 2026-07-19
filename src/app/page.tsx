"use client";

import Link from "next/link";
import Image from "next/image";
import { products, CATEGORIES, CUSTOMER_REVIEWS, FEATURED_BRANDS } from "@/lib/data";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.badge).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Discover Premium Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mb-10">
            Elevate your lifestyle with our curated collection of high-quality essentials.
            Experience the future of shopping with ShopFlow.
          </p>
          <Link href="/products">
            <Button size="lg" className="text-lg px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked selections just for you.</p>
            </div>
            <Link href="/products" className="hidden md:inline-flex text-primary font-medium hover:underline">
              View All Products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/products">
              <Button variant="secondary" className="w-full">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Categories</h2>
            <p className="text-muted-foreground">Browse our wide range of collections.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Electronics", icon: "💻" },
              { name: "Clothing", icon: "👕" },
              { name: "Home & Living", icon: "🏠" },
              { name: "Sports", icon: "🏀" },
              { name: "Books", icon: "📚" },
              { name: "Beauty", icon: "✨" },
            ].map((category) => (
              <Link 
                key={category.name} 
                href={`/products?category=${category.name}`}
                className="flex flex-col items-center p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border/50"
              >
                <span className="text-4xl mb-4">{category.icon}</span>
                <h3 className="font-semibold text-center">{category.name}</h3>
                <span className="text-xs text-muted-foreground mt-1">{products.filter(p => p.category === category.name).length} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ShopFlow */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Why Choose ShopFlow</h2>
            <p className="text-muted-foreground">We provide the best shopping experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $99' },
              { icon: '🔒', title: 'Secure Payments', desc: '100% protected transactions' },
              { icon: '💬', title: '24/7 Support', desc: 'Dedicated customer service' },
              { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-muted/20">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Loved by Customers</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-background p-6 rounded-2xl shadow-sm border border-border/50">
                <div className="flex text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{review.name}</h4>
                    <span className="text-xs text-muted-foreground">Verified Buyer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 bg-background border-y border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">Trusted by top brands</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {FEATURED_BRANDS.map((brand, i) => (
              <div key={i} className="text-xl md:text-2xl font-bold font-sans flex items-center gap-2">
                <span>{brand.logo}</span>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-primary to-purple-600 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the ShopFlow Community</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md">
            Subscribe to our newsletter to get updates on new products and exclusive discounts.
          </p>
          <div className="flex w-full max-w-md gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" className="rounded-full px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
