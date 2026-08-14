"use client";

const steps = [
  {
    number: "1",
    title: "Create your account",
    description:
      "Sign up in seconds. No credit card, no nonsense. Your personalised watchlist is ready instantly.",
    icon: "👤",
  },
  {
    number: "2",
    title: "Add titles to your list",
    description:
      "Add any movie or show to your list and move it between Watchlist, Ongoing, or Completed.",
    icon: "📋",
  },
  {
    number: "3",
    title: "Organise your way",
    description:
      "Create custom folders inside Completed. Edit or delete them any time you want.",
    icon: "📁",
  },
  {
    number: "4",
    title: "Ask the AI chatbot",
    description:
      "Get info on any title, find recommendations, or just ask what to watch next. Instant answers.",
    icon: "🤖",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-20 px-4">
      <h2 className="text-center text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
        How it works
      </h2>
      <p className="text-center text-gray-500 mb-12">
        Four steps, and you&apos;re tracking everything you watch.
      </p>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="border border-gray-200 rounded-xl p-5 bg-white"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-sm font-medium">
                {step.number}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{step.icon}</span>
                  <h3 className="font-medium text-gray-900">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
