
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { WeatherView } from "@/components/weather/WeatherView";

export default function WeatherPage() {
  return (
    <AppLayout>
      <WeatherView />
    </AppLayout>
  );
}
