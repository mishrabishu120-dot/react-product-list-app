// ============================================================
// lib/utils.ts — Utility helpers for ShopFlow
// ============================================================

import { type ClassValue, clsx } from "clsx";

/** Merge class names conditionally */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format a number as USD currency */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/** Format a date string to a readable format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Build a badge CSS class suffix from a badge label */
export function badgeClass(label: string): string {
  return label.toLowerCase().replace(/[\s']+/g, "-");
}

/** Generate a unique numeric ID */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000);
}

/** Truncate text to N characters with ellipsis */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

/** Calculate cart totals */
export function calculateCartTotals(subtotal: number) {
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  return { shipping, tax, total };
}

/** Slugify a string for URLs */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
