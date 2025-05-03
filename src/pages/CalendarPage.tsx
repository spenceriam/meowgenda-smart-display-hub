
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CalendarView } from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <AppLayout>
      <CalendarView />
    </AppLayout>
  );
}
