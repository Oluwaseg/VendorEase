import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Quality First",
    description: "Only the best products make it through our curation process.",
    icon: "✓",
  },
  {
    title: "Usefulness",
    description: "Products that solve real problems and add genuine value.",
    icon: "✓",
  },
  {
    title: "Fair Pricing",
    description: "Honest, transparent pricing with no hidden costs.",
    icon: "✓",
  },
  {
    title: "Fast Checkout",
    description: "Complete your purchase in minutes, not hours.",
    icon: "✓",
  },
  {
    title: "Clear Details",
    description: "Everything you need to know before you buy.",
    icon: "✓",
  },
  {
    title: "Peace of Mind",
    description: "Easy returns and reliable customer support.",
    icon: "✓",
  },
];

export function DifferenceSection() {
  return (
    <section
      id="difference"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30"
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Heading */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">
              What Makes VendorEase Different
            </h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto text-balance">
              VendorEase is not about listing everything. It's about listing the
              right things.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background rounded-xl p-8 border border-border hover:border-accent/50 transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition">
                    <CheckCircle2 className="text-accent" size={24} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-foreground text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* How Shopping Works */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-foreground">
                How Shopping Works
              </h3>
              <p className="text-foreground/60">
                Simple. Predictable. Reliable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2">
              {[
                {
                  step: "1",
                  title: "Browse",
                  desc: "Explore available products",
                },
                { step: "2", title: "Add", desc: "Add what you want to cart" },
                { step: "3", title: "Checkout", desc: "Complete in minutes" },
                { step: "4", title: "Deliver", desc: "We process & deliver" },
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-3">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold mx-auto">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-sm text-foreground/60">{item.desc}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute left-1/2 transform translate-x-1/2 text-accent/30">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product Showcase */}
          <div className="relative rounded-2xl overflow-hidden h-96">
            <Image
              src="/product-showcase.jpg"
              alt="Curated premium products showcase"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Curated with Purpose
                </h3>
                <p className="text-white/80">
                  Every product selected for quality, usefulness & value
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
