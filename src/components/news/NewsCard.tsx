
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { NewsArticle } from "@/types";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{article.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{article.source}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">{article.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{article.summary}</p>
        <div className="mt-4">
          <a 
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center hover:underline"
          >
            Read more <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
