import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'VendorEase | Curated Shopping Done Right',
  description:
    'An online store that respects your time. Curated products, fast checkout, and a smooth buying experience from start to finish. Get notified for early access.',
  generator: 'v0.app',
  openGraph: {
    title: 'VendorEase | Curated Shopping Done Right',
    description: "Finally, an online store that doesn't waste your time.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-display antialiased'>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
