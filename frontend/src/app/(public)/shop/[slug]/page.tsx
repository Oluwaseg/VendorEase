'use client';

import {
  InlineEmpty,
  InlineError,
  InlineLoader,
} from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useOtherProducts, useProductBySlug } from '@/hooks/use-product';
import { useCreateReview, useReviewsByProduct } from '@/hooks/use-review';
import { formatPrice } from '@/lib/format-price';
import {
  AlertCircle,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImageGallery } from './image-gallery';
import { OtherProducts } from './other-products';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { user } = useAuth();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, convert } = useCurrency();

  const {
    data: product,
    isLoading: loadingProduct,
    isError: productError,
    refetch,
  } = useProductBySlug(slug || '');

  const { data: reviewsData, isLoading: loadingReviews } = useReviewsByProduct(
    product?._id ?? ''
  );

  const createReview = useCreateReview();

  const reviews = reviewsData?.reviews ?? [];

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const { data: otherProducts = [] } = useOtherProducts(slug || '');

  // Calculate flash sale discount
  const getDiscountedPrice = () => {
    if (!product?.flashSale?.isActive) return product?.basePrice ?? 0;
    const discount = product.flashSale.discountValue;
    if (product.flashSale.discountType === 'percentage') {
      return product.basePrice * (1 - discount / 100);
    }
    return product.basePrice - discount;
  };

  const userReview =
    user &&
    reviews.find(
      (r) => (typeof r.user === 'string' ? r.user : r.user?._id) === user._id
    );

  const isWishlisted = isInWishlist(product?._id || '');

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
    }
  }, [userReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview.mutateAsync({
        productId: product!._id,
        data: {
          rating,
          comment: comment || undefined,
        },
      });
    } catch {
      // error handled in hook
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        quantity,
      });
      setQuantity(1);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.basePrice,
          rating: Number(avgRating),
        });
      }
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (!slug)
    return (
      <InlineError
        icon={<AlertCircle size={48} className='text-destructive/50' />}
        title='Invalid product'
        message='This product link looks broken.'
        backHref='/shop'
        backLabel='Back to shop'
      />
    );
  if (loadingProduct) return <InlineLoader message='Loading product…' />;
  if (productError || !product)
    return (
      <InlineEmpty
        icon={<AlertCircle size={48} className='text-destructive/50' />}
        title='Product not found'
        message='It may have been removed or is no longer available.'
        backHref='/shop'
        backLabel='Browse shop'
        onRetry={() => refetch()}
      />
    );


const handleShare = async () => {
  if (typeof window === 'undefined' || !product) return;

  const url = window.location.href;
  const shareData: ShareData = {
    title: product.name,
    text: product.description
      ? `${product.name} — ${product.description.slice(0, 100)}${product.description.length > 100 ? '...' : ''}`
      : `Check out ${product.name}`,
    url,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    alert('Product link copied to clipboard');
  } catch {
    alert('Unable to share or copy link');
  }
};



  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section with Product Image Gallery */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16'>
          {/* Image Gallery Component */}
          <ImageGallery
            images={product.images}
            productName={product.name}
            flashSale={product.flashSale}
          />

          {/* Product Details - Modern Card Layout */}
          <div className='space-y-6 flex flex-col'>
            {/* Header Section */}
            <div>
              <div className='flex items-start justify-between gap-3 mb-4'>
                <div className='flex-1'>
                  <p className='text-xs font-bold tracking-widest text-primary/80 mb-2 uppercase'>
                    {product.category?.name}
                  </p>
                  <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight'>
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className='p-3 rounded-full hover:bg-primary/10 transition-all duration-200 flex-shrink-0 hover:scale-110'
                >
                  <Heart
                    size={28}
                    className={`transition-all ${
                      isWishlisted
                        ? 'fill-red-500 stroke-red-500'
                        : 'stroke-foreground/60 hover:stroke-foreground'
                    }`}
                  />
                </button>
              </div>

              {/* Rating Bar */}
              <div className='flex items-center gap-3 pt-2'>
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`transition-all ${
                        i < Math.round(Number(avgRating))
                          ? 'fill-accent stroke-accent'
                          : 'stroke-foreground/20'
                      }`}
                    />
                  ))}
                </div>
                <p className='text-sm font-semibold text-foreground/80'>
                  {avgRating}
                </p>
                <p className='text-sm text-foreground/60'>
                  ({reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'})
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className='h-px bg-border' />

            {/* Price & Stock Card */}
            <div className='bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 space-y-4 border border-primary/10'>
              <div className='flex items-end gap-3'>
                <div>
                  <p className='text-sm text-foreground/60 mb-1'>Price</p>
                  <div className='flex items-baseline gap-3'>
                    {product.flashSale?.isActive && (
                      <p className='text-lg font-semibold text-foreground/40 line-through'>
                        {formatPrice(convert(product.basePrice), currency)}
                      </p>
                    )}
                    <p className='text-2xl sm:text-4xl font-bold text-foreground'>
                      {formatPrice(convert(getDiscountedPrice()), currency)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 pt-2'>
                {product.stock > 0 ? (
                  <>
                    <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse' />
                    <p className='text-sm font-semibold text-green-600'>
                      {product.stock} in stock • Ready to ship
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className='text-destructive' />
                    <p className='text-sm font-semibold text-destructive'>
                      Out of stock
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className='text-base text-foreground/80 leading-relaxed'>
              {product.description}
            </p>

            {/* Quantity Selector - Improved */}
            <div className='space-y-3'>
              <label className='text-sm font-semibold text-foreground'>
                Quantity
              </label>
              <div className='flex items-center gap-4'>
                <div className='flex items-center border-2 border-border rounded-xl bg-muted/50 hover:border-primary/50 transition-colors'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='p-2.5 hover:text-primary transition-colors'
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className='w-16 text-center border-0 bg-transparent font-bold text-lg'
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='p-2.5 hover:text-primary transition-colors'
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Prominent */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4'>
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className='bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200'
              >
                Add to Cart
              </Button>
         <Button
  onClick={handleShare}
  variant='outline'
  className='py-6 text-base font-bold rounded-xl border-2 hover:bg-muted transition-all duration-200'
>
  <Share2 size={20} />
  Share
</Button>

            </div>

            {/* Product Info Grid */}
            <div className='grid grid-cols-2 gap-4 pt-6 border-t border-border'>
              {product.sku && (
                <div className='p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors'>
                  <p className='text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider'>
                    SKU
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {product.sku}
                  </p>
                </div>
              )}
              {product.brand && (
                <div className='p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors'>
                  <p className='text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider'>
                    Brand
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {product.brand}
                  </p>
                </div>
              )}
              {product.category && (
                <div className='p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors'>
                  <p className='text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider'>
                    Category
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {product.category?.name}
                  </p>
                </div>
              )}
              {product.subcategory && (
                <div className='p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors'>
                  <p className='text-xs font-bold text-foreground/50 mb-2 uppercase tracking-wider'>
                    Subcategory
                  </p>
                  <p className='text-sm font-semibold text-foreground'>
                    {product.subcategory?.name || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Reviews Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50'>
        <h2 className='text-3xl lg:text-4xl font-bold text-foreground mb-12'>
          Customer Reviews
        </h2>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Review Stats Card */}
          <div className='lg:sticky lg:top-24 h-fit'>
            <div className='bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10 space-y-8'>
              <div>
                <p className='text-sm text-foreground/60 mb-2'>
                  Overall Rating
                </p>
                <h3 className='text-5xl font-bold text-foreground mb-4'>
                  {avgRating}
                </h3>
                <div className='flex gap-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      className={
                        i < Math.round(Number(avgRating))
                          ? 'fill-accent stroke-accent'
                          : 'stroke-foreground/20'
                      }
                    />
                  ))}
                </div>
                <p className='text-sm font-semibold text-foreground/70'>
                  Based on {reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className='space-y-3 border-t border-border pt-6'>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(
                    (r) => r.rating === stars
                  ).length;
                  const percent =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={stars} className='flex items-center gap-3'>
                      <p className='text-sm font-semibold text-foreground/70 w-12'>
                        {stars}★
                      </p>
                      <div className='flex-1 h-2.5 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='h-full bg-gradient-to-r from-accent to-accent/70 transition-all rounded-full'
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className='text-sm font-semibold text-foreground/60 w-8 text-right'>
                        {count}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List & Form */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Existing Reviews */}
            {loadingReviews ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto' />
              </div>
            ) : reviews.length > 0 ? (
              <div className='space-y-4'>
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className='p-6 border border-border/50 rounded-2xl hover:border-primary/30 hover:bg-muted/20 transition-all duration-200 space-y-4 bg-card/30'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                          <p className='font-bold text-foreground'>
                            {(r as any).user?.name || 'Verified Buyer'}
                          </p>
                          <div className='text-xs font-semibold text-foreground/50'>
                            •
                          </div>
                          <p className='text-xs text-foreground/50'>
                            {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className='flex gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < r.rating
                                  ? 'fill-accent stroke-accent'
                                  : 'stroke-foreground/20'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {r.comment && (
                      <p className='text-sm text-foreground/80 leading-relaxed'>
                        {r.comment}
                      </p>
                    )}
                    <div className='flex items-center gap-4 pt-2 border-t border-border/50'>
                      <button className='text-xs font-semibold text-foreground/60 hover:text-primary transition-colors flex items-center gap-1.5'>
                        <ThumbsUp size={16} />
                        Helpful
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 px-6 border-2 border-dashed border-border rounded-2xl'>
                <MessageCircle
                  size={40}
                  className='mx-auto text-foreground/30 mb-3'
                />
                <p className='text-sm font-semibold text-foreground/60'>
                  No reviews yet
                </p>
                <p className='text-xs text-foreground/50 mt-1'>
                  Be the first to review this product!
                </p>
              </div>
            )}

            {/* Enhanced Review Form */}
            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className='border-t border-border/50 pt-8 mt-8 space-y-6 bg-gradient-to-br from-primary/5 to-accent/5 p-8 rounded-2xl border border-primary/10'
              >
                <div>
                  <h3 className='font-bold text-2xl text-foreground mb-1'>
                    {userReview
                      ? '✏️ Update Your Review'
                      : '⭐ Share Your Experience'}
                  </h3>
                  <p className='text-sm text-foreground/60'>
                    Help other customers make informed decisions
                  </p>
                </div>

                {/* Star Rating */}
                <div className='space-y-4'>
                  <label className='text-sm font-bold text-foreground'>
                    Rating
                  </label>
                  <div className='flex gap-4'>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type='button'
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(n)}
                        className='transition-all duration-200 hover:scale-125'
                      >
                        <Star
                          size={40}
                          className={`transition-all ${
                            (hoverRating || rating) >= n
                              ? 'fill-accent stroke-accent'
                              : 'stroke-foreground/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className='text-sm font-semibold text-foreground/70 min-h-6'>
                    {rating === 5 && '⭐ Excellent! You loved it!'}
                    {rating === 4 && '😊 Very Good! Great product'}
                    {rating === 3 && "👍 Good. It's decent"}
                    {rating === 2 && '😐 Fair. Could be better'}
                    {rating === 1 && '😞 Poor. Not happy'}
                  </p>
                </div>

                {/* Comment */}
                <div className='space-y-3'>
                  <label className='text-sm font-bold text-foreground'>
                    Tell us more (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='What did you like or dislike? How is the quality and shipping? Be specific!'
                    maxLength={500}
                    className='w-full p-4 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all duration-200'
                    rows={4}
                  />
                  <p className='text-xs font-semibold text-foreground/50 text-right'>
                    {comment.length}/500
                  </p>
                </div>

                <Button
                  type='submit'
                  disabled={createReview.isPending}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base'
                >
                  {createReview.isPending
                    ? 'Submitting...'
                    : userReview
                      ? 'Update Review'
                      : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <div className='border-t border-border/50 pt-8 text-center py-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10'>
                <MessageCircle
                  size={48}
                  className='mx-auto text-primary/40 mb-4'
                />
                <p className='text-foreground font-semibold mb-2'>
                  Sign in to share your experience
                </p>
                <p className='text-sm text-foreground/60 mb-6'>
                  Your review helps other customers make the right choice
                </p>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl'>
                  Sign in to Review
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Other Products Section - Only displayed if there are products */}
      <OtherProducts products={otherProducts} currentProductId={product?._id} />
    </main>
  );
}
