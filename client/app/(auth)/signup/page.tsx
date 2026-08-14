"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import PasswordInput from "@/components/password-input";
import RouteProtector from "@/middleware/routematcher";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFullNameValid = fullName.trim().length > 0;
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;
  const canSubmit = isFullNameValid && isEmailValid && isPasswordValid;

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError(
        "Please fill all fields and satisfy all password conditions.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ fullName, email, password }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        setMessage(data.message || "Signup successful!");
        const accessToken = res.headers?.get("Authorization");
        if (accessToken) {
          const appData = { accesstoken: accessToken };
          localStorage.setItem("kineq", JSON.stringify(appData));
          window.dispatchEvent(new Event("authChanged"));
        }
        setTimeout(() => {
          router.push("/watchlist");
        }, 1200);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="w-full max-w-sm mx-auto mt-16 p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5"
    >
      <RouteProtector />

      {/* Header */}
      <div className="mb-1 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Free forever. Takes less than a minute.
        </p>
      </div>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
        />
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
        <div className="grid grid-cols-2 gap-1.5 text-xs mt-1">
          <span
            className={`px-2 py-1 rounded-md border text-center transition-colors ${hasMinLength ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}
          >
            {hasMinLength ? "✓" : "○"} Min 8 characters
          </span>
          <span
            className={`px-2 py-1 rounded-md border text-center transition-colors ${hasUppercase ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}
          >
            {hasUppercase ? "✓" : "○"} 1 uppercase
          </span>
          <span
            className={`px-2 py-1 rounded-md border text-center transition-colors ${hasLowercase ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}
          >
            {hasLowercase ? "✓" : "○"} 1 lowercase
          </span>
          <span
            className={`px-2 py-1 rounded-md border text-center transition-colors ${hasSpecialChar ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}
          >
            {hasSpecialChar ? "✓" : "○"} 1 special char
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}
      {/* Success */}
      {message && (
        <div className="px-3 py-2 rounded-lg bg-emerald-50 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || loading}
        className="mt-1 w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UserPlus className="w-4 h-4" /> Create account
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="text-emerald-800 font-medium hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
}
