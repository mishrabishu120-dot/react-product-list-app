"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { DEMO_ORDERS } from "@/lib/data";
import { formatDate, formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function OrdersPage() {
  const { currentUser, isLoggedIn } = useAuth();
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
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing': 
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Processing</span>;
      case 'shipped': 
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Shipped</span>;
      case 'delivered': 
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Delivered</span>;
      case 'cancelled': 
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</span>;
      default: 
        return null;
    }
  };

  const getStepProgress = (status: string) => {
    if (status === 'cancelled') return -1;
    if (status === 'processing') return 2;
    if (status === 'shipped') return 3;
    if (status === 'delivered') return 4;
    return 1; // placed
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Orders</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'} placed
          </p>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">When you place an order, it will appear here.</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {userOrders.map((order) => {
            const step = getStepProgress(order.status);
            
            return (
              <div key={order.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order <span className="font-mono">#{order.id}</span></p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.date)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {step !== -1 && (
                  <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800 hidden sm:block">
                    <div className="relative max-w-2xl mx-auto">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                        <div style={{ width: `${((step - 1) / 3) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                      </div>
                      <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
                        <span className={step >= 1 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Placed</span>
                        <span className={step >= 2 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Processing</span>
                        <span className={step >= 3 ? 'text-indigo-600 dark:text-indigo-400' : ''}>Shipped</span>
                        <span className={step >= 4 ? 'text-green-600 dark:text-green-400' : ''}>Delivered</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-6 py-4">
                  <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {order.items.map((item) => (
                      <li key={item.id} className="py-4 flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                            <h3 className="line-clamp-1"><Link href={`/products/${item.id}`}>{item.name}</Link></h3>
                            <p className="ml-4 whitespace-nowrap">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm mt-2">
                            <p className="text-gray-500 dark:text-gray-400">Qty {item.qty}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-end text-sm">
                    <div className="w-full sm:w-64 space-y-2">
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
                      </div>
                      {order.discount !== undefined && order.discount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Discount</span>
                          <span>-{formatPrice(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-500 dark:text-gray-400 pb-2">
                        <span>Tax</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700 text-base">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
