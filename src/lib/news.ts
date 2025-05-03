
import { NewsArticle } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Helper function to parse RSS and convert to our NewsArticle format
export async function fetchRssFeed(feedUrl: string, category: string): Promise<NewsArticle[]> {
  try {
    // Use a more reliable RSS feed parser API
    const corsProxy = "https://api.rss2json.com/v1/api.json?rss_url=";
    
    // Add a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if the API returned proper data
    if (data.status !== "ok") {
      throw new Error(`API returned error: ${data.message || "Unknown error"}`);
    }
    
    // Convert items to NewsArticle format
    const articles: NewsArticle[] = data.items.slice(0, 8).map((item: any) => {
      // Extract text from HTML content for the summary
      const div = document.createElement("div");
      div.innerHTML = item.description || item.content || "";
      const summary = div.textContent?.trim().substring(0, 200) + "..." || "No summary available";
      
      return {
        id: uuidv4(),
        title: item.title || "No Title",
        summary: summary,
        url: item.link || item.enclosure?.link || "#",
        source: data.feed.title || new URL(feedUrl).hostname.replace("feeds.", "").replace("www.", ""),
        publishedAt: item.pubDate || new Date().toISOString(),
        category
      };
    });
    
    return articles;
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
    return [];
  }
}

// Add mock news data as a fallback
export const getMockNews = (category: string): NewsArticle[] => {
  const mockTitles = {
    "cnn": [
      "Breaking News from CNN",
      "Global News Coverage by CNN",
      "Top Stories of the Day - CNN"
    ],
    "bbc": [
      "Global News Update from BBC",
      "International Development Report",
      "Special Investigation: World Affairs"
    ],
    "npr": [
      "NPR Morning Edition Highlights",
      "In-depth Coverage from NPR",
      "This Week in Politics - NPR Analysis"
    ]
  };
  
  const source = category.includes("world") ? "World News" :
                category.includes("top") ? "Top Headlines" :
                category.includes("business") ? "Business News" :
                category.includes("health") ? "Health Updates" :
                category.includes("technology") ? "Tech News" : "News Source";
  
  return Array(3).fill(null).map((_, i) => ({
    id: uuidv4(),
    title: mockTitles[source.toLowerCase().includes("cnn") ? "cnn" : 
                     source.toLowerCase().includes("bbc") ? "bbc" : "npr"][i % 3],
    summary: `This is a fallback article for the ${category} category. We couldn't load the actual content from ${source} at this time. Please try again later or check your internet connection.`,
    url: "#",
    source,
    publishedAt: new Date().toISOString(),
    category
  }));
};
