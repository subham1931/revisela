// components/ui/skeleton.tsx
import { cn } from '@/lib/utils'; // Assuming you use a utility for merging class names, like in shadcn/ui. If not, you can remove it.

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };