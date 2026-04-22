import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function HomeBooksSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="bg-muted h-7 w-40 animate-pulse rounded-xl" />
        <div className="bg-muted h-4 w-24 animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden rounded-xl p-0">
            <div className="bg-muted aspect-[3/4] w-full animate-pulse" />
            <div className="space-y-3 p-4">
              <div className="bg-muted h-4 w-full animate-pulse rounded-lg" />
              <div className="bg-muted h-4 w-[80%] max-w-full animate-pulse rounded-lg" />
              <div className="flex gap-2">
                <div className="bg-muted h-6 w-16 animate-pulse rounded-lg" />
                <div className="bg-muted h-6 w-14 animate-pulse rounded-lg" />
              </div>
              <div className="bg-muted h-3 w-32 animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
