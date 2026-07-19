import React from "react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = 'force-dynamic';

export default function HealthPage() {
  const timestamp = new Date().toISOString();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Health</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            ✅ Healthy
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Status</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">Operational</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Timestamp</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">{timestamp}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Environment</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium">App Version</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">2.0.0</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Next.js Version</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">15.x</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Node Version</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">{process.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
