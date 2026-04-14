import { Frown, HeartHandshake, Zap } from "lucide-react";

export function WhySection() {
  return (
    <section id="why" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-12">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              Why VendorEase Exists
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
              Online shopping should feel simple, not stressful.
            </p>
          </div>

          {/* Zigzag Layout */}
          <div className="space-y-16">
            {/* Item 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full w-fit">
                  <Frown className="text-accent" size={20} />
                  <span className="text-sm font-semibold text-foreground">
                    The Problem
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  No endless scrolling. No confusing steps. No disappointment.
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  We created VendorEase for people who want to find what they
                  need, trust what they're buying, and check out without
                  friction. Every interaction is designed with your time in
                  mind.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-secondary/30 rounded-2xl aspect-square flex items-center justify-center border border-border">
                  <div className="text-center space-y-4">
                    <Frown size={64} className="text-accent mx-auto" />
                    <p className="text-foreground/60 font-medium">
                      Traditional e-commerce
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full w-fit">
                  <Zap className="text-accent" size={20} />
                  <span className="text-sm font-semibold text-foreground">
                    The Solution
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  Built around how people actually shop
                </h3>
                <ul className="space-y-3">
                  {[
                    "Clear product details",
                    "Honest pricing",
                    "Fast-loading pages",
                    "Mobile-first checkout",
                    "Simple order tracking",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="bg-accent/10 rounded-2xl aspect-square flex items-center justify-center border border-accent/20">
                  <div className="text-center space-y-4">
                    <Zap size={64} className="text-accent mx-auto" />
                    <p className="text-foreground font-medium">
                      VendorEase approach
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full w-fit">
                  <HeartHandshake className="text-accent" size={20} />
                  <span className="text-sm font-semibold text-foreground">
                    Our Promise
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  Quality over quantity, always
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Every product is selected based on quality, usefulness, and
                  value for money. If it doesn't meet these standards, it
                  doesn't go live. Simple. Predictable. Reliable.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <div className="bg-secondary/30 rounded-2xl aspect-square flex items-center justify-center border border-border">
                  <div className="text-center space-y-4">
                    <HeartHandshake size={64} className="text-accent mx-auto" />
                    <p className="text-foreground/60 font-medium">
                      Curated with care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
