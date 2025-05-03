
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsArticle } from "@/types";
import NewsCard from "./NewsCard";
import { NewsLoadingSkeleton } from "./NewsLoadingSkeleton";

interface NewsCategoryTabsProps {
  categories: string[];
  newsArticles: Record<string, NewsArticle[]>;
  isLoading: boolean;
}

export function NewsCategoryTabs({
  categories,
  newsArticles,
  isLoading,
}: NewsCategoryTabsProps) {
  return (
    <Tabs defaultValue={categories[0]}>
      <TabsList className="mb-6">
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="capitalize">
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {categories.map(category => (
        <TabsContent key={category} value={category} className="space-y-4">
          {isLoading ? (
            <NewsLoadingSkeleton />
          ) : newsArticles[category] ? (
            newsArticles[category].map(article => (
              <NewsCard key={article.id} article={article} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No articles available in this category</p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
