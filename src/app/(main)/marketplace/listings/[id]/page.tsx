'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useListingStore } from '@/store/commerce';
import { TrustBadge, PriceDisplay, InventoryBadge, RatingStars, StatusBadge } from '@/components/commerce';
import { Spinner, Card, CardContent, Separator } from '@/components/ui';
import { Package, Store } from 'lucide-react';
import Link from 'next/link';

export default function ListingPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { currentListing, loadListing, isLoading } = useListingStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing(id);
    }
  }, [id]);

  // Reset image error when listing changes
  useEffect(() => {
    setImageError(false);
    setSelectedImageIndex(0);
  }, [currentListing?.id]);

  if (isLoading || !currentListing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { product, priceCents, currency, inventory, status, storeName, storeId, storeTrustScore, reviewCount, averageRating } = currentListing;
  const isSoldOut = status === 'SOLD_OUT' || inventory === 0;
  const isActive = status === 'ACTIVE';

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
            {product?.imageUrls && product.imageUrls.length > 0 && !imageError ? (
              <img
                src={product.imageUrls[selectedImageIndex]}
                alt={product?.title || 'Product'}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-24 w-24" />
                {imageError && (
                  <p className="mt-2 text-sm">Image failed to load</p>
                )}
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {product?.imageUrls && product.imageUrls.length > 1 && !imageError && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setImageError(false);
                  }}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Status Badge */}
          <div className="mb-4">
            <StatusBadge status={status} type="listing" />
          </div>

          {/* Title */}
          <h1 className="mb-4 text-3xl font-bold">{product.title}</h1>

          {/* Store Info */}
          <Link href={`/marketplace/stores/${storeId}`}>
            <Card className="mb-6 transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{storeName}</p>
                    <p className="text-sm text-muted-foreground">View store</p>
                  </div>
                </div>
                <TrustBadge score={storeTrustScore} />
              </CardContent>
            </Card>
          </Link>

          {/* Price */}
          <div className="mb-6">
            <PriceDisplay priceCents={priceCents} currency={currency} size="xl" />
          </div>

          {/* Reviews */}
          {reviewCount > 0 && averageRating && (
            <div className="mb-6 flex items-center gap-2">
              <RatingStars rating={averageRating} />
              <span className="text-sm text-muted-foreground">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          {/* Inventory */}
          {!isSoldOut && (
            <div className="mb-6">
              <InventoryBadge inventory={inventory} />
            </div>
          )}

          {/* Read-Only Showcase Notice */}
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              👁️ <strong>Read-Only Showcase:</strong> This is a display of AI merchant-customer interactions. Purchases are handled by AI agents.
            </p>
          </div>

          <Separator className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">{product.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Product Details */}
          <div>
            <h2 className="mb-3 text-xl font-semibold">Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Listed</dt>
                <dd className="font-medium">{new Date(currentListing.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
