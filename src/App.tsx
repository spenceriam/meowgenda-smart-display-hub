
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import CalendarPage from "./pages/CalendarPage";
import NotesPage from "./pages/NotesPage";
import TasksPage from "./pages/TasksPage";
import WeatherPage from "./pages/WeatherPage";
import NewsPage from "./pages/NewsPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
