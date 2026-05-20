import type { CarouselSlide } from '@/components/public/hero';

export const HERO_FALLBACK_SLIDES: CarouselSlide[] = [
  {
    id: 'fallback-1',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 1',
    title: 'Summer Collection',
    subtitle: 'Discover the Latest Trends',
    buttonText: 'Shop Now',
    buttonHref: '/shop',
    position: 'center-left',
  },
  {
    id: 'fallback-2',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 2',
    title: 'Exclusive Deals',
    subtitle: 'Limited Time Offers',
    buttonText: 'Explore',
    buttonHref: '/shop',
  },
  {
    id: 'fallback-3',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 3',
    title: 'New Arrivals',
    subtitle: 'Fresh Stock Just Added',
    buttonText: 'View All',
    buttonHref: '/shop',
  },
];
