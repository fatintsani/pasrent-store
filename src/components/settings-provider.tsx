"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type FontSize = "sm" | "md" | "lg";
type FontFamily = "jakarta" | "poppins" | "inter" | "roboto" | "outfit";
type Language = "id" | "en";

interface SettingsState {
  readingMode: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  fontFamily: FontFamily;
  language: Language;
}

interface SettingsContextType extends SettingsState {
  setReadingMode: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
  setFontSize: (val: FontSize) => void;
  setFontFamily: (val: FontFamily) => void;
  setLanguage: (val: Language) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean) => void;
}

const defaultState: SettingsState = {
  readingMode: false,
  highContrast: false,
  fontSize: "md",
  fontFamily: "jakarta",
  language: "id",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SettingsState>(defaultState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("app-settings");
      if (stored) {
        setState({ ...defaultState, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error("Failed to parse settings from local storage");
    }
    setMounted(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("app-settings", JSON.stringify(state));
    }
  }, [state, mounted]);

  // Apply classes to HTML tag
  useEffect(() => {
    if (!mounted) return;

    const html = document.documentElement;
    
    // Reading mode
    if (state.readingMode) {
      html.classList.add("reading-mode");
    } else {
      html.classList.remove("reading-mode");
    }

    // High contrast
    if (state.highContrast) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // Font size
    html.classList.remove("font-size-sm", "font-size-md", "font-size-lg");
    html.classList.add(`font-size-${state.fontSize}`);

    // Font family
    html.classList.remove(
      "font-family-jakarta",
      "font-family-poppins",
      "font-family-inter",
      "font-family-roboto",
      "font-family-outfit"
    );
    html.classList.add(`font-family-${state.fontFamily}`);
  }, [state, mounted]);

  const updateState = (updates: Partial<SettingsState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const contextValue: SettingsContextType = {
    ...state,
    setReadingMode: (val) => updateState({ readingMode: val }),
    setHighContrast: (val) => updateState({ highContrast: val }),
    setFontSize: (val) => updateState({ fontSize: val }),
    setFontFamily: (val) => updateState({ fontFamily: val }),
    setLanguage: (val) => updateState({ language: val }),
    isSettingsOpen,
    setIsSettingsOpen,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
