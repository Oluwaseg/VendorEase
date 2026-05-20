'use client';

import { cn } from '@/lib/utils';
import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';
import { ZoomParallax } from './zoom-parallax';

export function ParallaxGallery() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const productImages = [
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
      alt: 'Premium wireless earbuds',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Minimalist desk lamp',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Stainless steel water bottle',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Organic cotton basics',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Premium notebooks',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Phone stand',
    },
    {
      src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',

      alt: 'Everyday essentials',
    },
  ];

  return (
    <section className='relative bg-background'>
      {/* Header Section */}
      <div className='relative flex min-h-[50vh] items-center justify-center overflow-hidden'>
        {/* Radial spotlight background */}
        <div
          aria-hidden='true'
          className={cn(
            'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2',
            'bg-[radial-gradient(ellipse_at_center,rgba(55,65,81,0.15),transparent_50%)]',
            'blur-3xl'
          )}
        />
        <div className='relative z-10 text-center px-4'>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance'>
            Curated Products Gallery
          </h2>
          <p className='text-lg text-foreground/70 max-w-2xl mx-auto text-balance'>
            Scroll down to explore our handpicked collection with an immersive
            parallax effect
          </p>
        </div>
      </div>

      {/* Zoom Parallax Component */}
      <ZoomParallax images={productImages} />

      {/* Footer Section */}
      <div className='relative min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-transparent to-secondary/30'>
        <div className='text-center px-4'>
          <h3 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
            Discover More
          </h3>
          <p className='text-foreground/70 max-w-xl mx-auto mb-8'>
            Browse our complete collection of premium, carefully selected
            products designed for quality and simplicity.
          </p>
          <a
            href='/shop'
            className='inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg'
          >
            Explore All Products
          </a>
        </div>
      </div>
    </section>
  );
}
