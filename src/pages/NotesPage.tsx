
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NotesView } from "@/components/notes/NotesView";

export default function NotesPage() {
  return (
    <AppLayout>
      <NotesView />
    </AppLayout>
  );
}
