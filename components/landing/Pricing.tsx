"use client";

import { Check } from "@phosphor-icons/react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for early-stage founders",
    features: [
      "Up to 100 nodes/tasks/month",
      "Basic AI suggestions",
      "Daily summary",
      "1 workspace",
    ],
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "Built for serious solo builders",
    features: [
      "Unlimited notes & tasks",
      "Advanced AI features",
      "Goal tracking & reminders",
      "Project timelines",
      "3 workspaces",
    ],
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For fast-moving teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared notes/tasks",
      "Admin & permissions",
      "Slack/Calendar integration",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-300 mb-6 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          Pricing
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
          Start Smart. Scale Fast.
        </h2>
        
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you&apos;re a solo founder or growing team, there&apos;s a plan to help you stay productive and focused.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`
              relative p-8 rounded-3xl border transition-all duration-300 group
              ${plan.popular 
                ? "bg-white/5 border-orange-500/50 shadow-lg shadow-orange-500/10 scale-105 md:scale-110 z-20" 
                : "bg-[#050608] border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
              }
            `}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/20">
                Popular
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-zinc-500 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="flex items-end justify-center gap-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-zinc-500 text-lg mb-1">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-zinc-300">
                  <Check size={16} weight="bold" className="text-white mt-0.5 shrink-0" />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-3 rounded-xl font-medium transition-all duration-200
              ${plan.popular 
                ? "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10" 
                : "bg-white/10 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-white/5"
              }
            `}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
