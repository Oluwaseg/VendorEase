import CTA from '@/components/public/cta';
import { FeaturedCollections } from '@/components/public/featured-collections';
import {
  BestSellerProducts,
  FlashSaleProducts,
} from '@/components/public/featured-products';
import { HomeHero } from '@/components/public/home-hero';
import { ShopByCategory } from '@/components/public/shop-by-category';

export default function Page() {
  return (
    <main className='min-h-screen'>
      <HomeHero />
      <FeaturedCollections />
      <ShopByCategory />
      <FlashSaleProducts />
      <BestSellerProducts />
      <CTA />
    </main>
  );
}
