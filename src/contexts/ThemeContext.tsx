
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';
type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  activeTheme: ActiveTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  ThemeIcon: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get theme from local storage or default to system
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });
  
  // Track the active theme (what's actually applied)
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('light');
  
  // Update the active theme whenever the theme or system preference changes
  useEffect(() => {
    const updateActiveTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setActiveTheme(systemTheme);
        return systemTheme;
      } else {
        setActiveTheme(theme);
        return theme;
      }
    };
    
    const currentTheme = updateActiveTheme();
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    // Then add the current one
    root.classList.add(currentTheme);
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateActiveTheme();
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Set theme with local storage persistence
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Toggle between light and dark (skip system)
  const toggleTheme = () => {
    setTheme(activeTheme === 'light' ? 'dark' : 'light');
  };
  
  // Determine which icon to show based on active theme
  let ThemeIcon = <Sun className="h-5 w-5" />;
  if (theme === 'system') {
    ThemeIcon = <Monitor className="h-5 w-5" />;
  } else if (theme === 'dark') {
    ThemeIcon = <Moon className="h-5 w-5" />;
  }

  return (
    <ThemeContext.Provider value={{ theme, activeTheme, setTheme, toggleTheme, ThemeIcon }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
