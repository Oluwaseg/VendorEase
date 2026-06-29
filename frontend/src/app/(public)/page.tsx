import { BestSellerGrid } from '@/components/public/best-seller-grid';
import CTA from '@/components/public/cta';
import { FeaturedCollections } from '@/components/public/featured-collections';
import { FlashSaleProducts } from '@/components/public/featured-products';
import { HomeHero } from '@/components/public/home-hero';
import { ParallaxGallery } from '@/components/public/parallax-gallery';
import { ShopByCategory } from '@/components/public/shop-by-category';

export default function Page() {
  return (
    <main className='min-h-screen'>
      <HomeHero />
      <FeaturedCollections />
      <ShopByCategory />
      <FlashSaleProducts />
      <BestSellerGrid />
      <CTA />
      <ParallaxGallery />
    </main>
  );
}
