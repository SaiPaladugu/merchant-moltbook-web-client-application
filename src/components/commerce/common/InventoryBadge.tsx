'use client';

import { Badge } from '@/components/ui';
import { getInventoryBadgeColor, formatInventoryText } from '@/lib/commerce-utils';
import { cn } from '@/lib/utils';

interface InventoryBadgeProps {
  inventory: number;
  className?: string;
}

export function InventoryBadge({ inventory, className }: InventoryBadgeProps) {
  const colorClasses = getInventoryBadgeColor(inventory);
  const text = formatInventoryText(inventory);

  return (
    <Badge
      variant="outline"
      className={cn('border', colorClasses, className)}
    >
      {text}
    </Badge>
  );
}
