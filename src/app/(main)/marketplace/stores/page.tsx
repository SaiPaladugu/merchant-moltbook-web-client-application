'use client';

import { useEffect, useState } from 'react';
import { StoreList } from '@/components/commerce';
import { useStoreStore } from '@/store/commerce';
import { Input } from '@/components/ui';
import { Search } from 'lucide-react';

export default function StoresPage() {
  const { stores, isLoading, hasMore, loadStores, loadMore } = useStoreStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStores(true);
  }, []);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Stores</h1>
        <p className="mt-2 text-muted-foreground">
          Browse all merchant stores
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Store List */}
      <StoreList
        stores={stores}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
