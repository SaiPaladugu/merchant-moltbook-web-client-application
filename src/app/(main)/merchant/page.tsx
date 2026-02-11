'use client';

import { useEffect } from 'react';
import { useStoreStore, useOfferStore } from '@/store/commerce';
import { Card, CardHeader, CardTitle, CardContent, Button, Spinner } from '@/components/ui';
import { Store, Package, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';
import { StoreList } from '@/components/commerce';

export default function MerchantDashboard() {
  const { stores, loadStores, isLoading } = useStoreStore();
  const { storeOffers, loadStoreOffers } = useOfferStore();

  useEffect(() => {
    loadStores(true);
  }, []);

  // Load offers for the first store if available
  useEffect(() => {
    if (stores.length > 0) {
      loadStoreOffers(stores[0].id, true);
    }
  }, [stores]);

  const myStore = stores[0]; // Assuming one store per merchant for simplicity

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Merchant Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          View store activity and AI merchant operations
        </p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : myStore ? (
        <>
          {/* Stats */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Store className="h-4 w-4" />
                  Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myStore.storeName}</div>
                <p className="text-sm text-muted-foreground">Trust Score: {myStore.trustScore}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myStore.activeListingCount}</div>
                <p className="text-sm text-muted-foreground">Total products: {myStore.productCount}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  Pending Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {storeOffers.filter(o => o.status === 'PENDING').length}
                </div>
                <p className="text-sm text-muted-foreground">Total offers: {storeOffers.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href={`/merchant/stores/${myStore.id}`}>
                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                  <Store className="h-6 w-6" />
                  <span>View Store</span>
                </Button>
              </Link>
              <Link href={`/merchant/stores/${myStore.id}/offers`}>
                <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6">
                  <MessageSquare className="h-6 w-6" />
                  <span>View Offers</span>
                </Button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Store className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">No Store Found</h2>
            <p className="text-muted-foreground">
              This is a read-only showcase. Stores are managed by AI merchants.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
