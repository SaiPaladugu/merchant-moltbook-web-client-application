import { create } from 'zustand';
import type {
  Store,
  Listing,
  Offer,
  Order,
  ActivityEvent,
  LeaderboardEntry,
} from '@/types/commerce';
import { commerceApi } from '@/lib/commerce-api';

// Store Store
interface StoreStore {
  stores: Store[];
  currentStore: Store | null;
  isLoading: boolean;
  hasMore: boolean;
  offset: number;
  error: string | null;

  loadStores: (reset?: boolean) => Promise<void>;
  loadStore: (id: string) => Promise<void>;
  setCurrentStore: (store: Store | null) => void;
  createStore: (data: any) => Promise<Store>;
  updatePolicies: (id: string, data: any) => Promise<Store>;
  loadMore: () => Promise<void>;
}

export const useStoreStore = create<StoreStore>((set, get) => ({
  stores: [],
  currentStore: null,
  isLoading: false,
  hasMore: true,
  offset: 0,
  error: null,

  loadStores: async (reset = false) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;
      const response = await commerceApi.getStores({ limit: 50, offset });

      set({
        stores: reset ? response.data : [...get().stores, ...response.data],
        hasMore: response.pagination.hasMore,
        offset: offset + response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stores';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load stores:', err);
    }
  },

  loadStore: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const store = await commerceApi.getStore(id);
      set({ currentStore: store, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load store';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load store:', err);
    }
  },

  setCurrentStore: (store) => set({ currentStore: store }),

  createStore: async (data) => {
    const store = await commerceApi.createStore(data);
    set({ stores: [store, ...get().stores] });
    return store;
  },

  updatePolicies: async (id, data) => {
    const store = await commerceApi.updateStorePolicies(id, data);
    set({
      stores: get().stores.map(s => (s.id === id ? store : s)),
      currentStore: get().currentStore?.id === id ? store : get().currentStore,
    });
    return store;
  },

  loadMore: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadStores();
  },
}));

// Listing Store
interface ListingStore {
  listings: Listing[];
  currentListing: Listing | null;
  isLoading: boolean;
  hasMore: boolean;
  offset: number;
  error: string | null;
  filters: {
    storeId?: string;
    status?: string;
    search?: string;
  };

  loadListings: (reset?: boolean) => Promise<void>;
  loadListing: (id: string) => Promise<void>;
  setCurrentListing: (listing: Listing | null) => void;
  setFilters: (filters: any) => void;
  createListing: (storeId: string, data: any) => Promise<Listing>;
  updatePrice: (id: string, data: any) => Promise<Listing>;
  loadMore: () => Promise<void>;
}

export const useListingStore = create<ListingStore>((set, get) => ({
  listings: [],
  currentListing: null,
  isLoading: false,
  hasMore: true,
  offset: 0,
  error: null,
  filters: {},

  loadListings: async (reset = false) => {
    const { isLoading, filters } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;

      // Declare response outside to make it accessible later
      let response;
      let listingsData: Listing[];

      if (filters.search) {
        // Fetch more items for client-side filtering
        response = await commerceApi.getListings({
          storeId: filters.storeId,
          status: filters.status,
          limit: 100,
          offset: 0,
        });

        // Filter by search query
        const searchLower = filters.search.toLowerCase();
        listingsData = response.data.filter(listing =>
          listing.product.title.toLowerCase().includes(searchLower) ||
          listing.product.description.toLowerCase().includes(searchLower)
        );
      } else {
        // Normal pagination without search
        response = await commerceApi.getListings({
          ...filters,
          limit: 25,
          offset,
        });
        listingsData = response.data;
      }

      set({
        listings: reset ? listingsData : [...get().listings, ...listingsData],
        hasMore: filters.search ? false : response.pagination.hasMore,
        offset: offset + listingsData.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load listings';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load listings:', err);
    }
  },

  loadListing: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const listing = await commerceApi.getListing(id);
      set({ currentListing: listing, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load listing';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load listing:', err);
    }
  },

  setCurrentListing: (listing) => set({ currentListing: listing }),

  setFilters: (filters) => {
    set({ filters, listings: [], offset: 0, hasMore: true });
    get().loadListings(true);
  },

  createListing: async (storeId, data) => {
    const listing = await commerceApi.createListing(storeId, data);
    set({ listings: [listing, ...get().listings] });
    return listing;
  },

  updatePrice: async (id, data) => {
    const listing = await commerceApi.updateListingPrice(id, data);
    set({
      listings: get().listings.map(l => (l.id === id ? listing : l)),
      currentListing: get().currentListing?.id === id ? listing : get().currentListing,
    });
    return listing;
  },

  loadMore: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadListings();
  },
}));

// Offer Store
interface OfferStore {
  offers: Offer[]; // Customer's offers
  storeOffers: Offer[]; // Merchant's incoming offers
  currentOffer: Offer | null;
  isLoading: boolean;
  hasMore: boolean;
  offset: number;
  error: string | null;

  loadMyOffers: (reset?: boolean) => Promise<void>;
  loadStoreOffers: (storeId: string, reset?: boolean) => Promise<void>;
  loadOffer: (id: string) => Promise<void>;
  createOffer: (listingId: string, data: any) => Promise<Offer>;
  acceptOffer: (id: string, data?: any) => Promise<Offer>;
  rejectOffer: (id: string, data?: any) => Promise<Offer>;
  loadMore: () => Promise<void>;
}

export const useOfferStore = create<OfferStore>((set, get) => ({
  offers: [],
  storeOffers: [],
  currentOffer: null,
  isLoading: false,
  hasMore: true,
  offset: 0,
  error: null,

  loadMyOffers: async (reset = false) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;
      const response = await commerceApi.getMyOffers({ limit: 50, offset });

      set({
        offers: reset ? response.data : [...get().offers, ...response.data],
        hasMore: response.pagination.hasMore,
        offset: offset + response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load offers';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load my offers:', err);
    }
  },

  loadStoreOffers: async (storeId: string, reset = false) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;
      const response = await commerceApi.getStoreOffers(storeId, { limit: 50, offset });

      set({
        storeOffers: reset ? response.data : [...get().storeOffers, ...response.data],
        hasMore: response.pagination.hasMore,
        offset: offset + response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load store offers';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load store offers:', err);
    }
  },

  loadOffer: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const offer = await commerceApi.getOffer(id);
      set({ currentOffer: offer, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load offer';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load offer:', err);
    }
  },

  createOffer: async (listingId, data) => {
    const offer = await commerceApi.createOffer(listingId, data);
    set({ offers: [offer, ...get().offers] });
    return offer;
  },

  acceptOffer: async (id, data) => {
    const offer = await commerceApi.acceptOffer(id, data);
    set({
      offers: get().offers.map(o => (o.id === id ? offer : o)),
      storeOffers: get().storeOffers.map(o => (o.id === id ? offer : o)),
      currentOffer: get().currentOffer?.id === id ? offer : get().currentOffer,
    });
    return offer;
  },

  rejectOffer: async (id, data) => {
    const offer = await commerceApi.rejectOffer(id, data);
    set({
      offers: get().offers.map(o => (o.id === id ? offer : o)),
      storeOffers: get().storeOffers.map(o => (o.id === id ? offer : o)),
      currentOffer: get().currentOffer?.id === id ? offer : get().currentOffer,
    });
    return offer;
  },

  loadMore: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadMyOffers();
  },
}));

// Order Store
interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  isPurchasing: boolean;
  hasMore: boolean;
  offset: number;
  error: string | null;

  loadMyOrders: (reset?: boolean) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  purchaseDirect: (listingId: string) => Promise<Order>;
  purchaseFromOffer: (offerId: string) => Promise<Order>;
  loadMore: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  isPurchasing: false,
  hasMore: true,
  offset: 0,
  error: null,

  loadMyOrders: async (reset = false) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;
      const response = await commerceApi.getMyOrders({ limit: 50, offset });

      set({
        orders: reset ? response.data : [...get().orders, ...response.data],
        hasMore: response.pagination.hasMore,
        offset: offset + response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orders';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load orders:', err);
    }
  },

  loadOrder: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await commerceApi.getOrder(id);
      set({ currentOrder: order, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load order';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load order:', err);
    }
  },

  purchaseDirect: async (listingId: string) => {
    set({ isPurchasing: true, error: null });
    try {
      const order = await commerceApi.purchaseDirect({ listingId });
      set({ orders: [order, ...get().orders], isPurchasing: false, error: null });
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      set({ isPurchasing: false, error: errorMessage });
      throw err;
    }
  },

  purchaseFromOffer: async (offerId: string) => {
    set({ isPurchasing: true, error: null });
    try {
      const order = await commerceApi.purchaseFromOffer({ offerId });
      set({ orders: [order, ...get().orders], isPurchasing: false, error: null });
      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      set({ isPurchasing: false, error: errorMessage });
      throw err;
    }
  },

  loadMore: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadMyOrders();
  },
}));

// Activity Store
interface ActivityStore {
  events: ActivityEvent[];
  isLoading: boolean;
  hasMore: boolean;
  offset: number;
  error: string | null;

  loadActivity: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
  events: [],
  isLoading: false,
  hasMore: true,
  offset: 0,
  error: null,

  loadActivity: async (reset = false) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const offset = reset ? 0 : get().offset;
      const response = await commerceApi.getActivity({ limit: 50, offset });

      set({
        events: reset ? response.data : [...get().events, ...response.data],
        hasMore: response.pagination.hasMore,
        offset: offset + response.data.length,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activity';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load activity:', err);
    }
  },

  loadMore: async () => {
    const { hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadActivity();
  },
}));

// Leaderboard Store
interface LeaderboardStore {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;

  loadLeaderboard: (limit?: number) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  loadLeaderboard: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const entries = await commerceApi.getLeaderboard({ limit });
      set({ entries, isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load leaderboard';
      set({ isLoading: false, error: errorMessage });
      console.error('Failed to load leaderboard:', err);
    }
  },
}));
