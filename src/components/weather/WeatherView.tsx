
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WeatherData } from "@/types";
import WeatherIcon from "./WeatherIcon";
import WeatherForecast from "./WeatherForecast";

export function WeatherView() {
  const [location, setLocation] = React.useState("");
  const [weather, setWeather] = React.useState<WeatherData | null>(() => {
    const saved = localStorage.getItem('weather');
    if (saved) return JSON.parse(saved);
    
    // Default mock weather data
    return {
      location: {
        name: "San Francisco",
        country: "USA"
      },
      current: {
        temp_c: 18,
        temp_f: 64,
        condition: {
          text: "Partly cloudy",
          code: 1003
        },
        wind_mph: 12,
        wind_kph: 19,
        humidity: 72,
        feelslike_c: 17,
        feelslike_f: 63
      },
      forecast: [
        { date: "2023-05-04", maxtemp_c: 19, mintemp_c: 14, condition: { text: "Sunny", code: 1000 } },
        { date: "2023-05-05", maxtemp_c: 21, mintemp_c: 15, condition: { text: "Cloudy", code: 1003 } },
        { date: "2023-05-06", maxtemp_c: 20, mintemp_c: 16, condition: { text: "Rain", code: 1063 } },
      ]
    };
  });
  
  React.useEffect(() => {
    if (weather) {
      localStorage.setItem('weather', JSON.stringify(weather));
    }
  }, [weather]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    
    // In a real app, you'd fetch from a weather API
    // For this demo, we'll simulate a search with mock data
    // Add a small delay to simulate API call
    setWeather(null);
    
    setTimeout(() => {
      const mockWeather: WeatherData = {
        location: {
          name: location,
          country: "Demo Country"
        },
        current: {
          temp_c: Math.round(15 + Math.random() * 15),
          temp_f: Math.round(59 + Math.random() * 27),
          condition: {
            text: ["Sunny", "Partly cloudy", "Cloudy", "Light rain"][Math.floor(Math.random() * 4)],
            code: [1000, 1003, 1006, 1063][Math.floor(Math.random() * 4)]
          },
          wind_mph: Math.round(5 + Math.random() * 15),
          wind_kph: Math.round(8 + Math.random() * 24),
          humidity: Math.round(40 + Math.random() * 40),
          feelslike_c: Math.round(14 + Math.random() * 15),
          feelslike_f: Math.round(57 + Math.random() * 27)
        },
        forecast: [
          { 
            date: "2023-05-04", 
            maxtemp_c: Math.round(18 + Math.random() * 10),
            mintemp_c: Math.round(10 + Math.random() * 8),
            condition: { 
              text: ["Sunny", "Partly cloudy"][Math.floor(Math.random() * 2)],
              code: [1000, 1003][Math.floor(Math.random() * 2)]
            }
          },
          { 
            date: "2023-05-05", 
            maxtemp_c: Math.round(18 + Math.random() * 10),
            mintemp_c: Math.round(10 + Math.random() * 8),
            condition: { 
              text: ["Cloudy", "Light rain"][Math.floor(Math.random() * 2)], 
              code: [1006, 1063][Math.floor(Math.random() * 2)]
            }
          },
          { 
            date: "2023-05-06", 
            maxtemp_c: Math.round(18 + Math.random() * 10),
            mintemp_c: Math.round(10 + Math.random() * 8), 
            condition: { 
              text: ["Sunny", "Light rain"][Math.floor(Math.random() * 2)],
              code: [1000, 1063][Math.floor(Math.random() * 2)]
            }
          },
        ]
      };
      
      setWeather(mockWeather);
      setLocation("");
    }, 500);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Weather</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search for a location..."
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={!location.trim()}>Search</Button>
        </form>
      </div>

      {weather ? (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-meow-mint to-meow-blue p-6 text-white">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{weather.location.name}</h2>
                  <p>{weather.location.country}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">{weather.current.temp_c}°C</div>
                  <div className="text-lg">{weather.current.temp_f}°F</div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <WeatherIcon code={weather.current.condition.code} className="h-16 w-16 mr-4" />
                <div>
                  <div className="text-xl">{weather.current.condition.text}</div>
                  <div>Feels like {weather.current.feelslike_c}°C</div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-sm">Wind</p>
                  <p className="font-medium">{weather.current.wind_kph} km/h</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Humidity</p>
                  <p className="font-medium">{weather.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Feels Like</p>
                  <p className="font-medium">{weather.current.feelslike_c}°C</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherForecast forecast={weather.forecast} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-muted-foreground">
              {location ? "Loading weather data..." : "Search for a location to view weather"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
