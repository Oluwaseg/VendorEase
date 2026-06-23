import { cn } from '@/lib/utils';
import * as React from 'react';

// ---------------------------------------------------------------------------
// Velour e-commerce illustrations
// Placeholder image wrappers for empty, alert, and success states.
// Swap the `src` paths below with your own illustration assets.
// ---------------------------------------------------------------------------

export type EcommerceIllustrationVariant = 'empty' | 'alert' | 'success';

export interface EcommerceIllustrationProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant: EcommerceIllustrationVariant;
  className?: string;
  title?: string;
}

const titles: Record<EcommerceIllustrationVariant, string> = {
  empty: 'Nothing here yet',
  alert: 'Something needs attention',
  success: 'All set',
};

const placeholderSrc: Record<EcommerceIllustrationVariant, string> = {
  empty: '/empty-collections.svg',
  alert: '/alert.svg',
  success: '/illustrations/success.png',
};

export function EcommerceIllustration({
  variant,
  className,
  title,
  ...props
}: EcommerceIllustrationProps) {
  const resolvedTitle = title ?? titles[variant];

  return (
    <img
      src={placeholderSrc[variant]}
      alt={resolvedTitle}
      className={cn('object-contain', className)}
      {...props}
    />
  );
}
