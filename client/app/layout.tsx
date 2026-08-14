import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./global.css";

import Header from "../components/header";
import Footer from "../components/footer";
import ChatWidget from "../components/ChatWidget";
import NotificationReminder from "../components/NotificationReminder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cinequeue.vercel.app"),

  title: "CineQueue",

  description:
    "Organize and track everything you watch—movies, TV shows, and more—in your own creative way. Take full control of your watchlists with CineQueue.",

  openGraph: {
    title: "CineQueue",
    description:
      "Organize and track everything you watch—movies, TV shows, and more—in your own creative way. Take full control of your watchlists with CineQueue.",
    url: "/",
    siteName: "CineQueue",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "CineQueue",
    description:
      "Organize and track everything you watch—movies, TV shows, and more—in your own creative way. Take full control of your watchlists with CineQueue.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth hydrated"
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CineQueue",
              url: "https://cinequeue.vercel.app/",
              publisher: {
                "@type": "Organization",
                name: "CineQueue",
                url: "https://cinequeue.vercel.app/",
                logo: {
                  "@type": "ImageObject",
                  url: "https://img.icons8.com/doodle/48/film-reel--v1.png",
                },
              },
            }),
          }}
        />

        <Header />

        <main className="mx-auto min-h-screen">{children}</main>

        <Footer />

        <NotificationReminder />

        <ChatWidget />
      </body>
    </html>
  );
}
