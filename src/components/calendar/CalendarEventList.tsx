
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarEventListProps {
  date: Date;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarEventList({ date, events, onAddEvent, onDeleteEvent }: CalendarEventListProps) {
  const [open, setOpen] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState<Partial<CalendarEvent>>({
    title: "",
    description: "",
    color: "#50C2A7"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTime = new Date(date);
    const [hours, minutes] = (newEvent.startTime || "09:00").split(":");
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endTime = new Date(date);
    const [endHours, endMinutes] = (newEvent.endTime || "10:00").split(":");
    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title || "Untitled Event",
      start: startTime.getTime(),
      end: endTime.getTime(),
      description: newEvent.description || "",
      color: newEvent.color || "#50C2A7"
    };
    
    onAddEvent(event);
    setNewEvent({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      color: "#50C2A7"
    });
    setOpen(false);
  };

  const colorOptions = ["#50C2A7", "#E5DEFF", "#FEF7CD", "#FFDEE2", "#FDE1D3", "#D3E4FD"];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Events for {format(date, "MMMM d, yyyy")}</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new event for {format(date, "MMMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newEvent.startTime || "09:00"}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime || "10:00"}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ""}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event description (optional)"
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Event Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "w-8 h-8 rounded-full",
                          newEvent.color === color && "ring-2 ring-offset-2 ring-primary"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-8 bg-meow-pink/50 rounded-lg">
          <p className="text-muted-foreground">No events scheduled for this day</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex p-4 border rounded-lg bg-white"
            >
              <div
                className="w-2 self-stretch rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => onDeleteEvent(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {event.description && (
                  <p className="mt-2 text-sm">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
