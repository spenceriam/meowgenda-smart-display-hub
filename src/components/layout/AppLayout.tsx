
import React from "react";
import { 
  SidebarProvider,
  Sidebar as ShadcnSidebar,
  SidebarContent, 
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen bg-background w-full">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out overflow-auto",
            sidebarOpen && !isMobile ? "ml-16" : "ml-0"
          )}
        >
          <div className="p-4 md:p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
