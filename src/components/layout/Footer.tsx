import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 inline-block">
              🛍 ShopFlow
            </Link>
            <p className="text-text-secondary mb-6 max-w-sm">
              The premium destination for modern shopping. Discover curated products that elevate your lifestyle with seamless checkout and fast delivery.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button variant="primary" size="sm">Subscribe</Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Press</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=electronics" className="text-text-secondary hover:text-primary transition-colors text-sm">Electronics</Link></li>
              <li><Link href="/products?category=clothing" className="text-text-secondary hover:text-primary transition-colors text-sm">Clothing</Link></li>
              <li><Link href="/products?category=beauty" className="text-text-secondary hover:text-primary transition-colors text-sm">Beauty</Link></li>
              <li><Link href="/products?category=books" className="text-text-secondary hover:text-primary transition-colors text-sm">Books</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Returns</Link></li>
              <li><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} ShopFlow Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-text-muted">
            <span className="text-xl">💳</span>
            <span className="text-xl">💰</span>
            <span className="text-xl">🏦</span>
            <span className="text-xl">🔒</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
