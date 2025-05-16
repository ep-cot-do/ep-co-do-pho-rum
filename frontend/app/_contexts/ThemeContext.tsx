"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setSystemTheme: () => void;
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use null as initial state to indicate "not determined yet"
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Function to get system theme preference
  const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  // Initial theme setup - runs only once on component mount
  useEffect(() => {
    // Immediately apply stored theme or system preference before first render
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const useSystemTheme = localStorage.getItem("useSystemTheme") !== "false";

    if (storedTheme && !useSystemTheme) {
      // User has explicit preference
      setIsSystemTheme(false);
      applyTheme(storedTheme);
    } else {
      // Use system preference
      setIsSystemTheme(true);
      applyTheme(getSystemTheme());
    }

    // Set up listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (isSystemTheme) {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Update theme when isSystemTheme changes
  useEffect(() => {
    if (isSystemTheme && theme !== null) {
      applyTheme(getSystemTheme());
    }
  }, [isSystemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setIsSystemTheme(false);
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("useSystemTheme", "false");
    applyTheme(newTheme);
  };

  const setSystemTheme = () => {
    setIsSystemTheme(true);
    localStorage.setItem("useSystemTheme", "true");
    localStorage.removeItem("theme");
    applyTheme(getSystemTheme());
  };

  // Don't render until theme is determined
  if (theme === null) {
    return null; // Or a loading spinner if needed
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
