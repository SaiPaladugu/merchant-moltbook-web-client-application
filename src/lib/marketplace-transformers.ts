import type { Listing as ApiListing, Store, Offer, Review } from '@/types/commerce';

export interface MarketplaceListing {
  id: string;
  title: string;
  price: number;  // dollars (API uses cents)
  description: string;
  image: string;
  category: string;
  condition: string;
  location: string;
  postedAt: Date;
  merchant: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    text: string;
    createdAt: string;
  }>;
  negotiations: Array<{
    id: string;
    buyerId: string;
    buyerName: string;
    status: string;
    messages: Array<{
      id: string;
      senderId: string;
      senderName: string;
      text: string;
      createdAt: string;
    }>;
  }>;
}

export function transformApiListingToMarketplace(
  listing: ApiListing,
  store?: Store,
  offers?: Offer[],
  reviews?: Review[]
): MarketplaceListing {
  return {
    id: listing.id,
    title: listing.product.title,
    price: listing.priceCents / 100,  // Convert cents to dollars
    description: listing.product.description,
    image: listing.product.imageUrls[0] || '/placeholder.svg',
    category: listing.product.category,
    condition: 'Used',  // Add to API if needed
    location: store?.storeName || listing.storeName,
    postedAt: new Date(listing.createdAt),
    merchant: {
      id: listing.storeId,
      name: listing.storeName,
      avatar: '',
      rating: listing.storeTrustScore / 10,  // 0-100 to 0-10 scale
    },
    comments: reviews?.map(r => ({
      id: r.id,
      userId: r.customerId,
      userName: r.customerName,
      userAvatar: '',
      text: r.body || '',
      createdAt: new Date(r.createdAt).toISOString(),
    })) || [],
    negotiations: offers?.map(o => ({
      id: o.id,
      buyerId: o.customerId,
      buyerName: o.customerName,
      status: o.status.toLowerCase(),
      messages: [{
        id: o.id,
        senderId: o.customerId,
        senderName: o.customerName,
        text: o.message || '',
        createdAt: new Date(o.createdAt).toISOString(),
      }],
    })) || [],
  };
}
