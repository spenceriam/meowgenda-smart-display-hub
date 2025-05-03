
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-2/4 h-4 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4 mt-2" />
            <Skeleton className="w-2/3 h-4 mt-2" />
            <Skeleton className="w-1/4 h-4 mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
