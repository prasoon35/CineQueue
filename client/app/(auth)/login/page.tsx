"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PasswordInput from "@/components/password-input";
import RouteProtector from "@/middleware/routematcher";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", //for accessing httpOnly refresh token cookie
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "User not found") {
        setError(data.error + "! Signup first to create an account");
        setTimeout(() => {
          router.push("/signup");
        }, 1200);
      }
      if (data.error === "REFRESH_EXPIRED") router.push("/login");
      setError(data.error || "Login failed");
    } else {
      setMessage(data.message || "Login successful!");
      const accessToken = res.headers?.get("Authorization");
      if (accessToken) {
        // Store all app data under 'kineq' key
        const appData = {
          accesstoken: accessToken, // key is 'accesstoken', value is the token
          // Add more properties here as needed (e.g., user info)
        };
        localStorage.setItem("kineq", JSON.stringify(appData));
        window.dispatchEvent(new Event("authChanged"));
      }
      setMessage("Login successful!");
      setTimeout(() => {
        router.push("/watchlist");
      }, 1200); // Show message for 1.2 seconds before redirect
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm mx-auto mt-20 p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5"
    >
      <RouteProtector />
      {/* Header */}
      <div className="mb-1 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Log in to your CineQueue account
        </p>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success Message */}
      {message && !error && (
        <div className="px-3 py-2 rounded-lg bg-emerald-50 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="mt-1 w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        Log in <ArrowRight className="w-4 h-4" />
      </button>

      <div className="text-center flex flex-col gap-2 pt-1">
        <span className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-emerald-800 font-medium hover:underline"
          >
            Sign up
          </a>
        </span>
        <span className="text-sm text-gray-500">
          <a
            href="/forget-password"
            className="text-emerald-800 font-medium hover:underline"
          >
            Forgot password?
          </a>
        </span>
      </div>
    </form>
  );
}
