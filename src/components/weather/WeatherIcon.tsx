
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  className?: string;
}

export default function WeatherIcon({ code, className }: WeatherIconProps) {
  // Map weather code to icon
  // This is a simplified mapping based on common weather codes
  // In a real app, you'd have more comprehensive mappings
  const getIcon = () => {
    if (code === 1000) return <Sun className={cn("text-yellow-500", className)} />;
    if (code >= 1003 && code <= 1009) return <Cloud className={cn("text-gray-500", className)} />;
    if (code >= 1030 && code <= 1039) return <CloudFog className={cn("text-gray-400", className)} />;
    if (code >= 1063 && code <= 1069) return <CloudDrizzle className={cn("text-blue-400", className)} />;
    if (code >= 1087 && code <= 1117) return <CloudLightning className={cn("text-purple-500", className)} />;
    if (code >= 1150 && code <= 1201) return <CloudRain className={cn("text-blue-500", className)} />;
    if (code >= 1204 && code <= 1237) return <CloudSnow className={cn("text-blue-200", className)} />;
    if (code >= 1240 && code <= 1282) return <CloudRain className={cn("text-blue-600", className)} />;
    
    return <Wind className={cn("text-gray-400", className)} />;
  };

  return getIcon();
}
