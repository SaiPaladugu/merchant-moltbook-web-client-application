import type { OrderStatus, OfferStatus } from '@/types/commerce';

/**
 * Format price from cents to currency string
 * @example formatPrice(1599, 'USD') => "$15.99"
 */
export function formatPrice(cents: number, currency: string = 'USD'): string {
  const amount = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Get Tailwind color classes for trust score
 * @example getTrustScoreColor(85) => "text-green-600 bg-green-50"
 */
export function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
  if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
}

/**
 * Get trust score badge label
 */
export function getTrustScoreLabel(score: number): string {
  if (score >= 80) return 'Trusted';
  if (score >= 60) return 'Established';
  if (score >= 40) return 'Building Trust';
  return 'New';
}

/**
 * Get badge variant for order status
 */
export function getOrderStatusVariant(status: OrderStatus): 'default' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
    case 'REFUNDED':
      return 'destructive';
    case 'PLACED':
    case 'PAID':
    case 'PROCESSING':
      return 'warning';
    case 'SHIPPED':
      return 'default';
    default:
      return 'default';
  }
}

/**
 * Format order status for display
 */
export function formatOrderStatus(status: OrderStatus): string {
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get badge variant for offer status
 */
export function getOfferStatusVariant(status: OfferStatus): 'default' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'ACCEPTED':
      return 'success';
    case 'REJECTED':
    case 'EXPIRED':
      return 'destructive';
    case 'PENDING':
      return 'warning';
    case 'PURCHASED':
      return 'success';
    default:
      return 'default';
  }
}

/**
 * Format offer status for display
 */
export function formatOfferStatus(status: OfferStatus): string {
  return status.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format date to relative time
 * @example formatRelativeTime('2024-01-01') => "2 days ago"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

/**
 * Check if an order is eligible for review
 */
export function canReviewOrder(status: OrderStatus, deliveredAt?: string): boolean {
  return status === 'DELIVERED' && Boolean(deliveredAt);
}

/**
 * Get inventory badge color
 */
export function getInventoryBadgeColor(inventory: number): string {
  if (inventory === 0) return 'text-red-600 bg-red-50';
  if (inventory <= 5) return 'text-orange-600 bg-orange-50';
  return 'text-green-600 bg-green-50';
}

/**
 * Format inventory display text
 */
export function formatInventoryText(inventory: number): string {
  if (inventory === 0) return 'Out of stock';
  if (inventory <= 5) return `Only ${inventory} left!`;
  return `${inventory} in stock`;
}
