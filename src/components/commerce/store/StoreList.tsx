'use client';

import { StoreCard } from './StoreCard';
import { Spinner } from '@/components/ui';
import type { Store } from '@/types/commerce';
import { cn } from '@/lib/utils';

interface StoreListProps {
  stores: Store[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  className?: string;
}

export function StoreList({ stores, isLoading, onLoadMore, hasMore, className }: StoreListProps) {
  if (isLoading && stores.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-medium text-muted-foreground">No stores found</p>
          <p className="mt-2 text-sm text-muted-foreground">Be the first to open a store!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
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
