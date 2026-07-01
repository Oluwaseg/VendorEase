'use client';

import { DEFAULT_PRODUCT_IMAGE_FALLBACK } from '@/lib/image-fallbacks';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface ProductImage {
  url: string;
}

interface ImageGalleryProps {
  images: ProductImage[] | undefined;
  productName: string;
  fallbackImageSrc?: string;
  flashSale?: {
    isActive: boolean;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  };
}

export function ImageGallery({
  images,
  productName,
  fallbackImageSrc,
  flashSale,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const fallbackImage = fallbackImageSrc?.trim() || DEFAULT_PRODUCT_IMAGE_FALLBACK;
  const currentImageSrc = useMemo(
    () => images?.[selectedImage]?.url?.trim() || fallbackImage,
    [fallbackImage, images, selectedImage]
  );
  const [mainImageSrc, setMainImageSrc] = useState(currentImageSrc);

  useEffect(() => {
    setMainImageSrc(currentImageSrc);
  }, [currentImageSrc]);

  if (!images || images.length === 0) {
    return (
      <div className='relative bg-linear-to-br from-muted to-muted/50 rounded-2xl overflow-hidden flex items-center justify-center aspect-square lg:aspect-auto lg:h-[650px] group shadow-lg hover:shadow-xl transition-shadow duration-300'>
        <Image
          src={fallbackImage}
          alt={productName}
          width={650}
          height={650}
          priority
          className='object-contain w-full h-full p-4'
        />
      </div>
    );
  }

  return (
    <div className='space-y-4 flex flex-col'>
      {/* Main Image Container */}
      <div className='relative bg-linear-to-br from-muted to-muted/50 rounded-2xl overflow-hidden flex items-center justify-center aspect-square lg:aspect-auto lg:h-[650px] group shadow-lg hover:shadow-xl transition-shadow duration-300'>
        <Image
          src={mainImageSrc}
          onError={() => {
            if (mainImageSrc !== fallbackImage) {
              setMainImageSrc(fallbackImage);
            }
          }}
          alt={productName}
          width={650}
          height={650}
          priority
          className='object-contain w-full h-full p-4'
        />

        {/* Flash Sale Badge */}
        {flashSale?.isActive && (
          <div className='absolute top-6 right-6 bg-linear-to-r from-red-600 via-red-500 to-pink-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl animate-pulse'>
            <Zap size={18} className='fill-white' />
            <span className='font-bold text-sm'>
              {flashSale.discountType === 'percentage'
                ? `${flashSale.discountValue}% OFF`
                : `$${flashSale.discountValue} OFF`}
            </span>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImage(
                  selectedImage === 0 ? images.length - 1 : selectedImage - 1
                )
              }
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2.5 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:shadow-xl'
              aria-label='Previous image'
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                setSelectedImage(
                  selectedImage === images.length - 1 ? 0 : selectedImage + 1
                )
              }
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2.5 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 shadow-lg hover:shadow-xl'
              aria-label='Next image'
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Counter */}
            <div className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200'>
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className='flex gap-3 overflow-x-auto pb-2 scroll-smooth'>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                selectedImage === idx
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Select image ${idx + 1}`}
            >
              <Image
                src={img.url?.trim() || fallbackImage}
                alt={`${productName} image ${idx + 1}`}
                width={96}
                height={96}
                className='object-cover w-full h-full'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
