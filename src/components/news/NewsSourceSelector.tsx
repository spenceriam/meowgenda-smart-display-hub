
import React from "react";
import { Button } from "@/components/ui/button";

interface NewsSourceSelectorProps {
  sources: Record<string, { name: string; feeds: Record<string, string> }>;
  selectedFeed: string;
  isLoading: boolean;
  onSourceChange: (source: string) => void;
}

export function NewsSourceSelector({
  sources,
  selectedFeed,
  isLoading,
  onSourceChange,
}: NewsSourceSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.keys(sources).map((source) => (
        <Button
          key={source}
          variant={selectedFeed === source ? "default" : "outline"}
          onClick={() => onSourceChange(source)}
          disabled={isLoading}
        >
          {sources[source].name}
        </Button>
      ))}
    </div>
  );
}
