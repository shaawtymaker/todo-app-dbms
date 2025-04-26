
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AppLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { theme, setTheme, activeTheme } = useTheme();
  
  // Close sidebar when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 touch-target"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'fixed z-40' : 'relative'}
        transition-transform duration-300 ease-in-out
        w-64 h-screen bg-card border-r
      `}>
        <Sidebar onNavItemClick={() => isMobile && setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <main className={`
        flex-1 transition-all duration-300
        ${isMobile && sidebarOpen ? 'brightness-50 pointer-events-none' : ''}
        ${!isMobile && !sidebarOpen ? 'ml-0' : ''}
      `}>
        <div className="container max-w-4xl py-8 px-4 md:px-8">
          {/* Theme switcher */}
          <div className="flex justify-end mb-6">
            <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as 'light' | 'dark' | 'system')}>
              <ToggleGroupItem value="light" aria-label="Light mode" className="px-3">
                <Sun size={18} className={theme === 'light' ? 'text-primary' : ''} />
              </ToggleGroupItem>
              <ToggleGroupItem value="system" aria-label="System theme" className="px-3">
                <Monitor size={18} className={theme === 'system' ? 'text-primary' : ''} />
              </ToggleGroupItem>
              <ToggleGroupItem value="dark" aria-label="Dark mode" className="px-3">
                <Moon size={18} className={theme === 'dark' ? 'text-primary' : ''} />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {/* Main content */}
          <Outlet />
        </div>
      </main>
      
      {/* Mobile nav overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
