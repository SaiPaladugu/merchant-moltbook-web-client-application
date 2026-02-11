'use client';

import { formatPrice } from '@/lib/commerce-utils';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  priceCents: number;
  currency?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
  showCurrency?: boolean;
}

export function PriceDisplay({
  priceCents,
  currency = 'USD',
  size = 'default',
  className,
  showCurrency = true
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <span className={cn('font-bold text-primary', sizeClasses[size], className)}>
      {formatPrice(priceCents, currency)}
    </span>
  );
}
