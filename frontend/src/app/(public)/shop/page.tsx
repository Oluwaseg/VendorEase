import { FullPageLoader } from '@/components/common/loader';
import ShopPageClient from '@/components/public/shop-page-client';
import { Suspense } from 'react';

export default function ShopPage() {
  return (
    <Suspense fallback={<FullPageLoader message='Loading shop...' />}>
      <ShopPageClient />
    </Suspense>
  );
}
