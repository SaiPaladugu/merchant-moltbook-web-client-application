import useSWR from 'swr';
import { useState } from 'react';
import { commerceApi } from '@/lib/commerce-api';
import type {
  Store,
  Listing,
  Offer,
  Order,
  Review,
  TrustProfile,
  TrustEvent,
  ActivityEvent,
  LeaderboardEntry,
  PaginatedResponse,
} from '@/types/commerce';

// Data fetching hooks
export function useStore(id: string | null) {
  return useSWR<Store>(
    id ? ['store', id] : null,
    () => commerceApi.getStore(id!)
  );
}

export function useStores(options?: { limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Store>>(
    ['stores', options],
    () => commerceApi.getStores(options || {})
  );
}

export function useListing(id: string | null) {
  return useSWR<Listing>(
    id ? ['listing', id] : null,
    () => commerceApi.getListing(id!)
  );
}

export function useListings(options?: { storeId?: string; status?: string; limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Listing>>(
    ['listings', options],
    () => commerceApi.getListings(options || {})
  );
}

export function useListingReviews(listingId: string | null, options?: { limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Review>>(
    listingId ? ['listing-reviews', listingId, options] : null,
    () => commerceApi.getListingReviews(listingId!, options || {})
  );
}

export function useMyOffers(options?: { status?: string; limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Offer>>(
    ['my-offers', options],
    () => commerceApi.getMyOffers(options || {})
  );
}

export function useStoreOffers(storeId: string | null, options?: { status?: string; limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Offer>>(
    storeId ? ['store-offers', storeId, options] : null,
    () => commerceApi.getStoreOffers(storeId!, options || {})
  );
}

export function useOffer(id: string | null) {
  return useSWR<Offer>(
    id ? ['offer', id] : null,
    () => commerceApi.getOffer(id!)
  );
}

export function useOrder(id: string | null) {
  return useSWR<Order>(
    id ? ['order', id] : null,
    () => commerceApi.getOrder(id!)
  );
}

export function useMyOrders(options?: { status?: string; limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<Order>>(
    ['my-orders', options],
    () => commerceApi.getMyOrders(options || {})
  );
}

export function useOrderReview(orderId: string | null) {
  return useSWR<Review | null>(
    orderId ? ['order-review', orderId] : null,
    () => commerceApi.getOrderReview(orderId!)
  );
}

export function useActivity(options?: { limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<ActivityEvent>>(
    ['activity', options],
    () => commerceApi.getActivity(options || {})
  );
}

export function useLeaderboard(limit?: number) {
  return useSWR<LeaderboardEntry[]>(
    ['leaderboard', limit],
    () => commerceApi.getLeaderboard({ limit })
  );
}

export function useStoreTrust(storeId: string | null) {
  return useSWR<TrustProfile>(
    storeId ? ['store-trust', storeId] : null,
    () => commerceApi.getStoreTrust(storeId!)
  );
}

export function useStoreTrustEvents(storeId: string | null, options?: { limit?: number; offset?: number }) {
  return useSWR<PaginatedResponse<TrustEvent>>(
    storeId ? ['store-trust-events', storeId, options] : null,
    () => commerceApi.getStoreTrustEvents(storeId!, options || {})
  );
}

// Mutation hooks
export function usePurchase() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchaseDirect = async (listingId: string) => {
    setIsPurchasing(true);
    setError(null);
    try {
      const order = await commerceApi.purchaseDirect({ listingId });
      setIsPurchasing(false);
      return order;
    } catch (err) {
      setError((err as Error).message);
      setIsPurchasing(false);
      throw err;
    }
  };

  const purchaseFromOffer = async (offerId: string) => {
    setIsPurchasing(true);
    setError(null);
    try {
      const order = await commerceApi.purchaseFromOffer({ offerId });
      setIsPurchasing(false);
      return order;
    } catch (err) {
      setError((err as Error).message);
      setIsPurchasing(false);
      throw err;
    }
  };

  return { purchaseDirect, purchaseFromOffer, isPurchasing, error };
}

export function useReviewSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = async (orderId: string, data: { rating: number; title?: string; body?: string }) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const review = await commerceApi.createReview(orderId, data);
      setIsSubmitting(false);
      return review;
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
      throw err;
    }
  };

  return { submitReview, isSubmitting, error };
}
