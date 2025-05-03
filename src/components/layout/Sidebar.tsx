
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, ClipboardList, Cloud, Menu, Newspaper, Settings, StickyNote, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  {
    icon: Calendar,
    label: "Calendar",
    path: "/calendar"
  },
  {
    icon: StickyNote,
    label: "Notes",
    path: "/notes"
  },
  {
    icon: ClipboardList,
    label: "Tasks",
    path: "/tasks"
  },
  {
    icon: Cloud,
    label: "Weather",
    path: "/weather"
  },
  {
    icon: Newspaper,
    label: "News",
    path: "/news"
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings"
  }
];

export function Sidebar({
  open,
  setOpen
}: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  return <>
      {/* Mobile overlay */}
      {isMobile && open && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={cn("fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out", open ? "translate-x-0" : "-translate-x-full", isMobile ? "w-64 bg-background shadow-xl" : "w-16 bg-background border-r")}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center h-16">
            {isMobile && <div className="dynapuff-heading text-2xl text-primary">
                meowgenda
              </div>}
          </div>

          <nav className="flex-1 py-4">
            <div className="space-y-1 px-2">
              {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return <Link key={item.path} to={item.path} className={cn("group flex items-center py-2 px-2 rounded-lg transition-colors relative", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent")}>
                    <div className={cn("flex items-center", !isMobile && "w-full justify-center")}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {isMobile && <span className="ml-3 text-base">{item.label}</span>}
                    </div>
                    {!isMobile && <div className="absolute left-full ml-2 p-2 bg-background shadow-md rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap">
                        {item.label}
                      </div>}
                  </Link>;
            })}
            </div>
          </nav>

          <div className="p-4">
            {isMobile ? (
              <div className="flex flex-col items-start space-y-2">
                <div className="text-xs text-muted-foreground">
                  MeowGenda v1.0.0
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="rounded-full">
                  <X size={20} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="dynapuff-text text-primary text-2xl text-center transform -rotate-90 origin-center my-4">
                  meowgenda
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="rounded-full">
                  <Menu size={20} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button for non-mobile */}
      {!isMobile && !open && <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="fixed bottom-4 left-4 z-30 rounded-full shadow-md bg-background/60 backdrop-blur-md">
          <Menu size={20} />
        </Button>}
    </>;
}
