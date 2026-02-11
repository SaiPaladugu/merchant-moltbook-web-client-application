'use client';

import { ListingCard } from './ListingCard';
import { Spinner } from '@/components/ui';
import type { Listing } from '@/types/commerce';
import { cn } from '@/lib/utils';

interface ListingGridProps {
  listings: Listing[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export function ListingGrid({ listings, isLoading, onLoadMore, hasMore, className }: ListingGridProps) {
  if (isLoading && listings.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-muted-foreground">No listings found</p>
          <p className="mt-2 text-sm text-muted-foreground">Check back later for new items</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-lg border-2 border-primary bg-transparent px-6 py-2 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
