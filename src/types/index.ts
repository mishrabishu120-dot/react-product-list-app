// ============================================================
// types/index.ts — All TypeScript interfaces for ShopFlow
// ============================================================

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  badge: string | null;
  stock?: number;
  specs?: Record<string, string>;
}

export interface CartItem extends Product {
  qty: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: string;
  joined: string;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  joined: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  address: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface PromoCode {
  code: string;
  discount: number; // percentage
  minOrder: number;
}

export type SortOrder = "default" | "asc" | "desc" | "price-asc" | "price-desc";
export type ViewMode = "grid" | "list";
export type Theme = "light" | "dark";

export type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: number }
  | { type: "UPDATE_QTY"; id: number; qty: number }
  | { type: "CLEAR" }
  | { type: "APPLY_PROMO"; code: PromoCode }
  | { type: "REMOVE_PROMO" };
