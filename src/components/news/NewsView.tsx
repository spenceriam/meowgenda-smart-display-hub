
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsArticle } from "@/types";
import NewsCard from "./NewsCard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchRssFeed } from "@/lib/news";

export function NewsView() {
  const [newsArticles, setNewsArticles] = React.useState<Record<string, NewsArticle[]>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = React.useState<string>("reuters");
  const { toast } = useToast();
  
  const rssSources = {
    "reuters": {
      name: "Reuters",
      feeds: {
        "top": "https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best",
        "business": "https://www.reutersagency.com/feed/?best-topics=business&post_type=best",
        "health": "https://www.reutersagency.com/feed/?best-topics=health&post_type=best",
        "technology": "https://www.reutersagency.com/feed/?best-topics=tech&post_type=best",
      }
    },
    "bbc": {
      name: "BBC News",
      feeds: {
        "top": "http://feeds.bbci.co.uk/news/rss.xml",
        "business": "http://feeds.bbci.co.uk/news/business/rss.xml",
        "health": "http://feeds.bbci.co.uk/news/health/rss.xml",
        "technology": "http://feeds.bbci.co.uk/news/technology/rss.xml",
      }
    },
    "npr": {
      name: "NPR",
      feeds: {
        "top": "https://feeds.npr.org/1001/rss.xml",
        "business": "https://feeds.npr.org/1006/rss.xml",
        "health": "https://feeds.npr.org/103537970/rss.xml",
        "technology": "https://feeds.npr.org/1019/rss.xml",
      }
    },
  };

  const fetchNews = async (source: string) => {
    setIsLoading(true);
    try {
      const sourceFeeds = rssSources[source as keyof typeof rssSources].feeds;
      const categories = Object.keys(sourceFeeds);
      
      const articlesPromises = categories.map(async (category) => {
        const feedUrl = sourceFeeds[category as keyof typeof sourceFeeds];
        const articles = await fetchRssFeed(feedUrl, category);
        return { category, articles };
      });
      
      const results = await Promise.all(articlesPromises);
      const newsData: Record<string, NewsArticle[]> = {};
      
      results.forEach(({ category, articles }) => {
        newsData[category] = articles;
      });
      
      setNewsArticles(newsData);
      localStorage.setItem('news-articles', JSON.stringify(newsData));
      localStorage.setItem('news-source', source);
      
      toast({
        title: "News Updated",
        description: `Latest news from ${rssSources[source as keyof typeof rssSources].name} loaded`,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again later.",
        variant: "destructive",
      });
      // If fetch fails, load from localStorage or use fallback data
      const saved = localStorage.getItem('news-articles');
      if (saved) {
        setNewsArticles(JSON.parse(saved));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const savedSource = localStorage.getItem('news-source') || "reuters";
    setSelectedFeed(savedSource);
    
    const saved = localStorage.getItem('news-articles');
    if (saved) {
      setNewsArticles(JSON.parse(saved));
    }
    
    // Fetch fresh news
    fetchNews(savedSource);
  }, []);

  const handleSourceChange = (source: string) => {
    setSelectedFeed(source);
    fetchNews(source);
  };

  const categories = Object.keys(newsArticles).length > 0 ? 
    Object.keys(newsArticles) : 
    ["top", "business", "health", "technology"];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News</h1>
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline" 
            onClick={() => fetchNews(selectedFeed)}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(rssSources).map((source) => (
          <Button
            key={source}
            variant={selectedFeed === source ? "default" : "outline"}
            onClick={() => handleSourceChange(source)}
            disabled={isLoading}
          >
            {rssSources[source as keyof typeof rssSources].name}
          </Button>
        ))}
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
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="w-2/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
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
    </div>
  );
}
