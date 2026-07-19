"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, isAdmin } = useAuth();
  
  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      router.push(isAdmin ? "/admin" : "/");
    }
  }, [isLoggedIn, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const success = await login(email, password);
      
      if (!success) {
        setError("Invalid email or password");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError("An error occurred during login");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const autofill = (type: "user" | "admin") => {
    if (type === "user") {
      setRole("user");
      setEmail("user@shopflow.com");
      setPassword("user123");
    } else {
      setRole("admin");
      setEmail("admin@shopflow.com");
      setPassword("admin123");
    }
  };
  
  const resetDatabase = () => {
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-400/20 blur-3xl" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span>🛍️</span> ShopFlow
            </h2>
            <p className="mt-2 text-indigo-100 text-sm">Sign in to your account</p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex-1 text-center py-3 border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium">
                Sign In
              </div>
              <Link href="/register" className="flex-1 text-center py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors">
                Register
              </Link>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === "user"
                    ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                👤 Shop Customer
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  role === "admin"
                    ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                🛡️ Admin Dashboard
              </button>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6 text-sm border border-indigo-100 dark:border-indigo-800/50">
              <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">Demo Credentials:</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">User: user@shopflow.com / user123</span>
                  <button type="button" onClick={() => autofill("user")} className="text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:underline">Auto-fill</button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-xs">Admin: admin@shopflow.com / admin123</span>
                  <button type="button" onClick={() => autofill("admin")} className="text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:underline">Auto-fill</button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">✉️</span>
                  </div>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">🔒</span>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <div className={`bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm flex items-center gap-2 border border-red-200 dark:border-red-800 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  `Login as ${role === 'admin' ? 'Admin' : 'User'}`
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>Demo app — no real data stored.</p>
          <button onClick={resetDatabase} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Reset Database
          </button>
        </div>
      </div>
      
      {/* Shake animation styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}} />
    </div>
  );
}
