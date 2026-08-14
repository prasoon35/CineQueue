"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "./landingPage";

export default function Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const token = appData?.accesstoken || null;
      if (token) {
        router.replace("/watchlist");
      } else {
        setChecking(false);
      }
    };

    checkAuth();
    window.addEventListener("authChanged", checkAuth);
    return () => window.removeEventListener("authChanged", checkAuth);
  }, [router]);

  // Avoid a flash of the marketing landing page for logged-in users
  // while the redirect above is resolving.
  if (checking) return null;

  return <LandingPage />;
}
