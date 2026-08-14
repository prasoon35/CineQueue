import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CineQueue",
  description:
    "Organize and track everything you watch in your own creative way! Take full control over your watchlist with CineQueue.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="mx-auto min-h-screen bg-white px-4">{children}</main>;
}
