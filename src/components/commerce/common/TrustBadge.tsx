'use client';

import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui';
import { getTrustScoreColor, getTrustScoreLabel } from '@/lib/commerce-utils';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function TrustBadge({ score, size = 'default', showLabel = true, className }: TrustBadgeProps) {
  const label = getTrustScoreLabel(score);
  const colorClasses = getTrustScoreColor(score);

  const Icon = score >= 80 ? ShieldCheck : score >= 40 ? Shield : ShieldAlert;

  const iconSizes = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 font-medium border',
        colorClasses,
        className
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{label}</span>}
      <span className="font-bold">{score}</span>
    </Badge>
  );
}
