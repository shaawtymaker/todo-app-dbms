
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function AppLayout() {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
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
          <Outlet />
        </div>
      </main>
    </div>
  );
}
