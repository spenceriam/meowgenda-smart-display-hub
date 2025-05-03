
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Settings } from "lucide-react";
import { WeatherData } from "@/types";
import WeatherIcon from "./WeatherIcon";
import WeatherForecast from "./WeatherForecast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function WeatherView() {
  const { toast } = useToast();
  const [location, setLocation] = React.useState("");
  const [isLocating, setIsLocating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [units, setUnits] = React.useState<"metric" | "imperial">(() => {
    return localStorage.getItem("weatherUnits") as "metric" | "imperial" || "metric";
  });
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

  React.useEffect(() => {
    localStorage.setItem('weatherUnits', units);
  }, [units]);

  const fetchWeatherData = async (searchLocation: string) => {
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { location: searchLocation }
      });
      
      if (error) {
        throw new Error(`Error calling weather function: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from the weather function');
      }
      
      // Transform API data to match our WeatherData type
      const weatherData: WeatherData = {
        location: {
          name: data.location.name,
          country: data.location.country
        },
        current: {
          temp_c: data.current.temp_c,
          temp_f: data.current.temp_f,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code
          },
          wind_mph: data.current.wind_mph,
          wind_kph: data.current.wind_kph,
          humidity: data.current.humidity,
          feelslike_c: data.current.feelslike_c,
          feelslike_f: data.current.feelslike_f
        },
        forecast: data.forecast.forecastday.map((day: any) => ({
          date: day.date,
          maxtemp_c: day.day.maxtemp_c,
          mintemp_c: day.day.mintemp_c,
          condition: {
            text: day.day.condition.text,
            code: day.day.condition.code
          }
        }))
      };
      
      setWeather(weatherData);
      toast({
        title: "Weather updated",
        description: `Latest weather for ${weatherData.location.name}`,
      });
      
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast({
        title: "Error fetching weather",
        description: error instanceof Error ? error.message : "Failed to fetch weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    
    await fetchWeatherData(location);
    setLocation("");
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationString = `${latitude},${longitude}`;
        
        await fetchWeatherData(locationString);
        
        toast({
          title: "Location detected",
          description: `Weather for your current location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
        });
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        let message = "Failed to get your location";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable. Try again later.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out. Try again later.";
            break;
        }
        
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Weather</h1>
        <div className="flex items-center gap-2">
          <ToggleGroup 
            type="single" 
            value={units} 
            onValueChange={(value) => {
              if (value) setUnits(value as "metric" | "imperial");
            }}
          >
            <ToggleGroupItem value="metric">°C / km/h</ToggleGroupItem>
            <ToggleGroupItem value="imperial">°F / mph</ToggleGroupItem>
          </ToggleGroup>
        </div>
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
          <Button type="submit" disabled={!location.trim() || isLoading}>Search</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={getUserLocation} 
            disabled={isLocating || isLoading}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {isLocating ? "Detecting..." : "Use my location"}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-muted-foreground">Loading weather data...</p>
          </CardContent>
        </Card>
      ) : weather ? (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-meow-mint to-meow-blue p-6 text-white">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{weather.location.name}</h2>
                  <p>{weather.location.country}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">
                    {units === "metric" 
                      ? `${weather.current.temp_c}°C` 
                      : `${weather.current.temp_f}°F`}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center">
                <WeatherIcon code={weather.current.condition.code} className="h-16 w-16 mr-4" />
                <div>
                  <div className="text-xl">{weather.current.condition.text}</div>
                  <div>
                    Feels like {units === "metric" 
                      ? `${weather.current.feelslike_c}°C` 
                      : `${weather.current.feelslike_f}°F`}
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-sm">Wind</p>
                  <p className="font-medium">
                    {units === "metric" 
                      ? `${weather.current.wind_kph} km/h` 
                      : `${weather.current.wind_mph} mph`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Humidity</p>
                  <p className="font-medium">{weather.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Feels Like</p>
                  <p className="font-medium">
                    {units === "metric" 
                      ? `${weather.current.feelslike_c}°C` 
                      : `${weather.current.feelslike_f}°F`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherForecast forecast={weather.forecast} units={units} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-muted-foreground">
              {location || isLocating ? "Loading weather data..." : "Search for a location to view weather"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
