'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCategories } from '@/hooks/use-category';
import { Category } from '@/types/category';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useRef } from 'react';

interface ShopByCategoryProps {
  className?: string;
}

const categoryColors = [
  'bg-cyan-100',
  'bg-orange-100',
  'bg-yellow-100',
  'bg-pink-100',
];

export function ShopByCategory({ className }: ShopByCategoryProps) {
  const { data: categories, isLoading } = useCategories();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  if (isLoading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className='container mx-auto px-4'>
          <h2 className='text-4xl font-bold mb-12'>Shop by Category</h2>
          <div className='h-64 bg-gradient-to-br from-card/50 to-card/30 rounded-xl animate-pulse' />
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  const publishedCategories = categories.filter(
    (category) => category.isPublished
  );

  if (publishedCategories.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className='container mx-auto px-4'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <div className='flex items-center justify-between mb-12'>
            <h2 className='text-4xl font-bold'>Shop by Category</h2>
            <div className='flex gap-4'>
              <CarouselPrevious className='relative inset-0 h-10 w-10 border-2 border-foreground/30 hover:border-foreground/50 rounded-full bg-transparent hover:bg-transparent' />
              <CarouselNext className='relative inset-0 h-10 w-10 border-2 border-foreground/30 hover:border-foreground/50 rounded-full bg-transparent hover:bg-transparent' />
            </div>
          </div>

          <CarouselContent className='-ml-2 md:-ml-4 p-2'>
            {publishedCategories.map((category, index) => (
              <CarouselItem
                key={category._id}
                className='pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4'
              >
                <CategoryCard
                  category={category}
                  colorClass={categoryColors[index % categoryColors.length]}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: Category;
  colorClass: string;
}

function CategoryCard({ category, colorClass }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className='group overflow-hidden rounded-2xl bg-white transition-shadow duration-300 cursor-pointer h-full flex flex-col'>
        {/* Image Section */}
        <div className='h-56 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden'>
          <img
            src={
              category.image ||
              'https://www.puravidabracelets.com/cdn/shop/files/square-image_2_1.jpg?crop=center&height=400&v=1774219636&width=400'
            }
            alt={category.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          />
        </div>

        {/* Category Name Section */}
        <div
          className={`flex-1 flex items-center justify-center px-4 py-3 ${colorClass} transition-colors duration-300`}
        >
          <h3 className='text-lg font-bold text-foreground text-center uppercase tracking-[0.2em]'>
            {category.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
