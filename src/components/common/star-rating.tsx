import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, totalStars = 5, className, starClassName }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: totalStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            rating > i ? 'text-accent fill-accent' : 'text-muted-foreground/50',
            starClassName
          )}
        />
      ))}
    </div>
  );
}
