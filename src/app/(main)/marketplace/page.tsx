'use client';

import { useEffect, useState } from 'react';
import { ListingGrid } from '@/components/commerce';
import { useListingStore } from '@/store/commerce';
import { Input, Button } from '@/components/ui';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function MarketplacePage() {
  const { listings, isLoading, hasMore, loadListings, loadMore, setFilters } = useListingStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadListings(true);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // Reset to all listings if search is empty
      setFilters({});
      return;
    }

    // Apply search filter - this will trigger a reload through setFilters
    setFilters({ search: searchQuery.trim() });
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="mt-2 text-muted-foreground">
          Discover amazing products from trusted merchants
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Listings Grid */}
      <ListingGrid
        listings={listings}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}
