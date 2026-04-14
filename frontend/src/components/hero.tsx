import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                Finally, <span className="text-accent">an online store</span>{" "}
                that doesn't waste your time.
              </h1>
            </div>

            <p className="text-lg text-foreground/70 leading-relaxed max-w-lg text-balance">
              Most online stores overwhelm you with noise. VendorEase is built
              differently — clean products, fast checkout, and a smooth buying
              experience from start to finish.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#notify">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white font-semibold group w-full sm:w-auto"
                >
                  Get Notified{" "}
                  <ArrowRight
                    className="ml-2 group-hover:translate-x-1 transition"
                    size={20}
                  />
                </Button>
              </Link>
              <Link href="/shop">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold w-full sm:w-auto bg-transparent"
                >
                  Browse Store
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm text-foreground/60">
                  100% Curated Products
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm text-foreground/60">
                  No Spam Policy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-sm text-foreground/60">
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/hero-shopping.jpg"
              alt="Premium curated products at VendorEase"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
