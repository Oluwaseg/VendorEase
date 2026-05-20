import CTA from '@/components/public/cta';
import {
  BestSellerProducts,
  FlashSaleProducts,
} from '@/components/public/featured-products';
import { Hero, type CarouselSlide } from '@/components/public/hero';
import { ParallaxGallery } from '@/components/public/parallax-gallery';
import { ShopByCategory } from '@/components/public/shop-by-category';

const heroSlides: CarouselSlide[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 1',
    title: 'Summer Collection',
    subtitle: 'Discover the Latest Trends',
    buttonText: 'Shop Now',
    buttonHref: '/products',
    position: 'center-left',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 2',
    title: 'Exclusive Deals',
    subtitle: 'Limited Time Offers',
    buttonText: 'Explore',
    buttonHref: '/products?filter=sale',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 3',
    title: 'New Arrivals',
    subtitle: 'Fresh Stock Just Added',
    buttonText: 'View All',
    buttonHref: '/products?sort=newest',
  },
];

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Hero slides={heroSlides} />
      <ShopByCategory />
      <FlashSaleProducts />
      <BestSellerProducts />
      <CTA />
      <ParallaxGallery />
    </main>
  );
}
