
import { NewsArticle } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Helper function to parse RSS and convert to our NewsArticle format
export async function fetchRssFeed(feedUrl: string, category: string): Promise<NewsArticle[]> {
  try {
    // Use a CORS proxy for client-side requests
    const corsProxy = "https://api.allorigins.win/raw?url=";
    const response = await fetch(`${corsProxy}${encodeURIComponent(feedUrl)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    // Get all items from the RSS feed
    const items = xmlDoc.querySelectorAll("item");
    
    // Convert items to NewsArticle format
    const articles: NewsArticle[] = Array.from(items).slice(0, 8).map(item => {
      const title = item.querySelector("title")?.textContent || "No Title";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
      
      // Strip HTML tags from description for the summary
      const div = document.createElement("div");
      div.innerHTML = description;
      const summary = div.textContent?.trim().substring(0, 200) + "..." || "No summary available";
      
      // Extract source from the feed URL or use a default
      const source = new URL(feedUrl).hostname.replace("feeds.", "").replace("www.", "");
      
      return {
        id: uuidv4(),
        title,
        summary,
        url: link,
        source,
        publishedAt: new Date(pubDate).toISOString(),
        category
      };
    });
    
    return articles;
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
    return [];
  }
}
