// Commerce API Response Transformers
// Converts backend snake_case responses to frontend camelCase types

import type { Listing, Store, Product } from '@/types/commerce';

// Backend base URL for prepending to image paths
const BACKEND_BASE_URL = process.env.MOLTBOOK_API_URL?.replace('/api/v1', '') || 'https://moltbook-api-production.up.railway.app';

/**
 * Convert relative image path to full URL with fallback to placeholder
 */
function getFullImageUrl(relativePath: string | null | undefined, productId?: string): string | null {
  if (!relativePath) return null;
  // If it's already a full URL, return as-is
  if (relativePath.startsWith('http')) return relativePath;

  // For now, use placeholder images since uploads/ isn't deployed to Railway
  // The database has image paths but the actual files don't exist on production
  if (productId) {
    // Generate a deterministic seed from product ID for consistent images
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash % 1000;

    // Use picsum.photos for nice varied placeholder images
    return `https://picsum.photos/seed/${seed}/600/600`;
  }

  // Fallback to trying the real URL (will 404 but component has fallback UI)
  return `${BACKEND_BASE_URL}${relativePath}`;
}

// Backend listing response format (snake_case, flattened)
interface BackendListing {
  id: string;
  store_id: string;
  product_id: string;
  price_cents: number;
  currency: string;
  inventory_on_hand: number;
  status: string;
  created_at: string;
  updated_at: string;
  product_title: string;
  product_description: string;
  product_category?: string;
  store_name: string;
  store_agent_name?: string;
  owner_merchant_id: string;
  primary_image_url?: string | null;
  store_trust_score?: number;
  review_count?: number;
  average_rating?: number | null;
}

// Backend store response format
interface BackendStore {
  id: string;
  merchant_id: string;
  agent_name?: string;
  agent_display_name?: string;
  store_name: string;
  tagline?: string;
  description?: string;
  shipping_policy?: string;
  return_policy?: string;
  trust_score?: number;
  product_count?: number;
  active_listing_count?: number;
  total_sales?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Transform backend listing response to frontend Listing type
 */
export function transformListing(backendListing: BackendListing): Listing {
  // Convert relative image path to full URL with placeholder fallback
  const fullImageUrl = getFullImageUrl(backendListing.primary_image_url, backendListing.product_id);

  // Create nested product object
  const product: Product = {
    id: backendListing.product_id,
    storeId: backendListing.store_id,
    title: backendListing.product_title,
    description: backendListing.product_description,
    category: backendListing.product_category || 'Uncategorized',
    imageUrls: fullImageUrl ? [fullImageUrl] : [],
    createdAt: backendListing.created_at,
    updatedAt: backendListing.updated_at,
  };

  // Create frontend Listing object
  const listing: Listing = {
    id: backendListing.id,
    productId: backendListing.product_id,
    storeId: backendListing.store_id,
    storeName: backendListing.store_name,
    storeAgentName: backendListing.store_agent_name || backendListing.owner_merchant_id,
    storeTrustScore: backendListing.store_trust_score || 0,
    product,
    priceCents: backendListing.price_cents,
    currency: backendListing.currency,
    inventory: backendListing.inventory_on_hand,
    status: backendListing.status as any,
    reviewCount: backendListing.review_count || 0,
    averageRating: backendListing.average_rating || null,
    createdAt: backendListing.created_at,
    updatedAt: backendListing.updated_at,
  };

  return listing;
}

/**
 * Transform backend store response to frontend Store type
 */
export function transformStore(backendStore: BackendStore): Store {
  return {
    id: backendStore.id,
    agentId: backendStore.merchant_id,
    agentName: backendStore.agent_name || backendStore.merchant_id,
    agentDisplayName: backendStore.agent_display_name,
    storeName: backendStore.store_name,
    tagline: backendStore.tagline,
    description: backendStore.description,
    shippingPolicy: backendStore.shipping_policy,
    returnPolicy: backendStore.return_policy,
    trustScore: backendStore.trust_score || 0,
    productCount: backendStore.product_count || 0,
    activeListingCount: backendStore.active_listing_count || 0,
    totalSales: backendStore.total_sales || 0,
    createdAt: backendStore.created_at,
    updatedAt: backendStore.updated_at,
  };
}

/**
 * Transform paginated listings response
 */
export function transformListingsResponse(backendResponse: any) {
  return {
    data: backendResponse.data.map(transformListing),
    pagination: backendResponse.pagination,
  };
}

/**
 * Transform paginated stores response
 */
export function transformStoresResponse(backendResponse: any) {
  return {
    data: backendResponse.data.map(transformStore),
    pagination: backendResponse.pagination,
  };
}

/**
 * Transform single listing response
 */
export function transformListingResponse(backendResponse: any) {
  return {
    listing: transformListing(backendResponse.listing || backendResponse.data),
  };
}

/**
 * Transform single store response
 */
export function transformStoreResponse(backendResponse: any) {
  return {
    store: transformStore(backendResponse.store || backendResponse.data),
  };
}
