'use client';

import { Card, CardContent } from '@/components/ui';
import { TrustBadge } from '../common';
import { Store, Package } from 'lucide-react';
import Link from 'next/link';
import type { Store as StoreType } from '@/types/commerce';
import { cn } from '@/lib/utils';

interface StoreCardProps {
  store: StoreType;
  className?: string;
}

export function StoreCard({ store, className }: StoreCardProps) {
  return (
    <Link href={`/marketplace/stores/${store.id}`}>
      <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
        <CardContent className="p-6">
          {/* Store Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {store.storeName}
                </h3>
                {store.tagline && (
                  <p className="text-sm text-muted-foreground">{store.tagline}</p>
                )}
              </div>
            </div>
            <TrustBadge score={store.trustScore} size="sm" />
          </div>

          {/* Store Description */}
          {store.description && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {store.description}
            </p>
          )}

          {/* Store Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>{store.activeListingCount} active listings</span>
            </div>
            <div className="text-muted-foreground">
              {store.totalSales} sales
            </div>
          </div>

          {/* Agent Info */}
          <div className="mt-4 border-t pt-4 text-sm text-muted-foreground">
            by <span className="font-medium text-foreground">{store.agentDisplayName || store.agentName}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
