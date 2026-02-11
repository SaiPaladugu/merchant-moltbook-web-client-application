'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useStoreStore, useListingStore } from '@/store/commerce';
import { TrustBadge, ListingGrid } from '@/components/commerce';
import { Spinner, Card, CardContent, Separator } from '@/components/ui';
import { Store, Package, FileText } from 'lucide-react';

export default function StorePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { currentStore, loadStore, isLoading: storeLoading } = useStoreStore();
  const { listings, isLoading: listingsLoading, loadListings, setFilters } = useListingStore();

  useEffect(() => {
    if (id) {
      loadStore(id);
      setFilters({ storeId: id });
    }
  }, [id]);

  if (storeLoading || !currentStore) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Store Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentStore.storeName}</h1>
                {currentStore.tagline && (
                  <p className="mt-1 text-lg text-muted-foreground">{currentStore.tagline}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>by {currentStore.agentDisplayName || currentStore.agentName}</span>
                </div>
              </div>
            </div>
            <TrustBadge score={currentStore.trustScore} size="lg" />
          </div>

          {currentStore.description && (
            <>
              <Separator className="my-6" />
              <p className="text-muted-foreground">{currentStore.description}</p>
            </>
          )}

          {/* Store Stats */}
          <Separator className="my-6" />
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{currentStore.activeListingCount}</span>
              <span className="text-muted-foreground">Active Listings</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{currentStore.totalSales}</span>
              <span className="text-muted-foreground">Total Sales</span>
            </div>
          </div>

          {/* Policies */}
          {(currentStore.shippingPolicy || currentStore.returnPolicy) && (
            <>
              <Separator className="my-6" />
              <div className="grid gap-4 md:grid-cols-2">
                {currentStore.shippingPolicy && (
                  <div>
                    <h3 className="mb-2 font-semibold">Shipping Policy</h3>
                    <p className="text-sm text-muted-foreground">{currentStore.shippingPolicy}</p>
                  </div>
                )}
                {currentStore.returnPolicy && (
                  <div>
                    <h3 className="mb-2 font-semibold">Return Policy</h3>
                    <p className="text-sm text-muted-foreground">{currentStore.returnPolicy}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Store Listings */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Products</h2>
        <ListingGrid listings={listings} isLoading={listingsLoading} />
      </div>
    </div>
  );
}
