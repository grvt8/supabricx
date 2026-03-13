"use client";

import { Check, Sparkle } from "@phosphor-icons/react";

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
    <section className="w-full max-w-7xl mx-auto px-4 py-24 relative overflow-hidden bg-[var(--color-background)]">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-black/10 text-sm font-medium text-black/60 mb-6 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 bg-orange-500 animate-pulse" />
          Pricing
        </div>
        
        <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-6 leading-tight">
          Start Smart. Scale Fast.
        </h2>
        
        <p className="text-black/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you&apos;re a solo founder or growing team, there&apos;s a plan to help you stay productive and focused.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`
              relative p-8 border transition-all duration-300 group flex flex-col items-center
              ${plan.popular 
                ? "bg-black border-zinc-800 rounded-[32px] scale-105 z-20 shadow-2xl shadow-purple-500/5" 
                : "bg-white border-black/10 rounded-3xl hover:border-black/20"
              }
            `}
          >
            {plan.popular && (
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full border border-[#F85E00] bg-[#FFB563] text-[#F85E00] text-xs font-medium flex items-center gap-1.5">
                <Sparkle weight="fill" />
                Popular
              </div>
            )}

            <div className="text-center mb-8 w-full mt-8">
              <h3 className={`text-4xl font-display font-bold mb-4 ${plan.popular ? "text-white" : "text-black"}`}>{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? "text-zinc-500" : "text-black/60"}`}>{plan.description}</p>
              
              <div className="flex items-end justify-center gap-1">
                <span className={`text-5xl font-bold tracking-tight ${plan.popular ? "text-white" : "text-black"}`}>{plan.price}</span>
                <span className={`text-lg mb-1.5 ${plan.popular ? "text-zinc-500" : "text-black/60"}`}>{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 w-full pl-4">
              {plan.features.map((feature) => (
                <li key={feature} className={`flex items-center gap-3 text-sm ${plan.popular ? "text-zinc-300" : "text-black/70"}`}>
                  <Check size={16} weight="bold" className={`${plan.popular ? "text-white" : "text-black"} shrink-0`} />
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            <button className={`
              w-full py-3.5 font-medium transition-all duration-200 mt-auto
              ${plan.popular 
                ? "bg-white text-black rounded-full hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10" 
                : "bg-black text-white rounded-xl hover:bg-black/80 hover:shadow-lg hover:shadow-black/5"
              }
            `}>
              Get started
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
