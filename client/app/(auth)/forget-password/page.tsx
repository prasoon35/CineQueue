"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import PasswordInput from "@/components/password-input";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;

  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [otpSent, otpTimer]);

  async function handleSendOtp(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/sendResetOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send reset code.");
      } else {
        setMessage(
          data.message ||
            "If an account exists for this email, a reset code has been sent.",
        );
        setOtpSent(true);
        setOtpTimer(120);
      }
    } catch (err) {
      setError("Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!otp || otp.length < 4) {
      setError("Please enter the reset code sent to your email.");
      return;
    }
    if (!isPasswordValid) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a special character.",
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/forgetPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Password reset failed");
      } else {
        setMessage(data.message || "Password reset successful!");
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    } catch (err) {
      setError("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleResetPassword}
      className="w-full max-w-sm mx-auto mt-16 p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-5"
    >
      <div className="mb-1 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          We&apos;ll email you a code to confirm it&apos;s you.
        </p>
      </div>

      {/* Email + Send code */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setOtpSent(false);
              setOtp("");
            }}
            required
            className="flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={loading || !isEmailValid || (otpSent && otpTimer > 0)}
            className={`shrink-0 px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 bg-gray-50 transition-colors ${loading || !isEmailValid || (otpSent && otpTimer > 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
          >
            {otpSent && otpTimer > 0
              ? `Resend (${`0${Math.floor(otpTimer / 60)}`.slice(-2)}:${`0${otpTimer % 60}`.slice(-2)})`
              : otpSent
                ? "Resend"
                : "Send code"}
          </button>
        </div>
      </div>

      {otpSent && (
        <>
          {/* OTP */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Reset code
            </label>
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={8}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition disabled:opacity-50"
              disabled={otpTimer === 0}
            />
            <span
              suppressHydrationWarning={true}
              className={`text-xs font-medium ${otpTimer === 0 ? "text-red-500" : "text-gray-500"}`}
            >
              {otpTimer > 0
                ? `Code expires in ${`0${Math.floor(otpTimer / 60)}`.slice(-2)}:${`0${otpTimer % 60}`.slice(-2)}`
                : "Code expired — click Resend"}
            </span>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              New password
            </label>
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
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
        </>
      )}

      {/* Error */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-sm text-red-700">
          {error}
        </div>
      )}
      {/* Success */}
      {message && !error && (
        <div className="px-3 py-2 rounded-lg bg-emerald-50 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {otpSent && (
        <button
          type="submit"
          disabled={loading || !otp || !isPasswordValid}
          className="mt-1 w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset password <ArrowRight className="w-4 h-4" />
        </button>
      )}

      <div className="text-center">
        <span className="text-sm text-gray-500">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-emerald-800 font-medium hover:underline"
          >
            Log in
          </a>
        </span>
      </div>
    </form>
  );
}
