
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings } from "@/types";
import { Apple, Calendar, Mail, Moon, Sun, Palette } from "lucide-react";
import ColorSelector from "./ColorSelector";
import CustomColorPicker from "./CustomColorPicker";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export function SettingsView() {
  const { toast } = useToast();
  const [settings, setSettings] = React.useState<Settings>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : {
      theme: "light",
      primaryColor: "#50C2A7",
      useCustomBackground: false,
      backgroundUrl: "",
      screenLockEnabled: false,
      screenLockTimeout: 5,
      connectedCalendars: {
        google: false,
        apple: false,
        outlook: false
      }
    };
  });

  React.useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply theme
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply custom background
    if (settings.useCustomBackground && settings.backgroundUrl) {
      document.body.style.backgroundImage = `url(${settings.backgroundUrl})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      document.body.style.backgroundImage = "";
    }

    // Apply primary color
    document.documentElement.style.setProperty('--primary', settings.primaryColor);
    document.documentElement.style.setProperty('--primary-rgb', hexToRGB(settings.primaryColor));
    
    // Create a style element for custom CSS variables
    let styleEl = document.getElementById('primary-color-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'primary-color-style';
      document.head.appendChild(styleEl);
    }
    
    // Update the CSS with the new primary color
    styleEl.textContent = `
      :root {
        --primary: ${settings.primaryColor};
        --primary-rgb: ${hexToRGB(settings.primaryColor)};
      }
      
      .bg-primary {
        background-color: ${settings.primaryColor} !important;
      }
      
      .text-primary {
        color: ${settings.primaryColor} !important;
      }
      
      .border-primary {
        border-color: ${settings.primaryColor} !important;
      }

      .hover\\:bg-primary:hover {
        background-color: ${settings.primaryColor} !important;
      }

      .ring-primary {
        --tw-ring-color: ${settings.primaryColor} !important;
      }
    `;
  }, [settings]);

  // Helper function to convert hex to RGB
  const hexToRGB = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    
    // 3 digits
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } 
    // 6 digits
    else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    
    return `${r}, ${g}, ${b}`;
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light"
    }));
  };

  const setPrimaryColor = (color: string) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: color
    }));
    
    toast({
      title: "Primary Color Updated",
      description: "The primary color has been updated successfully."
    });
  };

  const toggleCustomBackground = () => {
    setSettings(prev => ({
      ...prev,
      useCustomBackground: !prev.useCustomBackground
    }));
  };

  const setBackgroundUrl = (url: string) => {
    setSettings(prev => ({
      ...prev,
      backgroundUrl: url
    }));
  };

  const toggleScreenLock = () => {
    setSettings(prev => ({
      ...prev,
      screenLockEnabled: !prev.screenLockEnabled
    }));
  };

  const setScreenLockTimeout = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      screenLockTimeout: minutes
    }));
  };

  const connectCalendarService = (service: 'google' | 'apple' | 'outlook') => {
    // This would typically open an OAuth flow in a real application
    // Make sure connectedCalendars exists before trying to access its properties
    const isConnected = settings.connectedCalendars?.[service] || false;
    
    if (isConnected) {
      // Disconnect
      setSettings(prev => ({
        ...prev,
        connectedCalendars: {
          // Make sure we initialize all required properties
          google: prev.connectedCalendars?.google ?? false,
          apple: prev.connectedCalendars?.apple ?? false,
          outlook: prev.connectedCalendars?.outlook ?? false,
          [service]: false
        }
      }));
    } else {
      // In a real app, we'd trigger the OAuth flow here
      // For now, just simulate a connection
      setSettings(prev => ({
        ...prev,
        connectedCalendars: {
          // Make sure we initialize all required properties
          google: prev.connectedCalendars?.google ?? false,
          apple: prev.connectedCalendars?.apple ?? false,
          outlook: prev.connectedCalendars?.outlook ?? false,
          [service]: true
        }
      }));
    }
  };

  const resetSettings = () => {
    setSettings({
      theme: "light",
      primaryColor: "#50C2A7",
      useCustomBackground: false,
      backgroundUrl: "",
      screenLockEnabled: false,
      screenLockTimeout: 5,
      connectedCalendars: {
        google: false,
        apple: false,
        outlook: false
      }
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to their default values."
    });
  };

  // Make sure connectedCalendars exists before trying to access its properties
  const connectedCalendars = settings.connectedCalendars || { google: false, apple: false, outlook: false };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Theme Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <div className="flex items-center border rounded-full p-1">
                <Button
                  size="icon"
                  variant={settings.theme === "light" ? "default" : "ghost"}
                  className="rounded-full h-8 w-8"
                  onClick={() => settings.theme !== "light" && toggleTheme()}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={settings.theme === "dark" ? "default" : "ghost"}
                  className="rounded-full h-8 w-8"
                  onClick={() => settings.theme !== "dark" && toggleTheme()}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Choose a primary color for the application
              </p>
              <ColorSelector
                value={settings.primaryColor}
                onChange={setPrimaryColor}
                colors={[
                  "#50C2A7",
                  "#9b87f5",
                  "#F97316",
                  "#D946EF",
                  "#0EA5E9",
                  "#8B5CF6",
                ]}
              />
              
              <div className="mt-4">
                <CustomColorPicker 
                  value={settings.primaryColor} 
                  onChange={setPrimaryColor}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Custom Background</Label>
                <p className="text-sm text-muted-foreground">
                  Use a custom background image
                </p>
              </div>
              <Switch
                checked={settings.useCustomBackground}
                onCheckedChange={toggleCustomBackground}
              />
            </div>
            
            {settings.useCustomBackground && (
              <div className="space-y-2">
                <Label htmlFor="backgroundUrl">Background URL</Label>
                <div className="flex gap-2">
                  <input
                    id="backgroundUrl"
                    type="text"
                    value={settings.backgroundUrl}
                    onChange={(e) => setBackgroundUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setBackgroundUrl("")}
                    disabled={!settings.backgroundUrl}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Configure security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label>Screen Lock</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically lock screen after inactivity
                </p>
              </div>
              <Switch
                checked={settings.screenLockEnabled}
                onCheckedChange={toggleScreenLock}
              />
            </div>
            
            {settings.screenLockEnabled && (
              <div className="space-y-2">
                <Label>Lock After</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={settings.screenLockTimeout}
                    onChange={(e) => setScreenLockTimeout(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="w-12 text-right">{settings.screenLockTimeout} min</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Integrations</CardTitle>
            <CardDescription>Connect to third-party calendar services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-red-500" />
                <div className="space-y-0.5">
                  <Label>Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync events with your Google Calendar
                  </p>
                </div>
              </div>
              <Button 
                variant={connectedCalendars.google ? "destructive" : "outline"}
                onClick={() => connectCalendarService('google')}
                className="min-w-24"
              >
                {connectedCalendars.google ? "Disconnect" : "Connect"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Apple className="h-5 w-5" />
                <div className="space-y-0.5">
                  <Label>Apple Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync events with your Apple Calendar
                  </p>
                </div>
              </div>
              <Button 
                variant={connectedCalendars.apple ? "destructive" : "outline"}
                onClick={() => connectCalendarService('apple')}
                className="min-w-24"
              >
                {connectedCalendars.apple ? "Disconnect" : "Connect"}
              </Button>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div className="space-y-0.5">
                  <Label>Outlook Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync events with your Outlook Calendar
                  </p>
                </div>
              </div>
              <Button 
                variant={connectedCalendars.outlook ? "destructive" : "outline"}
                onClick={() => connectCalendarService('outlook')}
                className="min-w-24"
              >
                {connectedCalendars.outlook ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={resetSettings}>
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
