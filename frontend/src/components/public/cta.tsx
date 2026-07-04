import Link from 'next/link';

export default function CTA() {
  return (
    <section className='grid min-h-[350px] grid-cols-1 overflow-hidden rounded-4xl md:grid-cols-2'>
      {/* LEFT IMAGE SIDE */}
      <div className='relative h-[300px] md:h-full'>
        <img
          src='https://www.puravidabracelets.com/cdn/shop/files/b8bf10fd03b636ed51d4907bbc15033eea695357-min.jpg?v=1750108751&width=1000'
          alt='Curated fashion and lifestyle collection'
          className='h-full w-full object-cover transition-transform duration-[4000ms] hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-black/10 to-transparent' />
        {/* Vertical Divider */}
        <div className='absolute top-0 right-0 flex h-full w-12 items-center justify-center overflow-hidden bg-brand/20 backdrop-blur-sm'>
          <div className='animate-marquee-vertical whitespace-nowrap text-sm font-medium tracking-[0.3em] text-foreground/70 [writing-mode:vertical-rl]'>
            Curated Everyday Pieces • Thoughtfully Chosen • Fresh Arrivals •
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT SIDE */}
      <div className='flex items-center justify-center bg-brand/10 px-8 py-12 md:py-0'>
        <div className='max-w-xl space-y-8'>
          {/* HEADING */}
          <h1 className='font-mono text-5xl leading-none font-bold tracking-tight text-foreground md:text-7xl'>
            Discover{' '}
            <span className='relative inline-block'>
              Style
              <span className='absolute bottom-1 left-0 -z-10 h-3 w-full rounded-full bg-pink-300/80' />
            </span>
            <br />
            That Feels Like You
          </h1>

          {/* PARAGRAPH */}
          <p className='max-w-md text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Explore a curated collection of timeless essentials and standout
            pieces designed to bring comfort, confidence, and personality to
            everyday living.
          </p>

          {/* BUTTON */}
          <Link
            href='/shop'
            className='inline-flex rounded-full bg-accent px-8 py-4 text-sm font-semibold tracking-widest text-accent-foreground uppercase transition-all duration-300 hover:scale-105 hover:shadow-xl'
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
