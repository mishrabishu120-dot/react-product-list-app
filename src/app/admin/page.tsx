"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Product } from "@/types";
import {
  products as initialProducts,
  CATEGORIES,
  DEMO_ORDERS,
} from "@/lib/data";
import { formatPrice, generateId, cn } from "@/lib/utils";

type Tab = "overview" | "products" | "analytics" | "orders" | "customers";

export default function AdminDashboard() {
  const { currentUser, isLoggedIn, isAdmin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    description: "",
    image: "",
    rating: "4.5",
    badge: "",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [isLoggedIn, isAdmin, router]);


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }


  const showToast = (msg: string) => setToast(msg);

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      showToast("🗑 Product deleted.");
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "Electronics",
      price: "",
      description: "",
      image: "",
      rating: "4.5",
      badge: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      rating: product.rating.toString(),
      badge: product.badge || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : generateId(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      rating: parseFloat(formData.rating) || 0,
      badge: formData.badge || null,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? newProduct : p)));
      showToast("✅ Product updated!");
    } else {
      setProducts([newProduct, ...products]);
      showToast("✅ Product added!");
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const uniqueCategories = new Set(products.map((p) => p.category)).size;
  const avgRating = (
    products.reduce((sum, p) => sum + p.rating, 0) / products.length
  ).toFixed(1);

  const categoryStats = Array.from(new Set(products.map(p => p.category))).map(cat => {
    const catProducts = products.filter(p => p.category === cat);
    const avgPrice = catProducts.reduce((sum, p) => sum + p.price, 0) / catProducts.length;
    return { category: cat, count: catProducts.length, avgPrice };
  });

  const priceRanges = [
    { label: "Under $50", min: 0, max: 50 },
    { label: "$50-$100", min: 50, max: 100 },
    { label: "$100-$500", min: 100, max: 500 },
    { label: "Over $500", min: 500, max: Infinity },
  ].map(range => {
    const count = products.filter(p => p.price >= range.min && p.price < range.max).length;
    const percentage = Math.round((count / products.length) * 100) || 0;
    return { ...range, count, percentage };
  });

  const renderNav = () => (
    <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
      <div className="hidden md:block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">
        Dashboard
      </div>
      {[
        { id: "overview", label: "Overview", icon: "📊" },
        { id: "products", label: "Products", icon: "📦" },
        { id: "analytics", label: "Analytics", icon: "📈" },
        { id: "orders", label: "Orders", icon: "📋" },
        { id: "customers", label: "Customers", icon: "👥" },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as Tab)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
            ${
              activeTab === item.id
                ? "bg-black text-white dark:bg-white dark:text-black md:border-l-4 md:border-black md:dark:border-white md:rounded-l-none"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shrink-0 shadow-sm z-10 md:min-h-screen overflow-y-auto">
        {renderNav()}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">
            {activeTab}
          </h1>
        </header>

        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Products", value: products.length, subtitle: "↑ +2 this week", icon: "📦" },
                { label: "Catalogue Value", value: formatPrice(Math.round(totalValue)), subtitle: "↑ +12% vs last month", icon: "💰" },
                { label: "Categories", value: uniqueCategories, subtitle: "Across all products", icon: "🏷️" },
                { label: "Avg Rating", value: avgRating, subtitle: "↑ Excellent", icon: "⭐" },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{stat.icon}</div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.subtitle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Products</h2>
                <Button variant="secondary" size="sm" onClick={() => setActiveTab("products")}>
                  View All →
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Product</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge>{p.category}</Badge>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4">⭐ {p.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                All Products ({filteredProducts.length})
              </h2>
              <div className="flex w-full sm:w-auto gap-3">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                />
                <Button onClick={openAddModal}>➕ Add Product</Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Product</th>
                      <th className="px-6 py-4 font-medium">Category</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Rating</th>
                      <th className="px-6 py-4 font-medium">Badge</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-md overflow-hidden bg-gray-100">
                            <Image src={p.image} alt={p.name} fill className="object-cover" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{p.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge>{p.category}</Badge>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{formatPrice(p.price)}</td>
                        <td className="px-6 py-4">⭐ {p.rating}</td>
                        <td className="px-6 py-4">
                          {p.badge && <Badge>{p.badge}</Badge>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEditModal(p)}>
                              Edit
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteProduct(p.id)}>
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                          No products found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category Breakdown</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.category}</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count} items</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Avg Price: {formatPrice(stat.avgPrice)}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-10">Price Range Distribution</h2>
            <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 max-w-3xl">
              <div className="space-y-6">
                {priceRanges.map((range) => (
                  <div key={range.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{range.label}</span>
                      <span className="text-gray-500">{range.count} products ({range.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${range.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order ID</th>
                      <th className="px-6 py-4 font-medium">Customer</th>
                      <th className="px-6 py-4 font-medium">Items</th>
                      <th className="px-6 py-4 font-medium">Total</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_ORDERS.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4 font-mono text-gray-900 dark:text-white">{order.id}</td>
                        <td className="px-6 py-4 font-medium">{order.address.fullName}</td>
                        <td className="px-6 py-4">{order.items.reduce((sum, item) => sum + item.qty, 0)}</td>
                        <td className="px-6 py-4 font-bold">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
                            order.status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                            order.status === "processing" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Orders</th>
                      <th className="px-6 py-4 font-medium">Joined</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Demo User", email: "demo@example.com", orders: 2, joined: "2023-11-10" },
                      { name: "Alice Smith", email: "alice@example.com", orders: 5, joined: "2023-08-22" },
                      { name: "Bob Jones", email: "bob@example.com", orders: 1, joined: "2024-01-15" },
                      { name: "Charlie Brown", email: "charlie@example.com", orders: 0, joined: "2024-02-01" },
                    ].map((cust, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                             {cust.name.charAt(0)}
                           </div>
                           {cust.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{cust.email}</td>
                        <td className="px-6 py-4">{cust.orders}</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(cust.joined).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase",
                            cust.orders > 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          )}>
                            {cust.orders > 0 ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge (Optional)</label>
              <input
                type="text"
                placeholder="e.g. New, Sale"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-5 fade-in z-50 font-medium">
          {toast}
        </div>
      )}
    </div>
  );
}
