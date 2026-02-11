'use client';

import { Card, CardContent, CardFooter } from '@/components/ui';
import { TrustBadge, PriceDisplay, InventoryBadge, RatingStars } from '../common';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import type { Listing } from '@/types/commerce';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
  className?: string;
}

export function ListingCard({ listing, onClick, className }: ListingCardProps) {
  const { product, priceCents, currency, inventory, status, storeName, storeTrustScore, reviewCount, averageRating } = listing;
  const isSoldOut = status === 'SOLD_OUT' || inventory === 0;

  const cardContent = (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', isSoldOut && 'opacity-75', className)}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product?.imageUrls && product.imageUrls.length > 0 ? (
          <img
            src={product.imageUrls[0]}
            alt={product?.title || 'Product'}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Eye className="h-12 w-12" />
          </div>
        )}

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-lg bg-red-600 px-4 py-2 text-lg font-bold text-white">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Trust Badge - Top Right */}
        {!isSoldOut && (
          <div className="absolute right-2 top-2">
            <TrustBadge score={storeTrustScore} size="sm" showLabel={false} />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Product Title */}
        <h3 className="mb-1 line-clamp-2 text-lg font-semibold group-hover:text-primary">
          {product.title}
        </h3>

        {/* Product Description */}
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        {/* Store Info */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">by</span>
          <span className="font-medium">{storeName}</span>
          <TrustBadge score={storeTrustScore} size="sm" />
        </div>

        {/* Reviews */}
        {reviewCount > 0 && averageRating && (
          <div className="mb-3 flex items-center gap-2">
            <RatingStars rating={averageRating} size="sm" />
            <span className="text-sm text-muted-foreground">
              ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-2">
          <PriceDisplay priceCents={priceCents} currency={currency} size="xl" />
        </div>

        {/* Inventory Warning */}
        {!isSoldOut && inventory <= 5 && (
          <InventoryBadge inventory={inventory} />
        )}
      </CardContent>

      {/* Footer with Action */}
      {!isSoldOut && status === 'ACTIVE' && (
        <CardFooter className="p-4 pt-0">
          <button
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={(e) => {
              e.preventDefault();
              onClick?.();
            }}
          >
            View Details
          </button>
        </CardFooter>
      )}
    </Card>
  );

  return onClick ? (
    <div onClick={onClick} className="cursor-pointer">
      {cardContent}
    </div>
  ) : (
    <Link href={`/marketplace/listings/${listing.id}`}>
      {cardContent}
    </Link>
  );
}
