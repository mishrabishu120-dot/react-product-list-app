"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { DEMO_ORDERS } from "@/lib/data";
import { formatDate, formatPrice } from "@/lib/utils";
import { Order } from "@/types";

export default function ProfilePage() {
  const { currentUser, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!currentUser || !isLoggedIn) {
    return null;
  }

  // Filter orders by customer name in the demo data
  const userOrders = DEMO_ORDERS.filter(
    (order) => order.address.fullName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all app data? You will be logged out.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-5xl flex-shrink-0 shadow-inner">
          {currentUser.avatar || "👤"}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{currentUser.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-600 dark:text-gray-400">{currentUser.email}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
              {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{currentUser.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-medium text-gray-900 dark:text-white">{currentUser.joined}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order updates and promotions</p>
                </div>
                <div className="w-11 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Theme Preference</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Syncs with system</p>
                </div>
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
            </div>
            <div className="p-6 space-y-4">
              <Button variant="secondary" className="w-full justify-center text-gray-700 dark:text-gray-300" onClick={logout}>
                Sign Out
              </Button>
              <Button variant="danger" className="w-full justify-center" onClick={handleClearData}>
                Clear All Data
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h3>
              <Link href="/orders" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                View all orders
              </Link>
            </div>
            {userOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3">Order ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          #{order.id.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4">{formatDate(order.date)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} capitalize`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatPrice(order.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                <p>No orders found. Time to go shopping!</p>
                <Link href="/products" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">
                  Browse products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
