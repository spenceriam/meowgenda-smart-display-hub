
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsArticle } from "@/types";
import NewsCard from "./NewsCard";

export function NewsView() {
  const [newsArticles, setNewsArticles] = React.useState<Record<string, NewsArticle[]>>(() => {
    const saved = localStorage.getItem('news-articles');
    if (saved) return JSON.parse(saved);
    
    // Mock news data
    return {
      "technology": [
        {
          id: "1",
          title: "New AI breakthrough changes how machines learn",
          summary: "Researchers have developed a new algorithm that enables more efficient learning with less data.",
          url: "#",
          source: "Tech Today",
          publishedAt: new Date().toISOString(),
          category: "technology"
        },
        {
          id: "2",
          title: "Quantum computing reaches new milestone",
          summary: "Scientists have achieved quantum supremacy in a new experiment that solves problems impossible for classical computers.",
          url: "#",
          source: "Science Daily",
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          category: "technology"
        }
      ],
      "business": [
        {
          id: "3",
          title: "Global markets react to new economic policies",
          summary: "Stock markets worldwide show mixed reactions to the newly announced fiscal measures.",
          url: "#",
          source: "Business Insider",
          publishedAt: new Date().toISOString(),
          category: "business"
        },
        {
          id: "4",
          title: "Startup raises $50M for sustainable product line",
          summary: "The eco-friendly company plans to expand operations and enter new markets with fresh funding.",
          url: "#",
          source: "Entrepreneur Weekly",
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          category: "business"
        }
      ],
      "health": [
        {
          id: "5",
          title: "Study reveals benefits of new wellness approach",
          summary: "Researchers found significant improvements in participants following the holistic health program.",
          url: "#",
          source: "Health Journal",
          publishedAt: new Date().toISOString(),
          category: "health"
        },
        {
          id: "6",
          title: "Breakthrough in medical imaging technology",
          summary: "The new scanning method provides clearer images with lower radiation exposure.",
          url: "#",
          source: "Medical News",
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          category: "health"
        }
      ]
    };
  });
  
  React.useEffect(() => {
    localStorage.setItem('news-articles', JSON.stringify(newsArticles));
  }, [newsArticles]);

  const refreshNews = () => {
    // In a real app, this would fetch fresh news from an API
    // For this demo, we'll just update the timestamps
    const updatedNews: Record<string, NewsArticle[]> = {};
    
    Object.keys(newsArticles).forEach(category => {
      updatedNews[category] = newsArticles[category].map(article => ({
        ...article,
        publishedAt: new Date().toISOString()
      }));
    });
    
    setNewsArticles(updatedNews);
  };

  const categories = Object.keys(newsArticles);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News</h1>
      </div>

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
            {newsArticles[category].map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
