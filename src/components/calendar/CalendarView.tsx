
import React from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import CalendarEventList from "./CalendarEventList";
import { CalendarEvent } from "@/types";

export function CalendarView() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    return savedEvents ? JSON.parse(savedEvents) : [
      {
        id: "1",
        title: "Team Standup",
        start: new Date().setHours(9, 0, 0, 0),
        end: new Date().setHours(9, 30, 0, 0),
        description: "Daily team synchronization meeting",
        color: "#50C2A7"
      },
      {
        id: "2",
        title: "Project Review",
        start: new Date().setHours(14, 0, 0, 0),
        end: new Date().setHours(15, 0, 0, 0),
        description: "Review project progress",
        color: "#E5DEFF"
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const dayArray = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get days from previous month and next month to fill the calendar
  const firstDay = monthStart.getDay();
  const lastDay = monthEnd.getDay();
  
  const prevMonthDays = Array.from({ length: firstDay }, (_, i) => {
    const date = new Date(monthStart);
    date.setDate(i - firstDay + 1);
    return date;
  });
  
  const nextMonthDays = Array.from({ length: 6 - lastDay }, (_, i) => {
    const date = new Date(monthEnd);
    date.setDate(date.getDate() + i + 1);
    return date;
  });
  
  const allDays = [...prevMonthDays, ...dayArray, ...nextMonthDays];
  
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const formattedToday = format(new Date(), "PPP");
  
  const selectedDateEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return isSameDay(eventDate, selectedDate);
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
        <div className="text-right">
          <p className="text-muted-foreground">{formattedToday}</p>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {weekdays.map(day => (
            <div key={day} className="text-center py-2 font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          
          {allDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const hasEvents = events.some(event => isSameDay(new Date(event.start), day));
            
            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "calendar-day",
                  isCurrentMonth ? "text-foreground" : "text-gray-400",
                  isSelected && "border-2 border-primary",
                  isCurrentDay && "today",
                  hasEvents && !isCurrentDay && "border-b-2 border-primary/70"
                )}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8">
        <CalendarEventList 
          date={selectedDate}
          events={selectedDateEvents} 
          onAddEvent={(newEvent) => setEvents([...events, newEvent])}
          onDeleteEvent={(id) => setEvents(events.filter(event => event.id !== id))}
        />
      </div>
    </div>
  );
}
