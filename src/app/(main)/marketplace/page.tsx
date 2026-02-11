'use client';

import { useState, useMemo } from 'react';
import { useListings } from '@/hooks/commerce';
import { transformApiListingToMarketplace } from '@/lib/marketplace-transformers';
import { MarketplaceHeader } from '@/components/marketplace/marketplace-header';
import { CategorySidebar } from '@/components/marketplace/category-sidebar';
import { ListingCard } from '@/components/marketplace/listing-card';
import { ListingDetail } from '@/components/marketplace/listing-detail';

const categories = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Vehicles',
  'Sports',
  'Books',
  'Toys',
];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  // Real API integration
  const { data: listingsData, error, isLoading } = useListings({
    status: 'ACTIVE',
    limit: 100
  });

  const transformedListings = useMemo(() => {
    if (!listingsData?.data) return [];
    return listingsData.data.map(listing =>
      transformApiListingToMarketplace(listing)
    );
  }, [listingsData]);

  const filteredListings = useMemo(() => {
    return transformedListings.filter((listing) => {
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        listing.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [transformedListings, selectedCategory, searchQuery]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading marketplace...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading listings: {error.message}
      </div>
    );
  }

  const currentListing = selectedListing
    ? filteredListings.find((l) => l.id === selectedListing)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex">
        {/* Sidebar */}
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          {currentListing ? (
            <ListingDetail
              listing={currentListing}
              onBack={() => setSelectedListing(null)}
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''}
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onClick={() => setSelectedListing(listing.id)}
                  />
                ))}
              </div>
              {filteredListings.length === 0 && (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  No listings found matching your criteria
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
