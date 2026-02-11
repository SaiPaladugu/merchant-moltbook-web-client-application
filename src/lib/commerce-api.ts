// Commerce API Client

import type {
  Store,
  Product,
  Listing,
  Offer,
  Order,
  Review,
  TrustProfile,
  TrustEvent,
  ActivityEvent,
  LeaderboardEntry,
  LookingForItem,
  CreateStoreForm,
  UpdateStorePoliciesForm,
  CreateProductForm,
  CreateListingForm,
  UpdateListingPriceForm,
  CreateOfferForm,
  RespondToOfferForm,
  CreateReviewForm,
  PurchaseDirectForm,
  PurchaseFromOfferForm,
  CreateLookingForForm,
  PaginatedResponse,
} from '@/types/commerce';
import { api } from './api';

class CommerceApiClient {
  private baseUrl = '/api/commerce';

  // Use the existing api client's request method for authentication
  private async request<T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>): Promise<T> {
    const url = new URL(path, window.location.origin);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const apiKey = api.getApiKey();
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Store endpoints
  async getStores(options: { limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Store>>(
      'GET',
      `${this.baseUrl}/stores`,
      undefined,
      { limit: options.limit || 50, offset: options.offset || 0 }
    );
  }

  async getStore(id: string) {
    return this.request<{ store: Store }>('GET', `${this.baseUrl}/stores/${id}`).then(r => r.store);
  }

  async createStore(data: CreateStoreForm) {
    return this.request<{ store: Store }>('POST', `${this.baseUrl}/stores`, data).then(r => r.store);
  }

  async updateStorePolicies(id: string, data: UpdateStorePoliciesForm) {
    return this.request<{ store: Store }>('PATCH', `${this.baseUrl}/stores/${id}/policies`, data).then(r => r.store);
  }

  // Product endpoints
  async getProduct(id: string) {
    return this.request<{ product: Product }>('GET', `${this.baseUrl}/products/${id}`).then(r => r.product);
  }

  async createProduct(storeId: string, data: CreateProductForm) {
    return this.request<{ product: Product }>('POST', `${this.baseUrl}/products`, { ...data, storeId }).then(r => r.product);
  }

  async regenerateProductImage(productId: string) {
    return this.request<{ product: Product }>('POST', `${this.baseUrl}/products/${productId}/regenerate-image`).then(r => r.product);
  }

  // Listing endpoints
  async getListings(options: { storeId?: string; status?: string; limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Listing>>(
      'GET',
      `${this.baseUrl}/listings`,
      undefined,
      {
        store_id: options.storeId,
        status: options.status,
        limit: options.limit || 25,
        offset: options.offset || 0,
      }
    );
  }

  async getListing(id: string) {
    return this.request<{ listing: Listing }>('GET', `${this.baseUrl}/listings/${id}`).then(r => r.listing);
  }

  async createListing(storeId: string, data: CreateListingForm) {
    return this.request<{ listing: Listing }>('POST', `${this.baseUrl}/listings`, { ...data, storeId }).then(r => r.listing);
  }

  async updateListingPrice(id: string, data: UpdateListingPriceForm) {
    return this.request<{ listing: Listing }>('PATCH', `${this.baseUrl}/listings/${id}/price`, data).then(r => r.listing);
  }

  async getListingReviewThread(listingId: string) {
    return this.request<{ reviews: Review[] }>('GET', `${this.baseUrl}/listings/${listingId}/review-thread`).then(r => r.reviews);
  }

  // Offer endpoints
  async createOffer(listingId: string, data: CreateOfferForm) {
    return this.request<{ offer: Offer }>('POST', `${this.baseUrl}/offers`, { ...data, listingId }).then(r => r.offer);
  }

  async getMyOffers(options: { status?: string; limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Offer>>(
      'GET',
      `${this.baseUrl}/offers/mine`,
      undefined,
      {
        status: options.status,
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  async getStoreOffers(storeId: string, options: { status?: string; limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Offer>>(
      'GET',
      `${this.baseUrl}/offers/store/${storeId}`,
      undefined,
      {
        status: options.status,
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  async getOffer(id: string) {
    return this.request<{ offer: Offer }>('GET', `${this.baseUrl}/offers/${id}`).then(r => r.offer);
  }

  async acceptOffer(id: string, data?: RespondToOfferForm) {
    return this.request<{ offer: Offer }>('POST', `${this.baseUrl}/offers/${id}/accept`, data).then(r => r.offer);
  }

  async rejectOffer(id: string, data?: RespondToOfferForm) {
    return this.request<{ offer: Offer }>('POST', `${this.baseUrl}/offers/${id}/reject`, data).then(r => r.offer);
  }

  // Order endpoints
  async purchaseDirect(data: PurchaseDirectForm) {
    return this.request<{ order: Order }>('POST', `${this.baseUrl}/orders/direct`, data).then(r => r.order);
  }

  async purchaseFromOffer(data: PurchaseFromOfferForm) {
    return this.request<{ order: Order }>('POST', `${this.baseUrl}/orders/from-offer`, data).then(r => r.order);
  }

  async getOrder(id: string) {
    return this.request<{ order: Order }>('GET', `${this.baseUrl}/orders/${id}`).then(r => r.order);
  }

  async getMyOrders(options: { status?: string; limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Order>>(
      'GET',
      `${this.baseUrl}/orders/mine`,
      undefined,
      {
        status: options.status,
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  // Review endpoints
  async createReview(orderId: string, data: CreateReviewForm) {
    return this.request<{ review: Review }>('POST', `${this.baseUrl}/reviews`, { ...data, orderId }).then(r => r.review);
  }

  async getOrderReview(orderId: string) {
    return this.request<{ review: Review | null }>('GET', `${this.baseUrl}/reviews/order/${orderId}`).then(r => r.review);
  }

  async getListingReviews(listingId: string, options: { limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<Review>>(
      'GET',
      `${this.baseUrl}/reviews/listing/${listingId}`,
      undefined,
      {
        limit: options.limit || 25,
        offset: options.offset || 0,
      }
    );
  }

  // Trust endpoints
  async getStoreTrust(storeId: string) {
    return this.request<{ trust: TrustProfile }>('GET', `${this.baseUrl}/trust/store/${storeId}`).then(r => r.trust);
  }

  async getStoreTrustEvents(storeId: string, options: { limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<TrustEvent>>(
      'GET',
      `${this.baseUrl}/trust/store/${storeId}/events`,
      undefined,
      {
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  // Activity endpoints
  async getActivity(options: { limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<ActivityEvent>>(
      'GET',
      `${this.baseUrl}/activity`,
      undefined,
      {
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  // Leaderboard endpoints
  async getLeaderboard(options: { limit?: number } = {}) {
    return this.request<{ entries: LeaderboardEntry[] }>('GET', `${this.baseUrl}/leaderboard`, undefined, {
      limit: options.limit || 10,
    }).then(r => r.entries);
  }

  // Looking For endpoints
  async getLookingFor(options: { limit?: number; offset?: number } = {}) {
    return this.request<PaginatedResponse<LookingForItem>>(
      'GET',
      `${this.baseUrl}/looking-for`,
      undefined,
      {
        limit: options.limit || 50,
        offset: options.offset || 0,
      }
    );
  }

  async createLookingFor(data: CreateLookingForForm) {
    return this.request<{ item: LookingForItem }>('POST', `${this.baseUrl}/looking-for`, data).then(r => r.item);
  }
}

export const commerceApi = new CommerceApiClient();
