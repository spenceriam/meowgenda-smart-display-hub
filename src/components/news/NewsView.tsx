
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsArticle } from "@/types";
import NewsCard from "./NewsCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Rss } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchRssFeed, getMockNews } from "@/lib/news";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsView() {
  const [newsArticles, setNewsArticles] = React.useState<Record<string, NewsArticle[]>>({});
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedFeed, setSelectedFeed] = React.useState<string>("the-daily");
  const { toast } = useToast();
  
  const rssSources = {
    "the-daily": {
      name: "The Daily",
      feeds: {
        "episodes": "http://rss.art19.com/the-daily",
        "recent": "http://rss.art19.com/the-daily",
        "popular": "http://rss.art19.com/the-daily",
        "featured": "http://rss.art19.com/the-daily",
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
        let articles = await fetchRssFeed(feedUrl, category);
        
        // Use mock data if no articles were fetched
        if (articles.length === 0) {
          articles = getMockNews(category);
        }
        
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
        description: `Latest content from ${rssSources[source as keyof typeof rssSources].name} loaded`,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
      toast({
        title: "Error",
        description: "Failed to fetch content. Using cached or fallback data.",
        variant: "destructive",
      });
      // If fetch fails, load from localStorage or use fallback data
      const saved = localStorage.getItem('news-articles');
      if (saved) {
        setNewsArticles(JSON.parse(saved));
      } else {
        // Create fallback data with mock news for each category
        const fallbackData: Record<string, NewsArticle[]> = {};
        const categories = Object.keys(rssSources[selectedFeed as keyof typeof rssSources].feeds);
        categories.forEach(category => {
          fallbackData[category] = getMockNews(category);
        });
        setNewsArticles(fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    const savedSource = localStorage.getItem('news-source') || "the-daily";
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
    Object.keys(rssSources[selectedFeed as keyof typeof rssSources].feeds);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">News</h1>
          <Rss className="ml-2 h-5 w-5 text-muted-foreground" />
        </div>
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
                      <Skeleton className="w-3/4 h-6" />
                      <Skeleton className="w-2/4 h-4 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-full h-4 mt-2" />
                      <Skeleton className="w-2/3 h-4 mt-2" />
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
