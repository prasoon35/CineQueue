"use client";
import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  FolderOpen,
  MessageCircleMore,
  Share2,
  BookOpen,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

/* ── FAQ Accordion Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white"
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        <ChevronDown
          className={`flex-shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

const features = [
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Three simple lists",
    desc: "Plan to Watch, Watching, and Completed. Move titles between them as you go.",
  },
  {
    icon: <FolderOpen className="w-5 h-5" />,
    title: "Custom folders",
    desc: "Group completed titles however you like — by genre, mood, or year.",
  },
  {
    icon: <MessageCircleMore className="w-5 h-5" />,
    title: "Built-in search",
    desc: "Ask for recommendations or reviews right from the app.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Shareable lists",
    desc: "Send a link to your watchlist so friends can see what you're watching.",
  },
];

const steps = [
  {
    step: "1",
    icon: <BookOpen className="w-5 h-5" />,
    title: "Sign up for free",
    desc: "No credit card, no nonsense. Create your account in seconds.",
  },
  {
    step: "2",
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Add titles to your list",
    desc: "Search for any movie or show and drop it into your watchlist.",
  },
  {
    step: "3",
    icon: <FolderOpen className="w-5 h-5" />,
    title: "Categorize & organise",
    desc: "Move titles between Plan to Watch, Watching, and Completed.",
  },
];

const faqs = [
  {
    q: "Is CineQueue completely free?",
    a: "Yes — 100% free, forever. No hidden plans, no paywalls, no ads. Just your watchlist.",
  },
  {
    q: "Do I need to create an account?",
    a: "You will need a quick signup to save your watchlist across devices, but it takes under 30 seconds with no credit card required.",
  },
  {
    q: "What are the 3 watchlist categories?",
    a: "Plan to Watch (your queue), Watching (currently ongoing), and Completed (finished shows you can rate and archive).",
  },
  {
    q: "What kinds of titles can I track?",
    a: "Anything you watch — movies, TV shows, anime, documentaries. If it's something you watch, it fits.",
  },
  {
    q: "Is there a mobile app?",
    a: "Not yet! The web app is fully responsive and works great on mobile. A dedicated app is on the roadmap.",
  },
];

export default function LandingPage() {
  return (
    <div className="w-full bg-white text-gray-900">
      {/* ── Hero ── */}
      <section className="px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
          Track your watchlist
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Organise what you wish to watch, are currently watching, and have
          already completed.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/signup">
            <button className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Get started <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/howitworks">
            <button className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              How it works
            </button>
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-4 py-16 sm:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-10">
            Everything you need, nothing you don&apos;t
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-gray-200 rounded-xl p-5"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                  {icon}
                </div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 py-16 sm:py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-10">
          How it works
        </h2>
        <div className="flex flex-col gap-5">
          {steps.map(({ step, icon, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-sm font-medium">
                {step}
              </div>
              <div>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  {icon} {title}
                </p>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-16 sm:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-10">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 sm:py-20 text-center max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
          Ready to watch smarter?
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Join CineQueue and finally have one tidy place for everything you
          watch. Free. Always.
        </p>
        <Link href="/signup">
          <button className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Get started <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex items-center justify-center gap-5 mt-6 text-xs text-gray-400">
          {["No credit card", "No ads", "Free forever"].map((t) => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
