
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { NewsView } from "@/components/news/NewsView";

export default function NewsPage() {
  return (
    <AppLayout>
      <NewsView />
    </AppLayout>
  );
}
