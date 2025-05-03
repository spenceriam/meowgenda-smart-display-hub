
// Calendar types
export interface CalendarEvent {
  id: string;
  title: string;
  start: number; // timestamp
  end: number; // timestamp
  description?: string;
  color: string;
}

// For form handling in CalendarEventList
export interface CalendarEventFormData {
  title: string;
  description?: string;
  startTime: string; // for time input "HH:MM"
  endTime: string; // for time input "HH:MM"
  color: string;
}

// Notes types
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

// Tasks types
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Weather types
export interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
  };
  forecast: WeatherForecastDay[];
}

export interface WeatherForecastDay {
  date: string;
  maxtemp_c: number;
  mintemp_c: number;
  condition: {
    text: string;
    code: number;
  };
}

// News types
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
}

// Settings types
export interface Settings {
  theme: 'light' | 'dark';
  primaryColor: string;
  useCustomBackground: boolean;
  backgroundUrl: string;
  screenLockEnabled: boolean;
  screenLockTimeout: number;
}
