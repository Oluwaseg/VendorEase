'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import * as React from 'react';

import type { HeroTextPosition } from '@/types/hero-position';

export type TextPosition = HeroTextPosition;

export interface CarouselSlide {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  position?: TextPosition;
  showTitle?: boolean;
  showSubtitle?: boolean;
  showButton?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export function Hero({ slides }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <div className='relative w-full overflow-hidden rounded-3xl my-2'>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[plugin.current]}
      >
        <CarouselContent className='m-0'>
          {slides.map((slide) => {
            const showTitle = slide.showTitle !== false;
            const showSubtitle = slide.showSubtitle !== false;
            const showButton = slide.showButton !== false;
            const hasOverlay = showTitle || showSubtitle || showButton;
            const buttonStyle =
              slide.buttonBgColor || slide.buttonTextColor
                ? {
                    backgroundColor: slide.buttonBgColor,
                    color: slide.buttonTextColor,
                  }
                : undefined;

            return (
            <CarouselItem key={slide.id} className='p-0'>
              <div className='relative h-[500px] w-full lg:h-[500px]'>
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className='absolute inset-0 object-cover'
                  priority
                  unoptimized
                />

                {hasOverlay ? (
                  <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40' />
                ) : null}

                {hasOverlay ? (
                <div
                  className={`absolute inset-0 flex px-6 py-12 ${
                    slide.position?.includes('top')
                      ? 'justify-start'
                      : slide.position?.includes('bottom')
                        ? 'justify-end'
                        : 'justify-center'
                  } ${
                    slide.position?.includes('left')
                      ? 'items-start'
                      : slide.position?.includes('right')
                        ? 'items-end'
                        : 'items-center'
                  }`}
                  style={{
                    flexDirection: 'column',
                    justifyContent: slide.position?.includes('top')
                      ? 'flex-start'
                      : slide.position?.includes('bottom')
                        ? 'flex-end'
                        : 'center',
                  }}
                >
                  <div
                    className={`space-y-6 max-w-3xl ${
                      slide.position?.includes('left')
                        ? 'text-left'
                        : slide.position?.includes('right')
                          ? 'text-right'
                          : 'text-center'
                    }`}
                  >
                    {showTitle ? (
                      <h1 className='text-balance font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-white/70'>
                        {slide.title}
                      </h1>
                    ) : null}

                    {showSubtitle ? (
                      <h2 className='text-balance font-serif text-4xl sm:text-5xl lg:text-6xl font-light leading-tight text-white'>
                        {slide.subtitle}
                      </h2>
                    ) : null}

                    {showButton ? (
                      <div className={showTitle || showSubtitle ? 'pt-4' : undefined}>
                        <Button
                          asChild
                          style={buttonStyle}
                          className={
                            buttonStyle
                              ? 'rounded-full px-10 py-4 text-base font-semibold transition-all hover:opacity-90'
                              : 'rounded-full bg-accent px-10 py-4 text-base font-semibold text-accent-foreground hover:bg-accent/90 transition-all'
                          }
                        >
                          <a href={slide.buttonHref}>{slide.buttonText}</a>
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
                ) : null}

                {/* <div className='absolute bottom-6 left-6 right-6 flex items-center justify-between'>
                  <div className='text-sm font-medium text-white/80'>
                    {current} of {count}
                  </div>

                  <div className='flex gap-1'>
                    <CarouselPrevious
                      className='relative top-0 left-0 h-8 w-8 translate-y-0 border border-white/30 bg-transparent text-white hover:bg-white/10'
                      variant='outline'
                    />

                    <CarouselNext
                      className='relative top-0 right-0 h-8 w-8 translate-y-0 border border-white/30 bg-transparent text-white hover:bg-white/10'
                      variant='outline'
                    />
                  </div>
                </div> */}
              </div>
            </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
