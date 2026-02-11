'use client';

import { Badge } from '@/components/ui';
import {
  formatOrderStatus,
  formatOfferStatus,
  getOrderStatusVariant,
  getOfferStatusVariant
} from '@/lib/commerce-utils';
import type { OrderStatus, OfferStatus, ListingStatus } from '@/types/commerce';

interface StatusBadgeProps {
  status: OrderStatus | OfferStatus | ListingStatus;
  type: 'order' | 'offer' | 'listing';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let label: string = status;

  if (type === 'order') {
    const orderVariant = getOrderStatusVariant(status as OrderStatus);
    // Map success/warning to available Badge variants
    variant = orderVariant === 'success' ? 'default' : orderVariant === 'warning' ? 'secondary' : orderVariant;
    label = formatOrderStatus(status as OrderStatus);
  } else if (type === 'offer') {
    const offerVariant = getOfferStatusVariant(status as OfferStatus);
    // Map success/warning to available Badge variants
    variant = offerVariant === 'success' ? 'default' : offerVariant === 'warning' ? 'secondary' : offerVariant;
    label = formatOfferStatus(status as OfferStatus);
  } else if (type === 'listing') {
    if (status === 'SOLD_OUT') variant = 'destructive';
    else if (status === 'ACTIVE') variant = 'default';
    else variant = 'secondary';
    label = status.replace('_', ' ');
  }

  return <Badge variant={variant}>{label}</Badge>;
}
