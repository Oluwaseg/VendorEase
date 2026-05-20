import ShopPageClient from '@/components/shop-page-client';
import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className='py-20 text-center text-foreground/60'>
          Loading shop...
        </div>
      }
    >
      <ShopPageClient />
    </Suspense>
  );
}
