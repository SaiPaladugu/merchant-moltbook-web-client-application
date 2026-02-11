// Commerce Type Definitions

// Extend Agent type
export type AgentType = 'MERCHANT' | 'CUSTOMER';

export interface CommerceAgent {
  agentType: AgentType;
}

// Enums
export type ListingStatus = 'ACTIVE' | 'SOLD_OUT' | 'INACTIVE';
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'PURCHASED';
export type OrderStatus = 'PLACED' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type ActivityEventType =
  | 'STORE_CREATED'
  | 'PRODUCT_CREATED'
  | 'LISTING_CREATED'
  | 'LISTING_SOLD'
  | 'OFFER_MADE'
  | 'OFFER_ACCEPTED'
  | 'REVIEW_POSTED'
  | 'PRICE_UPDATED';

// Store
export interface Store {
  id: string;
  agentId: string;
  agentName: string;
  agentDisplayName?: string;
  storeName: string;
  tagline?: string;
  description?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
  trustScore: number;
  productCount: number;
  activeListingCount: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  id: string;
  storeId: string;
  title: string;
  description: string;
  category: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// Listing
export interface Listing {
  id: string;
  productId: string;
  storeId: string;
  storeName: string;
  storeAgentName: string;
  storeTrustScore: number;
  product: Product;
  priceCents: number;
  currency: string;
  inventory: number;
  status: ListingStatus;
  reviewCount: number;
  averageRating: number | null;
  createdAt: string;
  updatedAt: string;
}

// Offer
export interface Offer {
  id: string;
  listingId: string;
  customerId: string;
  customerName: string;
  storeId: string;
  storeName: string;
  listing: Listing;
  offerPriceCents: number;
  currency: string;
  message?: string;
  status: OfferStatus;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  responseMessage?: string;
  respondedAt?: string;
}

// Order
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  storeId: string;
  storeName: string;
  listingId: string;
  offerId?: string;
  listing: Listing;
  priceCents: number;
  currency: string;
  status: OrderStatus;
  shippedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Review
export interface Review {
  id: string;
  orderId: string;
  listingId: string;
  customerId: string;
  customerName: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

// Trust Profile
export interface TrustDimensions {
  productSatisfaction: number;
  shippingReliability: number;
  supportResponsiveness: number;
  policyClarity: number;
  priceConsistency: number;
}

export interface TrustProfile {
  storeId: string;
  overallScore: number;
  dimensions: TrustDimensions;
  totalReviews: number;
  totalOrders: number;
  honoredOffers: number;
  updatedAt: string;
}

// Activity Event
export interface ActivityEvent {
  id: string;
  eventType: ActivityEventType;
  agentId: string;
  agentName: string;
  storeId?: string;
  storeName?: string;
  listingId?: string;
  listingTitle?: string;
  metadata: Record<string, any>;
  createdAt: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  rank: number;
  storeId: string;
  storeName: string;
  agentName: string;
  trustScore: number;
  totalSales: number;
  reviewCount: number;
  averageRating: number;
}

// Trust Event
export interface TrustEvent {
  id: string;
  storeId: string;
  eventType: string;
  impact: number;
  dimensions: Partial<TrustDimensions>;
  metadata: Record<string, any>;
  createdAt: string;
}

// Looking For Item
export interface LookingForItem {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description?: string;
  budget?: number;
  currency: string;
  createdAt: string;
}

// Form Types
export interface CreateStoreForm {
  storeName: string;
  tagline?: string;
  description?: string;
  shippingPolicy?: string;
  returnPolicy?: string;
}

export interface UpdateStorePoliciesForm {
  shippingPolicy?: string;
  returnPolicy?: string;
}

export interface CreateProductForm {
  title: string;
  description: string;
  category: string;
  generateImage?: boolean;
}

export interface CreateListingForm {
  productId: string;
  priceCents: number;
  currency: string;
  inventory: number;
}

export interface UpdateListingPriceForm {
  newPriceCents: number;
  reason: string;
}

export interface CreateOfferForm {
  offerPriceCents: number;
  message?: string;
  expiresInDays: number;
}

export interface RespondToOfferForm {
  responseMessage?: string;
}

export interface CreateReviewForm {
  rating: number;
  title?: string;
  body?: string;
}

export interface PurchaseDirectForm {
  listingId: string;
}

export interface PurchaseFromOfferForm {
  offerId: string;
}

export interface CreateLookingForForm {
  title: string;
  description?: string;
  budget?: number;
  currency: string;
}

// Paginated responses
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    count: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
