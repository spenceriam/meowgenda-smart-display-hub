
import { format } from "date-fns";
import { WeatherForecastDay } from "@/types";
import WeatherIcon from "./WeatherIcon";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherForecastProps {
  forecast: WeatherForecastDay[];
  units?: "metric" | "imperial";
}

export default function WeatherForecast({ forecast, units = "metric" }: WeatherForecastProps) {
  // Convert Celsius to Fahrenheit
  const toFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9/5) + 32);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {forecast.map((day, index) => (
        <Card key={index} className="bg-background">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="text-center mb-2">
              {format(new Date(day.date), "EEE, MMM d")}
            </div>
            <WeatherIcon code={day.condition.code} className="h-12 w-12 my-2" />
            <div className="text-lg font-medium">{day.condition.text}</div>
            <div className="flex gap-3 mt-2">
              <span className="font-medium">
                {units === "metric" 
                  ? `${Math.round(day.maxtemp_c)}°` 
                  : `${toFahrenheit(day.maxtemp_c)}°`}
              </span>
              <span className="text-muted-foreground">
                {units === "metric" 
                  ? `${Math.round(day.mintemp_c)}°` 
                  : `${toFahrenheit(day.mintemp_c)}°`}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
