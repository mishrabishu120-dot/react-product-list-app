'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const { currentUser, logout, isLoggedIn, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Cart', href: '/cart' },
    { name: 'Orders', href: '/orders', requiresAuth: true },
    { name: 'Admin', href: '/admin', requiresAdmin: true },
  ];

  const visibleLinks = navLinks.filter(link => {
    if (link.requiresAdmin && !isAdmin) return false;
    if (link.requiresAuth && !isLoggedIn) return false;
    return true;
  });

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-300",
      scrolled ? "bg-surface/80 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
              🛍 ShopFlow
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {visibleLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-text-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-2 text-text-secondary transition-colors" aria-label="Toggle Theme">
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.32a1 1 0 011.415 1.415l-.708.708a1 1 0 01-1.414-1.414l.707-.708zM17 10a1 1 0 11-2 0 1 1 0 012 0zm-1.101 4.222a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.32a1 1 0 01-1.415-1.415l.708-.708a1 1 0 011.414 1.414l-.707.708zM4 10a1 1 0 11-2 0 1 1 0 012 0zm1.101-4.222a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <Link href="/cart" className="relative p-2 rounded-full hover:bg-surface-2 text-text-secondary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {totalCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-border hover:bg-surface-2 transition-colors"
                >
                  <span className="text-xl pl-1">{currentUser?.avatar}</span>
                  <span className="text-sm font-medium pr-2">{currentUser?.name.split(' ')[0]}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border py-1 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary truncate">{currentUser?.name}</p>
                      <p className="text-xs text-text-secondary truncate">{currentUser?.email}</p>
                      {isAdmin && <span className="mt-1 inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">Admin</span>}
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary" onClick={() => setUserMenuOpen(false)}>
                      Profile
                    </Link>
                    <button 
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface-2"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
             <Link href="/cart" className="relative p-2 text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {totalCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  pathname === link.href ? "bg-surface-2 text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 flex items-center gap-3">
                    <span className="text-2xl">{currentUser?.avatar}</span>
                    <div>
                      <div className="font-medium text-text-primary">{currentUser?.name}</div>
                      <div className="text-sm text-text-secondary">{currentUser?.email}</div>
                    </div>
                  </div>
                  <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-surface-2" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-surface-2">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full mt-2">Sign In</Button>
                </Link>
              )}
            </div>
            <div className="px-3 py-2 mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-text-secondary font-medium">Theme</span>
              <button onClick={toggleTheme} className="p-2 rounded-full bg-surface-2 text-text-secondary">
                 {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
